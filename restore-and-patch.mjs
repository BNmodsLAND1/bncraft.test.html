/**
 * Restore pages from Downloads originals + apply BNcraft settings integration.
 * Run: node restore-and-patch.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DL = 'C:/Users/Pc/Downloads';
const ROOT = __dirname;

const TRANSCRIPT =
  process.env.BNCRAFT_TRANSCRIPT ||
  path.join(
    process.env.USERPROFILE || '',
    '.cursor/projects/empty-window/agent-transcripts/fb6cf6f1-e62b-4475-9505-b2a0cf6fb8de/fb6cf6f1-e62b-4475-9505-b2a0cf6fb8de.jsonl'
  );

function extractToggleOff() {
  try {
    const line = fs.readFileSync(TRANSCRIPT, 'utf8').split(/\r?\n/)[23];
    const m = line.match(/const TOGGLE_OFF\s*=\s*[\s\r\n]*'([^']+)'/);
    if (m) return m[1];
  } catch (e) {
    console.warn('Could not extract TOGGLE_OFF:', e.message);
  }
  return null;
}

function writeToggleOff(uri) {
  const off =
    uri ||
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAQCAYAAAABOs/SAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABRSURBVDjLY/j//z8DNTEQ/CcK08JifODYsWPYLSbaxXgwzAJsOCIsArfF9fX1ZOPha7GDgwMYj1o8avHwsXh45eMBKTKpUUnALMCFaWYxMRgAabqrrJ4nx1gAAAAASUVORK5CYII=';
  fs.writeFileSync(
    path.join(ROOT, 'js/bncraft-toggle-off.js'),
    `/** Minecraft OFF toggle */\n(function (w) {\n  w.BNCRAFT_TOGGLE_OFF = ${JSON.stringify(off)};\n})(typeof window !== 'undefined' ? window : globalThis);\n`
  );
  console.log('toggle-off.js', off.length, 'chars');
}

function copy(src, dest) {
  fs.copyFileSync(src, dest);
  console.log('copied', path.basename(dest));
}

function patch(file, replacements) {
  const p = path.join(ROOT, file);
  let s = fs.readFileSync(p, 'utf8');
  for (const [a, b] of replacements) {
    if (!s.includes(a)) console.warn(`[${file}] missing:`, a.slice(0, 60));
    s = s.split(a).join(b);
  }
  fs.writeFileSync(p, s);
}

const TOGGLE_SCRIPTS = `<script src="js/bncraft-toggle-off.js"></script>
<script src="js/bncraft-core.js"></script>`;

const SETTINGS_HTML = `
<div class="settings-overlay" id="settingsOverlay" onclick="BNcraft.closeSettingsPanel()"></div>
<aside class="settings-panel" id="settingsPanel">
    <div class="settings-panel-header">
        <span class="settings-panel-title">SETTINGS</span>
        <button type="button" class="settings-close-btn" onclick="BNcraft.closeSettingsPanel()">✕</button>
    </div>
    <div class="settings-panel-body"><div id="settingsPanelContent"></div></div>
