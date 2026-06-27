import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import type { LevelUpChoice } from '../domain/types';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, PLAYER_DEFAULTS } from '../domain/constants';
import { createBackground } from '../ui/background';
import {
  createPlayerView,
  createEnemyView,
  createProjectileView,
  createAreaView,
  createOrbiterView,
  createPickupView,
  createHealPickupView,
  createCapsuleView,
  enemyRadiusFor,
  VIEW_DEPTH,
} from '../ui/factory';
import { Hud } from '../ui/hud';
import { Overlays } from '../ui/overlays';
import { evolutionBurst } from '../ui/effects';
import { FONT } from '../ui/visualDesign';
import { enemies } from '../data/enemies';
import { weapons, weaponById } from '../data/weapons';
import { passiveById } from '../data/passives';
import { rareItemById } from '../data/rareItems';
import { evolutions } from '../data/evolutions';
import { weaponRenderInfo } from '../domain/weaponVisual';
import type { EvolutionKind } from '../domain/types';
import { assetById, assetManifest, WEAPON_ASSET } from '../assets/assetManifest';
import { assetStatus, spriteOrNull } from '../assets/assetHelpers';
import { prototypeAssets } from '../assets/prototypeManifest';
import { generatedPixelAssets, type PixelAssetQuality } from '../assets/vampPixelKit';
import {
  loadBackgroundManifest,
  getPreviewBackgrounds,
  loadBackgroundMeta,
  type BackgroundStageEntry,
  type BackgroundMeta,
} from '../assets/backgroundManifest';
import { createStageBackground, stageBackgroundTextureKey } from '../ui/background';

const PAGES = ['背景・ユイ・敵', 'ユイ詳細', '拾得物・UI', '通常武器', '進化・合体・覚醒', '戦闘モック', 'アセット状況', 'ユイ32px比較', 'ユイ42px比較', 'Stage背景'] as const;

/** URLのscene指定から初期ページを決める。 */
export function pageFromUrl(): number {
  const params = new URLSearchParams(window.location.search);
  const scene = params.get('scene') ?? params.get('debug') ?? '';
  if (scene === 'yui-gallery') return 1;
  if (scene === 'combat-mock') return 5;
  if (scene === 'evolution-showcase') return 4;
  if (scene === 'asset-status') return 6;
  if (scene === 'yui-redesign32') return 7;
  if (scene === 'yui-redesign42') return 8;
  if (scene === 'background-preview') return 9;
  return 0;
}

const GALLERY_SCENES = ['visual-gallery', 'yui-gallery', 'combat-mock', 'evolution-showcase', 'asset-status', 'yui-redesign32', 'yui-redesign42', 'background-preview'];
const generatedQualityById = new Map(generatedPixelAssets.map((asset) => [asset.id, asset.quality]));

/** ?scene= / ?debug= がギャラリー系か。 */
export function isGalleryUrl(): boolean {
  const params = new URLSearchParams(window.location.search);
  const scene = params.get('scene') ?? params.get('debug') ?? '';
  return GALLERY_SCENES.includes(scene);
}

export function isBackgroundPreviewUrl(): boolean {
  const params = new URLSearchParams(window.location.search);
  const scene = params.get('scene') ?? params.get('debug') ?? '';
  return scene === 'background-preview';
}

/**
 * ビジュアル確認用シーン。?scene=visual-gallery / combat-mock / evolution-showcase で起動。
 * 実ゲーム背景の上に各要素を並べ、紙片・絵本風ドットの世界観を評価/比較/劣化検知する。
 * ゲーム本編には影響しない（main.ts でURLにより起動シーンを切り替えるだけ）。
 */
export class VisualGalleryScene extends Phaser.Scene {
  private page = 0;
  private pageRoot!: Phaser.GameObjects.Container;
  private titleText!: Phaser.GameObjects.Text;
  private hud!: Hud;
  private overlays!: Overlays;

  constructor() {
    super('VisualGalleryScene');
  }

  init(data: { page?: number }): void {
    this.page = data.page ?? pageFromUrl();
  }

  create(): void {
    createBackground(this);
    this.hud = new Hud(this, () => {});
    this.hud.setVisible(false);
    this.overlays = new Overlays(this);

    // ナビ（HUDの所持品行と重ならない高さに）
    const navY = GAME_HEIGHT - 40;
    this.titleText = this.add
      .text(GAME_WIDTH / 2, navY, '', { fontFamily: FONT, fontSize: '13px', color: '#f3ead2' })
      .setOrigin(0.5)
      .setDepth(VIEW_DEPTH.hud + 5);
    this.navButton(26, navY, '◀', () => this.go(-1));
    this.navButton(GAME_WIDTH - 26, navY, '▶', () => this.go(1));

    const kb = this.input.keyboard;
    kb?.on('keydown-LEFT', () => this.go(-1));
    kb?.on('keydown-RIGHT', () => this.go(1));

    this.pageRoot = this.add.container(0, 0);
    this.renderPage();
  }

  private go(dir: number): void {
    this.page = (this.page + dir + PAGES.length) % PAGES.length;
    this.renderPage();
  }

  private renderPage(): void {
    this.pageRoot.destroy();
    this.pageRoot = this.add.container(0, 0);
    this.overlays.clear();
      this.titleText.setText(`${this.page + 1}/${PAGES.length}  ${PAGES[this.page]}`);

    switch (this.page) {
      case 0: this.buildEnemiesPage(); break;
      case 1: this.buildYuiGalleryPage(); break;
      case 2: this.buildPickupsUiPage(); break;
      case 3: this.buildWeaponsPage(); break;
      case 4: this.buildEvolutionPage(); break;
      case 5: this.buildCombatMockPage(); break;
      case 6: this.buildAssetStatusPage(); break;
      case 7: this.buildYuiRedesign32Page(); break;
      case 8: this.buildYuiRedesign42Page(); break;
      case 9: this.buildBackgroundPreviewPage(); break;
    }

    const showHud = this.page === 2 || this.page === 5;
    this.hud.setVisible(showHud);
    if (showHud) this.hud.update(showcaseState());
  }

  // ---- helpers -------------------------------------------------------------

