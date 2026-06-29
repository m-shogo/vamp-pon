import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { forgottenStreetNightBoard } from '../data/collectionProgress';
import { loadCollectionProgress } from '../persistence/collection';
import { loadProfile } from '../persistence/profile';
import {
  findNewCompletedCellIds,
  loadCollectionAtlasViewState,
} from '../persistence/collectionAtlasViewState';
import { attachPressFeedback } from '../ui/pressFeedback';
import { drawStar, STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI } from '../ui/storybookUi';
import {
  drawInkVignette,
  drawLanternFocus,
  drawLargeNotebookPage,
  drawMapThreads,
  drawNewSparkBadge,
  drawPaperScrap,
  drawPrimaryPaperCta,
  drawPremiumPaperCard,
  drawStarMapBackdrop,
  drawWaxSeal,
} from '../ui/premiumPaperUi';
import { getAudioManager } from '../audio/AudioManager';
import { loadOnboarding, markSeen, resetOnboarding } from '../persistence/onboarding';
import { findNewAchievementIds, loadAchievementViewState } from '../persistence/achievementViewState';

const PARTICLE_DEPTH = 2;
const UI_DEPTH = 10;
const TOP_BG_TEXTURE = 'top_stage1_background';
const TOP_YUI_TEXTURE = 'top_yui_fullbody';

export class TopScene extends Phaser.Scene {
  private notice: Phaser.GameObjects.Text | null = null;

  constructor() {
    super('TopScene');
  }

  shutdown(): void {
    this.tweens.killAll();
  }

  create(): void {
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this);

    if (new URLSearchParams(window.location.search).get('resetOnboarding') === '1') {
      resetOnboarding();
      const params = new URLSearchParams(window.location.search);
      params.delete('resetOnboarding');
      const query = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
    }

    const audio = getAudioManager(this);
    audio.unlockOnFirstInput();
    audio.playBgm('bgm_top', { volume: 0.32, fadeMs: 280 });
    const profile = loadProfile();
    const collection = loadCollectionProgress();
    const boardCount = collection.nightBoard.completedCellIds.length;
    const boardTotal = forgottenStreetNightBoard.cells.length;

    this.addTopImageBackground();
    const starBg = this.add.graphics().setDepth(PARTICLE_DEPTH);
    drawStarMapBackdrop(starBg, GAME_WIDTH, GAME_HEIGHT, { alpha: 0.08, density: 16 });
    this.addBackgroundAtmosphere();
    this.addTopReferenceBackdrop();

    const vignette = this.add.graphics().setDepth(PARTICLE_DEPTH + 1);
    drawInkVignette(vignette, GAME_WIDTH, GAME_HEIGHT, { alpha: 0.5 });

    const panel = this.add.graphics().setDepth(UI_DEPTH);
    const panelLeft = Math.round(GAME_WIDTH / 2 - 178);
    const panelTop = 28;
    panel.fillStyle(0x040714, 0.2).fillRect(panelLeft, panelTop, 356, 778);
    panel.lineStyle(1, STORYBOOK_UI.gold, 0.08).strokeRect(panelLeft, panelTop, 356, 778);
    drawPaperScrap(panel, 40, 610, 90, 104, STORYBOOK_UI.paperBeige, 0.08);
    drawPaperScrap(panel, 346, 608, 92, 112, STORYBOOK_UI.paperBeige, 0.08);

    this.addTitleDecoration();

