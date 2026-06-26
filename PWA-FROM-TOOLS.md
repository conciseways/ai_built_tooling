# Reference: Making a PWA from a `tools/` folder

This repo is a monorepo (Lerna + npm workspaces). Reusable libraries live in `packages/`, while user-facing apps/PWAs are often prototyped in `tools/` and then deployed.

## The pattern we use

1. **Build the tool in `tools/<tool-name>`** (e.g. `tools/playing-cards`).
2. **If it becomes reusable, promote it to a package:**
   - Move/copy it to `packages/<tool-name>`.
   - Give it a `package.json`.
   - Optionally extract its git history into its own repo.
3. **Keep the PWA in `tools/<app-name>`** (e.g. `tools/index.html` + `card-adder/`, etc.).
4. **For deployment, the PWA folder must be self-contained** because GitHub Pages deploys only one folder. The package can be:
   - Copied into the PWA folder as a build step, or
   - Used as a git subtree, or
   - Kept as a vendored copy.

## Case study: Math Card Games (what we actually did)

### Final layout

```
/packages/playing-cards/     ← canonical package + own repo (step 2 below)
/tools/
  index.html                 ← hub
  manifest.json
  service-worker.js
  pwa.js
  icons/
  card-adder/                ← game
  card-subtract/             ← game
  higher-card/               ← game
  playing-cards/             ← vendored copy, ignored by git
```

### Step 1 — Move directory into packages and add package.json

```bash
git mv tools/playing-cards packages/playing-cards
```

Created `packages/playing-cards/package.json`:

```json
{
  "name": "@conciseways/playing-cards",
  "version": "1.0.0",
  "description": "Reusable playing card deck, rendering, and CSS",
  "main": "deck.js",
  "type": "module",
  "files": ["deck.js", "render.js", "faces.js", "suits.js", "cards.css", "index.html", "test.html", "README.md"],
  "license": "MIT"
}
```

### Step 2 — Extract to its own repo (optional, do this once)

```bash
cd ..                          # out of ai_built_tooling
mkdir playing-cards
cd playing-cards
git init
git remote add origin https://github.com/<you>/playing-cards.git
git pull ../ai_built_tooling packages/playing-cards:main
# or, if you want full history: git subtree split -P packages/playing-cards -b pc-repo && git pull ../ai_built_tooling pc-repo:main
git push -u origin main
```

Then add it back to the monorepo as a subtree so the package stays linked:

```bash
cd ../ai_built_tooling
rm -rf packages/playing-cards
git commit -am "remove playing-cards package before subtree add"
git subtree add --prefix=packages/playing-cards https://github.com/<you>/playing-cards.git main
```

### Step 3 — Keep a vendored copy in tools/

Because GitHub Pages deploys only the `tools/` folder (see `.github/workflows/deploy-pages.yml`), the live site cannot read `../packages/playing-cards`. We sync the package into `tools/playing-cards` before deploy and ignore that copy in git.

Files created:

- `scripts/sync-playing-cards.js` — copies `packages/playing-cards` → `tools/playing-cards`.
- `.gitignore` — ignores `/tools/playing-cards`.
- `package.json` — adds `npm run sync:playing-cards`.
- `.github/workflows/deploy-pages.yml` — runs the sync before uploading the site.

Run locally after each package change:

```bash
npm run sync:playing-cards
```

The PWA game imports stay the same (`../playing-cards/...`) because the copy lives at the same path as before.

### Step 4 — Deploy

Push to `main`. The GitHub Actions workflow:

1. Checks out the repo.
2. Runs `node scripts/sync-playing-cards.js`.
3. Uploads `tools/` (now containing the fresh `playing-cards` copy) to Pages.

Live URL: `https://<you>.github.io/ai_built_tooling/`.

## One-time migration checklist

- [x] Move `tools/playing-cards` → `packages/playing-cards` and add `package.json`.
- [ ] Extract to its own repo (optional, requires your GitHub credentials).
- [ ] Add back to monorepo via subtree (optional).
- [x] Sync vendored copy into `tools/playing-cards`.
- [x] Add `.gitignore` for the vendored copy.
- [x] Update `.github/workflows/deploy-pages.yml` with sync step.
- [x] Add `npm run sync:playing-cards` script.
- [ ] Test locally with `python -m http.server 8000` → `http://localhost:8000/tools/`.
- [ ] Test the live PWA and verify the install prompt.

## How users install the PWA

- **Android / desktop Chrome:** open the live URL → tap "Add to Home screen" or the hub's install button.
- **iOS / iPad:** open the live URL in Safari → Share → Add to Home Screen.

Remember: after moving files, generate the PNG icons at `<live-url>/icons/icon-generator.html` and commit them to `tools/icons/` for the best iOS experience.
