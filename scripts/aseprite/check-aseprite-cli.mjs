import { REQUIRED_ASEPRITE_VERSION, resolveAsepriteCli } from './aseprite-config.mjs';

const { found, checked } = resolveAsepriteCli();
if (!found) {
  console.log('Aseprite CLI: usable stable not found');
  console.log(`Required production version: ${REQUIRED_ASEPRITE_VERSION}`);
  console.log('Checked paths:');
  for (const item of checked) {
    console.log(`- ${item.path}`);
    console.log(`  executable=${item.executable} version=${item.version || 'unknown'} usable=${item.usable} reason=${item.reason}`);
  }
  console.log('Next checks:');
  console.log('- App Store / direct install: /Applications/Aseprite.app/Contents/MacOS/aseprite');
  console.log('- Steam install: ~/Library/Application Support/Steam/steamapps/common/Aseprite/Aseprite.app/Contents/MacOS/aseprite');
  console.log('- PATH install: run `command -v aseprite`');
  console.log('- Custom install: set ASEPRITE_BIN=/path/to/aseprite');
  console.log('- Do not use beta 1.3.18-beta2 for production export.');
  console.log('Aseprite is optional: pnpm test / pnpm build / pnpm generate:pixel-assets do not require it.');
  process.exit(0);
}

console.log('Aseprite CLI: usable');
console.log(`version: ${found.version}`);
console.log(`resolved path: ${found.path}`);
console.log(`usable: ${found.usable}`);
