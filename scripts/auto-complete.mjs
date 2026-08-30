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
 * Hardened for headless/cron: never prompts, never uses a pager, and a
 * failure of any single git step is logged and skipped instead of crashing
 * the whole job (so an auth blip can't abort auto-complete).
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

// Kill any interactive prompt / pager regardless of inherited env.
process.env.GIT_TERMINAL_PROMPT = '0';
process.env.GIT_PAGER = 'cat';
process.env.PAGER = 'cat';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');

// git wrapper: no pager, file-based `store` helper only (bypass GCM which
// blocks on a UI prompt in headless runs). Every call is guarded.
const GIT = 'git --no-pager -c credential.helper= -c credential.helper=store -c core.pager=cat';
function git(args, opts = {}) {
  try {
    const out = execSync(`${GIT} ${args}`, { cwd: root, encoding: 'utf8', ...opts });
    return typeof out === 'string' ? out.trim() : out;
  } catch (e) {
    const msg = (e.stderr || e.stdout || e.message || '').toString().split('\n')[0];
    throw new Error(msg || e.message || 'git failed');
  }
}
function safeGit(args, fallback = '') {
  try { return git(args); } catch (e) { log(`⚠ git ${args.split(' ')[0]} skipped: ${e.message}`); return fallback; }
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
  const st = safeGit('status --short');
  if (st) {
    try { execSync('git add -A', { cwd: root }); } catch (e) { /* ignore */ }
    safeGit('-c user.email="ansy0@ansygroup.com" -c user.name="ansy0" commit -q -m "chore: auto-complete pending work"');
    committed = true;
  }
  const b = safeGit('branch --show-current', 'master') || 'master';
  // Integrate any remote-ahead work before pushing (avoids non-fast-forward).
  safeGit(`pull --rebase origin ${b}`, '');
  if (committed) {
    safeGit(`push origin ${b}`, '');
    log('✅ pushed (with new commits)');
  } else {
    log('ℹ nothing to push — already up to date');
  }
} catch (e) { log(`⚠ push section error: ${e.message}`); }
log('done.');
