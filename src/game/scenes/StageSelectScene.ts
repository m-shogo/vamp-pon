import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import {
  buyUpgrade,
  characterXpToNext,
  EXPLORATION_DEPTHS,
  loadProfile,
  resetUpgrades,
  selectRun,
  UPGRADE_DEFS,
  upgradeCost,
  upgradeRefundValue,
  type ExplorationDepthId,
  type PlayerProfile,
  type UpgradeId,
} from '../persistence/profile';
import { loadBondProgress } from '../persistence/bonds';
import { characters } from '../data/characters';
import { buildStageSelectSubCharacterViewModel } from './stageSelectViewModel';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI, drawStorybookPanel } from '../ui/storybookUi';
import { loadBackgroundManifest, getBackgroundByStageNumber, type BackgroundStageEntry } from '../assets/backgroundManifest';
import { stageBackgroundTextureKey } from '../ui/background';

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

export function isRunStartUrl(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  return new URLSearchParams(search).get('play') === '1';
}

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

    root.add(this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1d1a34, 1));
    const panel = this.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 370, 810, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.98);
    root.add(panel);

    root.add(this.text(GAME_WIDTH / 2, 34, this.mode === 'growth' ? '黒曜研究所' : '夜の地図', 25, STORYBOOK_UI.textLight, true, true));
    root.add(this.text(GAME_WIDTH / 2, 64, `黒曜片 ${profile.currency}`, 14, STORYBOOK_UI.goldLight, true));

    if (this.mode === 'stage') {
      this.renderStagePreview(root, profile);
      this.renderDepthBlock(root, profile);
      this.renderCharacterSummary(root, profile);
      this.renderSubCharacterStatus(root, profile, 515);
      root.add(this.button(GAME_WIDTH / 2, GAME_HEIGHT - 102, 240, 50, '探索を始める', () => this.startRun(profile)));
      root.add(this.button(GAME_WIDTH / 2 - 86, GAME_HEIGHT - 42, 148, 40, 'TOPへ', () => this.scene.start('TopScene'), true));
      root.add(this.button(GAME_WIDTH / 2 + 86, GAME_HEIGHT - 42, 148, 40, '成長へ', () => {
        this.mode = 'growth';
        this.render();
      }, true));
    } else {
      this.renderCharacterSummary(root, profile);
      this.renderSubCharacterStatus(root, profile, 136);
      this.renderUpgradeBlock(root, profile);
      root.add(this.button(GAME_WIDTH / 2 - 86, GAME_HEIGHT - 42, 148, 40, 'TOPへ', () => this.scene.start('TopScene'), true));
      root.add(this.button(GAME_WIDTH / 2 + 86, GAME_HEIGHT - 42, 148, 40, '選択へ', () => {
        this.mode = 'stage';
        this.render();
      }, true));
    }

    if (this.confirmingReset) this.renderResetConfirm(root, profile);
  }

  // --- ステージ選択（プレビュー + 前後ナビ） ---
  private renderStagePreview(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    const current = profile.selectedStage;
    const unlocked = profile.unlockedStages;
    const idx = unlocked.indexOf(current);
    const prev = idx > 0 ? unlocked[idx - 1] : null;
    const next = idx >= 0 && idx + 1 < unlocked.length ? unlocked[idx + 1] : null;
    const nextLocked = next == null;

    // プレビューカード（背景画像があればそれ、なければ夜色＋テーマ色）
    const cardX = GAME_WIDTH / 2;
    const cardY = 200;
    const cardW = 322;
    const cardH = 168;

    const entry = this.bgEntryByStage.get(current);
    const key = entry ? stageBackgroundTextureKey(entry) : null;
    if (key && this.textures.exists(key)) {
      const tile = this.add.image(cardX, cardY, key).setDisplaySize(cardW, cardH).setDepth(0);
      root.add(tile);
    } else {
      // fallback: テーマ色のグラデっぽい二段塗り
      const fallbackTop = this.add.rectangle(cardX, cardY - cardH / 4, cardW, cardH / 2, 0x2a2548, 1);
      const fallbackBottom = this.add.rectangle(cardX, cardY + cardH / 4, cardW, cardH / 2, 0x1c1932, 1);
      root.add(fallbackTop);
      root.add(fallbackBottom);
    }
    // 暗膜（文字を読ませる）
    const dim = this.add.rectangle(cardX, cardY, cardW, cardH, 0x0a0816, 0.42);
    root.add(dim);
    // 枠
    const border = this.add.graphics();
    border.lineStyle(2, 0xf5d58a, 0.85);
    border.strokeRoundedRect(cardX - cardW / 2, cardY - cardH / 2, cardW, cardH, 8);
    root.add(border);

    // ステージ番号 + 名前
    const stageName = entry?.name ?? '夜路';
    root.add(this.text(cardX, cardY - 56, `Stage ${current}`, 22, STORYBOOK_UI.textLight, true, true));
    root.add(this.text(cardX, cardY - 28, stageName, 15, STORYBOOK_UI.goldLight, true));
    root.add(this.text(cardX, cardY + 4, this.stageBlurbFor(current, entry), 11, STORYBOOK_UI.textLight));
    root.add(this.text(cardX, cardY + cardH / 2 - 18, `開放 ${unlocked.length}ステージ`, 11, STORYBOOK_UI.textMuted));

    // 前ボタン
    const prevBtn = this.button(cardX - cardW / 2 - 8, cardY, 36, 56, '◀', () => {
      if (prev == null) return;
      selectRun(prev, profile.selectedDepth);
      void this.loadPreviewTextureFor(prev).then(() => this.render());
      this.render();
    }, prev == null);
    root.add(prevBtn);

    // 次ボタン
    const nextLabel = nextLocked ? '×' : '▶';
    const nextBtn = this.button(cardX + cardW / 2 + 8, cardY, 36, 56, nextLabel, () => {
      if (next == null) return;
      selectRun(next, profile.selectedDepth);
      void this.loadPreviewTextureFor(next).then(() => this.render());
      this.render();
    }, nextLocked);
    root.add(nextBtn);

    if (nextLocked) {
      root.add(this.text(cardX, cardY + cardH / 2 + 14, '次のステージは未開放', 11, STORYBOOK_UI.textMuted));
    }
  }

  private stageBlurbFor(stage: number, entry: BackgroundStageEntry | undefined): string {
    if (entry?.name && stage === 1) return '黒インクに沈む、最初の夜路';
    if (stage === 1) return '黒インクに沈む、最初の夜路';
    if (stage === 2) return '紙の街角、忘れ物が増える夜';
    if (stage === 3) return '街灯の輪、灯りに集まる影';
    if (stage === 4) return '橋の手前、深まる夜';
    if (stage === 5) return '夜主の気配、最初の節目';
    return '夜路はまだ続く';
  }

  // --- 難易度（Easy/Normal/Hard） ---
  private renderDepthBlock(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    const blockY = 322;
    root.add(this.text(GAME_WIDTH / 2, blockY, '探索の深さ', 14, STORYBOOK_UI.textLight, true));
    DEPTH_ORDER.forEach((depthId, index) => {
      const depth = EXPLORATION_DEPTHS[depthId];
      const flavor = DEPTH_FLAVOR[depthId];
      const selected = depthId === profile.selectedDepth;
      const x = 56 + index * 96 + 48;
      const y = blockY + 50;
      const btn = this.button(x, y, 92, 50, depth.label, () => {
        selectRun(profile.selectedStage, depthId);
        this.render();
      }, !selected);
      btn.getByName('fill')?.setData('tint', depth.tint);
      root.add(btn);
      root.add(this.text(x, y + 38, flavor.sub, 10, colorString(depth.tint), true));
      root.add(this.text(x, y + 52, `報酬×${depth.reward.toFixed(1)}`, 10, STORYBOOK_UI.textMuted));
    });
    // 選択中のおすすめコメント
    const selected = DEPTH_FLAVOR[profile.selectedDepth];
    root.add(this.text(GAME_WIDTH / 2, blockY + 116, `おすすめ: ${selected.recommend}`, 12, STORYBOOK_UI.goldLight));
  }

  private renderCharacterSummary(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    const char = characters[0];
    const progress = profile.characterProgress[char.id] ?? { level: 1, xp: 0, totalXp: 0 };
    const need = characterXpToNext(progress.level);
    const y = this.mode === 'growth' ? 100 : 470;
    root.add(this.text(GAME_WIDTH / 2, y, `${char.name} Lv.${progress.level}　${progress.xp}/${need}`, 13, STORYBOOK_UI.goldLight, true));
    root.add(this.text(GAME_WIDTH / 2, y + 18, '使うほどHPと攻撃が少しずつ伸びる', 11, STORYBOOK_UI.textMuted));
  }

  private renderSubCharacterStatus(root: Phaser.GameObjects.Container, profile: PlayerProfile, y: number): void {
    const vm = buildStageSelectSubCharacterViewModel(profile, loadBondProgress(), characters[0].id);
    root.add(this.text(GAME_WIDTH / 2, y, `同行: ${vm.selectedLine}`, 11, STORYBOOK_UI.goldLight, true));
    root.add(this.text(GAME_WIDTH / 2, y + 17, vm.effectLine, 10, STORYBOOK_UI.textMuted));
    root.add(this.text(GAME_WIDTH / 2, y + 34, vm.pairUltimateLine, 10, STORYBOOK_UI.textMuted));
  }

  // --- 成長画面（既存ロジック踏襲・縦位置だけ整える） ---
  private renderUpgradeBlock(root: Phaser.GameObjects.Container, profile: PlayerProfile): void {
    root.add(this.text(62, 154, '黒曜研究所', 16, STORYBOOK_UI.textLight, true).setOrigin(0, 0.5));
    root.add(this.button(GAME_WIDTH - 90, 154, 106, 30, 'リセット', () => {
      this.confirmingReset = true;
      this.render();
    }, true));

    UPGRADE_ORDER.forEach((id, index) => {
      const def = UPGRADE_DEFS[id];
      const level = profile.upgrades[id] ?? 0;
      const maxed = level >= def.maxLevel;
      const cost = upgradeCost(id, level);
      const y = 196 + index * 39;
      root.add(this.text(58, y - 7, `${def.name} Lv.${level}/${def.maxLevel}`, 12, STORYBOOK_UI.textLight, true).setOrigin(0, 0.5));
      root.add(this.text(58, y + 10, def.description, 12, STORYBOOK_UI.textMuted).setOrigin(0, 0.5));
      const label = maxed ? '最大' : `${cost}`;
      const canBuy = !maxed && profile.currency >= cost;
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
    root.add(this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05060f, 0.72).setInteractive());
    const panel = this.add.graphics();
    drawStorybookPanel(panel, GAME_WIDTH / 2, GAME_HEIGHT / 2, 300, 220, STORYBOOK_UI.nightPanel, STORYBOOK_UI.gold, 0.99);
    root.add(panel);
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 66, '強化をリセット', 20, STORYBOOK_UI.textLight, true));
    root.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 22, `黒曜片 ${refund} を全額返還します。
いつでも振り直せます。`, 12, STORYBOOK_UI.textMuted));
    root.add(this.button(GAME_WIDTH / 2 - 76, GAME_HEIGHT / 2 + 52, 136, 42, 'やめる', () => {
      this.confirmingReset = false;
      this.render();
    }, true));
    root.add(this.button(GAME_WIDTH / 2 + 76, GAME_HEIGHT / 2 + 52, 136, 42, '返還する', () => {
      resetUpgrades();
      this.confirmingReset = false;
      this.render();
    }));
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

  private button(x: number, y: number, width: number, height: number, label: string, onClick: () => void, muted = false): Phaser.GameObjects.Container {
    const c = this.add.container(x, y);
    const fill = this.add.rectangle(0, 0, width, height, muted ? 0x3c355f : 0xb8954e, muted ? 0.82 : 0.95).setName('fill');
    fill.setStrokeStyle(1, muted ? 0x6f6590 : 0xf5d58a, 0.9);
    const hit = this.add.rectangle(0, 0, width, height, 0x000000, 0.001).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', onClick);
    c.add([fill, this.text(0, 0, label, 13, muted ? STORYBOOK_UI.textMuted : STORYBOOK_UI.textDark, true), hit]);
    return c;
  }
}

function colorString(value: string | number): string {
  return typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value;
}
