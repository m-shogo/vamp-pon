import Phaser from 'phaser';
import { MainScene } from './game/scenes/MainScene';
import { VisualGalleryScene, isGalleryUrl } from './game/scenes/VisualGalleryScene';
import './styles.css';

// ?scene=visual-gallery / combat-mock / evolution-showcase でビジュアル確認シーンを起動。
// それ以外は通常のゲーム。
const gallery = isGalleryUrl();

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
  scene: gallery ? [VisualGalleryScene] : [MainScene],
};

new Phaser.Game(config);
