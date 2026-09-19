# Implementation status — full 11-movement presentation

Updated: 2026-09-19 (full build, awaiting human review).

## What exists now
| Item | Value |
|---|---|
| Stage | FULL PRESENTATION BUILT — next gate is the full-presentation human review |
| Presentation URL | https://ndumiso-y.github.io/dr-founa-tebeila-60th/presentation.html |
| Prototype URL (approved reference) | https://ndumiso-y.github.io/dr-founa-tebeila-60th/prototype.html |
| Root holding page | UNCHANGED — https://ndumiso-y.github.io/dr-founa-tebeila-60th/ |
| Sequence | 11 movements · 44 scenes · 102 photographs · 6:11.5 loop |
| Final opening | THE WALL (FT-0197), type on the right, "Dr Founa Tebeila" |
| Closing | FT-0056 (reserved for the closing only), dissolves back into The Wall |
| Pages method | Deploy from branch `main`, folder `/ (root)` (unchanged) |
| Build step | None (static). All URLs relative — safe under `/dr-founa-tebeila-60th/` |
| Runtime dependencies | None. Self-hosted woff2 fonts; no CDNs, no Google Fonts, no Drive |

## Architecture
```
presentation.html        empty 16:9 stage; everything is built from the sequence
prototype.html           the approved three-screen reference (unchanged behaviour)
assets/css/tokens.css    colour / type / motion tokens (Design Constitution)
assets/css/stage.css     1920x1080 logical stage, uniform scaling, forest letterbox
assets/css/scenes.css    the approved prototype compositions (.s1 Studio, .s2 Wedding, .s3 Wall)
assets/css/deck.css      full-build materials: canvases, mounts, type roles, entrances, seams
assets/js/stage.js       uniform-fit scaler
assets/js/sequence.js    THE SCENE MANIFEST — one entry per scene (see below)
assets/js/images.js      generated: pixel size of every derivative (layout keeps true ratios)
assets/js/deck.js        engine: prototype mode (no manifest) or timeline mode (manifest)
assets/img/ft-XXXX.jpg   102 web derivatives, named by canonical FT ID
tools/build_derivatives.py   working copy -> derivative (rotation, crop, resize) + images.js
tools/scene_report.js        audit table, runtime, photo count, duplicate/unused checks
```
The scene data file is called `sequence.js`, not `manifest.js`, because the
repository's asset-safety `.gitignore` ignores `*manifest*`.

### A scene entry
`id`, `mv` (movement), `layout` (archetype), `bg`, `dur` (ms — the scene's whole
slot, from the start of its entrance to the start of the next one), `tr`
(`fade` 0.9 s · `slow` 1.8 s · `wipe` colour-field chapter seam · `loop` 2 s),
`steps` (montage / numeral beats) and `items` — photographs (`M()` archival
mount, `P()` plain), type roles, rules — placed in design pixels. Geometry is
per scene on purpose: every scene is art-directed; nothing is a template slot.
The two approved prototype compositions (The Wall, Wedding Day) are reused
verbatim through their original classes.

### Engine behaviour (assets/js/deck.js)
- Starts by itself, advances by per-scene duration, loops forever.
- The incoming scene dissolves in ON TOP of a still-opaque outgoing scene, so
  no seam can dip to the canvas colour: no black/white flash, including the
  closing -> opening loop seam (2 s, same type position on both sides).
- Chapter seams: a cream / mint / forest field wipes across and the chapter
  opener is revealed beneath it.
- Preloading: the opening scene loads alone first (first frame in ~1.8 s on
  a simulated 4 Mbit/s link, cache off); after the page's load event the rest
  is fetched in playback order, three at a time, and upcoming scenes are
  decoded ~1.6 s before use. On that throttled link no scene was ever held.
  A scene is never shown until its photographs are decoded — the current
  scene holds instead; a scene whose images truly fail is stepped over.
  After one loop every image is in the document: a Wi-Fi drop does not stop it.
