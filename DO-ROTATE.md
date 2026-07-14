# 🔐 Manual Rotation Steps (do these yourself — automation can't)

Every rotation touches external dashboards (not reachable via API). This guide is in **ready-to-paste command** form — follow each step.

---

## 1️⃣ Vercel token (unfreezes the primary site + API functions)
1. Go to https://vercel.com/account/tokens
2. Delete **all** existing tokens
3. Create a **new token** (make sure it belongs to team `ansygroups-projects` — not personal)
4. Paste this command (replace `XXXX` with the token):
```bash
cd /d/ebook-store && VERCEL_TOKEN=XXXX node scripts/apply-vercel-token.mjs
```
This updates the file + GitHub secret + runs a test deploy. The site returns to:
`https://ebook-store-ansygroups-projects.vercel.app`

⚠️ **Important**: after rotating the token you must redeploy so the API functions
(confirm-order/subscribe) ship — the current code has referer-guard fixes. Without a
redeploy, the API rejects valid requests (`Forbidden`) because the function is frozen on an old build.

---

## 2️⃣ GitHub OAuth token (`gho_`)
1. Go to https://github.com/settings/tokens
2. Delete the leaked token
3. Create a **new PAT** (scope: `repo`, `workflow`)
4. Update git credential:
```bash
printf "protocol=https\nhost=github.com\nusername=Ansygroup\npassword=XXXX\n" | git credential approve
```

---

## 3️⃣ Composio API key
1. Go to https://app.composio.dev → Settings → API Keys
2. Delete the leaked key
3. Create a **new key**
4. Update the file:
```bash
echo "XXXX" > ~/.hermes/composio_key
```
5. Update the GitHub secret (via the script after updating the file):
```bash
cd /d/ebook-store && python scripts/set-gh-secrets.py
```

⚠️ **Composio accounts (from memory — may differ from code):**
- `ca_ru-ZbwXlFsGQ` = **Gumroad ACTIVE** (sell / order confirmation)
- `ca_d461BvmxN65-` = **IG STALE** (dead — link a new IG in step 5)
- `ca_BmQnzbsU5u3T` = **GMAIL placeholder** (used as fallback in `api/confirm-order.ts` + `scripts/order_confirm.mjs` — replace with a real `GMAIL_ACCOUNT` env)

---

## 4️⃣ Gumroad product links
1. Go to https://app.gumroad.com/products → New product for each book
2. Copy each product link (e.g. `https://gumroad.com/l/abc123`)
3. Create `gumroad-links.json`:
```json
{
  "the-influential-leader": "https://gumroad.com/l/XXX",
  "build-your-empire": "https://gumroad.com/l/XXX"
}
```
4. Run:
```bash
cd /d/ebook-store && node scripts/fill-gumroad.mjs && git add -A && git commit -m "feat: real Gumroad links" && git push
```

---

## 5️⃣ Connect Instagram (enables auto-posting)
1. Go to https://app.composio.dev → Connected Accounts → Add → Instagram
2. Link the @dar_alma3rifa account
3. Test posting:
```bash
cd /d/ebook-store && node scripts/ig-prepare.mjs
```
The post is staged in `ig-queue/` — or add a Composio post step to cron `f3d80ba9beeb`.

---

## ✅ After rotation
- The primary (Vercel) site talks again
- All leaked keys are swapped
- Gumroad actually sells
- IG posts automatically
