export type AssetType = 'character' | 'enemy' | 'weapon' | 'item' | 'background' | 'cutin';

export type Bbox = { x: number; y: number; w: number; h: number };

export type CellResult = {
  index: number;
  row: number;
  col: number;
  bbox: Bbox | null;
  area: number;
  centerX: number;
  centerY: number;
  touchesEdge: boolean;
  empty: boolean;
};

export type WarningLevel = 'warn' | 'error';
export type Warning = { level: WarningLevel; cell?: number; message: string };

export type SheetFormat = {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
};

export type InspectResult = {
  fileName: string;
  width: number;
  height: number;
  format: SheetFormat;
  cells: CellResult[];
  warnings: Warning[];
  totalCells: number;
  filledCells: number;
  emptyCells: number;
};

export type AnchorPoint = {
  name: string;
  x: number;
  y: number;
};

export type CharacterAnchors = {
  head_center?: { x: number; y: number };
  eye_left?: { x: number; y: number };
  eye_right?: { x: number; y: number };
  hand_right?: { x: number; y: number };
  hand_left?: { x: number; y: number };
  waist_left?: { x: number; y: number };
  waist_right?: { x: number; y: number };
  foot_left?: { x: number; y: number };
  foot_right?: { x: number; y: number };
  shadow_center?: { x: number; y: number };
};

export type BaseManifest = {
  id: string;
  displayName: string;
  type: AssetType;
  sourceFileName: string;
  tags: string[];
  notes: string;
};

export type CharacterManifest = BaseManifest & {
  type: 'character';
  characterId: string;
  bodyType: string;
  fixedRules: string[];
  cellWidth: number;
  cellHeight: number;
  columns: number;
  rows: number;
  anchors: CharacterAnchors;
};

export type EnemyManifest = BaseManifest & {
  type: 'enemy';
  enemyId: string;
  baseFamily: string;
  motif: string;
  behavior: string;
  stage: string;
  sizeTier: string;
  palette: string;
  hpTier: string;
  speedTier: string;
  expTier: string;
  unityPrefabHint: string;
};

export type WeaponManifest = BaseManifest & {
  type: 'weapon';
  weaponId: string;
  motif: string;
  trajectory: string;
  maxLevel: number;
  evolutionPairIds: string[];
  evolvedWeaponId: string;
  unityPrefabHint: string;
};

export type ItemManifest = BaseManifest & {
  type: 'item';
  itemId: string;
  category: string;
  effectType: string;
  rarity: string;
  unityPrefabHint: string;
};

export type BackgroundManifest = BaseManifest & {
  type: 'background';
  stageId: string;
  targetSize: string;
  visibilityNotes: string;
};

export type CutinManifest = BaseManifest & {
  type: 'cutin';
  characterId: string;
  mode: string;
  targetSize: string;
  transparentBackground: boolean;
};

export type AssetManifest =
  | CharacterManifest
  | EnemyManifest
  | WeaponManifest
  | ItemManifest
  | BackgroundManifest
  | CutinManifest;

export type ReviewStatus = 'unchecked' | 'candidate' | 'needs-regeneration' | 'approved' | 'rejected';
export type QualityScore = 1 | 2 | 3 | 4 | 5;

export const MANUAL_ISSUE_OPTIONS = [
  'white-background',
  'checkerboard-background',
  'white-fringe',
  'identity-drift',
  'too-noisy',
  'baked-text',
  'wrong-size',
  'wrong-direction',
  'lantern-missing',
  'bag-position-wrong',
  'rarity-frame-baked',
  'poster-composition',
  'ui-baked-in',
] as const;

export type ManualIssue = typeof MANUAL_ISSUE_OPTIONS[number];

export type LibraryEntry = {
  manifest: AssetManifest;
  inspectResult?: InspectResult;
  prompt?: string;
  reviewStatus: ReviewStatus;
  qualityScore: QualityScore;
  reviewNotes: string;
  manualIssues: ManualIssue[];
  createdAt: string;
  updatedAt: string;
};
