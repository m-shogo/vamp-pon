import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import type { LevelUpChoice } from '../domain/types';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../domain/constants';
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
import { assetManifest, WEAPON_ASSET } from '../assets/assetManifest';
import { assetStatus } from '../assets/assetHelpers';

const PAGES = ['背景・ユイ・敵', '拾得物・UI', '通常武器', '進化・合体・覚醒', '戦闘モック', 'アセット状況'] as const;

/** URLのscene指定から初期ページを決める。 */
export function pageFromUrl(): number {
  const params = new URLSearchParams(window.location.search);
  const scene = params.get('scene') ?? params.get('debug') ?? '';
  if (scene === 'combat-mock') return 4;
  if (scene === 'evolution-showcase') return 3;
  if (scene === 'asset-status') return 5;
  return 0;
}

const GALLERY_SCENES = ['visual-gallery', 'combat-mock', 'evolution-showcase', 'asset-status'];

/** ?scene= / ?debug= がギャラリー系か。 */
export function isGalleryUrl(): boolean {
  const params = new URLSearchParams(window.location.search);
  const scene = params.get('scene') ?? params.get('debug') ?? '';
  return GALLERY_SCENES.includes(scene);
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
      case 1: this.buildPickupsUiPage(); break;
      case 2: this.buildWeaponsPage(); break;
      case 3: this.buildEvolutionPage(); break;
      case 4: this.buildCombatMockPage(); break;
      case 5: this.buildAssetStatusPage(); break;
    }

    const showHud = this.page === 1 || this.page === 4;
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

    // 敵 6種を2列で
    const cols = 2;
    const startY = 200;
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

    // 弾を散らす
    const projKinds: Array<[string, number, number]> = [
      ['night_pencil', cx - 40, cy - 30], ['stardust_shot', cx + 50, cy - 40],
      ['postcard_blade', cx + 80, cy], ['marble', cx - 70, cy + 20], ['paper_airplane', cx + 30, cy + 50],
    ];
    for (const [id, x, y] of projKinds) {
      const def = weaponById.get(id);
      if (def) this.renderWeaponSample(def.id, x, y);
    }

    // 拾得物
    this.place(createPickupView(this), cx - 30, cy + 60);
    this.place(createPickupView(this), cx + 20, cy - 60);
    this.place(createHealPickupView(this), cx + 90, cy + 70);
    this.place(createCapsuleView(this), cx - 90, cy - 60);

    // ユイ
    this.place(createPlayerView(this, 0, 0), cx, cy);
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
        this.place(createOrbiterView(this), x + Math.cos(a) * 20, y + Math.sin(a) * 20);
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
    this.heading('アセット状況（実素材 / fallback / 欠品）');
    let imageN = 0;
    let fallbackN = 0;
    let missingN = 0;
    for (const a of assetManifest) {
      const st = assetStatus(this, a.id);
      if (st === 'image') imageN += 1;
      else if (st === 'fallback') fallbackN += 1;
      else missingN += 1;
    }
    this.pageRoot.add(
      this.add
        .text(GAME_WIDTH / 2, 40, `実素材 ${imageN}  /  fallback ${fallbackN}  /  欠品 ${missingN}`, {
          fontFamily: FONT, fontSize: '12px', color: '#f3ead2',
        })
        .setOrigin(0.5, 0),
    );

    const colW = GAME_WIDTH / 2;
    const startY = 66;
    const lineH = 22;
    const perCol = Math.ceil(assetManifest.length / 2);
    assetManifest.forEach((a, i) => {
      const col = Math.floor(i / perCol);
      const row = i % perCol;
      const x = col * colW + 12;
      const y = startY + row * lineH;
      const st = assetStatus(this, a.id);
      const color = st === 'image' ? 0x8fd0a0 : st === 'fallback' ? COLORS.lantern : COLORS.hpFill;
      this.pageRoot.add(this.add.circle(x, y + 6, 4, color, 1));
      const mark = st === 'image' ? '実' : st === 'fallback' ? '仮' : '欠';
      this.pageRoot.add(
        this.add.text(x + 10, y, `${mark} ${a.id}`, { fontFamily: 'monospace', fontSize: '9px', color: '#cfc6b0' }).setOrigin(0, 0),
      );
    });

    this.pageRoot.add(
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT - 66, '緑=実素材 / 黄=Graphics仮 / 赤=欠品。仕様は assetManifest.ts', {
          fontFamily: FONT, fontSize: '9px', color: '#9a8d6f',
        })
        .setOrigin(0.5, 0),
    );
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

/** HUD表示用のショーケース state（ゲームを開始せずHUDを描くための擬似状態）。 */
function showcaseState(): RuntimeState {
  return {
    status: 'playing',
    runId: 'gallery',
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
    debug: false,
  } as unknown as RuntimeState;
}
