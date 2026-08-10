import './check-top-living-night-v3-unity-runner.ts';
import './check-top-living-night-automation-entrypoints.ts';
import './check-top-living-night-core5-layout-proof-generator.ts';
import './check-top-living-night-preproduction-workflow.ts';
import './check-top-living-night-model-input-order.ts';
import './check-top-living-night-model-input-bundle-binding.ts';
import './check-top-living-night-model-input-lineage.ts';
import './check-top-living-night-final-art-intake-workflow.ts';
import './check-top-living-night-final-art-intake-bundle.ts';
import './check-top-living-night-final-art-intake-behavior.ts';
import './check-top-living-night-final-art-reset-completeness.ts';
import './check-top-living-night-final-art-registrar-png-integrity.ts';
import './check-top-living-night-final-art-not-known-bridge.ts';
import './check-top-living-night-final-art-known-bridge-rejection-fixture.ts';
import './check-top-living-night-ambient-motion-director.ts';
import './check-top-living-night-fire-cadence-director.ts';
import './check-top-living-night-motion-director-review-sync.ts';
import './check-top-living-night-unity-motion-director-evidence.ts';
import './check-top-living-night-live-reduced-motion-evidence.ts';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const authorities = [
  {
    path: 'docs/design-targets/generated/top-living-night-v3/final-key-art-generation-prompt.md',
    // This is the exact prompt blob present at PR #105's generated candidate head
    // (13de89c...). Updating this lock records that real generation provenance;
    // it does not change the prompt itself or approve the resulting candidate.
    expectedGitBlobSha1: '6983c0c188d5ad18a97733ff56f683c79f621135',
  },
  {
    path: 'docs/design-targets/generated/top-living-night-v3/final-key-art-isolated-prompt.txt',
    expectedGitBlobSha1: '49319a6df51ffa7cc6f569e056668a2c1243fa12',
  },
  {
    path: 'docs/design-targets/generated/top-living-night-v3/final-identity-brief.md',
    expectedGitBlobSha1: '37b4dfa12ec23accee704c506cd5f87e83f2e948',
  },
] as const;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function gitBlobSha1(bytes: Buffer): string {
  const header = Buffer.from(`blob ${bytes.length}\0`, 'utf8');
  return createHash('sha1').update(header).update(bytes).digest('hex');
}

for (const authority of authorities) {
  const bytes = readFileSync(join(root, authority.path));
  const actual = gitBlobSha1(bytes);
  invariant(
    actual === authority.expectedGitBlobSha1,
    `${authority.path}: generation authority changed without explicit lock update; expected ${authority.expectedGitBlobSha1}, got ${actual}`,
  );
}

const prompt = readFileSync(join(root, authorities[0].path), 'utf8');
const isolatedPrompt = readFileSync(join(root, authorities[1].path), 'utf8');
const brief = readFileSync(join(root, authorities[2].path), 'utf8');
const bundle = JSON.parse(
  readFileSync(join(root, 'docs/design-targets/generated/top-living-night-v3/final-generation-bundle.json'), 'utf8'),
) as any;

for (const token of ['Yui', 'Asa', 'Nagi', 'Michiru', 'Tomori']) {
  invariant(prompt.includes(token), `generation prompt lost Core5 identity: ${token}`);
  invariant(isolatedPrompt.includes(token), `isolated generation prompt lost Core5 identity: ${token}`);
  invariant(brief.includes(token), `identity brief lost Core5 identity: ${token}`);
}
invariant(prompt.includes('Do not add a sixth foreground human.'), 'generation prompt lost sixth-human exclusion');
invariant(isolatedPrompt.includes('No sixth human.'), 'isolated prompt lost sixth-human exclusion');
invariant(brief.includes('Do not invent substitute characters or merge identities.'), 'identity brief lost substitute/merge exclusion');
invariant(
  isolatedPrompt.includes('do not make all five humans small'),
  'isolated prompt lost the mobile portrait scale hierarchy',
);
invariant(
  isolatedPrompt.includes('Yui and Asa are the clearest near/mid anchors'),
  'isolated prompt lost explicit Yui/Asa phone-scale anchors',
);
invariant(
  bundle.isolatedPromptAuthority === authorities[1].path,
  'generation bundle must bind the isolated generation prompt authority',
);
for (const forbidden of ['GitHub', 'pull request', 'CI status', 'roadmap panel', 'progress dashboard']) {
  invariant(!isolatedPrompt.includes(forbidden), `isolated prompt reintroduced development context: ${forbidden}`);
}
for (const required of [
  'INPUT ISOLATION — HIGHEST PRIORITY',
  'Ignore surrounding conversation',
  'Do not visualize the instructions themselves.',
  'never a board, document, production sheet, status screen, process graphic, comparison sheet, contact sheet, character-card sheet',
  'COMPOSITION-PLATE INTERPRETATION',
  'reconstruct believable continuous railway/station/town depth',
  'Do not preserve the dark removal shape as a flat void or visible mask boundary.',
  'One continuous full-bleed illustration only.',
  'No typography, no logo, no interface',
  'Exactly five foreground humans',
  'No elderly man, no generic traveler, no background human silhouette.',
  'any dashboard',
  'any infographic',
  'any development/status information',
  'any board/document/process visualization',
]) {
  invariant(isolatedPrompt.includes(required), `isolated generation prompt lost visual-only/isolation guard: ${required}`);
}

console.log('TOP Living Night generation authority lock: PASS');
console.log('full prompt + isolated visual-only prompt + identity brief are explicitly locked');
console.log('isolated prompt treats surrounding development context as non-input and reconstructs the sanitized midground as railway/station/town depth');