  private label(x: number, y: number, text: string, size = 10, color = '#cfc6b0', width = 110): void {
    this.pageRoot.add(
      this.add.text(x, y, text, { fontFamily: FONT, fontSize: `${size}px`, color, align: 'center', wordWrap: { width } }).setOrigin(0.5, 0),
    );
  }

  private heading(text: string): void {
    this.pageRoot.add(
      this.add.text(GAME_WIDTH / 2, 18, text, { fontFamily: FONT, fontSize: '15px', color: '#f3ead2' }).setOrigin(0.5, 0),
    );
  }

  private navButton(x: number, y: number, glyph: string, onClick: () => void): void {
    const bg = this.add.circle(x, y, 16, COLORS.cardBg, 1).setDepth(VIEW_DEPTH.hud + 5).setInteractive({ useHandCursor: true });
    bg.setStrokeStyle(2, COLORS.cardEdge, 1);
    bg.on('pointerdown', onClick);
    this.add.text(x, y, glyph, { fontFamily: FONT, fontSize: '16px', color: '#3a3326', fontStyle: 'bold' }).setOrigin(0.5).setDepth(VIEW_DEPTH.hud + 6);
  }

  private place(view: Phaser.GameObjects.Container, x: number, y: number): void {
    view.setPosition(x, y);
    this.pageRoot.add(view);
  }

  // ---- pages ---------------------------------------------------------------

  /** 背景 + ユイ + 敵全種 */
  private buildEnemiesPage(): void {
    this.heading('背景 / ユイ / 敵全種');
    // ユイ
    const player = createPlayerView(this, 0, 0);
    this.place(player, GAME_WIDTH / 2, 92);
    this.label(GAME_WIDTH / 2, 116, 'ユイ（忘れ物係）', 11, '#f3ead2');
    this.placePlayerPosePreview();
    this.placeYuiReadabilityCluster(GAME_WIDTH / 2, 224);

    // 敵 6種を2列で
    const cols = 2;
    const startY = 330;
    const dx = GAME_WIDTH / (cols + 1);
    const dy = 108;
    enemies.forEach((def, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = dx * (col + 1);
      const y = startY + row * dy;
      const view = createEnemyView(this, def, enemyRadiusFor(def));
      this.place(view, x, y);
      this.label(x, y + enemyRadiusFor(def) + 8, `${def.name}\n(${def.visualKind})`, 10);
    });
  }

  private placePlayerPosePreview(): void {
    const poses = [
      ['yui_idle', 'idle'],
      ['yui_move', 'move'],
      ['yui_hurt', 'hurt'],
      ['yui_ultimate', 'ultimate'],
    ] as const;
    const startX = 64;
    poses.forEach(([assetId, label], i) => {
      const x = startX + i * 80;
      const status = assetStatus(this, assetId);
      if (status === 'image') {
        this.pageRoot.add(this.add.image(x, 154, assetId).setDisplaySize(42, 42));
      } else {
        const box = this.add.rectangle(x, 154, 42, 42, COLORS.cardBg, 0.8);
        box.setStrokeStyle(1, COLORS.cardEdge, 1);
        this.pageRoot.add(box);
      }
      this.label(x, 180, `${label}\n${status}`, 9, status === 'image' ? '#cfe6f0' : '#ffbd4e', 70);
    });
  }

  private placeYuiReadabilityCluster(x: number, y: number): void {
    this.label(x, y - 30, '近接確認: 欠片 / hitCore / debug円 / 黒インク', 9, '#ffe9a8', 240);
    this.place(createPickupView(this), x - 52, y - 2);
    this.place(createHealPickupView(this), x - 30, y + 15);
    this.place(createCapsuleView(this), x + 46, y + 14);

    const player = createPlayerView(this, 0, 0);
    const debugHitCircle = player.getData('debugHitCircle') as Phaser.GameObjects.Arc | undefined;
    debugHitCircle?.setVisible(true);
    this.place(player, x, y);

    const ink = enemies.find((e) => e.visualKind === 'ink_blob');
    if (ink) this.place(createEnemyView(this, ink, enemyRadiusFor(ink)), x + 70, y - 2);
    this.label(x, y + 28, `通常芯2.5px / debug半径${PLAYER_DEFAULTS.radius}px`, 8, '#cfe6f0', 180);
  }

  private buildYuiGalleryPage(): void {
    this.heading('ユイ4ポーズ / 42px native / 判定芯');
    this.label(GAME_WIDTH / 2, 36, `42pxネイティブ hand-final候補 / visualSize=${PLAYER_DEFAULTS.visualSize}px / radius=${PLAYER_DEFAULTS.radius}`, 9, '#ffe9a8', 330);
    const poses = [
      ['yui_idle', 'idle'],
      ['yui_move', 'move'],
      ['yui_hurt', 'hurt'],
      ['yui_ultimate', 'ultimate'],
    ] as const;

    poses.forEach(([assetId, label], i) => {
      const x = 54 + i * 94;
      this.pageRoot.add(this.add.image(x, 78, assetId).setDisplaySize(42, 42));
      this.pageRoot.add(this.add.image(x, 158, assetId).setDisplaySize(126, 126));
      this.label(x, 224, `${label}\n1x / 3x`, 9, '#cfe6f0', 82);
      // Pose-level hand-final progress tag: HF=hand-final / GD=generated-draft.
      // idle is the 42px基準; the other poses are same-person差分.
      const quality = generatedQualityById.get(assetId);
      const isHandFinal = quality === 'hand-final';
      const tag = isHandFinal ? (assetId === 'yui_idle' ? 'HF 42基準' : assetId === 'yui_ultimate' ? 'HF 奥義' : 'HF 差分') : 'GD';
      this.label(x, 240, tag, 9, isHandFinal ? '#7fe0c0' : '#9db7df', 82);
    });

    this.label(GAME_WIDTH / 2, 252, '背景上・hitCore・debug円・欠片との距離', 10, '#ffe9a8', 260);
    const clusterY = 306;
    const player = createPlayerView(this, 0, 0);
    const debugHitCircle = player.getData('debugHitCircle') as Phaser.GameObjects.Arc | undefined;
    debugHitCircle?.setVisible(true);
    this.place(player, GAME_WIDTH / 2, clusterY);
    this.place(createPickupView(this), GAME_WIDTH / 2 - 50, clusterY - 2);
    this.place(createPickupView(this), GAME_WIDTH / 2 + 44, clusterY - 12);
    this.place(createHealPickupView(this), GAME_WIDTH / 2 - 34, clusterY + 28);
    this.place(createCapsuleView(this), GAME_WIDTH / 2 + 54, clusterY + 28);
    const ink = enemies.find((e) => e.visualKind === 'ink_blob');
    if (ink) this.place(createEnemyView(this, ink, enemyRadiusFor(ink)), GAME_WIDTH / 2 + 86, clusterY);
    this.label(GAME_WIDTH / 2, clusterY + 40, `hitCore常時 / debugHitCircle半径${PLAYER_DEFAULTS.radius}`, 9, '#cfe6f0', 220);

    this.pageRoot.add(
      this.add.text(12, 388, [
        '見ること:',
        '- 4ポーズが同一人物に見えるか',
        '- 顔・フード・ランタンのライティングが揃うか',
        '- ランタン/欠片/hitCoreが近すぎないか',
        '- 黒インク敵と外形が混ざらないか',
        '- collisionはこの画面で変更しない',
      ], { fontFamily: FONT, fontSize: '10px', color: '#cfc6b0', lineSpacing: 4 }).setOrigin(0, 0),
    );
  }

