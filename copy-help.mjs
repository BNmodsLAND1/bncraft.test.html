import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
fs.copyFileSync(path.join(dir, 'tutorial.html'), path.join(dir, 'Help.Center.html'));
console.log('copied Help.Center.html', fs.statSync(path.join(dir, 'Help.Center.html')).size, 'bytes');