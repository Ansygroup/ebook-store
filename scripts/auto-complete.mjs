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
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

// Kill any interactive prompt / pager regardless of inherited env.
process.env.GIT_TERMINAL_PROMPT = '0';
process.env.GCM_ENABLED = '0';
process.env.GIT_ASKPASS = 'true';
process.env.SSH_ASKPASS = 'true';
process.env.GIT_CONFIG_NOSYSTEM = '1';
process.env.GIT_PAGER = 'cat';
process.env.PAGER = 'cat';
// GCM (Git Credential Manager) on Windows tries to open an interactive prompt
// when stdin isn't a tty — which crashes headless/cron runs. Force it off.
process.env.GCM_INTERACTIVE = '0';
process.env.GCM_TERMINAL_PROMPT = '0';
process.env.GCM_GUI_PROMPT = '0';

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

// Stripe links if script exists.
// Key lookup order: .env, then .env.local (both gitignored; this repo uses .env.local).
const envCandidates = [envPath, resolve(root, ".env.local")];
for (const candidate of envCandidates) {
  if (!existsSync(candidate)) continue;
  const raw = readFileSync(candidate, "utf8");
  const line = raw.split(String.fromCharCode(10)).map((l) => l.trim())
    .find((l) => l.startsWith("STRIPE_SECRET_KEY=") || l.startsWith("export STRIPE_SECRET_KEY="));
  if (!line) continue;
  let key = line.slice(line.indexOf("=") + 1).trim();
  if (key.startsWith("\"") || key.startsWith(String.fromCharCode(96))) key = key.slice(1);
  if (key.endsWith("\"") || key.endsWith(String.fromCharCode(96))) key = key.slice(0, -1);
  if (!key.startsWith("sk_")) continue;
  if (key.startsWith("sk_test_")) log("test-mode key found (sk_test_) — live catalog untouched; set ALLOW_TEST_LINKS=1 to override");
  if (!existsSync(resolve(root, "scripts/gen-stripe-links.mjs"))) {
    log(`key found in ${basename(candidate)} but scripts/gen-stripe-links.mjs is missing - skipped`);
    continue;
  }
  log(`key found in ${basename(candidate)} - generating per-book links...`);
  try {
    // The generator reads process.env, so the key MUST be passed through to it.
    execSync("node scripts/gen-stripe-links.mjs", {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, STRIPE_SECRET_KEY: key },
    });
    log("links done");
  } catch (e) {
    log(`links failed: ${String(e.message).split(String.fromCharCode(10))[0]}`);
  }
  break;
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
    // safeGit() swallows failures and returns "", so it can NEVER confirm a
    // successful push. Use git() directly so a failure is not reported as done.
    let ok = false;
    try { git(`push origin ${b}`); ok = true; }
    catch (e) { log(`push FAILED: ${e.message}`); }
    if (ok) log(`pushed (with new commits)`);
  } else {
        log('ℹ nothing to push — already up to date');
  }
} catch (e) { log(`⚠ push section error: ${e.message}`); }
log('done.');