  /** 拾得物 + UI（HUD + レベルアップカード） */
  private buildPickupsUiPage(): void {
    // 上部はHUDが占有するため見出しは出さない（ナビにページ名あり）
    const y = 150;
    this.place(createPickupView(this), 70, y);
    this.label(70, y + 18, '記憶の欠片', 10, '#ffe9a8');
    this.place(createHealPickupView(this), 195, y);
    this.label(195, y + 18, '回復（包帯紙）', 10, '#f6d9a8');
    this.place(createCapsuleView(this), 320, y);
    this.label(320, y + 20, '記憶カプセル', 10, '#cfe6f0');

    this.label(GAME_WIDTH / 2, 196, '↑ 上のHUDは実物。↓ レベルアップカード（実物）', 10);

    // レベルアップカード（実物 / レア度違いを3枚）
    const samples: LevelUpChoice[] = [
      { type: 'weapon_new', itemId: 'night_pencil', title: '夜の鉛筆', description: '近い影へ鉛筆弾を飛ばす。', lore: '芯は短いのに、まだ書きたいことがある。', rarity: 'normal' },
      { type: 'passive_new', itemId: 'gold_compass', title: '金のコンパス', description: '記憶の欠片を拾いやすくなる。', lore: '北を指さない。', rarity: 'good' },
      { type: 'rare_new', itemId: 'name_tag', title: '✦ 誰かの名前札', description: '夜の鉛筆Lv5を覚醒させる。', lore: '黒く塗りつぶされずに残っている。', rarity: 'rare' },
    ];
    let cy = 250;
    for (const s of samples) {
      this.pageRoot.add(this.overlays.previewCard(GAME_WIDTH / 2, cy, 320, 120, s));
      cy += 132;
    }
  }

  /** 通常武器8種の弾サンプル */
  private buildWeaponsPage(): void {
    this.heading('通常武器の弾サンプル');
    const base = weapons.filter((w) => !w.tags.includes('evolved'));
    this.layoutWeapons(base, 64);
  }

  /** 進化・合体・覚醒 */
  private buildEvolutionPage(): void {
    this.heading('進化 / 合体 / 覚醒');
    const groups: Array<{ kind: EvolutionKind; title: string }> = [
      { kind: 'upgrade', title: '強化進化（武器Lv5 + 忘れ物）' },
      { kind: 'fusion', title: '合体（武器Lv5 + 武器Lv5）' },
      { kind: 'awakening', title: '覚醒（武器Lv5 + レアアイテム）' },
    ];
    let y = 46;
    for (const g of groups) {
      const evos = evolutions.filter((e) => e.kind === g.kind);
      this.pageRoot.add(this.add.text(12, y, g.title, { fontFamily: FONT, fontSize: '12px', color: '#ffe9a8' }).setOrigin(0, 0));
      // 演出サンプルボタン
      this.burstButton(GAME_WIDTH - 70, y + 6, g.kind);
      y += 22;
      const dx = GAME_WIDTH / (Math.min(evos.length, 4) + 1);
      evos.forEach((evo, i) => {
        const def = weaponById.get(evo.evolvedWeaponId);
        if (!def) return;
        const x = dx * (i + 1);
        const sampleY = y + 30;
        const w = evos.length >= 4 ? 84 : 110;
        this.renderWeaponSample(def.id, x, sampleY);
        this.label(x, sampleY + 20, def.name, 10, '#f3ead2', w);
        this.label(x, sampleY + 34, this.evolutionCondition(evo.id), 8, '#cfc6b0', w);
      });
      y += 104;
    }
  }

