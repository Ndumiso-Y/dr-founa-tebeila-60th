# Deployment notes

| Item | Value |
|---|---|
| Repository | https://github.com/Ndumiso-Y/dr-founa-tebeila-60th |
| Public site (GitHub Pages) | https://ndumiso-y.github.io/dr-founa-tebeila-60th/ |
| Repository owner | Ndumiso-Y (personal account) |
| Visibility | Public |
| Default branch | `main` |
| Pages deployment method | Deploy from a branch: `main`, folder `/ (root)` |
| Project base path | `/dr-founa-tebeila-60th/` |
| Local repository | `D:\Digital Agency\Refodile Health Centre\Dr Founa Tebeila 60th Birthday - Web Presentation\06_WEBSITE` |
| Hosting provider | GitHub Pages only |

## Current status

Placeholder only (set up 2026-09-19). `index.html` and `styles.css` show a minimal holding page: "Dr Founa Tebeila", "60", "A Celebration in Shades of Green". Colours and fonts come from `00_REFERENCES/EVENT_WEBSITE/visual-identity-notes.txt` (cream `#FFF1E7`, forest `#0A241E`, mid green `#1B5F50`, sage `#849D75`; Playfair Display + DM Sans).

The final presentation (fullscreen 16:9, auto-looping) has **not** been started.

## Reminders for the final build

1. **Base path.** The site is served from a sub-path, not the domain root. Every asset URL must work under `/dr-founa-tebeila-60th/`. Use relative paths, or configure the framework's base path. Absolute paths like `/images/x.jpg` will 404.
2. **If Vite is used**, set in `vite.config.*`:
   ```js
   export default defineConfig({ base: '/dr-founa-tebeila-60th/' })
   ```
   unless the deployment architecture is intentionally changed (e.g. a custom domain at root, which would need `base: '/'`).
3. **Build output.** Branch/root deployment serves the files as committed. A Vite build produces `dist/`, so when switching, either move Pages to **GitHub Actions** as the source (official `actions/deploy-pages` workflow) or publish the built output deliberately. Update this file when that changes.
4. **Assets.** Only commit selected, web-optimised images (resized, compressed, stripped of metadata). Never commit anything from `01_ORIGINAL_PHOTOS`, `02_WORKING_PHOTOS`, raw Drive/WhatsApp downloads, archive scans, raw video, ZIPs, inventories or manifests. `.gitignore` blocks the common cases, but check `git status` before each commit.
5. **Keep separate.** The asset-management workflow (FT IDs, `photo-inventory.csv`, manifests) lives outside this repository and must not be modified from here.

## Prototype (2026-09-19)

The live three-screen design prototype is served at
`/prototype.html` → https://ndumiso-y.github.io/dr-founa-tebeila-60th/prototype.html
while the root holding page stays unchanged. Static architecture (no build
step): `assets/css/` tokens + stage + scenes, `assets/js/` stage scaler +
deck engine, self-hosted woff2 fonts in `assets/fonts/`, and only the four
prototype photographs (web derivatives, canonical FT IDs) in `assets/img/`.
See IMPLEMENTATION_STATUS.md for details and remaining work. Pages
deployment method unchanged (branch `main`, root).

## Full presentation (2026-09-19)

The complete 11-movement presentation is served at
`/presentation.html` → https://ndumiso-y.github.io/dr-founa-tebeila-60th/presentation.html

- The root holding page (`index.html`, `styles.css`) is **still unchanged**.
  Replacing it is the final launch gate (after human review, loop QA and the
  backup video) and has not been authorised.
- `/prototype.html` stays as the approved visual reference.
- Still static, no build step, relative URLs only, nothing loaded from
  outside the repository (no CDNs, no Google Fonts, no Drive).
- `assets/img/` now holds the 102 selected web derivatives (~31 MB total,
  JPEG q83, ≤2400 px, metadata stripped). Nothing from the masters or the
  working library is committed.
- **`.gitignore` trap:** the asset-safety rule `*manifest*` silently hides any
  file with "manifest" in its name. The scene data therefore lives in
  `assets/js/sequence.js`. Before every commit run
  `git status --porcelain --ignored` and confirm no site file is ignored.
- Event-day use: open `/presentation.html`, click once (or press `F`) for
  fullscreen. It starts by itself and loops forever; after the first loop
  every photograph is already in the page, so a Wi-Fi drop does not stop it.
