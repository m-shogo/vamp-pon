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
import type { CharacterKnowledgeReply, KnowledgeLine } from '../types/knowledge';
import { nightBoardRewardLabel } from '../ui/collectionAtlasLabels';
import { attachCollectionAtlasAtmosphere } from '../ui/collectionAtlasSceneHooks';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI, drawFragment, drawStar, drawStorybookPanel } from '../ui/storybookUi';

const GRAPHICS_TEXT_DARK = 0x2e2730;
const GRAPHICS_TEXT_LIGHT = 0xf4e8cf;

export class CollectionScene extends Phaser.Scene {
  private root: Phaser.GameObjects.Container | null = null;
  private detailText: Phaser.GameObjects.Text | null = null;
  private activeSection: CollectionSectionId = 'dawn_atlas';
  private selectedKeeperRecordId: string = 'keeper-yui';
  private selectedKnowledgeLineId: string = 'rare-jp-kanwa-kyudai';
  private selectedLostItemRecordId: string = 'lost-small-bag-tag';

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

    root.add(this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1d1a34, 1));
    this.addSoftAtlasGlow(root);

    const panel = this.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 370, 810, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.98);
    root.add(panel);

    const active = this.activeCollectionSection();
    attachCollectionAtlasAtmosphere(this, root, active);
    root.add(this.text(GAME_WIDTH / 2, 32, COLLECTION_LABELS.book, 25, STORYBOOK_UI.textLight, true, true));
    root.add(this.text(GAME_WIDTH / 2, 61, active.label, 14, active.accent, true));
    root.add(this.text(GAME_WIDTH / 2, 86, active.description, 11, STORYBOOK_UI.textMuted));
    this.renderSectionTabs(root);

    this.renderActiveSection(root, progress, completed, revealed, hinted, newlyCompleted);

    root.add(this.text(
      GAME_WIDTH / 2,
      712,
      `星図 ${completed.size}/${forgottenStreetNightBoard.cells.length}　カゲモノ ${progress.seenEnemyIds.length}種　忘れ物 ${lostItemRecords.length}枚　言葉 ${collectionWordRecordLines.length}`,
      11,
      STORYBOOK_UI.goldLight,
      true,
    ));
    root.add(this.button(GAME_WIDTH / 2 - 86, GAME_HEIGHT - 46, 148, 44, 'TOPへ', () => this.scene.start('TopScene'), true));
    root.add(this.button(GAME_WIDTH / 2 + 86, GAME_HEIGHT - 46, 148, 44, '夜へ', () => this.scene.start('StageSelectScene', { mode: 'stage' })));
  }

  private activeCollectionSection(): CollectionSection {
    return collectionSections.find((section) => section.id === this.activeSection) ?? collectionSections[0];
  }

  private renderSectionTabs(root: Phaser.GameObjects.Container): void {
    const tabWidth = 60;
    const tabHeight = 28;
    const gap = 6;
    const totalWidth = collectionSections.length * tabWidth + (collectionSections.length - 1) * gap;
    const startX = GAME_WIDTH / 2 - totalWidth / 2 + tabWidth / 2;

    collectionSections.forEach((section, index) => {
      const x = startX + index * (tabWidth + gap);
      root.add(this.sectionTab(x, 120, tabWidth, tabHeight, section));
    });
  }

  private sectionTab(x: number, y: number, width: number, height: number, section: CollectionSection): Phaser.GameObjects.Container {
    const isActive = section.id === this.activeSection;
    const c = this.add.container(x, y);
    const fill = this.add.rectangle(0, 0, width, height, isActive ? section.accent : 0x26213f, isActive ? 0.94 : 0.78);
    fill.setStrokeStyle(isActive ? 2 : 1, isActive ? STORYBOOK_UI.goldLight : 0x6f6590, isActive ? 0.95 : 0.75);
    const label = this.text(0, 0, section.shortLabel, 10, isActive ? STORYBOOK_UI.textDark : STORYBOOK_UI.textMuted, true);
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => {
      this.activeSection = section.id;
      this.render();
    });
    c.add([fill, label, hit]);
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
    this.renderBoard(root, completed, revealed, hinted, newlyCompleted);

    const detailPanel = this.add.graphics();
    drawStorybookPanel(detailPanel, GAME_WIDTH / 2, 498, 330, 92, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.86);
    root.add(detailPanel);
    this.detailText = this.add.text(
      GAME_WIDTH / 2,
      462,
      '絵札を押すと、夜に残った記憶が読めます。',
      {
        fontFamily: STORYBOOK_FONT,
        fontSize: '13px',
        color: colorString(STORYBOOK_UI.textMuted),
        align: 'center',
        resolution: 2,
        lineSpacing: 4,
        wordWrap: { width: 308 },
      },
    ).setOrigin(0.5, 0);
    root.add(this.detailText);

    this.renderBestiarySummary(root, progress.seenEnemyIds, progress.defeatedEnemyCounts);
  }

  private renderLostItemCardsPage(root: Phaser.GameObjects.Container): void {
    const card = this.add.graphics();
    drawStorybookPanel(card, GAME_WIDTH / 2, 382, 336, 424, STORYBOOK_UI.nightPanel, 0xd7a65b, 0.9);
    root.add(card);
    root.add(this.text(GAME_WIDTH / 2, 184, '忘れ物絵札', 20, STORYBOOK_UI.textLight, true, true));
    root.add(this.text(GAME_WIDTH / 2, 208, '拾われる前から、夜に残っていた小さな持ち物たち。', 11, STORYBOOK_UI.textMuted));

    lostItemRecords.forEach((record, index) => {
      const x = GAME_WIDTH / 2 - 110 + (index % 3) * 110;
      const y = 276 + Math.floor(index / 3) * 68;
      root.add(this.lostItemMiniCard(x, y, record));
    });

    const selected = lostItemRecords.find((record) => record.id === this.selectedLostItemRecordId) ?? lostItemRecords[0];
    root.add(this.lostItemDetailPanel(GAME_WIDTH / 2, 492, selected));
  }

  private lostItemMiniCard(x: number, y: number, record: LostItemRecord): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const selected = record.id === this.selectedLostItemRecordId;
    const fill = this.add.rectangle(0, 0, 96, 54, selected ? record.accent : 0x26213f, selected ? 0.95 : 0.86);
    fill.setStrokeStyle(selected ? 2 : 1, selected ? STORYBOOK_UI.goldLight : record.accent, selected ? 0.95 : 0.75);

    const motif = this.add.graphics();
    this.drawLostItemMotif(motif, -32, -8, record, selected);

    const label = this.add.text(-12, -20, shortLostItemLabel(record.nameJa), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: selected ? colorString(STORYBOOK_UI.textDark) : colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
      wordWrap: { width: 68 },
      align: 'center',
    }).setOrigin(0.5, 0);

    const type = this.add.text(-12, 10, lostItemTypeLabel(record.itemType), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '8px',
      color: selected ? colorString(STORYBOOK_UI.textDark) : colorString(STORYBOOK_UI.textMuted),
      resolution: 2,
      align: 'center',
    }).setOrigin(0.5, 0);

    const hit = this.add.rectangle(0, 0, 96, 54, 0x000000, 0.001).setInteractive({ useHandCursor: true });
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
    drawStorybookPanel(card, GAME_WIDTH / 2, 382, 336, 424, STORYBOOK_UI.nightPanel, 0x79bea9, 0.9);
    root.add(card);
    root.add(this.text(GAME_WIDTH / 2, 184, '灯し手の記録', 20, STORYBOOK_UI.textLight, true, true));
    root.add(this.text(GAME_WIDTH / 2, 208, '灯名・黒耀・朝明・欠けた心を、絵札として残す頁。', 11, STORYBOOK_UI.textMuted));

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
    const fill = this.add.rectangle(0, 0, 58, 70, selected ? record.accent : 0x203144, selected ? 0.95 : 0.9);
    fill.setStrokeStyle(selected ? 2 : 1, selected ? STORYBOOK_UI.goldLight : record.accent, 0.9);

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
    drawStorybookPanel(card, GAME_WIDTH / 2, 382, 336, 424, STORYBOOK_UI.nightPanel, 0xe0b0a6, 0.9);
    root.add(card);
    root.add(this.text(GAME_WIDTH / 2, 184, '言葉の記録', 20, STORYBOOK_UI.textLight, true, true));
    root.add(this.text(GAME_WIDTH / 2, 208, 'ロードで出会った言葉と、灯し手たちの返事。', 11, STORYBOOK_UI.textMuted));

    const visibleLines = collectionWordRecordLines.slice(0, 6);
    if (visibleLines.length === 0) {
      root.add(this.text(GAME_WIDTH / 2, 382, 'いま読める紙片はありません。\n言葉の確認が済むまで、静かに綴じてあります。', 13, STORYBOOK_UI.textMuted));
      return;
    }
    visibleLines.forEach((line, index) => {
      const x = GAME_WIDTH / 2 - 110 + (index % 3) * 110;
      const y = 266 + Math.floor(index / 3) * 54;
      root.add(this.wordMiniCard(x, y, line));
    });

    const selected = collectionWordRecordLines.find((line) => line.id === this.selectedKnowledgeLineId) ?? collectionWordRecordLines[0];
    const reply = launchCoreCharacterKnowledgeReplies.find((candidate) => candidate.knowledgeLineId === selected.id);
    root.add(this.wordDetailPanel(GAME_WIDTH / 2, 472, selected, reply));
  }

  private wordMiniCard(x: number, y: number, line: KnowledgeLine): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const selected = line.id === this.selectedKnowledgeLineId;
    const accent = knowledgeAccent(line.category);
    const fill = this.add.rectangle(0, 0, 98, 42, selected ? accent : 0x26213f, selected ? 0.94 : 0.84);
    fill.setStrokeStyle(selected ? 2 : 1, selected ? STORYBOOK_UI.goldLight : accent, selected ? 0.95 : 0.72);
    const label = this.add.text(0, -14, shortKnowledgeLabel(line.originalText), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: selected ? colorString(STORYBOOK_UI.textDark) : colorString(STORYBOOK_UI.textLight),
      fontStyle: 'bold',
      resolution: 2,
      align: 'center',
      wordWrap: { width: 86 },
    }).setOrigin(0.5, 0);
    const source = this.add.text(0, 9, knowledgeCategoryLabel(line.category), {
      fontFamily: STORYBOOK_FONT,
      fontSize: '8px',
      color: selected ? colorString(STORYBOOK_UI.textDark) : colorString(STORYBOOK_UI.textMuted),
      resolution: 2,
      align: 'center',
    }).setOrigin(0.5, 0);
    const hit = this.add.rectangle(0, 0, 98, 42, 0x000000, 0.001).setInteractive({ useHandCursor: true });
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

  private addSoftAtlasGlow(root: Phaser.GameObjects.Container): void {
    const glow = this.add.graphics();
    glow.fillStyle(0xf4d69a, 0.04);
    glow.fillCircle(GAME_WIDTH / 2, 240, 180);
    glow.fillStyle(0x8d76c9, 0.035);
    glow.fillCircle(GAME_WIDTH / 2 + 40, 380, 150);
    root.add(glow);
  }

  private renderBoard(
    root: Phaser.GameObjects.Container,
    completed: Set<string>,
    revealed: Set<string>,
    hinted: Set<string>,
    newlyCompleted: Set<string>,
  ): void {
    const cellSize = 48;
    const gap = 8;
    const startX = GAME_WIDTH / 2 - ((cellSize + gap) * forgottenStreetNightBoard.width - gap) / 2 + cellSize / 2;
    const startY = 176;

    const lineLayer = this.add.graphics();
    lineLayer.lineStyle(1, STORYBOOK_UI.gold, 0.16);
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
    root.add(this.text(GAME_WIDTH / 2, 584, COLLECTION_LABELS.bestiary, 14, STORYBOOK_UI.textLight, true));
    const seen = new Set(seenEnemyIds);
    const known = enemies.filter((enemy) => seen.has(enemy.id) || (defeatedEnemyCounts[enemy.id] ?? 0) > 0);
    const visible = known.slice(0, 3);
    const more = known.length - visible.length;
    const rows = visible.map((enemy) => `${enemy.name} ×${defeatedEnemyCounts[enemy.id] ?? 0}`);
    if (more > 0) rows.push(`…ほか ${more}種`);
    const text = rows.length > 0
      ? rows.join('\n')
      : 'まだカゲモノは記されていません。\n夜路で出会うと、ここに残ります。';
    const summary = this.text(GAME_WIDTH / 2, 626, text, 12, rows.length > 0 ? STORYBOOK_UI.goldLight : STORYBOOK_UI.textMuted, rows.length > 0);
    summary.setWordWrapWidth(306);
    root.add(summary);
  }

  private renderBestiaryPage(root: Phaser.GameObjects.Container, seenEnemyIds: string[], defeatedEnemyCounts: Record<string, number>): void {
    const seen = new Set(seenEnemyIds);
    const known = enemies.filter((enemy) => seen.has(enemy.id) || (defeatedEnemyCounts[enemy.id] ?? 0) > 0);
    const card = this.add.graphics();
    drawStorybookPanel(card, GAME_WIDTH / 2, 366, 330, 390, STORYBOOK_UI.nightPanel, 0x9c74c5, 0.9);
    root.add(card);
    root.add(this.text(GAME_WIDTH / 2, 194, COLLECTION_LABELS.bestiary, 20, STORYBOOK_UI.textLight, true, true));

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
    const fill = this.add.rectangle(0, 0, 136, 52, 0x26213f, 0.88);
    fill.setStrokeStyle(1, 0x9c74c5, 0.8);
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

    const rect = this.add.rectangle(0, 0, size, size, fillColor, state === 'hidden' ? 0.78 : 0.95);
    rect.setStrokeStyle(state === 'completed' ? 2 : 1, strokeColor, 0.95);
    const art = this.add.graphics();
    this.drawCellMotif(art, cell, state, size, accent);
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

    c.add(arrivalGlow ? [arrivalGlow, rect, art, label, hit] : [rect, art, label, hit]);
    return c;
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

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
