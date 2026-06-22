import { describe, it, expect } from 'vitest';
import { stageRecipes, recipeForStage, wavesForStage } from '../../data/waves';

describe('Stage config', () => {
  it('Stage1とStage2のレシピが存在する', () => {
    expect(stageRecipes.length).toBeGreaterThanOrEqual(2);
    expect(stageRecipes[0]?.stageNumber).toBe(1);
    expect(stageRecipes[1]?.stageNumber).toBe(2);
  });

  it('recipeForStageがStage1/Stage2を正しく返す', () => {
    expect(recipeForStage(1).stageNumber).toBe(1);
    expect(recipeForStage(2).stageNumber).toBe(2);
  });

  it('Stage2のwaveが存在しStage1より圧が高い', () => {
    const w1 = wavesForStage(1);
    const w2 = wavesForStage(2);
    expect(w2.length).toBe(w1.length);
    const s1Max = w1[w1.length - 1]?.spawns[0]?.maxAlive ?? 0;
    const s2Max = w2[w2.length - 1]?.spawns[0]?.maxAlive ?? 0;
    expect(s2Max).toBeGreaterThan(s1Max);
  });

  it('Stage2のwave noteにStage2ラベルが含まれる', () => {
    const w2 = wavesForStage(2);
    expect(w2[0]?.note).toContain('Stage2');
  });

  it('全stageRecipeのid/nameが非空文字列', () => {
    for (const recipe of stageRecipes) {
      expect(recipe.id.length).toBeGreaterThan(0);
      expect(recipe.name.length).toBeGreaterThan(0);
    }
  });
});
