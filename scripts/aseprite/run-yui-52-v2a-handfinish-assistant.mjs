import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { asepriteCandidatePaths, canExecute, readAsepriteVersion } from './aseprite-config.mjs';

const SOURCE = 'assets/source/prototypes/yui_idle_52_v2a.aseprite';
const SCRIPT = 'scripts/aseprite/yui-52-v2a-handfinish-assistant.lua';

function pickAseprite() {
  const checked = [];
  for (const path of asepriteCandidatePaths()) {
    if (!path) continue;
    const executable = canExecute(path);
    const item = { path, executable, version: '', reason: executable ? 'ok' : 'not executable' };
    if (executable) {
      try {
        const version = readAsepriteVersion(path);
        item.version = version.version || 'unknown';
        if (!version.ok) item.reason = `version command failed (${version.status})`;
      } catch (error) {
        item.reason = error instanceof Error ? error.message : String(error);
      }
    }
    checked.push(item);
  }
  return { found: checked.find((item) => item.executable) ?? null, checked };
}

if (!existsSync(SOURCE)) {
  console.error(`missing source: ${SOURCE}`);
  console.error('Generate or restore the Yui 52px V2a prototype before running this assistant.');
  process.exit(1);
}

if (!existsSync(SCRIPT)) {
  console.error(`missing script: ${SCRIPT}`);
  process.exit(1);
}

const { found, checked } = pickAseprite();
if (!found) {
  console.error('Aseprite GUI assistant: no executable Aseprite found.');
  for (const item of checked) {
    console.error(`- ${item.path}: ${item.reason}`);
  }
  console.error('Set ASEPRITE_BIN="/path/to/Aseprite" or run pnpm aseprite:check for install hints.');
  process.exit(1);
}

console.log(`Aseprite GUI assistant: ${found.path}${found.version ? ` (${found.version})` : ''}`);
console.log(`Opening ${SOURCE}`);
console.log('This helper is prototype/review tooling only; it does not export production assets.');

const result = spawnSync(found.path, [SOURCE, '--script', SCRIPT], {
  stdio: 'inherit',
});

process.exit(result.status ?? 0);
