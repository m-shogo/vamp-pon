import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type Check = { label: string; ok: boolean; detail?: string };

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const checks: Check[] = [];

function check(label: string, ok: boolean, detail?: string): void {
  checks.push({ label, ok, detail });
}

function publicPathExists(publicUrlPath: string): boolean {
  const normalized = publicUrlPath.startsWith('/') ? publicUrlPath.slice(1) : publicUrlPath;
  return existsSync(resolve(ROOT, 'public', normalized.replace(/^assets\//, 'assets/')));
}

const backgroundManifestPath = resolve(ROOT, 'public/assets/prototypes/backgrounds/manifest.json');
const backgroundManifest = JSON.parse(readFileSync(backgroundManifestPath, 'utf8')) as {
  stages?: Array<{
    id: string;
    environment: string;
    enabledForRuntime: boolean;
  }>;
};

for (const stage of backgroundManifest.stages ?? []) {
  const usesPrototypeBackground = stage.environment.startsWith('/assets/prototypes/backgrounds/');
  check(
    `${stage.id} latest prototype background is runtime-enabled`,
    usesPrototypeBackground && stage.enabledForRuntime === true,
    `${stage.environment} enabledForRuntime=${stage.enabledForRuntime}`,
  );
  check(
    `${stage.id} runtime background file exists`,
    publicPathExists(stage.environment),
    stage.environment,
  );
}

const enemyPrototypeSource = readFileSync(resolve(ROOT, 'src/game/assets/enemyPrototypeSheet.ts'), 'utf8');
const enemyRightPath = 'assets/prototypes/sprite-sheets/enemies-original/enemy-48-right-1440x1080-rgba.png';
const enemyLeftPath = 'assets/prototypes/sprite-sheets/enemies-original/enemy-48-left-1440x1080-rgba.png';
check(
  'runtime enemy bridge uses latest enemies-original sheets',
  enemyPrototypeSource.includes(enemyRightPath) && enemyPrototypeSource.includes(enemyLeftPath),
);
check('runtime enemy right/front sheet file exists', publicPathExists(enemyRightPath), enemyRightPath);
check('runtime enemy left sheet file exists', publicPathExists(enemyLeftPath), enemyLeftPath);

const mainSceneSource = readFileSync(resolve(ROOT, 'src/game/scenes/MainScene.ts'), 'utf8');
check(
  'MainScene checks enabledForRuntime before using manifest backgrounds',
  mainSceneSource.includes('!entry.enabledForRuntime'),
);

const loadAssetsSource = readFileSync(resolve(ROOT, 'src/game/assets/loadAssets.ts'), 'utf8');
check(
  'runtime background loader filters enabledForRuntime',
  loadAssetsSource.includes('entry?.enabledForRuntime'),
);

const failed = checks.filter((c) => !c.ok);
for (const c of checks) {
  console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.label}${c.detail ? ` (${c.detail})` : ''}`);
}

if (failed.length > 0) {
  console.error(`\nruntime-asset-sources: failed (${failed.length})`);
  process.exit(1);
}

console.log(`\nruntime-asset-sources: ok (${checks.length} checks)`);
