import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import {
  buyUpgrade,
  characterXpToNext,
  EXPLORATION_DEPTHS,
  loadProfile,
  resetUpgrades,
  selectRun,
  selectSubCharacter,
  UPGRADE_DEFS,
  upgradeCost,
  upgradeRefundValue,
  type ExplorationDepthId,
  type PlayerProfile,
  type UpgradeId,
} from '../persistence/profile';
import { loadBondProgress } from '../persistence/bonds';
import { characters } from '../data/characters';
import { nextUnreadBondTalkId } from '../systems/bondTalkUnlocks';
import { buildStageSelectSubCharacterViewModel } from './stageSelectViewModel';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI } from '../ui/storybookUi';
import {
  drawInkDivider,
  drawInkVignette,
  drawLargeNotebookPage,
  drawMapThreads,
  drawPremiumPaperCard,
  drawPrimaryPaperCta,
  drawSecondaryPaperButton,
  drawStarMapBackdrop,
  drawWaxSeal,
} from '../ui/premiumPaperUi';
import { loadBackgroundManifest, getBackgroundByStageNumber, type BackgroundStageEntry } from '../assets/backgroundManifest';
import { stageBackgroundTextureKey } from '../ui/background';
import { attachPressFeedback } from '../ui/pressFeedback';
import { getAudioManager } from '../audio/AudioManager';
import { loadOnboarding, markSeen } from '../persistence/onboarding';
import { findNewAchievementIds, loadAchievementViewState } from '../persistence/achievementViewState';
import { findNewCompletedCellIds, loadCollectionAtlasViewState } from '../persistence/collectionAtlasViewState';
import { loadCollectionProgress } from '../persistence/collection';
export { isRunStartUrl } from '../utils/runStartUrl';

type StageSelectMode = 'stage' | 'growth';

const DEPTH_ORDER: ExplorationDepthId[] = ['shallow', 'middle', 'deep'];
const UPGRADE_ORDER: UpgradeId[] = [
  'maxHp',
  'might',
  'moveSpeed',
  'xpGain',
  'magnet',
  'currencyGain',
  'damageReduction',
  'ultimateCharge',
  'noBerserkBonus',
];

// 深度の追加情報（既存 EXPLORATION_DEPTHS にラベル/報酬は入っているが、
// プレイヤー向けの「強さ感」と「おすすめ」を別に持つ）。
const DEPTH_FLAVOR: Record<ExplorationDepthId, { sub: string; recommend: string }> = {
  shallow: { sub: 'やさしめ', recommend: 'まず夜に慣れる（Easy）' },
  middle:  { sub: '標準', recommend: 'バランスよく稼ぐ（Normal）' },
  deep:    { sub: '強め/多め', recommend: 'ビルドが整ったら（Hard）' },
};
const DEPTH_EN_LABEL: Record<ExplorationDepthId, string> = {
  shallow: 'Easy',
  middle: 'Normal',
  deep: 'Hard',
};
const UI_TITLE_BANNER = 'ui_paper_title_banner_v1';
const UI_CTA_BUTTON = 'ui_paper_cta_button_v1';
const UI_SMALL_CARD = 'ui_paper_small_card_v1';
const UI_WAX_SEAL = 'ui_wax_seal_badge_v1';

export class StageSelectScene extends Phaser.Scene {
  private root: Phaser.GameObjects.Container | null = null;
  private confirmingReset = false;
  private mode: StageSelectMode = 'stage';
  private bgManifestLoaded = false;
  private bgEntryByStage = new Map<number, BackgroundStageEntry>();

  constructor() {
    super('StageSelectScene');
  }

  init(data?: { mode?: StageSelectMode }): void {
    this.mode = data?.mode ?? 'stage';
    this.confirmingReset = false;
  }

  create(): void {
    const audio = getAudioManager(this);
    audio.unlockOnFirstInput();
    audio.playBgm(this.mode === 'growth' ? 'bgm_growth' : 'bgm_top', { volume: 0.3, fadeMs: 220 });
    this.render();
    void this.ensureBackgroundManifest();
  }

  private async ensureBackgroundManifest(): Promise<void> {
    if (this.bgManifestLoaded) return;
    const manifest = await loadBackgroundManifest();
    this.bgManifestLoaded = true;
    if (!manifest) return;
    for (const entry of manifest.stages) {
      this.bgEntryByStage.set(entry.number, entry);
    }
    // 背景プレビュー対象のテクスチャを on-demand で読み込み、終わったら再描画。
    const profile = loadProfile();
    void this.loadPreviewTextureFor(profile.selectedStage).then((loaded) => {
      if (loaded) this.render();
    });
  }

  private loadPreviewTextureFor(stageNumber: number): Promise<boolean> {
    const entry = this.bgEntryByStage.get(stageNumber);
    if (!entry || !entry.enabledForRuntime) return Promise.resolve(false);
    const key = stageBackgroundTextureKey(entry);
    if (this.textures.exists(key)) return Promise.resolve(true);
    return new Promise<boolean>((resolve) => {
      this.load.image(key, entry.environment);
      this.load.once(Phaser.Loader.Events.COMPLETE, () => resolve(this.textures.exists(key)));
      this.load.once(Phaser.Loader.Events.FILE_LOAD_ERROR, () => resolve(false));
      this.load.start();
    });
  }

