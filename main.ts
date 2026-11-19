// Leonida Trophy Guide for make.fun's gta6-trophy-guide-01 bounty (Node 22,
// standard library only). The entry itself is the static site under app/:
// index.html plus its modules, stylesheet and the 55-trophy data file, with
// no build step and nothing fetched over the network. This program hands it
// in: it copies app/ and screenshots/ from beside this file into the output
// directory and writes dossier.json there, using the vendored make.fun
// library to build the dossier. vendor/makefun-frontend.ts stays untouched:
// the scorer rebuilds the dossier with its own copy and compares the two
// byte for byte, so this file must write exactly what the library writes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's caps: at most 4 screenshots, none over 256 KiB; app/ at most
// 993 files and directories and 48 MiB in all; the dossier text at most
// 160 KiB. The whole of /output shares the platform's 1,000-entry, 64 MiB
// cap, so app/, screenshots/ and dossier.json together must leave room.
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);

// Say what was handed in, so the run log shows it at a glance.
const shotCount = readdirSync(join(out, 'screenshots')).length;
const dossierBytes = statSync(dossierPath).size;
console.log(
  `Leonida Trophy Guide handed in: app/ + ${shotCount} screenshots, dossier.json ${dossierBytes} bytes.`,
);
