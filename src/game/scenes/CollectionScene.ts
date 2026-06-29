import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { COLLECTION_LABELS, forgottenStreetNightBoard } from '../data/collectionProgress';
import type { CollectionProgressSaveData, NightBoardCell, NightBoardCellKind } from '../data/collectionProgress';
import { collectionSections } from '../data/collectionSections';
import type { CollectionSection, CollectionSectionId } from '../data/collectionSections';
import { launchCoreCharacterKnowledgeReplies } from '../data/characterKnowledgeReplies';
import { enemies } from '../data/enemies';
import { keeperRecords } from '../data/keeperRecords';
import type { KeeperRecord } from '../data/keeperRecords';
import { lostItemRecords } from '../data/lostItemRecords';
import type { LostItemRecord } from '../data/lostItemRecords';
import { collectionWordRecordLines } from '../data/collectionWordRecords';
import { loadCollectionProgress } from '../persistence/collection';
import {
  findNewCompletedCellIds,
  loadCollectionAtlasViewState,
  markCompletedCellsSeen,
} from '../persistence/collectionAtlasViewState';
import {
  findNewAchievementIds,
  loadAchievementViewState,
  markAchievementsSeen,
} from '../persistence/achievementViewState';
import { ACHIEVEMENT_DEFS } from '../data/achievements';
import { loadProfile } from '../persistence/profile';
import type { CharacterKnowledgeReply, KnowledgeLine } from '../types/knowledge';
import { nightBoardRewardLabel } from '../ui/collectionAtlasLabels';
import { attachCollectionAtlasAtmosphere } from '../ui/collectionAtlasSceneHooks';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI, drawFragment, drawStar, drawStorybookPanel } from '../ui/storybookUi';
import {
  drawInkDivider,
  drawInkVignette,
  drawLargeNotebookPage,
  drawPremiumPaperCard,
  drawPrimaryPaperCta,
  drawSecondaryPaperButton,
  drawStarMapBackdrop,
} from '../ui/premiumPaperUi';
import { attachPressFeedback } from '../ui/pressFeedback';
import { getAudioManager } from '../audio/AudioManager';

const GRAPHICS_TEXT_DARK = 0x2e2730;
const GRAPHICS_TEXT_LIGHT = 0xf4e8cf;
const UI_CTA_BUTTON = 'ui_paper_cta_button_v1';
const UI_SMALL_CARD = 'ui_paper_small_card_v1';

export class CollectionScene extends Phaser.Scene {
  private root: Phaser.GameObjects.Container | null = null;
  private detailText: Phaser.GameObjects.Text | null = null;
  private activeSection: CollectionSectionId = 'dawn_atlas';
  private selectedKeeperRecordId: string = 'keeper-yui';
  private selectedKnowledgeLineId: string = 'rare-jp-kanwa-kyudai';
  private selectedLostItemRecordId: string = 'lost-small-bag-tag';
  private achievementPage = 0;
  private achievementSessionNewIds: Set<string> | null = null;

  constructor() {
    super('CollectionScene');
  }

  create(): void {
    this.render();
  }

  private render(): void {
    this.root?.destroy(true);
    this.detailText = null;

    const progress = loadCollectionProgress();
    const completed = new Set(progress.nightBoard.completedCellIds);
    const viewState = loadCollectionAtlasViewState();
    const newCompletedIds = findNewCompletedCellIds(progress.nightBoard.completedCellIds, viewState.seenCompletedCellIds);
    const newlyCompleted = new Set(newCompletedIds);
    if (newCompletedIds.length > 0) markCompletedCellsSeen(newCompletedIds);
    const revealed = new Set(progress.nightBoard.revealedCellIds);
    const hinted = new Set(progress.nightBoard.hintedCellIds);
    const root = this.add.container(0, 0);
    this.root = root;

    root.add(this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, STORYBOOK_UI.deepNight, 1));
    const stars = this.add.graphics();
    drawStarMapBackdrop(stars, GAME_WIDTH, GAME_HEIGHT, { alpha: 0.08, density: 20 });
    root.add(stars);
    const vignette = this.add.graphics();
    drawInkVignette(vignette, GAME_WIDTH, GAME_HEIGHT, { alpha: 0.35 });
    root.add(vignette);
    this.addSoftAtlasGlow(root);
    this.addLedgerBinding(root, 152, 520);

    const active = this.activeCollectionSection();
    attachCollectionAtlasAtmosphere(this, root, active);

    const titleBg = this.add.graphics();
    drawLargeNotebookPage(titleBg, GAME_WIDTH / 2, 36, 260, 40, { accent: STORYBOOK_UI.paperDark, alpha: 0.95 });
    root.add(titleBg);
    root.add(this.text(GAME_WIDTH / 2, 36, COLLECTION_LABELS.book, 18, STORYBOOK_UI.textDark, true, true));
    const titleDiv = this.add.graphics();
    drawInkDivider(titleDiv, GAME_WIDTH / 2, 62, 180, { color: STORYBOOK_UI.paperDark, alpha: 0.2 });
    root.add(titleDiv);
    root.add(this.text(GAME_WIDTH / 2, 74, active.label, 13, active.accent, true));
    root.add(this.text(GAME_WIDTH / 2, 92, active.description, 10, STORYBOOK_UI.textMuted));
    this.renderSectionTabs(root);

    this.renderActiveSection(root, progress, completed, revealed, hinted, newlyCompleted);