    const titleText = this.text(GAME_WIDTH / 2, 90, 'VAMP PON', 40, STORYBOOK_UI.textDark, true, true).setDepth(UI_DEPTH + 4);
    titleText.setShadow(0, 2, '#070815', 3, true, true);
    this.tweens.add({ targets: titleText, y: titleText.y - 3, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const subtitleText = this.text(GAME_WIDTH / 2, 148, '忘れられたものたちの夜', 15, STORYBOOK_UI.textDark, true).setDepth(UI_DEPTH + 4);
    subtitleText.setAlpha(0);
    this.tweens.add({ targets: subtitleText, alpha: 1, duration: 800, delay: 300, ease: 'Quad.easeOut' });

    this.addCurrencyTag(profile.currency);

    this.addHeroBackdrop();
    this.addHeroLantern();

    const mainBtn = this.button(GAME_WIDTH / 2, 604, 318, 82, '夜へ出る', () => {
      this.scene.start('StageSelectScene', { mode: 'stage' });
    }, false, true);
    mainBtn.setDepth(UI_DEPTH + 5);

    const growthBtn = this.menuCard(77, 730, 106, 88, '成長', 'sprout', () => {
      this.scene.start('StageSelectScene', { mode: 'growth' });
    });
    growthBtn.setDepth(UI_DEPTH + 4);

    const viewState = loadCollectionAtlasViewState();
    const newCellCount = findNewCompletedCellIds(collection.nightBoard.completedCellIds, viewState.seenCompletedCellIds).length;
    const achViewState = loadAchievementViewState();
    const newAchCount = findNewAchievementIds(Object.keys(profile.achievements), achViewState.seenAchievementIds).length;
    const totalNewCount = newCellCount + newAchCount;
    const collBtn = this.menuCard(GAME_WIDTH / 2, 730, 114, 88, '忘れ物帳', 'book', () => {
      this.scene.start('CollectionScene');
    });
    collBtn.setDepth(UI_DEPTH + 4);
    this.text(GAME_WIDTH / 2, 761, `${boardCount}/${boardTotal}`, 10, STORYBOOK_UI.paperDark, true).setDepth(UI_DEPTH + 6);
    if (totalNewCount > 0) {
      drawNewSparkBadge(this, GAME_WIDTH / 2 + 50, 676, totalNewCount, { depth: UI_DEPTH + 7, label: 'NEW' });
    }

    const settingsBtn = this.menuCard(313, 730, 106, 88, '設定', 'gear', () => this.showNotice('設定は準備中です'));
    settingsBtn.setDepth(UI_DEPTH + 3);

    this.notice = this.text(GAME_WIDTH / 2, 816, '', 13, STORYBOOK_UI.textMuted).setDepth(UI_DEPTH + 2);

    this.addBottomDecoration();

    const onboarding = loadOnboarding();
    if (!onboarding.topIntroSeen) {
      this.showFirstTimeIntro(mainBtn);
      markSeen('topIntroSeen');
    }
  }

  private addBackgroundAtmosphere(): void {
    for (let i = 0; i < 20; i += 1) {
      const x = 20 + Math.random() * (GAME_WIDTH - 40);
      const y = 60 + Math.random() * (GAME_HEIGHT - 120);
      const size = 1.2 + Math.random() * 2.4;
      const dot = this.add.circle(x, y, size, COLORS.lantern, 0.05 + Math.random() * 0.1)
        .setDepth(PARTICLE_DEPTH)
        .setBlendMode('ADD');
      this.tweens.add({
        targets: dot,
        y: y - 30 - Math.random() * 60,
        alpha: 0,
        duration: 4000 + Math.random() * 3000,
        delay: Math.random() * 3000,
        repeat: -1,
        onRepeat: () => {
          dot.setPosition(20 + Math.random() * (GAME_WIDTH - 40), GAME_HEIGHT * 0.72 + Math.random() * (GAME_HEIGHT * 0.28));
          dot.setAlpha(0.05 + Math.random() * 0.1);
        },
      });
    }

    for (let i = 0; i < 9; i += 1) {
      const x = 30 + Math.random() * (GAME_WIDTH - 60);
      const y = 120 + Math.random() * 560;
      const width = 7 + Math.random() * 13;
      const height = 4 + Math.random() * 9;
      const scrap = this.add.graphics().setDepth(PARTICLE_DEPTH + 1);
      drawPaperScrap(scrap, 0, 0, width, height, COLORS.paperScrap, 0.045 + Math.random() * 0.055);
      scrap.setPosition(x, y).setAngle(Math.random() * 360);
      this.tweens.add({
        targets: scrap,
        y: scrap.y - 18 - Math.random() * 34,
        angle: scrap.angle + (Math.random() < 0.5 ? -1 : 1) * (16 + Math.random() * 34),
        duration: 6200 + Math.random() * 4200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    for (let i = 0; i < 7; i += 1) {
      const ink = this.add.circle(
        Math.random() < 0.5 ? 10 + Math.random() * 26 : GAME_WIDTH - 36 + Math.random() * 26,
        120 + Math.random() * 620,
        5 + Math.random() * 18,
        COLORS.ink,
        0.035 + Math.random() * 0.045,
      ).setDepth(PARTICLE_DEPTH);
      void ink;
    }
  }

  private addTopImageBackground(): void {
    if (this.textures.exists(TOP_BG_TEXTURE)) {
      const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TOP_BG_TEXTURE)
        .setDepth(0)
        .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
      bg.setTint(0x9aa0c8);
      this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x050713, 0.46).setDepth(1);
      this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT * 0.42, GAME_WIDTH, GAME_HEIGHT * 0.58, 0x070814, 0.26).setDepth(1);
      return;
    }
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, STORYBOOK_UI.deepNight, 1);
  }


