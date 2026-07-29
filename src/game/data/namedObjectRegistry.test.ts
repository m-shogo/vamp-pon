import { describe, expect, it } from 'vitest';
import {
  allLightsCompletionDesign,
  characterObjectLineageById,
  characterObjectLineages,
  namedObjectRegistry,
  validateNamedObjectRegistry,
} from './namedObjectRegistry';

describe('named object registry', () => {
  it('Current21全員に6段階のobject lineageがある', () => {
    expect(characterObjectLineages).toHaveLength(21);
    expect(namedObjectRegistry).toHaveLength(21 * 6);
    expect(new Set(characterObjectLineages.map((entry) => entry.characterId)).size).toBe(21);
    expect(new Set(namedObjectRegistry.map((entry) => entry.id)).size).toBe(namedObjectRegistry.length);
  });

  it('Current Shadow名をstable runtime IDへ接続する', () => {
    expect(characterObjectLineageById.get('kage1')?.characterDisplayName).toBe('カナメ');
    expect(characterObjectLineageById.get('kage2')?.characterDisplayName).toBe('カスミ');
    expect(characterObjectLineageById.get('kage3')?.characterDisplayName).toBe('トキ');
    expect(characterObjectLineageById.get('kage4')?.characterDisplayName).toBe('ツムギ');
  });

  it('全objectが人物・Stage・Gameplay・Archiveへ接続する', () => {
    for (const entry of namedObjectRegistry) {
      const types = new Set(entry.connections.map((connection) => connection.type));
      expect(types.has('character'), entry.id).toBe(true);
      expect(types.has('stage'), entry.id).toBe(true);
      expect(types.has('gameplay'), entry.id).toBe(true);
      expect(types.has('archive'), entry.id).toBe(true);
    }
  });

  it('同名phaseはlineage内の同一object成長として明示する', () => {
    const grouped = new Map<string, typeof namedObjectRegistry>();
    for (const entry of namedObjectRegistry) {
      const entries = grouped.get(entry.lineageId) ?? [];
      entries.push(entry);
      grouped.set(entry.lineageId, entries);
    }

    for (const entries of grouped.values()) {
      const seen = new Set<string>();
      for (const entry of entries) {
        if (seen.has(entry.displayName)) {
          expect(entry.sameObjectPhase, `${entry.id} must mark a repeated phase name`).toBe(true);
        }
        seen.add(entry.displayName);
      }
    }
  });

  it('全灯の朝は有限のdesign targetを持つがruntime分母を偽装しない', () => {
    expect(allLightsCompletionDesign.rewardDisplayName).toBe('全灯の朝');
    expect(allLightsCompletionDesign.runtimeFrozen).toBe(false);
    expect(allLightsCompletionDesign.groups.length).toBeGreaterThan(0);
    for (const group of allLightsCompletionDesign.groups) {
      expect(Number.isInteger(group.designTargetCount), group.id).toBe(true);
      expect(group.designTargetCount, group.id).toBeGreaterThan(0);
    }
  });

  it('レンは祝祭対象のCurrent21だがlaunch必須分母へ自動昇格しない', () => {
    const ren = characterObjectLineageById.get('ren');
    expect(ren?.namingStatus).toBe('WORKING');
    expect(ren?.requiredForLaunchCompletion).toBe(false);
  });

  it('registry validationはerrorなしで、Working名だけwarningにする', () => {
    const result = validateNamedObjectRegistry();
    expect(result.errors).toEqual([]);
    expect(result.warnings).toContain('ren includes Working display names');
  });
});
