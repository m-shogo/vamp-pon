import Phaser from 'phaser';
import { BootScene } from './game/scenes/BootScene';
import { MainScene } from './game/scenes/MainScene';
import { VisualGalleryScene } from './game/scenes/VisualGalleryScene';
import './styles.css';

// BootScene がアセットを preload し、URL（?scene=…）で本編 or ギャラリーへ振り分ける。
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  backgroundColor: '#1d1a34',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,
    height: 844,
  },
  scene: [BootScene, MainScene, VisualGalleryScene],
};

new Phaser.Game(config);