  private addTopReferenceBackdrop(): void {
    const g = this.add.graphics().setDepth(PARTICLE_DEPTH + 1);
    g.fillStyle(STORYBOOK_UI.paperBeige, 0.52).fillCircle(58, 112, 27);
    g.fillStyle(STORYBOOK_UI.deepNight, 0.96).fillCircle(68, 105, 24);
    g.lineStyle(1, STORYBOOK_UI.gold, 0.24);
    g.beginPath();
    g.moveTo(96, 88);
    g.lineTo(152, 70);
    g.lineTo(221, 84);
    g.lineTo(292, 62);
    g.strokePath();
    [96, 152, 221, 292].forEach((x, i) => {
      drawStar(g, x, i % 2 === 0 ? 88 : 70, i === 2 ? 5 : 3, STORYBOOK_UI.goldLight, STORYBOOK_UI.gold, 0.45);
    });

    drawPaperScrap(g, 30, 48, 82, 76, STORYBOOK_UI.paperBeige, 0.1);
    drawPaperScrap(g, 356, 50, 86, 82, STORYBOOK_UI.paperBeige, 0.1);
    drawPaperScrap(g, 34, 786, 80, 56, STORYBOOK_UI.paperBeige, 0.08);
    drawPaperScrap(g, 352, 784, 80, 56, STORYBOOK_UI.paperBeige, 0.08);

    drawLanternFocus(this, GAME_WIDTH - 38, 584, { radius: 76, depth: PARTICLE_DEPTH + 1, alpha: 0.08 });
    const lamp = this.add.graphics().setDepth(PARTICLE_DEPTH + 2);
    lamp.lineStyle(2, STORYBOOK_UI.goldLight, 0.32).strokeRect(GAME_WIDTH - 55, 560, 20, 30);
    lamp.fillStyle(STORYBOOK_UI.goldLight, 0.22).fillRect(GAME_WIDTH - 49, 568, 8, 12);
    lamp.lineStyle(2, STORYBOOK_UI.paperDark, 0.22).lineBetween(GAME_WIDTH - 45, 552, GAME_WIDTH - 45, 560);
  }

