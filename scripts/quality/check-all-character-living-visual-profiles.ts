import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p: string) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const fail = (m: string): never => { throw new Error(`[all-character-living-visual] ${m}`); };

const core5 = read('data/visual/core5-living-visual-profiles-v1.json').characters ?? [];
const current21 = read('data/visual/current21-extended-living-visual-profiles-v1.json').characters ?? [];
const future15 = read('data/visual/future15-living-visual-profiles-v1.json').characters ?? [];

const expectedCore5 = ['yui','asa','nagi','michiru','tomori'];
const expectedCurrent21 = ['sen','ritsu','koyori','gen','hana','yubi','madoka','shiro','tobari','nemu','kuroori','kage1','kage2','kage3','kage4','ren'];
const expectedFuture15 = ['hiyori','serika','chloe','renji','touma','kuu','yomo','noa','rum','maki','suzu','io','kai','nao','amane'];

function exact(label: string, entries: any[], expected: string[]) {
  const ids = entries.map((x) => x.id);
  if (ids.length !== expected.length) fail(`${label}: expected ${expected.length}, got ${ids.length}`);
  if (new Set(ids).size !== ids.length) fail(`${label}: duplicate ids`);
  for (const id of expected) if (!ids.includes(id)) fail(`${label}: missing ${id}`);
  for (const id of ids) if (!expected.includes(id)) fail(`${label}: unexpected ${id}`);
}

function lists(entry: any) {
  if (!Array.isArray(entry.absoluteNever) || entry.absoluteNever.length < 5) fail(`${entry.id}: absoluteNever < 5`);
  if (!Array.isArray(entry.positivePreference) || entry.positivePreference.length < 5) fail(`${entry.id}: positivePreference < 5`);
}

function humanExposure(id: string, exposure: any) {
  for (const key of ['shoulders','upperArms','chestNeckline','midriff','back','thighs','knees','legs']) {
    if (!exposure?.[key]) fail(`${id}: exposure.${key} missing`);
  }
}

exact('Core5', core5, expectedCore5);
for (const e of core5) {
  lists(e);
  humanExposure(e.id, e.exposurePreference);
  for (const field of ['bodyComfort','piercingPolicy','tattooPolicy','jewelryPolicy','clothingWearHabits','maintenanceBehavior','socialPresentation']) {
    if (e[field] == null) fail(`${e.id}: missing ${field}`);
  }
}

exact('Current21Extended', current21, expectedCurrent21);
for (const e of current21) {
  lists(e);
  humanExposure(e.id, e.exposure);
  for (const field of ['lifeFocus','bodyComfort','bodyModification','clothing','wearHabits','maintenance','socialPresentation']) {
    if (e[field] == null) fail(`${e.id}: missing ${field}`);
  }
  if (!e.bodyModification?.piercing || !e.bodyModification?.tattoo) fail(`${e.id}: modification policy incomplete`);
  if (!Array.isArray(e.clothing?.silhouette) || e.clothing.silhouette.length < 2) fail(`${e.id}: silhouette underdefined`);
}

exact('Future15', future15, expectedFuture15);
for (const e of future15) {
  lists(e);
  for (const field of ['species','lifeFocus','bodyComfort','bodyModification','clothing','wearHabits','maintenance','socialPresentation']) {
    if (e[field] == null) fail(`${e.id}: missing ${field}`);
  }
  if (e.species === 'HUMAN_LIKE' || e.species === 'ARTIFICIAL_PERSON') humanExposure(e.id, e.exposure);
  else if (!e.exposure?.policy) fail(`${e.id}: nonhuman exposure policy missing`);
  if (!e.bodyModification?.piercing || !e.bodyModification?.tattoo) fail(`${e.id}: modification policy incomplete`);
  if (!Array.isArray(e.clothing?.silhouette) || e.clothing.silhouette.length < 2) fail(`${e.id}: silhouette underdefined`);
}

const all = [...core5, ...current21, ...future15];
if (all.length !== 36 || new Set(all.map((e) => e.id)).size !== 36) fail('detailed coverage must be exactly 36 unique characters');
console.log(`[all-character-living-visual] OK: ${all.length} detailed profiles`);
