import { describe, expect, it } from 'vitest';
import { forgottenStreetNightBoardCompatibility } from './collectionProgressCompatibility';
import {
  characterConstellationRoots,
  constellationGroupRoots,
  forgottenStreetConstellationNodes,
  globalConstellationDefinition,
  itemLineageConstellationRoots,
  namedObjectConstellationLinks,
  stageConstellationRoots,
  validateGlobalConstellationDefinition,
} from './globalConstellationDefinition';
import { namedObjectRegistry } from './namedObjectRegistry';

describe('global constellation definition', () => {
  it('6 group・20 Stage・21人・21 lineageをnavigation rootへ載せる', () => {
    expect(constellationGroupRoots).toHaveLength(6);
    expect(stageConstellationRoots).toHaveLength(20);
    expect(characterConstellationRoots).toHaveLength(21);
    expect(itemLineageConstellationRoots).toHaveLength(21);
  });

  it('Stage1既存25札をsource IDごと保持する', () => {
    expect(forgottenStreetConstellationNodes).toHaveLength(
      forgottenStreetNightBoardCompatibility.cells.length,
    );
    expect(forgottenStreetConstellationNodes.map((node) => node.sourceId)).toEqual(
      forgottenStreetNightBoardCompatibility.cells.map((cell) => cell.id),
    );
    expect(forgottenStreetConstellationNodes.every((node) => node.activeCompletionNode)).toBe(
      true,
    );
  });

  it('126 named object全てをCharacter・lineage・Stageへ接続する', () => {
    expect(namedObjectConstellationLinks).toHaveLength(namedObjectRegistry.length);
    for (const link of namedObjectConstellationLinks) {
      expect(link.characterNodeId).toMatch(/^constellation-character:/u);
      expect(link.lineageNodeId).toMatch(/^constellation-lineage:/u);
      expect(link.stageNodeIds.length, link.objectId).toBeGreaterThan(0);
    }
  });

  it('Current21 relationship先も存在するcharacter nodeへ向く', () => {
    const characterNodeIds = new Set(characterConstellationRoots.map((node) => node.id));
    for (const link of namedObjectConstellationLinks) {
      for (const relationshipNodeId of link.relationshipCharacterNodeIds) {
        expect(characterNodeIds.has(relationshipNodeId), `${link.objectId}: ${relationshipNodeId}`).toBe(
          true,
        );
      }
    }
  });

  it('Definitionだけではruntime接続・100%分母freezeを主張しない', () => {
    expect(globalConstellationDefinition.runtimeConnected).toBe(false);
    expect(globalConstellationDefinition.runtimeDenominatorFrozen).toBe(false);
  });

  it('graph validationは参照切れなし', () => {
    expect(validateGlobalConstellationDefinition().errors).toEqual([]);
  });
});
