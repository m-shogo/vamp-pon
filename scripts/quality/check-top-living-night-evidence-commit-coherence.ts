import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(join(root, relativePath), 'utf8')) as T;
}

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const motion = readJson<{
  candidatePath: string;
  candidateSha256: string;
  normalMotion: { executed: boolean; result: string };
  reducedMotion: { executed: boolean; result: string };
  verifiedCommit: string;
  motionApproved: boolean;
}>('docs/design-targets/generated/top-living-night-v3/motion-review-status.json');

const unity = readJson<{
  executed: boolean;
  result: string;
  verifiedCommit: string;
  sourceCompositeKind: string;
  sourceCompositePath: string;
  sourceCompositeSha256: string;
}>('docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json');

const capture = readJson<{
  executed: boolean;
  result: string;
  sourceCommit: string;
  topCompositeKind: string;
  topCompositePath: string;
  topCompositeSha256: string;
  expectedCaptureCount: number;
  captureCount: number;
  captures: unknown[];
}>('docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json');

const finalArt = readJson<{
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
  runtimeCaptureComplete: boolean;
  runtimeApproved: boolean;
  approvedAsFinal: boolean;
}>('docs/design-targets/generated/top-living-night-v3/final-art-status.json');

const sha40 = /^[0-9a-f]{40}$/;
const sha256 = /^[0-9a-f]{64}$/;
const canonicalCandidatePath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const canonicalBridgePath =
  'docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png';
const canonicalBridgeSha256 =
  'aac090f3f2ec7c5d7438459d5cb22bc917e43ffe36546eaf94c1389c67538b6d';
const motionExecuted = motion.normalMotion.executed || motion.reducedMotion.executed;
const unityPassed = unity.executed && unity.result === 'PASSED' && sha40.test(unity.verifiedCommit);
const capturePassed =
  capture.executed &&
  capture.result === 'PASSED' &&
  sha40.test(capture.sourceCommit) &&
  capture.expectedCaptureCount === 15 &&
  capture.captureCount === 15 &&
  capture.captures.length === 15;

invariant(finalArt.candidatePath === canonicalCandidatePath, 'final-art candidate path must remain canonical');
invariant(motion.candidatePath === canonicalCandidatePath, 'motion review candidate path must remain canonical');
invariant(motion.candidatePath === finalArt.candidatePath, 'motion review and final-art candidate paths diverged');

if (!unity.executed) {
  invariant(unity.sourceCompositeKind === '', 'NOT_RUN Unity evidence must not retain stale source kind');
  invariant(unity.sourceCompositePath === '', 'NOT_RUN Unity evidence must not retain stale source path');
  invariant(unity.sourceCompositeSha256 === '', 'NOT_RUN Unity evidence must not retain stale source SHA-256');
} else if (finalArt.candidateGenerated) {
  invariant(sha256.test(finalArt.candidateSha256), 'generated final candidate requires a valid SHA-256');
  invariant(unity.sourceCompositeKind === 'final-core5', 'generated final candidate invalidates bridge-only Unity evidence');
  invariant(unity.sourceCompositePath === canonicalCandidatePath, 'Unity evidence must target canonical final TOP path');
  invariant(unity.sourceCompositeSha256 === finalArt.candidateSha256, 'Unity evidence must target exact current final TOP bytes');
} else {
  invariant(unity.sourceCompositeKind === 'bridge', 'pre-final Unity evidence must identify bridge source');
  invariant(unity.sourceCompositePath === canonicalBridgePath, 'pre-final Unity evidence must target canonical bridge path');
  invariant(unity.sourceCompositeSha256 === canonicalBridgeSha256, 'pre-final Unity bridge SHA-256 mismatch');
}

if (!capture.executed) {
  invariant(capture.sourceCommit === '', 'NOT_RUN capture evidence must not retain a stale sourceCommit');
  invariant(capture.topCompositeKind === '', 'NOT_RUN capture evidence must not retain stale TOP source kind');
  invariant(capture.topCompositePath === '', 'NOT_RUN capture evidence must not retain stale TOP source path');
  invariant(capture.topCompositeSha256 === '', 'NOT_RUN capture evidence must not retain stale TOP source SHA-256');
  invariant(capture.captureCount === 0, 'NOT_RUN capture evidence must report zero current captures');
  invariant(capture.captures.length === 0, 'NOT_RUN capture evidence must not retain current capture entries');
} else if (capturePassed && finalArt.candidateGenerated) {
  invariant(capture.topCompositeKind === 'final-core5', 'final candidate invalidates bridge-only capture evidence');
  invariant(capture.topCompositePath === canonicalCandidatePath, 'capture evidence must target canonical final TOP path');
  invariant(capture.topCompositeSha256 === finalArt.candidateSha256, 'capture evidence must target exact current final TOP bytes');
} else if (capturePassed) {
  invariant(capture.topCompositeKind === 'bridge', 'pre-final capture evidence must identify bridge source');
  invariant(capture.topCompositePath === canonicalBridgePath, 'pre-final capture evidence must target canonical bridge path');
  invariant(capture.topCompositeSha256 === canonicalBridgeSha256, 'pre-final capture bridge SHA-256 mismatch');
}

