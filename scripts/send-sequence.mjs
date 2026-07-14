#!/usr/bin/env node
/**
 * send-sequence.mjs — dispatches the staged welcome email sequence via Composio (Gmail).
 *
 * ⚠️ MANUAL SETUP REQUIRED before running:
 *   1) Identify your Gmail connected account id on Composio and set GMAIL_ACCOUNT below
 *      (the default ca_BmQnzbsU5u3T is from SETUP.md — verify it is Gmail).
 *   2) Composio API key must be in ~/.hermes/composio_key (or COMPOSIO_API_KEY env).
 *   3) This actually SENDS email — review marketing/sequence.json first.
 *
 * Usage: node scripts/send-sequence.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const KEY = process.env.COMPOSIO_API_KEY || readFileSync(resolve(process.env.HOME || process.env.USERPROFILE, '.hermes/composio_key'), 'utf8').trim();
const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT || 'ca_BmQnzbsU5u3T'; // TODO: verify this is Gmail
const SELLER_EMAIL = process.env.SELLER_EMAIL || 'sales@ebook-store.dev';

const seq = JSON.parse(readFileSync(resolve(root, 'marketing/sequence.json'), 'utf8'));

console.log(`Will send ${seq.length} emails via Composio Gmail (${GMAIL_ACCOUNT}).`);
console.log('DRY RUN — set SEND=1 to actually dispatch.');

for (const [i, email] of seq.entries()) {
  if (process.env.SEND !== '1') {
    console.log(`  [${i + 1}] (dry) "${email.subject}"`);
    continue;
  }
  const body = {
    connected_account_id: GMAIL_ACCOUNT,
    input: {
      to: ['{{subscriber_email}}'], // replaced per-recipient by your sender
      subject: email.subject,
      body: email.body,
      from: SELLER_EMAIL,
    },
  };
  const res = await fetch('https://backend.composio.dev/api/v3/actions/gmail_send_email/execute', {
    method: 'POST',
    headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  console.log(`  [${i + 1}] ${res.ok ? 'sent' : 'FAILED ' + res.status} — "${email.subject}"`);
}
