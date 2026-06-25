import Phaser from 'phaser';
import { installLocalQaLauncher } from './dev/localQaLauncher';
import { installQaErrorLogger } from './dev/qaErrorLogger';
import { BootScene } from './game/scenes/BootScene';
import { CharacterCutinQaScene } from './game/scenes/CharacterCutinQaScene';
import { CollectionScene } from './game/scenes/CollectionScene';
import { Core5SpriteSheetPreviewScene } from './game/scenes/Core5SpriteSheetPreviewScene';
import { EliteDefeatBeatQaScene } from './game/scenes/EliteDefeatBeatQaScene';
import { MainScene } from './game/scenes/MainScene';
import { StageSelectScene } from './game/scenes/StageSelectScene';
import { TopScene } from './game/scenes/TopScene';
import { VisualGalleryScene } from './game/scenes/VisualGalleryScene';
import { SpriteInspectorScene } from './game/scenes/SpriteInspectorScene';
import { WeaponFeedbackQaScene } from './game/scenes/WeaponFeedbackQaScene';
import { Yui96QaScene } from './game/scenes/Yui96QaScene';
import { YuiRageCycleQaScene } from './game/scenes/YuiRageCycleQaScene';
import './styles.css';

installQaErrorLogger();

// BootScene がアセットを preload し、URL（?scene=… / ?debug=…）で本編 or preview へ振り分ける。
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#1d1a34',
  // Runtime text must stay readable on 390x844 mobile screens.
  // Pixel-perfect scaling made Phaser Text look dotty/jagged, so UI readability wins here.
  // Sprite assets that need hard pixel edges should opt in at asset/rendering level later.
  pixelArt: false,
  antialias: true,
  roundPixels: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,
    height: 844,
  },
  scene: [
    BootScene,
    TopScene,
    StageSelectScene,
    CollectionScene,
    MainScene,
    VisualGalleryScene,
    Core5SpriteSheetPreviewScene,
    Yui96QaScene,
    YuiRageCycleQaScene,
    CharacterCutinQaScene,
    EliteDefeatBeatQaScene,
    SpriteInspectorScene,
    WeaponFeedbackQaScene,
  ],
};

const game = new Phaser.Game(config);
if (import.meta.env.DEV) (window as unknown as { __game?: Phaser.Game }).__game = game;
installLocalQaLauncher();
