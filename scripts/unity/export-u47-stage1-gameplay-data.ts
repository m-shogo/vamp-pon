import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { evolutions, requiredMainWeaponLevel, requiredSecondaryWeaponLevel } from '../../src/game/data/evolutions.ts';
import { passives } from '../../src/game/data/passives.ts';
import { rareItems } from '../../src/game/data/rareItems.ts';
import { weapons } from '../../src/game/data/weapons.ts';
import { DEFAULT_GAME_CONFIG } from '../../src/game/domain/constants.ts';

const root = resolve(import.meta.dirname, '../..');
const outputPath = resolve(root, 'data/unity/u47-stage1-gameplay.json');
const summaryPath = resolve(root, 'data/unity/u47-stage1-gameplay.summary.json');

const ids = {
  character: ['yui'],
  weapons: ['night_pencil', 'black_ink_bottle', 'streetlamp_ring', 'unforgotten_name', 'dawn_ink_lamp'],
  passives: ['old_ticket', 'gold_compass', 'travel_badge', 'white_margin'],
  rareItems: ['name_tag', 'dawn_ticket'],
  evolutions: ['unforgotten_name_awakening', 'dawn_ink_lamp_fusion'],
} as const;

const select = <T extends { id: string }>(all: T[], wanted: readonly string[], kind: string): T[] =>
  wanted.map((id) => {
    const value = all.find((entry) => entry.id === id);
    if (!value) throw new Error(`Missing ${kind}: ${id}`);
    return value;
  });

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');
const stableJson = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

const characterSource = readFileSync(resolve(root, 'src/game/data/characters.ts'), 'utf8');
const yuiMatch = characterSource.match(/id: 'yui',[\s\S]*?name: '([^']+)'[\s\S]*?title: '([^']+)'[\s\S]*?initialWeaponId: '([^']+)'[\s\S]*?baseStats: \{ hp: ([\d.]+), moveSpeed: ([\d.]+), might: ([\d.]+), cooldownMultiplier: ([\d.]+), magnetMultiplier: ([\d.]+), xpMultiplier: ([\d.]+) \}/);
if (!yuiMatch) throw new Error('Unable to parse Yui gameplay fields from characters.ts');
const character = {
  id: 'yui', name: yuiMatch[1], title: yuiMatch[2], initialWeaponId: yuiMatch[3],
  baseStats: {
    hp: Number(yuiMatch[4]), moveSpeed: Number(yuiMatch[5]), might: Number(yuiMatch[6]),
    cooldownMultiplier: Number(yuiMatch[7]), magnetMultiplier: Number(yuiMatch[8]), xpMultiplier: Number(yuiMatch[9]),
  },
};

const selectedEvolutions = select(evolutions, ids.evolutions, 'evolution').map((evolution) => ({
  ...evolution,
  requiredWeaponLevel: requiredMainWeaponLevel(evolution),
  requiredWeaponLevel2: evolution.requiredWeaponId ? requiredSecondaryWeaponLevel(evolution) : 0,
}));

const sourceFiles = [
  'src/game/data/characters.ts', 'src/game/data/weapons.ts', 'src/game/data/passives.ts',
  'src/game/data/rareItems.ts', 'src/game/data/evolutions.ts', 'src/game/domain/types.ts',
  'src/game/domain/constants.ts', 'src/game/systems/levelup.ts', 'src/game/systems/passives.ts',
  'src/game/systems/survivalRevival.ts',
];

const content = {
  schemaVersion: 1,
  source: 'src/game/data',
  sourceFiles,
  character,
  inventoryLimits: {
    weaponSlots: DEFAULT_GAME_CONFIG.weaponSlots,
    passiveSlots: DEFAULT_GAME_CONFIG.passiveSlots,
    rareItemSlots: DEFAULT_GAME_CONFIG.rareItemSlots,
  },
  weapons: select(weapons, ids.weapons, 'weapon'),
  passives: select(passives, ids.passives, 'passive'),
  rareItems: select(rareItems, ids.rareItems, 'rare item'),
  evolutions: selectedEvolutions,
  excludedIds: {
    weapons: weapons.map(({ id }) => id).filter((id) => !ids.weapons.includes(id as never)),
    passives: passives.map(({ id }) => id).filter((id) => !ids.passives.includes(id as never)),
    rareItems: rareItems.map(({ id }) => id).filter((id) => !ids.rareItems.includes(id as never)),
    evolutions: evolutions.map(({ id }) => id).filter((id) => !ids.evolutions.includes(id as never)),
  },
};

const contentJson = stableJson(content);
const sourceHash = sha256(stableJson({ sourceFiles, ids, content }));
const exportHash = sha256(contentJson);
const envelope = { ...content, sourceHash, exportHash };
const envelopeJson = stableJson(envelope);
const summary = {
  schemaVersion: 1,
  sourceHash,
  exportHash,
  outputSha256: sha256(envelopeJson),
  counts: { weapons: envelope.weapons.length, passives: envelope.passives.length, rareItems: envelope.rareItems.length, evolutions: envelope.evolutions.length },
  includedIds: ids,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, envelopeJson);
writeFileSync(summaryPath, stableJson(summary));
console.log(`U47 Stage1 gameplay export written: ${outputPath}`);
console.log(`sourceHash=${sourceHash}`);
console.log(`exportHash=${exportHash}`);
