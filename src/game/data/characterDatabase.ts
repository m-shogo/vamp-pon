import type { CharacterCanonEntry } from './characterCanon.ts';
import { characterCanon } from './characterCanon.ts';
import type { CharacterProductionPlan } from './characterProductionPlans.ts';
import { characterProductionPlanById } from './characterProductionPlans.ts';
import type { KokuyouForm } from './kokuyouForms.ts';
import { kokuyouFormByCharacterId } from './kokuyouForms.ts';
import type { CharacterEmblemCanon } from './emblemCanon.ts';
import { characterEmblemById } from './emblemCanon.ts';
import { characterVisualGenerationBriefById } from './characterVisualGenerationBriefs.ts';
import { core5PairLightArts } from './pairLightArts.ts';

export type CharacterDatabaseSceneEligibility =
  | 'core5_character_select_candidate'
  | 'seed_data_only'
  | 'shadow_data_only';

export type CharacterDatabaseRuntimeStatus =
  | 'runtime_playable_seeded'
  | 'canon_seed_not_runtime_ready';

export type CharacterDatabaseEntry = {
  id: string;
  no: number;
  name: string;
  status: CharacterCanonEntry['status'];
  group: CharacterCanonEntry['group'];
  identity: {
    vessel: string;
    lineage: string;
    firstAction: string;
    linkToYui: string;
    otherLink: string;
    blank: string;
  };
  combat: {
    role: string;
    starter: string;
    playFeel: string;
    strength: string;
    weakness: string;
    starterGear: string;
    passiveItem: string;
    rareItem: string;
    lampTsugi: string;
    akatsukiBiraki: string;
    fieldDropAffinity: string;
    motifLaneIds: string[];
  };
  arts: CharacterCanonEntry['arts'];
  kokuyou: {
    label: string;
    subtitle: string;
    shortCopy: string;
    distortedTrait: string;
    cutinDirection: string;
  };
  pair: {
    candidateIds: string[];
    core5PairArtIds: string[];
  };
  emblem: CharacterEmblemCanon;
  assetFactory: {
    spriteKeywords: string[];
    normalCutinBrief: string;
    kokuyouCutinBrief: string;
    emblemKeywords: string[];
    promptSeed: string;
  };
  unityHandoff: {
    prefabId: string;
    addressableGroup: string;
    sceneEligibility: CharacterDatabaseSceneEligibility;
    runtimeStatus: CharacterDatabaseRuntimeStatus;
    notes: string[];
  };
};

function requireById<T>(map: ReadonlyMap<string, T>, characterId: string, label: string): T {
  const value = map.get(characterId);
  if (!value) throw new Error(`${label} is missing for characterId: ${characterId}`);
  return value;
}

function toKebab(value: string): string {
  return value.replace(/_/g, '-').toLowerCase();
}

function resolveSceneEligibility(entry: CharacterCanonEntry): CharacterDatabaseSceneEligibility {
  if (entry.status === 'playable_data') return 'core5_character_select_candidate';
  if (entry.group === 'shadow5') return 'shadow_data_only';
  return 'seed_data_only';
}

function resolveRuntimeStatus(entry: CharacterCanonEntry): CharacterDatabaseRuntimeStatus {
  return entry.status === 'playable_data' ? 'runtime_playable_seeded' : 'canon_seed_not_runtime_ready';
}

function resolveCore5PairArtIds(characterId: string, candidates: string[]): string[] {
  return core5PairLightArts
    .filter((pair) => pair.characterIds.includes(characterId) && pair.characterIds.some((id) => candidates.includes(id)))
    .map((pair) => pair.id);
}

function buildPromptSeed(
  entry: CharacterCanonEntry,
  plan: CharacterProductionPlan,
  kokuyou: KokuyouForm,
  emblem: CharacterEmblemCanon,
): string {
  const visual = requireById(characterVisualGenerationBriefById, entry.id, 'characterVisualGenerationBriefById');
  return [
    `${entry.name} / ${entry.id}`,
    `vessel: ${entry.vessel}`,
    `role: ${entry.combat.role}`,
    `starter gear: ${plan.starterGear}`,
    `arts: ${entry.arts.lampArt} / ${entry.arts.inheritedLight} / ${entry.arts.dawnLight}`,
    `kokuyou: ${kokuyou.subtitle} - ${kokuyou.distortedTrait}`,
    `emblem: ${emblem.azCode} ${emblem.emblemName}`,
    `keywords: ${[...plan.assetKeywords, ...emblem.visualKeywords].join(', ')}`,
    `theme: ${visual.themeHex} / ${visual.accentHex}`,
    `star beast: ${visual.starBeast} / ${visual.constellation}`,
    `silhouette: ${visual.silhouette}`,
    `posture: ${visual.posture}`,
    `clothing shape: ${visual.clothingShape}`,
    `named object: ${visual.objectAnchor}`,
    `motion: ${visual.motionSignature}`,
    ...(visual.hardVisualDirection ? [`HARD visual direction: ${visual.hardVisualDirection}`] : []),
    `avoid: ${visual.prohibitedShortcuts.join('; ')}`,
  ].join('\n');
}