    this.renderCollectionProgressFooter(root, progress, completed.size);
    root.add(this.secondaryNavButton(GAME_WIDTH / 2 - 86, GAME_HEIGHT - 44, 148, 40, 'TOPへ', () => this.scene.start('TopScene')));
    root.add(this.paperCtaButton(GAME_WIDTH / 2 + 86, GAME_HEIGHT - 44, 148, 40, '夜へ', () => this.scene.start('StageSelectScene', { mode: 'stage' })));
  }

  private activeCollectionSection(): CollectionSection {
    return collectionSections.find((section) => section.id === this.activeSection) ?? collectionSections[0];
  }

  private renderSectionTabs(root: Phaser.GameObjects.Container): void {
    const margin = 10;
    const gap = 3;
    const available = GAME_WIDTH - margin * 2;
    const tabWidth = Math.floor((available - (collectionSections.length - 1) * gap) / collectionSections.length);
    const tabHeight = 36;
    const totalWidth = collectionSections.length * tabWidth + (collectionSections.length - 1) * gap;
    const startX = GAME_WIDTH / 2 - totalWidth / 2 + tabWidth / 2;

    collectionSections.forEach((section, index) => {
      const x = startX + index * (tabWidth + gap);
      root.add(this.sectionTab(x, 128, tabWidth, tabHeight, section));
    });
  }

  private sectionTab(x: number, y: number, width: number, height: number, section: CollectionSection): Phaser.GameObjects.Container {
    const isActive = section.id === this.activeSection;
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    const tabTop = -height / 2 + (isActive ? -4 : 2);
    const tabBottom = height / 2 + (isActive ? 4 : 0);
    const chip = 5;
    const points = [
      new Phaser.Math.Vector2(-width / 2 + chip, tabTop),
      new Phaser.Math.Vector2(width / 2 - chip, tabTop + 1),
      new Phaser.Math.Vector2(width / 2, tabTop + chip + 2),
      new Phaser.Math.Vector2(width / 2 - 1, tabBottom),
      new Phaser.Math.Vector2(-width / 2 + 1, tabBottom),
      new Phaser.Math.Vector2(-width / 2, tabTop + chip + 2),
    ];
    if (isActive) {
      fill.fillStyle(STORYBOOK_UI.inkBlack, 0.34).fillPoints(points.map((p) => new Phaser.Math.Vector2(p.x + 2, p.y + 4)), true);
      fill.fillStyle(STORYBOOK_UI.paperBeige, 0.98).fillPoints(points, true);
      fill.fillStyle(section.accent, 0.24).fillRect(-width / 2 + 7, tabTop + 6, width - 14, 5);
      fill.lineStyle(2, STORYBOOK_UI.paperEdge, 0.82).strokePoints(points, true);
      fill.lineStyle(1, section.accent, 0.5).strokeRect(-width / 2 + 6, tabTop + 8, width - 12, tabBottom - tabTop - 14);
    } else {
      fill.fillStyle(STORYBOOK_UI.inkBlack, 0.28).fillPoints(points.map((p) => new Phaser.Math.Vector2(p.x + 1, p.y + 3)), true);
      fill.fillStyle(0x262139, 0.94).fillPoints(points, true);
      fill.fillStyle(section.accent, 0.13).fillRect(-width / 2 + 7, tabTop + 6, width - 14, 4);
      fill.lineStyle(1, STORYBOOK_UI.paperEdge, 0.42).strokePoints(points, true);
    }
    const icon = this.add.graphics();
    this.drawSectionIcon(icon, 0, -6, section.id, isActive ? GRAPHICS_TEXT_DARK : section.accent, isActive ? 0.82 : 0.58);
    const label = this.text(0, 9, section.shortLabel, 9, isActive ? STORYBOOK_UI.textDark : STORYBOOK_UI.textMuted, true);
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => {
      if (this.activeSection !== section.id) this.achievementSessionNewIds = null;
      this.activeSection = section.id;
      getAudioManager(this).playSe('ui_select', { volume: 0.3 });
      this.render();
    });
    c.add([fill, icon, label, hit]);
    return c;
  }

  private renderActiveSection(
    root: Phaser.GameObjects.Container,
    progress: CollectionProgressSaveData,
    completed: Set<string>,
    revealed: Set<string>,
    hinted: Set<string>,
    newlyCompleted: Set<string>,
  ): void {
    switch (this.activeSection) {
      case 'dawn_atlas':
        this.renderDawnAtlas(root, completed, revealed, hinted, newlyCompleted, progress);
        return;
      case 'bestiary':
        this.renderBestiaryPage(root, progress.seenEnemyIds, progress.defeatedEnemyCounts);
        return;
      case 'keeper_records':
        this.renderKeeperRecordsPage(root);
        return;
      case 'word_records':
        this.renderWordRecordsPage(root);
        return;
      case 'lost_item_cards':
        this.renderLostItemCardsPage(root);
        return;
      case 'achievements':
        this.renderAchievementsPage(root);
        return;
    }
  }

  private renderDawnAtlas(
    root: Phaser.GameObjects.Container,
    completed: Set<string>,
    revealed: Set<string>,
    hinted: Set<string>,
    newlyCompleted: Set<string>,
    progress: CollectionProgressSaveData,
  ): void {
    void revealed;
    void hinted;
    void newlyCompleted;
    const ledger = this.add.graphics();
    drawLargeNotebookPage(ledger, GAME_WIDTH / 2, 378, 348, 462, { accent: STORYBOOK_UI.goldLight, alpha: 0.94 });
    ledger.fillStyle(STORYBOOK_UI.paperDark, 0.08).fillRect(54, 168, 282, 1);
    ledger.fillStyle(STORYBOOK_UI.paperDark, 0.08).fillRect(54, 586, 282, 1);
    ledger.fillStyle(STORYBOOK_UI.paperEdge, 0.08).fillRect(72, 184, 1, 386);
    root.add(ledger);

    const compass = this.add.graphics();
    this.drawCompassMark(compass, 74, 202, 24, STORYBOOK_UI.paperDark, 0.35);
    this.drawWaxStampMark(compass, 316, 552, STORYBOOK_UI.dustyRose, 0.22);
    root.add(compass);

    root.add(this.text(GAME_WIDTH / 2, 178, '夜明け星図', 17, STORYBOOK_UI.textDark, true, true));
    root.add(this.text(GAME_WIDTH / 2, 202, '夜に残った記録を、頁ごとの絵札として綴じる。', 10, STORYBOOK_UI.paperDark));

    const profile = loadProfile();
    const achievedCount = ACHIEVEMENT_DEFS.filter((d) => profile.achievements[d.id]).length;
    const cards: Array<{ section: CollectionSection; count: number; total: number; sub: string }> = [
      { section: collectionSections[0], count: completed.size, total: forgottenStreetNightBoard.cells.length, sub: '記憶の地図' },
      { section: collectionSections[1], count: progress.seenEnemyIds.length, total: enemies.length, sub: 'ほどいた影' },
      { section: collectionSections[2], count: lostItemRecords.length, total: lostItemRecords.length, sub: '拾った持ち物' },
      { section: collectionSections[3], count: keeperRecords.length, total: keeperRecords.length, sub: '灯し手' },
      { section: collectionSections[4], count: collectionWordRecordLines.length, total: collectionWordRecordLines.length, sub: '夜路の言葉' },
      { section: collectionSections[5], count: achievedCount, total: ACHIEVEMENT_DEFS.length, sub: '歩いた証' },
    ];

    cards.forEach((card, index) => {
      const x = GAME_WIDTH / 2 - 78 + (index % 2) * 156;
      const y = 268 + Math.floor(index / 2) * 118;
      root.add(this.ledgerOverviewCard(x, y, card.section, card.count, card.total, card.sub));
    });

    const note = this.add.graphics();
    drawLargeNotebookPage(note, GAME_WIDTH / 2, 612, 318, 58, { accent: STORYBOOK_UI.paperDark, alpha: 0.9 });
    root.add(note);
    root.add(this.text(GAME_WIDTH / 2, 604, 'タブか絵札を押すと、詳しい頁へ移動します。', 11, STORYBOOK_UI.paperDark, true));
    root.add(this.text(GAME_WIDTH / 2, 626, '未解放の記録も、夜を歩くほど輪郭が浮かびます。', 9, STORYBOOK_UI.textSoft));
  }

  private ledgerOverviewCard(
    x: number,
    y: number,
    section: CollectionSection,
    count: number,
    total: number,
    sub: string,
  ): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const w = 140;
    const h = 98;
    const ratio = total > 0 ? Math.min(1, count / total) : 0;
    const fill = this.add.graphics();
    if (this.textures.exists(UI_SMALL_CARD)) {
      c.add(this.add.image(0, 0, UI_SMALL_CARD).setDisplaySize(w + 18, h + 18).setAlpha(0.96));
      fill.lineStyle(section.id === this.activeSection ? 3 : 1, section.accent, section.id === this.activeSection ? 0.64 : 0.26);
      fill.strokeRoundedRect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 8);
    } else {
      drawPremiumPaperCard(fill, 0, 0, w, h, {
        accent: section.accent,
        paper: STORYBOOK_UI.paperLight,
        selected: section.id === this.activeSection,
        shadowAlpha: 0.36,
      });
    }
    fill.fillStyle(section.accent, 0.18).fillRect(-w / 2 + 10, -h / 2 + 8, 28, h - 18);
    this.drawPaperClip(fill, w / 2 - 22, -h / 2 + 14, STORYBOOK_UI.paperEdge, 0.58);
    fill.fillStyle(STORYBOOK_UI.paperDark, 0.18).fillRect(-w / 2 + 18, h / 2 - 20, w - 36, 5);
    fill.fillStyle(section.accent, 0.76).fillRect(-w / 2 + 18, h / 2 - 20, Math.max(4, Math.round((w - 36) * ratio)), 5);
    fill.lineStyle(1, STORYBOOK_UI.paperDark, 0.2).strokeRect(-w / 2 + 18, h / 2 - 20, w - 36, 5);

    const icon = this.add.graphics();
    this.drawSectionIcon(icon, -45, -13, section.id, section.accent, 0.95);
    const title = this.add.text(-17, -31, section.shortLabel, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '17px',
      color: colorString(STORYBOOK_UI.textDark),
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0, 0.5);
    const subtitle = this.add.text(-17, -10, sub, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '9px',
      color: colorString(STORYBOOK_UI.paperDark),
      resolution: 2,
    }).setOrigin(0, 0.5);
    const progress = this.add.text(-w / 2 + 18, 22, `${count}/${total}`, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '15px',
      color: colorString(section.accent),
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0, 0.5);
    const hit = this.add.rectangle(0, 0, w, h, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => {
      this.activeSection = section.id;
      getAudioManager(this).playSe('ui_select', { volume: 0.3 });
      this.render();
    });
    c.add([fill, icon, title, subtitle, progress, hit]);
    return c;
  }

  private renderLostItemCardsPage(root: Phaser.GameObjects.Container): void {
    const card = this.add.graphics();
    drawLargeNotebookPage(card, GAME_WIDTH / 2, 382, 336, 424, { accent: STORYBOOK_UI.warmAmber, alpha: 0.92 });
    root.add(card);
    root.add(this.text(GAME_WIDTH / 2, 184, '忘れ物絵札', 18, STORYBOOK_UI.textDark, true, true));
    root.add(this.text(GAME_WIDTH / 2, 208, '拾われる前から、夜に残っていた小さな持ち物たち。', 10, STORYBOOK_UI.paperDark));

    lostItemRecords.forEach((record, index) => {
      const x = GAME_WIDTH / 2 - 80 + (index % 2) * 160;
      const y = 266 + Math.floor(index / 2) * 58;
      root.add(this.lostItemMiniCard(x, y, record));
    });

    const selected = lostItemRecords.find((record) => record.id === this.selectedLostItemRecordId) ?? lostItemRecords[0];
    root.add(this.lostItemDetailPanel(GAME_WIDTH / 2, 512, selected));
  }

  private lostItemMiniCard(x: number, y: number, record: LostItemRecord): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const selected = record.id === this.selectedLostItemRecordId;
    const fill = this.add.graphics();
    drawPremiumPaperCard(fill, 0, 0, 136, 48, { accent: record.accent, selected, muted: !selected });
    this.drawPaperClip(fill, 46, -19, selected ? STORYBOOK_UI.goldLight : STORYBOOK_UI.paperEdge, selected ? 0.8 : 0.48);

    const motif = this.add.graphics();
    this.drawLostItemMotif(motif, -48, -2, record, selected);

    const label = this.add.text(-18, -15, shortLostItemLabel(record.nameJa), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: selected ? colorString(STORYBOOK_UI.textDark) : colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
      wordWrap: { width: 70 },
      align: 'center',
    }).setOrigin(0.5, 0);

    const type = this.add.text(-18, 9, lostItemTypeLabel(record.itemType), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '8px',
      color: selected ? colorString(STORYBOOK_UI.textDark) : colorString(STORYBOOK_UI.textMuted),
      resolution: 2,
      align: 'center',
    }).setOrigin(0.5, 0);

    const hit = this.add.rectangle(0, 0, 136, 48, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => {
      this.selectedLostItemRecordId = record.id;
      this.render();
    });

    c.add([fill, motif, label, type, hit]);
    return c;
  }

  private lostItemDetailPanel(x: number, y: number, record: LostItemRecord): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    drawStorybookPanel(fill, 0, 0, 318, 190, STORYBOOK_UI.nightPanel, record.accent, 0.92);

    const name = this.add.text(0, -82, `${record.nameJa}\n${record.nameEn}`, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '16px',
      color: colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
      align: 'center',
      lineSpacing: 2,
      wordWrap: { width: 286 },
    }).setOrigin(0.5, 0);

    const relatedKeeper = keeperRecords.find((keeper) => keeper.id === record.relatedKeeperId);
    const owner = this.add.text(0, -34, `気配：${record.aura}${relatedKeeper ? `　関連：${relatedKeeper.nameJa}` : ''}`, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '11px',
      color: colorString(record.accent),
      fontStyle: 'bold',
      resolution: 2,
      align: 'center',
      wordWrap: { width: 286 },
      lineSpacing: 4,
    }).setOrigin(0.5, 0);

    const flavor = this.add.text(0, -8, record.shortFlavor, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: colorString(STORYBOOK_UI.textMuted),
      resolution: 2,
      align: 'center',
      wordWrap: { width: 286 },
    }).setOrigin(0.5, 0);

    const memory = this.add.text(0, 24, record.memoryText, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: colorString(STORYBOOK_UI.textLight),
      resolution: 2,
      align: 'center',
      wordWrap: { width: 286 },
      lineSpacing: 5,
    }).setOrigin(0.5, 0);

    const hint = this.add.text(0, 80, record.unlockHint, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: colorString(STORYBOOK_UI.textMuted),
      resolution: 2,
      align: 'center',
      wordWrap: { width: 282 },
    }).setOrigin(0.5, 0);

    c.add([fill, name, owner, flavor, memory, hint]);
    return c;
  }

  private renderKeeperRecordsPage(root: Phaser.GameObjects.Container): void {
    const card = this.add.graphics();
    drawLargeNotebookPage(card, GAME_WIDTH / 2, 382, 336, 424, { accent: STORYBOOK_UI.mutedTeal, alpha: 0.92 });
    root.add(card);
    root.add(this.text(GAME_WIDTH / 2, 184, '灯し手の記録', 18, STORYBOOK_UI.textDark, true, true));
    root.add(this.text(GAME_WIDTH / 2, 208, '灯名・黒曜・朝明・欠けた心を、絵札として残す頁。', 10, STORYBOOK_UI.paperDark));

    keeperRecords.forEach((record, index) => {
      const x = GAME_WIDTH / 2 - 132 + index * 66;
      root.add(this.keeperMiniCard(x, 270, record));
    });

    const selected = keeperRecords.find((record) => record.id === this.selectedKeeperRecordId) ?? keeperRecords[0];
    root.add(this.keeperDetailPanel(GAME_WIDTH / 2, 440, selected));
  }

  private keeperMiniCard(x: number, y: number, record: KeeperRecord): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const selected = record.id === this.selectedKeeperRecordId;
    const fill = this.add.graphics();
    drawPremiumPaperCard(fill, 0, 0, 58, 70, { accent: record.accent, selected, muted: !selected });
    this.drawPaperClip(fill, 18, -31, selected ? STORYBOOK_UI.goldLight : STORYBOOK_UI.paperEdge, selected ? 0.75 : 0.42);

    const icon = this.add.graphics();
    icon.lineStyle(2, selected ? GRAPHICS_TEXT_DARK : record.accent, 0.86);
    icon.strokeCircle(0, -16, 12);
    icon.fillStyle(selected ? GRAPHICS_TEXT_DARK : record.accent, 0.45);
    icon.fillCircle(0, -16, 6);
    icon.fillStyle(selected ? STORYBOOK_UI.goldLight : GRAPHICS_TEXT_LIGHT, 0.88);
    icon.fillCircle(0, -16, 3);

    const name = this.add.text(0, 10, record.nameJa, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '12px',
      color: selected ? colorString(STORYBOOK_UI.textDark) : colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
      align: 'center',
    }).setOrigin(0.5, 0);

    const hit = this.add.rectangle(0, 0, 58, 70, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => {
      this.selectedKeeperRecordId = record.id;
      this.render();
    });

    c.add([fill, icon, name, hit]);
    return c;
  }

  private keeperDetailPanel(x: number, y: number, record: KeeperRecord): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    drawStorybookPanel(fill, 0, 0, 318, 210, STORYBOOK_UI.nightPanel, record.accent, 0.92);

    const name = this.add.text(0, -88, `${record.nameJa} / ${record.nameEn}`, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '18px',
      color: colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
      align: 'center',
    }).setOrigin(0.5, 0);

    const role = this.add.text(0, -60, record.roleTitle, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: colorString(record.accent),
      fontStyle: 'bold',
      resolution: 2,
      align: 'center',
      wordWrap: { width: 280 },
    }).setOrigin(0.5, 0);

    const forms = this.add.text(0, -30, `灯：${record.lightMotif}　紋章：${record.merchandiseEmblem}\n${record.blackFormName}\n${record.dawnName}`, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: colorString(STORYBOOK_UI.textMuted),
      resolution: 2,
      lineSpacing: 3,
      align: 'center',
      wordWrap: { width: 286 },
    }).setOrigin(0.5, 0);

    const poem = this.add.text(0, 34, record.shortPoem, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
      lineSpacing: 5,
      align: 'center',
      wordWrap: { width: 286 },
    }).setOrigin(0.5, 0);

    const hint = this.add.text(0, 92, record.unlockHint, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: colorString(STORYBOOK_UI.textMuted),
      resolution: 2,
      align: 'center',
      wordWrap: { width: 282 },
    }).setOrigin(0.5, 0);

    c.add([fill, name, role, forms, poem, hint]);
    return c;
  }

  private renderWordRecordsPage(root: Phaser.GameObjects.Container): void {
    const card = this.add.graphics();
    drawLargeNotebookPage(card, GAME_WIDTH / 2, 382, 336, 424, { accent: STORYBOOK_UI.dawnPeach, alpha: 0.92 });
    root.add(card);
    root.add(this.text(GAME_WIDTH / 2, 184, '言葉の記録', 18, STORYBOOK_UI.textDark, true, true));
    root.add(this.text(GAME_WIDTH / 2, 208, 'ロードで出会った言葉と、灯し手たちの返事。', 10, STORYBOOK_UI.paperDark));

    const visibleLines = collectionWordRecordLines.slice(0, 6);
    if (visibleLines.length === 0) {
      root.add(this.text(GAME_WIDTH / 2, 382, 'いま読める紙片はありません。\n言葉の確認が済むまで、静かに綴じてあります。', 13, STORYBOOK_UI.textMuted));
      return;
    }
    visibleLines.forEach((line, index) => {
      const x = GAME_WIDTH / 2 - 80 + (index % 2) * 160;
      const y = 262 + Math.floor(index / 2) * 50;
      root.add(this.wordMiniCard(x, y, line));
    });

    const selected = collectionWordRecordLines.find((line) => line.id === this.selectedKnowledgeLineId) ?? collectionWordRecordLines[0];
    const reply = launchCoreCharacterKnowledgeReplies.find((candidate) => candidate.knowledgeLineId === selected.id);
    root.add(this.wordDetailPanel(GAME_WIDTH / 2, 500, selected, reply));
  }

  private wordMiniCard(x: number, y: number, line: KnowledgeLine): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const selected = line.id === this.selectedKnowledgeLineId;
    const accent = knowledgeAccent(line.category);
    const fill = this.add.graphics();
    drawPremiumPaperCard(fill, 0, 0, 136, 42, { accent, selected, muted: !selected });
    this.drawPaperClip(fill, 46, -16, selected ? STORYBOOK_UI.goldLight : STORYBOOK_UI.paperEdge, selected ? 0.72 : 0.42);
    const label = this.add.text(0, -13, shortKnowledgeLabel(line.originalText), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: selected ? colorString(STORYBOOK_UI.textDark) : colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
      align: 'center',
      wordWrap: { width: 104 },
    }).setOrigin(0.5, 0);
    const source = this.add.text(0, 9, knowledgeCategoryLabel(line.category), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '8px',
      color: selected ? colorString(STORYBOOK_UI.textDark) : colorString(STORYBOOK_UI.textMuted),
      resolution: 2,
      align: 'center',
    }).setOrigin(0.5, 0);
    const hit = this.add.rectangle(0, 0, 136, 42, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => {
      this.selectedKnowledgeLineId = line.id;
      this.render();
    });
    c.add([fill, label, source, hit]);
    return c;
  }

  private wordDetailPanel(
    x: number,
    y: number,
    line: KnowledgeLine,
    reply: CharacterKnowledgeReply | undefined,
  ): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const accent = knowledgeAccent(line.category);
    const fill = this.add.graphics();
    drawStorybookPanel(fill, 0, 0, 318, 218, STORYBOOK_UI.nightPanel, accent, 0.92);

    const original = this.add.text(0, -96, line.originalText, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: '16px',
      color: colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
      align: 'center',
      wordWrap: { width: 286 },
      lineSpacing: 3,
    }).setOrigin(0.5, 0);

    const source = this.add.text(0, original.y + original.height + 10, `— ${line.sourceLabel}`, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '9px',
      color: colorString(STORYBOOK_UI.textMuted),
      resolution: 2,
      align: 'center',
      wordWrap: { width: 280 },
    }).setOrigin(0.5, 0);

    const meaning = this.add.text(0, source.y + source.height + 12, line.meaningJa, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: colorString(STORYBOOK_UI.textLight),
      resolution: 2,
      align: 'center',
      wordWrap: { width: 284 },
      lineSpacing: 4,
    }).setOrigin(0.5, 0);

    const replyText = this.add.text(0, meaning.y + meaning.height + 14, reply ? `${characterShortLabel(reply.characterId)}「${reply.replyJa}」` : 'まだ返事は記されていません。', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '11px',
      color: colorString(0xffe9b8),
      fontStyle: 'bold',
      resolution: 2,
      align: 'center',
      wordWrap: { width: 284 },
      lineSpacing: 4,
    }).setOrigin(0.5, 0);

    c.add([fill, original, source, meaning, replyText]);
    return c;
  }

  private drawLostItemMotif(g: Phaser.GameObjects.Graphics, x: number, y: number, record: LostItemRecord, selected: boolean): void {
    const fill = selected ? GRAPHICS_TEXT_DARK : record.accent;
    const edge = selected ? STORYBOOK_UI.goldLight : GRAPHICS_TEXT_LIGHT;
    switch (record.itemType) {
      case 'bag':
        g.fillStyle(fill, 0.62);
        g.fillRect(x - 10, y - 6, 20, 16);
        g.lineStyle(1, edge, 0.8);
        g.strokeRect(x - 10, y - 6, 20, 16);
        g.strokeRect(x - 5, y - 11, 10, 5);
        break;
      case 'paper':
        g.fillStyle(fill, 0.58);
        g.fillTriangle(x - 11, y - 10, x + 12, y - 4, x - 2, y + 12);
        g.lineStyle(1, edge, 0.72);
        g.lineBetween(x - 7, y - 2, x + 4, y + 1);
        g.lineBetween(x - 4, y + 4, x + 2, y + 6);
        break;
      case 'lamp':
        g.lineStyle(1, edge, 0.85);
        g.strokeCircle(x, y, 10);
        g.fillStyle(fill, 0.68);
        g.fillCircle(x, y, 5);
        g.fillStyle(0xffffff, 0.55);
        g.fillRect(x - 1, y - 8, 2, 5);
        break;
      case 'thread':
        g.lineStyle(2, fill, 0.85);
        g.strokeCircle(x - 5, y, 7);
        g.strokeCircle(x + 5, y, 7);
        g.fillStyle(edge, 0.65);
        g.fillCircle(x, y, 3);
        break;
      case 'coin':
        g.fillStyle(fill, 0.72);
        g.fillCircle(x, y, 11);
        g.lineStyle(1, edge, 0.85);
        g.strokeCircle(x, y, 11);
        g.strokeCircle(x, y, 6);
        break;
      case 'key':
        g.lineStyle(2, fill, 0.88);
        g.strokeCircle(x - 6, y, 6);
        g.lineBetween(x, y, x + 13, y);
        g.lineBetween(x + 8, y, x + 8, y + 5);
        g.lineBetween(x + 12, y, x + 12, y + 4);
        break;
    }
  }

  private renderAchievementsPage(root: Phaser.GameObjects.Container): void {
    const profile = loadProfile();
    const achieved = profile.achievements;
    const rewarded = profile.rewardedAchievements;
    const achievedIds = Object.keys(achieved);

    if (!this.achievementSessionNewIds) {
      const viewState = loadAchievementViewState();
      this.achievementSessionNewIds = new Set(findNewAchievementIds(achievedIds, viewState.seenAchievementIds));
      if (this.achievementSessionNewIds.size > 0) markAchievementsSeen(achievedIds);
    }
    const newIds = this.achievementSessionNewIds;

    const achievedCount = ACHIEVEMENT_DEFS.filter((d) => achieved[d.id]).length;
    const rewardedCount = ACHIEVEMENT_DEFS.filter((d) => rewarded[d.id]).length;

    const card = this.add.graphics();
    drawLargeNotebookPage(card, GAME_WIDTH / 2, 400, 336, 470, { accent: STORYBOOK_UI.warmAmber, alpha: 0.92 });
    root.add(card);

    root.add(this.text(GAME_WIDTH / 2, 172, 'しるしの記録', 18, STORYBOOK_UI.textDark, true, true));
    const summaryParts = [`達成 ${achievedCount}/${ACHIEVEMENT_DEFS.length}`];
    if (newIds.size > 0) summaryParts.push(`新着 ${newIds.size}`);
    summaryParts.push(`報酬済 ${rewardedCount}`);
    root.add(this.text(GAME_WIDTH / 2, 196, summaryParts.join('　'), 11, STORYBOOK_UI.goldLight, true));

    const PAGE_SIZE = 4;
    const totalPages = Math.ceil(ACHIEVEMENT_DEFS.length / PAGE_SIZE);
    const page = Math.min(this.achievementPage, totalPages - 1);
    const slice = ACHIEVEMENT_DEFS.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    slice.forEach((def, index) => {
      const y = 232 + index * 100;
      const isAchieved = !!achieved[def.id];
      const isRewarded = !!rewarded[def.id];
      const isNew = newIds.has(def.id);
      const isHidden = !!def.hidden && !isAchieved;
      root.add(this.achievementCard(GAME_WIDTH / 2, y, def, isAchieved, isRewarded, isNew, isHidden));
    });

    if (totalPages > 1) {
      const pageLabel = `${page + 1}/${totalPages}`;
      root.add(this.text(GAME_WIDTH / 2, 642, pageLabel, 12, STORYBOOK_UI.textMuted, true));
      if (page > 0) {
        root.add(this.button(GAME_WIDTH / 2 - 80, 642, 48, 28, '◀', () => {
          this.achievementPage = page - 1;
          this.render();
        }, true));
      }
      if (page < totalPages - 1) {
        root.add(this.button(GAME_WIDTH / 2 + 80, 642, 48, 28, '▶', () => {
          this.achievementPage = page + 1;
          this.render();
        }, true));
      }
    }
  }

  private achievementCard(
    x: number, y: number,
    def: (typeof ACHIEVEMENT_DEFS)[number],
    achieved: boolean, rewarded: boolean, isNew: boolean, hidden: boolean,
  ): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const w = 310;
    const h = 82;
    const bg = this.add.graphics();
    drawPremiumPaperCard(bg, 0, 0, w, h, {
      accent: achieved ? STORYBOOK_UI.goldLight : 0x6f6590,
      selected: achieved,
      muted: !achieved,
    });
    this.drawPaperClip(bg, w / 2 - 34, -h / 2 + 8, achieved ? STORYBOOK_UI.goldLight : STORYBOOK_UI.paperEdge, achieved ? 0.7 : 0.36);
    c.add(bg);

    const mark = achieved ? '◆' : '◇';
    const titleText = hidden ? `${mark} ？？？` : `${mark} ${def.title}`;
    const titleColor = achieved ? STORYBOOK_UI.goldLight : STORYBOOK_UI.textMuted;
    c.add(this.text(-w / 2 + 18, -26, titleText, 13, titleColor, true).setOrigin(0, 0.5));

    const descText = hidden ? '条件はまだ見えない' : def.description;
    c.add(this.text(-w / 2 + 18, -4, descText, 11, STORYBOOK_UI.textMuted).setOrigin(0, 0.5));

    const rewardText = hidden
      ? '報酬 +??'
      : rewarded
        ? `報酬 +${def.reward} 受取済`
        : achieved
          ? `報酬 +${def.reward}`
          : `報酬 +${def.reward}`;
    const rewardColor = rewarded ? 0xa6e3a1 : achieved ? STORYBOOK_UI.goldLight : STORYBOOK_UI.textMuted;
    c.add(this.text(-w / 2 + 18, 18, rewardText, 10, rewardColor).setOrigin(0, 0.5));

    const categoryLabel = achievementCategoryLabel(def.category);
    c.add(this.text(w / 2 - 18, 18, categoryLabel, 9, STORYBOOK_UI.textMuted).setOrigin(1, 0.5));

    if (isNew) {
      const badge = this.add.circle(w / 2 - 14, -28, 5, 0xf5d58a, 0.95);
      const badgeTween = this.tweens.add({
        targets: badge,
        alpha: { from: 0.6, to: 1 },
        scale: { from: 0.9, to: 1.15 },
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      c.once('destroy', () => badgeTween.remove());
      c.add(badge);
      c.add(this.text(w / 2 - 14, -28, 'NEW', 7, STORYBOOK_UI.textDark, true));
    }

    return c;
  }

  private renderCollectionProgressFooter(
    root: Phaser.GameObjects.Container,
    progress: CollectionProgressSaveData,
    completedCount: number,
  ): void {
    const total = forgottenStreetNightBoard.cells.length;
    const ratio = total > 0 ? completedCount / total : 0;
    const panel = this.add.graphics();
    drawLargeNotebookPage(panel, GAME_WIDTH / 2, 708, 326, 56, { accent: STORYBOOK_UI.warmAmber, alpha: 0.9 });
    panel.fillStyle(STORYBOOK_UI.paperDark, 0.22).fillRect(92, 710, 206, 7);
    panel.fillStyle(STORYBOOK_UI.mutedTeal, 0.82).fillRect(92, 710, Math.round(206 * ratio), 7);
    panel.lineStyle(1, STORYBOOK_UI.paperDark, 0.32).strokeRect(92, 710, 206, 7);
    root.add(panel);

    root.add(this.text(GAME_WIDTH / 2, 696, `星図 ${completedCount}/${total}`, 11, STORYBOOK_UI.textDark, true));
    root.add(this.text(
      GAME_WIDTH / 2,
      726,
      `影 ${progress.seenEnemyIds.length}種　絵札 ${lostItemRecords.length}枚　言葉 ${collectionWordRecordLines.length}`,
      9,
      STORYBOOK_UI.textSoft,
      true,
    ));
  }

  private drawPaperClip(g: Phaser.GameObjects.Graphics, x: number, y: number, color: number, alpha = 0.55): void {
    g.lineStyle(2, color, alpha);
    g.lineBetween(x - 5, y + 10, x - 5, y - 10);
    g.lineBetween(x - 5, y - 10, x + 7, y - 10);
    g.lineBetween(x + 7, y - 10, x + 7, y + 13);
    g.lineBetween(x + 7, y + 13, x - 1, y + 13);
    g.lineBetween(x - 1, y + 13, x - 1, y - 6);
    g.lineBetween(x - 1, y - 6, x + 4, y - 6);
    g.lineBetween(x + 4, y - 6, x + 4, y + 9);
  }

  private addSoftAtlasGlow(root: Phaser.GameObjects.Container): void {
    const glow = this.add.graphics();
    glow.fillStyle(0xf4d69a, 0.04);
    glow.fillCircle(GAME_WIDTH / 2, 240, 180);
    glow.fillStyle(0x8d76c9, 0.035);
    glow.fillCircle(GAME_WIDTH / 2 + 40, 380, 150);
    root.add(glow);
  }

  private addLedgerBinding(root: Phaser.GameObjects.Container, top: number, bottom: number): void {
    const g = this.add.graphics();
    g.fillStyle(0x060817, 0.52).fillRect(18, top - 24, 22, bottom - top + 48);
    g.lineStyle(1, STORYBOOK_UI.gold, 0.26);
    g.lineBetween(38, top - 20, 38, bottom + 20);
    for (let y = top; y <= bottom; y += 78) {
      g.lineStyle(5, 0x8c6b37, 0.52);
      g.beginPath();
      g.arc(36, y, 18, Math.PI * 0.58, Math.PI * 1.42);
      g.strokePath();
      g.lineStyle(2, STORYBOOK_UI.goldLight, 0.42);
      g.beginPath();
      g.arc(36, y, 14, Math.PI * 0.58, Math.PI * 1.42);
      g.strokePath();
    }
    root.add(g);
  }

  private renderBoard(
    root: Phaser.GameObjects.Container,
    completed: Set<string>,
    revealed: Set<string>,
    hinted: Set<string>,
    newlyCompleted: Set<string>,
  ): void {
    const cellSize = 50;
    const gap = 6;
    const startX = GAME_WIDTH / 2 - ((cellSize + gap) * forgottenStreetNightBoard.width - gap) / 2 + cellSize / 2;
    const startY = 248;

    const lineLayer = this.add.graphics();
    lineLayer.lineStyle(2, STORYBOOK_UI.gold, 0.13);
    let newlyCompletedIndex = 0;
    for (const cell of forgottenStreetNightBoard.cells) {
      for (const parentId of cell.revealBy ?? []) {
        const parent = forgottenStreetNightBoard.cells.find((candidate) => candidate.id === parentId);
        if (!parent) continue;
        const fromX = startX + parent.x * (cellSize + gap);
        const fromY = startY + parent.y * (cellSize + gap);
        const toX = startX + cell.x * (cellSize + gap);
        const toY = startY + cell.y * (cellSize + gap);
        lineLayer.lineBetween(fromX, fromY, toX, toY);
      }
    }
    root.add(lineLayer);

    for (const cell of forgottenStreetNightBoard.cells) {
      const state = completed.has(cell.id)
        ? 'completed'
        : revealed.has(cell.id)
          ? 'revealed'
          : hinted.has(cell.id)
            ? 'hinted'
            : 'hidden';
      const x = startX + cell.x * (cellSize + gap);
      const y = startY + cell.y * (cellSize + gap);
      const isNewlyCompleted = newlyCompleted.has(cell.id);
      const arrivalDelay = isNewlyCompleted ? newlyCompletedIndex * 140 : 0;
      if (isNewlyCompleted) newlyCompletedIndex += 1;
      root.add(this.boardCell(x, y, cellSize, cell, state, isNewlyCompleted, arrivalDelay));
    }
  }

  private renderBestiarySummary(root: Phaser.GameObjects.Container, seenEnemyIds: string[], defeatedEnemyCounts: Record<string, number>): void {
    root.add(this.text(GAME_WIDTH / 2, 606, COLLECTION_LABELS.bestiary, 14, STORYBOOK_UI.textLight, true));
    const seen = new Set(seenEnemyIds);
    const known = enemies.filter((enemy) => seen.has(enemy.id) || (defeatedEnemyCounts[enemy.id] ?? 0) > 0);
    const visible = known.slice(0, 3);
    const more = known.length - visible.length;
    const rows = visible.map((enemy) => `${enemy.name} ×${defeatedEnemyCounts[enemy.id] ?? 0}`);
    if (more > 0) rows.push(`…ほか ${more}種`);
    const text = rows.length > 0
      ? rows.join('\n')
      : 'まだカゲモノは記されていません。\n夜路で出会うと、ここに残ります。';
    const summary = this.text(GAME_WIDTH / 2, 642, text, 12, rows.length > 0 ? STORYBOOK_UI.goldLight : STORYBOOK_UI.textMuted, rows.length > 0);
    summary.setWordWrapWidth(306);
    root.add(summary);
  }

  private renderBestiaryPage(root: Phaser.GameObjects.Container, seenEnemyIds: string[], defeatedEnemyCounts: Record<string, number>): void {
    const seen = new Set(seenEnemyIds);
    const known = enemies.filter((enemy) => seen.has(enemy.id) || (defeatedEnemyCounts[enemy.id] ?? 0) > 0);
    const card = this.add.graphics();
    drawLargeNotebookPage(card, GAME_WIDTH / 2, 366, 330, 390, { accent: STORYBOOK_UI.dustyRose, alpha: 0.92 });
    root.add(card);
    root.add(this.text(GAME_WIDTH / 2, 194, COLLECTION_LABELS.bestiary, 18, STORYBOOK_UI.textDark, true, true));

    if (known.length === 0) {
      root.add(this.text(GAME_WIDTH / 2, 320, 'まだ影の絵札は白紙です。\n夜路で出会うと、ここに輪郭が残ります。', 13, STORYBOOK_UI.textMuted));
      return;
    }

    const visible = known.slice(0, 8);
    visible.forEach((enemy, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = GAME_WIDTH / 2 - 78 + col * 156;
      const y = 250 + row * 68;
      root.add(this.enemyRecordCard(x, y, enemy.name, defeatedEnemyCounts[enemy.id] ?? 0));
    });

    if (known.length > visible.length) {
      root.add(this.text(GAME_WIDTH / 2, 548, `ほか ${known.length - visible.length}種の影が記録済み`, 12, STORYBOOK_UI.goldLight, true));
    }
  }

  private enemyRecordCard(x: number, y: number, name: string, count: number): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    drawPremiumPaperCard(fill, 0, 0, 138, 54, { accent: 0x9c74c5, muted: true });
    this.drawPaperClip(fill, 48, -22, STORYBOOK_UI.paperEdge, 0.42);
    const mark = this.add.graphics();
    mark.fillStyle(0x9c74c5, 0.42);
    mark.fillCircle(-48, -1, 14);
    mark.fillStyle(0x0b1022, 0.72);
    mark.fillCircle(-48, 2, 9);
    const title = this.add.text(-26, -14, name, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '11px',
      color: colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
      wordWrap: { width: 84 },
    }).setOrigin(0, 0);
    const sub = this.add.text(-26, 8, `ほどいた数 ${count}`, {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: colorString(STORYBOOK_UI.textMuted),
      resolution: 2,
    }).setOrigin(0, 0);
    c.add([fill, mark, title, sub]);
    return c;
  }

  private boardCell(
    x: number,
    y: number,
    size: number,
    cell: NightBoardCell,
    state: 'hidden' | 'hinted' | 'revealed' | 'completed',
    newlyCompleted: boolean,
    arrivalDelay: number,
  ): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const accent = kindAccent(cell.kind);
    const fillColor = state === 'completed'
      ? 0xcaa25a
      : state === 'revealed'
        ? kindFill(cell.kind)
        : state === 'hinted'
          ? 0x26213f
          : 0x151326;
    const strokeColor = state === 'completed'
      ? 0xf5d58a
      : state === 'revealed'
        ? accent
        : state === 'hinted'
          ? 0x6f6590
          : 0x34304c;

    const glow = state === 'completed'
      ? this.add.rectangle(0, 0, size + 10, size + 10, STORYBOOK_UI.goldLight, 0.08)
      : null;
    if (glow) {
      glow.setStrokeStyle(3, STORYBOOK_UI.goldLight, 0.34);
      const pulse = this.tweens.add({
        targets: glow,
        alpha: { from: 0.42, to: 0.78 },
        duration: 1100,
        ease: 'Sine.InOut',
        yoyo: true,
        repeat: -1,
      });
      c.once('destroy', () => pulse.remove());
      c.add(glow);
    }

    const card = this.add.graphics();
    drawPremiumPaperCard(card, 0, 0, size, size + 6, {
      accent,
      paper: state === 'completed' ? STORYBOOK_UI.paperBeige : fillColor,
      selected: state === 'completed',
      muted: state === 'hidden' || state === 'hinted',
      shadowAlpha: state === 'completed' ? 0.22 : 0.16,
    });
    if (state === 'completed') {
      card.fillStyle(accent, 0.22).fillRect(-size / 2 + 6, -size / 2 + 7, 12, size - 8);
      card.lineStyle(1, STORYBOOK_UI.paperDark, 0.16).lineBetween(-size / 2 + 19, -size / 2 + 9, -size / 2 + 19, size / 2);
    } else {
      card.fillStyle(0x040612, state === 'hidden' ? 0.34 : 0.18).fillRect(-size / 2 + 5, -size / 2 + 7, size - 10, size - 8);
      card.lineStyle(1, strokeColor, 0.42).strokeRect(-size / 2 + 7, -size / 2 + 9, size - 14, size - 12);
    }
    this.drawPaperClip(card, size / 2 - 12, -size / 2 + 9, state === 'completed' ? STORYBOOK_UI.goldLight : STORYBOOK_UI.paperEdge, state === 'completed' ? 0.44 : 0.24);
    const art = this.add.graphics();
    this.drawCellMotif(art, cell, state, size, state === 'completed' ? GRAPHICS_TEXT_DARK : accent);
    let arrivalGlow: Phaser.GameObjects.Rectangle | null = null;
    if (newlyCompleted) {
      arrivalGlow = this.add.rectangle(0, 0, size + 18, size + 18, STORYBOOK_UI.goldLight, 0.06);
      arrivalGlow.setStrokeStyle(4, STORYBOOK_UI.goldLight, 0.7);
      const animatedGlow = arrivalGlow;

      const arrivalTween = this.tweens.add({
        targets: animatedGlow,
        alpha: { from: 0.18, to: 0.9 },
        scaleX: { from: 0.78, to: 1.18 },
        scaleY: { from: 0.78, to: 1.18 },
        delay: arrivalDelay,
        duration: 420,
        ease: 'Sine.Out',
        yoyo: true,
        repeat: 0,
        onComplete: () => animatedGlow.destroy(),
      });
      art.setAlpha(0.62).setScale(0.88);
      const starTween = this.tweens.add({
        targets: art,
        alpha: { from: 0.62, to: 1 },
        scaleX: { from: 0.88, to: 1.12 },
        scaleY: { from: 0.88, to: 1.12 },
        delay: arrivalDelay + 100,
        duration: 320,
        ease: 'Sine.InOut',
        yoyo: true,
        repeat: 0,
        onComplete: () => art.setAlpha(1).setScale(1),
      });
      c.once('destroy', () => {
        arrivalTween.remove();
        starTween.remove();
      });
    }
    const hit = this.add.rectangle(0, 0, size, size, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => this.showCellDetail(cell, state));

    const labelText = state === 'hidden'
      ? ''
      : state === 'hinted'
        ? '？'
        : shortCellLabel(cell.title);
    const label = this.add.text(0, size / 2 - 14, labelText, {
      fontFamily: STORYBOOK_FONT,
      fontSize: state === 'completed' ? '9px' : '8px',
      color: state === 'completed' ? '#241b27' : '#f7edcf',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
      wordWrap: { width: size - 8 },
      lineSpacing: 1,
    }).setOrigin(0.5);

    c.add(arrivalGlow ? [arrivalGlow, card, art, label, hit] : [card, art, label, hit]);
    return c;
  }

  private drawSectionIcon(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    id: CollectionSectionId,
    color: number,
    alpha: number,
  ): void {
    g.lineStyle(1, color, alpha);
    g.fillStyle(color, alpha * 0.38);
    switch (id) {
      case 'dawn_atlas':
        this.drawCompassMark(g, x, y, 7, color, alpha);
        return;
      case 'bestiary':
        g.fillTriangle(x, y - 8, x + 8, y + 4, x, y + 8);
        g.fillTriangle(x, y - 8, x - 8, y + 4, x, y + 8);
        g.fillStyle(color, alpha * 0.82).fillCircle(x - 3, y, 1.5).fillCircle(x + 3, y, 1.5);
        return;
      case 'keeper_records':
        g.strokeCircle(x, y, 7);
        g.lineBetween(x, y + 7, x, y + 12);
        g.lineBetween(x, y + 10, x + 5, y + 10);
        return;
      case 'word_records':
        g.strokeRect(x - 7, y - 7, 14, 12);
        g.lineBetween(x, y - 7, x, y + 5);
        g.lineBetween(x - 4, y - 3, x - 1, y - 3);
        g.lineBetween(x + 3, y - 3, x + 6, y - 3);
        return;
      case 'lost_item_cards':
        g.fillCircle(x, y, 7);
        g.lineStyle(1, STORYBOOK_UI.paperLight, alpha * 0.6).strokeCircle(x, y, 4);
        return;
      case 'achievements':
        drawStar(g, x, y, 7, color, STORYBOOK_UI.paperLight, alpha);
        return;
    }
  }

  private drawCompassMark(g: Phaser.GameObjects.Graphics, x: number, y: number, radius: number, color: number, alpha: number): void {
    g.lineStyle(1, color, alpha);
    g.strokeCircle(x, y, radius);
    g.lineBetween(x, y - radius - 5, x, y + radius + 5);
    g.lineBetween(x - radius - 5, y, x + radius + 5, y);
    g.fillStyle(color, alpha * 0.8);
    g.fillTriangle(x, y - radius + 2, x - 4, y, x + 4, y);
    g.fillTriangle(x, y + radius - 2, x - 3, y, x + 3, y);
  }

  private drawWaxStampMark(g: Phaser.GameObjects.Graphics, x: number, y: number, color: number, alpha: number): void {
    g.fillStyle(color, alpha);
    g.fillCircle(x, y, 21);
    g.lineStyle(1, color, alpha * 1.8);
    g.strokeCircle(x, y, 25);
    this.drawCompassMark(g, x, y, 11, STORYBOOK_UI.paperDark, alpha * 1.2);
  }

  private drawCellMotif(
    g: Phaser.GameObjects.Graphics,
    cell: NightBoardCell,
    state: 'hidden' | 'hinted' | 'revealed' | 'completed',
    size: number,
    accent: number,
  ): void {
    void size;
    if (state === 'hidden') {
      g.fillStyle(0x0b1022, 0.4);
      g.fillCircle(0, 0, 11);
      g.lineStyle(1, 0x50476d, 0.5);
      g.strokeCircle(0, 0, 13);
      g.lineStyle(1, 0x50476d, 0.42);
      g.lineBetween(-7, -7, 7, 7);
      g.lineBetween(7, -7, -7, 7);
      return;
    }

    if (state === 'hinted') {
      g.lineStyle(1, STORYBOOK_UI.gold, 0.45);
      g.strokeCircle(0, -3, 12);
      g.fillStyle(STORYBOOK_UI.gold, 0.24);
      g.fillCircle(0, -3, 8);
      return;
    }

    if (state === 'completed') {
      drawStar(g, 0, -6, 13, STORYBOOK_UI.goldLight, STORYBOOK_UI.paperEdge, 1);
      g.fillStyle(0xffffff, 0.55);
      g.fillRect(-1, -15, 2, 8);
      return;
    }

    switch (cell.kind) {
      case 'natural':
        drawFragment(g, 0, -5, 11);
        break;
      case 'targeted':
        g.lineStyle(2, accent, 0.9);
        g.strokeCircle(0, -5, 12);
        g.lineStyle(1, STORYBOOK_UI.goldLight, 0.75);
        g.lineBetween(-10, -5, 10, -5);
        g.lineBetween(0, -15, 0, 5);
        break;
      case 'mastery':
        drawStar(g, 0, -5, 12, accent, STORYBOOK_UI.goldLight, 0.9);
        g.lineStyle(1, STORYBOOK_UI.goldLight, 0.45);
        g.strokeCircle(0, -5, 17);
        break;
      case 'secret':
        g.fillStyle(accent, 0.84);
        g.fillTriangle(0, -20, 14, -5, 0, 10);
        g.fillTriangle(0, -20, -14, -5, 0, 10);
        g.lineStyle(1, STORYBOOK_UI.goldLight, 0.55);
        g.strokeCircle(0, -5, 15);
        break;
    }
  }

  private showCellDetail(cell: NightBoardCell, state: 'hidden' | 'hinted' | 'revealed' | 'completed'): void {
    if (!this.detailText) return;
    if (state === 'hidden') {
      this.detailText.setText('まだ暗くて絵札が見えません。となりの札を灯すと、輪郭が浮かびます。');
      return;
    }
    if (state === 'hinted') {
      this.detailText.setText(`${cell.hiddenTitle ?? '？？？'}\n${cell.hint ?? 'もう少し記録を集めると条件が見える。'}`);
      return;
    }
    const reward = nightBoardRewardLabel(cell.reward);
    this.detailText.setText(`${state === 'completed' ? '灯った絵札' : 'まだ灯っていない絵札'}：${cell.title}\n${cell.condition}${reward ? `\n戻ったもの：${reward}` : ''}`);
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

  private paperCtaButton(x: number, y: number, width: number, height: number, label: string, onClick: () => void): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.graphics();
    if (this.textures.exists(UI_CTA_BUTTON)) {
      c.add(this.add.image(0, 0, UI_CTA_BUTTON).setDisplaySize(width + 20, height + 14));
    } else {
      drawPrimaryPaperCta(fill, 0, 0, width, height, { accent: STORYBOOK_UI.warmAmber });
    }
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    attachPressFeedback(this, hit, c, { x, y, width, height, accent: STORYBOOK_UI.warmAmber, depth: 1000, strong: true });
    hit.on('pointerdown', () => {
      getAudioManager(this).playSe('ui_confirm', { volume: 0.44 });
      onClick();
    });
    c.add([fill, this.text(0, 0, label, 14, STORYBOOK_UI.textDark, true, true), hit]);
    return c;
  }

  private secondaryNavButton(x: number, y: number, width: number, height: number, label: string, onClick: () => void): Phaser.GameObjects.Container {
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

  private button(x: number, y: number, width: number, height: number, label: string, onClick: () => void, muted = false): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.rectangle(0, 0, width, height, muted ? 0x3c355f : 0xb8954e, muted ? 0.82 : 0.95);
    fill.setStrokeStyle(1, muted ? 0x6f6590 : 0xf5d58a, 0.9);
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', onClick);
    c.add([fill, this.text(0, 0, label, 13, muted ? STORYBOOK_UI.textMuted : STORYBOOK_UI.textDark, true), hit]);
    return c;
  }
}

