import { readFileSync, existsSync, statSync, openSync, readSync, closeSync } from 'node:fs';
import { resolve, basename } from 'node:path';

type Check = { label: string; ok: boolean; detail?: string };
const checks: Check[] = [];

function check(label: string, ok: boolean, detail?: string): void {
  checks.push({ label, ok, detail });
}

const ROOT = resolve(import.meta.dirname ?? '.', '..', '..');
const BG_DIR = resolve(ROOT, 'public/assets/prototypes/backgrounds');
const MANIFEST_PATH = resolve(BG_DIR, 'manifest.json');

check('manifest.json exists', existsSync(MANIFEST_PATH));

let manifest: {
  version: number;
  logicalViewport: { width: number; height: number };
  stages: Array<{
    id: string;
    number: number;
    name: string;
    slug: string;
    environment: string;
    meta: string;
    status: string;
    enabledForPreview: boolean;
    enabledForRuntime: boolean;
  }>;
};

try {
  manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  check('manifest parses as JSON', true);
} catch (e) {
  check('manifest parses as JSON', false, String(e));
  printResults();
  process.exit(1);
}

check('manifest.version is number', typeof manifest.version === 'number');
check('manifest has logicalViewport', manifest.logicalViewport?.width === 390 && manifest.logicalViewport?.height === 844);

const stages = manifest.stages ?? [];
check('manifest has stages array', Array.isArray(stages) && stages.length > 0);

for (let n = 1; n <= 5; n++) {
  check(`stage-0${n} exists in manifest`, stages.some((s) => s.number === n && s.id === `stage-0${n}`));
}

const ids = stages.map((s) => s.id);
const numbers = stages.map((s) => s.number);
const slugs = stages.map((s) => s.slug);
const envPaths = stages.map((s) => s.environment);

check('no duplicate ids', new Set(ids).size === ids.length, ids.filter((id, i) => ids.indexOf(id) !== i).join(', '));
check('no duplicate numbers', new Set(numbers).size === numbers.length);
check('no duplicate slugs', new Set(slugs).size === slugs.length);
check('no duplicate environment paths', new Set(envPaths).size === envPaths.length);

for (const stage of stages) {
  const prefix = `[${stage.id}]`;

  check(`${prefix} has name`, typeof stage.name === 'string' && stage.name.length > 0);
  check(`${prefix} has slug`, typeof stage.slug === 'string' && stage.slug.length > 0);
  check(`${prefix} status is prototype`, stage.status === 'prototype');

  check(`${prefix} environment path starts with /assets/`, stage.environment.startsWith('/assets/'));

  const imgFile = resolve(ROOT, 'public', stage.environment.replace(/^\//, ''));
  const imgExists = existsSync(imgFile);
  check(`${prefix} environment image exists`, imgExists);

  if (imgExists) {
    const stat = statSync(imgFile);
    check(`${prefix} image is not 0 bytes`, stat.size > 0);

    const header = Buffer.alloc(8);
    const fd = openSync(imgFile, 'r');
    readSync(fd, header, 0, 8, 0);
    closeSync(fd);
    const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
    check(`${prefix} image is PNG`, isPng);

    if (isPng) {
      const buf = readFileSync(imgFile);
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      check(`${prefix} image is portrait (height > width)`, height > width, `${width}x${height}`);

      const metaFile = resolve(BG_DIR, stage.id, 'meta.json');
      if (existsSync(metaFile)) {
        const meta = JSON.parse(readFileSync(metaFile, 'utf8'));
        check(`${prefix} meta width matches image`, meta.width === width, `meta=${meta.width} image=${width}`);
        check(`${prefix} meta height matches image`, meta.height === height, `meta=${meta.height} image=${height}`);
      }
    }
  }

  const metaPath = resolve(ROOT, 'public', stage.meta.replace(/^\//, ''));
  const metaExists = existsSync(metaPath);
  check(`${prefix} meta.json exists`, metaExists);

  if (metaExists) {
    try {
      const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
      check(`${prefix} meta has required fields`, Boolean(meta.id && meta.name && meta.character && meta.symbol));
      check(`${prefix} meta id matches stage id`, meta.id === stage.id);
      check(`${prefix} meta number matches stage number`, meta.number === stage.number);
      check(`${prefix} meta image filename is ASCII`, /^[\x20-\x7e]+$/.test(meta.image));
      check(`${prefix} meta image matches environment-master.png`, basename(stage.environment) === meta.image);
    } catch (e) {
      check(`${prefix} meta parses as JSON`, false, String(e));
    }
  }
}

printResults();

function printResults(): void {
  const failed = checks.filter((c) => !c.ok);
  for (const c of checks) {
    console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.label}${c.detail ? `  (${c.detail})` : ''}`);
  }
  console.log(`\n${checks.length} checks, ${checks.length - failed.length} passed, ${failed.length} failed`);
  if (failed.length > 0) {
    process.exit(1);
  }
}
