import fs from 'node:fs';
import path from 'node:path';
import { CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX } from '../../src/game/data/characterOrdinaryLifeReservoir.ts';

const root = process.cwd();
const rosterPath = path.join(root, 'data/visual/character-living-visual-roster-v1.json');
const policyPath = path.join(root, 'data/visual/character-living-visual-master-policy.json');
const brainPath = path.join(root, 'data/visual/character-designer-ai-brain.json');
const core5Path = path.join(root, 'data/visual/core5-living-visual-profiles-v1.json');

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fail(message: string): never {
  throw new Error(`[character-living-visual-master] ${message}`);
}

const roster = readJson(rosterPath);
const policy = readJson(policyPath);
const brain = readJson(brainPath);
const core5 = readJson(core5Path);

if (roster.globalFallback?.unspecifiedMeansFreeChoice !== false) {
  fail('unspecifiedMeansFreeChoice must remain false');
}
for (const key of [
  'addUnspecifiedPiercing',
  'addUnspecifiedTattoo',
  'addUnspecifiedScarFreckleMole',
  'addUnspecifiedJewelry',
  'addUnspecifiedGemstone',
  'addUnspecifiedGoldTrim',
  'addUnspecifiedBeltsOrHarness',
  'addUnspecifiedMakeup',
  'addUnspecifiedNailArt',
  'addUnspecifiedExposure',
  'increaseOrnamentForHeroImportance',
  'replaceExistingClothingConstructionWithGenericFantasy',
] as const) {
  if (roster.globalFallback?.[key] !== false) fail(`${key} must remain false`);
}

if (roster.generationRule?.unknownMayNotBeFilledByImageModel !== true) {
  fail('unknownMayNotBeFilledByImageModel must remain true');
}
if (roster.generationRule?.candidateBodyModificationMayNotBePromotedAutomatically !== true) {
  fail('candidate body modifications must not auto-promote');
}

const expected = CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX.map((entry) => ({
  id: entry.id,
  name: entry.name,
  roster: entry.roster,
}));
const actual = roster.characters ?? [];
if (actual.length !== 36) fail(`expected 36 characters, got ${actual.length}`);
if (new Set(actual.map((entry: any) => entry.id)).size !== 36) fail('character ids must be unique');

const actualById = new Map(actual.map((entry: any) => [entry.id, entry]));
for (const expectedEntry of expected) {
  const entry: any = actualById.get(expectedEntry.id);
  if (!entry) fail(`missing character: ${expectedEntry.id}`);
  if (entry.name !== expectedEntry.name) fail(`name mismatch for ${expectedEntry.id}`);
  if (entry.roster !== expectedEntry.roster) fail(`roster mismatch for ${expectedEntry.id}`);
  if (entry.preserveAppearanceContract !== true) fail(`${expectedEntry.id}: must preserve appearance contract`);
  if (!entry.piercing || !entry.tattoo || !entry.exposure || !entry.ornament || !entry.clothing) {
    fail(`${expectedEntry.id}: missing anti-drift living visual field`);
  }
  if (!Array.isArray(entry.requiredNext) || entry.requiredNext.length < 5) {
    fail(`${expectedEntry.id}: requiredNext must contain at least five authoring dimensions`);
  }
}

const current21 = actual.filter((entry: any) => entry.roster === 'CURRENT21').length;
const future15 = actual.filter((entry: any) => entry.roster === 'FUTURE15').length;
if (current21 !== 21 || future15 !== 15) fail(`coverage mismatch: Current21=${current21}, Future15=${future15}`);

if (policy.unknownPolicy?.highResolutionGenerationBlockedByUnknown !== true) {
  fail('policy must block generation on unresolved unknowns');
}
if (policy.unknownPolicy?.aiMayFillUnknownDuringGeneration !== false) {
  fail('policy must forbid model invention of unknowns');
}

const readOrder: string[] = brain.authorityReadOrder ?? [];
const masterIndex = readOrder.indexOf('docs/visual/character-living-visual-master-v1.md');
const appearanceIndex = readOrder.indexOf('docs/character-appearance-source-book-v1.md');
if (masterIndex < 0) fail('Designer AI read order must include living visual master');
if (appearanceIndex < 0 || masterIndex > appearanceIndex) {
  fail('Living Visual Master must be read before Appearance Source Book');
}

const expectedCore5 = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];
const detailed = core5.characters ?? [];
if (detailed.length !== expectedCore5.length) fail(`Core5 detailed profile count must be ${expectedCore5.length}`);
const detailedById = new Map(detailed.map((entry: any) => [entry.id, entry]));
for (const id of expectedCore5) {
  const entry: any = detailedById.get(id);
  if (!entry) fail(`missing detailed Core5 profile: ${id}`);
  for (const field of [
    'bodyComfort','exposurePreference','temperatureAndComfort','movementNeeds','piercingPolicy','tattooPolicy',
    'jewelryPolicy','makeupPolicy','nailPolicy','silhouettePreference','fitPreference','materialPreference',
    'colorRelationship','patternPreference','footwearPreference','bagPocketBehavior','clothingWearHabits',
    'acquisitionPreference','maintenanceBehavior','wardrobeBreadth','socialPresentation','privatePublicCeremonial',
    'hairGroomingBehavior','absoluteNever','positivePreference',
  ]) {
    if (entry[field] == null) fail(`${id}: missing detailed field ${field}`);
  }
  if (!Array.isArray(entry.absoluteNever) || entry.absoluteNever.length < 5) fail(`${id}: absoluteNever < 5`);
  if (!Array.isArray(entry.positivePreference) || entry.positivePreference.length < 5) fail(`${id}: positivePreference < 5`);
  const exposureKeys = ['shoulders','upperArms','chestNeckline','midriff','back','thighs','knees','legs'];
  for (const key of exposureKeys) {
    if (!entry.exposurePreference?.[key]) fail(`${id}: exposurePreference.${key} missing`);
  }
}

console.log(`[character-living-visual-master] OK: ${actual.length} characters (${current21} Current21 / ${future15} Future15); detailed Core5=${detailed.length}`);
