import Phaser from 'phaser';
import { queueExistingAssets, queuePrototypeAssets, queueStageBackgrounds } from '../assets/loadAssets';
import { isCore5SpriteSheetPreviewUrl } from './Core5SpriteSheetPreviewScene';
import { isGalleryUrl, isBackgroundPreviewUrl } from './VisualGalleryScene';
import { isYui96QaUrl } from './Yui96QaScene';
import { getRequestedStageNumber } from '../ui/background';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  async create(): Promise<void> {
    let count = await queueExistingAssets(this);
    if (isGalleryUrl() || isCore5SpriteSheetPreviewUrl()) count += await queuePrototypeAssets(this);

    if (isBackgroundPreviewUrl()) {
      count += await queueStageBackgrounds(this);
    } else {
      const stageNum = getRequestedStageNumber() ?? 1;
      count += await queueStageBackgrounds(this, stageNum);
    }

    if (count > 0) {
      this.load.once(Phaser.Loader.Events.COMPLETE, () => this.startTarget());
      this.load.start();
    } else {
      this.startTarget();
    }
  }

  private startTarget(): void {
    if (isCore5SpriteSheetPreviewUrl()) {
      this.scene.start('Core5SpriteSheetPreviewScene');
      return;
    }
    if (isYui96QaUrl()) {
      this.scene.start('Yui96QaScene');
      return;
    }
    this.scene.start(isGalleryUrl() ? 'VisualGalleryScene' : 'MainScene');
  }
}
