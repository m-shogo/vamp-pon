import Phaser from 'phaser';
import type { CollectionSection } from '../data/collectionSections';
import { addCollectionAtlasAtmosphere } from './collectionAtlasAtmosphere';

export type CollectionAtlasSceneLike = Phaser.Scene & {
  add: Phaser.Scene['add'];
  textures: Phaser.Scene['textures'];
};

export const LEGACY_KEEPER_HEADER = '灯名・黒曜・朝明・欠けた心を、絵札として残す頁。';
export const CURRENT_KEEPER_HEADER = '灯名・黒耀化・朝明・欠けた心を、絵札として残す頁。';

export function normalizeCollectionDisplayTerm(value: string): string {
  return value === LEGACY_KEEPER_HEADER ? CURRENT_KEEPER_HEADER : value;
}

function normalizeCollectionTextTree(gameObject: Phaser.GameObjects.GameObject): void {
  if (gameObject instanceof Phaser.GameObjects.Text) {
    const current = gameObject.text;
    const normalized = normalizeCollectionDisplayTerm(current);
    if (normalized !== current) gameObject.setText(normalized);
    return;
  }

  if (gameObject instanceof Phaser.GameObjects.Container) {
    for (const child of gameObject.list) {
      normalizeCollectionTextTree(child);
    }
  }
}

function scheduleCurrentTermNormalization(root: Phaser.GameObjects.Container): void {
  queueMicrotask(() => {
    if (!root.active) return;
    normalizeCollectionTextTree(root);
  });
}

/**
 * CollectionScene から呼ぶ薄いhook。
 * 画像があればPNG背景、無ければ図形フォールバックへ流す。
 * Scene本体の責務を増やさないための接続口。
 *
 * Current用語の正規化は完全一致する既知のLegacy headerだけに限定する。
 * Enemy表示名や経済表示名を推測で置換しない。
 */
export function attachCollectionAtlasAtmosphere(
  scene: CollectionAtlasSceneLike,
  root: Phaser.GameObjects.Container,
  section: CollectionSection,
): void {
  addCollectionAtlasAtmosphere(scene, root, section);
  scheduleCurrentTermNormalization(root);
}
