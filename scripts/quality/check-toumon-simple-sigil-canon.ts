import { characterCommercialIdentityById } from '../../src/game/data/characterCommercialIdentity.ts';
import { characterEmblems } from '../../src/game/data/emblemCanon.ts';
import { characterThemeColorById } from '../../src/game/data/characterThemeColors.ts';
import {
  TOUMON_SIMPLE_SIGIL_RULES,
  toumonSigils,
  toumonSigilById,
} from '../../src/game/data/toumonSimpleSigilCanon.ts';

const EXPECTED_IDS = [
  'yui', 'asa', 'nagi', 'michiru', 'tomori',
  'sen', 'ritsu', 'koyori', 'gen', 'hana',
  'yubi', 'madoka', 'shiro', 'tobari', 'nemu',
  'kuroori', 'kage1', 'kage2', 'kage3', 'kage4',
  'ren',
] as const;

function fail(message: string): never {
  throw new Error(`[Toumon Simple Sigil Canon] ${message}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

assert(TOUMON_SIMPLE_SIGIL_RULES.authority === 'CURRENT_VISUAL_IP_DESIGN_CANON', 'authority must be Current visual/IP design canon');
assert(TOUMON_SIMPLE_SIGIL_RULES.masterVectorStatus === 'NOT_YET_DRAWN', 'master vectors must remain explicitly NOT_YET_DRAWN');
assert(TOUMON_SIMPLE_SIGIL_RULES.primitiveBudget.detachedNodesMax === 2, 'node max must stay 2');
assert(TOUMON_SIMPLE_SIGIL_RULES.primitiveBudget.intentionalGapMin === 1, 'intentional gap must remain required');

assert(toumonSigils.length === 21, `expected 21 sigils, got ${toumonSigils.length}`);
assert(new Set(toumonSigils.map((x) => x.characterId)).size === 21, 'duplicate characterId');
assert(new Set(toumonSigils.map((x) => x.sigilName)).size === 21, 'duplicate sigilName');

const actualIds = toumonSigils.map((x) => x.characterId);
assert(JSON.stringify(actualIds) === JSON.stringify(EXPECTED_IDS), `Current21 order drift: ${actualIds.join(', ')}`);

const current20 = toumonSigils.filter((x) => x.scope === 'current20');
const reserves = toumonSigils.filter((x) => x.scope === 'official_reserve');
assert(current20.length === 20, `expected Current20=20, got ${current20.length}`);
assert(reserves.length === 1 && reserves[0]?.characterId === 'ren', 'Ren must be the only official_reserve Toumon');

const bannedFormulaTokens = [
  /lantern/i,
  /lion/i,
  /wolf/i,
  /dog/i,
  /swan/i,
  /flower/i,
  /key/i,
  /box/i,
  /book/i,
  /envelope/i,
  /shield/i,
  /crown/i,
  /wreath/i,
  /wing/i,
  /zodiac/i,
  /star icon/i,
  /ランタン/,
  /獅子/,
  /狼/,
  /犬/,
  /白鳥/,
  /花/,
  /鍵/,
  /箱/,
  /本型/,
  /書物/,
  /本の絵/,
  /封筒/,
  /盾/,
  /王冠/,
  /翼/,
];

for (const sigil of toumonSigils) {
  assert(sigil.strokeGroupsTarget >= 2 && sigil.strokeGroupsTarget <= 4, `${sigil.characterId}: strokeGroupsTarget out of range`);
  assert(sigil.nodeCount >= 0 && sigil.nodeCount <= 2, `${sigil.characterId}: nodeCount out of range`);
  assert(sigil.primaryGap.trim().length > 0, `${sigil.characterId}: missing primary gap`);
  assert(sigil.signatureAsymmetry.trim().length > 0, `${sigil.characterId}: missing signature asymmetry`);
  assert(sigil.coreVerb.length >= 2, `${sigil.characterId}: coreVerb too weak`);
  assert(sigil.forbiddenLiteralization.length >= 3, `${sigil.characterId}: forbiddenLiteralization too weak`);
  assert(sigil.dawnChange.trim().length > 0, `${sigil.characterId}: missing dawn change`);
  assert(sigil.kokuyouScar.trim().length > 0, `${sigil.characterId}: missing kokuyou scar`);
  assert(sigil.pairRule.trim().length > 0, `${sigil.characterId}: missing pair rule`);

  for (const pattern of bannedFormulaTokens) {
    assert(!pattern.test(sigil.strokeFormula), `${sigil.characterId}: literal motif leaked into strokeFormula (${pattern})`);
  }

  const theme = characterThemeColorById.get(sigil.characterId);
  assert(theme, `${sigil.characterId}: missing Character Theme authority`);
  assert(sigil.starBeast.includes(theme.starBeastTheme.starBeast), `${sigil.characterId}: Star Beast drift (${sigil.starBeast} != ${theme.starBeastTheme.starBeast})`);

  const commercial = characterCommercialIdentityById.get(sigil.characterId);
  assert(commercial, `${sigil.characterId}: missing Commercial Identity authority`);
  assert(sigil.namedObject === commercial.namedObject, `${sigil.characterId}: Named Object drift (${sigil.namedObject} != ${commercial.namedObject})`);
}

const yui = toumonSigilById.get('yui');
const tomori = toumonSigilById.get('tomori');
assert(yui?.starBeast.includes('子獅子'), 'Yui must use Current Leo child-lion Star Beast');
assert(tomori?.starBeast.includes('若獅子'), 'Tomori must use Current Leo young-lion Star Beast');
assert(yui?.dominantFamily !== tomori?.dominantFamily, 'Yui/Tomori may share Leo micro-language but must not share base sigil geometry');

const ritsu = toumonSigilById.get('ritsu');
const koyori = toumonSigilById.get('koyori');
assert(ritsu?.starBeast.includes('猟犬') && koyori?.starBeast.includes('猟犬'), 'Ritsu/Koyori sibling Star Beast authority drift');
assert(ritsu?.dominantFamily !== koyori?.dominantFamily, 'Ritsu/Koyori must remain separate people with separate sigil geometry');

const hana = toumonSigilById.get('hana');
const kaname = toumonSigilById.get('kage1');
assert(hana?.forbiddenLiteralization.includes('body-size symbol'), 'Hana body shape must not become sigil geometry');
assert(kaname?.forbiddenLiteralization.includes('large-body symbol'), 'Kaname body shape must not become sigil geometry');

// Existing Current20 compatibility source must now derive from v2 and Current Star Beast authority.
assert(characterEmblems.length === 20, `legacy compatibility emblem count must remain Current20=20, got ${characterEmblems.length}`);
for (const emblem of characterEmblems) {
  const v2 = toumonSigilById.get(emblem.characterId);
  assert(v2, `${emblem.characterId}: compatibility emblem missing v2 source`);
  assert(emblem.emblemName === v2.sigilName, `${emblem.characterId}: compatibility name drift`);
  assert(emblem.crestShape === v2.strokeFormula, `${emblem.characterId}: compatibility crestShape must be abstract stroke formula`);
  const theme = characterThemeColorById.get(emblem.characterId);
  assert(theme, `${emblem.characterId}: compatibility theme missing`);
  assert(emblem.constellationAnimal === theme.starBeastTheme.starBeast, `${emblem.characterId}: legacy constellationAnimal property contains stale animal`);
  assert(emblem.visualKeywords.includes('simple abstract sigil'), `${emblem.characterId}: compatibility prompt missing simple abstract sigil guard`);
  assert(emblem.visualKeywords.includes('no shield crown wreath wings'), `${emblem.characterId}: compatibility prompt missing ornate-crest ban`);
}

const collisionKeys = new Map<string, string>();
for (const sigil of toumonSigils) {
  const key = [sigil.dominantFamily, sigil.nodeCount, sigil.primaryGap, sigil.signatureAsymmetry].join('|');
  const previous = collisionKeys.get(key);
  assert(!previous, `${sigil.characterId}: exact visual grammar collision with ${previous}`);
  collisionKeys.set(key, sigil.characterId);
}

console.log(`Toumon Simple Sigil Canon: PASS (${toumonSigils.length}/21; Current20=${current20.length}; Reserve=${reserves[0]?.displayName})`);
