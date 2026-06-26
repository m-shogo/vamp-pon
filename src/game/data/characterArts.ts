import type { Core5PrototypeCharacterId } from '../assets/core5PrototypeCharacters';
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

export const core5CharacterArts: CharacterArtNameSet[] = [
  {
    characterId: 'yui',
    arts: {
      lampArt: { label: WORLD_TERMS.techniqueRanks.lampTechnique, name: '夜解きの灯' },
      inheritedLight: { label: WORLD_TERMS.techniqueRanks.inheritedLight, name: '忘れ火の道標' },
      dawnLight: { label: WORLD_TERMS.techniqueRanks.dawnLight, name: '消えない名前' },
    },
  },
  {
    characterId: 'asa',
    arts: {
      lampArt: { label: WORLD_TERMS.techniqueRanks.lampTechnique, name: '名札灯し' },
      inheritedLight: { label: WORLD_TERMS.techniqueRanks.inheritedLight, name: '暁綴り' },
      dawnLight: { label: WORLD_TERMS.techniqueRanks.dawnLight, name: '暁に結ぶ名' },
    },
  },
  {
    characterId: 'nagi',
    arts: {
      lampArt: { label: WORLD_TERMS.techniqueRanks.lampTechnique, name: '月箱の鍵' },
      inheritedLight: { label: WORLD_TERMS.techniqueRanks.inheritedLight, name: '封月の守り' },
      dawnLight: { label: WORLD_TERMS.techniqueRanks.dawnLight, name: '夜をしまう箱' },
    },
  },
  {
    characterId: 'michiru',
    arts: {
      lampArt: { label: WORLD_TERMS.techniqueRanks.lampTechnique, name: '帰針' },
      inheritedLight: { label: WORLD_TERMS.techniqueRanks.inheritedLight, name: '星図の道糸' },
      dawnLight: { label: WORLD_TERMS.techniqueRanks.dawnLight, name: '帰り道の星' },
    },
  },
  {
    characterId: 'tomori',
    arts: {
      lampArt: { label: WORLD_TERMS.techniqueRanks.lampTechnique, name: '継火' },
      inheritedLight: { label: WORLD_TERMS.techniqueRanks.inheritedLight, name: '修理灯' },
      dawnLight: { label: WORLD_TERMS.techniqueRanks.dawnLight, name: '夜を直す灯' },
    },
  },
];

export const characterArtById = new Map(core5CharacterArts.map((entry) => [entry.characterId, entry]));

export function dawnLightNameForCharacter(characterId: string, fallback = '消えない名前'): string {
  return characterArtById.get(characterId as Core5PrototypeCharacterId)?.arts.dawnLight.name ?? fallback;
}
