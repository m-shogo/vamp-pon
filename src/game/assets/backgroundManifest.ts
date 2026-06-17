export type BackgroundStatus = 'incoming' | 'prototype' | 'reviewed-candidate' | 'production-candidate' | 'production';

export type BackgroundDisplayAdjustments = {
  cropX: number;
  cropY: number;
  scale: number;
  opacity: number;
  brightness: number;
  saturation: number;
  overlayAlpha: number;
  vignetteAlpha: number;
};

export type BackgroundStageEntry = {
  id: string;
  number: number;
  name: string;
  slug: string;
  environment: string;
  meta: string;
  status: BackgroundStatus;
  enabledForPreview: boolean;
  enabledForRuntime: boolean;
};

export type BackgroundManifest = {
  version: number;
  logicalViewport: { width: number; height: number };
  stages: BackgroundStageEntry[];
};

export type BackgroundMeta = {
  id: string;
  number: number;
  name: string;
  slug: string;
  originalFilename: string;
  image: string;
  status: BackgroundStatus;
  width: number;
  height: number;
  aspectRatio: string;
  symbol: string;
  primaryMisreading: string;
  character: string;
  visualRole: string;
  mainLandmark: string;
  palette: string[];
  centralQuietFloorRatio: number;
  implementationNotes: string;
  narrativeCause: string;
  narrativePayoff: string;
  futureSeed: string | null;
  sourceDocs: string[];
  displayAdjustments: BackgroundDisplayAdjustments;
};

const MANIFEST_PATH = '/assets/prototypes/backgrounds/manifest.json';

let cachedManifest: BackgroundManifest | null = null;
const metaCache = new Map<string, BackgroundMeta>();

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const type = res.headers.get('content-type') ?? '';
    if (type.includes('text/html')) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function loadBackgroundManifest(): Promise<BackgroundManifest | null> {
  if (cachedManifest) return cachedManifest;
  cachedManifest = await fetchJson<BackgroundManifest>(MANIFEST_PATH);
  return cachedManifest;
}

export async function loadBackgroundMeta(stageId: string): Promise<BackgroundMeta | null> {
  const cached = metaCache.get(stageId);
  if (cached) return cached;
  const manifest = await loadBackgroundManifest();
  const entry = manifest?.stages.find((s) => s.id === stageId);
  if (!entry) return null;
  const meta = await fetchJson<BackgroundMeta>(entry.meta);
  if (meta) metaCache.set(stageId, meta);
  return meta;
}

export function getBackgroundByStageId(
  manifest: BackgroundManifest,
  stageId: string,
): BackgroundStageEntry | undefined {
  return manifest.stages.find((s) => s.id === stageId);
}

export function getBackgroundByStageNumber(
  manifest: BackgroundManifest,
  stageNumber: number,
): BackgroundStageEntry | undefined {
  return manifest.stages.find((s) => s.number === stageNumber);
}

export function getPreviewBackgrounds(manifest: BackgroundManifest): BackgroundStageEntry[] {
  return manifest.stages.filter((s) => s.enabledForPreview);
}

export function getRuntimeBackgrounds(manifest: BackgroundManifest): BackgroundStageEntry[] {
  return manifest.stages.filter((s) => s.enabledForRuntime);
}

export function resolveStageBackground(
  manifest: BackgroundManifest,
  options: { stageId?: string; stageNumber?: number },
): BackgroundStageEntry | undefined {
  if (options.stageId) return getBackgroundByStageId(manifest, options.stageId);
  if (options.stageNumber != null) return getBackgroundByStageNumber(manifest, options.stageNumber);
  return undefined;
}