  /** 戦闘モック: 全部一緒に置いて視認性を確認 */
  private buildCombatMockPage(): void {
    // 上部はHUDが占有するため見出しは出さない
    const params = new URLSearchParams(window.location.search);
    const density = params.get('density') ?? 'mid';
    // playerVisual: 見た目サイズだけ比較する（本番候補 visualSize=42 / collision radius=6 は不変）。
    const visualParam = Number(params.get('playerVisual'));
    const playerVisual = Number.isFinite(visualParam) && visualParam >= 24 && visualParam <= 64
      ? visualParam
      : PLAYER_DEFAULTS.visualSize;
    const lateDensity = density === 'late';
    const midDensity = density === 'mid' || density === 'late';
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2 - 20;

    // 範囲（重ね置き）
    this.place(createAreaView(this, 60, 'ink'), cx - 70, cy + 90);
    this.place(createAreaView(this, 64, 'lamp'), cx + 70, cy + 110);
    this.place(createAreaView(this, 80, 'dawn'), cx, cy - 80);

    // 敵を周囲に
    const ring = [
      { id: 'ink_shadow', a: 0 }, { id: 'paper_scrap_shadow', a: 1 }, { id: 'lost_direction', a: 2 },
      { id: 'night_haze', a: 3 }, { id: 'black_capsule', a: 4 }, { id: 'black_label_shadow', a: 5 },
    ];
    ring.forEach(({ id, a }, i) => {
      const def = enemies.find((e) => e.id === id);
      if (!def) return;
      const ang = (a / ring.length) * Math.PI * 2;
      const r = 120 + (i % 2) * 30;
      this.place(createEnemyView(this, def, enemyRadiusFor(def)), cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * 0.9);
    });

    if (midDensity) this.placeDensityEnemies(cx, cy, lateDensity ? 18 : 10);

    // 弾を散らす
    const projKinds: Array<[string, number, number]> = [
      ['night_pencil', cx - 40, cy - 30], ['stardust_shot', cx + 50, cy - 40],
      ['postcard_blade', cx + 80, cy], ['marble', cx - 70, cy + 20], ['paper_airplane', cx + 30, cy + 50],
    ];
    for (const [id, x, y] of projKinds) {
      const def = weaponById.get(id);
      if (def) this.renderWeaponSample(def.id, x, y);
    }
    if (midDensity) this.placeDensityProjectiles(cx, cy, lateDensity ? 16 : 8);

    // 拾得物
    this.place(createPickupView(this), cx - 30, cy + 60);
    this.place(createPickupView(this), cx + 20, cy - 60);
    this.place(createHealPickupView(this), cx + 90, cy + 70);
    this.place(createCapsuleView(this), cx - 90, cy - 60);
    if (midDensity) this.placeDensityPickups(cx, cy, lateDensity);

    // ユイ（playerVisual で見た目サイズだけ変える。collision/hitCore は不変）
    const player = createPlayerView(this, 0, 0, { visualSize: playerVisual });
    if (density !== 'early') {
      const debugHitCircle = player.getData('debugHitCircle') as Phaser.GameObjects.Arc | undefined;
      debugHitCircle?.setVisible(true);
      const sizeNote = playerVisual === PLAYER_DEFAULTS.visualSize
        ? `visualSize=${playerVisual}(本番)`
        : `visualSize=${playerVisual}(比較・本番は${PLAYER_DEFAULTS.visualSize})`;
      this.pageRoot.add(
        this.add.text(10, 96, `${density} density sample: 視認性監査用 / ${sizeNote}`, {
          fontFamily: FONT, fontSize: '10px', color: '#ffe9a8',
        }).setOrigin(0, 0),
      );
    }
    this.place(player, cx, cy);
  }

  private placeDensityEnemies(cx: number, cy: number, count: number): void {
    const sample = enemies.filter((enemy) => enemy.visualKind !== 'label_elite');
    for (let i = 0; i < count; i += 1) {
      const def = sample[i % sample.length];
      const angle = (i / count) * Math.PI * 2;
      const radius = 72 + (i % 3) * 34;
      const squash = 0.78 + (i % 2) * 0.12;
      this.place(createEnemyView(this, def, enemyRadiusFor(def)), cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius * squash);
    }
  }

  private placeDensityProjectiles(cx: number, cy: number, count: number): void {
    const ids = ['night_pencil', 'marble', 'stardust_shot', 'postcard_blade', 'paper_airplane'];
    for (let i = 0; i < count; i += 1) {
      const id = ids[i % ids.length];
      const angle = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(angle) * (36 + (i % 4) * 20);
      const y = cy + Math.sin(angle) * (32 + (i % 4) * 16);
      const def = weaponById.get(id);
      if (def) this.renderWeaponSample(def.id, x, y);
    }
  }

  private placeDensityPickups(cx: number, cy: number, late: boolean): void {
    const placements: Array<[() => Phaser.GameObjects.Container, number, number]> = [
      [() => createPickupView(this), -82, -28],
      [() => createPickupView(this), -58, 42],
      [() => createPickupView(this), 62, -46],
      [() => createPickupView(this), 84, 30],
      [() => createHealPickupView(this), -104, 76],
      [() => createHealPickupView(this), 110, 76],
      [() => createCapsuleView(this), -118, -82],
      [() => createCapsuleView(this), 118, -84],
    ];
    for (const [create, x, y] of late ? placements : placements.slice(0, 4)) this.place(create(), cx + x, cy + y);
  }

  // ---- weapon sample rendering --------------------------------------------

  private layoutWeapons(list: typeof weapons, startY: number): void {
    const cols = 2;
    const dx = GAME_WIDTH / (cols + 1);
    const dy = 92;
    list.forEach((def, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = dx * (col + 1);
      const y = startY + row * dy;
      this.renderWeaponSample(def.id, x, y);
      this.label(x, y + 26, def.name, 10, '#f3ead2');
    });
  }

  /** 武器の見た目（弾/範囲/オービター）を1サンプル描く。 */
  private renderWeaponSample(weaponId: string, x: number, y: number): void {
    const def = weaponById.get(weaponId);
    if (!def) return;
    const info = weaponRenderInfo(def);
    const assetId = WEAPON_ASSET[weaponId];
    if (info.mode === 'area') {
      this.place(createAreaView(this, 30, info.areaKind, assetId), x, y);
    } else if (info.mode === 'orbit') {
      this.pageRoot.add(this.add.circle(x, y, 4, COLORS.player, 0.8));
      for (let i = 0; i < 2; i += 1) {
        const a = (i / 2) * Math.PI * 2;
        this.place(createOrbiterView(this, assetId), x + Math.cos(a) * 20, y + Math.sin(a) * 20);
      }
    } else {
      // projectile / radial / bounce: 弾を1個、右向きに
      const view = createProjectileView(this, info.projectileKind, 5, assetId);
      view.setRotation(0);
      this.place(view, x, y);
    }
  }