</aside>`;

const MENU_HELP = `<a class="menu-item" href="Help.Center.html">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Help Center
    </a>`;

// --- restore ---
copy(path.join(DL, 'index.html'), path.join(ROOT, 'index.html'));
copy(path.join(DL, 'BNcraft-other-mods.html'), path.join(ROOT, 'other-mods.html'));
copy(path.join(DL, 'BNcraft-Official-Links.html'), path.join(ROOT, 'links.html'));
copy(path.join(DL, 'BNcraft-tuturial.html'), path.join(ROOT, 'Help.Center.html'));

writeToggleOff(extractToggleOff());

// --- index ---
patch('index.html', [
  ['<script src="js/bncraft-core.js"></script>', TOGGLE_SCRIPTS],
  [
    '<a class="menu-item" href="tutorial.html">',
    '<a class="menu-item" href="Help.Center.html">',
  ],
  ['Tutorial\n        </a>', 'Help Center\n        </a>'],
  [
    "BNcraft.buildSettingsPanel('settingsPanelContent', { cardInfo: false });",
    "BNcraft.buildSettingsPanel('settingsPanelContent', { page: 'home', cardInfo: false, interface: false });",
  ],
]);

// --- other-mods ---
patch('other-mods.html', [
  ['<script src="js/bncraft-core.js"></script>', TOGGLE_SCRIPTS],
  ['<a class="menu-item" href="tutorial.html">Tutorial</a>', MENU_HELP.trim()],
  [
    "BNcraft.buildSettingsPanel('settingsPanelContent', { cardInfo: false });",
    "BNcraft.buildSettingsPanel('settingsPanelContent', { page: 'home', cardInfo: false, interface: false });",
  ],
]);
fs.copyFileSync(path.join(ROOT, 'other-mods.html'), path.join(ROOT, 'BNcraft-other-mods.html'));
console.log('synced BNcraft-other-mods.html');

// --- links ---
let links = fs.readFileSync(path.join(ROOT, 'links.html'), 'utf8');
links = links.replace('<html lang="en">', '<html lang="en" data-theme="blue">');
if (!links.includes('bncraft-shared.css')) {
  links = links.replace(
    '</title>',
    `</title>
    <link rel="stylesheet" href="css/bncraft-shared.css">`
  );
}
if (!links.includes('links-settings-btn')) {
  links = links.replace(
    '<body>',
    `<body>
