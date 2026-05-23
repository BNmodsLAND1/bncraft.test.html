# BNcraft Website

Static site for BNcraft marketplace mods. Hosted on **GitHub Pages**.

**Live URL:** [https://bnmodsland1.github.io/bncraft.test.html/Mods.html](https://bnmodsland1.github.io/bncraft.test.html/Mods.html)

## GitHub upload (important)

Push **all HTML files** from this folder to the repo root (not inside a `BNcraft/` subfolder).

**Important:** CSS and JavaScript are **built into the HTML files** (no `css/` or `js/` folders required on GitHub). If you only upload `Mods.html` without re-uploading after an update, the site will look broken.

```bash
cd path/to/bncraft.test.html
git add Mods.html index.html other-mods.html BNcraft-other-mods.html links.html tutorial.html
git commit -m "Update BNcraft site (inline assets)"
git push
```

Target URL: `https://bnmodsland1.github.io/bncraft.test.html/Mods.html`

Enable Pages: **Settings → Pages → Deploy from branch `main` / root**.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home |
| `Mods.html` | Marketplace mods (**Discord bot writes here**) |
| `other-mods.html` | Community / other mods |
| `BNcraft-other-mods.html` | Same as other-mods (keep for bot) |
| `links.html` | Social links |
| `tutorial.html` | Tutorial |

## Features

- **Search bar:** icon mode picker (name / link / UUID / studio) + search button on the right
- **By link:** hides mods until a Marketplace URL is pasted; matches **UUID only** (any locale path)
- **Settings:** themes, fonts, toggles, statistics, **Reset to Defaults**, **Cookies**, hide Discord banner
- **Modal:** link icon on the banner copies share URL; opening a mod updates the browser URL
- **Lazy images:** card images load when scrolled into view
- **Size / Minecoin sliders:** stay inside the filter box

## Discord bot

Do not change `const mods = [` in `Mods.html`. Bot env:

```
GITHUB_MODS_HTML_PATH=Mods.html
GITHUB_OTHER_MODS_HTML_PATH=BNcraft-other-mods.html
```

Share link format: `Mods.html#/home/mods/{name}/{studio}/{uuid}`