  /** アセット状況: 実素材 / fallback / MISSING を一覧表示。 */
  private buildAssetStatusPage(): void {
    this.heading('アセット状況（quality / fallback / 欠品）');
    let imageN = 0;
    let fallbackN = 0;
    let missingN = 0;
    let finalN = 0;
    let handFinalN = 0;
    let draftN = 0;
    for (const a of assetManifest) {
      const st = assetStatus(this, a.id);
      const q = generatedQualityById.get(a.id);
      if (st === 'image') {
        imageN += 1;
        if (q === 'hand-final') handFinalN += 1;
        else if (q === 'generated-final') finalN += 1;
        else if (q === 'generated-draft') draftN += 1;
      } else if (st === 'fallback') fallbackN += 1;
      else missingN += 1;
    }
    this.pageRoot.add(
      this.add
        .text(GAME_WIDTH / 2, 40, `image ${imageN}  GF ${finalN}  HF ${handFinalN}  GD ${draftN}  fb ${fallbackN}  miss ${missingN}`, {
          fontFamily: FONT, fontSize: '12px', color: '#f3ead2',
        })
        .setOrigin(0.5, 0),
    );

    const colW = GAME_WIDTH / 3;
    const startY = 66;
    const lineH = 18;
    const perCol = Math.ceil(assetManifest.length / 3);
    assetManifest.forEach((a, i) => {
      const col = Math.floor(i / perCol);
      const row = i % perCol;
      const x = col * colW + 8;
      const y = startY + row * lineH;
      const st = assetStatus(this, a.id);
      const quality = generatedQualityById.get(a.id);
      const color = st === 'image' ? qualityColor(quality) : st === 'fallback' ? COLORS.lantern : COLORS.hpFill;
      this.pageRoot.add(this.add.circle(x, y + 5, 3, color, 1));
      const mark = st === 'image' ? qualityMark(quality) : st === 'fallback' ? 'FB' : 'MI';
      this.pageRoot.add(
        this.add.text(x + 8, y, `${mark} ${a.id}`, { fontFamily: 'monospace', fontSize: '7px', color: '#cfc6b0' }).setOrigin(0, 0),
      );
    });

    this.pageRoot.add(
      this.add
        .text(GAME_WIDTH / 2, 684, `ユイ通常表示: visualSize=${PLAYER_DEFAULTS.visualSize}px本番候補 / radius=${PLAYER_DEFAULTS.radius}維持`, {
          fontFamily: FONT, fontSize: '9px', color: '#ffe9a8',
        })
        .setOrigin(0.5, 0),
    );
    this.pageRoot.add(
      this.add
        .text(GAME_WIDTH / 2, 700, 'GF=generated-final / HF=hand-final / GD=generated-draft / FB=fallback / MI=欠品', {
          fontFamily: FONT, fontSize: '9px', color: '#9a8d6f',
        })
        .setOrigin(0.5, 0),
    );
  }

  /** ユイ32px高密度化の比較ページ（現行 hand-final candidate vs v3 prototype）。 */
  private buildYuiRedesign32Page(): void {
    this.heading('ユイ 32px比較: 現行 vs v3 prototype');
    const proto = prototypeAssets.find((p) => p.compareWith === 'yui_idle');
    const protoId = proto?.id ?? 'yui_idle_v3_32';
    const leftX = GAME_WIDTH * 0.3;
    const rightX = GAME_WIDTH * 0.7;

    this.label(leftX, 38, '現行 yui_idle\n(hand-final candidate)', 10, '#cfe6f0', 150);
    this.label(rightX, 38, 'v3 prototype\n(32px高密度案)', 10, '#7fe0c0', 150);

    // 1x（実寸32px）
    this.label(GAME_WIDTH / 2, 74, '1x（32px原寸）', 9, '#ffe9a8', 200);
    this.placeIdleImage('yui_idle', leftX, 96, 32);
    this.placeIdleImage(protoId, rightX, 96, 32);

    // 4x + hitCore / debugHitCircle（原寸からの比率で重ねる）
    this.label(GAME_WIDTH / 2, 120, '4x + hitCore / debugHitCircle', 9, '#ffe9a8', 240);
    this.placePreview4x('yui_idle', leftX, 178);
    this.placePreview4x(protoId, rightX, 178);

    // 実背景上 + 近接（欠片 / 回復 / カプセル / 黒インク敵）
    this.label(GAME_WIDTH / 2, 248, '実背景上 + 近接（欠片/回復/カプセル/黒インク敵）', 9, '#ffe9a8', 320);
    const clusterY = 300;
    this.placeGameSizeWithCore('yui_idle', leftX, clusterY);
    this.placeGameSizeWithCore(protoId, rightX, clusterY);
    this.place(createPickupView(this), GAME_WIDTH / 2 - 8, clusterY - 18);
    this.place(createHealPickupView(this), GAME_WIDTH / 2 + 12, clusterY + 2);
    this.place(createCapsuleView(this), GAME_WIDTH / 2 - 4, clusterY + 24);
    const ink = enemies.find((e) => e.visualKind === 'ink_blob');
    if (ink) this.place(createEnemyView(this, ink, enemyRadiusFor(ink)), GAME_WIDTH / 2 + 2, clusterY - 40);

    this.pageRoot.add(
      this.add.text(12, 350, [
        '比較メモ:',
        '- 顔が読めるか（v3は顔のピクセル配分を増やした）',
        '- かわいく見えるか（丸フード / 三日月リム / 大きめ目 / 頬）',
        '- ランタンと hitCore が混ざらないか（v3は右手側にcage型で離す）',
        '- 記憶の欠片（金の星）と誤認しないか',
        '- 32pxのまま情報量/解像度感が上がっているか',
        '- 黒インク敵の中で埋もれないか（古紙色＋1px外周）',
        '',
        '注意: v3 はまだ prototype。本番 yui_idle / yui_move は未変更。',
      ], { fontFamily: FONT, fontSize: '10px', color: '#cfc6b0', lineSpacing: 4 }).setOrigin(0, 0),
    );
  }

  /** 画像 or fallback枠を表示（指定サイズ原寸系）。 */
  private placeIdleImage(id: string, x: number, y: number, size: number): void {
    const sprite = spriteOrNull(this, id, size, size);
    if (sprite) {
      sprite.setPosition(x, y);
      this.pageRoot.add(sprite);
    } else {
      const box = this.add.rectangle(x, y, size, size, COLORS.cardBg, 0.8);
      box.setStrokeStyle(1, COLORS.cardEdge, 1);
      this.pageRoot.add(box);
      this.label(x, y - 6, 'no img', 8, '#ffbd4e', 60);
    }
  }

