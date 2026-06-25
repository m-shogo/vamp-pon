import Phaser from 'phaser';
import { installLocalQaLauncher } from './dev/localQaLauncher';
import { installQaErrorLogger } from './dev/qaErrorLogger';
import { BootScene } from './game/scenes/BootScene';
import { CollectionScene } from './game/scenes/CollectionScene';
import { MainScene } from './game/scenes/MainScene';
import { StageSelectScene } from './game/scenes/StageSelectScene';
import { TopScene } from './game/scenes/TopScene';
import './styles.css';

installQaErrorLogger();

const productionScenes: Phaser.Types.Scenes.SceneType[] = [
  BootScene,
  TopScene,
  StageSelectScene,
  CollectionScene,
  MainScene,
];

const devScenes: Phaser.Types.Scenes.SceneType[] = [];
if (import.meta.env.DEV) {
  const { CharacterCutinQaScene } = await import('./game/scenes/CharacterCutinQaScene');
  const { Core5SpriteSheetPreviewScene } = await import('./game/scenes/Core5SpriteSheetPreviewScene');
  const { EliteDefeatBeatQaScene } = await import('./game/scenes/EliteDefeatBeatQaScene');
  const { SpriteInspectorScene } = await import('./game/scenes/SpriteInspectorScene');
  const { VisualGalleryScene } = await import('./game/scenes/VisualGalleryScene');
  const { WeaponFeedbackQaScene } = await import('./game/scenes/WeaponFeedbackQaScene');
  const { Yui96QaScene } = await import('./game/scenes/Yui96QaScene');
  const { YuiRageCycleQaScene } = await import('./game/scenes/YuiRageCycleQaScene');
  devScenes.push(
    VisualGalleryScene,
    Core5SpriteSheetPreviewScene,
    Yui96QaScene,
    YuiRageCycleQaScene,
    CharacterCutinQaScene,
    EliteDefeatBeatQaScene,
    SpriteInspectorScene,
    WeaponFeedbackQaScene,
  );
}

// BootScene がアセットを preload し、URL（?scene=… / ?debug=…）で本編 or preview へ振り分ける。
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#1d1a34',
  pixelArt: false,
  antialias: true,
  roundPixels: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,
    height: 844,
  },
  scene: [...productionScenes, ...devScenes],
};

const game = new Phaser.Game(config);
if (import.meta.env.DEV) (window as unknown as { __game?: Phaser.Game }).__game = game;
installLocalQaLauncher();
