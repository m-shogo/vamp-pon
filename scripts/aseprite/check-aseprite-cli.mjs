import { accessSync, constants } from 'node:fs';
import { spawnSync } from 'node:child_process';

const candidates = [
  process.env.ASEPRITE_BIN,
  '/Applications/Aseprite.app/Contents/MacOS/aseprite',
  `${process.env.HOME}/Library/Application Support/Steam/steamapps/common/Aseprite/Aseprite.app/Contents/MacOS/aseprite`,
  findOnPath('aseprite'),
].filter(Boolean);

function canExecute(path) {
  try {
    accessSync(path, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function findOnPath(bin) {
  const result = spawnSync('command', ['-v', bin], { encoding: 'utf8', shell: true });
  return result.status === 0 ? result.stdout.trim() : '';
}

const found = candidates.find(canExecute);

if (!found) {
  console.log('Aseprite CLI: not found');
  console.log('Checked paths:');
  for (const path of candidates) console.log(`- ${path}`);
  console.log('Next checks:');
  console.log('- App Store / direct install: /Applications/Aseprite.app/Contents/MacOS/aseprite');
  console.log('- Steam install: ~/Library/Application Support/Steam/steamapps/common/Aseprite/Aseprite.app/Contents/MacOS/aseprite');
  console.log('- PATH install: run `command -v aseprite`');
  console.log('- Custom install: set ASEPRITE_BIN=/path/to/aseprite');
  console.log('Aseprite is optional: pnpm test / pnpm build / pnpm generate:pixel-assets do not require it.');
  process.exit(0);
}

const result = spawnSync(found, ['--version'], { encoding: 'utf8' });
console.log(`Aseprite CLI: found at ${found}`);
if (result.stdout.trim()) console.log(result.stdout.trim());
if (result.stderr.trim()) console.error(result.stderr.trim());
process.exit(result.status ?? 0);