  /** 拡大 + hitCore/debug円を表示サイズ比率で重ねる（ランタンと芯の距離を確認）。 */
  private placePreview4x(id: string, cx: number, cy: number, dispSize: number = PLAYER_DEFAULTS.visualSize): void {
    const scale = 128 / dispSize;
    const sprite = spriteOrNull(this, id, 128, 128);
    if (sprite) {
      sprite.setPosition(cx, cy);
      this.pageRoot.add(sprite);
    } else {
      const box = this.add.rectangle(cx, cy, 128, 128, COLORS.cardBg, 0.8);
      box.setStrokeStyle(1, COLORS.cardEdge, 1);
      this.pageRoot.add(box);
    }
    const debug = this.add.circle(cx, cy, PLAYER_DEFAULTS.radius * scale, 0x9fe0ff, 0.16);
    debug.setStrokeStyle(2, 0xffffff, 0.6);
    this.pageRoot.add(debug);
    const core = this.add.circle(cx, cy, 2.5 * scale, COLORS.lantern, 0.95);
    core.setStrokeStyle(1, 0xffffff, 0.9);
    this.pageRoot.add(core);
  }

  /** ゲーム表示サイズ + 原寸の hitCore/debug円（collisionは表示サイズに依らず一定）。 */
  private placeGameSizeWithCore(id: string, cx: number, cy: number, size: number = PLAYER_DEFAULTS.visualSize): void {
    const sprite = spriteOrNull(this, id, size, size);
    if (sprite) {
      sprite.setPosition(cx, cy);
      this.pageRoot.add(sprite);
    } else {
      const box = this.add.rectangle(cx, cy, size, size, COLORS.cardBg, 0.8);
      box.setStrokeStyle(1, COLORS.cardEdge, 1);
      this.pageRoot.add(box);
    }
    const debug = this.add.circle(cx, cy, PLAYER_DEFAULTS.radius, 0x9fe0ff, 0.18);
    debug.setStrokeStyle(2, 0xffffff, 0.72);
    this.pageRoot.add(debug);
    const core = this.add.circle(cx, cy, 2.5, COLORS.lantern, 0.95);
    core.setStrokeStyle(1, 0xffffff, 0.9);
    this.pageRoot.add(core);
  }

  /** 大きく表示 + hitCore/debug円を「表示サイズ基準」で重ねる（比率はゲーム時と同じ）。 */
  private placeBigWithCore(id: string, cx: number, cy: number, shownPx: number, dispSize: number): void {
    const sprite = spriteOrNull(this, id, shownPx, shownPx);
    if (sprite) {
      sprite.setPosition(cx, cy);
      this.pageRoot.add(sprite);
    } else {
      const box = this.add.rectangle(cx, cy, shownPx, shownPx, COLORS.cardBg, 0.8);
      box.setStrokeStyle(1, COLORS.cardEdge, 1);
      this.pageRoot.add(box);
    }
    const scale = shownPx / dispSize;
    const debug = this.add.circle(cx, cy, PLAYER_DEFAULTS.radius * scale, 0x9fe0ff, 0.16);
    debug.setStrokeStyle(2, 0xffffff, 0.6);
    this.pageRoot.add(debug);
    const core = this.add.circle(cx, cy, 2.5 * scale, COLORS.lantern, 0.95);
    core.setStrokeStyle(1, 0xffffff, 0.9);
    this.pageRoot.add(core);
  }

  /** ユイ 42pxネイティブ本番候補と 40/44 戻し候補の比較ページ。 */
  private buildYuiRedesign42Page(): void {
    this.heading('ユイ 42pxネイティブ本番候補 / 40・44比較');
    // [id, 表示名, native(実寸), dispSize(ゲーム表示想定)]
    const cands: Array<[string, string, number, number]> = [
      ['yui_idle_v3_32', 'v3旧案', 32, 36],
      ['yui_idle_v4_40', 'v4·40', 40, 40],
      ['yui_idle_v4_42', 'v4·42 proto', 42, 42],
      ['yui_idle', '本番idle 42', assetById.get('yui_idle')?.width ?? 42, PLAYER_DEFAULTS.visualSize],
      ['yui_idle_v4_44', 'v4·44', 44, 44],
    ];
    const xs = [46, 117, 195, 273, 348];

    // 1x実寸 + ゲーム表示サイズ
    this.label(GAME_WIDTH / 2, 34, '上=1x実寸 / 下=ゲーム表示想定サイズ（判定は常にradius=6）', 9, '#ffe9a8', 360);
    cands.forEach(([id, name, native, disp], i) => {
      const x = xs[i];
      this.placeIdleImage(id, x, 58, native);
      this.placeGameSizeWithCore(id, x, 92, disp);
      this.label(x, 112, `${name}\n${native}→${disp}px`, 8, id === 'yui_idle' || id === 'yui_idle_v4_42' ? '#7fe0c0' : '#cfe6f0', 72);
    });

    // 拡大 + hitCore/debug（v4 prototype / 本番42 / 44）
    this.label(GAME_WIDTH / 2, 146, '拡大 + hitCore / debugHitCircle（ランタンと芯の距離）', 9, '#ffe9a8', 340);
    this.placeBigWithCore('yui_idle_v4_42', 78, 206, 104, 42);
    this.label(78, 250, 'v4·42\nproto', 8, '#cfe6f0', 90);
    this.placeBigWithCore('yui_idle', 196, 206, 104, PLAYER_DEFAULTS.visualSize);
    this.label(196, 250, '本番idle\n42 native', 8, '#7fe0c0', 90);
    this.placeBigWithCore('yui_idle_v4_44', 314, 206, 104, 44);
    this.label(314, 250, 'v4·44\n戻し比較', 8, '#cfe6f0', 90);

    // 実背景上 + 近接（欠片/回復/カプセル/黒インク敵/通常弾）
    this.label(GAME_WIDTH / 2, 278, '実背景上 + 近接（欠片/回復/カプセル/黒インク敵/通常弾）', 9, '#ffe9a8', 360);
    const cy = 330;
    this.placeGameSizeWithCore('yui_idle_v4_40', 70, cy, 40);
    this.label(70, cy + 26, 'v4·40', 8, '#cfe6f0', 80);
    this.placeGameSizeWithCore('yui_idle', 175, cy, PLAYER_DEFAULTS.visualSize);
    this.label(175, cy + 26, '本番42\nnative', 8, '#7fe0c0', 80);
    this.placeGameSizeWithCore('yui_idle_v4_44', 282, cy, 44);
    this.label(282, cy + 26, 'v4·44', 8, '#7fe0c0', 80);
    // 近接物（誤認チェック）
    this.place(createPickupView(this), 120, cy - 22);
    this.place(createHealPickupView(this), 228, cy - 20);
    this.place(createCapsuleView(this), 330, cy - 6);
    const ink = enemies.find((e) => e.visualKind === 'ink_blob');
    if (ink) this.place(createEnemyView(this, ink, enemyRadiusFor(ink)), 330, cy + 22);
    this.renderWeaponSample('night_pencil', 120, cy + 26);

    this.pageRoot.add(
      this.add.text(12, 372, [
        '比較観点（collision radius=6・hitCoreは不変）:',
        '- 42pxネイティブ本番候補として顔・フード・ランタンが読めるか',
        '- ランタンと hitCore（中央の金芯）が混ざらないか',
        '- 記憶の欠片（金の星）と誤認しないか',
        '- 敵や弾を隠しすぎないか（40/42/44で覆い過ぎないか）',
        '- ヴァンサバ的な後半密度で邪魔にならないか',
        '  → /?scene=combat-mock&density=late&playerVisual=40|42|44 で実地確認',
        '',
        '注意: yui_idle/move/hurt/ultimate は42pxネイティブHF候補。',
        '実機スマホは未確認。',
      ], { fontFamily: FONT, fontSize: '9px', color: '#cfc6b0', lineSpacing: 3 }).setOrigin(0, 0),
    );
  }

