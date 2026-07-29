import { WORLD_TERMS } from './worldTerms.ts';

export const SCREEN_LABELS = {
  home: WORLD_TERMS.screens.home,
  startRun: WORLD_TERMS.screens.start,
  continueRun: WORLD_TERMS.screens.continue,
  retryRun: WORLD_TERMS.screens.retry,
  stageSelect: WORLD_TERMS.screens.stageSelect,
  characterSelect: WORLD_TERMS.screens.characterSelect,
  characterDetail: WORLD_TERMS.screens.characterDetail,
  collection: WORLD_TERMS.screens.collection,
  upgrade: WORLD_TERMS.screens.upgrade,
  permanentUpgrade: WORLD_TERMS.screens.permanentUpgrade,
  shop: WORLD_TERMS.screens.shop,
  settings: WORLD_TERMS.screens.settings,
  initialWeapon: WORLD_TERMS.screens.initialWeapon,
  pairArtList: WORLD_TERMS.screens.pairArtList,
} as const;

export type ScreenLabels = typeof SCREEN_LABELS;
