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

  if (isKokuyou) {
    addKokuyouSlashBackdrop(scene, root);
  }

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

  if (isKokuyou) {
    addKokuyouCopy(scene, root, copy);
  } else {
    const labelBack = scene.add.rectangle(86, CUTIN_CENTER_Y + CUTIN_BANNER_HEIGHT / 2 - 28, 144, 30, 0x2f2310, 0.78);
    labelBack.setStrokeStyle(1, accent, 0.82);
    const label = scene.add.text(86, labelBack.y, copy.label, {
      fontFamily: TITLE_FONT,
      fontSize: '18px',
      color: '#fff0b3',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5);
    const title = scene.add.text(22, CUTIN_CENTER_Y - 58, copy.title, {
      fontFamily: TITLE_FONT,
      fontSize: '26px',
      color: textColor,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#fff6d6',
      strokeThickness: 2,
      wordWrap: { width: 270 },
    });
    const subtitle = scene.add.text(25, CUTIN_CENTER_Y + 12, copy.subtitle, {
      fontFamily: FONT,
      fontSize: '12px',
      color: '#5b4a2e',
      fontStyle: 'bold',
      resolution: 2,
      wordWrap: { width: 250 },
    });
    root.add([labelBack, label, title, subtitle]);
  }

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

function addKokuyouSlashBackdrop(scene: Phaser.Scene, root: Phaser.GameObjects.Container): void {
  const ink = scene.add.graphics();
  ink.fillStyle(0x030208, 0.88);
  ink.fillTriangle(-40, 210, GAME_WIDTH + 70, 66, GAME_WIDTH + 44, 176);
  ink.fillTriangle(-54, 472, GAME_WIDTH + 56, 236, GAME_WIDTH + 80, 358);
  ink.fillTriangle(-64, 644, GAME_WIDTH + 52, 432, GAME_WIDTH + 82, 546);
  ink.fillStyle(0x20112c, 0.72);
  ink.fillTriangle(-30, 520, GAME_WIDTH + 40, 288, GAME_WIDTH + 62, 398);
  ink.fillStyle(0x6c2449, 0.36);
  ink.fillTriangle(-20, 474, GAME_WIDTH + 54, 286, GAME_WIDTH + 46, 340);
  ink.fillStyle(STORYBOOK_UI.paperDark, 0.18);
  ink.fillTriangle(-34, 250, GAME_WIDTH + 40, 116, GAME_WIDTH + 70, 150);
  root.add(ink);

  const lanternLine = scene.add.rectangle(GAME_WIDTH / 2, CUTIN_CENTER_Y + 102, GAME_WIDTH + 120, 4, STORYBOOK_UI.lanternCore, 0.78)
    .setAngle(-17)
    .setBlendMode('ADD');
  const lanternLine2 = scene.add.rectangle(GAME_WIDTH / 2 - 44, CUTIN_CENTER_Y + 150, GAME_WIDTH + 80, 2, STORYBOOK_UI.warmAmber, 0.46)
    .setAngle(-17)
    .setBlendMode('ADD');
  root.add([lanternLine, lanternLine2]);

  for (let i = 0; i < 7; i += 1) {
    const spark = scene.add.rectangle(
      42 + i * 54,
      CUTIN_CENTER_Y + 90 - (i % 3) * 22,
      14 + (i % 2) * 8,
      2,
      STORYBOOK_UI.lanternCore,
      0.32,
    ).setAngle(-18).setBlendMode('ADD');
    root.add(spark);
  }
}

function addKokuyouCopy(scene: Phaser.Scene, root: Phaser.GameObjects.Container, copy: CutinCopy): void {
  const topPlate = scene.add.rectangle(138, CUTIN_CENTER_Y - 114, 230, 42, STORYBOOK_UI.inkBlack, 0.74).setAngle(-7);
  topPlate.setStrokeStyle(1, STORYBOOK_UI.warmAmber, 0.34);
  const topText = scene.add.text(40, CUTIN_CENTER_Y - 130, '記憶の力が、夜を切り開く', {
    fontFamily: FONT,
    fontSize: '12px',
    color: '#f0cf9d',
    fontStyle: 'bold',
    resolution: 2,
    wordWrap: { width: 210 },
  }).setAngle(-7);

  const titleBack = scene.add.rectangle(GAME_WIDTH / 2, CUTIN_CENTER_Y + 70, 286, 62, 0x110a18, 0.9);
  titleBack.setStrokeStyle(2, STORYBOOK_UI.warmAmber, 0.5);
  const title = scene.add.text(GAME_WIDTH / 2, CUTIN_CENTER_Y + 55, copy.label, {
    fontFamily: TITLE_FONT,
    fontSize: '38px',
    color: '#f3dfbc',
    fontStyle: 'bold',
    resolution: 2,
    stroke: '#07040b',
    strokeThickness: 4,
  }).setOrigin(0.5);
  const subtitle = scene.add.text(GAME_WIDTH / 2, CUTIN_CENTER_Y + 88, '記憶の灯火が、力に変わる', {
    fontFamily: FONT,
    fontSize: '12px',
    color: '#f4c46a',
    fontStyle: 'bold',
    resolution: 2,
  }).setOrigin(0.5);

  const formText = scene.add.text(28, CUTIN_CENTER_Y - 42, copy.title || copy.subtitle, {
    fontFamily: TITLE_FONT,
    fontSize: '17px',
    color: '#ffe1b8',
    fontStyle: 'bold',
    resolution: 2,
    stroke: '#090714',
    strokeThickness: 3,
    wordWrap: { width: 220 },
  });

  const ctaBack = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 122, 230, 34, 0x090713, 0.72);
  ctaBack.setStrokeStyle(1, STORYBOOK_UI.warmAmber, 0.52);
  const ctaIcon = scene.add.circle(GAME_WIDTH / 2 - 70, GAME_HEIGHT - 122, 10, STORYBOOK_UI.lanternCore, 0.2).setBlendMode('ADD');
  ctaIcon.setStrokeStyle(1, STORYBOOK_UI.warmAmber, 0.68);
  const cta = scene.add.text(GAME_WIDTH / 2 + 20, GAME_HEIGHT - 122, 'タップで発動', {
    fontFamily: FONT,
    fontSize: '13px',
    color: '#f4c46a',
    fontStyle: 'bold',
    resolution: 2,
  }).setOrigin(0.5);

  root.add([topPlate, topText, titleBack, title, subtitle, formText, ctaBack, ctaIcon, cta]);
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