  private bgPreviewIndex = 0;
  private bgEntries: BackgroundStageEntry[] = [];
  private bgMetas: Map<string, BackgroundMeta> = new Map();

  private buildBackgroundPreviewPage(): void {
    this.heading('Stage背景プロトタイプ一覧');
    loadBackgroundManifest().then(async (manifest) => {
      if (!manifest) {
        this.label(GAME_WIDTH / 2, 60, 'manifest読み込み失敗', 12, '#e0564f');
        return;
      }
      this.bgEntries = getPreviewBackgrounds(manifest);
      for (const entry of this.bgEntries) {
        const meta = await loadBackgroundMeta(entry.id);
        if (meta) this.bgMetas.set(entry.id, meta);
      }
      this.renderBgPreviewContent();
    });
  }

  private renderBgPreviewContent(): void {
    this.pageRoot.destroy();
    this.pageRoot = this.add.container(0, 0);

    const entries = this.bgEntries;
    if (entries.length === 0) {
      this.label(GAME_WIDTH / 2, 60, 'preview背景なし', 12, '#e0564f');
      return;
    }

    const entry = entries[this.bgPreviewIndex % entries.length];
    const meta = this.bgMetas.get(entry.id);
    const texKey = stageBackgroundTextureKey(entry);
    const hasTex = this.textures.exists(texKey);

    const vpW = 195;
    const vpH = 422;
    const vpX = GAME_WIDTH / 2;
    const vpY = 250;

    this.pageRoot.add(this.add.rectangle(vpX, vpY, vpW + 4, vpH + 4, 0x000000, 0.6).setOrigin(0.5));

    if (hasTex) {
      const tex = this.textures.get(texKey);
      const frame = tex.get();
      const scaleToFill = Math.max(vpW / frame.width, vpH / frame.height);
      const img = this.add.image(vpX, vpY, texKey);
      img.setScale(scaleToFill);
      const maskShape = this.add.graphics();
      maskShape.fillRect(vpX - vpW / 2, vpY - vpH / 2, vpW, vpH);
      img.setMask(maskShape.createGeometryMask());
      this.pageRoot.add(img);

      const overlayAlpha = meta?.displayAdjustments?.overlayAlpha ?? 0.18;
      if (overlayAlpha > 0) {
        this.pageRoot.add(this.add.rectangle(vpX, vpY, vpW, vpH, 0x1d1a34, overlayAlpha));
      }
    } else {
      this.pageRoot.add(this.add.rectangle(vpX, vpY, vpW, vpH, COLORS.background));
      this.label(vpX, vpY, 'image not loaded', 10, '#e0564f');
    }

    // 390x844 crop guide
    this.pageRoot.add(this.add.rectangle(vpX, vpY, vpW, vpH, 0x000000, 0).setStrokeStyle(1, 0xffffff, 0.5));

    // HUD reserve (top 80px at half scale = 40px)
    const hudH = 40;
    this.pageRoot.add(this.add.rectangle(vpX, vpY - vpH / 2 + hudH / 2, vpW, hudH, 0x000000, 0.25));
    this.label(vpX, vpY - vpH / 2 + 4, 'HUD', 8, '#ffffff', 60);

    // Bottom UI reserve (bottom 60px at half scale = 30px)
    const uiH = 30;
    this.pageRoot.add(this.add.rectangle(vpX, vpY + vpH / 2 - uiH / 2, vpW, uiH, 0x000000, 0.25));
    this.label(vpX, vpY + vpH / 2 - uiH + 2, 'UI', 8, '#ffffff', 60);

    // Gameplay readability overlay — central quiet floor
    const floorRatio = meta?.centralQuietFloorRatio ?? 0.55;
    const floorH = vpH * floorRatio;
    this.pageRoot.add(
      this.add.rectangle(vpX, vpY, vpW * 0.8, floorH, 0xffffff, 0.06).setStrokeStyle(1, 0xffffff, 0.15),
    );
    this.label(vpX, vpY + floorH / 2 - 14, `戦闘床 ${Math.round(floorRatio * 100)}%`, 7, '#ffffff', 100);

    // Stage info
    const infoX = GAME_WIDTH / 2;
    let infoY = vpY + vpH / 2 + 14;
    this.label(infoX, infoY, `Stage ${entry.number}: ${entry.name}`, 11, '#f3ead2', 360);
    infoY += 18;
    if (meta) {
      this.label(infoX, infoY, `${meta.character} / ${meta.symbol} / ${meta.primaryMisreading}`, 9, '#cfe6f0', 360);
      infoY += 14;
      this.label(infoX, infoY, `${meta.width}x${meta.height} / ${entry.status}`, 9, '#9a8d6f', 360);
      infoY += 14;
      this.label(infoX, infoY, meta.mainLandmark, 9, '#ffe9a8', 360);
    }

    // Nav buttons
    const navY = 34;
    if (entries.length > 1) {
      const prevBtn = this.add.circle(30, navY, 14, COLORS.cardBg, 1)
        .setDepth(VIEW_DEPTH.hud + 3).setInteractive({ useHandCursor: true });
      prevBtn.setStrokeStyle(1, COLORS.cardEdge, 1);
      prevBtn.on('pointerdown', () => { this.bgPreviewIndex = (this.bgPreviewIndex - 1 + entries.length) % entries.length; this.renderBgPreviewContent(); });
      this.pageRoot.add(prevBtn);
      this.pageRoot.add(this.add.text(30, navY, '◀', { fontFamily: FONT, fontSize: '12px', color: '#3a3326' }).setOrigin(0.5).setDepth(VIEW_DEPTH.hud + 4));

      const nextBtn = this.add.circle(GAME_WIDTH - 30, navY, 14, COLORS.cardBg, 1)
        .setDepth(VIEW_DEPTH.hud + 3).setInteractive({ useHandCursor: true });
      nextBtn.setStrokeStyle(1, COLORS.cardEdge, 1);
      nextBtn.on('pointerdown', () => { this.bgPreviewIndex = (this.bgPreviewIndex + 1) % entries.length; this.renderBgPreviewContent(); });
      this.pageRoot.add(nextBtn);
      this.pageRoot.add(this.add.text(GAME_WIDTH - 30, navY, '▶', { fontFamily: FONT, fontSize: '12px', color: '#3a3326' }).setOrigin(0.5).setDepth(VIEW_DEPTH.hud + 4));
    }

    this.titleText.setText(`${this.page + 1}/${PAGES.length}  ${PAGES[this.page]}  [${this.bgPreviewIndex + 1}/${entries.length}]`);
  }

