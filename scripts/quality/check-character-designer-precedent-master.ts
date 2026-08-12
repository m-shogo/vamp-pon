import fs from 'node:fs';
import path from 'node:path';
import {
  CHARACTER_REFERENCE_HANDOFF_POLICY,
  characterReferenceGenerationHandoff,
} from '../../src/game/data/characterReferenceGenerationHandoff.ts';

const root = process.cwd();
const jsonPath = path.join(root, 'data/visual/character-designer-precedent-master-v1.json');
const docPath = path.join(root, 'docs/visual/character-designer-precedent-master-v1.md');
if (!fs.existsSync(jsonPath) || !fs.existsSync(docPath)) throw new Error('[designer-precedent] missing precedent master');
const x = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
if (!Array.isArray(x.precedents) || x.precedents.length < 20) throw new Error('[designer-precedent] expected at least 20 precedents');
const byId = new Map(x.precedents.map((p: any) => [p.id, p]));
for (let i = 1; i <= 20; i += 1) {
  const id = `P${String(i).padStart(2, '0')}`;
  if (!byId.has(id)) throw new Error(`[designer-precedent] missing ${id}`);
}
const finalOrder = (byId.get('P20') as any)?.rulingOrder;
const expected = ['canon','personal-choice','physical-daily-feasibility','cast-distinction','world-causality','ordinary-acting','generic-drift','attractiveness'];
if (JSON.stringify(finalOrder) !== JSON.stringify(expected)) throw new Error('[designer-precedent] P20 decision order changed');
if (CHARACTER_REFERENCE_HANDOFF_POLICY.designerPrecedentRequired !== true) throw new Error('[designer-precedent] handoff policy must require precedent master');
for (const entry of characterReferenceGenerationHandoff) {
  if (entry.designerPrecedentRequired !== true) throw new Error(`[designer-precedent] ${entry.characterId} does not require precedent master`);
  for (const p of ['docs/visual/character-designer-precedent-master-v1.md','data/visual/character-designer-precedent-master-v1.json']) {
    if (!entry.visualAuthorityPaths.includes(p)) throw new Error(`[designer-precedent] ${entry.characterId} missing ${p}`);
  }
}
console.log(`[designer-precedent] OK: precedents=${x.precedents.length}; handoffItems=${characterReferenceGenerationHandoff.length}`);
