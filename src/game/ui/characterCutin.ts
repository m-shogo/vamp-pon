import type Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { YUI_FRAME_IDS } from '../assets/playerFrames';
import { YUI_EXPRESSION_RAGE_SHEET } from '../assets/yuiExpressionRageSheet';
import { VIEW_DEPTH } from './factory';
import { FONT } from './visualDesign';
import { TITLE_FONT } from './fonts';

export type CharacterCutinMode = 'ultimate' | 'berserk';

/** Runtime cutin texture keys. If the image is not loaded, the old fallback path still works. */
export const CHARACTER_CUTIN_TEXTURE = {
  ultimate: 'yui_cutin_ultimate',
  berserk: 'yui_cutin_berserk',
} as const;

const BERSERK_CUTIN_SHEET_FRAME = 15;
const CUTIN_ENTER_MS = 170;
const CUTIN_HOLD_MS = 780;
const CUTIN_EXIT_MS = 260;
const CUTIN_SOURCE_WIDTH = 1440;
const CUTIN_SOURCE_HEIGHT = 360;
const CUTIN_BANNER_HEIGHT = 184;
const CUTIN_BANNER_WIDTH = Math.round(CUTIN_BANNER_HEIGHT * (CUTIN_SOURCE_WIDTH / CUTIN_SOURCE_HEIGHT));
const CUTIN_CENTER_Y = GAME_HEIGHT / 2 - 36;

export function playCharacterCutin(scene: Phaser.Scene, mode: CharacterCutinMode): void {
  const depth = VIEW_DEPTH.overlay - 2;
  const root = scene.add.container(0, 0).setDepth(depth).setScrollFactor(0);
  const visual = resolveCutinVisual(scene, mode);

  addCutinAtmosphere(scene, root, mode);

  if (visual && visual.textureKey === CHARACTER_CUTIN_TEXTURE[mode] && visual.frame == null) {
    addImageCutin(scene, root, mode, visual.textureKey);
  } else {
    addFallbackCutin(scene, root, mode, visual);
  }

  addFrontAccents(scene, root, mode);
  animateCutin(scene, root, mode);
}

function addCutinAtmosphere(scene: Phaser.Scene, root: Phaser.GameObjects.Container, mode: CharacterCutinMode): void {
  const isBerserk = mode === 'berserk';
  const shadeColor = isBerserk ? 0x07040d : 0x071021;
  const shadeAlpha = isBerserk ? 0.58 : 0.46;
  const shade = scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH + 80, GAME_HEIGHT + 80, shadeColor, shadeAlpha);
  root.add(shade);

  if (isBerserk) {
    addBerserkAtmosphere(scene, root);
  } else {
    addUltimateAtmosphere(scene, root);
  }

  scene.cameras.main.shake(isBerserk ? 150 : 95, isBerserk ? 0.0038 : 0.0022);
}

function addUltimateAtmosphere(scene: Phaser.Scene, root: Phaser.GameObjects.Container): void {
  const colors = [0xffd77a, 0xfff0b3, 0xf7a94c];
  for (let i = 0; i < 5; i += 1) {
    const band = scene.add.rectangle(
      -120 + i * 96,
      CUTIN_CENTER_Y - 68 + i * 28,
      GAME_WIDTH + 260,
      i % 2 === 0 ? 18 : 10,
      colors[i % colors.length],
      i % 2 === 0 ? 0.22 : 0.14,
    )
      .setAngle(-8)
      .setBlendMode('ADD');
    root.add(band);
    scene.tweens.add({
      targets: band,
      x: band.x + 180,
      alpha: 0,
      delay: 130 + i * 30,
      duration: 820,
      ease: 'Cubic.easeOut',
    });
  }

  for (let i = 0; i < 18; i += 1) {
    const y = CUTIN_CENTER_Y - 88 + (i % 9) * 22;
    const line = scene.add.rectangle(
      18 + (i % 6) * 68,
      y,
      80 + (i % 4) * 34,
      2,
      i % 3 === 0 ? 0xfff4c6 : 0xd9b65f,
      0.26,
    )
      .setAngle(-5)
      .setBlendMode('ADD');
    root.add(line);
    scene.tweens.add({
      targets: line,
      x: line.x + 190,
      alpha: 0,
      delay: 70 + i * 12,
      duration: 520,
      ease: 'Cubic.easeOut',
    });
  }

  for (let i = 0; i < 24; i += 1) {
    const isPaper = i % 3 === 0;
    const particle = isPaper
      ? scene.add.rectangle(20 + (i * 47) % GAME_WIDTH, CUTIN_CENTER_Y - 86 + (i * 31) % 168, 7, 4, 0xffefbd, 0.76)
      : scene.add.circle(20 + (i * 43) % GAME_WIDTH, CUTIN_CENTER_Y - 82 + (i * 29) % 160, 2.3, 0xffd77a, 0.82);
    particle.setRotation((i % 7) * 0.42).setBlendMode(isPaper ? 'NORMAL' : 'ADD');
    root.add(particle);
    scene.tweens.add({
      targets: particle,
      x: particle.x + 90 + (i % 4) * 24,
      y: particle.y - 16 + (i % 5) * 8,
      angle: particle.angle + 80,
      alpha: 0,
      delay: 120 + i * 18,
      duration: 700,
      ease: 'Sine.easeOut',
    });
  }

  const flare = scene.add.circle(78, CUTIN_CENTER_Y + 8, 28, 0xffd77a, 0.2).setBlendMode('ADD');
  flare.setStrokeStyle(3, 0xfff0b3, 0.6);
  root.add(flare);
  scene.tweens.add({ targets: flare, scale: 4.8, alpha: 0, duration: 760, ease: 'Cubic.easeOut' });
}

