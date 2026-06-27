import { describe, expect, it } from 'vitest';
import { characterCanon } from './characterCanon';
import { characterProductionPlans } from './characterProductionPlans';
import { kokuyouForms } from './kokuyouForms';
import { characterEmblems } from './emblemCanon';
import { core5PairLightArts } from './pairLightArts';
import {
  characterDatabaseSummary,
  characterDefinitionById,
  characterDefinitions,
  core5CharacterDefinitions,
  playableCharacterDefinitions,
} from './characterDatabase';

function ids(values: { id?: string; characterId?: string }[]): string[] {
  return values.map((value) => value.id ?? value.characterId ?? '');
}

describe('characterDatabase', () => {
  it('covers every character canon entry exactly once', () => {
    const canonIds = ids(characterCanon);
    const definitionIds = characterDefinitions.map((definition) => definition.id);

    expect(characterDefinitions).toHaveLength(characterCanon.length);
    expect(new Set(definitionIds).size).toBe(definitionIds.length);
    expect(definitionIds).toEqual(canonIds);
    expect(characterDatabaseSummary.total).toBe(characterCanon.length);
  });

  it('has matching production plan, kokuyou form, and emblem for every character', () => {
    const canonIds = new Set(ids(characterCanon));

    expect(new Set(characterProductionPlans.map((plan) => plan.characterId))).toEqual(canonIds);
    expect(new Set(kokuyouForms.map((form) => form.characterId))).toEqual(canonIds);
    expect(new Set(characterEmblems.map((emblem) => emblem.characterId))).toEqual(canonIds);
  });

  it('fills required production fields for every character', () => {
    for (const definition of characterDefinitions) {
      expect(definition.name).toBeTruthy();
      expect(definition.identity.vessel).toBeTruthy();
      expect(definition.combat.starterGear).toBeTruthy();
      expect(definition.combat.passiveItem).toBeTruthy();
      expect(definition.combat.rareItem).toBeTruthy();
      expect(definition.combat.lampTsugi).toBeTruthy();
      expect(definition.combat.akatsukiBiraki).toBeTruthy();
      expect(definition.arts.lampArt).toBeTruthy();
      expect(definition.arts.inheritedLight).toBeTruthy();
      expect(definition.arts.dawnLight).toBeTruthy();
      expect(definition.kokuyou.subtitle).toBeTruthy();
      expect(definition.kokuyou.distortedTrait).toBeTruthy();
      expect(definition.pair.candidateIds.length).toBeGreaterThanOrEqual(2);
      expect(definition.emblem.azCode).toMatch(/^[A-Z]-\d{2}$/);
      expect(definition.emblem.emblemName).toContain('灯紋');
      expect(definition.assetFactory.spriteKeywords.length).toBeGreaterThan(0);
      expect(definition.assetFactory.emblemKeywords.length).toBeGreaterThan(0);
      expect(definition.assetFactory.promptSeed).toContain(definition.id);
      expect(definition.unityHandoff.prefabId).toBe(`character-${definition.id.replace(/_/g, '-').toLowerCase()}`);
      expect(definition.unityHandoff.addressableGroup).toBe(`characters/${definition.group}`);
    }
  });

  it('keeps pair candidate ids resolvable', () => {
    const canonIds = new Set(characterDefinitions.map((definition) => definition.id));

    for (const definition of characterDefinitions) {
      for (const candidateId of definition.pair.candidateIds) {
        expect(canonIds.has(candidateId)).toBe(true);
      }
    }
  });

  it('connects all Core5 pair arts back to Core5 definitions', () => {
    expect(core5CharacterDefinitions).toHaveLength(5);
    expect(playableCharacterDefinitions).toHaveLength(5);

    for (const definition of core5CharacterDefinitions) {
      expect(definition.unityHandoff.sceneEligibility).toBe('core5_character_select_candidate');
      expect(definition.pair.core5PairArtIds.length).toBeGreaterThan(0);
    }

    const coveredPairIds = new Set(core5CharacterDefinitions.flatMap((definition) => definition.pair.core5PairArtIds));
    expect(coveredPairIds).toEqual(new Set(core5PairLightArts.map((pair) => pair.id)));
  });

  it('exposes lookup by id', () => {
    for (const definition of characterDefinitions) {
      expect(characterDefinitionById.get(definition.id)).toBe(definition);
    }
  });
});
