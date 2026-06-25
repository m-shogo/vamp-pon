import Phaser from 'phaser';
import { queueExistingAssets, queuePrototypeAssets, queueStageBackgrounds } from '../assets/loadAssets';
import { isCharacterCutinQaUrl } from './CharacterCutinQaScene';
import { isCore5SpriteSheetPreviewUrl } from './Core5SpriteSheetPreviewScene';
import { isEliteDefeatBeatQaUrl } from './EliteDefeatBeatQaScene';
import { isSpriteInspectorUrl } from './SpriteInspectorScene';
import { isGalleryUrl, isBackgroundPreviewUrl } from './VisualGalleryScene';
import { isWeaponFeedbackQaUrl as isFxQaUrl } from './WeaponFeedbackQaScene';
import { isYui96QaUrl } from './Yui96QaScene';
import { isYuiRageCycleQaUrl } from './YuiRageCycleQaScene';
import { getRequestedStageNumber } from '../ui/background';
import { isRunStartUrl } from '../utils/runStartUrl';
import { loadGameFonts } from '../ui/fonts';
import { getAudioManager } from '../audio/AudioManager';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  async create(): Promise<void> {
    await loadGameFonts();
    let count = await queueExistingAssets(this);
    if (isGalleryUrl() || isCore5SpriteSheetPreviewUrl()) count += await queuePrototypeAssets(this);

    if (isBackgroundPreviewUrl()) {
      count += await queueStageBackgrounds(this);
    } else {
      const stageNum = getRequestedStageNumber() ?? 1;
      count += await queueStageBackgrounds(this, stageNum);
    }

    count += await getAudioManager(this).preloadAudioAssets(this);

    if (count > 0) {
      this.load.once(Phaser.Loader.Events.COMPLETE, () => this.startTarget());
      this.load.start();
    } else {
      this.startTarget();
    }
  }

  private startTarget(): void {
    if (isSpriteInspectorUrl()) {
      this.scene.start('SpriteInspectorScene');
      return;
    }
    if (isCore5SpriteSheetPreviewUrl()) {
      this.scene.start('Core5SpriteSheetPreviewScene');
      return;
    }
    if (isYui96QaUrl()) {
      this.scene.start('Yui96QaScene');
      return;
    }
    if (isYuiRageCycleQaUrl()) {
      this.scene.start('YuiRageCycleQaScene');
      return;
    }
    if (isCharacterCutinQaUrl()) {
      this.scene.start('CharacterCutinQaScene');
      return;
    }
    if (isEliteDefeatBeatQaUrl()) {
      this.scene.start('EliteDefeatBeatQaScene');
      return;
    }
    if (isFxQaUrl()) {
      this.scene.start('WeaponFeedbackQaScene');
      return;
    }
    if (isGalleryUrl()) {
      this.scene.start('VisualGalleryScene');
      return;
    }
    this.scene.start(isRunStartUrl() ? 'MainScene' : 'TopScene');
  }
}
