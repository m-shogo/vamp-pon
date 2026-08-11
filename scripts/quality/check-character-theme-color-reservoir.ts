import fs from 'node:fs';
import { CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX } from '../../src/game/data/characterOrdinaryLifeReservoir.ts';
import {
  CHARACTER_THEME_COLOR_RULES,
  CHARACTER_THEME_COLOR_CANDIDATES,
  characterThemeColorSummary,
} from '../../src/game/data/characterThemeColorReservoir.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const HEX = /^#[0-9A-F]{6}$/i;

for (const path of [
  'docs/00-current-story-world-master.md',
  'docs/character-theme-color-reservoir-v1.md',
  'docs/character-ordinary-life-reservoir-v1.md',
  'src/game/data/characterOrdinaryLifeReservoir.ts',
  'src/game/data/characterThemeColorReservoir.ts',
]) assert(fs.existsSync(path), `missing theme-color source: ${path}`);

assert(CHARACTER_THEME_COLOR_RULES.status === 'AUTHOR_RESERVOIR_NON_CANON', 'theme color layer must remain reservoir');
assert(CHARACTER_THEME_COLOR_RULES.characterCoverageRequired === 36, 'theme color target must remain 36');
assert(CHARACTER_THEME_COLOR_RULES.primaryHexMustBeUniqueAcrossWorking36, 'working Primary HEX must remain unique');
assert(!CHARACTER_THEME_COLOR_RULES.exactFinalPaletteFrozenHere, 'final palette may not be frozen here');
assert(!CHARACTER_THEME_COLOR_RULES.themeColorChangesSkinHairEyes, 'theme color may not recolor physical identity');
assert(!CHARACTER_THEME_COLOR_RULES.themeColorDeterminesCostumePalette, 'theme color may not lock costume palette');
assert(!CHARACTER_THEME_COLOR_RULES.themeColorDeterminesMoralityOrFaction, 'theme color may not determine morality/faction');
assert(!CHARACTER_THEME_COLOR_RULES.themeColorAloneMayEncodeRelationship, 'color alone may not encode relationship');
assert(!CHARACTER_THEME_COLOR_RULES.themeColorAloneMayEncodeBloodline, 'color alone may not encode bloodline');
assert(!CHARACTER_THEME_COLOR_RULES.constellationInfluenceFrozenHere, 'constellation influence may not be frozen here');
assert(!CHARACTER_THEME_COLOR_RULES.starBeastInfluenceFrozenHere, 'Star Beast influence may not be frozen here');
assert(!CHARACTER_THEME_COLOR_RULES.colorOnlyAccessibilityAllowed, 'color-only accessibility may not be allowed');
assert(!CHARACTER_THEME_COLOR_RULES.runtimeAutoPromotionAllowed, 'theme colors may not auto-promote runtime');

assert(characterThemeColorSummary.characterCount === 36, 'theme color candidates must cover 36/36');
assert(characterThemeColorSummary.uniqueIds === 36, 'theme color IDs must be unique');
assert(characterThemeColorSummary.uniquePrimaryHexCount === 36, 'all 36 Primary HEX values must be unique');
assert(characterThemeColorSummary.uniqueAccentHexCount === 36, 'all 36 Accent HEX values must be unique');
assert(characterThemeColorSummary.uniqueNightGlowHexCount === 36, 'all 36 Night Glow HEX values must be unique');
assert(characterThemeColorSummary.siblingHueFamilyMembers === 2, 'Ritsu/Koyori sibling hue family must contain exactly 2 members');
assert(characterThemeColorSummary.twinHueFamilyMembers === 2, 'Kai/Nao twin hue family must contain exactly 2 members');
assert(characterThemeColorSummary.allConstellationInfluenceOpen, 'constellation influence must remain Open for all 36');
assert(characterThemeColorSummary.allFinalUnapproved, 'all theme colors must remain unapproved candidates');
assert(!characterThemeColorSummary.runtimeAutoPromotionAllowed, 'theme color summary may not auto-promote runtime');

