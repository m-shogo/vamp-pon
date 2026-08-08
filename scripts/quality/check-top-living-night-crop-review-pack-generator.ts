import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const generatorPath = join(root, 'scripts/unity/generate-top-living-night-crop-review-pack.py');
const gitignorePath = join(root, '.gitignore');

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(generatorPath), 'TOP crop review pack generator is missing');
const generator = readFileSync(generatorPath, 'utf8');
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

invariant(
  gitignore.includes('docs/design-targets/generated/top-living-night-v3/crop-review-previews/'),
  'TOP crop review previews must remain generated-only and ignored by Git',
);
invariant(
  !generator.includes('cropReviewComplete = True') && !generator.includes('allCropsApproved = True'),
  'TOP crop preview generation must never promote crop approval',
);

console.log('TOP Living Night crop review pack generator contract: PASS');
console.log('center-cover 360x800/390x844/430x932 + safe-area overlays; exact candidate SHA; generated-only; no approval');
