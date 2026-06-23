import type Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import type { CollectionSection } from '../data/collectionSections';
import { STORYBOOK_UI } from './storybookUi';
import { renderCollectionAtlasBackdrop } from './CollectionAtlasBackdropRenderer';
import { drawInkVignette, drawMapThreads, drawPaperScrap } from './premiumPaperUi';

export function addCollectionAtlasAtmosphere(
  scene: Phaser.Scene,
  root: Phaser.GameObjects.Container,
  section: CollectionSection,
): void {
  addCollectionBookSurface(scene, root, section);
  const renderedImage = renderCollectionAtlasBackdrop(scene, root, section);
  if (renderedImage) return;
  addCollectionAtlasFallbackAtmosphere(scene, root, section);
}

function addCollectionBookSurface(
  scene: Phaser.Scene,
  root: Phaser.GameObjects.Container,
  section: CollectionSection,
): void {
  const edge = scene.add.graphics();
  drawInkVignette(edge, GAME_WIDTH, GAME_HEIGHT, { alpha: 0.18, depthInk: false });
  edge.fillStyle(section.accent, 0.018).fillCircle(GAME_WIDTH / 2, 246, 178);
  edge.fillStyle(STORYBOOK_UI.goldLight, 0.018).fillCircle(GAME_WIDTH / 2 - 44, 112, 84);
  root.add(edge);

  const paper = scene.add.graphics();
  for (let i = 0; i < 10; i += 1) {
    const x = 34 + (i * 37) % (GAME_WIDTH - 68);
    const y = 142 + ((i * 83) % 520);
    const w = 8 + (i % 4) * 4;
    const h = 5 + (i % 3) * 3;
    drawPaperScrap(paper, x, y, w, h, STORYBOOK_UI.paperLight, 0.035 + (i % 3) * 0.01);
  }
  drawMapThreads(paper, GAME_WIDTH / 2, 104, 188, 0.12);
  drawMapThreads(paper, GAME_WIDTH / 2, 698, 156, 0.1);
  root.add(paper);
}

export function addCollectionAtlasFallbackAtmosphere(
  scene: Phaser.Scene,
  root: Phaser.GameObjects.Container,
  section: CollectionSection,
): void {
  const g = scene.add.graphics();
  const left = GAME_WIDTH / 2 - 166;
  const right = GAME_WIDTH / 2 + 166;
  const top = 154;
  const bottom = 676;

  g.fillStyle(section.accent, 0.032);
  g.fillRect(left, top, right - left, bottom - top);
  g.lineStyle(1, section.accent, 0.12);

  switch (section.id) {
    case 'dawn_atlas': {
      const points: Array<[number, number]> = [[74, 176], [152, 220], [232, 188], [302, 254], [110, 326], [250, 360], [326, 424]];
      for (let i = 0; i < points.length - 1; i += 1) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[i + 1];
        g.lineBetween(x1, y1, x2, y2);
      }
      g.fillStyle(STORYBOOK_UI.goldLight, 0.22);
      points.forEach(([x, y]) => g.fillCircle(x, y, 2.5));
      g.lineStyle(1, STORYBOOK_UI.goldLight, 0.08);
      g.strokeCircle(GAME_WIDTH / 2, 294, 128);
      break;
    }
    case 'bestiary':
      g.fillStyle(section.accent, 0.08);
      g.fillCircle(92, 248, 34);
      g.fillCircle(292, 388, 42);
      g.fillCircle(120, 548, 28);
      g.fillStyle(0x050817, 0.28);
      g.fillCircle(92, 256, 20);
      g.fillCircle(292, 398, 24);
      g.fillCircle(120, 554, 16);
      g.lineStyle(1, section.accent, 0.12);
      g.strokeCircle(292, 388, 52);
      break;
    case 'lost_item_cards':
      for (let i = 0; i < 8; i += 1) {
        const x = 64 + (i % 4) * 82;
        const y = 180 + Math.floor(i / 4) * 360;
        g.fillStyle(section.accent, 0.08);
        g.fillRect(x, y, 34, 24);
        g.lineStyle(1, STORYBOOK_UI.goldLight, 0.12);
        g.strokeRect(x, y, 34, 24);
        g.fillStyle(STORYBOOK_UI.paperLight, 0.04);
        g.fillRect(x + 5, y + 6, 24, 2);
      }
      break;
    case 'keeper_records':
      g.lineStyle(1, section.accent, 0.18);
      g.strokeCircle(GAME_WIDTH / 2, 358, 112);
      g.strokeCircle(GAME_WIDTH / 2, 358, 70);
      g.fillStyle(STORYBOOK_UI.goldLight, 0.12);
      g.fillCircle(GAME_WIDTH / 2, 358, 9);
      g.fillStyle(section.accent, 0.05);
      g.fillCircle(GAME_WIDTH / 2 - 82, 296, 16);
      g.fillCircle(GAME_WIDTH / 2 + 82, 424, 14);
      break;
    case 'word_records':
      for (let i = 0; i < 9; i += 1) {
        const y = 170 + i * 54;
        g.lineStyle(1, section.accent, 0.1);
        g.lineBetween(68, y, 322, y);
        g.fillStyle(section.accent, 0.08);
        g.fillRect(78, y + 12, 110 + (i % 3) * 34, 2);
      }
      break;
    case 'achievements':
      g.lineStyle(1, STORYBOOK_UI.goldLight, 0.12);
      g.strokeCircle(GAME_WIDTH / 2, 376, 142);
      g.strokeCircle(GAME_WIDTH / 2, 376, 96);
      g.fillStyle(STORYBOOK_UI.goldLight, 0.11);
      g.fillCircle(92, 242, 7);
      g.fillCircle(298, 520, 6);
      g.fillStyle(section.accent, 0.06);
      g.fillRect(66, 224, 258, 2);
      g.fillRect(66, 624, 258, 2);
      break;
    default:
      break;
  }

  root.add(g);
}