const ordinaryById = new Map(CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.map((entry) => [entry.id, entry.name]));
assert(ordinaryById.size === 36, 'ordinary-life upstream must remain 36');
for (const entry of CHARACTER_THEME_COLOR_CANDIDATES) {
  assert(ordinaryById.get(entry.id) === entry.name, `theme-color id/name drift: ${entry.id}`);
  assert(HEX.test(entry.primaryHex), `invalid primary HEX: ${entry.id}/${entry.primaryHex}`);
  assert(HEX.test(entry.accentHex), `invalid accent HEX: ${entry.id}/${entry.accentHex}`);
  assert(HEX.test(entry.nightGlowHex), `invalid night glow HEX: ${entry.id}/${entry.nightGlowHex}`);
  assert(entry.rationale.length > 24, `theme color rationale too thin: ${entry.id}`);
  assert(entry.constellationInfluenceStatus === 'OPEN_REVIEW_LATER', `constellation influence froze: ${entry.id}`);
  assert(!entry.finalApproved, `theme color approved prematurely: ${entry.id}`);
}

const ritsu = CHARACTER_THEME_COLOR_CANDIDATES.find((entry) => entry.id === 'ritsu');
const koyori = CHARACTER_THEME_COLOR_CANDIDATES.find((entry) => entry.id === 'koyori');
const kai = CHARACTER_THEME_COLOR_CANDIDATES.find((entry) => entry.id === 'kai');
const nao = CHARACTER_THEME_COLOR_CANDIDATES.find((entry) => entry.id === 'nao');
const yui = CHARACTER_THEME_COLOR_CANDIDATES.find((entry) => entry.id === 'yui');
const nagi = CHARACTER_THEME_COLOR_CANDIDATES.find((entry) => entry.id === 'nagi');
const tomori = CHARACTER_THEME_COLOR_CANDIDATES.find((entry) => entry.id === 'tomori');
const touma = CHARACTER_THEME_COLOR_CANDIDATES.find((entry) => entry.id === 'touma');
assert(ritsu?.familyHueCandidate === 'RITSU_KOYORI_ROSE_FAMILY' && koyori?.familyHueCandidate === 'RITSU_KOYORI_ROSE_FAMILY', 'Ritsu/Koyori hue-family relation drift');
assert(kai?.familyHueCandidate === 'KAI_NAO_COOL_SKY_TWIN_FAMILY' && nao?.familyHueCandidate === 'KAI_NAO_COOL_SKY_TWIN_FAMILY', 'Kai/Nao hue-family relation drift');
assert(yui?.familyHueCandidate === null && nagi?.familyHueCandidate === null, 'Nagi/Yui candidate lineage must not become color proof');
assert(tomori?.familyHueCandidate === null && touma?.familyHueCandidate === null, 'Tomori/Touma candidate lineage must not become color proof');
assert(yui?.primaryHex !== nagi?.primaryHex, 'Nagi/Yui may not share Primary HEX as hidden lineage clue');
assert(tomori?.primaryHex !== touma?.primaryHex, 'Tomori/Touma may not share Primary HEX as hidden lineage clue');

const doc = fs.readFileSync('docs/character-theme-color-reservoir-v1.md', 'utf8');
assert(doc.includes('AUTHOR RESERVOIR / NON-CANON / HEX CANDIDATES / FREE TO OVERWRITE'), 'theme color doc status drift');
assert(doc.includes('All 36 Primary HEX are unique in this working set.'), 'unique-primary statement missing');
assert(doc.includes('Theme color ≠ skin color'), 'skin-color separation missing');
assert(doc.includes('Ritsu / Koyori — sibling rose family'), 'sibling hue family documentation missing');
assert(doc.includes('Kai / Nao — twin cool-sky family'), 'twin hue family documentation missing');
assert(doc.includes('Nagi / Yui') && doc.includes('Tomori / Touma'), 'candidate lineage color guards missing');
assert(doc.includes('color-only UI forbidden'), 'color-only accessibility guard missing');
assert(doc.includes('色はCharacterを覚える補助線。Characterそのものを一色へ潰さない。'), 'theme color principle missing');

console.log(JSON.stringify({
  characters: characterThemeColorSummary.characterCount,
  uniquePrimaryHex: characterThemeColorSummary.uniquePrimaryHexCount,
  uniqueAccentHex: characterThemeColorSummary.uniqueAccentHexCount,
  uniqueNightGlowHex: characterThemeColorSummary.uniqueNightGlowHexCount,
  siblingHueFamilyMembers: characterThemeColorSummary.siblingHueFamilyMembers,
  twinHueFamilyMembers: characterThemeColorSummary.twinHueFamilyMembers,
  constellationInfluenceFrozen: false,
  runtimeAutoPromotionAllowed: false,
}, null, 2));
