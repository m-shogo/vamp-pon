import { plannedCharacterSeeds } from '../data/characterRelationshipDesign';
import type { Id } from '../domain/types';

export type SubCharacterOption = {
  characterId: Id;
  name: string;
  enabled: boolean;
  selected: boolean;
  reason?: string;
  tags: string[];
  summary: string;
};

export type BuildSubCharacterOptionsParams = {
  mainCharacterId: Id;
  selectedSubCharacterId?: Id;
  /** 未指定なら plannedCharacterSeeds の implemented を使う。 */
  implementedCharacterIds?: Id[];
  /** 未指定なら yui 以外の計画キャラも「準備中」として表示する。 */
  showPlannedCharacters?: boolean;
};

export function buildSubCharacterOptions({
  mainCharacterId,
  selectedSubCharacterId,
  implementedCharacterIds,
  showPlannedCharacters = true,
}: BuildSubCharacterOptionsParams): SubCharacterOption[] {
  const implemented = new Set(
    implementedCharacterIds ?? plannedCharacterSeeds.filter((seed) => seed.implemented).map((seed) => seed.id),
  );

  return plannedCharacterSeeds
    .filter((seed) => seed.id !== mainCharacterId)
    .filter((seed) => showPlannedCharacters || implemented.has(seed.id))
    .map((seed) => {
      const enabled = implemented.has(seed.id);
      return {
        characterId: seed.id,
        name: seed.name,
        enabled,
        selected: selectedSubCharacterId === seed.id && enabled,
        reason: enabled ? undefined : '準備中',
        tags: seed.tags,
        summary: `${seed.lightKind} / ${seed.fixedWeaponFlavor}`,
      };
    });
}

export function isValidSubCharacterSelection(
  mainCharacterId: Id,
  subCharacterId: Id | undefined,
  implementedCharacterIds?: Id[],
): boolean {
  if (!subCharacterId || subCharacterId === mainCharacterId) return false;
  const implemented = new Set(
    implementedCharacterIds ?? plannedCharacterSeeds.filter((seed) => seed.implemented).map((seed) => seed.id),
  );
  return implemented.has(subCharacterId);
}
