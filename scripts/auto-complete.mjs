#!/usr/bin/env node
/**
 * generic-auto-complete.mjs — self-completing workflow for any repo.
 * Runs on cron. Checks for available credentials and finishes pending work:
 *   - .env with STRIPE_SECRET_KEY → runs `npm run stripe:links` if present
 *   - git remote reachable        → commit + push pending work
 * Idempotent and prompt-free.
 *
 * Usage: node generic-auto-complete.mjs   (run inside the target repo)
 *
 * NOTE: git ops force the `store` credential helper and skip GCM (`manager`),
 * because on headless/cron runs GCM blocks on a UI prompt for the write scope
 * and the push hangs forever. We also pull --rebase before push so a remote
 * that is ahead does not cause a non-fast-forward rejection.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
process.env.GIT_TERMINAL_PROMPT = '0';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

// git wrapper that bypasses GCM and uses only the file-based `store` helper.
const GIT = 'git -c credential.helper= -c credential.helper=store';
function git(args, opts = {}) {
  const out = execSync(`${GIT} ${args}`, { cwd: root, encoding: 'utf8', ...opts });
  return typeof out === 'string' ? out.trim() : out;
}

function log(m) { console.log(`[auto ${new Date().toISOString()}] ${m}`); }

// Stripe links if script exists
if (existsSync(envPath)) {
  const env = readFileSync(envPath, 'utf8');
  const m = env.match(/STRIPE_SECRET_KEY=(\S+)/);
  if (m && m[1] && m[1].startsWith('sk_') && existsSync(resolve(root, 'scripts/gen-stripe-links.mjs'))) {
    log('key + gen script found — generating links…');
    try { execSync('node scripts/gen-stripe-links.mjs', { cwd: root, stdio: 'inherit' }); log('✅ links done'); }
    catch (e) { log(`⚠ links failed: ${e.message}`); }
  }
}

// Git auto-push
try {
  let committed = false;
  const st = git('status --short');
  if (st) {
    execSync('git add -A', { cwd: root });
    git('-c user.email="ansy0@ansygroup.com" -c user.name="ansy0" commit -q -m "chore: auto-complete pending work"');
    committed = true;
  }
  const b = git('branch --show-current');
  // Integrate any remote-ahead work before pushing (avoids non-fast-forward).
  try { git(`pull --rebase origin ${b}`, { stdio: 'inherit' }); }
  catch (e) { log(`⚠ pull --rebase failed (continuing): ${e.message.split('\n')[0]}`); }
  // Actually push to remote — that is the whole point of auto-complete.
  if (committed) {
    git(`push origin ${b}`, { stdio: 'inherit' });
    log('✅ pushed (with new commits)');
  } else {
    log('ℹ nothing to push — already up to date');
  }
} catch (e) { log(`⚠ push skipped: ${e.message.split('\n')[0]}`); }
log('done.');