  private addTitleDecoration(): void {
    const depth = UI_DEPTH + 2;
    const g = this.add.graphics().setDepth(depth);

    drawPaperScrap(g, GAME_WIDTH / 2 - 10, 105, 338, 142, STORYBOOK_UI.paperDark, 0.24);
    drawPaperScrap(g, GAME_WIDTH / 2 + 12, 100, 338, 134, STORYBOOK_UI.paperShadow, 0.6);
    drawPremiumPaperCard(g, GAME_WIDTH / 2, 104, 328, 122, { accent: STORYBOOK_UI.goldLight, paper: STORYBOOK_UI.paperBeige, shadowAlpha: 0.62 });
    drawWaxSeal(g, GAME_WIDTH / 2 - 140, 140, 14, { color: STORYBOOK_UI.dustyRose, alpha: 0.9 });
    drawWaxSeal(g, GAME_WIDTH / 2 + 142, 126, 7, { color: STORYBOOK_UI.paperDark, alpha: 0.55 });
    drawMapThreads(g, GAME_WIDTH / 2, 166, 220, 0.24);

    const lampGlow = this.add.circle(GAME_WIDTH / 2, 52, 10, COLORS.lantern, 0.18).setDepth(depth).setBlendMode('ADD');
    const lampCore = this.add.circle(GAME_WIDTH / 2, 52, 3, COLORS.lantern, 0.62).setDepth(depth).setBlendMode('ADD');
    this.tweens.add({
      targets: lampGlow,
      alpha: { from: 0.12, to: 0.28 },
      scale: { from: 0.9, to: 1.18 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    void lampCore;

    [-1, 1].forEach((side) => {
      const x = GAME_WIDTH / 2 + side * 148;
      const inkDot = this.add.circle(x, 128, 5, COLORS.ink, 0.36).setDepth(depth);
      void inkDot;
    });
  }

  private addCurrencyTag(currency: number): void {
    const tag = this.add.container(GAME_WIDTH / 2, 190).setDepth(UI_DEPTH + 3);
    const g = this.add.graphics();
    drawPremiumPaperCard(g, 0, 0, 132, 28, { accent: STORYBOOK_UI.gold, paper: 0x2a2540, muted: true });
    const label = this.text(0, 0, `黒曜片 ${currency}`, 14, STORYBOOK_UI.goldLight, true);
    tag.add([g, label]);
  }

  private addHeroLantern(): void {
    drawLanternFocus(this, GAME_WIDTH / 2 + 52, 392, { radius: 150, depth: UI_DEPTH + 2, alpha: 0.18 });

    if (this.textures.exists(TOP_YUI_TEXTURE)) {
      const shadow = this.add.ellipse(GAME_WIDTH / 2, 542, 180, 24, 0x02030a, 0.52).setDepth(UI_DEPTH + 3);
      const yui = this.add.image(GAME_WIDTH / 2 + 4, 394, TOP_YUI_TEXTURE)
        .setDepth(UI_DEPTH + 4)
        .setDisplaySize(216, 338);
      yui.setOrigin(0.5, 0.52);
      this.tweens.add({ targets: [yui, shadow], y: '-=4', duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
      const whisper = this.text(GAME_WIDTH / 2, 530, '小さな灯りは、まだ消えない', 12, STORYBOOK_UI.goldLight, true).setDepth(UI_DEPTH + 5);
      whisper.setStroke('#090812', 4);
      whisper.setAlpha(0.92);
      return;
    }

    const c = this.add.container(GAME_WIDTH / 2, 384).setDepth(UI_DEPTH + 4);
    const g = this.add.graphics();
    g.fillStyle(0x080915, 0.78).fillEllipse(0, 83, 126, 18);

    g.fillStyle(0x1f1b32, 0.98).fillCircle(-18, -8, 28);
    g.fillStyle(0x29223a, 0.98).fillEllipse(-10, 40, 58, 84);
    g.fillStyle(0x0b0b18, 0.56).fillEllipse(-2, 50, 32, 72);
    g.fillStyle(0x1b1828, 0.98).fillTriangle(-48, 28, -6, 104, 28, 28);

    g.lineStyle(3, STORYBOOK_UI.goldLight, 0.5).lineBetween(8, 16, 38, 38);
    g.fillStyle(0x6a5334, 0.95).fillRect(34, 31, 24, 32);
    g.lineStyle(2, STORYBOOK_UI.goldLight, 0.9).strokeRect(33, 30, 26, 34);
    g.fillStyle(STORYBOOK_UI.goldLight, 0.9).fillRect(42, 38, 9, 15);
    g.fillStyle(STORYBOOK_UI.goldLight, 0.34).fillCircle(47, 47, 42);

    g.lineStyle(2, 0x6f5840, 0.72).lineBetween(-29, 18, 16, 74);
    g.fillStyle(0x3a2d31, 0.92).fillEllipse(22, 76, 24, 18);
    g.fillStyle(STORYBOOK_UI.paperLight, 0.62).fillCircle(-22, 2, 3);

    c.add(g);
    this.tweens.add({ targets: c, y: c.y - 4, duration: 2300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const whisper = this.text(GAME_WIDTH / 2, 498, '小さな灯りは、まだ消えない', 12, STORYBOOK_UI.goldLight, false).setDepth(UI_DEPTH + 3);
    whisper.setAlpha(0.72);
  }

  private addHeroBackdrop(): void {
    const g = this.add.graphics().setDepth(UI_DEPTH + 1);
    g.fillStyle(0x050714, 0.42).fillEllipse(GAME_WIDTH / 2, 405, 282, 344);
    g.lineStyle(1, STORYBOOK_UI.gold, 0.16).strokeEllipse(GAME_WIDTH / 2, 405, 278, 338);
    g.lineStyle(1, STORYBOOK_UI.goldLight, 0.12).strokeCircle(GAME_WIDTH / 2, 400, 122);
    g.lineStyle(1, STORYBOOK_UI.goldLight, 0.08).strokeCircle(GAME_WIDTH / 2, 400, 78);
    drawMapThreads(g, GAME_WIDTH / 2, 256, 210, 0.24);
    drawMapThreads(g, GAME_WIDTH / 2, 548, 180, 0.16);
    drawWaxSeal(g, 326, 540, 10, { color: STORYBOOK_UI.dustyRose, alpha: 0.6 });
  }

  private addCentralMap(g: Phaser.GameObjects.Graphics): void {
    drawPaperScrap(g, GAME_WIDTH / 2 - 6, 402, 344, 322, STORYBOOK_UI.paperDark, 0.28);
    drawLargeNotebookPage(g, GAME_WIDTH / 2, 395, 338, 310, { accent: STORYBOOK_UI.paperDark, alpha: 0.9 });
    g.fillStyle(STORYBOOK_UI.paperLight, 0.18).fillRect(44, 260, 294, 34);
    g.fillStyle(STORYBOOK_UI.paperShadow, 0.16).fillRect(44, 492, 294, 22);
    g.lineStyle(1, STORYBOOK_UI.paperDark, 0.22);
    g.strokeCircle(GAME_WIDTH / 2, 390, 118);
    g.strokeCircle(GAME_WIDTH / 2, 390, 72);
    g.lineBetween(GAME_WIDTH / 2, 276, GAME_WIDTH / 2, 504);
    g.lineBetween(76, 390, 314, 390);
    drawStar(g, GAME_WIDTH / 2, 390, 18, STORYBOOK_UI.gold, STORYBOOK_UI.paperDark, 0.26);
    drawMapThreads(g, GAME_WIDTH / 2, 304, 226, 0.32);
    drawMapThreads(g, GAME_WIDTH / 2, 542, 190, 0.22);
    for (let i = 0; i < 7; i += 1) {
      const y = 272 + i * 34;
      g.fillStyle(0x302534, 0.74).fillCircle(34, y, 8);
      g.lineStyle(2, STORYBOOK_UI.paperDark, 0.62).strokeCircle(34, y, 8);
      g.lineStyle(2, STORYBOOK_UI.goldLight, 0.18).lineBetween(34, y - 7, 48, y - 7);
      g.lineStyle(2, STORYBOOK_UI.goldLight, 0.18).lineBetween(34, y + 7, 48, y + 7);
    }
    drawWaxSeal(g, 322, 518, 10, { color: STORYBOOK_UI.dustyRose, alpha: 0.65 });

    g.fillStyle(0x111525, 0.9).fillRect(27, 520, 336, 34);
    g.lineStyle(1, STORYBOOK_UI.gold, 0.34).strokeRect(27, 520, 336, 34);
  }

  private addBottomDecoration(): void {
    const depth = UI_DEPTH + 1;
    const g = this.add.graphics().setDepth(depth);
    g.lineStyle(1, STORYBOOK_UI.paperDark, 0.14);
    g.strokeRect(GAME_WIDTH / 2 - 86, 728, 172, 1);
    drawMapThreads(g, GAME_WIDTH / 2, GAME_HEIGHT - 54, 156, 0.12);
  }

  private showFirstTimeIntro(mainBtn: Phaser.GameObjects.Container): void {
    const introText = this.text(GAME_WIDTH / 2, 472, 'まずは夜へ。影をほどき、記憶を拾う。', 12, STORYBOOK_UI.goldLight, true)
      .setDepth(UI_DEPTH + 6).setAlpha(0);
    this.tweens.add({ targets: introText, alpha: 1, duration: 600, delay: 500, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: introText, alpha: 0, duration: 500, delay: 6000, ease: 'Quad.easeIn' });

    const glow = this.add.rectangle(GAME_WIDTH / 2, 596, 324, 88, STORYBOOK_UI.goldLight, 0)
      .setDepth(UI_DEPTH + 4)
      .setBlendMode('ADD');
    this.tweens.add({
      targets: glow,
      alpha: { from: 0, to: 0.18 },
      scaleX: { from: 1, to: 1.04 },
      scaleY: { from: 1, to: 1.06 },
      duration: 800,
      delay: 600,
      yoyo: true,
      repeat: 3,
      ease: 'Sine.easeInOut',
    });
    void mainBtn;
  }

  private showNotice(value: string): void {
    this.notice?.setText(value);
  }

  private text(x: number, y: number, value: string, size: number, color: string | number, bold = false, title = false): Phaser.GameObjects.Text {
    return this.add.text(x, y, value, {
      fontFamily: title ? STORYBOOK_TITLE_FONT : STORYBOOK_FONT,
      fontSize: `${size}px`,
      color: colorString(color),
      fontStyle: bold ? 'bold' : 'normal',
      align: 'center',
      resolution: 2,
      lineSpacing: 3,
    }).setOrigin(0.5);
  }

  private button(x: number, y: number, width: number, height: number, label: string, onClick: () => void, muted = false, primary = false): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    if (primary) {
      drawPrimaryPaperCta(fill, 0, 0, width, height, { accent: STORYBOOK_UI.goldLight, paper: STORYBOOK_UI.paperLight });
      drawWaxSeal(fill, width / 2 - 24, -height / 2 + 20, 11, { color: STORYBOOK_UI.dustyRose, alpha: 0.72 });
      drawMapThreads(fill, 0, height / 2 - 12, width - 62, 0.2);
      const idleGlow = this.add.rectangle(0, 0, width + 10, height + 10, STORYBOOK_UI.goldLight, 0.08).setBlendMode('ADD');
      c.add(idleGlow);
      this.tweens.add({ targets: idleGlow, alpha: { from: 0.05, to: 0.13 }, scaleX: { from: 1, to: 1.02 }, scaleY: { from: 1, to: 1.04 }, duration: 1900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    } else if (muted) {
      drawPremiumPaperCard(fill, 0, 0, width, height, { accent: 0x76688d, paper: 0x27233e, muted: true });
    } else {
      drawPremiumPaperCard(fill, 0, 0, width, height, { accent: STORYBOOK_UI.gold, paper: STORYBOOK_UI.paperLight });
    }
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this, hit, c, {
      x,
      y,
      width,
      height,
      accent: muted ? 0x786991 : STORYBOOK_UI.goldLight,
      depth: 1000,
      strong: primary || height >= 46,
      shake: primary || (!muted && height >= 46),
    });
    hit.on('pointerdown', () => {
      getAudioManager(this).playSe(primary ? 'ui_confirm' : 'ui_select', { volume: primary ? 0.48 : 0.36 });
      onClick();
    });
    const fontSize = primary ? 20 : 15;
    const labelText = this.text(0, 0, label, fontSize, muted ? STORYBOOK_UI.textMuted : STORYBOOK_UI.textDark, true);
    c.add([fill, labelText, hit]);
    return c;
  }

  private menuCard(x: number, y: number, width: number, height: number, label: string, icon: 'sprout' | 'book' | 'gear', onClick: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    drawPremiumPaperCard(fill, 0, 0, width, height, { accent: STORYBOOK_UI.gold, paper: STORYBOOK_UI.paperBeige, shadowAlpha: 0.48 });
    this.drawMenuIcon(fill, icon, 0, -18);
    const labelText = this.text(0, 17, label, 15, STORYBOOK_UI.textDark, true);
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this, hit, c, {
      x,
      y,
      width,
      height,
      accent: STORYBOOK_UI.goldLight,
      depth: 1000,
      strong: true,
      shake: true,
    });
    hit.on('pointerdown', () => {
      getAudioManager(this).playSe('ui_select', { volume: 0.36 });
      onClick();
    });
    c.add([fill, labelText, hit]);
    return c;
  }

  private drawMenuIcon(g: Phaser.GameObjects.Graphics, icon: 'sprout' | 'book' | 'gear', x: number, y: number): void {
    g.lineStyle(3, STORYBOOK_UI.paperDark, 0.86);
    g.fillStyle(STORYBOOK_UI.paperDark, 0.86);
    if (icon === 'sprout') {
      g.lineBetween(x, y + 17, x, y - 2);
      g.fillEllipse(x - 8, y - 6, 16, 10);
      g.fillEllipse(x + 9, y - 9, 18, 11);
      g.fillStyle(STORYBOOK_UI.paperDark, 0.18).fillRect(x - 18, y + 16, 36, 5);
      return;
    }
    if (icon === 'book') {
      g.strokeRect(x - 20, y - 14, 17, 28);
      g.strokeRect(x + 3, y - 14, 17, 28);
      g.lineBetween(x, y - 13, x, y + 15);
      drawStar(g, x + 11, y - 2, 5, STORYBOOK_UI.goldLight, STORYBOOK_UI.paperDark, 0.9);
      return;
    }
    g.lineStyle(4, STORYBOOK_UI.paperDark, 0.86).strokeCircle(x, y, 12);
    g.lineStyle(3, STORYBOOK_UI.paperDark, 0.86);
    for (let i = 0; i < 8; i += 1) {
      const a = (Math.PI * 2 * i) / 8;
      g.lineBetween(x + Math.cos(a) * 16, y + Math.sin(a) * 16, x + Math.cos(a) * 21, y + Math.sin(a) * 21);
    }
    g.fillStyle(STORYBOOK_UI.paperDark, 0.86).fillCircle(x, y, 4);
  }
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
