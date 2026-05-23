import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const transcript = process.argv[2] || path.join(process.env.USERPROFILE || '', '.cursor/projects/empty-window/agent-transcripts/fb6cf6f1-e62b-4475-9505-b2a0cf6fb8de/fb6cf6f1-e62b-4475-9505-b2a0cf6fb8de.jsonl');
const line = fs.readFileSync(transcript, 'utf8').split(/\r?\n/)[23];
const m = line.match(/const TOGGLE_OFF\s*=\s*[\s\r\n]*'([^']+)'/);if (!m) {
  console.error('no match');
  process.exit(1);
}
fs.writeFileSync(
  path.join(dir, 'js/bncraft-toggle-off.js'),  `(function (w) { w.BNCRAFT_TOGGLE_OFF = ${JSON.stringify(m[1])}; })(typeof window !== 'undefined' ? window : globalThis);\n`
);
console.log('ok', m[1].length);
