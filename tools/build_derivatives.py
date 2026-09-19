"""Build web derivatives for the presentation from the verified WORKING copies.

  py tools/build_derivatives.py            build anything missing
  py tools/build_derivatives.py --force    rebuild everything in SPEC

Rules (Design Constitution / Final Story Architecture):
- Sources are resolved by canonical FT ID through photo-visual-intelligence.csv.
- 01_ORIGINAL_PHOTOS is never read or written; working copies are read-only here.
- Rotation and crops exist ONLY in the derivative. No sharpening, no colour work.
- JPEG q82-84, metadata stripped, aspect preserved, never upscaled.
- FT-0430 is cropped to the clinician alone (patient privacy is binding).
- The four approved prototype derivatives (0155/0157/0197/0274) are not rebuilt.

Writes assets/img/ft-XXXX.jpg and assets/js/images.js (pixel sizes for layout).
"""
import csv, json, os, re, sys
from PIL import Image, ImageOps, ImageFilter

try:  # HEIC working copies
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    pillow_heif = None

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = os.path.dirname(SITE)
WORK = os.path.join(ROOT, "02_WORKING_PHOTOS")
CSV = os.path.join(ROOT, "03_ASSET_INVENTORY", "photo-visual-intelligence.csv")
OUT = os.path.join(SITE, "assets", "img")

# id: (rotate_ccw_degrees, crop (l,t,r,b as fractions AFTER rotation) | "trim" | None, long_edge)
# "trim" removes the white scanner border of flatbed scans.
T = "trim"
SPEC = {
    # 02 Young Founa — re-photographed prints, cropped to the print
    295: (0, (0.02, 0.02, 0.98, 0.98), 1600),
    296: (0, (0.09, 0.115, 0.91, 0.99), 1600),
    297: (0, (0.0, 0.315, 1.0, 1.0), 1600),
    # 03 Early family life
    73: (0, T, 1600), 96: (0, (0.045, 0.01, 0.935, 0.955), 1600), 76: (0, T, 1600),
    97: (0, (0.0, 0.205, 1.0, 1.0), 1600), 77: (0, T, 1600), 78: (0, T, 1600),
    88: (0, T, 1600), 75: (0, T, 1600),
    # 04 Graduation (0136/0138 are rotated scans: corrected here only)
    136: (90, T, 1600), 148: (0, T, 1600), 138: (90, T, 1600), 142: (0, T, 1600), 144: (0, T, 1600),
    # 05 Wedding day
    154: (0, T, 1600), 161: (0, (0.0, 0.0, 1.0, 0.85), 1600), 170: (0, (0.09, 0.0, 1.0, 1.0), 1600),
    165: (0, (0.05, 0.0, 1.0, 1.0), 1600), 156: (0, T, 1600), 163: (0, (0.0, 0.01, 1.0, 0.86), 1600),
    166: (0, (0.0, 0.14, 1.0, 0.89), 1600), 167: (0, (0.0, 0.02, 1.0, 1.0), 1600),
    158: (0, (0.09, 0.05, 0.92, 0.96), 1600),
    # 06 Holidays
    111: (0, (0.01, 0.01, 0.975, 0.99), 2000), 118: (0, (0.03, 0.0, 0.90, 0.97), 1600),
    107: (0, T, 1600), 108: (0, T, 1600), 113: (0, (0.02, 0.02, 0.98, 0.98), 1600),
    121: (0, None, 1600), 114: (0, None, 1600), 119: (0, None, 1600),
    404: (0, None, 1600), 405: (0, None, 1600), 248: (0, None, 1600), 26: (0, None, 1600),
    24: (0, None, 1600), 188: (0, (0.0, 0.02, 1.0, 0.93), 1600), 189: (0, None, 1600),
    # 07 Friends, family & joy
    180: (0, T, 1600), 179: (0, T, 1600), 109: (90, T, 1600), 190: (0, (0.0, 0.05, 1.0, 0.78), 1600),
    176: (90, T, 1600), 233: (0, None, 2400), 234: (0, None, 2000), 236: (0, None, 2000),
    237: (0, None, 1600), 45: (0, None, 2000), 43: (0, None, 2000), 44: (0, None, 2000),
    62: (0, None, 2000), 40: (0, None, 1600), 435: (0, None, 1600),
    465: (0, None, 1600), 407: (0, None, 1600),
    # 08 Dentistry, Refodile & community
    414: (0, None, 1600), 413: (0, None, 1600), 415: (0, None, 1600), 388: (0, None, 1600),
    392: (0, None, 1600), 193: (90, T, 1600),
    430: (0, (0.0, 0.0, 1.0, 0.50), 1600),   # PRIVACY: clinician only, patient fully out of frame
    420: (0, None, 1600), 448: (0, None, 1600), 454: (0, None, 1600),
    456: (0, (0.0, 0.125, 1.0, 0.875), 1600), 408: (0, None, 1600), 437: (0, None, 1600),
    399: (0, None, 1600),
    # 09 Milestones
    205: (0, None, 1800), 29: (0, None, 1600), 13: (0, None, 2000), 224: (0, None, 2000),
    223: (0, None, 1600), 226: (0, None, 1600), 228: (0, None, 1600), 442: (0, None, 1600),
    230: (0, None, 1600), 444: (0, None, 1600),
    # 10 Today
    6: (0, None, 2400), 7: (0, None, 2000), 55: (0, None, 2000), 57: (0, None, 2000),
    54: (0, None, 2000), 213: (0, None, 2400), 208: (0, None, 1800), 273: (0, None, 1800),
    282: (0, None, 1800), 294: (0, None, 1800), 286: (0, None, 1800), 36: (0, None, 1800),
    38: (0, None, 1800), 216: (0, None, 1800), 239: (0, None, 1800), 215: (0, None, 1800),
    # 11 Closing — 16:9 art crop, reserved for the closing scene only
    56: (0, (0.0, 0.03, 1.0, 0.7518), 2400),
}
KEEP = (155, 157, 197, 274)  # approved prototype derivatives


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def sources():
    rows = {r["ft_id"]: r for r in csv.DictReader(open(CSV, encoding="utf-8-sig"))}
    index = {}
    for d, _, files in os.walk(WORK):
        for f in files:
            index.setdefault(f.lower(), []).append(os.path.join(d, f))

    def resolve(n):
        r = rows["FT-%04d" % n]
        assert r["canonical_ft_id"] == r["ft_id"], "non-canonical FT id %s" % n
        hits = index.get(r["working_filename"].lower(), [])
        for h in hits:
            if norm(os.path.basename(os.path.dirname(h))) == norm(r["source_folder"]):
                return h
        return hits[0] if hits else None
    return resolve


