import type { Core5PrototypeCharacterId } from '../assets/core5PrototypeCharacters';
import { characterCanon } from './characterCanon';
import { WORLD_TERMS } from './worldTerms';

export type CharacterArtTier = {
  label: string;
  name: string;
};

export type CharacterArtSet = {
  lampArt: CharacterArtTier;
  inheritedLight: CharacterArtTier;
  dawnLight: CharacterArtTier;
};

export type CharacterArtNameSet = {
  characterId: Core5PrototypeCharacterId;
  arts: CharacterArtSet;
};

const core5Ids = new Set<Core5PrototypeCharacterId>(['yui', 'asa', 'nagi', 'michiru', 'tomori']);

export const core5CharacterArts: CharacterArtNameSet[] = characterCanon
  .filter((entry) => entry.group === 'core5' && core5Ids.has(entry.id as Core5PrototypeCharacterId))
  .map((entry) => ({
    characterId: entry.id as Core5PrototypeCharacterId,
    arts: {
      lampArt: {
        label: WORLD_TERMS.techniqueRanks.lampTechnique,
        name: entry.arts.lampArt,
      },
      inheritedLight: {
        label: WORLD_TERMS.techniqueRanks.inheritedLight,
        name: entry.arts.inheritedLight,
      },
      dawnLight: {
        label: WORLD_TERMS.techniqueRanks.dawnLight,
        name: entry.arts.dawnLight,
      },
    },
  }));

export const characterArtById = new Map(core5CharacterArts.map((entry) => [entry.characterId, entry]));

export function dawnLightNameForCharacter(characterId: string, fallback = '消えない名前'): string {
  return characterArtById.get(characterId as Core5PrototypeCharacterId)?.arts.dawnLight.name ?? fallback;
}
