/* Scene manifest report — audits the sequence without opening the code.
   node tools/scene_report.js [out.md]
   Lists every scene (movement, FT IDs, duration, layout, transition), totals the
   loop runtime and photograph count, and fails on a photograph used twice or a
   manifest image with no derivative on disk. */
const fs = require("fs");
const path = require("path");
const site = path.dirname(__dirname);
global.window = {};
require(path.join(site, "assets/js/images.js"));
require(path.join(site, "assets/js/sequence.js"));
const { scenes, movements } = window.DECK_MANIFEST;

const fmt = ms => Math.floor(ms / 60000) + ":" + ("0" + (ms % 60000 / 1000).toFixed(1)).slice(-4);
const ft = n => "FT-" + ("0000" + n).slice(-4);
const TR = { fade: "fade 0.9 s", slow: "slow dissolve 1.8 s", wipe: "colour-field wipe (chapter seam)", loop: "loop seam dissolve 2.0 s" };

const seen = new Map();
const problems = [];
let total = 0;
const rows = scenes.map((s, k) => {
  const ids = (s.fts || []).concat((s.items || []).filter(i => i.t === "img").map(i => i.ft));
  ids.forEach(n => {
    if (seen.has(n)) problems.push(`${ft(n)} used in ${seen.get(n)} and ${s.id}`);
    seen.set(n, s.id);
    const key = "ft-" + ("0000" + n).slice(-4);
    if (!window.DECK_IMAGES[key]) problems.push(`${ft(n)} has no entry in images.js`);
    if (!fs.existsSync(path.join(site, "assets/img", key + ".jpg"))) problems.push(`${ft(n)} derivative missing on disk`);
  });
  const at = total;
  total += s.dur;
  const beats = s.steps ? ` · ${s.steps.length + 1} beats` : "";
  return `| ${k + 1} | ${fmt(at)} | ${("0" + s.mv).slice(-2)} | \`${s.id}\` | ${ids.map(ft).join(", ")} | ${(s.dur / 1000).toFixed(1)} s${beats} | ${s.layout} | ${TR[s.tr] || s.tr}${s.wipe ? " ← " + s.wipe : ""} |`;
});

const perMv = movements.map((name, m) => {
  const list = scenes.filter(s => s.mv === m + 1);
  const photos = list.reduce((a, s) => a + (s.fts || []).length + (s.items || []).filter(i => i.t === "img").length, 0);
  return `| ${("0" + (m + 1)).slice(-2)} | ${name} | ${list.length} | ${photos} | ${fmt(list.reduce((a, s) => a + s.dur, 0))} |`;
});

const onDisk = fs.readdirSync(path.join(site, "assets/img")).filter(f => /^ft-\d{4}\.jpg$/.test(f)).map(f => +f.slice(3, 7));
onDisk.filter(n => !seen.has(n)).forEach(n => problems.push(`${ft(n)} is in assets/img but no scene uses it`));

const md = [
  "# Scene manifest — Dr Founa Tebeila · 60",
  "",
  `Generated from \`assets/js/sequence.js\`.`,
  "",
  `- Movements: **${movements.length}**`,
  `- Scenes: **${scenes.length}**`,
  `- Displayed photographs: **${seen.size}** (each canonical FT ID appears exactly once)`,
  `- Loop runtime (sum of scene slots): **${fmt(total)}** (${(total / 1000).toFixed(1)} s)`,
  `- Integrity: ${problems.length ? "**PROBLEMS**\n" + problems.map(p => "  - " + p).join("\n") : "no duplicate photographs, every derivative present, none unused"}`,
  "",
  "## By movement",
  "",
  "| Mv | Title | Scenes | Photographs | Runtime |",
  "|---|---|---|---|---|",
  ...perMv,
  "",
  "## Sequence",
  "",
  "A scene's duration is its whole slot: it starts when its entrance transition starts and ends when the next scene's begins.",
  "",
  "| # | Starts | Mv | Scene | FT IDs | Duration | Layout | Transition in |",
  "|---|---|---|---|---|---|---|---|",
  ...rows,
  ""
].join("\n");

const out = process.argv[2];
if (out) { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, md, "utf8"); }
console.log(`${scenes.length} scenes · ${seen.size} photographs · ${fmt(total)}${problems.length ? "\nPROBLEMS:\n" + problems.join("\n") : " · integrity ok"}`);
process.exit(problems.length ? 1 : 0);
