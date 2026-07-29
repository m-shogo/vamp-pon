import Phaser from 'phaser';
import type { CollectionSection } from '../data/collectionSections';
import { normalizeCollectionDisplayTerm } from '../data/collectionDisplayTerms';
import { addCollectionAtlasAtmosphere } from './collectionAtlasAtmosphere';

export type CollectionAtlasSceneLike = Phaser.Scene & {
  add: Phaser.Scene['add'];
  textures: Phaser.Scene['textures'];
};

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
