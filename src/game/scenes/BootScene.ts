import Phaser from 'phaser';
import { queueExistingAssets, queuePrototypeAssets, queueStageBackgrounds } from '../assets/loadAssets';
import { getRequestedStageNumber } from '../ui/background';
import { isRunStartUrl } from '../utils/runStartUrl';
import { loadGameFonts } from '../ui/fonts';
import { getAudioManager } from '../audio/AudioManager';
import type { DevSceneRoute } from '../../dev/devSceneRoutes';

export class BootScene extends Phaser.Scene {
  private devRoutes: DevSceneRoute[] = [];
  private devIsBackgroundPreview: (() => boolean) | null = null;

  constructor() {
    super('BootScene');
  }

  async create(): Promise<void> {
    if (import.meta.env.DEV) {
      const mod = await import('../../dev/devSceneRoutes');
      this.devRoutes = mod.DEV_SCENE_ROUTES;
      this.devIsBackgroundPreview = mod.isBackgroundPreviewUrl;
    }

    await loadGameFonts();
    let count = await queueExistingAssets(this);

    if (import.meta.env.DEV) {
      const matched = this.devRoutes.find((r) => r.guard());
      if (matched?.needsPrototypeAssets) count += await queuePrototypeAssets(this);
    }

    if (this.devIsBackgroundPreview?.()) {
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
    if (import.meta.env.DEV) {
      for (const route of this.devRoutes) {
        if (route.guard()) {
          this.scene.start(route.sceneName);
          return;
        }
      }
    }
    this.scene.start(isRunStartUrl() ? 'MainScene' : 'TopScene');
  }
}
