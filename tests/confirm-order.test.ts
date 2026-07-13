import { describe, it, expect, vi, beforeEach } from 'vitest';
import { default as handler } from '../api/confirm-order';

process.env.COMPOSIO_API_KEY = 'ak_test';
process.env.GMAIL_ACCOUNT = 'ca_x';
process.env.SELLER_EMAIL = 'seller@x.com';

// نستخدم الكتب الحقيقية (handler يقرأ books.json مباشرة).
// نضبط gumroadUrl حقيقي لكتاب واحد عبر تعديل الملف مؤقتًا في beforeEach.
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

  it('يرسل تأكيدًا ويرجع ok عند بيانات صحيحة', async () => {
    const res = mkRes();
    await handler(
      { method: 'POST', body: { email: 'a@b.com', slug: 'the-influential-leader' } } as any,
      res as any,
    );
    expect(res._code).toBe(200);
    expect(res._json.ok).toBe(true);
    const decoded = Buffer.from(sent[0].body.raw, 'base64url').toString('utf8');
    expect(decoded).toContain('القائد المؤثر');
    expect(decoded).toContain('a@b.com');
  });

  it('يرفض الطلب بغير POST', async () => {
    const res = mkRes();
    await handler({ method: 'GET' } as any, res as any);
    expect(res._code).toBe(405);
  });

  it('يرفض الإيميل غير الصالح', async () => {
    const res = mkRes();
    await handler(
      { method: 'POST', body: { email: 'not-an-email', slug: 'the-influential-leader' } } as any,
      res as any,
    );
    expect(res._code).toBe(400);
  });

  it('يرجع 404 لكتاب غير موجود', async () => {
    const res = mkRes();
    await handler(
      { method: 'POST', body: { email: 'a@b.com', slug: 'nope' } } as any,
      res as any,
    );
    expect(res._code).toBe(404);
  });

  it('يرجع 500 بلا مفتاح Composio', async () => {
    process.env.COMPOSIO_API_KEY = '';
    const res = mkRes();
    await handler(
      { method: 'POST', body: { email: 'a@b.com', slug: 'the-influential-leader' } } as any,
      res as any,
    );
    process.env.COMPOSIO_API_KEY = 'ak_test';
    expect(res._code).toBe(500);
  });

  it('يستخدم رابط Gumroad الحقيقي إن وُجد', async () => {
    // نعدّل public/books.json مؤقتًا (الـ API يقرأ منه فعليًا)
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
      fs.writeFileSync(file, original); // ارجع الملف كما كان
    }
  });
});
