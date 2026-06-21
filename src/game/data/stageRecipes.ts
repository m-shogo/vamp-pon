import type { Id, WaveDefinition } from '../domain/types';

export type StageRecipe = {
  stageNumber: number;
  id: Id;
  name: string;
  theme: string;
  /** そのステージで主役にする敵パターン。wave側のpatternIdと照合する。 */
  allowedPatternIds: Id[];
  /** ステージ固有のwave。既存wavesから段階的に移行する。 */
  waves: WaveDefinition[];
};

export function stageRecipeUsesPattern(recipe: StageRecipe, patternId: Id): boolean {
  return recipe.allowedPatternIds.includes(patternId);
}
