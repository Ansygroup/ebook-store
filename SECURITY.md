# 🔐 Exposed Keys Rotation — Status & Next Steps

## Exposed in conversation
During the project build, these keys appeared in chat text (exposed to the LLM model):
- Vercel token (old)
- Composio API key
- GitHub OAuth token (`gho_...`)

## What's done
| Key | Status | Required action |
|---|---|---|
| **Vercel token** | ❌ currently broken | **Manual**: go to https://vercel.com/account/tokens → delete all → create a new token with team `team_jsDd0T7iHZ26E6GhomgOxE4T` → save to `~/.hermes/vercel_token` + update `VERCEL_TOKEN` repo secret |
| **GitHub OAuth** | ⏳ manual | go to https://github.com/settings/tokens → delete `gho_...` → create a PAT with `repo, workflow` → apply via `git credential` |
| **Composio key** | ⏳ manual | go to https://app.composio.dev/settings/api-keys → Rotate → update `~/.hermes/composio_key` |

## Post-rotation steps
1. Run: `node scripts/rotate-keys.mjs` (logs status)
2. Update GitHub Actions secrets: `python scripts/set-gh-secrets.py`
3. Push: `git push origin master` (CI will verify the deploy)

## ⚠️ Note
The live site **currently works** (last successful deploy: `4e1779f`) but **won't update** until the Vercel token is rotated manually.
