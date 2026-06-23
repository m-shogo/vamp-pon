import type Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import type { CollectionSection } from '../data/collectionSections';
import { STORYBOOK_UI } from './storybookUi';
import { renderCollectionAtlasBackdrop } from './CollectionAtlasBackdropRenderer';

export function addCollectionAtlasAtmosphere(
  scene: Phaser.Scene,
  root: Phaser.GameObjects.Container,
  section: CollectionSection,
): void {
  const renderedImage = renderCollectionAtlasBackdrop(scene, root, section);
  if (renderedImage) return;
  addCollectionAtlasFallbackAtmosphere(scene, root, section);
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

  g.fillStyle(section.accent, 0.035);
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
      break;
    case 'lost_item_cards':
      for (let i = 0; i < 8; i += 1) {
        const x = 64 + (i % 4) * 82;
        const y = 180 + Math.floor(i / 4) * 360;
        g.fillStyle(section.accent, 0.08);
        g.fillRect(x, y, 34, 24);
        g.lineStyle(1, STORYBOOK_UI.goldLight, 0.12);
        g.strokeRect(x, y, 34, 24);
      }
      break;
    case 'keeper_records':
      g.lineStyle(1, section.accent, 0.18);
      g.strokeCircle(GAME_WIDTH / 2, 358, 112);
      g.strokeCircle(GAME_WIDTH / 2, 358, 70);
      g.fillStyle(STORYBOOK_UI.goldLight, 0.12);
      g.fillCircle(GAME_WIDTH / 2, 358, 9);
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
    default:
      break;
  }

  root.add(g);
}
