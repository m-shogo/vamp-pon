import { CHARACTER_REALITY_ROOTS } from './characterRealityRootRegistry.ts';
import { CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX } from './characterOrdinaryLifeReservoir.ts';
import { CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR } from './current21SocialChemistryReservoir.ts';
import { FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR } from './future15SocialChemistryReservoir.ts';
import { CHARACTER_BEHAVIOR_IDENTITY_RESERVOIR } from './characterBehaviorIdentityReservoir.ts';
import { CHARACTER_LIVED_ARTIFACT_RESERVOIR } from './characterLivedArtifactReservoir.ts';
import { CHARACTER_THEME_COLOR_CANDIDATES } from './characterThemeColorReservoir.ts';
import { REALITY_ROOT_LIVING_PLACE_RESERVOIR } from './realityRootLivingPlaceReservoir.ts';
import { CURRENT21_SEASON_ASSIGNMENTS, FUTURE15_SEASON_ASSIGNMENTS } from './seasonArchitecture.ts';

export const CHARACTER_AUTHOR_DB_RULES = {
  authority: 'docs/character-author-db-schema-and-coverage-v1.md',
  status: 'AUTHOR_DB_INDEX_CURRENT_STRUCTURE_RESERVOIR_CONTENT',
  characterCountRequired: 36,
  current21Required: 21,
  future15Required: 15,
  sourceStatusMustRemainVisible: true,
  currentAndCandidateMayNotBeFlattened: true,
  aliasMapMayNotRenameStableIds: true,
  aliasMapIsMigrationInstruction: false,
  future15CoveragePromotesRoster: false,
  candidateCoveragePromotesCanon: false,
  missingOptionalFieldMayBeUnknown: true,
  missingOptionalFieldMeansFalse: false,
  runtimeGameReadsAuthorDbAutomatically: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type CharacterRosterLayer = 'CURRENT21' | 'FUTURE15';

export type CharacterAuthorDbIdentity = Readonly<{
  authorId: string;
  stableProfileId: string;
  name: string;
  rosterLayer: CharacterRosterLayer;
}>;

export const CHARACTER_AUTHOR_DB_IDENTITIES: readonly CharacterAuthorDbIdentity[] = [
  { authorId: 'yui', stableProfileId: 'yui', name: 'ユイ', rosterLayer: 'CURRENT21' },
  { authorId: 'asa', stableProfileId: 'asa', name: 'アサ', rosterLayer: 'CURRENT21' },
  { authorId: 'nagi', stableProfileId: 'nagi', name: 'ナギ', rosterLayer: 'CURRENT21' },
  { authorId: 'michiru', stableProfileId: 'michiru', name: 'ミチル', rosterLayer: 'CURRENT21' },
  { authorId: 'tomori', stableProfileId: 'tomori', name: 'トモリ', rosterLayer: 'CURRENT21' },
  { authorId: 'sen', stableProfileId: 'sen', name: 'セン', rosterLayer: 'CURRENT21' },
  { authorId: 'ritsu', stableProfileId: 'ritsu', name: 'リツ', rosterLayer: 'CURRENT21' },
  { authorId: 'koyori', stableProfileId: 'koyori', name: 'コヨリ', rosterLayer: 'CURRENT21' },
  { authorId: 'gen', stableProfileId: 'gen', name: 'ゲン', rosterLayer: 'CURRENT21' },
  { authorId: 'hana', stableProfileId: 'hana', name: 'ハナ', rosterLayer: 'CURRENT21' },
  { authorId: 'yuubi', stableProfileId: 'yubi', name: 'ユウビ', rosterLayer: 'CURRENT21' },
  { authorId: 'madoka', stableProfileId: 'madoka', name: 'マドカ', rosterLayer: 'CURRENT21' },
  { authorId: 'shiro', stableProfileId: 'shiro', name: 'シロ', rosterLayer: 'CURRENT21' },
  { authorId: 'tobari', stableProfileId: 'tobari', name: 'トバリ', rosterLayer: 'CURRENT21' },
  { authorId: 'nemu', stableProfileId: 'nemu', name: 'ネム', rosterLayer: 'CURRENT21' },
  { authorId: 'kuroori', stableProfileId: 'kuroori', name: 'クロオリ', rosterLayer: 'CURRENT21' },
  { authorId: 'kaname', stableProfileId: 'kage1', name: 'カナメ', rosterLayer: 'CURRENT21' },
  { authorId: 'kasumi', stableProfileId: 'kage2', name: 'カスミ', rosterLayer: 'CURRENT21' },
  { authorId: 'toki', stableProfileId: 'kage3', name: 'トキ', rosterLayer: 'CURRENT21' },
  { authorId: 'tsumugi', stableProfileId: 'kage4', name: 'ツムギ', rosterLayer: 'CURRENT21' },
  { authorId: 'ren', stableProfileId: 'ren', name: 'レン', rosterLayer: 'CURRENT21' },
  { authorId: 'hiyori', stableProfileId: 'hiyori', name: 'ヒヨリ', rosterLayer: 'FUTURE15' },
  { authorId: 'serika', stableProfileId: 'serika', name: 'セリカ', rosterLayer: 'FUTURE15' },
  { authorId: 'chloe', stableProfileId: 'chloe', name: 'クロエ', rosterLayer: 'FUTURE15' },
  { authorId: 'renji', stableProfileId: 'renji', name: 'レンジ', rosterLayer: 'FUTURE15' },
  { authorId: 'touma', stableProfileId: 'touma', name: 'トウマ', rosterLayer: 'FUTURE15' },
  { authorId: 'kuu', stableProfileId: 'kuu', name: 'クウ', rosterLayer: 'FUTURE15' },
  { authorId: 'yomo', stableProfileId: 'yomo', name: 'ヨモ', rosterLayer: 'FUTURE15' },
  { authorId: 'noa', stableProfileId: 'noa', name: 'ノア', rosterLayer: 'FUTURE15' },
  { authorId: 'rum', stableProfileId: 'rum', name: 'ルム', rosterLayer: 'FUTURE15' },
  { authorId: 'maki', stableProfileId: 'maki', name: 'マキ', rosterLayer: 'FUTURE15' },
  { authorId: 'suzu', stableProfileId: 'suzu', name: 'スズ', rosterLayer: 'FUTURE15' },
  { authorId: 'io', stableProfileId: 'io', name: 'イオ', rosterLayer: 'FUTURE15' },
  { authorId: 'kai', stableProfileId: 'kai', name: 'カイ', rosterLayer: 'FUTURE15' },
  { authorId: 'nao', stableProfileId: 'nao', name: 'ナオ', rosterLayer: 'FUTURE15' },
  { authorId: 'amane', stableProfileId: 'amane', name: 'アマネ', rosterLayer: 'FUTURE15' },
] as const;

const byId = <T extends { id: string }>(entries: readonly T[]) => new Map(entries.map((entry) => [entry.id, entry]));
const rootsByAuthorId = byId(CHARACTER_REALITY_ROOTS);
const ordinaryByStableId = byId(CHARACTER_ORDINARY_LIFE_RESERVOIR_INDEX);
const currentSocialByStableId = byId(CURRENT21_SOCIAL_CHEMISTRY_RESERVOIR);
const futureSocialByAuthorId = byId(FUTURE15_SOCIAL_CHEMISTRY_RESERVOIR);
const behaviorByStableId = byId(CHARACTER_BEHAVIOR_IDENTITY_RESERVOIR);
const artifactByStableId = byId(CHARACTER_LIVED_ARTIFACT_RESERVOIR);
const themeByStableId = byId(CHARACTER_THEME_COLOR_CANDIDATES);
const livingPlaceByAuthorId = byId(REALITY_ROOT_LIVING_PLACE_RESERVOIR);
const currentSeasonByAuthorId = byId(CURRENT21_SEASON_ASSIGNMENTS);
const futureSeasonByAuthorId = byId(FUTURE15_SEASON_ASSIGNMENTS);

export const CHARACTER_AUTHOR_DB_COVERAGE = CHARACTER_AUTHOR_DB_IDENTITIES.map((identity) => {
  const social = identity.rosterLayer === 'CURRENT21'
    ? currentSocialByStableId.get(identity.stableProfileId)
    : futureSocialByAuthorId.get(identity.authorId);
  const season = identity.rosterLayer === 'CURRENT21'
    ? currentSeasonByAuthorId.get(identity.authorId)
    : futureSeasonByAuthorId.get(identity.authorId);

  return {
    ...identity,
    coverage: {
      realityRoot: Boolean(rootsByAuthorId.get(identity.authorId)),
      seasonArchitecture: Boolean(season),
      ordinaryLife: Boolean(ordinaryByStableId.get(identity.stableProfileId)),
      socialChemistry: Boolean(social),
      behaviorIdentity: Boolean(behaviorByStableId.get(identity.stableProfileId)),
      livedArtifact: Boolean(artifactByStableId.get(identity.stableProfileId)),
      themeColor: Boolean(themeByStableId.get(identity.stableProfileId)),
      livingPlace: Boolean(livingPlaceByAuthorId.get(identity.authorId)),
      physicalIdentityAuthority: true,
    },
    sourceStatus: {
      realityRoot: rootsByAuthorId.get(identity.authorId)?.status ?? 'MISSING',
      seasonArchitecture: identity.rosterLayer === 'CURRENT21' ? 'CURRENT_SERIES_ASSIGNMENT' : 'FUTURE15_ASSIGNMENT_NO_PROMOTION',
      ordinaryLife: 'AUTHOR_RESERVOIR_NON_CANON',
      socialChemistry: identity.rosterLayer === 'CURRENT21' ? 'AUTHOR_RESERVOIR_NON_CANON' : 'FUTURE15_AUTHOR_RESERVOIR_NOT_CURRENT21',
      behaviorIdentity: 'AUTHOR_RESERVOIR_NON_CANON',
      livedArtifact: 'AUTHOR_RESERVOIR_NON_CANON',
      themeColor: 'AUTHOR_RESERVOIR_NON_CANON',
      livingPlace: 'AUTHOR_RESERVOIR_NON_CANON_ROOT_STATUS_INHERITED',
      physicalIdentityAuthority: 'CURRENT_WORLD_MASTER_SUBDOMAIN',
    },
  } as const;
});

export const characterAuthorDbCoverageSummary = {
  characterCount: CHARACTER_AUTHOR_DB_COVERAGE.length,
  uniqueAuthorIds: new Set(CHARACTER_AUTHOR_DB_COVERAGE.map((entry) => entry.authorId)).size,
  uniqueStableProfileIds: new Set(CHARACTER_AUTHOR_DB_COVERAGE.map((entry) => entry.stableProfileId)).size,
  current21Count: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.rosterLayer === 'CURRENT21').length,
  future15Count: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.rosterLayer === 'FUTURE15').length,
  aliasCount: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.authorId !== entry.stableProfileId).length,
  fullyCoveredCount: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => Object.values(entry.coverage).every(Boolean)).length,
  realityRootCoverage: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.coverage.realityRoot).length,
  seasonCoverage: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.coverage.seasonArchitecture).length,
  ordinaryLifeCoverage: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.coverage.ordinaryLife).length,
  socialChemistryCoverage: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.coverage.socialChemistry).length,
  behaviorIdentityCoverage: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.coverage.behaviorIdentity).length,
  livedArtifactCoverage: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.coverage.livedArtifact).length,
  themeColorCoverage: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.coverage.themeColor).length,
  livingPlaceCoverage: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.coverage.livingPlace).length,
  physicalIdentityAuthorityCoverage: CHARACTER_AUTHOR_DB_COVERAGE.filter((entry) => entry.coverage.physicalIdentityAuthority).length,
  future15PromotedByManifest: false,
  candidatePromotedByManifest: false,
  runtimeAutoPromotionAllowed: false,
} as const;