function addBerserkAtmosphere(scene: Phaser.Scene, root: Phaser.GameObjects.Container): void {
  const edgeColor = 0x120818;
  const accent = 0xb94b91;
  const violet = 0x6f2a7c;

  for (let i = 0; i < 6; i += 1) {
    const left = i % 2 === 0;
    const ink = scene.add.ellipse(
      left ? -18 : GAME_WIDTH + 18,
      90 + i * 118,
      120 + i * 18,
      80 + (i % 3) * 28,
      edgeColor,
      0.68,
    )
      .setAngle(left ? -18 : 18);
    root.add(ink);
    scene.tweens.add({
      targets: ink,
      x: ink.x + (left ? 42 : -42),
      scaleX: 1.45,
      scaleY: 1.22,
      alpha: 0.1,
      delay: i * 24,
      duration: 850,
      ease: 'Sine.easeOut',
    });
  }

  for (let i = 0; i < 10; i += 1) {
    const slash = scene.add.rectangle(
      12 + (i * 41) % GAME_WIDTH,
      CUTIN_CENTER_Y - 95 + (i * 37) % 190,
      64 + (i % 4) * 22,
      i % 2 === 0 ? 3 : 2,
      i % 3 === 0 ? accent : violet,
      0.44,
    )
      .setAngle(-38 + (i % 5) * 18)
      .setBlendMode('ADD');
    root.add(slash);
    scene.tweens.add({
      targets: slash,
      alpha: 0,
      scaleX: 1.9,
      x: slash.x + (i % 2 === 0 ? 54 : -54),
      delay: 90 + i * 22,
      duration: 560,
      ease: 'Cubic.easeOut',
    });
  }

  for (let i = 0; i < 28; i += 1) {
    const particle = scene.add.circle(
      16 + (i * 53) % GAME_WIDTH,
      CUTIN_CENTER_Y - 92 + (i * 23) % 184,
      2.5 + (i % 3),
      i % 4 === 0 ? accent : 0x09040d,
      i % 4 === 0 ? 0.8 : 0.62,
    );
    if (i % 4 === 0) particle.setBlendMode('ADD');
    root.add(particle);
    scene.tweens.add({
      targets: particle,
      x: GAME_WIDTH / 2 + (particle.x - GAME_WIDTH / 2) * 0.28,
      y: CUTIN_CENTER_Y + (particle.y - CUTIN_CENTER_Y) * 0.2,
      scale: 0.15,
      alpha: 0,
      delay: 80 + i * 12,
      duration: 720,
      ease: 'Cubic.easeIn',
    });
  }

  for (let i = 0; i < 3; i += 1) {
    const ring = scene.add.circle(GAME_WIDTH / 2, CUTIN_CENTER_Y, 48 + i * 24, accent, 0.04).setBlendMode('ADD');
    ring.setStrokeStyle(3, i % 2 === 0 ? accent : 0xf0b6ff, 0.34);
    root.add(ring);
    scene.tweens.add({
      targets: ring,
      scale: 2.1 + i * 0.25,
      alpha: 0,
      delay: 110 + i * 55,
      duration: 780,
      ease: 'Cubic.easeOut',
    });
  }
}

