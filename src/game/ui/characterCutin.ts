import type Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { YUI_FRAME_IDS } from '../assets/playerFrames';
import { YUI_EXPRESSION_RAGE_SHEET } from '../assets/yuiExpressionRageSheet';
import { VIEW_DEPTH } from './factory';
import { FONT } from './visualDesign';

export type CharacterCutinMode = 'ultimate' | 'berserk';

/** Future production texture keys. Registering them later replaces the fallback automatically. */
export const CHARACTER_CUTIN_TEXTURE = {
  ultimate: 'yui_cutin_ultimate',
  berserk: 'yui_cutin_berserk',
} as const;

const BERSERK_CUTIN_SHEET_FRAME = 15;

export function playCharacterCutin(scene: Phaser.Scene, mode: CharacterCutinMode): void {
  const depth = VIEW_DEPTH.overlay - 2;
  const isBerserk = mode === 'berserk';
  const accent = isBerserk ? 0x38203f : 0xd9b65f;
  const paper = isBerserk ? 0x17101f : 0xeee1bd;
  const textColor = isBerserk ? '#f4d9fa' : '#332817';
  const title = isBerserk ? '黒灯化' : '灯りよ、帰り道を';
  const subtitle = isBerserk ? '黒い灯りが記憶を照らす' : '忘れたものを照らし出す';
  const root = scene.add.container(0, 0).setDepth(depth).setScrollFactor(0);

  const shade = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x080713, 0.16);
  const panel = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 36, GAME_WIDTH + 36, 164, paper, 0.96)
    .setAngle(-2);
  panel.setStrokeStyle(3, accent, 0.92);
  const inkLineTop = scene.add.rectangle(GAME_WIDTH / 2, panel.y - 82, GAME_WIDTH + 30, 5, accent, 0.88).setAngle(-2);
  const inkLineBottom = scene.add.rectangle(GAME_WIDTH / 2, panel.y + 82, GAME_WIDTH + 30, 5, accent, 0.68).setAngle(-2);
  root.add([shade, panel, inkLineTop, inkLineBottom]);

  const visual = resolveCutinVisual(scene, mode);
  if (visual) {
    const portrait = scene.add.image(GAME_WIDTH - 76, panel.y + 2, visual.textureKey, visual.frame)
      .setDisplaySize(158, 158)
      .setAlpha(0.98);
    if (isBerserk) portrait.setTint(0xd8b5df);
    root.add(portrait);
  } else {
    const fallbackMark = scene.add.circle(GAME_WIDTH - 76, panel.y, 48, accent, 0.28);
    fallbackMark.setStrokeStyle(4, accent, 0.9);
    root.add(fallbackMark);
  }

  const titleText = scene.add.text(24, panel.y - 44, title, {
    fontFamily: FONT,
    fontSize: isBerserk ? '28px' : '20px',
    color: textColor,
    fontStyle: 'bold',
    stroke: isBerserk ? '#08050d' : '#f8edcf',
    strokeThickness: isBerserk ? 4 : 2,
    resolution: 2,
  });
  const subtitleText = scene.add.text(26, panel.y + 5, subtitle, {
    fontFamily: FONT,
    fontSize: '11px',
    color: isBerserk ? '#d8bedf' : '#5b4a2e',
    fontStyle: 'bold',
    resolution: 2,
  });
  root.add([titleText, subtitleText]);

  root.setX(-GAME_WIDTH - 50);
  scene.tweens.add({
    targets: root,
    x: 0,
    duration: 120,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      scene.tweens.add({
        targets: root,
        x: GAME_WIDTH + 50,
        alpha: 0,
        delay: 250,
        duration: 190,
        ease: 'Cubic.easeIn',
        onComplete: () => root.destroy(true),
      });
    },
  });
}

export function resolveCutinVisual(
  scene: Pick<Phaser.Scene, 'textures'>,
  mode: CharacterCutinMode,
): { textureKey: string; frame?: number } | null {
  const productionKey = CHARACTER_CUTIN_TEXTURE[mode];
  if (scene.textures.exists(productionKey)) return { textureKey: productionKey };

  if (mode === 'berserk' && scene.textures.exists(YUI_EXPRESSION_RAGE_SHEET.id)) {
    return { textureKey: YUI_EXPRESSION_RAGE_SHEET.id, frame: BERSERK_CUTIN_SHEET_FRAME };
  }
  if (scene.textures.exists(YUI_FRAME_IDS.ultimate)) return { textureKey: YUI_FRAME_IDS.ultimate };
  if (scene.textures.exists(YUI_FRAME_IDS.idle.front)) return { textureKey: YUI_FRAME_IDS.idle.front };
  return null;
}
