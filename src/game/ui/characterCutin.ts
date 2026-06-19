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
const CUTIN_ENTER_MS = 170;
const CUTIN_HOLD_MS = 780;
const CUTIN_EXIT_MS = 260;

export function playCharacterCutin(scene: Phaser.Scene, mode: CharacterCutinMode): void {
  const depth = VIEW_DEPTH.overlay - 2;
  const isBerserk = mode === 'berserk';
  const accent = isBerserk ? 0x38203f : 0xd9b65f;
  const paper = isBerserk ? 0x17101f : 0xeee1bd;
  const textColor = isBerserk ? '#f4d9fa' : '#332817';
  const title = isBerserk ? '黒耀化' : '灯りよ、帰り道を';
  const subtitle = isBerserk ? '黒い灯りが記憶を照らす' : '忘れたものを照らし出す';
  const root = scene.add.container(0, 0).setDepth(depth).setScrollFactor(0);

  const shade = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x080713, 0.22);
  const panel = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 36, GAME_WIDTH + 36, 184, paper, 0.97)
    .setAngle(-2);
  panel.setStrokeStyle(4, accent, 0.96);
  const inkLineTop = scene.add.rectangle(GAME_WIDTH / 2, panel.y - 92, GAME_WIDTH + 30, 6, accent, 0.92).setAngle(-2);
  const inkLineBottom = scene.add.rectangle(GAME_WIDTH / 2, panel.y + 92, GAME_WIDTH + 30, 6, accent, 0.72).setAngle(-2);
  root.add([shade, panel, inkLineTop, inkLineBottom]);

  const visual = resolveCutinVisual(scene, mode);
  if (visual) {
    const portrait = scene.add.image(GAME_WIDTH - 76, panel.y + 2, visual.textureKey, visual.frame)
      .setDisplaySize(172, 172)
      .setAlpha(0.99);
    if (isBerserk) portrait.setTint(0xd8b5df);
    root.add(portrait);
  } else {
    const fallbackMark = scene.add.circle(GAME_WIDTH - 76, panel.y, 54, accent, 0.34);
    fallbackMark.setStrokeStyle(5, accent, 0.95);
    root.add(fallbackMark);
  }

  const titleText = scene.add.text(22, panel.y - 52, title, {
    fontFamily: FONT,
    fontSize: isBerserk ? '31px' : '22px',
    color: textColor,
    fontStyle: 'bold',
    stroke: isBerserk ? '#08050d' : '#f8edcf',
    strokeThickness: isBerserk ? 5 : 3,
    resolution: 2,
    wordWrap: { width: 250 },
  });
  const subtitleText = scene.add.text(25, panel.y + 12, subtitle, {
    fontFamily: FONT,
    fontSize: '12px',
    color: isBerserk ? '#d8bedf' : '#5b4a2e',
    fontStyle: 'bold',
    stroke: isBerserk ? '#08050d' : '#f8edcf',
    strokeThickness: 2,
    resolution: 2,
    wordWrap: { width: 246 },
  });
  root.add([titleText, subtitleText]);

  root.setX(-GAME_WIDTH - 50);
  scene.tweens.add({
    targets: root,
    x: 0,
    duration: CUTIN_ENTER_MS,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      scene.tweens.add({
        targets: root,
        scaleX: 1.015,
        scaleY: 1.015,
        yoyo: true,
        duration: Math.floor(CUTIN_HOLD_MS / 2),
        ease: 'Sine.easeInOut',
      });
      scene.tweens.add({
        targets: root,
        x: GAME_WIDTH + 50,
        alpha: 0,
        delay: CUTIN_HOLD_MS,
        duration: CUTIN_EXIT_MS,
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
