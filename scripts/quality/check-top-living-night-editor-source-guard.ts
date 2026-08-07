import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const guardPath = join(
  root,
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightCompositeV3EditorGuard.cs',
);
const metaPath = `${guardPath}.meta`;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(guardPath), 'TOP Editor source-authority guard is missing');
invariant(existsSync(metaPath), 'TOP Editor source-authority guard meta is missing');
const guard = readFileSync(guardPath, 'utf8');

for (const token of [
  '[InitializeOnLoad]',
  'EditorApplication.playModeStateChanged += OnPlayModeStateChanged;',
  'PlayModeStateChange.ExitingEditMode',
  'TopLivingNightCompositeV3BuildAssetSync.ResolveCompositeSource()',
  'EditorApplication.isPlaying = false;',
  'source authority is invalid',
  'Validate Runtime V3 Source Authority',
]) {
  invariant(guard.includes(token), `TOP Editor source-authority guard contract missing: ${token}`);
}

const resolverCall = guard.indexOf(
  'TopLivingNightCompositeV3BuildAssetSync.ResolveCompositeSource()',
);
const playCancel = guard.indexOf('EditorApplication.isPlaying = false;');
invariant(resolverCall >= 0, 'TOP Editor guard must reuse build source resolver');
invariant(playCancel >= 0, 'TOP Editor guard must cancel Play Mode on invalid source authority');
invariant(
  !guard.includes('candidateGenerated') && !guard.includes('candidateCore5ReferenceSetSha256'),
  'TOP Editor guard must not duplicate final-art provenance logic; it must reuse the build resolver',
);

console.log('TOP Living Night Editor source-authority guard: PASS');
console.log('Editor Play Mode reuses build/Unity source resolver and blocks stale final-core5 provenance');