if (!motionExecuted) {
  invariant(motion.verifiedCommit === '', 'NOT_RUN motion review must not retain a stale verifiedCommit');
  invariant(motion.candidateSha256 === '', 'NOT_RUN motion review must not retain a stale candidate SHA-256');
} else {
  invariant(sha40.test(motion.verifiedCommit), 'executed motion review requires a 40-char source commit');
  invariant(finalArt.candidateGenerated, 'executed motion review requires a generated final candidate');
  invariant(sha256.test(finalArt.candidateSha256), 'executed motion review requires a valid final-art SHA-256');
  invariant(motion.candidateSha256 === finalArt.candidateSha256, 'motion review must target the exact current final-art candidate');
}

if (motion.motionApproved) {
  invariant(
    motion.normalMotion.executed && motion.normalMotion.result === 'PASSED',
    'motion approval requires passed normal-motion review',
  );
  invariant(
    motion.reducedMotion.executed && motion.reducedMotion.result === 'PASSED',
    'motion approval requires passed Reduced Motion review',
  );
  invariant(finalArt.candidateGenerated, 'motion approval requires a generated final TOP candidate');
  invariant(motion.candidateSha256 === finalArt.candidateSha256, 'motion approval cannot use stale final-art evidence');
  invariant(unityPassed, 'motion approval requires PASSED current V3 Unity evidence');
  invariant(unity.sourceCompositeKind === 'final-core5', 'motion approval requires Unity verification of final-core5 source');
  invariant(unity.sourceCompositeSha256 === finalArt.candidateSha256, 'motion approval requires Unity verification of current final-art bytes');
  invariant(
    motion.verifiedCommit === unity.verifiedCommit,
    'motion review and V3 Unity evidence must target the same source commit',
  );
}

if (capturePassed && unityPassed) {
  invariant(
    capture.sourceCommit === unity.verifiedCommit,
    'capture and V3 Unity evidence must target the same source commit',
  );
  invariant(capture.topCompositeKind === unity.sourceCompositeKind, 'capture and V3 Unity TOP source kinds diverged');
  invariant(capture.topCompositePath === unity.sourceCompositePath, 'capture and V3 Unity TOP source paths diverged');
  invariant(capture.topCompositeSha256 === unity.sourceCompositeSha256, 'capture and V3 Unity TOP source bytes diverged');
}

if (finalArt.runtimeCaptureComplete) {
  invariant(capturePassed && unityPassed, 'runtime capture completion requires passed capture and V3 evidence');
  invariant(finalArt.candidateGenerated, 'runtime capture completion requires generated final TOP candidate');
  invariant(unity.sourceCompositeKind === 'final-core5', 'runtime capture completion requires final-core5 Unity evidence');
  invariant(unity.sourceCompositeSha256 === finalArt.candidateSha256, 'runtime capture completion requires Unity evidence for current final TOP bytes');
  invariant(capture.topCompositeKind === 'final-core5', 'runtime capture completion requires final-core5 capture provenance');
  invariant(capture.topCompositeSha256 === finalArt.candidateSha256, 'runtime capture completion requires capture evidence for current final TOP bytes');
  invariant(
    capture.sourceCommit === unity.verifiedCommit,
    'runtime capture completion requires coherent capture/V3 provenance',
  );
}

if (finalArt.runtimeApproved || finalArt.approvedAsFinal) {
  invariant(motion.motionApproved, 'runtime/final approval requires approved motion review');
  invariant(capturePassed && unityPassed, 'runtime/final approval requires capture and V3 evidence');
  invariant(finalArt.candidateGenerated, 'runtime/final approval requires a generated final TOP candidate');
  invariant(unity.sourceCompositeKind === 'final-core5', 'runtime/final approval requires final-core5 Unity provenance');
  invariant(unity.sourceCompositeSha256 === finalArt.candidateSha256, 'runtime/final approval requires current final TOP byte provenance');
  invariant(capture.topCompositeKind === 'final-core5', 'runtime/final approval requires final-core5 capture provenance');
  invariant(capture.topCompositeSha256 === finalArt.candidateSha256, 'runtime/final approval requires capture of current final TOP bytes');
  invariant(motion.candidateSha256 === finalArt.candidateSha256, 'runtime/final approval requires motion review of the current final-art candidate');
  invariant(
    motion.verifiedCommit === unity.verifiedCommit && unity.verifiedCommit === capture.sourceCommit,
    'runtime/final approval requires motion, V3 Unity, and capture evidence from one source commit',
  );
}

console.log('TOP Living Night evidence commit coherence: PASS');
console.log(`motion=${motion.motionApproved} unity=${unity.result}/${unity.sourceCompositeKind || 'NOT_RUN'} capture=${capture.result}`);
