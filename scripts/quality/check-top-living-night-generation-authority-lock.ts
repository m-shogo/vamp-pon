import './check-top-living-night-v3-unity-runner.ts';
import './check-top-living-night-automation-entrypoints.ts';
import './check-top-living-night-core5-layout-proof-generator.ts';
import './check-top-living-night-preproduction-workflow.ts';
import './check-top-living-night-model-input-order.ts';
import './check-top-living-night-model-input-bundle-binding.ts';
import './check-top-living-night-final-art-intake-workflow.ts';
import './check-top-living-night-final-art-intake-bundle.ts';
import './check-top-living-night-final-art-intake-behavior.ts';
import './check-top-living-night-ambient-motion-director.ts';
import './check-top-living-night-fire-cadence-director.ts';
import './check-top-living-night-motion-director-review-sync.ts';
import './check-top-living-night-unity-motion-director-evidence.ts';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const authorities = [
  {
    path: 'docs/design-targets/generated/top-living-night-v3/final-key-art-generation-prompt.md',
    expectedGitBlobSha1: '4758ab4e22acc33482ccf6364dff1e52b0b6cd20',
  },
  {
    path: 'docs/design-targets/generated/top-living-night-v3/final-key-art-isolated-prompt.txt',
    expectedGitBlobSha1: 'c7456bf22125e14aebed8503ff6903f2a9f492c2',
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
  bundle.isolatedPromptAuthority === authorities[1].path,
  'generation bundle must bind the isolated generation prompt authority',
);
for (const forbidden of ['GitHub', 'pull request', 'CI status', 'roadmap panel', 'progress dashboard']) {
  invariant(!isolatedPrompt.includes(forbidden), `isolated prompt reintroduced development context: ${forbidden}`);
}
for (const required of [
  'One continuous illustration only.',
  'No typography, no logo, no interface',
  'Exactly five foreground humans',
  'any dashboard',
  'any infographic',
  'any development/status information',
]) {
  invariant(isolatedPrompt.includes(required), `isolated generation prompt lost visual-only guard: ${required}`);
}

console.log('TOP Living Night generation authority lock: PASS');
console.log('full prompt + isolated visual-only prompt + identity brief are explicitly locked');
console.log('isolated prompt is bundle-bound and excludes development/status/dashboard context');
