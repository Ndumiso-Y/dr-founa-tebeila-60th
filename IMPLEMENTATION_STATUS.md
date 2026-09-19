# Implementation status — live three-screen prototype

Updated: 2026-09-19 (prototype stage).

## What exists now
| Item | Value |
|---|---|
| Stage | LIVE THREE-SCREEN PROTOTYPE (human visual gate) |
| Prototype URL | https://ndumiso-y.github.io/dr-founa-tebeila-60th/prototype.html |
| Root holding page | UNCHANGED — https://ndumiso-y.github.io/dr-founa-tebeila-60th/ |
| Pages method | Deploy from branch `main`, folder `/ (root)` (unchanged) |
| Base-path handling | All URLs relative — safe under `/dr-founa-tebeila-60th/` |
| Build step | None (static). No Vite yet; if adopted later, `base: '/dr-founa-tebeila-60th/'` per DEPLOYMENT_NOTES.md |
| Runtime dependencies | None. Fonts self-hosted (woff2, vendored from @fontsource); no CDNs, no frameworks |

## Architecture (seed of the final deck — not disposable)
```
prototype.html          three scenes on the shared stage
assets/css/tokens.css   colour / typography / motion / stage tokens (Design Constitution)
assets/css/stage.css    16:9 stage scaler (1920x1080 logical canvas, forest letterbox)
assets/css/scenes.css   scene compositions (archetypes: hero split, archival pair, full-bleed)
assets/js/stage.js      uniform-fit scaling
assets/js/deck.js       scene engine (activation model; gains timeline/autoplay/loop in full build)
assets/fonts/           Playfair Display 400/500 + DM Sans 400/500 (woff2)
assets/img/             prototype photographs only (web derivatives)
```

## Prototype photographs (canonical FT IDs; masters untouched)
| File | FT ID | Note |
|---|---|---|
| assets/img/ft-0274.jpg | FT-0274 | Screen 1 hero (studio, 1200×1800, q85, metadata stripped) |
| assets/img/ft-0155.jpg | FT-0155 | Screen 2 archival mount A (1239×1830, q85, scan geometry untouched; 10px CSS inset crop hides scanner margins) |
| assets/img/ft-0157.jpg | FT-0157 | Screen 2 archival mount B (1237×1842, q85, geometry untouched) |
| assets/img/ft-0197.jpg | FT-0197 | Screen 3 full-bleed — deliberate 16:9 art crop (2400×1350, q84) from the 6016×4016 working copy: full width, rows 240–3624 |
No patients, no rotated scans, no NEF, no raw library material in the repo.

## Verification (local, pre-push — 2026-09-19)
- Served statically (`py -m http.server`), driven with Playwright + Chrome.
- 1920×1080: all 14 requests 200, zero console messages, no page errors,
  no overflow (scrollWidth = clientWidth), all four woff2 fonts report
  `loaded` via `document.fonts`, images render at their native ratio.
- 1280×800: stage scales to 0.667 and letterboxes in forest (40px bars).
- `prefers-reduced-motion: reduce`: entrance transitions collapse to 1 ms,
  Screen 3 drift animation is removed.
- Keyboard ←/→ and the index labels both switch scenes; root `index.html`
  and `styles.css` are byte-for-byte unchanged (holding page verified).
- Review screenshots (authoritative, from this tree):
  `05_OUTPUTS\PROTOTYPE_REVIEW_WHITE_STUDIO.png`,
  `02_WEDDING_EDITORIAL.png`, `03_THE_WALL.png` (outside this repo).

## Screen 3 composition note
FT-0197's genuine negative space is the open stone field to the RIGHT of
the figure; the left third holds the arched niche and benches. Rendered
review showed left-placed type crossing the niche edge and the bench top,
so the type column (ghost "60", overline, two-line name, rule, date) sits
in the right stone field (x ≥ 1300), clear of her face and extended hand,
with a restrained forest multiply-grade deepening toward the right edge
to seat the cream type. The Wall vs White Studio decision remains open.

## Commits
- Starting SHA (foundation): 3f24bbce1a44d56e60ca491175dfc791cb02de1b
- Prototype commit: see git log (created after this file was added).

## Known constraints
- GitHub Pages serves committed files as-is; no build pipeline to break.
- FT-0274 source is 1200×1800 — comfortable at its 720px display column;
  do not enlarge beyond ~50% stage width.
- Screen 3 uses a pre-composed art crop; recropping means regenerating the
  derivative, not CSS object-position tweaks.
- Local preview: port 5173 may be held by an unrelated Vite dev server on
  this machine; any free port works (`py -m http.server 5174`).

## Remaining before full build (in order)
1. HUMAN SCREENSHOT REVIEW of the three screens (this gate).
2. ONE DESIGN CORRECTION PASS from that review.
3. HUMAN OPENING SELECTION (White Studio vs The Wall — undecided).
4. FULL 11-MOVEMENT BUILD: deck.js gains timeline/autoplay/preload/loop;
   ~40–44 scenes, ~95–110 photographs, 6:05–6:30 runtime; continuous
   Pages deployment; loop QA; video backup recording.

## Decisions still open
- Final opening: NOT selected (Screens 1 and 3 are live candidates).
- Root index.html replacement: NOT authorised until full build.
