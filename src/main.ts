import Phaser from 'phaser';
import { BootScene } from './game/scenes/BootScene';
import { Core5SpriteSheetPreviewScene } from './game/scenes/Core5SpriteSheetPreviewScene';
import { MainScene } from './game/scenes/MainScene';
import { VisualGalleryScene } from './game/scenes/VisualGalleryScene';
import { Yui96QaScene } from './game/scenes/Yui96QaScene';
import './styles.css';

// BootScene がアセットを preload し、URL（?scene=… / ?debug=…）で本編 or preview へ振り分ける。
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#1d1a34',
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,
    height: 844,
  },
  scene: [BootScene, MainScene, VisualGalleryScene, Core5SpriteSheetPreviewScene, Yui96QaScene],
};

new Phaser.Game(config);