function addImageCutin(
  scene: Phaser.Scene,
  root: Phaser.GameObjects.Container,
  mode: CharacterCutinMode,
  textureKey: string,
): void {
  const isBerserk = mode === 'berserk';
  const accent = isBerserk ? 0xb94b91 : 0xffcf70;
  const y = CUTIN_CENTER_Y;

  const image = scene.add.image(GAME_WIDTH / 2, y, textureKey)
    .setDisplaySize(CUTIN_BANNER_WIDTH, CUTIN_BANNER_HEIGHT)
    .setAlpha(0.99);
  const topLine = scene.add.rectangle(GAME_WIDTH / 2, y - CUTIN_BANNER_HEIGHT / 2 + 2, GAME_WIDTH + 72, 5, accent, 0.86).setBlendMode('ADD');
  const bottomLine = scene.add.rectangle(GAME_WIDTH / 2, y + CUTIN_BANNER_HEIGHT / 2 - 2, GAME_WIDTH + 72, 5, accent, 0.66).setBlendMode('ADD');
  const labelBack = scene.add.rectangle(86, y + CUTIN_BANNER_HEIGHT / 2 - 28, 144, 30, isBerserk ? 0x120818 : 0x2f2310, 0.78);
  labelBack.setStrokeStyle(1, accent, 0.82);
  const label = scene.add.text(86, labelBack.y, isBerserk ? '黒耀化' : '必殺', {
    fontFamily: TITLE_FONT,
    fontSize: '18px',
    color: isBerserk ? '#f4d9fa' : '#fff0b3',
    fontStyle: 'bold',
    resolution: 2,
  }).setOrigin(0.5);

  root.add([image, topLine, bottomLine, labelBack, label]);
}

function addFallbackCutin(
  scene: Phaser.Scene,
  root: Phaser.GameObjects.Container,
  mode: CharacterCutinMode,
  visual: { textureKey: string; frame?: number } | null,
): void {
  const isBerserk = mode === 'berserk';
  const accent = isBerserk ? 0x38203f : 0xd9b65f;
  const paper = isBerserk ? 0x17101f : 0xeee1bd;
  const textColor = isBerserk ? '#f4d9fa' : '#332817';
  const title = isBerserk ? '黒耀化' : '灯りよ、帰り道を';
  const subtitle = isBerserk ? '黒い灯りが記憶を照らす' : '忘れたものを照らし出す';

  const panel = scene.add.rectangle(GAME_WIDTH / 2, CUTIN_CENTER_Y, GAME_WIDTH + 36, 184, paper, 0.97)
    .setAngle(-2);
  panel.setStrokeStyle(4, accent, 0.96);
  const inkLineTop = scene.add.rectangle(GAME_WIDTH / 2, panel.y - 92, GAME_WIDTH + 30, 6, accent, 0.92).setAngle(-2);
  const inkLineBottom = scene.add.rectangle(GAME_WIDTH / 2, panel.y + 92, GAME_WIDTH + 30, 6, accent, 0.72).setAngle(-2);
  root.add([panel, inkLineTop, inkLineBottom]);

  if (visual) {
    const portrait = scene.add.image(GAME_WIDTH - 76, panel.y, visual.textureKey, visual.frame)
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
    fontFamily: TITLE_FONT,
    fontSize: isBerserk ? '31px' : '22px',
    color: textColor,
    fontStyle: 'bold',
    resolution: 2,
    wordWrap: { width: 250 },
  });
  const subtitleText = scene.add.text(25, panel.y + 12, subtitle, {
    fontFamily: FONT,
    fontSize: '12px',
    color: isBerserk ? '#d8bedf' : '#5b4a2e',
    fontStyle: 'bold',
    resolution: 2,
    wordWrap: { width: 246 },
  });
  root.add([titleText, subtitleText]);
}

function addFrontAccents(scene: Phaser.Scene, root: Phaser.GameObjects.Container, mode: CharacterCutinMode): void {
  const isBerserk = mode === 'berserk';
  const color = isBerserk ? 0xe9a2ff : 0xfff0b3;
  const flash = scene.add.rectangle(GAME_WIDTH / 2, CUTIN_CENTER_Y, GAME_WIDTH + 80, CUTIN_BANNER_HEIGHT + 40, color, isBerserk ? 0.12 : 0.16)
    .setBlendMode('ADD');
  root.add(flash);
  scene.tweens.add({ targets: flash, alpha: 0, scaleX: 1.15, duration: 260, ease: 'Quad.easeOut' });

  const sweep = scene.add.rectangle(-90, CUTIN_CENTER_Y, 64, CUTIN_BANNER_HEIGHT + 64, color, isBerserk ? 0.18 : 0.24)
    .setAngle(isBerserk ? -14 : -10)
    .setBlendMode('ADD');
  root.add(sweep);
  scene.tweens.add({ targets: sweep, x: GAME_WIDTH + 120, alpha: 0, delay: 140, duration: 520, ease: 'Cubic.easeOut' });
}

function animateCutin(scene: Phaser.Scene, root: Phaser.GameObjects.Container, mode: CharacterCutinMode): void {
  root.setX(-GAME_WIDTH - 50);
  scene.tweens.add({
    targets: root,
    x: 0,
    duration: CUTIN_ENTER_MS,
    ease: 'Cubic.easeOut',
    onComplete: () => {
      scene.tweens.add({
        targets: root,
        scaleX: mode === 'berserk' ? 1.025 : 1.017,
        scaleY: mode === 'berserk' ? 1.025 : 1.017,
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
        onComplete: () => {
          root.destroy(true);
          scene.cameras.main.flash(120, 255, 250, 240, false);
        },
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