<button type="button" class="links-settings-btn" onclick="BNcraft.openSettingsPanel()" aria-label="Settings" title="Settings">⚙</button>
<style>
.links-settings-btn{position:fixed;top:16px;right:16px;z-index:100;width:44px;height:44px;border-radius:50%;border:1px solid var(--border-color,rgba(0,229,255,.3));background:rgba(0,0,0,.5);color:var(--accent,#00e5ff);font-size:20px;cursor:pointer;backdrop-filter:blur(8px)}
html[data-theme] body{background-color:var(--bg-dark);color:var(--text-main,#fff)}
html[data-theme] .link-card{border-color:var(--border-color,rgba(0,229,255,.25))}
html[data-theme] .link-card:hover{border-color:var(--accent);box-shadow:var(--glow)}
html[data-theme] .avatar-ring{background:linear-gradient(135deg,var(--accent),transparent)}
html[data-theme] .section-label{color:var(--accent)}
</style>`
  );
}
if (!links.includes('settingsPanel')) {
  links = links.replace('</body>', `${SETTINGS_HTML}\n${TOGGLE_SCRIPTS}\n<script>\n(function(){BNcraft.buildSettingsPanel('settingsPanelContent',{page:'home',cardInfo:false,interface:false});})();\n</script>\n</body>`);
} else {
  links = links.replace('</body>', `${TOGGLE_SCRIPTS}\n<script>\n(function(){BNcraft.buildSettingsPanel('settingsPanelContent',{page:'home',cardInfo:false,interface:false});})();\n</script>\n</body>`);
}
fs.writeFileSync(path.join(ROOT, 'links.html'), links);

// --- Help.Center ---
patch('Help.Center.html', [
  ['<a class="menu-item" href="" target="_blank">', '<a class="menu-item" href="index.html">'],
  [
    `    <a class="menu-item" href="tutorial.html" target="_blank">
        <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        <span data-i18n="menu_tutorial">Tutorial</span>
    </a>
`,
    '',
  ],
  [
    `    <div class="menu-divider"></div>
    <a class="menu-item" href="Mods.html">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span data-i18n="menu_help">Help Center</span>
    </a>`,
    '',
  ],
  [
    `    <!-- THEMES -->
    <button class="menu-item" onclick="toggleThemeSub()">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 010 20 5 5 0 010-10 5 5 0 000-10z"/></svg>
        <span data-i18n="menu_themes">Themes</span>
        <svg id="themeArrow" viewBox="0 0 24 24" style="margin-left:auto;width:14px;height:14px;transition:.2s;"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div class="theme-sub" id="themeSub">
        <div class="theme-sub-title" data-i18n="theme_select">Select Theme</div>
        <div class="theme-dots-row">
            <div class="theme-dot-wrap"><div class="theme-dot active-theme" data-t="blue" onclick="setTheme('blue')"></div><div class="theme-dot-lbl">Blue</div></div>
            <div class="theme-dot-wrap"><div class="theme-dot" data-t="purple" onclick="setTheme('purple')"></div><div class="theme-dot-lbl">Purple</div></div>
            <div class="theme-dot-wrap"><div class="theme-dot" data-t="red" onclick="setTheme('red')"></div><div class="theme-dot-lbl">Red</div></div>
            <div class="theme-dot-wrap"><div class="theme-dot" data-t="green" onclick="setTheme('green')"></div><div class="theme-dot-lbl">Green</div></div>
            <div class="theme-dot-wrap"><div class="theme-dot" data-t="yellow" onclick="setTheme('yellow')"></div><div class="theme-dot-lbl">Yellow</div></div>
            <div class="theme-dot-wrap"><div class="theme-dot" data-t="orange" onclick="setTheme('orange')"></div><div class="theme-dot-lbl">Orange</div></div>
            <div class="theme-dot-wrap"><div class="theme-dot" data-t="white" onclick="setTheme('white')"></div><div class="theme-dot-lbl">White</div></div>
        </div>
    </div>
    <div class="menu-divider"></div>
`,
    `    <button class="menu-item" type="button" onclick="BNcraft.openSettingsPanel(); closeMenu();">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <span>Settings</span>
    </button>
    <div class="menu-divider"></div>
`,
  ],
  [
    'function setTheme(theme) {\ndocument.documentElement.setAttribute(\'data-theme\', theme);\nlocalStorage.setItem(\'bncraft-theme\', theme);\ndocument.querySelectorAll(\'.theme-dot\').forEach(d => {\nd.classList.toggle(\'active-theme\', d.getAttribute(\'data-t\') === theme);\n});\n}',
    'function setTheme(theme) {\n    if (window.BNcraft && BNcraft.setTheme) BNcraft.setTheme(theme);\n    else {\n        document.documentElement.setAttribute(\'data-theme\', theme);\n        localStorage.setItem(\'bncraft-theme\', theme);\n    }\n}',
  ],
  [
    '(function init() {\nconst savedTheme = localStorage.getItem(\'bncraft-theme\') || \'blue\';\nsetTheme(savedTheme);',
    '(function init() {\n    if (window.BNcraft) {\n        BNcraft.initCore();\n        BNcraft.buildSettingsPanel(\'settingsPanelContent\', { page: \'home\', cardInfo: false, interface: false });\n    }\n    const savedTheme = localStorage.getItem(\'bncraft-theme\') || \'blue\';\n    setTheme(savedTheme);',
  ],
]);
if (!fs.readFileSync(path.join(ROOT, 'Help.Center.html'), 'utf8').includes('settingsPanel')) {
  const help = fs.readFileSync(path.join(ROOT, 'Help.Center.html'), 'utf8');
  fs.writeFileSync(
    path.join(ROOT, 'Help.Center.html'),
    help.replace('</body>', `${SETTINGS_HTML}\n${TOGGLE_SCRIPTS}\n</body>`)
  );
} else {
  patch('Help.Center.html', [['<script>', `${TOGGLE_SCRIPTS}\n<script>`]]);
}

// tutorial.html redirect
fs.writeFileSync(
  path.join(ROOT, 'tutorial.html'),
  `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=Help.Center.html"><script>location.replace('Help.Center.html');</script><title>Redirect</title></head><body><a href="Help.Center.html">Help Center</a></body></html>\n`
);

console.log('Done. Patched index, other-mods, links, Help.Center');
