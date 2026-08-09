import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const generatorPath = join(root, 'scripts/unity/generate-top-living-night-crop-review-pack.py');
const prepareRunnerRelative = 'scripts/unity/prepare-top-living-night-final-review-pack.sh';
const prepareRunnerPath = join(root, prepareRunnerRelative);
const gitignorePath = join(root, '.gitignore');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(generatorPath), 'TOP crop review pack generator is missing');
invariant(existsSync(prepareRunnerPath), 'TOP final review-pack prepare runner is missing');
const generator = readFileSync(generatorPath, 'utf8');
const prepareRunner = readFileSync(prepareRunnerPath, 'utf8');
const gitignore = readFileSync(gitignorePath, 'utf8');

for (const token of [
  'TARGETS: Tuple[Tuple[int, int], ...] = ((360, 800), (390, 844), (430, 932))',
  'TITLE_FRACTION = 0.22',
  'BUTTON_FRACTION = 0.22',
  'scale = max(target_width / image.width, target_height / image.height)',
  'Image.Resampling.LANCZOS',
  'if not status.get("candidateGenerated"):',
  'print("NEXT=final-candidate")',
  'actual_sha = sha256(candidate)',
  'if actual_sha != expected_sha:',
  'if source.size != (430, 932):',
  'cropMode": "center-cover-envelope-parent"',
  'safeAreaPreview',
  'NOTE: previews are review-only generated artifacts and never approve crop status automatically.',
]) {
  invariant(generator.includes(token), `TOP crop review pack generator contract missing: ${token}`);
}

for (const token of [
  'CANDIDATE_READY=',
  'echo "NEXT=final-candidate"',
  'python3 -m venv "$VENV"',
  '-m pip install --disable-pip-version-check -q -r requirements.txt',
  'generate-top-living-night-crop-review-pack.py',
  'create-top-living-night-static-review-template.ts',
  'create-top-living-night-runtime-review-templates.ts',
  'check-top-living-night-final-art-candidate.ts',
  'check-top-living-night-core5-candidate-provenance.ts',
  'check-top-living-night-crop-review.ts',
  'check-top-living-night-readiness-summary.ts',
  'no review or approval flag is promoted',
]) {
  invariant(prepareRunner.includes(token), `TOP final review-pack runner contract missing: ${token}`);
}

const syntax = spawnSync('bash', ['-n', prepareRunnerRelative], { cwd: root, encoding: 'utf8' });
invariant(
  syntax.status === 0,
  `TOP final review-pack runner bash syntax failed:\n${syntax.stdout}\n${syntax.stderr}`,
);

invariant(
  gitignore.includes('docs/design-targets/generated/top-living-night-v3/crop-review-previews/'),
  'TOP crop review previews must remain generated-only and ignored by Git',
);
invariant(
  !generator.includes('cropReviewComplete = True') && !generator.includes('allCropsApproved = True'),
  'TOP crop preview generation must never promote crop approval',
);
invariant(
  !prepareRunner.includes('approvedAsFinal=true') && !prepareRunner.includes('runtimeApproved=true'),
  'TOP final review-pack preparation must never promote final/runtime approval',
);

console.log('TOP Living Night crop review pack generator contract: PASS');
console.log('center-cover 360x800/390x844/430x932 + safe-area overlays; exact candidate SHA; generated-only; no approval');
console.log('prepare runner: candidate-gated venv/Pillow + crop/templates/readiness in one fail-closed flow');
