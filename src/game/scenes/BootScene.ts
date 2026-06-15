import Phaser from 'phaser';
import { queueExistingAssets, queuePrototypeAssets } from '../assets/loadAssets';
import { isGalleryUrl } from './VisualGalleryScene';

/**
 * 起動シーン。実在するアセット画像だけを読み込んでから本編 or ギャラリーへ。
 * 画像が未配置でも 404 で止まらず（HEADで除外）、各 createXView が Graphics fallback を描く。
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  async create(): Promise<void> {
    let count = await queueExistingAssets(this);
    // 比較ページ用の prototype はギャラリー起動時のみ追加で積む（本番には影響しない）。
    if (isGalleryUrl()) count += await queuePrototypeAssets(this);
    if (count > 0) {
      this.load.once(Phaser.Loader.Events.COMPLETE, () => this.startTarget());
      this.load.start();
    } else {
      this.startTarget();
    }
  }

  private startTarget(): void {
    this.scene.start(isGalleryUrl() ? 'VisualGalleryScene' : 'MainScene');
  }
}
