"""
Generate cinematic Netflix-style book covers for the ebook store.
9 books, 2:3 aspect ratio (600x900), dark + accent color per category.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, math

OUT_DIR = os.path.expanduser(r"~/repos/ebook-store/public/covers")
os.makedirs(OUT_DIR, exist_ok=True)

# Per-book design data
BOOKS = [
    {"slug": "the-influential-leader", "file": "leadership.png",
     "title": "The Influential\nLeader", "cat": "LEADERSHIP", "accent": "#E0A82E",
     "bg": "#0B1220", "sub": "ANSY"' '},
    {"slug": "build-your-empire", "file": "business.png",
     "title": "Build Your\nEmpire", "cat": "BUSINESS", "accent": "#D4AF37",
     "bg": "#1A1209", "sub": "ANSY"},
    {"slug": "deep-productivity", "file": "productivity.png",
     "title": "Deep\nProductivity", "cat": "PRODUCTIVITY", "accent": "#4ADE80",
     "bg": "#07140B", "sub": "ANSY"},
    {"slug": "design-your-mindset", "file": "selfdev.png",
     "title": "Design Your\nMindset", "cat": "SELF DEV", "accent": "#C084FC",
     "bg": "#0E0A1F", "sub": "ANSY"},
    {"slug": "tech-for-everyone", "file": "tech.png",
     "title": "Tech for\nEveryone", "cat": "TECHNOLOGY", "accent": "#22D3EE",
     "bg": "#0A1A22", "sub": "ANSY"},
    {"slug": "health-without-limits", "file": "health.png",
     "title": "Health\nWithout Limits", "cat": "HEALTH", "accent": "#FB7185",
     "bg": "#1F0A12", "sub": "ANSY"},
    {"slug": "art-of-negotiation", "file": "negotiation.png",
     "title": "The Art of\nNegotiation", "cat": "SKILLS", "accent": "#FB923C",
     "bg": "#1F1108", "sub": "ANSY"},
    {"slug": "smart-investing", "file": "investing.png",
     "title": "Smart\nInvesting", "cat": "MONEY", "accent": "#22D3EE",
     "bg": "#0A1220", "sub": "ANSY"},
    {"slug": "content-writing", "file": "content.png",
     "title": "Content\nCraft", "cat": "MARKETING", "accent": "#F472B6",
     "bg": "#1A0A18", "sub": "ANSY"},
]

W, H = 600, 900
ACCENT_W = 6  # left accent bar width

def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def make_font(size, bold=True):
    """Try several system fonts; fall back to default."""
    candidates = ["arialbd.ttf", "segoeuib.ttf", "DejaVuSans-Bold.ttf"] if bold else ["arial.ttf", "segoeui.ttf", "DejaVuSans.ttf"]
    for c in candidates:
        try:
            return ImageFont.truetype(c, size)
        except OSError:
            continue
    return ImageFont.load_default()

def radial_gradient(draw, w, h, center, radius, inner, outer):
    """Draw a smooth radial gradient as concentric ellipses."""
    steps = 60
    for i in range(steps, 0, -1):
        t = i / steps
        # interpolate outer -> inner
        col = tuple(int(outer[k] + (inner[k] - outer[k]) * (1 - t)) for k in range(3))
        rx = int(radius * t)
        ry = int(radius * t)
        draw.ellipse([center[0]-rx, center[1]-ry, center[0]+rx, center[1]+ry], fill=col)

def vingette(img):
    """Apply soft vignette."""
    overlay = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(overlay)
    w, h = img.size
    for i in range(40):
        alpha = int(255 * (i / 40) * 0.45)
        d.rectangle([i, i, w-i, h-i], outline=alpha)
    blurred = overlay.filter(ImageFilter.GaussianBlur(30))
    # darken edges
    black = Image.new("RGB", img.size, (0,0,0))
    img.paste(black, mask=blurred.point(lambda p: 255 - p))

def make_cover(book):
    bg = hex2rgb(book["bg"])
    accent = hex2rgb(book["accent"])
    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img, "RGBA")

    # 1) Radial glow upper area
    radial_gradient(draw, W, H, (W//2, H//3), int(W*0.7), tuple(a//3 for a in accent), bg)
    # 2) Subtle bottom fade to deeper black
    for y in range(H):
        a = int(110 * (y / H))
        draw.rectangle([0, y, W, y+1], fill=(0,0,0,a))

    # 3) Bottom-second accent glow
    radial_gradient(draw, W, H, (W//2, int(H*0.85)), int(W*0.55), tuple(a//4 for a in accent), bg)

    # 4) Left accent strip
    draw.rectangle([0, 0, ACCENT_W, H], fill=accent)

    # 5) Top: small brand mark (monogram)
    try:
        mark_font = make_font(28, bold=True)
        draw.text((24, 28), "A", font=mark_font, fill=accent)
        author_font = make_font(18, bold=False)
        draw.text((56, 34), "ANSY", font=author_font, fill=(220, 220, 220))
    except Exception:
        pass

    # 6) Category label at center top
    cat_font = make_font(20, bold=True)
    cat_msg = book["cat"]
    bbox = draw.textbbox((0, 0), cat_msg, font=cat_font)
    catw = bbox[2] - bbox[0]
    draw.text(((W - catw)/2, int(H*0.18)), cat_msg, font=cat_font, fill=accent, spacing=4)

    # 7) Title (large, centered, white)
    title_font = make_font(72, bold=True)
    lines = book["title"].split("\n")
    total_h = 0
    line_h = []
    for ln in lines:
        b = draw.textbbox((0, 0), ln, font=title_font)
        line_h.append(b[3] - b[1])
        total_h += b[3] - b[1] + 6
    cy = int(H * 0.35)
    for i, ln in enumerate(lines):
        b = draw.textbbox((0, 0), ln, font=title_font)
        w = b[2] - b[0]
        draw.text(((W - w)/2, cy), ln, font=title_font, fill=(255, 255, 255))
        cy += line_h[i] + 6

    # 8) Small description line under title
    sub_font = make_font(18, bold=False)
    sub = "A book by " + book["sub"]
    b = draw.textbbox((0,0), sub, font=sub_font)
    sw = b[2] - b[0]
    draw.text(((W - sw)/2, int(H * 0.62)), sub, font=sub_font, fill=(200, 200, 200))

    # 9) Bottom accent bar with brand mark (cinematic)
    bottom_y = H - 90
    draw.rectangle([0, bottom_y, W, bottom_y + 2], fill=accent)
    # Red ANSY logo (Netflix-N style without being direct copy)
    logo_font = make_font(56, bold=True)
    logob = draw.textbbox((0,0), "A", font=logo_font)
    lw, lh = logob[2]-logob[0], logob[3]-logob[1]
    draw.text(((W-lw)/2, bottom_y + 14), "A", font=logo_font, fill=accent)
    mini = make_font(16, bold=False)
    mini_msg = "ANSY ORIGINALS"
    mb = draw.textbbox((0,0), mini_msg, font=mini)
    mw = mb[2]-mb[0]
    draw.text(((W-mw)/2, H - 20), mini_msg, font=mini, fill=(170,170,170), spacing=3)

    # 10) Vignette + subtle grain
    vingette(img)
    
    out_path = os.path.join(OUT_DIR, book["file"])
    img.save(out_path, "PNG", optimize=True)
    return out_path

if __name__ == "__main__":
    for b in BOOKS:
        p = make_cover(b)
        print("saved:", p, os.path.getsize(p), "bytes")
    print("done")
