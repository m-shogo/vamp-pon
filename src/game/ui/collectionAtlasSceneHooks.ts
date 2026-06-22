import type Phaser from 'phaser';
import type { CollectionSection } from '../data/collectionSections';
import { addCollectionAtlasAtmosphere } from './collectionAtlasAtmosphere';

export type CollectionAtlasSceneLike = Phaser.Scene & {
  add: Phaser.Scene['add'];
  textures: Phaser.Scene['textures'];
};

/**
 * CollectionScene から呼ぶ薄いhook。
 * 画像があればPNG背景、無ければ図形フォールバックへ流す。
 * Scene本体の責務を増やさないための接続口。
 */
export function attachCollectionAtlasAtmosphere(
  scene: CollectionAtlasSceneLike,
  root: Phaser.GameObjects.Container,
  section: CollectionSection,
): void {
  addCollectionAtlasAtmosphere(scene, root, section);
}
