import fs from 'node:fs';
import path from 'node:path';
import { characterReferenceGenerationHandoff } from '../../src/game/data/characterReferenceGenerationHandoff.ts';

const root = process.cwd();
const researchPath = path.join(root, 'data/visual/character-designer-research-principles-v1.json');
if (!fs.existsSync(researchPath)) throw new Error('[designer-research-boundary] missing research principles library');

const research = JSON.parse(fs.readFileSync(researchPath, 'utf8'));
if (!Array.isArray(research.sources) || research.sources.length < 5) {
  throw new Error('[designer-research-boundary] expected at least five sourced research entries');
}
for (const source of research.sources) {
  if (!source.url || !source.generalizedPrinciples?.length || !source.yoruTranslation?.length || !source.prohibitedDirectCopy?.length) {
    throw new Error(`[designer-research-boundary] incomplete research entry: ${source.id}`);
  }
}

const forbiddenProductionAuthority = 'data/visual/character-designer-research-principles-v1.json';
for (const entry of characterReferenceGenerationHandoff) {
  if (entry.visualAuthorityPaths.includes(forbiddenProductionAuthority)) {
    throw new Error(`[designer-research-boundary] ${entry.characterId}: named-source research library must not enter production handoff`);
  }
  const productionText = `${entry.prompt ?? ''}\n${entry.negativePrompt ?? ''}`;
  for (const token of ['Buddy Daddies','Katsumi Enami','Kosuke Fujishima','Tales of Arise','Umamusume']) {
    if (productionText.includes(token)) {
      throw new Error(`[designer-research-boundary] ${entry.characterId}: source label leaked into production prompt: ${token}`);
    }
  }
}

console.log(`[designer-research-boundary] OK: sources=${research.sources.length}; production handoff remains source-name free`);
