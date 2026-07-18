import { describe, it, expect, vi, beforeEach } from 'vitest';
import { default as handler } from '../api/confirm-order';

process.env.COMPOSIO_API_KEY = 'ak_test';
process.env.GMAIL_ACCOUNT = 'ca_x';
process.env.SELLER_EMAIL = 'seller@x.com';

// Uses the real books data (handler reads public/books.json directly).
const REAL_BOOK_WITH_GUMROAD = 'build-your-empire';

const sent: any[] = [];
vi.stubGlobal(
  'fetch',
  vi.fn(async (_url: string, opts: any) => {
    sent.push(JSON.parse(opts.body));
    return { json: async () => ({ data: { id: 'msg-1', labelIds: ['SENT'] } }) };
  }),
);

function mkRes() {
  return {
    _code: 0,
    _json: null as any,
    status(c: number) {
      this._code = c;
      return this;
    },
    json(obj: any) {
      this._json = obj;
      return this;
    },
  };
}

describe('confirm-order API', () => {
  beforeEach(() => {
    sent.length = 0;
    process.env.COMPOSIO_API_KEY = 'ak_test';
  });

  it('sends confirmation and returns ok for valid data', async () => {
    const res = mkRes();
    await handler(
      { method: 'POST', body: { email: 'a@b.com', slug: 'the-influential-leader' } } as any,
      res as any,
    );
    expect(res._code).toBe(200);
    expect(res._json.ok).toBe(true);
    const decoded = Buffer.from(sent[0].body.raw, 'base64url').toString('utf8');
    expect(decoded).toContain('The Influential Leader');
    expect(decoded).toContain('a@b.com');
    expect(decoded).toContain('— The ANSY Team');
  });

  it('rejects non-POST methods', async () => {
    const res = mkRes();
    await handler({ method: 'GET' } as any, res as any);
    expect(res._code).toBe(405);
  });

  it('rejects invalid email', async () => {
    const res = mkRes();
    await handler(
      { method: 'POST', body: { email: 'not-an-email', slug: 'the-influential-leader' } } as any,
      res as any,
    );
    expect(res._code).toBe(400);
  });

  it('returns 404 for unknown book', async () => {
    const res = mkRes();
    await handler(
      { method: 'POST', body: { email: 'a@b.com', slug: 'nope' } } as any,
      res as any,
    );
    expect(res._code).toBe(404);
  });

  it('returns 500 without Composio key', async () => {
    process.env.COMPOSIO_API_KEY = '';
    const res = mkRes();
    await handler(
      { method: 'POST', body: { email: 'a@b.com', slug: 'the-influential-leader' } } as any,
      res as any,
    );
    process.env.COMPOSIO_API_KEY = 'ak_test';
    expect(res._code).toBe(500);
  });

  it('uses the real Gumroad link if present', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const file = path.join(process.cwd(), 'public/books.json');
    const original = fs.readFileSync(file, 'utf8');
    const arr = JSON.parse(original);
    const target = arr.find((b: any) => b.slug === REAL_BOOK_WITH_GUMROAD);
    target.gumroadUrl = 'https://gumroad.com/l/real-link';
    fs.writeFileSync(file, JSON.stringify(arr, null, 2));
    try {
      const res = mkRes();
      await handler(
        { method: 'POST', body: { email: 'a@b.com', slug: REAL_BOOK_WITH_GUMROAD } } as any,
        res as any,
      );
      const decoded = Buffer.from(sent[0].body.raw, 'base64url').toString('utf8');
      expect(decoded).toContain('https://gumroad.com/l/real-link');
    } finally {
      fs.writeFileSync(file, original); // restore
    }
  });

  it('rejects honeypot requests (bot)', async () => {
    const res = mkRes();
    await handler(
      { method: 'POST', body: { email: 'a@b.com', slug: 'the-influential-leader', honeypot: 'spam' } } as any,
      res as any,
    );
    expect(res._code).toBe(200); // silent success
    expect(res._json.ok).toBe(true);
    expect(sent.length).toBe(0); // no email sent
  });

  it('rejects requests from external origin', async () => {
    const res = mkRes();
    await handler(
      {
        method: 'POST',
        headers: { origin: 'https://evil.example' },
        body: { email: 'a@b.com', slug: 'the-influential-leader' },
      } as any,
      res as any,
    );
    expect(res._code).toBe(403);
  });

  it('enforces rate limit', async () => {
    let lastCode = 0;
    for (let i = 0; i < 7; i++) {
      const res = mkRes();
      await handler(
        { method: 'POST', body: { email: 'ratelimit@b.com', slug: 'the-influential-leader' } } as any,
        res as any,
      );
      lastCode = res._code;
    }
    // first 5 succeeded (200), rest 429
    expect([200, 429]).toContain(lastCode);
    expect(lastCode).toBe(429);
  });
});
