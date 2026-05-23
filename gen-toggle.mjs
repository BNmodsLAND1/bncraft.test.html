/** Run once: node gen-toggle.mjs — writes js/bncraft-toggle-off.js from agent transcript */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const transcript =
  process.argv[2] ||
  path.join(
    process.env.USERPROFILE || '',
    '.cursor/projects/empty-window/agent-transcripts/fb6cf6f1-e62b-4475-9505-b2a0cf6fb8de/fb6cf6f1-e62b-4475-9505-b2a0cf6fb8de.jsonl'
  );

const line = fs.readFileSync(transcript, 'utf8').split(/\r?\n/)[23];
const m = line.match(/const TOGGLE_OFF\s*=\s*[\s\r\n]*'([^']+)'/);
if (!m) {
  console.error('TOGGLE_OFF not found in transcript line 24');
  process.exit(1);
}
const out = path.join(dir, 'js/bncraft-toggle-off.js');
fs.writeFileSync(
  out,
  `/** Minecraft OFF toggle (generated) */\n(function (w) {\n  w.BNCRAFT_TOGGLE_OFF = ${JSON.stringify(m[1])};\n})(typeof window !== 'undefined' ? window : globalThis);\n`
);
console.log('Wrote', out, m[1].length, 'chars');
