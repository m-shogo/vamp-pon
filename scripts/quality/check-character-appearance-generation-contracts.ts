import {
  characterAppearanceGenerationContracts,
  characterAppearanceGenerationSummary,
} from '../../src/game/data/characterAppearanceGenerationContracts.ts';

const fail = (message: string): never => {
  throw new Error(`[character-appearance-generation-contracts] ${message}`);
};

if (characterAppearanceGenerationSummary.total !== 36) {
  fail(`expected 36 contracts, got ${characterAppearanceGenerationSummary.total}`);
}
if (characterAppearanceGenerationSummary.current21 !== 21) {
  fail(`expected Current21=21, got ${characterAppearanceGenerationSummary.current21}`);
}
if (characterAppearanceGenerationSummary.future15 !== 15) {
  fail(`expected Future15=15, got ${characterAppearanceGenerationSummary.future15}`);
}

const ids = new Set<string>();
const signatures = new Set<string>();
const composites = new Map<string, string>();

for (const entry of characterAppearanceGenerationContracts) {
  if (ids.has(entry.id)) fail(`duplicate id: ${entry.id}`);
  ids.add(entry.id);

  if (signatures.has(entry.faceSignatureId)) fail(`duplicate faceSignatureId: ${entry.faceSignatureId}`);
  signatures.add(entry.faceSignatureId);

  const requiredStrings: Array<[string, string]> = [
    ['displayName', entry.displayName],
    ['faceShape', entry.faceShape],
    ['eyeShape', entry.eyeShape],
    ['eyelid', entry.eyelid],
    ['brow', entry.brow],
    ['lashes', entry.lashes],
    ['nose', entry.nose],
    ['mouth', entry.mouth],
    ['cheekOrSurfaceMark', entry.cheekOrSurfaceMark],
    ['hairOrHeadStructure', entry.hairOrHeadStructure],
    ['bodyShape', entry.bodyShape],
    ['accessoryLanguage', entry.accessoryLanguage],
    ['clothingConstruction', entry.clothingConstruction],
    ['restingExpression', entry.restingExpression],
    ['differenceFromNearest', entry.differenceFromNearest],
  ];
  for (const [field, value] of requiredStrings) {
    if (!value.trim()) fail(`${entry.id}.${field} must be non-empty`);
  }

  if (entry.forbiddenDrift.length === 0) fail(`${entry.id}.forbiddenDrift must not be empty`);

  const composite = [
    entry.faceShape,
    entry.eyeShape,
    entry.eyelid,
    entry.brow,
    entry.lashes,
    entry.nose,
    entry.mouth,
  ].join('|');
  const existing = composites.get(composite);
  if (existing) fail(`exact morphology composite collision: ${existing} and ${entry.id}`);
  composites.set(composite, entry.id);
}

const yui = characterAppearanceGenerationContracts.find((entry) => entry.id === 'yui');
if (!yui) fail('missing yui');
if (!/dimple/i.test(`${yui.faceSignatureId} ${yui.cheekOrSurfaceMark} ${yui.forbiddenDrift.join(' ')}`)) {
  fail('Yui must explicitly preserve dimples');
}

const koyori = characterAppearanceGenerationContracts.find((entry) => entry.id === 'koyori');
if (!koyori) fail('missing koyori');
if (koyori.ageCoding !== 'CHILD') fail('Koyori must remain CHILD-coded');
if (koyori.bodyModification.length !== 0) fail('Koyori must not receive adult body modifications');
if (!koyori.forbiddenDrift.some((value) => /sexualized/i.test(value))) {
  fail('Koyori must keep explicit non-sexualization boundary');
}

const kai = characterAppearanceGenerationContracts.find((entry) => entry.id === 'F13');
const nao = characterAppearanceGenerationContracts.find((entry) => entry.id === 'F14');
if (!kai || !nao) fail('missing twin contracts');
if (!kai.intentionalResemblanceGroup || kai.intentionalResemblanceGroup !== nao.intentionalResemblanceGroup) {
  fail('Kai/Nao must share an intentional resemblance group');
}
if (kai.faceSignatureId === nao.faceSignatureId) fail('Kai/Nao still require distinct face signature IDs');

const noa = characterAppearanceGenerationContracts.find((entry) => entry.id === 'F08');
if (!noa?.intentionalResemblanceGroup) fail('Noa replica resemblance must be explicit');
if (!noa.forbiddenDrift.some((value) => /initial faces/i.test(value))) {
  fail('Noa must preserve same-snapshot initial-face rule');
}

const nonHumanIds = new Set(['F06', 'F07', 'F09']);
for (const id of nonHumanIds) {
  const entry = characterAppearanceGenerationContracts.find((candidate) => candidate.id === id);
  if (!entry) fail(`missing non-human contract ${id}`);
  if (entry.species === 'HUMAN_LIKE') fail(`${id} must not use HUMAN_LIKE morphology`);
}

console.log(
  `Character Appearance Generation Contracts: PASS (total=${characterAppearanceGenerationSummary.total}, current=${characterAppearanceGenerationSummary.current21}, future=${characterAppearanceGenerationSummary.future15}, signatures=${signatures.size}, intentionalGroups=${characterAppearanceGenerationSummary.intentionalResemblanceGroups.length})`,
);
