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
  cpSync(SCRIPT, join(dir, 'scripts', 'gen-stripe-links.mjs'));
  writeFileSync(
    join(dir, 'public', 'books.json'),
    JSON.stringify([
      { slug: 'alpha-book', title: 'Alpha Book', price: 19.99 },
      { slug: 'beta-book', title: 'Beta Book', price: 9.99 },
    ]),
  );
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
    const books = JSON.parse(readFileSync(join(dir, 'public', 'books.json'), 'utf8'));
    expect(books[0].stripeUrl).toMatch(/plink_/);
    expect(books[1].stripeUrl).toMatch(/plink_/);
    expect(books[0].stripeUrl).not.toBe(books[1].stripeUrl);
  });

  it('idempotent: books that already have a per-book link are skipped with no API calls', () => {
    run();
    const first = readCalls().length;
    run();
    expect(readCalls().length).toBe(first);
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