  private burstButton(x: number, y: number, kind: EvolutionKind): void {
    const bg = this.add.rectangle(x, y, 86, 18, COLORS.cardBg, 1).setOrigin(0.5, 0).setDepth(VIEW_DEPTH.hud).setInteractive({ useHandCursor: true });
    bg.setStrokeStyle(1, COLORS.cardEdge, 1);
    bg.on('pointerdown', () => evolutionBurst(this, GAME_WIDTH / 2, GAME_HEIGHT / 2, '演出サンプル', kind));
    this.pageRoot.add(bg);
    this.pageRoot.add(this.add.text(x, y + 3, '演出を見る', { fontFamily: FONT, fontSize: '10px', color: '#3a3326' }).setOrigin(0.5, 0).setDepth(VIEW_DEPTH.hud + 1));
  }

  private evolutionCondition(evolutionId: string): string {
    const evo = evolutions.find((e) => e.id === evolutionId);
    if (!evo) return '';
    const from = weaponById.get(evo.fromWeaponId)?.name ?? evo.fromWeaponId;
    if (evo.kind === 'fusion' && evo.requiredWeaponId) {
      const w2 = weaponById.get(evo.requiredWeaponId)?.name ?? evo.requiredWeaponId;
      return `${from} + ${w2}`;
    }
    if (evo.kind === 'awakening' && evo.requiredRareItemId) {
      const r = rareItemById.get(evo.requiredRareItemId)?.name ?? evo.requiredRareItemId;
      return `${from} + ${r}`;
    }
    if (evo.kind === 'upgrade' && evo.requiredPassiveId) {
      const p = passiveById.get(evo.requiredPassiveId)?.name ?? evo.requiredPassiveId;
      return `${from} + ${p}`;
    }
    return from;
  }
}

function qualityMark(quality: PixelAssetQuality | undefined): string {
  if (quality === 'hand-final') return 'HF';
  if (quality === 'generated-final') return 'GF';
  if (quality === 'generated-draft') return 'GD';
  return 'IM';
}

function qualityColor(quality: PixelAssetQuality | undefined): number {
  if (quality === 'hand-final') return 0x7fe0c0;
  if (quality === 'generated-final') return 0x8fd0a0;
  if (quality === 'generated-draft') return 0x9db7df;
  return 0xcfc6b0;
}

/** HUD表示用のショーケース state（ゲームを開始せずHUDを描くための擬似状態）。 */
function showcaseState(): RuntimeState {
  return {
    status: 'playing',
    runId: 'gallery',
    stageNumber: 1,
    durationSec: 480,
    elapsedSec: 138,
    characterId: 'yui',
    player: { level: 8, xp: 14, xpToNext: 40, hp: 78, maxHp: 110 },
    ultimate: { ready: false, charge: 38, chargeSeconds: 60 },
    inventory: {
      weapons: [
        { id: 'night_pencil', level: 5, cooldownRemaining: 0 },
        { id: 'marble', level: 3, cooldownRemaining: 0 },
        { id: 'streetlamp_ring', level: 2, cooldownRemaining: 0 },
      ],
      passives: [
        { id: 'gold_compass', level: 2 },
        { id: 'travel_badge', level: 1 },
      ],
      rareItems: [{ id: 'name_tag' }],
      evolvedWeaponIds: [],
      weaponSlots: 5,
      passiveSlots: 5,
      rareItemSlots: 2,
    },
    stats: {
      kills: 6,
      elitesKilled: 0,
      xpCollected: 14,
      memoryFragmentsCollected: 0,
      capsulesOpened: 0,
      evolutions: [],
      ultimateUses: 0,
      pairUltimateUses: 0,
      berserkUses: 0,
      damageTaken: 32,
      levelUps: 7,
      survivedSec: 138,
      newCodexEntries: [],
      unlockedAchievements: [],
    },
    debug: false,
  } as unknown as RuntimeState;
}
