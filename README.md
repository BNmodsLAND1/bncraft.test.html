# BNcraft Website

Professional static site for BNcraft marketplace mods. Ready for GitHub Pages and Cloudflare.

## Quick start (localhost)

1. Double-click `INSTALL.bat` (copies latest HTML from Downloads if you edited there).
2. Open PowerShell in this folder:

```powershell
cd $env:USERPROFILE\Desktop\BNcraft
python -m http.server 8080
```

3. Open [http://localhost:8080/index.html](http://localhost:8080/index.html)

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home |
| `Mods.html` | Marketplace mods (**Discord bot writes here**) |
| `other-mods.html` | Community / other mods |
| `BNcraft-other-mods.html` | Same as other-mods (keep for bot until `.env` updated) |
| `links.html` | Social media links |
| `tutorial.html` | Tutorial (language switch only on this page) |

## Features

- **Settings panel** (hamburger → Settings): themes, fonts, card/interface toggles, statistics, reset
- **Themes**: blue, purple, red, green, yellow, orange, white, **grayscale**, **pink**
- **Fonts**: Inter, Minecraft, Outfit, **Space Mono**, **Nunito**
- **Search modes**: name (default), link, UUID, studio
- **Realms+** category filter (uses `realmsPlus` from bot data)
- **Top Rated** sorts by rating **count** (132K, 23K, etc.)
- **Size range** up to **1 GB** with stepped slider
- **Copy mod link** in popup: `Mods.html#/home/mods/{name}/{studio}/{uuid}`
- **Favorites** shows how many favorited mods are Realms+

## Discord bot

Do not change `const mods = [` structure in `Mods.html`. Bot uses:

```
GITHUB_MODS_HTML_PATH=Mods.html
GITHUB_OTHER_MODS_HTML_PATH=BNcraft-other-mods.html
```

When you rename files on GitHub, update `.env` in `BNcraft-v5` only.

## GitHub

```bash
git init
git add .
git commit -m "BNcraft site v2"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

Enable GitHub Pages: Settings → Pages → Deploy from branch `main` / root.

## Build script

If you edit files in `Downloads`, run:

```powershell
python build_site.py
```

Or use `INSTALL.bat` for a simple copy.
