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

## Case study: Math Card Games

### Current layout

```
/tools/
  index.html              ← hub
  manifest.json
  service-worker.js
  pwa.js
  icons/
  card-adder/             ← game
  card-subtract/          ← game
  higher-card/            ← game
  playing-cards/          ← shared library (to be promoted)
```

### Goal

Move `tools/playing-cards` to `packages/playing-cards` and make it its own repo, while keeping the Math Card Games PWA deployable from `tools/`.

### Recommended approach

1. **Move the directory and add `package.json`:**
   ```bash
   git mv tools/playing-cards packages/playing-cards
   cd packages/playing-cards
   ```
   Create a minimal `package.json`:
   ```json
   {
     "name": "@conciseways/playing-cards",
     "version": "1.0.0",
     "description": "Reusable playing card deck, rendering, and CSS",
     "main": "deck.js",
     "type": "module",
     "files": ["*.js", "*.css", "*.html"],
     "license": "MIT"
   }
   ```

2. **Extract its own repo (optional but recommended):**
   ```bash
   cd ../..                       # repo root
   git subtree split -P packages/playing-cards -b playing-cards-repo
   mkdir ../playing-cards         # or create remote repo on GitHub
   cd ../playing-cards
   git init
   git pull ../ai_built_tooling playing-cards-repo
   git remote add origin https://github.com/<you>/playing-cards.git
   git push -u origin main
   ```
   Then add it back to the monorepo as a subtree (or use a submodule if you prefer):
   ```bash
   cd ../ai_built_tooling
   rm -rf packages/playing-cards
   git subtree add --prefix=packages/playing-cards https://github.com/<you>/playing-cards.git main
   ```

3. **Wire the PWA locally via npm workspaces:**
   In `tools/package.json` (create one if needed), or add the dependency to each game's path:
   ```json
   { "dependencies": { "@conciseways/playing-cards": "*" } }
   ```
   Run `npm install` so workspaces create the symlink. Then update imports from:
   ```js
   import { ... } from '../playing-cards/deck.js';
   ```
   to:
   ```js
   import { ... } from '@conciseways/playing-cards/deck.js';
   ```
   Update CSS `<link>` paths similarly.

4. **Make `tools/` self-contained for GitHub Pages:**
   GitHub Pages deploys only the `tools/` folder (see `.github/workflows/deploy-pages.yml`). The package files outside `tools/` won't be available on the live site.

   Options:
   - **Option A — Vendored copy (simplest, no bundler):**
     Keep a copy of `packages/playing-cards` inside `tools/playing-cards`. After each package update, copy it:
     ```bash
     cp -r packages/playing-cards/* tools/playing-cards/
     ```
     The existing imports (`../playing-cards/...`) continue to work.
   - **Option B — Build step:**
     Add a script that copies the package into `tools/playing-cards` before deploy. Example `tools/copy-deps.js`:
     ```js
     import fs from 'fs';
     fs.cpSync('../packages/playing-cards', './playing-cards', { recursive: true, force: true });
     ```
     Run it in the GitHub Actions workflow before `upload-pages-artifact`.
   - **Option C — Move the PWA into a package:**
     Create `packages/math-card-games` and move the PWA files there. Deploy that package instead of `tools/`. This is cleaner long-term but is a bigger move.

5. **Update the service worker:**
   If `tools/playing-cards` is a copy, `service-worker.js` paths stay the same. If you change the path, update the `ASSETS` list.

6. **Deploy:**
   Push to `main`. The GitHub Actions workflow deploys the `tools/` folder to `https://<you>.github.io/ai_built_tooling/`.

## One-time migration checklist

- [ ] Move `tools/playing-cards` → `packages/playing-cards` and add `package.json`.
- [ ] Extract to its own repo (optional).
- [ ] Add back to monorepo via subtree/submodule/copy.
- [ ] Update PWA imports to use the package name or keep a vendored copy.
- [ ] Update `tools/PWA-README.md` if the deploy path changes.
- [ ] Update `.github/workflows/deploy-pages.yml` if a copy step is needed.
- [ ] Test locally with `python -m http.server 8000` → `http://localhost:8000/tools/`.
- [ ] Test the live PWA and verify the install prompt.

## How users install the PWA

- **Android / desktop Chrome:** open the live URL → tap "Add to Home screen" or the hub's install button.
- **iOS / iPad:** open the live URL in Safari → Share → Add to Home Screen.

Remember: after moving files, generate the PNG icons at `<live-url>/icons/icon-generator.html` and commit them to `tools/icons/` for the best iOS experience.