- `prefers-reduced-motion`: drift off, wipes become cuts/fades, transitions 1 ms.
- Screen wake lock requested; cursor hidden; click or `F` toggles fullscreen.
- No interface is ever drawn. QA only: `←/→` step · `Space` pause · `Home`
  restart · `D` or `?debug=1` HUD · `?scene=12` · `?pause=1` · `?step=0|1|all`.

## Photographs
- 102 displayed, every one a canonical FT ID resolved through
  `photo-visual-intelligence.csv`; no duplicate/sequence group contributes more
  than one image; no photograph appears twice (checked by `scene_report.js`).
- Derivatives: from `02_WORKING_PHOTOS` only, ≤2400 px (heroes) / ≤1600–2000 px
  (others), JPEG q83, progressive, metadata stripped, never upscaled, no
  sharpening or colour work. Masters and working copies are untouched.
- Derivative-only corrections: 90° rotation for FT-0136, 0138, 0109, 0176, 0193;
  white scanner borders trimmed; re-photographed prints cropped to the print.
- **Patient privacy:** FT-0430 is cropped to the clinician alone (top half of
  the frame; the patient is entirely outside the derivative). Every other
  frame containing a patient (FT-0395, 0396, 0446, 0447, 0451, 0452) is
  excluded. FT-0420 and FT-0448 show staff only.

## Copy
Sparse and source-supported only: chapter titles, "From the family archive",
folder-sourced mount labels, "Refodile Health Centre · Dr F. Tebeila (Dentist)"
(read from the banner in FT-0414), the date, and the opening/closing lines.
No decades, relationships, occasions or qualifications are stated; the modern
graduation, heritage-attire and village-day frames run uncaptioned because
their context is still open in `needs-human-context.csv`.

## Verification (2026-09-19 — Playwright + Chromium; local static server AND the live Pages site)
- LIVE, final commit: two uninterrupted real-time loops at 1920×1080 —
  **371.87 s and 371.84 s** (6:11.9; planned 6:11.5). 89 scene changes in
  order, no scene held for images; 1,493 DOM samples with 0 blank frames,
  0 scrollbars, 0 interface elements; 0 console errors/warnings, 0 failed
  requests; first frame ~2 s after navigation. The local two-loop run matched
  (371.8 s / 371.8 s).
- All 118 deployed URLs return 200; the root holding page is byte-identical
  to the original commit.
- In-page timing (no screenshots involved): the 54 → 60 beat fires at
  4.605 s (planned 4.600); loop-seam opacity of the incoming opening is
  0.02 / 0.15 / 0.62 / 0.92 / 1.0 at 0.2 / 0.5 / 1.0 / 1.5 / 1.9 s — a true
  2 s dissolve; the closing is hidden once it completes. The closing's type
  fades ~1.3 s before the seam so two name blocks never ghost together.
- Simulated 4 Mbit/s link, cache off: first frame 1.8 s, no scene held, 0 blanks.
- Known, harmless: starting QA at a later scene (`?scene=N`) logs a browser
  "preloaded but not used" warning for the opening image. Normal starts do not.
- All 44 scenes screenshotted at 1920×1080 and 1280×800: every image loaded,
  nothing outside the stage, all four woff2 fonts `loaded`.
- Reduced motion: drift `none`, transitions 1 ms, no seam, autoplay still advances.
- Loop seam and 54 → 60 frames captured mid-transition and reviewed.
- Review outputs (outside this repo): `05_OUTPUTS\FULL_BUILD_REVIEW\`.

## Rebuilding
```
py tools/build_derivatives.py [--force]   # needs Pillow (+ pillow-heif for HEIC working copies)
node tools/scene_report.js                # audit the sequence
py -m http.server 8731                    # preview; check the port is really yours
```

## Not done / next gates
1. FULL PRESENTATION HUMAN REVIEW (this gate).
2. Final correction pass.
3. Backup video recording — NOT created.
4. Root launch (`index.html` replacement) — NOT authorised, NOT done.
