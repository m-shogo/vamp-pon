import { readFileSync } from 'node:fs';
import { currentMetaCurrencyDisplayName } from '../../src/game/data/metaCurrencyDisplay.ts';
import {
  PLAYER_FACING_COPY,
  PLAYER_FACING_LEGACY_COPY_TARGETS,
} from '../../src/game/data/playerFacingCopy.ts';
import {
  SETTINGS_BASELINE,
  validateSettingsBaseline,
} from '../../src/game/data/settingsBaseline.ts';
import { WORLD_TERMS } from '../../src/game/data/worldTerms.ts';

const errors: string[] = [];

function readSource(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

function requireSourceText(path: string, expected: string, description: string): void {
  if (!readSource(path).includes(expected)) {
    errors.push(`${description}: ${path} must contain ${expected}`);
  }
}

function rejectSourceText(path: string, rejected: string, description: string): void {
  if (readSource(path).includes(rejected)) {
    errors.push(`${description}: ${path} must not contain active legacy text ${rejected}`);
  }
}

if (WORLD_TERMS.product.title !== 'ヨルノシルベ') {
  errors.push('player-visible product title must be ヨルノシルベ');
}
if (WORLD_TERMS.kokuyou.transformation !== '黒耀化') {
  errors.push('Kokuyou player label must be 黒耀化');
}
if (WORLD_TERMS.records.collection !== '灯録' || WORLD_TERMS.screens.collection !== '灯録') {
  errors.push('Collection primary player label must be 灯録');
}
if (WORLD_TERMS.screens.upgrade !== '旅支度') {
  errors.push('meta growth screen player label must be 旅支度');
}
if (WORLD_TERMS.screens.initialWeapon !== '最初の灯具') {
  errors.push('initial weapon player label must be 最初の灯具');
}
if (WORLD_TERMS.economy.runFragment !== '記憶片') {
  errors.push('run-only level-up pickup must be 記憶片');
}
if (WORLD_TERMS.economy.persistentCurrency !== currentMetaCurrencyDisplayName()) {
  errors.push('world term persistent currency must source the current meta-currency formatter label');
}
if (WORLD_TERMS.economy.runFragment === WORLD_TERMS.economy.persistentCurrency) {
  errors.push('run fragment and persistent wallet must remain separate concepts');
}
if (currentMetaCurrencyDisplayName() !== '黒曜片') {
  errors.push('persistent wallet Current display must remain 黒曜片 until explicit Human naming approval');
}

if (PLAYER_FACING_COPY.firstRun.fragmentLevelUp !== '記憶片を拾ってレベルアップ。') {
  errors.push('first-run level-up copy must use the visible 記憶片 pickup name');
}
if (PLAYER_FACING_COPY.result.noBlackYoukaLabel !== '黒耀化なし') {
  errors.push('Result no-Kokuyou copy must be 黒耀化なし');
}
if (PLAYER_FACING_COPY.result.rewardsHeading !== '持ち帰り') {
  errors.push('Result rewards heading must be 持ち帰り');
}
if (PLAYER_FACING_COPY.result.newRecordsHeading !== '新しい記録') {
  errors.push('Result new-records heading must be 新しい記録');
}
if (PLAYER_FACING_COPY.result.eliteLabel !== '強敵') {
  errors.push('Result elite player label must be 強敵');
}

const requiredLegacyTargets = [
  'VAMP PON',
  '忘れ物帳',
  '黒曜研究所',
  '黒曜なし',
  'EXPを拾ってレベルアップ',
  'Rewards',
  'New Records',
  'Elite',
];
for (const target of requiredLegacyTargets) {
  if (!PLAYER_FACING_LEGACY_COPY_TARGETS.includes(target as (typeof PLAYER_FACING_LEGACY_COPY_TARGETS)[number])) {
    errors.push(`missing active production copy migration target: ${target}`);
  }
}

errors.push(...validateSettingsBaseline());
if (SETTINGS_BASELINE.length !== 4) {
  errors.push(`settings release baseline must contain exactly 4 required preferences, got ${SETTINGS_BASELINE.length}`);
}

requireSourceText('index.html', '<title>ヨルノシルベ</title>', 'browser title connection');
requireSourceText(
  'src/game/scenes/TopScene.ts',
  'PLAYER_FACING_COPY.navigation.collection',
  'Web Collection navigation connection',
);
requireSourceText(
  'src/game/scenes/CollectionScene.ts',
  'PLAYER_FACING_COPY.navigation.collection',
  'Web Collection heading connection',
);
requireSourceText(
  'src/game/scenes/StageSelectScene.ts',
  'PLAYER_FACING_COPY.navigation.growth',
  'Web growth navigation connection',
);
requireSourceText(
  'src/game/ui/overlays.ts',
  'PLAYER_FACING_COPY.firstRun.fragmentLevelUp',
  'Web first-run copy connection',
);
requireSourceText(
  'src/game/scenes/StageSelectScene.ts',
  "this.scene.start('MainScene')",
  'Web first-run reachable stage-start connection',
);
rejectSourceText(
  'src/game/scenes/StageSelectScene.ts',
  "params.set('play', '1')",
  'Web first-run stage-start bypass',
);
requireSourceText(
  'src/game/ui/overlays.ts',
  'PLAYER_FACING_COPY.result.noBlackYoukaLabel',
  'Web Result copy connection',
);
rejectSourceText('src/game/scenes/StageSelectScene.ts', "'成長へ'", 'Web active growth navigation');
rejectSourceText('src/game/scenes/StageSelectScene.ts', "'記録'", 'Web active Collection navigation');

requireSourceText(
  'src/game/scenes/SettingsScene.ts',
  'APP_PREFERENCES.update',
  'Web Settings single-owner connection',
);
requireSourceText(
  'src/game/audio/AudioManager.ts',
  'APP_PREFERENCES',
  'Web Audio preference connection',
);
requireSourceText(
  'unity/VampPonUnity/Assets/_Project/Scripts/Runtime/AppFlow/U46RuntimeShell.cs',
  'new AppPreferenceService()',
  'Unity Settings single-owner connection',
);
requireSourceText(
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/SettingsView.cs',
  '演出を控えめに',
  'Unity reduced-motion label connection',
);
requireSourceText(
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/ResultView.cs',
  'ほどいた影',
  'Unity Result copy connection',
);

if (errors.length > 0) {
  for (const error of errors) console.error(`[player-facing-foundation] ${error}`);
  process.exit(1);
}

console.log(
  `[player-facing-foundation] ok: title=${WORLD_TERMS.product.title}, ` +
    `runFragment=${WORLD_TERMS.economy.runFragment}, ` +
    `persistentCurrency=${WORLD_TERMS.economy.persistentCurrency}, ` +
    `collection=${WORLD_TERMS.screens.collection}, ` +
    `growth=${WORLD_TERMS.screens.upgrade}, ` +
    `legacyCopyTargets=${PLAYER_FACING_LEGACY_COPY_TARGETS.length}, ` +
    `settings=${SETTINGS_BASELINE.length}`,
);