  private render(): void {
    this.root?.destroy(true);
    const profile = loadProfile();
    const root = this.add.container(0, 0);
    this.root = root;

    root.add(this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, STORYBOOK_UI.deepNight, 1));
    const stars = this.add.graphics();
    drawStarMapBackdrop(stars, GAME_WIDTH, GAME_HEIGHT, { alpha: 0.1, density: 24 });
    root.add(stars);
    const vignette = this.add.graphics();
    drawInkVignette(vignette, GAME_WIDTH, GAME_HEIGHT, { alpha: 0.42 });
    root.add(vignette);

    const titleY = 36;
    if (this.textures.exists(UI_TITLE_BANNER)) {
      root.add(this.add.image(GAME_WIDTH / 2, titleY + 1, UI_TITLE_BANNER).setDisplaySize(294, 64).setAlpha(0.96));
      if (this.textures.exists(UI_WAX_SEAL)) {
        root.add(this.add.image(GAME_WIDTH / 2 - 124, titleY + 16, UI_WAX_SEAL).setDisplaySize(26, 26).setAlpha(0.86));
      }
    } else {
      const titleBg = this.add.graphics();
      drawLargeNotebookPage(titleBg, GAME_WIDTH / 2, titleY, 280, 44, { accent: STORYBOOK_UI.warmAmber, alpha: 0.95 });
      root.add(titleBg);
    }
    root.add(this.text(GAME_WIDTH / 2, titleY, this.mode === 'growth' ? '黒曜研究所' : '夜の地図', 20, STORYBOOK_UI.textDark, true, true));
    const titleDiv = this.add.graphics();
    drawInkDivider(titleDiv, GAME_WIDTH / 2, 64, 200, { color: STORYBOOK_UI.paperDark, alpha: 0.25 });
    root.add(titleDiv);
    root.add(this.text(GAME_WIDTH / 2, 76, `黒曜片 ${profile.currency}`, 13, STORYBOOK_UI.lanternCore, true));

    const recordLabel = this.recordButtonLabel();

    if (this.mode === 'stage') {
      this.renderStagePreview(root, profile);
      this.renderDepthBlock(root, profile);
      this.renderTravelPrep(root, profile);
      root.add(this.paperCta(GAME_WIDTH / 2, GAME_HEIGHT - 110, 280, 54, '探索を始める', () => this.startRun(profile)));
      root.add(this.secondaryNav(GAME_WIDTH / 2 - 100, GAME_HEIGHT - 46, 88, 40, 'TOPへ', () => this.scene.start('TopScene')));
      root.add(this.secondaryNav(GAME_WIDTH / 2 + 100, GAME_HEIGHT - 46, 88, 40, recordLabel, () => {
        getAudioManager(this).playSe('ui_open', { volume: 0.34 });
        this.scene.start('CollectionScene');
      }));
      root.add(this.secondaryNav(GAME_WIDTH / 2, GAME_HEIGHT - 46, 88, 40, '成長へ', () => {
        this.mode = 'growth';
        getAudioManager(this).playBgm('bgm_growth', { volume: 0.3, fadeMs: 220 });
        this.render();
      }));
    } else {
      this.renderCharacterSummary(root, profile);
      this.renderSubCharacterStatus(root, profile, 136);
      this.renderUpgradeBlock(root, profile);
      root.add(this.paperCta(GAME_WIDTH / 2, GAME_HEIGHT - 108, 260, 50, '探索へ出発', () => this.startRun(profile)));
      root.add(this.secondaryNav(GAME_WIDTH / 2 - 100, GAME_HEIGHT - 46, 88, 40, 'TOPへ', () => this.scene.start('TopScene')));
      root.add(this.secondaryNav(GAME_WIDTH / 2 + 100, GAME_HEIGHT - 46, 88, 40, recordLabel, () => {
        getAudioManager(this).playSe('ui_open', { volume: 0.34 });
        this.scene.start('CollectionScene');
      }));
      root.add(this.secondaryNav(GAME_WIDTH / 2, GAME_HEIGHT - 46, 88, 40, 'ステージ選択', () => {
        this.mode = 'stage';
        getAudioManager(this).playBgm('bgm_top', { volume: 0.3, fadeMs: 220 });
        this.render();
      }));
    }

    if (this.confirmingReset) this.renderResetConfirm(root, profile);

