import type Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { YUI_FRAME_IDS } from '../assets/playerFrames';
import { YUI_EXPRESSION_RAGE_SHEET } from '../assets/yuiExpressionRageSheet';
import { characterArtById } from '../data/characterArts';
import { kokuyouFormByCharacterId } from '../data/kokuyouForms';
import { WORLD_TERMS } from '../data/worldTerms';
import { VIEW_DEPTH } from './factory';
import { FONT } from './visualDesign';
import { TITLE_FONT } from './fonts';
import { STORYBOOK_UI } from './colorTokens';

export type CharacterCutinMode = 'ultimate' | 'berserk';

export const CHARACTER_CUTIN_TEXTURE = {
  ultimate: 'yui_cutin_ultimate',
  berserk: 'yui_cutin_berserk',
} as const;

const BERSERK_CUTIN_SHEET_FRAME = 15;
const CUTIN_SOURCE_WIDTH = 1440;
const CUTIN_SOURCE_HEIGHT = 360;
const CUTIN_BANNER_HEIGHT = 184;
const CUTIN_BANNER_WIDTH = Math.round(CUTIN_BANNER_HEIGHT * (CUTIN_SOURCE_WIDTH / CUTIN_SOURCE_HEIGHT));
const CUTIN_CENTER_Y = GAME_HEIGHT / 2 - 36;

type CutinCopy = {
  label: string;
  title: string;
  subtitle: string;
};

export function playCharacterCutin(scene: Phaser.Scene, mode: CharacterCutinMode, characterId = 'yui'): void {
  const isKokuyou = mode === 'berserk';
  const copy = resolveCutinCopy(mode, characterId);
  const root = scene.add.container(-GAME_WIDTH - 40, 0).setDepth(VIEW_DEPTH.overlay - 2).setScrollFactor(0);
  const visual = resolveCutinVisual(scene, mode);
  const baseColor = isKokuyou ? STORYBOOK_UI.inkBlack : 0x071021;
  const accent = isKokuyou ? STORYBOOK_UI.dustyRose : STORYBOOK_UI.warmAmber;
  const paper = isKokuyou ? STORYBOOK_UI.deepNight : 0xeee1bd;
  const textColor = isKokuyou ? '#ffe7ae' : '#332817';

  root.add(scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH + 80, GAME_HEIGHT + 80, baseColor, isKokuyou ? 0.62 : 0.46));

  const imageKey = visual?.textureKey;
  if (imageKey && imageKey === CHARACTER_CUTIN_TEXTURE[mode] && visual.frame == null) {
    const image = scene.add.image(GAME_WIDTH / 2, CUTIN_CENTER_Y, imageKey)
      .setDisplaySize(CUTIN_BANNER_WIDTH, CUTIN_BANNER_HEIGHT)
      .setAlpha(0.99);
    root.add(image);
  } else {
    const panel = scene.add.rectangle(GAME_WIDTH / 2, CUTIN_CENTER_Y, GAME_WIDTH + 36, CUTIN_BANNER_HEIGHT, paper, 0.97).setAngle(-2);
    panel.setStrokeStyle(4, accent, 0.92);
    root.add(panel);
    if (visual) {
      const portrait = scene.add.image(GAME_WIDTH - 76, CUTIN_CENTER_Y, visual.textureKey, visual.frame).setDisplaySize(172, 172);
      if (isKokuyou) portrait.setTint(0xd8b5df);
      root.add(portrait);
    }
  }

  root.add(scene.add.rectangle(GAME_WIDTH / 2, CUTIN_CENTER_Y - CUTIN_BANNER_HEIGHT / 2 + 2, GAME_WIDTH + 72, 5, accent, 0.86).setBlendMode('ADD'));
  root.add(scene.add.rectangle(GAME_WIDTH / 2, CUTIN_CENTER_Y + CUTIN_BANNER_HEIGHT / 2 - 2, GAME_WIDTH + 72, 5, isKokuyou ? STORYBOOK_UI.warmAmber : accent, isKokuyou ? 0.5 : 0.66).setBlendMode('ADD'));

  for (let i = 0; i < 18; i += 1) {
    const warm = i % 5 === 0;
    const mark = scene.add.rectangle(
      10 + (i * 53) % GAME_WIDTH,
      CUTIN_CENTER_Y - 88 + (i * 29) % 176,
      48 + (i % 4) * 20,
      warm ? 3 : 2,
      warm ? STORYBOOK_UI.warmAmber : accent,
      warm ? 0.28 : 0.36,
    ).setAngle(isKokuyou ? -34 + (i % 4) * 12 : -8).setBlendMode('ADD');
    root.add(mark);
    scene.tweens.add({ targets: mark, x: mark.x + (isKokuyou ? 70 : 140), alpha: 0, duration: 560 + i * 8, ease: 'Cubic.easeOut' });
  }

  const labelBack = scene.add.rectangle(86, CUTIN_CENTER_Y + CUTIN_BANNER_HEIGHT / 2 - 28, 144, 30, isKokuyou ? STORYBOOK_UI.inkBlack : 0x2f2310, 0.78);
  labelBack.setStrokeStyle(1, isKokuyou ? STORYBOOK_UI.warmAmber : accent, 0.82);
  const label = scene.add.text(86, labelBack.y, copy.label, {
    fontFamily: TITLE_FONT,
    fontSize: '18px',
    color: isKokuyou ? '#ffe1b8' : '#fff0b3',
    fontStyle: 'bold',
    resolution: 2,
  }).setOrigin(0.5);
  const title = scene.add.text(22, CUTIN_CENTER_Y - 58, copy.title, {
    fontFamily: TITLE_FONT,
    fontSize: isKokuyou ? '31px' : '26px',
    color: textColor,
    fontStyle: 'bold',
    resolution: 2,
    stroke: isKokuyou ? '#090714' : '#fff6d6',
    strokeThickness: isKokuyou ? 3 : 2,
    wordWrap: { width: 270 },
  });
  const subtitle = scene.add.text(25, CUTIN_CENTER_Y + 12, copy.subtitle, {
    fontFamily: FONT,
    fontSize: '12px',
    color: isKokuyou ? '#f4c46a' : '#5b4a2e',
    fontStyle: 'bold',
    resolution: 2,
    wordWrap: { width: 250 },
  });
  root.add([labelBack, label, title, subtitle]);

  scene.cameras.main.shake(isKokuyou ? 160 : 95, isKokuyou ? 0.004 : 0.0022);
  scene.tweens.add({
    targets: root,
    x: 0,
    duration: 170,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      scene.tweens.add({ targets: root, x: GAME_WIDTH + 50, alpha: 0, delay: 700, duration: 260, ease: 'Cubic.easeIn', onComplete: () => root.destroy(true) });
    },
  });
}

