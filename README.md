# BNcraft Website

Live: [Mods.html](https://bnmodsland1.github.io/bncraft.test.html/Mods.html)

## GitHub upload

Upload **all of these** to the repo root:

| File / folder | Required |
|---------------|----------|
| `Mods.html` | Yes (includes CSS + JS inline) |
| `index.html`, `other-mods.html`, `BNcraft-other-mods.html`, `links.html`, `tutorial.html` | Yes |
| `js/bncraft-core.js` | Yes (other pages load this) |
| `css/bncraft-shared.css` | Optional (Mods has styles inline) |

```
Mods.html
index.html
other-mods.html
BNcraft-other-mods.html
links.html
tutorial.html
js/bncraft-core.js
```

After push, wait ~1 min and hard-refresh (Ctrl+F5).

## Bot

Keep `const mods = [` in `Mods.html`. Env: `GITHUB_MODS_HTML_PATH=Mods.html`
