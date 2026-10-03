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
let sawEnv = false, linksGenerated = false;
for (const candidate of envCandidates) {
  if (!existsSync(candidate)) continue;
  sawEnv = true;
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
    linksGenerated = true;
  } catch (e) {
    log(`links failed: ${String(e.message).split(String.fromCharCode(10))[0]}`);
  }
  break;
}

// State-based check, NOT key-based. The original logic reported PENDING purely
// because STRIPE_SECRET_KEY was absent, which is wrong: once links exist in the
// catalog they do NOT need regenerating on every run, and this repo's .env.local
// is a Vercel-injected build dump that never contains the key. That made the job
// cry wolf forever on an already-complete goal. Verify the real catalog instead:
// are per-book links already wired in?
function auditLinks() {
  const paths = [resolve(root, "src/data/books.json"), resolve(root, "public/books.json")];
  for (const p of paths) {
    if (!existsSync(p)) continue;
    try {
      const parsed = JSON.parse(readFileSync(p, "utf8"));
      const books = Array.isArray(parsed) ? parsed : (parsed.books || []);
      if (!books.length) continue;
      const perBook = books.filter(
        (b) => b && typeof b.stripeUrl === "string" && /buy\.stripe\.com/.test(b.stripeUrl)
      ).length;
      if (perBook === books.length) {
        log(`OK: all ${books.length} books already carry per-book buy.stripe.com links (${basename(p)}) - nothing to regenerate`);
        return true;
      }
      log(`audit ${basename(p)}: ${perBook}/${books.length} books have per-book links - regeneration required`);
    } catch (e) {
      log(`audit ${basename(p)} skipped: ${String(e.message).split(String.fromCharCode(10))[0]}`);
    }
  }
  return false;
}

const catalogComplete = auditLinks();

// Only complain when the goal is genuinely unmet. A missing key plus a complete
// catalog is success, not a blocker.
if (!linksGenerated && !catalogComplete) {
  log(sawEnv
    ? "PENDING: env file present but no usable STRIPE_SECRET_KEY (sk_live_*) - per-book links NOT generated"
    : "PENDING: no .env/.env.local found - per-book Stripe links NOT generated");
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
  // Push when there is ANYTHING unpushed, not only when this run just made a
  // commit. Gating on `committed` meant any commit created by another tool
  // (or by a run whose only change was already committed) stayed local forever.
  const ahead = safeGit(`rev-list --count origin/${b}..HEAD`, '0').trim();
  const pending = committed || (Number(ahead) > 0);
  if (pending) {
    // safeGit() swallows failures and returns "", so it can NEVER confirm a
    // successful push. Use git() directly so a failure is not reported as done.
    let ok = false;
    try { git(`push origin ${b}`); ok = true; }
    catch (e) { log(`push FAILED: ${e.message}`); }
    if (ok) log(`pushed (HEAD ahead by ${ahead} commit(s))`);
  } else {
        log('ℹ nothing to push — already up to date');
  }
} catch (e) { log(`⚠ push section error: ${e.message}`); }
log('done.');