def trim_white(im):
    """Bounding box of everything that is not the white scanner bed, inset ~1%."""
    g = im.convert("L").filter(ImageFilter.GaussianBlur(3))
    mask = g.point(lambda v: 255 if v < 232 else 0)
    box = mask.getbbox() or (0, 0) + im.size
    dx, dy = int((box[2] - box[0]) * 0.012), int((box[3] - box[1]) * 0.012)
    return im.crop((box[0] + dx, box[1] + dy, box[2] - dx, box[3] - dy))


def build(n, resolve, force):
    dst = os.path.join(OUT, "ft-%04d.jpg" % n)
    if os.path.exists(dst) and not force:
        return dst
    rot, crop, edge = SPEC[n]
    src = resolve(n)
    if not src:
        raise SystemExit("FT-%04d: working copy not found" % n)
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    if rot:
        im = im.rotate(rot, expand=True)
    if crop == T:
        im = trim_white(im)
    elif crop:
        w, h = im.size
        im = im.crop((round(crop[0] * w), round(crop[1] * h), round(crop[2] * w), round(crop[3] * h)))
    if max(im.size) > edge:
        im.thumbnail((edge, edge), Image.LANCZOS)
    im.save(dst, "JPEG", quality=83, optimize=True, progressive=True)
    return dst


def main():
    force = "--force" in sys.argv
    resolve = sources()
    os.makedirs(OUT, exist_ok=True)
    for n in sorted(SPEC):
        build(n, resolve, force)
    sizes, total = {}, 0
    for f in sorted(os.listdir(OUT)):
        if f.endswith(".jpg"):
            p = os.path.join(OUT, f)
            sizes[f[:-4]] = list(Image.open(p).size)
            total += os.path.getsize(p)
    with open(os.path.join(SITE, "assets", "js", "images.js"), "w", encoding="utf-8") as fh:
        fh.write("/* Generated by tools/build_derivatives.py — pixel sizes of the web derivatives. */\n")
        fh.write("window.DECK_IMAGES = " + json.dumps(sizes, separators=(",", ":")) + ";\n")
    print("%d derivatives, %.1f MB" % (len(sizes), total / 1e6))


if __name__ == "__main__":
    main()
