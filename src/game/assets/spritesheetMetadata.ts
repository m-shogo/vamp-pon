export type SpriteClip = {
  name: string;
  frames: number[];
  fps: number;
  loop: boolean;
};

export type CellQualityWarning = {
  cellIndex: number;
  type: 'empty' | 'too-small' | 'too-large' | 'edge-touch' | 'jitter' | 'missing-prop';
  message: string;
};

export type SpritesheetMetadata = {
  assetId: string;
  file: string;
  frameWidth: number;
  frameHeight: number;
  columns: number;
  rows: number;
  totalFrames: number;
  clips: SpriteClip[];
  anchorPolicy: 'center' | 'bottom-center' | 'custom';
  anchorX?: number;
  anchorY?: number;
  notes: string;
  qualityWarnings: CellQualityWarning[];
};
