import { existsSync, statSync } from 'node:fs';

// Verifies the procedural finisher produced its outputs (script-assisted route).
// It does NOT judge visual quality (that is the human review pass) and it does
// NOT claim the result is hand-final.

const expected = [
  'assets/source/prototypes/yui_idle_52_v2a_pf.aseprite',
  'public/assets/prototypes/yui_idle_52_v2a_pf.png',
];

let failed = 0;
for (const file of expected) {
  const ok = existsSync(file) && statSync(file).size > 0;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${file}`);
  if (!ok) failed += 1;
}

if (failed > 0) {
  console.error(`\naseprite:pixel-finisher:verify failed (${failed} missing/empty)`);
  console.error('Run `pnpm aseprite:pixel-finisher:yui52` first.');
  process.exit(1);
}

console.log('\naseprite:pixel-finisher:verify passed (script-assisted-candidate outputs present).');
console.log('Reminder: these are NOT hand-final. player/main still need human review.');
