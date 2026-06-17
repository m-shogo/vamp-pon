import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { hasAsset } from '../assets/assetHelpers';
import type { BackgroundStageEntry, BackgroundMeta } from '../assets/backgroundManifest';

export function getRequestedStageNumber(): number | null {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('stage');
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 1 && n <= 99 ? n : null;
}

export function createBackground(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  c.setDepth(VIEW_DEPTH.background);

  if (hasAsset(scene, 'bg_stage1_paper_night')) {
    c.add(scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_stage1_paper_night').setOrigin(0, 0));
    c.add(scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x20263d, 0.22));
    c.add(scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 56, GAME_HEIGHT - 176, 0x2f3854, 0.12));
    for (const spot of [
      { x: 26, y: 96 }, { x: GAME_WIDTH - 28, y: 250 }, { x: 38, y: GAME_HEIGHT - 200 }, { x: GAME_WIDTH - 34, y: GAME_HEIGHT - 120 },
    ]) {
      c.add(scene.add.circle(spot.x, spot.y, 46, COLORS.lantern, 0.025));
    }
    return c;
  }

  c.add(scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.background));

  const g = scene.add.graphics();
  for (let i = 0; i < 260; i += 1) {
    const x = Math.random() * GAME_WIDTH;
    const y = Math.random() * GAME_HEIGHT;
    const light = Math.random() < 0.5;
    g.fillStyle(light ? COLORS.backgroundTile : COLORS.backgroundEdge, 0.35);
    g.fillRect(x, y, 2, 2);
  }
  for (let i = 0; i < 5; i += 1) {
    g.lineStyle(26, COLORS.backgroundEdge, 0.1);
    g.strokeRect(-13 + i * 12, -13 + i * 12, GAME_WIDTH + 26 - i * 24, GAME_HEIGHT + 26 - i * 24);
  }
  c.add(g);

  const scraps = scene.add.graphics();
  for (let i = 0; i < 30; i += 1) {
    const edge = Math.random() < 0.7;
    const x = edge ? (Math.random() < 0.5 ? Math.random() * 70 : GAME_WIDTH - Math.random() * 70) : Math.random() * GAME_WIDTH;
    const y = Math.random() * GAME_HEIGHT;
    const w = 5 + Math.random() * 7;
    scraps.fillStyle(COLORS.paperScrap, 0.16 + Math.random() * 0.1);
    scraps.fillRect(x, y, w, w * 0.7);
  }
  for (let i = 0; i < 7; i += 1) {
    const x = Math.random() * GAME_WIDTH;
    const y = Math.random() * GAME_HEIGHT;
    const r = 6 + Math.random() * 10;
    scraps.fillStyle(COLORS.backgroundEdge, 0.5);
    scraps.fillEllipse(x, y, r * 2, r * 1.4);
  }
  c.add(scraps);

  const lampSpots = [
    { x: 26, y: 96 },
    { x: GAME_WIDTH - 28, y: 250 },
    { x: 38, y: GAME_HEIGHT - 200 },
    { x: GAME_WIDTH - 34, y: GAME_HEIGHT - 120 },
  ];
  for (const spot of lampSpots) {
    c.add(scene.add.circle(spot.x, spot.y, 46, COLORS.lantern, 0.05));
    c.add(scene.add.circle(spot.x, spot.y, 22, COLORS.lantern, 0.06));
  }

  return c;
}

export function createStageBackground(
  scene: Phaser.Scene,
  textureKey: string,
  meta?: BackgroundMeta | null,
): Phaser.GameObjects.Container {
  if (!scene.textures.exists(textureKey)) {
    return createBackground(scene);
  }

  const c = scene.add.container(0, 0);
  c.setDepth(VIEW_DEPTH.background);

  const tex = scene.textures.get(textureKey);
  const srcFrame = tex.get();
  const imgW = srcFrame.width;
  const imgH = srcFrame.height;

  const adj = meta?.displayAdjustments;
  const cropX = adj?.cropX ?? 0;
  const cropY = adj?.cropY ?? 0;
  const scaleOverride = adj?.scale ?? 1;
  const overlayAlpha = adj?.overlayAlpha ?? 0.18;
  const vignetteAlpha = adj?.vignetteAlpha ?? 0.12;

  const scaleToFill = Math.max(GAME_WIDTH / imgW, GAME_HEIGHT / imgH) * scaleOverride;

  const img = scene.add.image(GAME_WIDTH / 2 + cropX, GAME_HEIGHT / 2 + cropY, textureKey);
  img.setScale(scaleToFill);
  c.add(img);

  if (adj?.opacity != null && adj.opacity < 1) {
    img.setAlpha(adj.opacity);
  }

  if (overlayAlpha > 0) {
    c.add(scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1d1a34, overlayAlpha));
  }

  if (vignetteAlpha > 0) {
    const vg = scene.add.graphics();
    for (let i = 0; i < 4; i += 1) {
      vg.lineStyle(20, 0x1d1a34, vignetteAlpha * (1 - i * 0.2));
      vg.strokeRect(i * 8, i * 8, GAME_WIDTH - i * 16, GAME_HEIGHT - i * 16);
    }
    c.add(vg);
  }

  return c;
}

export function stageBackgroundTextureKey(entry: BackgroundStageEntry): string {
  return `bg_proto_${entry.id.replace(/-/g, '_')}`;
}
