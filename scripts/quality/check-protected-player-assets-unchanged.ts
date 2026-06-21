import { execSync } from 'node:child_process';

// Protected-player-asset gate (prototype-safety, NOT a production gate).
//
// Purpose: during prototype / review / handoff work we must NOT touch the
// player's production assets or gameplay constants. This makes such touches
// easy to detect:
//   - working tree changes to a protected path  -> HARD FAIL (exit 1)
//   - last commit (HEAD~1..HEAD) touched a protected path -> loud WARNING
//     (exit 0, so a legitimate future "promote to production" commit or a
//     merge commit is not falsely broken; it is only surfaced for review).
//
// It deliberately does NOT inspect file contents or scores; that is the human
// pixel-art director's job. It only answers "did prototype work touch
// production player assets / gameplay constants?".

// Protected path prefixes (a changed file matches if it starts with one of
// these) plus exact gameplay-constant files.
const protectedPrefixes = [
  'public/assets/sprites/player/',     // production player sprites
  'assets/source/aseprite/player/',    // production player .aseprite source
  'src/game/player/',                  // (reserved) player runtime, if added
  'src/game/entities/player/',         // (reserved) player entity, if added
];
// Files that hold PLAYER_DEFAULTS / visualSize / radius / hitCore etc.
const protectedFiles = [
  'src/game/domain/constants.ts',
];

function isProtected(path: string): boolean {
  return protectedPrefixes.some((p) => path.startsWith(p)) || protectedFiles.includes(path);
}

function git(cmd: string): string {
  try {
    return execSync(`git ${cmd}`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

// 1) working tree (staged + unstaged + untracked) — the active-session guard.
const porcelain = git('status --porcelain');
const workingChanged = porcelain
  .split('\n')
  .map((line) => line.slice(3).trim())
  .filter((p) => p.length > 0)
  // handle "old -> new" rename entries
  .map((p) => (p.includes(' -> ') ? p.split(' -> ')[1] : p))
  .filter(isProtected);

// 2) last commit — detection of "production touched in the same commit".
const hasParent = git('rev-parse --verify HEAD~1') !== '';
const lastCommitChanged = hasParent
  ? git('diff --name-only HEAD~1..HEAD')
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
      .filter(isProtected)
  : [];

console.log('protected player paths:');
for (const p of [...protectedPrefixes, ...protectedFiles]) console.log(`  - ${p}`);

if (lastCommitChanged.length > 0) {
  console.warn('\nWARNING: last commit (HEAD~1..HEAD) touched protected player assets:');
  for (const p of lastCommitChanged) console.warn(`  ! ${p}`);
  console.warn('  -> If this was a prototype/review commit, that is a mistake. If it was an');
  console.warn('     intentional production promotion, review it deliberately (not a failure here).');
}

if (workingChanged.length > 0) {
  console.error('\nFAIL: working tree modifies protected player assets / gameplay constants:');
  for (const p of workingChanged) console.error(`  x ${p}`);
  console.error('\nplayer:protected:verify failed — revert these before prototype/review work.');
  process.exit(1);
}

console.log('\nplayer:protected:verify passed: working tree leaves production player assets untouched.');
if (lastCommitChanged.length === 0) {
  console.log('last commit did not touch protected player paths.');
}