function kindAccent(kind: NightBoardCellKind): number {
  switch (kind) {
    case 'natural': return STORYBOOK_UI.goldLight;
    case 'targeted': return 0x9fd4ff;
    case 'mastery': return 0xd89cff;
    case 'secret': return 0xffb7c8;
  }
}

function kindFill(kind: NightBoardCellKind): number {
  switch (kind) {
    case 'natural': return 0x3c355f;
    case 'targeted': return 0x263a58;
    case 'mastery': return 0x3b2a58;
    case 'secret': return 0x563047;
  }
}

function knowledgeAccent(category: KnowledgeLine['category']): number {
  switch (category) {
    case 'everyday_phrase': return 0xd7a65b;
    case 'rare_word': return 0x9fd4ff;
    case 'quote': return 0xf4d69a;
    case 'regional_quote': return 0x79bea9;
    case 'vamp_original': return 0xe0b0a6;
    case 'parody_prompt': return 0xd89cff;
  }
}

function knowledgeCategoryLabel(category: KnowledgeLine['category']): string {
  switch (category) {
    case 'everyday_phrase': return '日常語';
    case 'rare_word': return '言葉';
    case 'quote': return '名文';
    case 'regional_quote': return '地域';
    case 'vamp_original': return '夜の言葉';
    case 'parody_prompt': return '構造';
  }
}