export function resolveCutinCopy(mode: CharacterCutinMode, characterId: string): CutinCopy {
  if (mode === 'berserk') {
    const form = kokuyouFormByCharacterId.get(characterId);
    return {
      label: WORLD_TERMS.kokuyou.transformation,
      title: form?.subtitle ?? WORLD_TERMS.kokuyou.transformation,
      subtitle: form?.shortCopy ?? WORLD_TERMS.kokuyou.backlash,
    };
  }
  const art = characterArtById.get(characterId as never)?.arts.dawnLight;
  return {
    label: art?.label ?? WORLD_TERMS.techniqueRanks.dawnLight,
    title: art?.name ?? '消えない名前',
    subtitle: '忘れたものを照らし出す',
  };
}

export function resolveCutinVisual(
  scene: Pick<Phaser.Scene, 'textures'>,
  mode: CharacterCutinMode,
): { textureKey: string; frame?: number } | null {
  const productionKey = CHARACTER_CUTIN_TEXTURE[mode];
  if (scene.textures.exists(productionKey)) return { textureKey: productionKey };
  if (mode === 'berserk' && scene.textures.exists(YUI_EXPRESSION_RAGE_SHEET.id)) return { textureKey: YUI_EXPRESSION_RAGE_SHEET.id, frame: BERSERK_CUTIN_SHEET_FRAME };
  if (scene.textures.exists(YUI_FRAME_IDS.ultimate)) return { textureKey: YUI_FRAME_IDS.ultimate };
  if (scene.textures.exists(YUI_FRAME_IDS.idle.front)) return { textureKey: YUI_FRAME_IDS.idle.front };
  return null;
}
