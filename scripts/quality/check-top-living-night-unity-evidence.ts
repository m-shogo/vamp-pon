import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const evidencePath = join(
  process.cwd(),
  'docs/design-targets/generated/top-living-night-v2/runtime-unity-verification.json',
);

const evidence = JSON.parse(readFileSync(evidencePath, 'utf8')) as {
  schemaVersion: number;
  executed: boolean;
  result: string;
  verifiedCommit: string;
  unityVersion: string;
  assertionCount: number;
  failureCount: number;
  sourceAssetCount: number;
  viewTypeResolved: boolean;
  buildHookResolved: boolean;
  manifestProvenancePassed: boolean;
  generatedAtUtc: string;
  error: string;
};

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(evidence.schemaVersion === 1, 'unexpected TOP Unity evidence schema');
invariant(evidence.sourceAssetCount === 17, 'TOP Unity evidence asset count mismatch');

if (evidence.executed) {
  invariant(evidence.result === 'PASSED', 'executed TOP Unity verification must pass');
  invariant(/^[0-9a-f]{40}$/.test(evidence.verifiedCommit), 'executed evidence commit is missing');
  invariant(/^6000\.5\./.test(evidence.unityVersion), 'executed evidence Unity version mismatch');
  invariant(evidence.assertionCount >= 95, 'executed evidence assertion count is too low');
  invariant(evidence.failureCount === 0, 'executed evidence must have no failures');
  invariant(evidence.viewTypeResolved === true, 'TOP view type was not resolved');
  invariant(evidence.buildHookResolved === true, 'TOP build hook was not resolved');
  invariant(evidence.manifestProvenancePassed === true, 'TOP manifest provenance did not pass');
  invariant(Boolean(evidence.generatedAtUtc), 'executed evidence timestamp is missing');
  invariant(evidence.error === '', 'executed passing evidence must not contain an error');
  console.log(
    `top living night Unity evidence: PASSED at ${evidence.verifiedCommit.slice(0, 12)} (${evidence.assertionCount} assertions)`,
  );
} else {
  invariant(evidence.result === 'NOT_RUN', 'unexecuted evidence result must be NOT_RUN');
  invariant(evidence.verifiedCommit === '', 'unexecuted evidence commit must be empty');
  invariant(evidence.unityVersion === '', 'unexecuted evidence Unity version must be empty');
  invariant(evidence.assertionCount === 0, 'unexecuted evidence assertion count must be zero');
  invariant(evidence.failureCount === 0, 'unexecuted evidence failure count must be zero');
  invariant(evidence.viewTypeResolved === false, 'unexecuted view type flag must remain false');
  invariant(evidence.buildHookResolved === false, 'unexecuted build hook flag must remain false');
  invariant(
    evidence.manifestProvenancePassed === false,
    'unexecuted provenance flag must remain false',
  );
  invariant(evidence.generatedAtUtc === '', 'unexecuted evidence timestamp must be empty');
  invariant(evidence.error === '', 'unexecuted evidence error must be empty');
  console.log('top living night Unity evidence: NOT_RUN (honest execution boundary preserved)');
}