function shortKnowledgeLabel(value: string): string {
  const normalized = value.replace(/[。.,]/g, '').trim();
  if (normalized.length <= 12) return normalized;
  return `${normalized.slice(0, 11)}…`;
}

function shortLostItemLabel(value: string): string {
  if (value.length <= 6) return value;
  if (value.includes('ランタン')) return 'ランタン硝子';
  if (value.includes('地図')) return '地図の角';
  if (value.includes('荷札')) return '消えた荷札';
  if (value.includes('糸')) return '赤い糸';
  if (value.includes('灯貨')) return '灯貨';
  if (value.includes('鍵')) return '部屋の鍵';
  return value.slice(0, 5);
}

function lostItemTypeLabel(type: LostItemRecord['itemType']): string {
  switch (type) {
    case 'bag': return 'かばん';
    case 'paper': return '紙片';
    case 'lamp': return '灯り';
    case 'thread': return '糸';
    case 'coin': return '灯貨';
    case 'key': return '鍵';
  }
}

function characterShortLabel(characterId: string): string {
  const labels: Record<string, string> = {
    yui: 'ユイ',
    asa: 'アサ',
    nagi: 'ナギ',
    michiru: 'ミチル',
    tomori: 'トモリ',
    shino: 'シノ',
    chloe: 'クロエ',
    koharu: 'コハル',
    iori: 'イオリ',
    haku: 'ハク',
    ritsu: 'リツ',
    hinata: 'ヒナタ',
    sena: 'セナ',
    nemu: 'ネム',
  };
  return labels[characterId] ?? characterId;
}

function shortCellLabel(value: string): string {
  if (value.length <= 4) return value;
  if (value.includes('夜明け')) return '夜明け';
  if (value.includes('朝')) return '朝';
  if (value.includes('灯')) return '灯り';
  if (value.includes('ほどく')) return 'ほどく';
  if (value.includes('鎮める')) return '鎮める';
  if (value.includes('記録')) return '記録';
  if (value.includes('拾う')) return '拾う';
  return value.slice(0, 3);
}

function achievementCategoryLabel(category: string): string {
  switch (category) {
    case 'stage': return 'ステージ';
    case 'combat': return '戦闘';
    case 'build': return 'ビルド';
    case 'challenge': return '挑戦';
    default: return '';
  }
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
