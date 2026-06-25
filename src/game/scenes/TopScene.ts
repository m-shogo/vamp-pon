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
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI } from '../ui/storybookUi';
import {
  drawInkVignette,
  drawLanternFocus,
  drawMapThreads,
  drawNewSparkBadge,
  drawPaperScrap,
  drawPremiumPaperCard,
  drawStarMapBackdrop,
} from '../ui/premiumPaperUi';
import { getAudioManager } from '../audio/AudioManager';
import { loadOnboarding, markSeen, resetOnboarding } from '../persistence/onboarding';
import { findNewAchievementIds, loadAchievementViewState } from '../persistence/achievementViewState';

const PARTICLE_DEPTH = 2;
const UI_DEPTH = 10;

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

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, STORYBOOK_UI.deepNight, 1);
    const starBg = this.add.graphics().setDepth(PARTICLE_DEPTH);
    drawStarMapBackdrop(starBg, GAME_WIDTH, GAME_HEIGHT, { alpha: 0.1, density: 18 });
    this.addBackgroundAtmosphere();

    const vignette = this.add.graphics().setDepth(PARTICLE_DEPTH + 1);
    drawInkVignette(vignette, GAME_WIDTH, GAME_HEIGHT, { alpha: 0.35 });

    const panel = this.add.graphics().setDepth(UI_DEPTH);
    const panelLeft = Math.round(GAME_WIDTH / 2 - 178);
    const panelTop = Math.round(GAME_HEIGHT / 2 + 6 - 367);
    panel.fillStyle(STORYBOOK_UI.inkViolet, 0.38).fillRect(panelLeft, panelTop, 356, 734);
    panel.lineStyle(1, STORYBOOK_UI.paperDark, 0.2).strokeRect(panelLeft, panelTop, 356, 734);
    drawPaperScrap(panel, GAME_WIDTH / 2, panelTop + 20, 200, 16, STORYBOOK_UI.paperBeige, 0.04);
    drawPaperScrap(panel, GAME_WIDTH / 2, panelTop + 714, 180, 12, STORYBOOK_UI.paperBeige, 0.03);

    this.addTitleDecoration();

    const titleText = this.text(GAME_WIDTH / 2, 92, 'VAMP PON', 43, STORYBOOK_UI.textLight, true, true).setDepth(UI_DEPTH + 4);
    titleText.setShadow(0, 2, '#070815', 3, true, true);
    this.tweens.add({ targets: titleText, y: titleText.y - 3, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const subtitleText = this.text(GAME_WIDTH / 2, 139, '忘れた名前を、夜から拾う', 14, STORYBOOK_UI.goldLight, true).setDepth(UI_DEPTH + 3);
    subtitleText.setAlpha(0);
    this.tweens.add({ targets: subtitleText, alpha: 1, duration: 800, delay: 300, ease: 'Quad.easeOut' });

    this.addCurrencyTag(profile.currency);
    this.addHeroLantern();

    const mainBtn = this.button(GAME_WIDTH / 2, 454, 270, 64, '夜へ出る', () => {
      this.scene.start('StageSelectScene', { mode: 'stage' });
    }, false, true);
    mainBtn.setDepth(UI_DEPTH + 5);

    const growthBtn = this.button(GAME_WIDTH / 2, 532, 226, 48, '成長', () => {
      this.scene.start('StageSelectScene', { mode: 'growth' });
    }, true);
    growthBtn.setDepth(UI_DEPTH + 4);

    const viewState = loadCollectionAtlasViewState();
    const newCellCount = findNewCompletedCellIds(collection.nightBoard.completedCellIds, viewState.seenCompletedCellIds).length;
    const achViewState = loadAchievementViewState();
    const newAchCount = findNewAchievementIds(Object.keys(profile.achievements), achViewState.seenAchievementIds).length;
    const totalNewCount = newCellCount + newAchCount;
    const collLabel = `忘れ物帳 ${boardCount}/${boardTotal}`;
    const collBtn = this.button(GAME_WIDTH / 2, 592, 226, 48, collLabel, () => {
      this.scene.start('CollectionScene');
    }, boardCount === 0 && totalNewCount === 0);
    collBtn.setDepth(UI_DEPTH + 4);
    if (totalNewCount > 0) {
      drawNewSparkBadge(this, GAME_WIDTH / 2 + 118, 576, totalNewCount, { depth: UI_DEPTH + 7 });
    }

    const settingsBtn = this.button(GAME_WIDTH / 2, 652, 178, 42, '設定', () => this.showNotice('設定は準備中です'), true);
    settingsBtn.setDepth(UI_DEPTH + 3);

    this.notice = this.text(GAME_WIDTH / 2, 706, '', 13, STORYBOOK_UI.textMuted).setDepth(UI_DEPTH + 2);

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

  private addTitleDecoration(): void {
    const depth = UI_DEPTH + 2;
    const g = this.add.graphics().setDepth(depth);

    g.fillStyle(STORYBOOK_UI.inkBlack, 0.3).fillRect(GAME_WIDTH / 2 - 136, 58, 272, 104);
    g.lineStyle(1, STORYBOOK_UI.paperDark, 0.22);
    g.strokeRect(GAME_WIDTH / 2 - 130, 68, 260, 1);
    g.strokeRect(GAME_WIDTH / 2 - 110, 158, 220, 1);
    drawMapThreads(g, GAME_WIDTH / 2, 166, 172, 0.12);

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
      const x = GAME_WIDTH / 2 + side * 142;
      const inkDot = this.add.circle(x, 118, 4, COLORS.ink, 0.3).setDepth(depth);
      void inkDot;
    });
  }

  private addCurrencyTag(currency: number): void {
    const tag = this.add.container(GAME_WIDTH / 2, 178).setDepth(UI_DEPTH + 3);
    const g = this.add.graphics();
    drawPremiumPaperCard(g, 0, 0, 132, 28, { accent: STORYBOOK_UI.gold, paper: 0x2a2540, muted: true });
    const label = this.text(0, 0, `黒曜片 ${currency}`, 14, STORYBOOK_UI.goldLight, true);
    tag.add([g, label]);
  }

  private addHeroLantern(): void {
    drawLanternFocus(this, GAME_WIDTH / 2, 286, { radius: 110, depth: UI_DEPTH + 1, alpha: 0.16 });

    const c = this.add.container(GAME_WIDTH / 2, 288).setDepth(UI_DEPTH + 3);
    const g = this.add.graphics();
    g.fillStyle(0x080915, 0.76).fillEllipse(0, 66, 92, 16);

    g.fillStyle(0x1f1b32, 0.98).fillCircle(-16, 7, 24);
    g.fillStyle(0x29223a, 0.98).fillEllipse(-10, 42, 46, 62);
    g.fillStyle(0x0b0b18, 0.55).fillEllipse(-3, 48, 22, 52);

    g.lineStyle(3, STORYBOOK_UI.goldLight, 0.42).lineBetween(8, 17, 28, 32);
    g.fillStyle(0x6a5334, 0.94).fillRect(24, 26, 18, 24);
    g.lineStyle(1, STORYBOOK_UI.goldLight, 0.86).strokeRect(23, 25, 20, 26);
    g.fillStyle(STORYBOOK_UI.goldLight, 0.86).fillRect(29, 31, 8, 12);
    g.fillStyle(STORYBOOK_UI.goldLight, 0.3).fillCircle(33, 38, 30);

    g.lineStyle(2, 0x6f5840, 0.72).lineBetween(-25, 20, 12, 60);
    g.fillStyle(0x3a2d31, 0.92).fillEllipse(18, 58, 20, 16);
    g.fillStyle(STORYBOOK_UI.paperLight, 0.62).fillCircle(-22, 2, 3);

    c.add(g);
    this.tweens.add({ targets: c, y: c.y - 4, duration: 2300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const whisper = this.text(GAME_WIDTH / 2, 382, '小さな灯りは、まだ消えない', 12, STORYBOOK_UI.textMuted, false).setDepth(UI_DEPTH + 3);
    whisper.setAlpha(0.72);
  }

  private addBottomDecoration(): void {
    const depth = UI_DEPTH + 1;
    const g = this.add.graphics().setDepth(depth);
    g.lineStyle(1, STORYBOOK_UI.paperDark, 0.14);
    g.strokeRect(GAME_WIDTH / 2 - 86, 728, 172, 1);
    drawMapThreads(g, GAME_WIDTH / 2, GAME_HEIGHT - 54, 156, 0.12);
  }

  private showFirstTimeIntro(mainBtn: Phaser.GameObjects.Container): void {
    const introText = this.text(GAME_WIDTH / 2, 412, 'まずは夜へ。影をほどき、記憶を拾う。', 12, STORYBOOK_UI.goldLight, true)
      .setDepth(UI_DEPTH + 6).setAlpha(0);
    this.tweens.add({ targets: introText, alpha: 1, duration: 600, delay: 500, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: introText, alpha: 0, duration: 500, delay: 6000, ease: 'Quad.easeIn' });

    const glow = this.add.rectangle(GAME_WIDTH / 2, 454, 282, 74, STORYBOOK_UI.goldLight, 0)
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
      drawPremiumPaperCard(fill, 0, 0, width, height, { accent: STORYBOOK_UI.goldLight, paper: STORYBOOK_UI.paperLight, selected: true });
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
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
