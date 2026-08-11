import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const buildSource = 'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopV3FinalApprovalIosBuild.cs';
const buildMeta = `${buildSource}.meta`;
const runnerPath = 'scripts/unity/run-top-v3-final-approval-ios-export.sh';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

for (const path of [buildSource, buildMeta, runnerPath]) {
  invariant(existsSync(path), `TOP final iOS export contract file is missing: ${path}`);
}

const build = readFileSync(buildSource, 'utf8');
for (const token of [
  'VAMPPON_TOP_FINAL_IOS_BUILD_TARGET',
  'VAMPPON_TOP_FINAL_IOS_BUILD_PATH',
  'iOSSdkVersion.SimulatorSDK',
  'iOSSdkVersion.DeviceSDK',
  'ARM64',
  'BuildPipeline.BuildPlayer',
  'options = BuildOptions.None',
  'PlayerSettings.iOS.sdkVersion = originalSdk',
]) {
  invariant(build.includes(token), `TOP final iOS Unity builder missing contract: ${token}`);
}
invariant(!build.includes('BuildOptions.Development'), 'TOP final evidence export must not silently force a Development player');
invariant(!build.includes('extraScriptingDefines'), 'TOP final evidence export must not inject historical smoke defines');

const runner = readFileSync(runnerPath, 'utf8');
for (const token of [
  "v3.verifiedCommit !== capture.sourceCommit",
  "v3.sourceCompositeKind !== 'final-core5'",
  'git worktree add --detach "$WORKTREE" "$SOURCE_COMMIT"',
  'git -C "$WORKTREE" reset --hard "$SOURCE_COMMIT"',
  'VAMPPON_BUILD_SOURCE_COMMIT="$SOURCE_COMMIT"',
  'VampPon.UnitySpike.Editor.TopV3FinalApprovalIosBuild.Build',
  'Unity-iPhone.xcodeproj/project.pbxproj',
  'status --porcelain --untracked-files=no',
]) {
  invariant(runner.includes(token), `TOP final iOS export runner missing contract: ${token}`);
}
invariant(!runner.includes('git checkout main'), 'TOP final iOS export must not substitute mutable main for the captured source commit');
invariant(!runner.includes('git reset --hard origin/main'), 'TOP final iOS export must remain bound to V3/capture source commit');

const syntax = spawnSync('bash', ['-n', runnerPath], { encoding: 'utf8' });
invariant(!syntax.error, `bash -n could not start: ${syntax.error?.message ?? 'unknown error'}`);
invariant(syntax.status === 0, `TOP final iOS export shell syntax failed:\n${syntax.stdout}\n${syntax.stderr}`);

console.log('TOP V3 final iOS export: PASS');
console.log('Simulator/device Unity Xcode exports are clean-worktree and exact V3/capture source-commit bound; signing/install/evidence remain separate gates.');
