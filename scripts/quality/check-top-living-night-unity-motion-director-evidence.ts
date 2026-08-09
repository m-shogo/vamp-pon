import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const verifierPath =
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightCompositeV3UnityVerification.cs';
const evidencePath =
  'docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(join(root, verifierPath)), 'TOP V3 Unity verifier is missing');
invariant(existsSync(join(root, evidencePath)), 'TOP V3 Unity evidence is missing');

const verifier = readFileSync(join(root, verifierPath), 'utf8');
const evidence = JSON.parse(readFileSync(join(root, evidencePath), 'utf8')) as {
  executed: boolean;
  result: string;
  ambientMotionDirectorResolved: boolean;
  fireCadenceDirectorResolved: boolean;
};

for (const token of [
  'typeof(TopLivingNightAmbientMotionDirector)',
  'typeof(TopLivingNightFireCadenceDirector)',
  'ambientMotionDirectorResolved = true;',
  'fireCadenceDirectorResolved = true;',
  'ambientMotionDirectorResolved = result == "PASSED" && ambientMotionDirectorResolved',
  'fireCadenceDirectorResolved = result == "PASSED" && fireCadenceDirectorResolved',
  'public bool ambientMotionDirectorResolved;',
  'public bool fireCadenceDirectorResolved;',
]) {
  invariant(verifier.includes(token), `TOP Unity verifier lost motion-director evidence contract: ${token}`);
}

if (!evidence.executed) {
  invariant(evidence.result === 'NOT_RUN', 'unexecuted TOP V3 Unity evidence must remain NOT_RUN');
  invariant(
    evidence.ambientMotionDirectorResolved === false,
    'unexecuted TOP V3 evidence cannot claim ambient-motion director resolution',
  );
  invariant(
    evidence.fireCadenceDirectorResolved === false,
    'unexecuted TOP V3 evidence cannot claim fire-cadence director resolution',
  );
} else if (evidence.result === 'PASSED') {
  invariant(
    evidence.ambientMotionDirectorResolved === true,
    'PASSED TOP V3 Unity evidence requires ambient-motion director resolution',
  );
  invariant(
    evidence.fireCadenceDirectorResolved === true,
    'PASSED TOP V3 Unity evidence requires fire-cadence director resolution',
  );
}

console.log('TOP V3 Unity motion-director evidence contract: PASS');
console.log(`ambient=${evidence.ambientMotionDirectorResolved} fireCadence=${evidence.fireCadenceDirectorResolved} executed=${evidence.executed}`);
