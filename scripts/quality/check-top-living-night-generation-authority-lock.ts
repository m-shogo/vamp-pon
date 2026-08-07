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
const brief = readFileSync(join(root, authorities[1].path), 'utf8');
for (const token of ['Yui', 'Asa', 'Nagi', 'Michiru', 'Tomori']) {
  invariant(prompt.includes(token), `generation prompt lost Core5 identity: ${token}`);
  invariant(brief.includes(token), `identity brief lost Core5 identity: ${token}`);
}
invariant(prompt.includes('Do not add a sixth foreground human.'), 'generation prompt lost sixth-human exclusion');
invariant(brief.includes('Do not invent substitute characters or merge identities.'), 'identity brief lost substitute/merge exclusion');

console.log('TOP Living Night generation authority lock: PASS');
console.log('prompt + identity brief revisions are explicitly locked; intentional edits require lock review');
