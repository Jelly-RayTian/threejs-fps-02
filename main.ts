// Package Sunbreak's static game and actual browser captures deterministically.
import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import { buildDossier } from './vendor/makefun-threejs.ts';
const source = fileURLToPath(new URL('.', import.meta.url));
const destination = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
mkdirSync(destination, { recursive: true });
for (const folder of ['game', 'screenshots']) {
  cpSync(join(source, folder), join(destination, folder), { recursive: true });
}
const dossier = buildDossier(destination, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
});
writeFileSync(join(destination, 'dossier.json'), dossier);
console.log(`Sunbreak packaged in ${destination}`);
