/**
 * Test-only fetch stub, preloaded into the child process under test with
 * `node --import`. Records every Stripe call to the JSONL file named by
 * CALLS_FILE and returns synthetic ids so no network or real key is used.
 */
import { appendFileSync } from 'node:fs';

const CALLS_FILE = process.env.CALLS_FILE;
let counter = 0;

globalThis.fetch = async (url, opts = {}) => {
  const href = String(url);
  const body = new URLSearchParams(opts?.body ?? '');
  if (CALLS_FILE) {
    appendFileSync(CALLS_FILE, JSON.stringify({ url: href, body: body.toString() }) + '\n');
  }
  const n = ++counter;
  if (href.endsWith('/v1/prices')) {
    return { json: async () => ({ id: `price_${n}` }) };
  }
  if (href.endsWith('/v1/payment_links')) {
    return { json: async () => ({ id: `plink_${n}`, url: `https://buy.stripe.com/plink_${n}` }) };
  }
  return { json: async () => ({ id: `obj_${n}` }) };
};
