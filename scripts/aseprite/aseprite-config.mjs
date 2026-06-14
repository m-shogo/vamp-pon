import { accessSync, constants } from 'node:fs';
import { spawnSync } from 'node:child_process';

export const REQUIRED_ASEPRITE_VERSION = '1.3.17.1';
export const BETA_ASEPRITE_VERSION = '1.3.18-beta2';

export const PLAYER_ASEPRITE_EXPORTS = [
  {
    id: 'yui_idle',
    source: 'assets/source/aseprite/player/yui_idle.aseprite',
    target: 'public/assets/sprites/player/yui_idle_32.png',
    manifestPath: 'assets/sprites/player/yui_idle_32.png',
    width: 32,
    height: 32,
  },
  {
    id: 'yui_move',
    source: 'assets/source/aseprite/player/yui_move.aseprite',
    target: 'public/assets/sprites/player/yui_move_32.png',
    manifestPath: 'assets/sprites/player/yui_move_32.png',
    width: 32,
    height: 32,
  },
  {
    id: 'yui_hurt',
    source: 'assets/source/aseprite/player/yui_hurt.aseprite',
    target: 'public/assets/sprites/player/yui_hurt_32.png',
    manifestPath: 'assets/sprites/player/yui_hurt_32.png',
    width: 32,
    height: 32,
  },
  {
    id: 'yui_ultimate',
    source: 'assets/source/aseprite/player/yui_ultimate.aseprite',
    target: 'public/assets/sprites/player/yui_ultimate_32.png',
    manifestPath: 'assets/sprites/player/yui_ultimate_32.png',
    width: 32,
    height: 32,
  },
];

export function asepriteCandidatePaths({ env = process.env } = {}) {
  return [
    env.ASEPRITE_BIN,
    '/Applications/Aseprite.app/Contents/MacOS/aseprite',
    `${env.HOME}/Library/Application Support/Steam/steamapps/common/Aseprite/Aseprite.app/Contents/MacOS/aseprite`,
    findOnPath('aseprite'),
  ].filter(Boolean);
}

export function findOnPath(bin) {
  const result = spawnSync('command', ['-v', bin], { encoding: 'utf8', shell: true });
  return result.status === 0 ? result.stdout.trim() : '';
}

export function canExecute(path) {
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

export function readAsepriteVersion(path) {
  const result = spawnSync(path, ['--version'], { encoding: 'utf8' });
  const output = `${result.stdout}\n${result.stderr}`.trim();
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    output,
    version: parseAsepriteVersion(output),
  };
}

export function parseAsepriteVersion(output) {
  const match = output.match(/(?:Aseprite\s+)?v?(\d+\.\d+\.\d+(?:\.\d+)?(?:-[\w.]+)?)/i);
  return match?.[1] ?? '';
}

export function resolveAsepriteCli() {
  const checked = [];
  for (const path of asepriteCandidatePaths()) {
    const executable = canExecute(path);
    const info = { path, executable, usable: false, version: '', reason: executable ? '' : 'not executable' };
    if (executable) {
      const versionInfo = readAsepriteVersion(path);
      info.version = versionInfo.version;
      if (!versionInfo.ok) {
        info.reason = `version command failed (${versionInfo.status})`;
      } else if (info.version === BETA_ASEPRITE_VERSION || info.version.includes('beta')) {
        info.reason = `beta version is not allowed for production export (${info.version})`;
      } else if (info.version !== REQUIRED_ASEPRITE_VERSION) {
        info.reason = `expected stable ${REQUIRED_ASEPRITE_VERSION}, got ${info.version || 'unknown'}`;
      } else {
        info.usable = true;
        info.reason = 'ok';
      }
    }
    checked.push(info);
  }
  return { found: checked.find((item) => item.usable) ?? null, checked };
}