function buildCharacterDatabaseEntry(entry: CharacterCanonEntry): CharacterDatabaseEntry {
  const plan = requireById(characterProductionPlanById, entry.id, 'characterProductionPlanById');
  const kokuyou = requireById(kokuyouFormByCharacterId, entry.id, 'kokuyouFormByCharacterId');
  const emblem = requireById(characterEmblemById, entry.id, 'characterEmblemById');
  const prefabId = `character-${toKebab(entry.id)}`;
  const sceneEligibility = resolveSceneEligibility(entry);

  return {
    id: entry.id,
    no: entry.no,
    name: entry.name,
    status: entry.status,
    group: entry.group,
    identity: {
      vessel: entry.vessel,
      lineage: entry.lineage,
      firstAction: entry.firstAction,
      linkToYui: entry.linkToYui,
      otherLink: entry.otherLink,
      blank: entry.blank,
    },
    combat: {
      role: entry.combat.role,
      starter: entry.combat.starter,
      playFeel: entry.combat.playFeel,
      strength: entry.combat.strength,
      weakness: entry.combat.weakness,
      starterGear: plan.starterGear,
      passiveItem: plan.passiveItem,
      rareItem: plan.rareItem,
      lampTsugi: plan.lampTsugi,
      akatsukiBiraki: plan.akatsukiBiraki,
      fieldDropAffinity: plan.fieldDropAffinity,
      motifLaneIds: plan.motifLaneIds,
    },
    arts: entry.arts,
    kokuyou: {
      label: kokuyou.label,
      subtitle: kokuyou.subtitle,
      shortCopy: kokuyou.shortCopy,
      distortedTrait: kokuyou.distortedTrait,
      cutinDirection: entry.cutin.kokuyou,
    },
    pair: {
      candidateIds: plan.pairCandidates,
      core5PairArtIds: resolveCore5PairArtIds(entry.id, plan.pairCandidates),
    },
    emblem,
    assetFactory: {
      spriteKeywords: plan.assetKeywords,
      normalCutinBrief: entry.cutin.normal,
      kokuyouCutinBrief: entry.cutin.kokuyou,
      emblemKeywords: emblem.visualKeywords,
      promptSeed: buildPromptSeed(entry, plan, kokuyou, emblem),
    },
    unityHandoff: {
      prefabId,
      addressableGroup: `characters/${entry.group}`,
      sceneEligibility,
      runtimeStatus: resolveRuntimeStatus(entry),
      notes: [
        `Use ${prefabId} as the Unity prefab id when promoted from data to runtime.`,
        `Keep cutin and emblem art textless; render labels with UI text.`,
        sceneEligibility === 'core5_character_select_candidate'
          ? 'Core5 candidate: may be staged into character select after sprite wiring and balance review.'
          : 'Seed-only: keep out of character select until sprite, balance, and UI are ready.',
      ],
    },
  };
}

export const characterDefinitions: CharacterDatabaseEntry[] = characterCanon.map(buildCharacterDatabaseEntry);

export const characterDefinitionById = new Map(characterDefinitions.map((definition) => [definition.id, definition]));

export const core5CharacterDefinitions = characterDefinitions.filter((definition) => definition.group === 'core5');
export const playableCharacterDefinitions = characterDefinitions.filter((definition) => definition.status === 'playable_data');
export const seedCharacterDefinitions = characterDefinitions.filter((definition) => definition.status !== 'playable_data');

export const CHARACTER_DATABASE_REQUIRED_FIELDS = [
  'initialGear',
  'passiveItem',
  'rareItem',
  'lampArt',
  'inheritedLight',
  'dawnLight',
  'lampTsugi',
  'akatsukiBiraki',
  'kokuyouSubtitle',
  'kokuyouDistortion',
  'pairCandidates',
  'azEmblem',
  'assetKeywords',
  'unityHandoff',
] as const;

export const characterDatabaseSummary = {
  total: characterDefinitions.length,
  core5: core5CharacterDefinitions.length,
  playable: playableCharacterDefinitions.length,
  seed: seedCharacterDefinitions.length,
  requiredFields: CHARACTER_DATABASE_REQUIRED_FIELDS,
} as const;

export function getCharacterDefinition(characterId: string): CharacterDatabaseEntry | undefined {
  return characterDefinitionById.get(characterId);
}
