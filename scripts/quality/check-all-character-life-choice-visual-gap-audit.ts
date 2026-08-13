import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const fail = (message: string): never => { throw new Error(`[life-choice-gap-audit] ${message}`); };
const audit = JSON.parse(readFileSync(resolve(root, 'data/visual/all-character-life-choice-visual-gap-audit-v1.json'), 'utf8'));
const stdout = execFileSync(process.execPath, ['--experimental-strip-types', resolve(root, 'scripts/quality/build-all-character-life-choice-visual-gap-audit.ts'), '--emit-compact'], { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const match = stdout.match(/AUDIT_JSON_BEGIN\n([\s\S]*?)\nAUDIT_JSON_END/);
if (!match) fail('derived JSON block missing');
const derived = JSON.parse(match[1]);

if (audit.status !== 'DERIVED_REVIEW_ARTIFACT_NON_CANON') fail('status invalid');
if (audit.scopeCount !== 36 || audit.domainCount !== 6) fail('scope invalid');
if (JSON.stringify(audit.sourceProfileHashes) !== JSON.stringify(derived.sourceProfileHashes)) fail('source hashes stale');
if (JSON.stringify(audit.summary) !== JSON.stringify(derived.summary)) fail('summary stale');
if (audit.summary.totalDomainDecisions !== 216 || audit.summary.reviewRequiredCount !== 216) fail('decision count changed');
if (audit.summary.countsByState.SOURCE_BACKED_LOCKED !== 0 || audit.summary.countsByState.SOURCE_BACKED_ABSENCE !== 0 || audit.summary.countsByState.SOURCE_CONSTRAINED_UNRESOLVED !== 186 || audit.summary.countsByState.AUTHOR_CANDIDATE_REVIEW_REQUIRED !== 30) fail('state distribution changed');
for (const field of ['imageModelFreedom','generatedImageMayResolveGap','missingEvidenceMeansAbsence','authorCandidateCreatesCanon','genericPolicyMayServeAsCharacterEvidence']) if (audit.safety?.[field] !== false || derived.safety?.[field] !== false) fail(`safety flag changed: ${field}`);

const byId = new Map((derived.characters ?? []).map((character: any) => [character.id, character]));
if (byId.size !== 36) fail('derived roster must contain 36 unique characters');
const core5 = (audit.core5AuthorCandidates ?? []).map((character: any) => character.id).sort();
const actualCore5 = [...byId.values()].filter((character: any) => Object.values(character.domains ?? {}).every((domain: any) => domain.state === 'AUTHOR_CANDIDATE_REVIEW_REQUIRED')).map((character: any) => character.id).sort();
if (JSON.stringify(core5) !== JSON.stringify(actualCore5)) fail('Core5 candidate set stale');

const grouped = new Set<string>();
for (const group of audit.sourceConstrainedUnresolvedGroups ?? []) for (const character of group.characters ?? []) {
  grouped.add(character.id);
  const actual: any = byId.get(character.id);
  if (!actual || actual.sourceProfile !== group.sourceProfile) fail(`${character.id}: source profile changed`);
  for (const domain of audit.domains ?? []) {
    const value = actual.domains?.[domain];
    if (value?.state !== 'SOURCE_CONSTRAINED_UNRESOLVED' || (value?.evidencePaths ?? []).length !== 0) fail(`${character.id}/${domain}: audit refresh required`);
  }
}
if (grouped.size !== 31 || new Set([...core5, ...grouped]).size !== 36) fail('materialized roster coverage invalid');

console.log('[life-choice-gap-audit] OK: materialized audit matches current living visual profiles');