    const onboarding = loadOnboarding();
    if (this.mode === 'stage' && !onboarding.stageSelectIntroSeen) {
      this.showOnboardingHint(root, 'ステージと深さを選んで探索へ\n深さは Easy がおすすめ', 88);
      markSeen('stageSelectIntroSeen');
    } else if (this.mode === 'growth' && !onboarding.growthIntroSeen) {
      this.showOnboardingHint(root, '黒曜片で強化して次の夜に備える\nいつでもリセット可能', 88);
      markSeen('growthIntroSeen');
    }
  }

  // --- ステージ選択（プレビュー + 前後ナビ） ---
  private renderStagePreview(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    const current = profile.selectedStage;
    const unlocked = profile.unlockedStages;
    const idx = unlocked.indexOf(current);
    const prev = idx > 0 ? unlocked[idx - 1] : null;
    const next = idx >= 0 && idx + 1 < unlocked.length ? unlocked[idx + 1] : null;
    const nextLocked = next == null;

    const cardX = GAME_WIDTH / 2;
    const cardY = 218;
    const cardW = 340;
    const cardH = 224;

    const pageBg = this.add.graphics();
    drawLargeNotebookPage(pageBg, cardX, cardY, cardW, cardH, { accent: STORYBOOK_UI.paperDark, alpha: 0.96 });
    this.drawStageMapOrnaments(pageBg, cardX, cardY, cardW, cardH);
    root.add(pageBg);

    const entry = this.bgEntryByStage.get(current);
    const key = entry ? stageBackgroundTextureKey(entry) : null;
    const innerW = cardW - 40;
    const innerH = 102;
    const innerY = cardY + 2;

    const titleStrip = this.add.graphics();
    drawPremiumPaperCard(titleStrip, cardX - 18, cardY - 76, 218, 42, {
      accent: STORYBOOK_UI.warmAmber,
      paper: STORYBOOK_UI.paperLight,
      selected: true,
      shadowAlpha: 0.16,
    });
    root.add(titleStrip);
    const stageName = entry?.name ?? '夜路';
    root.add(this.text(cardX - 18, cardY - 84, `Stage ${current}`, 18, STORYBOOK_UI.textDark, true, true));
    root.add(this.text(cardX - 18, cardY - 65, stageName, 12, STORYBOOK_UI.paperDark, true));

    if (key && this.textures.exists(key)) {
      const tile = this.add.image(cardX, innerY, key).setDisplaySize(innerW, innerH);
      root.add(tile);
    } else {
      root.add(this.add.rectangle(cardX, innerY, innerW, innerH, STORYBOOK_UI.inkViolet, 0.8));
    }
    root.add(this.add.rectangle(cardX, innerY, innerW, innerH, STORYBOOK_UI.inkBlack, 0.35));

    const routeLines = this.add.graphics();
    drawMapThreads(routeLines, cardX, innerY + 11, innerW - 52, 0.38);
    const routeNodes = [
      { x: cardX - 104, y: innerY + 22, r: 7, active: true },
      { x: cardX - 38, y: innerY + 4, r: 5, active: false },
      { x: cardX + 36, y: innerY + 15, r: 5, active: false },
      { x: cardX + 108, y: innerY - 5, r: 12, active: false },
    ];
    routeNodes.forEach((node) => {
      routeLines.fillStyle(node.active ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.paperBeige, node.active ? 0.72 : 0.34);
      routeLines.fillCircle(node.x, node.y, node.r);
      routeLines.lineStyle(node.active ? 2 : 1, node.active ? STORYBOOK_UI.goldLight : STORYBOOK_UI.paperLight, node.active ? 0.82 : 0.52);
      routeLines.strokeCircle(node.x, node.y, node.r + 3);
    });
    routeLines.lineStyle(3, STORYBOOK_UI.dustyRose, 0.48);
    routeLines.strokeCircle(cardX + 108, innerY - 5, 19);
    root.add(routeLines);

    const routeBorder = this.add.graphics();
    routeBorder.lineStyle(2, STORYBOOK_UI.paperDark, 0.68);
    routeBorder.strokeRect(cardX - innerW / 2, innerY - innerH / 2, innerW, innerH);
    routeBorder.lineStyle(1, STORYBOOK_UI.goldLight, 0.18);
    routeBorder.strokeRect(cardX - innerW / 2 + 5, innerY - innerH / 2 + 5, innerW - 10, innerH - 10);
    root.add(routeBorder);

    const lvBadge = this.add.graphics();
    const charProgress = profile.characterProgress[characters[0].id] ?? { level: 1, xp: 0, totalXp: 0 };
    const lvX = cardX + cardW / 2 - 42;
    const lvY = cardY - 80;
    lvBadge.fillStyle(STORYBOOK_UI.deepNight, 0.9).fillRect(lvX - 28, lvY - 12, 56, 24);
    lvBadge.lineStyle(1, STORYBOOK_UI.warmAmber, 0.72).strokeRect(lvX - 28, lvY - 12, 56, 24);
    lvBadge.fillStyle(STORYBOOK_UI.warmAmber, 0.12).fillRect(lvX - 24, lvY - 8, 48, 16);
    root.add(lvBadge);
    root.add(this.text(lvX, lvY, `Lv.${charProgress.level}`, 12, STORYBOOK_UI.lanternCore, true));

    if (this.textures.exists(UI_WAX_SEAL)) {
      root.add(this.add.image(cardX + cardW / 2 - 40, cardY + 36, UI_WAX_SEAL).setDisplaySize(66, 66).setAlpha(0.84).setAngle(-7));
    } else {
      const seal = this.add.graphics();
      drawWaxSeal(seal, cardX + cardW / 2 - 40, cardY + 35, 28, { color: STORYBOOK_UI.dustyRose });
      seal.lineStyle(1, STORYBOOK_UI.paperDark, 0.32);
      seal.lineBetween(cardX + cardW / 2 - 52, cardY + 35, cardX + cardW / 2 - 28, cardY + 35);
      seal.lineBetween(cardX + cardW / 2 - 40, cardY + 23, cardX + cardW / 2 - 40, cardY + 47);
      root.add(seal);
    }

    root.add(this.text(cardX - 10, cardY + 62, this.stageBlurbFor(current, entry), 11, STORYBOOK_UI.textDark, true));
    const hint = this.stageHintFor(current);
    if (hint) root.add(this.text(cardX - 10, cardY + 78, hint, 10, STORYBOOK_UI.paperDark));

    const recordChip = this.add.graphics();
    drawPremiumPaperCard(recordChip, cardX, cardY + 104, 210, 28, {
      accent: STORYBOOK_UI.gold,
      paper: STORYBOOK_UI.paperLight,
      shadowAlpha: 0.12,
    });
    root.add(recordChip);
    root.add(this.text(cardX, cardY + 104, `開放 ${unlocked.length}ステージ / Best Record`, 10, STORYBOOK_UI.paperDark, true));

    const prevBtn = this.navArrow(18, cardY, '◀', () => {
      if (prev == null) return;
      selectRun(prev, profile.selectedDepth);
      void this.loadPreviewTextureFor(prev).then(() => this.render());
      this.render();
    }, prev == null);
    root.add(prevBtn);

    const nextBtn = this.navArrow(GAME_WIDTH - 18, cardY, nextLocked ? '×' : '▶', () => {
      if (next == null) return;
      selectRun(next, profile.selectedDepth);
      void this.loadPreviewTextureFor(next).then(() => this.render());
      this.render();
    }, nextLocked);
    root.add(nextBtn);

    void nextLocked;
  }

  private drawStageMapOrnaments(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    const left = x - width / 2;
    const top = y - height / 2;
    g.fillStyle(STORYBOOK_UI.paperDark, 0.1).fillRect(left + 22, top + 28, width - 44, 1);
    g.fillStyle(STORYBOOK_UI.paperDark, 0.08).fillRect(left + 22, top + height - 34, width - 44, 1);
    g.lineStyle(1, STORYBOOK_UI.paperDark, 0.24);
    g.strokeCircle(left + 46, top + 76, 20);
    g.lineBetween(left + 46, top + 49, left + 46, top + 103);
    g.lineBetween(left + 19, top + 76, left + 73, top + 76);
    g.fillStyle(STORYBOOK_UI.gold, 0.2);
    g.fillTriangle(left + 46, top + 58, left + 40, top + 76, left + 52, top + 76);
    g.fillStyle(STORYBOOK_UI.dustyRose, 0.12).fillRect(left + width - 60, top + 36, 34, 46);
    g.lineStyle(1, STORYBOOK_UI.dustyRose, 0.38);
    g.strokeRect(left + width - 60, top + 36, 34, 46);
  }

  private stageBlurbFor(stage: number, _entry: BackgroundStageEntry | undefined): string {
    if (stage === 1) return '黒インクに沈む、最初の夜路';
    if (stage === 2) return '地図の線が、雨で少しだけずれている。';
    if (stage === 3) return '街灯の輪、灯りに集まる影';
    if (stage === 4) return '橋の手前、深まる夜';
    if (stage === 5) return '夜主の気配、最初の節目';
    return '夜路はまだ続く';
  }

  private stageHintFor(stage: number): string | null {
    if (stage === 2) return '横から挟む影が増える｜報酬 +20%';
    if (stage === 3) return '四方から揺さぶる交差点｜報酬 +45%';
    if (stage === 4) return '左右と周囲で道幅を削る｜報酬 +75%';
    if (stage === 5) return '全方位から押し寄せる終盤｜報酬 +110%';
    return null;
  }

  // --- 難易度（Easy/Normal/Hard） ---
  private renderDepthBlock(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    const blockY = 372;
    root.add(this.text(GAME_WIDTH / 2, blockY, '夜の深さ', 14, STORYBOOK_UI.lanternCore, true));

    const cardW = 108;
    const cardH = 124;
    DEPTH_ORDER.forEach((depthId, index) => {
      const depth = EXPLORATION_DEPTHS[depthId];
      const flavor = DEPTH_FLAVOR[depthId];
      const selected = depthId === profile.selectedDepth;
      const x = GAME_WIDTH / 2 + (index - 1) * (cardW + 8);
      const y = blockY + 82;

      const card = this.add.graphics();
      if (selected) {
        if (this.textures.exists(UI_SMALL_CARD)) {
          root.add(this.add.image(x, y, UI_SMALL_CARD).setDisplaySize(cardW + 18, cardH + 18).setAlpha(0.98));
          card.fillStyle(STORYBOOK_UI.goldLight, 0.13).fillRoundedRect(x - cardW / 2 + 8, y - cardH / 2 + 8, cardW - 16, cardH - 16, 9);
          card.lineStyle(3, STORYBOOK_UI.goldLight, 0.56).strokeRoundedRect(x - cardW / 2 + 2, y - cardH / 2 + 2, cardW - 4, cardH - 4, 11);
        } else {
          drawLargeNotebookPage(card, x, y, cardW, cardH, { accent: STORYBOOK_UI.warmAmber, alpha: 1 });
          card.fillStyle(STORYBOOK_UI.goldLight, 0.13).fillRect(x - cardW / 2 + 7, y - cardH / 2 + 8, cardW - 14, cardH - 16);
          card.lineStyle(3, STORYBOOK_UI.goldLight, 0.18).strokeRect(x - cardW / 2 - 4, y - cardH / 2 - 4, cardW + 8, cardH + 8);
        }
      } else {
        if (this.textures.exists(UI_SMALL_CARD)) {
          const paper = this.add.image(x, y, UI_SMALL_CARD).setDisplaySize(cardW + 12, cardH + 12).setAlpha(0.88);
          if (depthId === 'deep') paper.setTint(0xffddd7);
          root.add(paper);
          card.lineStyle(2, depth.tint, 0.42).strokeRoundedRect(x - cardW / 2 + 8, y - cardH / 2 + 8, cardW - 16, cardH - 16, 9);
        } else {
          drawPremiumPaperCard(card, x, y, cardW, cardH, {
            accent: depth.tint,
            paper: depthId === 'deep' ? 0xf0d6cf : 0xeadbb8,
            shadowAlpha: 0.38,
          });
        }
        card.fillStyle(STORYBOOK_UI.inkBlack, 0.06).fillRect(x - cardW / 2 + 9, y + 10, cardW - 18, 1);
      }
      card.fillStyle(depth.tint, selected ? 0.82 : 0.36);
      card.fillPoints([
        new Phaser.Math.Vector2(x - 9, y - cardH / 2 + 10),
        new Phaser.Math.Vector2(x, y - cardH / 2 + 1),
        new Phaser.Math.Vector2(x + 9, y - cardH / 2 + 10),
        new Phaser.Math.Vector2(x, y - cardH / 2 + 19),
      ], true);
      root.add(card);

      const lanternG = this.add.graphics();
      const lanternY = y - 24;
      const lanternAlpha = depthId === 'shallow' ? 0.4 : depthId === 'middle' ? 0.65 : 0.95;
      const lanternColor = selected ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.paperDark;
      lanternG.fillStyle(lanternColor, lanternAlpha);
      lanternG.fillRect(x - 3, lanternY - 14, 6, 8);
      lanternG.fillStyle(STORYBOOK_UI.lanternCore, lanternAlpha * 0.8);
      lanternG.fillCircle(x, lanternY, 8);
      if (selected) {
        lanternG.fillStyle(STORYBOOK_UI.lanternCore, 0.15);
        lanternG.fillCircle(x, lanternY, 18);
      }
      root.add(lanternG);

      root.add(this.text(x, y + 2, DEPTH_EN_LABEL[depthId], 14, STORYBOOK_UI.textDark, true, true));
      root.add(this.text(x, y + 21, depth.label, 12, STORYBOOK_UI.paperDark, true));
      root.add(this.text(x, y + 38, `報酬×${depth.reward.toFixed(1)}`, 10, STORYBOOK_UI.textMuted));

      const hit = this.add.rectangle(x, y, cardW, cardH, 0x000000, 0.001).setInteractive({ useHandCursor: true });
      attachPressFeedback(this, hit, root, {
        x, y, width: cardW, height: cardH,
        accent: depth.tint, depth: 1000,
      });
      hit.on('pointerdown', () => {
        getAudioManager(this).playSe('ui_select', { volume: 0.36 });
        selectRun(profile.selectedStage, depthId);
        this.render();
      });
      root.add(hit);
    });
    const selected = DEPTH_FLAVOR[profile.selectedDepth];
    root.add(this.text(GAME_WIDTH / 2, blockY + 152, selected.recommend, 12, STORYBOOK_UI.warmAmber));
  }

  private renderCharacterSummary(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    const char = characters[0];
    const progress = profile.characterProgress[char.id] ?? { level: 1, xp: 0, totalXp: 0 };
    const need = characterXpToNext(progress.level);
    const y = this.mode === 'growth' ? 100 : 558;
    root.add(this.text(GAME_WIDTH / 2, y, `${char.name} Lv.${progress.level}　${progress.xp}/${need}`, 12, STORYBOOK_UI.warmAmber, true));
    root.add(this.text(GAME_WIDTH / 2, y + 16, '使うほどHPと攻撃が少しずつ伸びる', 10, STORYBOOK_UI.textMuted));
  }

  private renderSubCharacterStatus(root: Phaser.GameObjects.Container, profile: PlayerProfile, y: number): void {
    const main = characters[0];
    const bonds = loadBondProgress();
    const vm = buildStageSelectSubCharacterViewModel(profile, bonds, main.id);
    const unreadTalkId = vm.selectedSubCharacterId ? nextUnreadBondTalkId(main.id, vm.selectedSubCharacterId, bonds) : null;
    root.add(this.text(GAME_WIDTH / 2, y, `同行: ${vm.selectedLine}`, 11, STORYBOOK_UI.goldLight, true));
    root.add(this.text(GAME_WIDTH / 2, y + 17, vm.effectLine, 10, STORYBOOK_UI.textMuted));
    root.add(this.text(GAME_WIDTH / 2, y + 34, unreadTalkId ? `未読会話あり: ${unreadTalkId}` : vm.pairUltimateLine, 10, STORYBOOK_UI.textMuted));

    const none = this.button(62, y + 62, 54, 28, 'なし', () => {
      selectSubCharacter(undefined, main.id);
      this.render();
    }, !profile.selectedSubCharacterId);
    root.add(none);

    vm.options.slice(0, 4).forEach((option, index) => {
      const x = 124 + index * 66;
      const label = option.enabled ? option.name : '準備中';
      const btn = this.button(x, y + 62, 58, 28, label, () => {
        if (!option.enabled) return;
        selectSubCharacter(option.characterId, main.id);
        this.render();
      }, !option.enabled || option.selected);
      btn.setAlpha(option.enabled ? 1 : 0.45);
      root.add(btn);
    });
  }

  private renderTravelPrep(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    const y = 604;
    const char = characters[0];
    const progress = profile.characterProgress[char.id] ?? { level: 1, xp: 0, totalXp: 0 };
    const need = characterXpToNext(progress.level);
    const main = characters[0];
    const bonds = loadBondProgress();
    const vm = buildStageSelectSubCharacterViewModel(profile, bonds, main.id);
    const unreadTalkId = vm.selectedSubCharacterId ? nextUnreadBondTalkId(main.id, vm.selectedSubCharacterId, bonds) : null;

    const panel = this.add.graphics();
    drawPremiumPaperCard(panel, GAME_WIDTH / 2, y, 322, 112, {
      accent: STORYBOOK_UI.gold,
      paper: 0x221e35,
      selected: true,
      shadowAlpha: 0.22,
    });
    panel.fillStyle(STORYBOOK_UI.paperLight, 0.08).fillRoundedRect(48, y - 46, 294, 22, 9);
    panel.lineStyle(1, STORYBOOK_UI.goldLight, 0.2).strokeRoundedRect(48, y - 46, 294, 22, 9);
    panel.fillStyle(STORYBOOK_UI.goldLight, 0.12).fillCircle(67, y - 35, 8);
    panel.fillStyle(STORYBOOK_UI.goldLight, 0.48).fillCircle(67, y - 35, 3);
    root.add(panel);

    root.add(this.text(95, y - 36, '旅支度', 12, STORYBOOK_UI.lanternCore, true).setOrigin(0, 0.5));
    root.add(this.text(GAME_WIDTH - 54, y - 36, `Lv.${progress.level}`, 11, STORYBOOK_UI.goldLight, true));
    root.add(this.text(58, y - 12, `${char.name}  ${progress.xp}/${need}`, 12, STORYBOOK_UI.textLight, true).setOrigin(0, 0.5));
    root.add(this.text(58, y + 6, 'HPと攻撃が、夜を歩くほど少しずつ伸びる', 10, STORYBOOK_UI.textMuted).setOrigin(0, 0.5));

    const effectLine = this.compactSubEffectLine(vm.effectLine);
    const pairLine = unreadTalkId ? '未読会話あり' : this.compactPairUltimateLine(vm.pairUltimateLine);
    root.add(this.text(58, y + 26, `同行: ${vm.selectedLine}`, 10, STORYBOOK_UI.goldLight, true).setOrigin(0, 0.5));
    root.add(this.text(58, y + 42, `${effectLine} / ${pairLine}`, 9, STORYBOOK_UI.textMuted).setOrigin(0, 0.5));

    const none = this.companionChip(62, y + 70, 54, 'なし', !profile.selectedSubCharacterId, () => {
      selectSubCharacter(undefined, main.id);
      this.render();
    });
    root.add(none);

    vm.options.slice(0, 4).forEach((option, index) => {
      const x = 124 + index * 66;
      const label = option.enabled ? option.name : '準備中';
      const btn = this.companionChip(x, y + 70, 58, label, option.selected, () => {
        if (!option.enabled) return;
        selectSubCharacter(option.characterId, main.id);
        this.render();
      }, !option.enabled);
      root.add(btn);
    });
  }

  private companionChip(
    x: number,
    y: number,
    width: number,
    label: string,
    selected: boolean,
    onClick: () => void,
    disabled = false,
  ): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    drawPremiumPaperCard(fill, 0, 0, width, 30, {
      accent: selected ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.paperDark,
      paper: selected ? 0xeadbb8 : 0x28243b,
      selected,
      muted: disabled,
      shadowAlpha: 0.16,
    });
    fill.fillStyle(selected ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.paperLight, selected ? 0.34 : 0.12).fillCircle(-width / 2 + 12, 0, 5);
    const hit = this.add.rectangle(0, 0, width, 30, 0x000000, 0.001).setInteractive({ useHandCursor: !disabled });
    if (!disabled) {
      attachPressFeedback(this, hit, c, { x, y, width, height: 30, accent: selected ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.paperDark, depth: 1000 });
    }
    hit.on('pointerdown', () => {
      if (disabled) return;
      getAudioManager(this).playSe('ui_select', { volume: 0.34 });
      onClick();
    });
    c.add([fill, this.text(5, 0, label, 10, selected ? STORYBOOK_UI.textDark : STORYBOOK_UI.textLight, true), hit]);
    c.setAlpha(disabled ? 0.52 : 1);
    return c;
  }

  private compactSubEffectLine(value: string): string {
    if (value.includes('同行すると好感度')) return 'サブ効果なし';
    const [name] = value.split(':');
    return name.length > 14 ? `${name.slice(0, 13)}…` : name;
  }

  private compactPairUltimateLine(value: string): string {
    if (value.includes('未選択')) return 'ペア未設定';
    if (value.startsWith('解放済み')) return 'ペア必殺 解放済み';
    const match = value.match(/Lv\\d+で解放/);
    return match ? match[0] : value;
  }

  private renderUpgradeBlock(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    root.add(this.text(GAME_WIDTH / 2, 172, '持ち帰った灯りで、次の夜を少し楽にする', 11, STORYBOOK_UI.lanternCore));

    root.add(this.button(GAME_WIDTH - 90, 196, 106, 28, 'リセット', () => {
      this.confirmingReset = true;
      this.render();
    }, true));

    const anyAffordable = UPGRADE_ORDER.some((id) => {
      const level = profile.upgrades[id] ?? 0;
      return level < UPGRADE_DEFS[id].maxLevel && profile.currency >= upgradeCost(id, level);
    });
    if (!anyAffordable) {
      root.add(this.text(GAME_WIDTH / 2, 196, '黒曜片が足りない — 探索で集めよう', 11, 0xc7a87a));
    }

    UPGRADE_ORDER.forEach((id, index) => {
      const def = UPGRADE_DEFS[id];
      const level = profile.upgrades[id] ?? 0;
      const maxed = level >= def.maxLevel;
      const cost = upgradeCost(id, level);
      const y = 228 + index * 37;
      const canBuy = !maxed && profile.currency >= cost;
      const row = this.add.graphics();
      drawPremiumPaperCard(row, GAME_WIDTH / 2, y + 1, 306, 32, {
        accent: canBuy ? STORYBOOK_UI.goldLight : 0x6f6590,
        paper: canBuy ? 0x342a3c : 0x211e33,
        muted: !canBuy,
        selected: canBuy,
        shadowAlpha: 0.16,
      });
      row.setAlpha(canBuy ? 0.7 : 0.45);
      root.add(row);
      const nameColor = maxed ? 0xa6e3a1 : STORYBOOK_UI.textLight;
      root.add(this.text(58, y - 6, `${def.name} Lv.${level}/${def.maxLevel}`, 12, nameColor, true).setOrigin(0, 0.5));
      root.add(this.text(58, y + 10, def.description, 11, STORYBOOK_UI.textMuted).setOrigin(0, 0.5));
      const label = maxed ? '✓' : `${cost}`;
      const b = this.button(GAME_WIDTH - 74, y, 74, 28, label, () => {
        buyUpgrade(id);
        this.render();
      }, !canBuy);
      b.setAlpha(canBuy || maxed ? 1 : 0.45);
      root.add(b);
    });
  }

  private renderResetConfirm(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    const refund = upgradeRefundValue(profile);
    root.add(this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, STORYBOOK_UI.inkBlack, 0.72).setInteractive());
    const panel = this.add.graphics();
    drawLargeNotebookPage(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 300, 220, { accent: STORYBOOK_UI.warmAmber });
    root.add(panel);
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 66, '強化をリセット', 18, STORYBOOK_UI.textDark, true, true));
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 22, `黒曜片 ${refund} を全額返還します。\nいつでも振り直せます。`, 12, STORYBOOK_UI.paperDark));
    root.add(this.secondaryNav(GAME_WIDTH / 2 - 76, GAME_HEIGHT / 2 + 52, 120, 38, 'やめる', () => {
      this.confirmingReset = false;
      this.render();
    }));
    root.add(this.paperCta(GAME_WIDTH / 2 + 76, GAME_HEIGHT / 2 + 52, 120, 38, '返還する', () => {
      resetUpgrades();
      this.confirmingReset = false;
      this.render();
    }));
  }

  private recordButtonLabel(): string {
    const collection = loadCollectionProgress();
    const atlasView = loadCollectionAtlasViewState();
    const newCells = findNewCompletedCellIds(collection.nightBoard.completedCellIds, atlasView.seenCompletedCellIds).length;
    const achView = loadAchievementViewState();
    const profile = loadProfile();
    const newAch = findNewAchievementIds(Object.keys(profile.achievements), achView.seenAchievementIds).length;
    const total = newCells + newAch;
    return total > 0 ? `記録 ★${total}` : '記録';
  }

  private showOnboardingHint(root: Phaser.GameObjects.Container, message: string, y: number): void {
    const hint = this.text(GAME_WIDTH / 2, y, message, 11, STORYBOOK_UI.goldLight, true).setAlpha(0);
    hint.setStroke('#1a1638', 3);
    root.add(hint);
    this.tweens.add({ targets: hint, alpha: 1, duration: 500, delay: 300, ease: 'Quad.easeOut' });
    this.tweens.add({ targets: hint, alpha: 0, duration: 400, delay: 5500, ease: 'Quad.easeIn' });
  }

  private startRun(profile: PlayerProfile): void {
    const saved = selectRun(profile.selectedStage, profile.selectedDepth);
    const params = new URLSearchParams(window.location.search);
    params.set('play', '1');
    params.set('stage', String(saved.selectedStage));
    params.delete('scene');
    window.location.search = params.toString();
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

  private paperCta(x: number, y: number, width: number, height: number, label: string, onClick: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    if (this.textures.exists(UI_CTA_BUTTON)) {
      c.add(this.add.image(0, 0, UI_CTA_BUTTON).setDisplaySize(width + 24, height + 18));
      if (this.textures.exists(UI_WAX_SEAL)) {
        c.add(this.add.image(width / 2 - 26, -height / 2 + 17, UI_WAX_SEAL).setDisplaySize(26, 26).setAlpha(0.88));
      }
    } else {
      drawPrimaryPaperCta(fill, 0, 0, width, height, { accent: STORYBOOK_UI.warmAmber });
    }
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this, hit, c, { x, y, width, height, accent: STORYBOOK_UI.warmAmber, depth: 1000, strong: true, shake: true });
    hit.on('pointerdown', () => {
      getAudioManager(this).playSe('ui_confirm', { volume: 0.48 });
      onClick();
    });
    c.add([fill, this.text(0, 0, label, 17, STORYBOOK_UI.textDark, true, true), hit]);
    return c;
  }

  private secondaryNav(x: number, y: number, width: number, height: number, label: string, onClick: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    drawSecondaryPaperButton(fill, 0, 0, width, height, { accent: STORYBOOK_UI.paperDark });
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this, hit, c, { x, y, width, height, accent: STORYBOOK_UI.paperDark, depth: 1000 });
    hit.on('pointerdown', () => {
      getAudioManager(this).playSe('ui_cancel', { volume: 0.36 });
      onClick();
    });
    c.add([fill, this.text(0, 0, label, 12, STORYBOOK_UI.textLight, true), hit]);
    return c;
  }

  private navArrow(x: number, y: number, label: string, onClick: () => void, disabled: boolean): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    drawSecondaryPaperButton(fill, 0, 0, 32, 48, { accent: disabled ? 0x3a3650 : STORYBOOK_UI.paperDark });
    const hit = this.add.rectangle(0, 0, 32, 48, 0x000000, 0.001).setInteractive({ useHandCursor: !disabled });
    if (!disabled) {
      attachPressFeedback(this, hit, c, { x, y, width: 32, height: 48, accent: STORYBOOK_UI.paperDark, depth: 1000 });
    }
    hit.on('pointerdown', () => {
      if (disabled) return;
      getAudioManager(this).playSe('ui_select', { volume: 0.36 });
      onClick();
    });
    c.add([fill, this.text(0, 0, label, 14, disabled ? STORYBOOK_UI.textMuted : STORYBOOK_UI.textLight, true), hit]);
    c.setAlpha(disabled ? 0.5 : 1);
    return c;
  }

  private primaryButton(x: number, y: number, width: number, height: number, label: string, onClick: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    drawPremiumPaperCard(fill, 0, 0, width, height, { accent: STORYBOOK_UI.goldLight, paper: STORYBOOK_UI.paperLight, selected: true });
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this, hit, c, {
      x, y, width, height,
      accent: STORYBOOK_UI.goldLight,
      depth: 1000,
      strong: true,
      shake: true,
    });
    hit.on('pointerdown', () => {
      getAudioManager(this).playSe('ui_confirm', { volume: 0.48 });
      onClick();
    });
    c.add([fill, this.text(0, 0, label, 18, STORYBOOK_UI.textDark, true), hit]);
    return c;
  }

  private button(x: number, y: number, width: number, height: number, label: string, onClick: () => void, muted = false): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics().setName('fill');
    if (muted) drawPremiumPaperCard(fill, 0, 0, width, height, { accent: 0x6f6590, paper: 0x25213d, muted: true });
    else drawPremiumPaperCard(fill, 0, 0, width, height, { accent: STORYBOOK_UI.gold, paper: STORYBOOK_UI.paperLight });
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this, hit, c, {
      x,
      y,
      width,
      height,
      accent: muted ? 0x6f6590 : STORYBOOK_UI.goldLight,
      depth: 1000,
      strong: height >= 40,
      shake: !muted && height >= 46,
    });
    hit.on('pointerdown', () => {
      getAudioManager(this).playSe(muted ? 'ui_cancel' : 'ui_select', { volume: 0.36 });
      onClick();
    });
    c.add([fill, this.text(0, 0, label, 13, muted ? STORYBOOK_UI.textMuted : STORYBOOK_UI.textDark, true), hit]);
    return c;
  }
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
