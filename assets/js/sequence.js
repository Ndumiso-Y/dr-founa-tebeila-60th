/* ==========================================================================
   SCENE MANIFEST — Dr Founa Tebeila · 60
   The whole presentation as data: 11 movements, one entry per scene.

   scene  { id, mv (movement 1–11), layout (archetype, Constitution §7),
            bg (cream|mint|forest|studio), dur (ms, slot incl. its entrance),
            tr (fade 0.9s | slow 1.8s | wipe ~1.8s chapter seam | loop 2s),
            wipe (l|r|u), steps [ms…] (montage / numeral beats), items | html }
   item   img  : M() archival mount · P() plain photograph — x|r, y|b, w|h in
                 design px (the missing side follows the derivative's ratio)
          text : T(role, html) · R() hairline rule · panel {cls}
          fx (entrance) · d (delay ms) · step (appears at beat n) · until

   Copy discipline: folder-sourced labels only. No dates, names, relationships
   or occasions that the archive does not itself state.
   ========================================================================== */
(function () {
  var ALT = "Photograph from Dr Founa Tebeila’s family collection";
  function M(ft, o) { return Object.assign({ t: "img", kind: "mount", ft: ft, fx: "mount", alt: ALT }, o); }
  function P(ft, o) { return Object.assign({ t: "img", kind: "plain", ft: ft, fx: "fade", alt: ALT }, o); }
  function T(cls, html, o) { return Object.assign({ t: "text", cls: cls, html: html, fx: "rise" }, o); }
  function R(o) { return Object.assign({ t: "rule", fx: "rise" }, o); }
  function ghost(no, o) { return T("ghost", no, Object.assign({ fx: "ghost", d: 450 }, o)); }
  function beats(n, gap) { var a = []; for (var k = 1; k < n; k++) a.push(k * gap); return a; }

  var scenes = [

    /* ================= 01 — OPENING / 60 · THE WALL (approved) ================= */
    { id: "s01-the-wall", mv: 1, layout: "Full-bleed cinematic", bg: "forest", dur: 10000, tr: "loop",
      cls: "s3 scene--dark", fts: [197],
      html:
        '<img class="s3__photo" data-ft="197" alt="Dr Founa Tebeila standing against a vast stone wall with an arched niche">' +
        '<div class="s3__grade" aria-hidden="true"></div>' +
        '<div class="s3__ghost fx-ghost3" aria-hidden="true">60</div>' +
        '<p class="s3__overline fx-rise">Celebrating sixty years</p>' +
        '<h1 class="s3__name fx-rise fx-d1">Dr&nbsp;Founa<br>Tebeila</h1>' +
        '<span class="s3__rule fx-rise fx-d2" aria-hidden="true"></span>' +
        '<p class="s3__date fx-rise fx-d2">19&thinsp;.&thinsp;09&thinsp;.&thinsp;2026</p>' +
        '<p class="s3__line fx-rise fx-d2">A Celebration in Shades of Green</p>' },

    /* ================= 02 — YOUNG FONA / BEGINNINGS =================
       "Fona" is the client's spelling for these early years only; the present-day
       name everywhere else stays Dr Founa Tebeila.
       Part A (s02): the earliest archive, FT-0295/0296/0297.
       Part B (s03): Pretoria / pre-family years, FT-0466..0471 — context confirmed
       by the client; no dates, places, relationships or occasions are stated.
       Filename order is kept and is not a claim about exact chronology. */
    { id: "s02-young-fona", mv: 2, layout: "Chapter opener + three archival artifacts", bg: "cream", dur: 8500, tr: "wipe", wipe: "r",
      items: [
        ghost("02", { r: -60, y: 190 }),
        M(296, { x: 120, y: 120, h: 560, d: 250 }),
        M(297, { x: 590, y: 110, h: 380, cap: "Young Fona &middot; family archive", d: 450 }),
        M(295, { x: 660, y: 580, h: 400, d: 650 }),
        T("overline", "Chapter&nbsp;02", { x: 1100, y: 352 }),
        T("title", "Young<br>Fona", { x: 1094, y: 394, d: 200 }),
        R({ x: 1100, y: 690, d: 380 }),
        T("note", "Beginnings", { x: 1100, y: 716, d: 380 })
      ] },
    /* two beats of three inside one scene: beat 1 lets go, beat 2 arrives */
    { id: "s03-pretoria-years", mv: 2, layout: "Three-portrait editorial grid, two beats", bg: "cream", dur: 11000, tr: "fade", steps: [5200],
      items: [
        M(466, { x: 140, y: 90, h: 620, until: 0 }),
        M(467, { x: 730, y: 260, h: 620, d: 260, until: 0 }),
        M(468, { x: 1320, y: 130, h: 620, d: 520, until: 0 }),
        M(469, { x: 150, y: 240, h: 620, step: 1, d: 750 }),
        M(470, { x: 740, y: 90, h: 620, step: 1, d: 1000 }),
        M(471, { x: 1320, y: 170, h: 620, step: 1, d: 1250 }),
        T("overline", "Pretoria Years", { x: 1322, y: 896, d: 700 }),
        R({ x: 1322, y: 932, w: 96, d: 850 }),
        T("note", "From the family archive", { x: 1322, y: 952, d: 850 })
      ] },

    /* ================= 03 — EARLY FAMILY LIFE ================= */
    { id: "s04-early-family-divider", mv: 3, layout: "Typographic chapter divider", bg: "cream", dur: 5000, tr: "wipe", wipe: "l",
      items: [
        ghost("03", { r: 80, y: -70 }),
        T("overline", "Chapter&nbsp;03", { x: 140, y: 752 }),
        T("title", "Early Family Life", { x: 134, y: 792, d: 200 }),
        R({ x: 140, y: 956, d: 380 })
      ] },
    { id: "s05-cake-and-child", mv: 3, layout: "Single archival artifact", bg: "cream", dur: 9000, tr: "fade",
      items: [
        M(73, { x: 1040, y: 116, h: 800, cap: "Early Family Life &middot; family archive" }),
        R({ x: 140, y: 900, w: 96, d: 500 }),
        T("note", "From the family archive", { x: 140, y: 924, d: 500 })
      ] },
    { id: "s06-newborn-trio", mv: 3, layout: "Three-portrait editorial grid", bg: "cream", dur: 8500, tr: "fade",
      items: [
        M(96, { x: 150, y: 120, h: 560 }),
        M(76, { x: 700, y: 300, h: 640, d: 260 }),
        M(97, { x: 1290, y: 170, h: 520, d: 520 })
      ] },
    { id: "s07-family-days", mv: 3, layout: "Four-image structured grid", bg: "cream", dur: 8500, tr: "fade",
      items: [
        M(77, { x: 150, y: 130, h: 540 }),
        M(78, { x: 580, y: 340, h: 540, d: 200 }),
        M(88, { x: 1010, y: 190, h: 540, d: 400 }),
        M(75, { x: 1440, y: 380, h: 540, d: 600 })
      ] },

    /* ================= 04 — GRADUATION ================= */
    { id: "s08-graduation-columns", mv: 4, layout: "Chapter opener + single archival artifact", bg: "cream", dur: 9000, tr: "wipe", wipe: "u",
      items: [
        ghost("04", { r: 40, y: -90 }),
        M(136, { x: 140, y: 130, w: 980, cap: "Founa&rsquo;s Graduation &middot; family archive", d: 250 }),
        T("overline", "Chapter&nbsp;04", { x: 1262, y: 640 }),
        T("title", "Graduation", { x: 1256, y: 680, size: 108, d: 200 }),
        R({ x: 1262, y: 826, d: 380 })
      ] },
    { id: "s09-gown-and-certificate", mv: 4, layout: "Archival pair", bg: "cream", dur: 8000, tr: "fade",
      items: [
        M(138, { x: 230, y: 410, w: 720, d: 300 }),
        M(148, { x: 1090, y: 140, h: 730 })
      ] },
    { id: "s10-graduation-family", mv: 4, layout: "Archival pair", bg: "cream", dur: 7500, tr: "fade",
      items: [
        M(142, { x: 560, y: 130, h: 610 }),
        M(144, { x: 1140, y: 320, h: 610, d: 300 })
      ] },

    /* ================= 05 — WEDDING DAY (approved archival system) ================= */
    { id: "s11-wedding-day", mv: 5, layout: "Chapter opener + archival pair", bg: "cream", dur: 9000, tr: "wipe", wipe: "l",
      cls: "s2", fts: [155, 157],
      html:
        '<div class="s2__ghost fx-ghost" aria-hidden="true">05</div>' +
        '<div class="s2__col">' +
          '<p class="s2__overline fx-rise">Chapter&nbsp;05</p>' +
          '<h2 class="s2__title fx-rise fx-d1">Wedding<br>Day</h2>' +
          '<span class="s2__rule fx-rise fx-d2" aria-hidden="true"></span>' +
          '<p class="s2__note fx-rise fx-d2">From the family archive</p>' +
        '</div>' +
        '<figure class="mount s2__mount-a fx-mount fx-d1"><img data-ft="155" alt="Archival photograph: Founa in a pink beaded headwrap and blue traditional dress">' +
          '<figcaption>Founa&rsquo;s Wedding Day &middot; family archive</figcaption></figure>' +
        '<figure class="mount s2__mount-b fx-mount fx-d2"><img data-ft="157" alt="Archival photograph: an embrace with an elder in a white headscarf">' +
          '<figcaption>Family archive</figcaption></figure>' },
    { id: "s12-the-couple", mv: 5, layout: "Single archival artifact", bg: "cream", dur: 8000, tr: "fade",
      items: [
        M(154, { x: 270, y: 116, h: 800 }),
        R({ x: 1010, y: 900, w: 96, d: 500 }),
        T("cap", "Founa&rsquo;s Wedding Day", { x: 1010, y: 924, d: 500 })
      ] },
    { id: "s13-toast-procession", mv: 5, layout: "Three-portrait editorial grid", bg: "cream", dur: 9000, tr: "fade",
      items: [
        M(161, { x: 140, y: 330, h: 560 }),
        M(170, { x: 740, y: 110, h: 700, d: 260 }),
        M(165, { x: 1330, y: 300, h: 600, d: 520 })
      ] },
    { id: "s14-wedding-memories", mv: 5, layout: "Memory collage (montage tail)", bg: "cream", dur: 9500, tr: "fade", steps: beats(5, 1450),
      items: [
        M(156, { x: 130, y: 120, h: 520, pad: 12, fx: "land" }),
        M(163, { x: 510, y: 480, h: 460, pad: 12, fx: "land", step: 1 }),
        M(166, { x: 900, y: 90, h: 400, pad: 12, fx: "land", step: 2 }),
        M(167, { x: 1090, y: 530, h: 490, pad: 12, fx: "land", step: 3 }),
        M(158, { x: 1490, y: 90, h: 540, pad: 12, fx: "land", step: 4 })
      ] },

    /* ================= 06 — FAMILY HOLIDAYS / NEAR AND FAR ================= */
    { id: "s15-near-and-far", mv: 6, layout: "Chapter opener + archival pair", bg: "forest", dur: 9000, tr: "wipe", wipe: "r",
      items: [
        ghost("06", { x: 40, y: 330, ghost: 0.06 }),
        T("overline", "Chapter&nbsp;06", { x: 140, y: 250 }),
        T("title", "Family<br>Holidays", { x: 134, y: 292, d: 200 }),
        R({ x: 140, y: 588, d: 380 }),
        T("note", "Near and far", { x: 140, y: 614, d: 380 }),
        M(111, { x: 1040, y: 110, w: 760, d: 250 }),
        M(118, { x: 690, y: 430, h: 540, d: 450, z: 2 })
      ] },
    { id: "s16-travel-album", mv: 6, layout: "Memory collage (rapid montage)", bg: "cream", dur: 10500, tr: "fade", steps: beats(6, 1400),
      items: [
        M(107, { x: 150, y: 70, h: 440, pad: 10, fx: "land" }),
        M(114, { x: 330, y: 590, h: 420, pad: 10, fx: "land", step: 1 }),
        M(113, { x: 790, y: 110, h: 440, pad: 10, fx: "land", step: 2 }),
        M(108, { x: 1010, y: 590, h: 420, pad: 10, fx: "land", step: 3 }),
        M(121, { x: 1440, y: 70, h: 520, pad: 10, fx: "land", step: 4 }),
        M(119, { x: 1370, y: 650, h: 360, pad: 10, fx: "land", step: 5 })
      ] },
    { id: "s17-island-nest", mv: 6, layout: "Hero split", bg: "forest", dur: 8000, tr: "fade",
      items: [
        P(404, { x: 0, y: 0, h: 1080, drift: "in" }),
        P(405, { x: 1130, y: 220, h: 640, d: 500 })
      ] },
    { id: "s18-journeys", mv: 6, layout: "Portrait columns", bg: "cream", dur: 8000, tr: "fade",
      items: [
        P(248, { x: 112, y: 120, h: 700, fx: "rise" }),
        P(26, { x: 697, y: 260, h: 700, fx: "rise", d: 220 }),
        P(24, { x: 1282, y: 190, h: 700, fx: "rise", d: 440 })
      ] },
    { id: "s19-safari", mv: 6, layout: "Archival pair", bg: "cream", dur: 7500, tr: "fade",
      items: [
        M(188, { x: 140, y: 110, w: 900 }),
        M(189, { x: 1190, y: 450, h: 500, d: 300 })
      ] },

    /* ================= 07 — FRIENDS, FAMILY & JOY ================= */
    { id: "s20-joy-divider", mv: 7, layout: "Typographic chapter divider", bg: "mint", dur: 5000, tr: "wipe", wipe: "l",
      items: [
        ghost("07", { x: 60, y: -40 }),
        T("overline", "Chapter&nbsp;07", { r: 140, y: 330 }),
        T("title", "Friends, Family<br>&amp; Joy", { r: 134, y: 372, align: "right", d: 200 }),
        R({ r: 140, y: 668, d: 380 })
      ] },
    { id: "s21-sea-and-surf", mv: 7, layout: "Memory collage (rapid montage)", bg: "cream", dur: 9000, tr: "fade", steps: beats(5, 1350),
      items: [
        M(109, { x: 120, y: 110, w: 560, pad: 10, fx: "land" }),
        M(180, { x: 760, y: 50, h: 540, pad: 10, fx: "land", step: 1 }),
        M(179, { x: 1430, y: 150, h: 520, pad: 10, fx: "land", step: 2 }),
        M(176, { x: 170, y: 590, w: 600, pad: 10, fx: "land", step: 3 }),
        M(190, { x: 900, y: 640, h: 380, pad: 10, fx: "land", step: 4 })
      ] },
    { id: "s22-the-blue-bucket", mv: 7, layout: "Hero split", bg: "cream", dur: 9000, tr: "fade",
      items: [
        P(233, { r: 0, y: 0, h: 1080, drift: "in" }),
        P(237, { x: 370, y: 400, h: 540, d: 500 })
      ] },
    { id: "s23-the-gathering", mv: 7, layout: "Editorial pair", bg: "cream", dur: 8000, tr: "fade",
      items: [
        P(234, { x: 120, y: 90, w: 900, fx: "rise" }),
        P(236, { x: 1060, y: 430, w: 760, fx: "rise", d: 300 })
      ] },
    { id: "s24-party-night", mv: 7, layout: "Four-image structured grid (rapid montage wall)", bg: "forest", dur: 10500, tr: "fade", steps: beats(6, 1350),
      items: [
        P(45, { x: 178, y: 84, w: 600, h: 450, fx: "land" }),
        P(40, { x: 790, y: 84, w: 340, h: 450, fx: "land", step: 1 }),
        P(43, { x: 1142, y: 84, w: 600, h: 450, fx: "land", step: 2 }),
        P(435, { x: 178, y: 546, w: 338, h: 450, fx: "land", step: 3 }),
        P(44, { x: 528, y: 546, w: 600, h: 450, fx: "land", step: 4 }),
        P(62, { x: 1140, y: 546, w: 602, h: 450, fx: "land", step: 5 })
      ] },
    { id: "s25-laughter", mv: 7, layout: "Portrait + detail", bg: "cream", dur: 7500, tr: "fade",
      items: [
        P(465, { x: 330, y: 200, h: 660, fx: "rise" }),
        P(407, { x: 1020, y: 380, h: 520, fx: "rise", d: 300 })
      ] },

    /* ================= 08 — DENTISTRY, REFODILE & COMMUNITY ================= */
    { id: "s26-refodile", mv: 8, layout: "Chapter opener + photograph", bg: "cream", dur: 9000, tr: "wipe", wipe: "u",
      items: [
        ghost("08", { x: 20, y: 300 }),
        T("overline", "Chapter&nbsp;08", { x: 140, y: 236 }),
        T("title", "Dentistry,<br>Refodile &amp;<br>Community", { x: 134, y: 278, size: 104, d: 200 }),
        R({ x: 140, y: 630, d: 380 }),
        P(414, { x: 900, y: 190, w: 900, fx: "rise", d: 250 }),
        T("cap", "Refodile Health Centre &middot; Dr F. Tebeila (Dentist)", { x: 900, y: 886, d: 600 })
      ] },
    { id: "s27-outreach", mv: 8, layout: "Portrait + detail", bg: "cream", dur: 7500, tr: "fade",
      items: [
        P(413, { x: 200, y: 160, h: 760, fx: "rise" }),
        P(415, { x: 960, y: 350, w: 760, fx: "rise", d: 300 })
      ] },
    { id: "s28-team-and-profession", mv: 8, layout: "Staggered three-image grid", bg: "cream", dur: 8000, tr: "fade",
      items: [
        P(388, { x: 110, y: 100, w: 700, fx: "rise" }),
        M(193, { x: 250, y: 650, w: 540, pad: 12, d: 520 }),
        P(392, { x: 1000, y: 190, h: 700, fx: "rise", d: 260 })
      ] },
    { id: "s29-at-work", mv: 8, layout: "Staggered three-image grid", bg: "mint", dur: 9000, tr: "fade",
      items: [
        P(430, { x: 120, y: 130, w: 820, fx: "rise" }),
        P(420, { x: 990, y: 250, h: 660, fx: "rise", d: 260 }),
        P(448, { x: 1530, y: 130, h: 400, fx: "rise", d: 520 })
      ] },
    { id: "s30-running-together", mv: 8, layout: "Memory collage (rapid montage)", bg: "cream", dur: 9000, tr: "fade", steps: beats(5, 1350),
      items: [
        P(454, { x: 130, y: 90, h: 560, fx: "land" }),
        P(437, { x: 620, y: 70, h: 440, fx: "land", step: 1 }),
        P(399, { x: 1110, y: 70, h: 330, fx: "land", step: 2 }),
        P(408, { x: 600, y: 540, w: 620, fx: "land", step: 3 }),
        P(456, { x: 1270, y: 430, h: 540, fx: "land", step: 4 })
      ] },

    /* ================= 09 — MILESTONES THROUGH THE YEARS ================= */
    { id: "s31-milestones-divider", mv: 9, layout: "Typographic chapter divider", bg: "forest", dur: 5000, tr: "wipe", wipe: "l",
      items: [
        ghost("09", { r: 60, y: 120, ghost: 0.06 }),
        T("overline", "Chapter&nbsp;09", { x: 140, y: 380 }),
        T("title", "Milestones<br>Through the Years", { x: 134, y: 422, size: 112, d: 200 }),
        R({ x: 140, y: 690, d: 380 })
      ] },
    { id: "s32-gowns-again", mv: 9, layout: "Staggered three-image grid", bg: "cream", dur: 8500, tr: "fade",
      items: [
        P(205, { x: 150, y: 160, h: 760, fx: "rise" }),
        P(29, { x: 760, y: 120, w: 420, fx: "rise", d: 260 }),
        P(13, { x: 900, y: 570, w: 720, fx: "rise", d: 520 })
      ] },
    { id: "s33-fifty-four", mv: 9, layout: "Hero split", bg: "forest", dur: 9000, tr: "fade",
      items: [
        P(224, { x: 190, y: 0, h: 1080, drift: "in" }),
        P(223, { r: 230, y: 130, h: 430, d: 500 })
      ] },
    { id: "s34-birthday-table", mv: 9, layout: "Portrait columns (rapid montage)", bg: "forest", dur: 8000, tr: "fade", steps: beats(4, 1350),
      items: [
        P(226, { x: 70, y: 150, h: 580, fx: "land" }),
        P(228, { x: 555, y: 300, h: 580, fx: "land", step: 1 }),
        P(442, { x: 1040, y: 150, h: 580, fx: "land", step: 2 }),
        P(230, { x: 1525, y: 300, h: 580, fx: "land", step: 3 })
      ] },
    { id: "s35-54-to-60", mv: 9, layout: "Milestone numeral / 54 → 60", bg: "forest", dur: 11000, tr: "fade", steps: [4600],
      items: [
        P(444, { x: 1135, y: 110, h: 860, drift: "in" }),
        T("outline tx-outline--strong", "54", { x: 84, y: 120, size: 780, fx: "settle", d: 300, until: 0 }),
        { t: "panel", cls: "n60__field", fx: "none", step: 1, z: 5 },
        T("numeral", "60", { x: 130, y: 150, size: 660, fx: "settle", step: 1, d: 800, z: 6 }),
        R({ x: 166, y: 900, w: 120, cls: "rule--teal", step: 1, d: 1500, z: 6 }),
        T("date", "19&thinsp;.&thinsp;09&thinsp;.&thinsp;2026", { x: 166, y: 924, step: 1, d: 1500, z: 6 })
      ] },

    /* ================= 10 — TODAY ================= */
    { id: "s36-today-divider", mv: 10, layout: "Typographic chapter divider", bg: "mint", dur: 5000, tr: "slow",
      items: [
        ghost("10", { r: 40, y: 60 }),
        T("overline", "Chapter&nbsp;10", { x: 140, y: 336 }),
        T("title", "Today", { x: 128, y: 372, size: 240, d: 200 }),
        R({ x: 140, y: 690, d: 380 })
      ] },
    { id: "s37-arms-wide", mv: 10, layout: "Hero split", bg: "forest", dur: 9500, tr: "fade",
      items: [
        P(6, { x: 140, y: 0, h: 1080, drift: "in" }),
        P(7, { x: 1240, y: 340, h: 600, d: 500 })
      ] },
    { id: "s38-stone-and-light", mv: 10, layout: "Staggered three-image grid", bg: "cream", dur: 9000, tr: "fade",
      items: [
        P(55, { x: 140, y: 130, h: 820, fx: "rise" }),
        P(54, { x: 800, y: 130, w: 760, fx: "rise", d: 260 }),
        P(57, { x: 1000, y: 680, w: 520, fx: "rise", d: 520 })
      ] },
    { id: "s39-the-twirl", mv: 10, layout: "Hero split", bg: "cream", dur: 8500, tr: "fade",
      items: [
        P(213, { r: 0, y: 0, h: 1080, drift: "in" }),
        P(208, { x: 560, y: 210, h: 720, d: 500 })
      ] },
    { id: "s40-white-studio", mv: 10, layout: "White Studio portrait", bg: "studio", dur: 9000, tr: "slow",
      items: [
        P(274, { x: 118, y: 0, w: 720, h: 1080, cls: "ph--soft-right" }),
        ghost("60", { x: 960, y: 200, size: 600, ghost: 0.075, d: 700 }),
        R({ x: 1000, y: 850, w: 132, cls: "rule--teal", d: 900 })
      ] },
    { id: "s41-studio-family", mv: 10, layout: "Gallery (four-image)", bg: "studio", dur: 8500, tr: "fade",
      items: [
        P(282, { x: 160, y: 120, w: 640, fx: "rise" }),
        P(273, { x: 830, y: 270, w: 390, fx: "rise", d: 200 }),
        P(294, { x: 420, y: 590, w: 660, fx: "rise", d: 400 }),
        P(286, { x: 1250, y: 160, h: 760, fx: "rise", d: 600 })
      ] },
    { id: "s42-heritage", mv: 10, layout: "Two-portrait spread", bg: "cream", dur: 7500, tr: "fade",
      items: [
        P(36, { x: 1000, y: 130, h: 820, fx: "rise" }),
        P(38, { x: 500, y: 430, h: 520, fx: "rise", d: 300 })
      ] },
    { id: "s43-elders", mv: 10, layout: "Three-portrait editorial grid", bg: "cream", dur: 9000, tr: "fade",
      items: [
        P(216, { x: 140, y: 190, h: 700, fx: "rise" }),
        P(239, { x: 760, y: 100, h: 600, fx: "rise", d: 260 }),
        P(215, { x: 1310, y: 330, h: 640, fx: "rise", d: 520 })
      ] },

    /* ================= 11 — CLOSING / RETURN TO 60 ================= */
    /* Loop seam: the closing's type lets go ~1.3 s before the scene ends, so the 2 s seam is
       photograph dissolving into photograph and the name resolves once (in The Wall),
       instead of two offset name blocks ghosting through each other. */
    { id: "s44-closing", mv: 11, layout: "Full-bleed cinematic", bg: "forest", dur: 12000, tr: "slow", cls: "sc--dark", steps: [10700],
      items: [
        P(56, { x: 0, y: 0, w: 1920, h: 1080, drift: "out", fx: "none" }),
        { t: "panel", cls: "close__grade", fx: "none" },
        /* type lives in the open window panes right of her profile (x >= 1400),
           clear of her face (x <= 1120) — the same side as The Wall's type */
        T("outline", "60", { x: 1384, y: 84, size: 440, fx: "fade", d: 900, until: 0 }),
        T("overline", "Happy 60th", { x: 1424, y: 596, d: 300, until: 0 }),
        T("name", "Dr&nbsp;Founa<br>Tebeila", { x: 1420, y: 638, size: 100, d: 550, until: 0 }),
        R({ x: 1424, y: 876, w: 120, cls: "rule--teal", d: 800, until: 0 }),
        T("date", "19&thinsp;.&thinsp;09&thinsp;.&thinsp;2026", { x: 1424, y: 900, d: 800, until: 0 })
      ] }
  ];

  window.DECK_MANIFEST = {
    title: "Dr Founa Tebeila · 60",
    movements: ["Opening / 60", "Young Fona / Beginnings", "Early Family Life", "Graduation", "Wedding Day",
      "Family Holidays / Near and Far", "Friends, Family & Joy", "Dentistry, Refodile & Community",
      "Milestones Through the Years", "Today", "Closing / Return to 60"],
    scenes: scenes
  };
})();
