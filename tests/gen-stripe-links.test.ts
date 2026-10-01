/**
 * gen-stripe-links Stripe API contract tests.
 *
 * Runs the REAL scripts/gen-stripe-links.mjs in an isolated temp repo (the
 * project's own public/books.json is never touched) with global fetch swapped
 * for tests/fetch-stub.mjs, then asserts on the exact Stripe calls made.
 *
 * Guards the request shape: a flat `product_data_name` is NOT a valid
 * prices.create parameter, so every generated price would be created without a
 * product attached and every payment link would ship with no title.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync,
} from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = resolve(HERE, '../scripts/gen-stripe-links.mjs');
const STUB = resolve(HERE, 'fetch-stub.mjs');

let dir: string;
let callsFile: string;

function readCalls(): { url: string; body: URLSearchParams }[] {
  if (!existsSync(callsFile)) return [];
  return readFileSync(callsFile, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const o = JSON.parse(line);
      return { url: o.url, body: new URLSearchParams(o.body) };
    });
}

// ALLOW_TEST_LINKS=1 is REQUIRED here: gen-stripe-links.mjs refuses sk_test_ keys
// unless that flag is set, because public/books.json is the LIVE catalog. These
// runs execute against a throwaway temp repo with a stubbed fetch, never the
// real catalog, so the opt-in is safe here — the gate gets its own tests below.
function run(env: Record<string, string> = { STRIPE_SECRET_KEY: 'sk_test_fake' }) {
  execFileSync(
    'node',
    ['--import', pathToFileURL(STUB).href, join(dir, 'scripts', 'gen-stripe-links.mjs')],
    { env: { ...process.env, CALLS_FILE: callsFile, ALLOW_TEST_LINKS: '1', ...env }, stdio: 'pipe' },
  );
}

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'gsl-'));
  callsFile = join(dir, 'calls.jsonl');
  mkdirSync(join(dir, 'scripts'), { recursive: true });
  mkdirSync(join(dir, 'public'), { recursive: true });
  mkdirSync(join(dir, 'src', 'data'), { recursive: true });
  cpSync(SCRIPT, join(dir, 'scripts', 'gen-stripe-links.mjs'));
  // src/data/books.json is the SOURCE OF TRUTH the script reads/writes;
  // public/books.json is the synced copy it also refreshes.
  const seed = JSON.stringify([
    { slug: 'alpha-book', title: 'Alpha Book', price: 19.99 },
    { slug: 'beta-book', title: 'Beta Book', price: 9.99 },
  ]);
  writeFileSync(join(dir, 'src', 'data', 'books.json'), seed);
  writeFileSync(join(dir, 'public', 'books.json'), seed);
});

afterEach(() => rmSync(dir, { recursive: true, force: true }));

const priceCalls = () => readCalls().filter((c) => c.url.endsWith('/v1/prices'));
const linkCalls = () => readCalls().filter((c) => c.url.endsWith('/v1/payment_links'));

describe('gen-stripe-links Stripe API contract', () => {
  it('REGRESSION: passes the product name as nested product_data[name], never flat product_data_name', () => {
    run();
    const prices = priceCalls();
    expect(prices).toHaveLength(2);
    for (const c of prices) {
      expect(c.body.get('product_data_name')).toBeNull();
      expect(c.body.get('product_data[name]')).toBeTruthy();
    }
    expect(prices.map((c) => c.body.get('product_data[name]'))).toEqual(['Alpha Book', 'Beta Book']);
  });

  it('sends unit_amount in cents and currency=usd', () => {
    run();
    const prices = priceCalls();
    expect(prices.map((c) => c.body.get('unit_amount'))).toEqual(['1999', '999']);
    expect(prices.every((c) => c.body.get('currency') === 'usd')).toBe(true);
  });

  it('creates one payment link per book and writes distinct URLs back to books.json', () => {
    run();
    expect(linkCalls()).toHaveLength(2);
    const books = JSON.parse(readFileSync(join(dir, 'src', 'data', 'books.json'), 'utf8'));
    expect(books[0].stripeUrl).toMatch(/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/);
    expect(books[1].stripeUrl).toMatch(/^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/);
    expect(books[0].stripeUrl).not.toBe(books[1].stripeUrl);
  });

  it('REGRESSION: writes links to src/data/books.json so the next build cannot wipe them', () => {
    // `npm run build` runs sync-books.mjs: src/data/books.json -> public/books.json.
    // If links were written only to public/, that copy step would silently destroy
    // every generated link on the very next build.
    run();
    const src = JSON.parse(readFileSync(join(dir, 'src', 'data', 'books.json'), 'utf8'));
    const pub = JSON.parse(readFileSync(join(dir, 'public', 'books.json'), 'utf8'));
    expect(src.every((b: any) => b.stripeUrl)).toBe(true);
    expect(pub).toEqual(src);
  });

  it('idempotent: books that already have a per-book link are skipped with no API calls', () => {
    run();
    const first = readCalls().length;
    run();
    expect(readCalls().length).toBe(first);
  });

  it('REGRESSION: real-shaped buy.stripe.com links are NOT treated as missing', () => {
    // The old guard was `stripeUrl.includes('plink_')`. Real Stripe Payment Link
    // URLs are https://buy.stripe.com/<token> and the token NEVER contains 'plink_'
    // (that is only the API object id), so against real data the guard never fired
    // and every cron run recreated all 15 links (30 new Stripe objects each time).
    // Seed genuinely per-book, distinct real-shaped links -> must make zero calls.
    const seed = [
      { slug: 'alpha-book', title: 'Alpha Book', price: 19.99, stripeUrl: 'https://buy.stripe.com/eVqdR9fIT1ED12I20g0Jq06' },
      { slug: 'beta-book', title: 'Beta Book', price: 9.99, stripeUrl: 'https://buy.stripe.com/a1B2c3d4e5' },
    ];
    writeFileSync(join(dir, 'src', 'data', 'books.json'), JSON.stringify(seed));
    writeFileSync(join(dir, 'public', 'books.json'), JSON.stringify(seed));
    run();
    expect(readCalls()).toHaveLength(0);
  });

  it('REGRESSION: a link SHARED by all books is legacy and gets replaced per-book', () => {
    // Today all 15 books point at one legacy catch-all link. A shared link is not a
    // per-book link, so it must be regenerated - exactly once, then become stable.
    const shared = 'https://buy.stripe.com/eVqdR9fIT1ED12I20g0Jq06';
    const seed = [
      { slug: 'alpha-book', title: 'Alpha Book', price: 19.99, stripeUrl: shared },
      { slug: 'beta-book', title: 'Beta Book', price: 9.99, stripeUrl: shared },
    ];
    writeFileSync(join(dir, 'src', 'data', 'books.json'), JSON.stringify(seed));
    writeFileSync(join(dir, 'public', 'books.json'), JSON.stringify(seed));
    run();
    expect(linkCalls()).toHaveLength(2);
    const books = JSON.parse(readFileSync(join(dir, 'src', 'data', 'books.json'), 'utf8'));
    expect(books[0].stripeUrl).not.toBe(shared);
    expect(books[1].stripeUrl).not.toBe(shared);
    expect(books[0].stripeUrl).not.toBe(books[1].stripeUrl);
    // ...and it must then be stable: a second run makes no further calls.
    const after = readCalls().length;
    run();
    expect(readCalls().length).toBe(after);
  });

  it('exits non-zero with a clear message when STRIPE_SECRET_KEY is absent', () => {
    expect(() => run({ STRIPE_SECRET_KEY: '' })).toThrow();
  });

  it('SAFETY GATE: refuses a test key (sk_test_) without ALLOW_TEST_LINKS and writes nothing', () => {
    expect(() =>
      execFileSync(
        'node',
        ['--import', pathToFileURL(STUB).href, join(dir, 'scripts', 'gen-stripe-links.mjs')],
        {
          env: {
            ...process.env,
            CALLS_FILE: callsFile,
            STRIPE_SECRET_KEY: 'sk_test_fake',
            ALLOW_TEST_LINKS: '',
          },
          stdio: 'pipe',
        },
      ),
    ).toThrow(/REFUSED/);
    expect(readCalls()).toHaveLength(0);
    const books = JSON.parse(readFileSync(join(dir, 'public', 'books.json'), 'utf8'));
    expect(books[0].stripeUrl).toBeUndefined();
  });

  it('SAFETY GATE: a live key (sk_live_) needs no opt-in', () => {
    run({ STRIPE_SECRET_KEY: 'sk_live_fake', ALLOW_TEST_LINKS: '' });
    expect(linkCalls()).toHaveLength(2);
  });
});
