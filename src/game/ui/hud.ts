import Phaser from 'phaser';
import type { BerserkState, RuntimeState } from '../runtime';
import { GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { characterById } from '../data/characters';
import { BATTLE_HUD_UI_ASSET_KEYS } from '../assets/battleHudUiAssets';
import { InventorySlotView } from './inventorySlot';
import { attachPressFeedback } from './pressFeedback';
import {
  STORYBOOK_FONT,
  STORYBOOK_NUMBER_FONT,
  STORYBOOK_UI,
  drawBar,
  drawFragment,
  drawHeart,
  drawPause,
  drawStar,
} from './storybookUi';
import { drawPremiumPaperCard, drawWaxSeal } from './premiumPaperUi';

const DEPTH = VIEW_DEPTH.hud;
const TOP_HEIGHT = 126;
const LV_TAG = { x: 34, y: 48, w: 56, h: 78 } as const;
const GAUGE_FRAME = { x: 124, y: 44, w: 116, h: 46 } as const;
const DAWN_TAG = { x: 214, y: 48, w: 62, h: 72 } as const;
const CURRENCY_TAG = { x: 294, y: 45, w: 82, h: 58 } as const;
const MENU_TAG = { x: 364, y: 45, w: 44, h: 64, hitW: 48, hitH: 64 } as const;
const MEMORY_BAR = { x: 195, y: 106, w: 330, h: 36 } as const;
const BOTTLE = { x: 50, y: 660, w: 70, h: 138 } as const;
const BOTTLE_LABEL = { x: 50, y: 730, w: 108, h: 27 } as const;
const INVENTORY_SLOT_CENTERS = [55, 125, 195, 265, 335] as const;
const INVENTORY_SLOT_Y = 803;
const INVENTORY_SLOT_W = 60;
const INVENTORY_SLOT_H = 74;
const INVENTORY_ICON_SIZE = 34;
const ULT_X = 323;
const ULT_Y = 684;
const ULT_W = 94;
const ULT_H = 92;
const ULT_LABEL = { x: 323, y: 742, w: 86, h: 28 } as const;
const SPEED_X = 351;
const SPEED_Y = 128;
const SPEED_W = 56;
const SPEED_H = 24;
const EMPTY_BERSERK: BerserkState = {
  maxCharge: 100,
  charge: 0,
  ready: false,
  durationSec: 8,
  activeRemaining: 0,
  fatigueRemaining: 0,
};

type InputEventLike = { stopPropagation?: () => void };
type HudImageSpec = {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  depth?: number;
  fallback: (graphics: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number) => void;
};

type HudImageLayer = {
  image: Phaser.GameObjects.Image | null;
  fallback: Phaser.GameObjects.Graphics | null;
};

export class Hud {
  private topBack: Phaser.GameObjects.Graphics;
  private hpText: Phaser.GameObjects.Text;
  private xpText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private fragmentText: Phaser.GameObjects.Text;
  private memoryStreetText: Phaser.GameObjects.Text;
  private memoryCountText: Phaser.GameObjects.Text;
  private memoryProgress: Phaser.GameObjects.Graphics;
  private hpDamageBar: Phaser.GameObjects.Graphics;
  private hpBar: Phaser.GameObjects.Graphics;
  private xpBar: Phaser.GameObjects.Graphics;
  private xpHighlight: Phaser.GameObjects.Graphics;
  private topIcons: Phaser.GameObjects.Graphics;
  private pauseZone: Phaser.GameObjects.Zone;
  private pausePressVisual: Phaser.GameObjects.Container;
  private speedBack: Phaser.GameObjects.Graphics;
  private speedText: Phaser.GameObjects.Text;
  private speedZone: Phaser.GameObjects.Zone;
  private speedPressVisual: Phaser.GameObjects.Container;
  private inventoryBack: Phaser.GameObjects.Graphics;
  private portraitFrame: Phaser.GameObjects.Graphics;
  private portraitCharge: Phaser.GameObjects.Graphics;
  private portraitFlame: Phaser.GameObjects.Graphics;
  private portraitPressVisual: Phaser.GameObjects.Container;
  private portraitImage: Phaser.GameObjects.Image | null;
  private portraitFallback: Phaser.GameObjects.Text;
  private crestImage: Phaser.GameObjects.Image | null;
  private berserkText: Phaser.GameObjects.Text;
  private bottleLabelImage: Phaser.GameObjects.Image | null;
  private bottleLabelFallback: Phaser.GameObjects.Graphics | null;
  private portraitZone: Phaser.GameObjects.Zone;
  private ultimateBack: Phaser.GameObjects.Graphics;
  private ultimateText: Phaser.GameObjects.Text;
  private ultimateImage: Phaser.GameObjects.Image | null;
  private ultimateFallback: Phaser.GameObjects.Graphics | null;
  private ultimateLabelImage: Phaser.GameObjects.Image | null;
  private ultimateLabelFallback: Phaser.GameObjects.Graphics | null;
  private ultimatePressVisual: Phaser.GameObjects.Container;
  private ultimateZone: Phaser.GameObjects.Zone;
  private weaponSlots: InventorySlotView[];
  private passiveSlots: InventorySlotView[];
  private rareSlots: InventorySlotView[];
  private hudImages: Phaser.GameObjects.Image[] = [];
  private hudFallbacks: Phaser.GameObjects.Graphics[] = [];
  private inventorySlotBacks: HudImageLayer[] = [];
  private inventoryCategoryDots: Phaser.GameObjects.Graphics[] = [];
  private debugText: Phaser.GameObjects.Text;
  private delayedHpRatio = 1;
  private previousHpRatio = 1;
  private previousXpRatio = 0;
  private hpShakeUntilMs = 0;
  private xpHighlightUntilMs = 0;
  private ultimateReadyNotified = false;

  constructor(
    private scene: Phaser.Scene,
    private onUltimate: () => void,
    private onBerserk: () => void = () => {},
    private onPause: () => void = () => {},
    private onSpeedToggle: () => void = () => {},
  ) {
    this.topBack = scene.add.graphics().setDepth(DEPTH);
    this.topBack.fillStyle(STORYBOOK_UI.deepNight, 0.22).fillRect(0, 0, GAME_WIDTH, TOP_HEIGHT);
    this.topBack.fillStyle(STORYBOOK_UI.deepNight, 0.18).fillRect(0, TOP_HEIGHT - 10, GAME_WIDTH, 10);
    this.topBack.lineStyle(1, STORYBOOK_UI.paperDark, 0.14).lineBetween(0, TOP_HEIGHT, GAME_WIDTH, TOP_HEIGHT);

    this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.paperTagLv,
      ...LV_TAG,
      fallback: drawHangingPaperFallback,
    });
    this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.dualGaugeFrame,
      ...GAUGE_FRAME,
      fallback: drawGaugeFrameFallback,
    });
    this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.paperTagDawn,
      ...DAWN_TAG,
      fallback: drawHangingPaperFallback,
    });
    this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.paperTagCurrency,
      ...CURRENCY_TAG,
      fallback: drawPaperPanelFallback,
    });
    this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.paperTagMenu,
      ...MENU_TAG,
      fallback: drawHangingPaperFallback,
    });
    this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.memoryStreetProgressFrame,
      ...MEMORY_BAR,
      fallback: drawMemoryFrameFallback,
    });

    this.topIcons = scene.add.graphics().setDepth(DEPTH + 2);
    drawHeart(this.topIcons, 78, 32, 13);
    drawStar(this.topIcons, 78, 56, 8, STORYBOOK_UI.goldLight, STORYBOOK_UI.paperDark, 1);
    drawFragment(this.topIcons, 268, 35, 6);
    drawFragment(this.topIcons, 268, 57, 6);
    drawPause(this.topIcons, MENU_TAG.x, MENU_TAG.y + 2, 28);

    this.hpText = scene.add.text(132, 31, '100 / 100', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '13px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#0a0816',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 3);

    this.xpText = scene.add.text(132, 55, '0 / 10', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '12px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#0a0816',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 3);

    this.timeText = scene.add.text(DAWN_TAG.x, DAWN_TAG.y - 2, 'Dawn\n04:32', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '14px',
      color: '#2a1720',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 3).setLineSpacing(2);

    this.levelText = scene.add.text(LV_TAG.x, LV_TAG.y + 2, 'LV\n1', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '18px',
      color: '#1b1114',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 3).setLineSpacing(3);

    this.fragmentText = scene.add.text(CURRENCY_TAG.x + 10, CURRENCY_TAG.y + 1, '0\n0', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '16px',
      color: '#201117',
      fontStyle: 'bold',
      align: 'left',
      resolution: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 3).setLineSpacing(3);

    this.hpDamageBar = scene.add.graphics().setDepth(DEPTH + 1);
    this.hpBar = scene.add.graphics().setDepth(DEPTH + 2);
    this.xpBar = scene.add.graphics().setDepth(DEPTH + 2);
    this.xpHighlight = scene.add.graphics().setDepth(DEPTH + 3);

    this.pausePressVisual = scene.add.container(MENU_TAG.x, MENU_TAG.y).setDepth(DEPTH + 6);
    this.pauseZone = scene.add.zone(MENU_TAG.x, MENU_TAG.y, MENU_TAG.hitW, MENU_TAG.hitH)
      .setOrigin(0.5)
      .setDepth(DEPTH + 7)
      .setInteractive({ useHandCursor: true });
    attachPressFeedback(scene, this.pauseZone, this.pausePressVisual, {
      x: MENU_TAG.x,
      y: MENU_TAG.y,
      width: MENU_TAG.hitW,
      height: MENU_TAG.hitH,
      accent: STORYBOOK_UI.gold,
      depth: DEPTH + 8,
      shake: true,
    });
    this.pauseZone.on(
      Phaser.Input.Events.POINTER_DOWN,
      (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event?: InputEventLike) => {
        event?.stopPropagation?.();
        this.onPause();
      },
    );

    this.memoryProgress = scene.add.graphics().setDepth(DEPTH + 3);
    this.memoryStreetText = scene.add.text(66, MEMORY_BAR.y - 2, 'Memory Street 1', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: '#f3ead2',
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#090714',
      strokeThickness: 2,
    }).setOrigin(0, 0.5).setDepth(DEPTH + 4);
    this.memoryCountText = scene.add.text(315, MEMORY_BAR.y + 10, '0 / 18', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '11px',
      color: '#f3ead2',
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#090714',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 4).setVisible(false);

    this.speedBack = scene.add.graphics().setDepth(DEPTH + 5);
    this.speedText = scene.add.text(SPEED_X, SPEED_Y, 'x1.0', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '11px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 6);
    this.speedPressVisual = scene.add.container(SPEED_X, SPEED_Y).setDepth(DEPTH + 8);
    this.speedZone = scene.add.zone(SPEED_X, SPEED_Y, SPEED_W, SPEED_H)
      .setOrigin(0.5)
      .setDepth(DEPTH + 9)
      .setInteractive({ useHandCursor: true });
    attachPressFeedback(scene, this.speedZone, this.speedPressVisual, {
      x: SPEED_X,
      y: SPEED_Y,
      width: SPEED_W,
      height: SPEED_H,
      accent: STORYBOOK_UI.goldLight,
      depth: DEPTH + 10,
      strong: true,
      shake: true,
    });
    this.speedZone.on(
      Phaser.Input.Events.POINTER_DOWN,
      (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event?: InputEventLike) => {
        event?.stopPropagation?.();
        this.onSpeedToggle();
      },
    );

    this.inventoryBack = scene.add.graphics().setDepth(DEPTH);
    this.inventoryBack.fillStyle(STORYBOOK_UI.deepNight, 0.2).fillRect(0, 760, GAME_WIDTH, 84);
    this.inventoryBack.lineStyle(1, STORYBOOK_UI.paperDark, 0.12).lineBetween(0, 760, GAME_WIDTH, 760);

    this.portraitFrame = scene.add.graphics().setDepth(DEPTH + 1);
    this.portraitFlame = scene.add.graphics().setDepth(DEPTH + 3);
    this.portraitCharge = scene.add.graphics().setDepth(DEPTH + 4);
    this.portraitPressVisual = scene.add.container(BOTTLE.x, BOTTLE.y + 12).setDepth(DEPTH + 7);
    const bottleLayer = this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.kokuyouBottleFrame,
      ...BOTTLE,
      depth: DEPTH + 5,
      fallback: drawBottleFallback,
    });
    this.portraitImage = bottleLayer.image;
    this.portraitFallback = scene.add.text(BOTTLE.x, BOTTLE.y, '', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '20px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 2).setVisible(false);
    this.crestImage = null;
    const labelLayer = this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.kokuyouBottleLabelRuntime,
      ...BOTTLE_LABEL,
      depth: DEPTH + 5,
      fallback: drawPaperPanelFallback,
    });
    this.bottleLabelImage = labelLayer.image;
    this.bottleLabelFallback = labelLayer.fallback;
    this.berserkText = scene.add.text(BOTTLE_LABEL.x, BOTTLE_LABEL.y, '黒曜\n0%', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '10px',
      color: '#1b0e16',
      fontStyle: 'bold',
      align: 'center',
      resolution: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 6).setLineSpacing(-2);
    this.portraitZone = scene.add.zone(BOTTLE.x, BOTTLE.y + 12, 82, 166)
      .setOrigin(0.5)
      .setDepth(DEPTH + 8)
      .setInteractive({ useHandCursor: true });
    attachPressFeedback(scene, this.portraitZone, this.portraitPressVisual, {
      x: BOTTLE.x,
      y: BOTTLE.y + 12,
      width: 82,
      height: 166,
      accent: 0xffc06a,
      depth: DEPTH + 9,
      strong: true,
      shake: true,
    });
    this.portraitZone.on(
      Phaser.Input.Events.POINTER_DOWN,
      (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event?: InputEventLike) => {
        event?.stopPropagation?.();
        this.onBerserk();
      },
    );

    this.ultimateBack = scene.add.graphics().setDepth(DEPTH + 2);
    const ultimateLayer = this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.ultimateSealLanternButton,
      x: ULT_X,
      y: ULT_Y,
      w: ULT_W,
      h: ULT_H,
      depth: DEPTH + 2,
      fallback: drawUltimateFallback,
    });
    this.ultimateImage = ultimateLayer.image;
    this.ultimateFallback = ultimateLayer.fallback;
    const ultimateLabelLayer = this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.ultimateButtonLabel,
      ...ULT_LABEL,
      depth: DEPTH + 2,
      fallback: drawPaperPanelFallback,
    });
    this.ultimateLabelImage = ultimateLabelLayer.image;
    this.ultimateLabelFallback = ultimateLabelLayer.fallback;
    this.ultimateText = scene.add.text(ULT_LABEL.x, ULT_LABEL.y, '必殺', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: '#1b0e16',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 3);
    this.ultimatePressVisual = scene.add.container(ULT_X, ULT_Y).setDepth(DEPTH + 6);
    this.ultimateZone = scene.add.zone(ULT_X, ULT_Y, 104, 112)
      .setOrigin(0.5)
      .setDepth(DEPTH + 7)
      .setInteractive({ useHandCursor: true });
    attachPressFeedback(scene, this.ultimateZone, this.ultimatePressVisual, {
      x: ULT_X,
      y: ULT_Y,
      width: 104,
      height: 112,
      accent: STORYBOOK_UI.goldLight,
      depth: DEPTH + 9,
      strong: true,
      shake: true,
    });
    this.ultimateZone.on(
      Phaser.Input.Events.POINTER_DOWN,
      (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event?: InputEventLike) => {
        event?.stopPropagation?.();
        this.onUltimate();
      },
    );

    this.inventorySlotBacks = INVENTORY_SLOT_CENTERS.map((x) => this.addHudImage({
      key: BATTLE_HUD_UI_ASSET_KEYS.inventoryPaperSlot,
      x,
      y: INVENTORY_SLOT_Y,
      w: INVENTORY_SLOT_W,
      h: INVENTORY_SLOT_H,
      fallback: drawInventorySlotFallback,
    }));
    this.weaponSlots = INVENTORY_SLOT_CENTERS.map((x) => new InventorySlotView(scene, x, INVENTORY_SLOT_Y + 8, INVENTORY_ICON_SIZE, DEPTH + 4, 'weapon'));
    this.inventoryCategoryDots = INVENTORY_SLOT_CENTERS.map((x) => scene.add.graphics().setDepth(DEPTH + 6).setPosition(x, INVENTORY_SLOT_Y));
    this.passiveSlots = [];
    this.rareSlots = [];

    this.debugText = scene.add.text(8, 140, '', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#9fe0a0',
      backgroundColor: '#11151ccc',
      padding: { left: 4, right: 4, top: 3, bottom: 3 },
    }).setDepth(DEPTH + 8).setVisible(false);
  }

  update(state: RuntimeState): void {
    const remain = Math.max(0, Math.ceil(state.durationSec - state.elapsedSec));
    const minutes = Math.floor(remain / 60).toString().padStart(2, '0');
    const seconds = (remain % 60).toString().padStart(2, '0');
    this.timeText.setText(`Dawn\n${minutes}:${seconds}`);
    this.levelText.setText(`LV\n${state.player.level}`);
    this.fragmentText.setText(`${state.stats?.memoryFragmentsCollected ?? 0}\n${state.stats?.kills ?? 0}`);
    this.memoryStreetText.setText(`Memory Street ${state.stageNumber}`);
    const targetKills = Math.max(18, state.stageNumber * 18);
    this.memoryCountText.setText(`${Math.min(state.stats?.kills ?? 0, targetKills)} / ${targetKills}`);
    this.drawMemoryProgress(Math.min(1, (state.stats?.kills ?? 0) / targetKills));
    this.updateSpeedButton(state.speedMultiplier ?? 1);

    const player = state.player;
    const hpRatio = Math.max(0, player.hp / player.maxHp);
    if (hpRatio < this.previousHpRatio - 0.001) {
      this.hpShakeUntilMs = this.scene.time.now + 240;
      this.delayedHpRatio = Math.max(this.delayedHpRatio, this.previousHpRatio);
    }
    this.previousHpRatio = hpRatio;
    this.delayedHpRatio += (hpRatio - this.delayedHpRatio) * 0.08;
    if (this.delayedHpRatio < hpRatio) this.delayedHpRatio = hpRatio;
    const shake = this.scene.time.now < this.hpShakeUntilMs
      ? Math.sin(this.scene.time.now * 0.09) * 2
      : 0;
    this.hpText.setText(`${Math.ceil(player.hp)} / ${player.maxHp}`);
    this.hpText.setColor(shake !== 0 && Math.floor(this.scene.time.now / 70) % 2 === 0 ? '#ffd6d6' : STORYBOOK_UI.textLight);
    this.hpDamageBar.clear();
    this.hpDamageBar.x = shake;
    drawBar(this.hpDamageBar, 92, 28, 76, 8, this.delayedHpRatio, STORYBOOK_UI.hpBack, 0x9f2438);
    this.hpBar.clear();
    this.hpBar.x = shake;
    drawBar(this.hpBar, 92, 28, 76, 8, hpRatio, STORYBOOK_UI.hpBack, STORYBOOK_UI.hp);

    const xpRatio = Math.max(0, Math.min(1, player.xp / player.xpToNext));
    if (xpRatio > this.previousXpRatio + 0.001 || (this.previousXpRatio > 0.9 && xpRatio < 0.1)) {
      this.xpHighlightUntilMs = this.scene.time.now + 260;
    }
    this.previousXpRatio = xpRatio;
    this.xpText.setText(`${Math.floor(player.xp)} / ${player.xpToNext}`);
    this.xpBar.clear();
    drawBar(this.xpBar, 92, 52, 76, 7, xpRatio, 0x1a1428, STORYBOOK_UI.xp);
    this.drawXpHighlight(xpRatio);

    const berserk = state.berserk ?? EMPTY_BERSERK;
    const ultimateRatio = Math.max(0, Math.min(1, state.ultimate.ready ? 1 : state.ultimate.charge / state.ultimate.chargeSeconds));
    this.drawUltimate(ultimateRatio, state.ultimate.ready, berserk.activeRemaining > 0);
    const ultimateName = characterById.get(state.characterId)?.ultimate.name ?? '必殺技';
    this.ultimateZone.setName(ultimateName);
    this.updatePortrait(berserk);
    this.updateInventory(state);

    if (state.debug) {
      const sceneWithDebug = this.scene as unknown as { gameFeelDebug?: () => { particleCount: number; waveMultiplier: number; currentMaxEnemies: number; comboCount: number; xpPerMin: number } };
      const gameFeelDebug = typeof sceneWithDebug.gameFeelDebug === 'function'
        ? sceneWithDebug.gameFeelDebug()
        : null;
      let expGemCount = 0;
      for (const pickup of state.pickups ?? []) {
        if (pickup.kind === 'fragment') expGemCount += 1;
      }
      this.debugText.setVisible(true).setText([
        `t=${state.elapsedSec.toFixed(1)} x${(state.speedMultiplier ?? 1).toFixed(1)} status=${state.status}`,
        `fps=${Math.round(this.scene.game.loop.actualFps)} enemies=${state.enemies?.length ?? 0}/${gameFeelDebug?.currentMaxEnemies ?? '-'}`,
        `proj=${state.projectiles?.length ?? 0} exp=${expGemCount} particles=${gameFeelDebug?.particleCount ?? 0}`,
        `wave=${gameFeelDebug?.waveMultiplier.toFixed(2) ?? '1.00'} combo=${gameFeelDebug?.comboCount ?? 0} xp/m=${gameFeelDebug?.xpPerMin.toFixed(1) ?? '0.0'}`,
        `hp=${player.hp.toFixed(0)} lv=${player.level} xp=${player.xp.toFixed(1)}/${player.xpToNext}`,
        `Lv2=${state.telemetry.level2Sec?.toFixed(1) ?? '-'} Lv3=${state.telemetry.level3Sec?.toFixed(1) ?? '-'} areas=${state.areas?.length ?? 0}`,
        `blackLuster=${berserk.charge.toFixed(0)}/${berserk.maxCharge} active=${berserk.activeRemaining.toFixed(1)}`,
        `kills=${state.stats?.kills ?? 0} fragments=${state.stats?.memoryFragmentsCollected ?? 0}`,
      ].join('\n'));
    } else {
      this.debugText.setVisible(false);
    }
  }

  private addHudImage(spec: HudImageSpec): HudImageLayer {
    if (this.scene.textures.exists(spec.key)) {
      const image = this.scene.add.image(spec.x, spec.y, spec.key)
        .setDisplaySize(spec.w, spec.h)
        .setDepth(spec.depth ?? DEPTH + 1);
      this.hudImages.push(image);
      return { image, fallback: null };
    }

    const fallback = this.scene.add.graphics().setDepth(spec.depth ?? DEPTH + 1);
    spec.fallback(fallback, spec.x, spec.y, spec.w, spec.h);
    this.hudFallbacks.push(fallback);
    return { image: null, fallback };
  }

  private drawMemoryProgress(ratio: number): void {
    this.memoryProgress.clear();
    const left = MEMORY_BAR.x - 68;
    const right = MEMORY_BAR.x + 92;
    const y = MEMORY_BAR.y - 1;
    this.memoryProgress.lineStyle(1, STORYBOOK_UI.paperDark, 0.5).lineBetween(left, y, right, y);
    this.memoryProgress.lineStyle(1, STORYBOOK_UI.goldLight, 0.42).lineBetween(left, y, left + (right - left) * ratio, y);
    for (let i = 0; i <= 7; i += 1) {
      const x = left + ((right - left) / 7) * i;
      const reached = i / 7 <= ratio;
      drawStar(this.memoryProgress, x, y, reached ? 4 : 3, reached ? STORYBOOK_UI.goldLight : STORYBOOK_UI.paperDark, STORYBOOK_UI.inkBlack, reached ? 0.9 : 0.42);
    }
  }

  private updateSpeedButton(speedMultiplier: number): void {
    const isFast = speedMultiplier > 1.01;
    this.speedBack.clear();
    const sl = Math.round(SPEED_X - SPEED_W / 2);
    const st = Math.round(SPEED_Y - SPEED_H / 2);
    this.speedBack.fillStyle(isFast ? 0x1e1508 : STORYBOOK_UI.deepNight, 0.94).fillRect(sl, st, SPEED_W, SPEED_H);
    this.speedBack.lineStyle(1, isFast ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.paperDark, isFast ? 0.82 : 0.48).strokeRect(sl, st, SPEED_W, SPEED_H);
    if (isFast) {
      this.speedBack.fillStyle(STORYBOOK_UI.warmAmber, 0.1).fillRect(sl + 2, st + 2, SPEED_W - 4, SPEED_H - 4);
    }
    this.speedText.setText(`x${speedMultiplier.toFixed(1)}`);
    this.speedText.setColor(isFast ? '#ffe8a8' : STORYBOOK_UI.textLight);
  }

  private drawUltimate(ratio: number, ready: boolean, locked: boolean): void {
    const accent = locked ? 0x665d78 : ready ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.paperDark;
    const pulse = ready && !locked ? 0.5 + 0.5 * Math.sin(this.scene.time.now * 0.006) : 0;
    this.ultimateBack.clear();
    if (!this.ultimateImage) {
      drawWaxSeal(this.ultimateBack, ULT_X, ULT_Y, 39, {
        color: locked ? 0x3a3548 : ready ? STORYBOOK_UI.dustyRose : 0x4a3d5a,
        alpha: locked ? 0.6 : 0.88,
        notches: 14,
      });
    }
    if (ready && !locked) {
      this.ultimateBack.fillStyle(STORYBOOK_UI.lanternCore, 0.06 + pulse * 0.08).fillCircle(ULT_X, ULT_Y, 52 + pulse * 4);
      this.ultimateBack.lineStyle(2, STORYBOOK_UI.warmAmber, 0.24 + pulse * 0.22).strokeCircle(ULT_X, ULT_Y, 49 + pulse * 3);
      this.ultimateBack.fillStyle(STORYBOOK_UI.lanternCore, 0.3 + pulse * 0.2);
      for (let i = 0; i < 4; i += 1) {
        const angle = this.scene.time.now * 0.0018 + i * Math.PI * 0.5;
        this.ultimateBack.fillCircle(ULT_X + Math.cos(angle) * 40, ULT_Y + Math.sin(angle) * 40, 1.5 + pulse);
      }
    }
    this.ultimateBack.lineStyle(4, STORYBOOK_UI.inkBlack, 0.52).strokeCircle(ULT_X, ULT_Y, 46);
    this.ultimateBack.lineStyle(3, locked ? 0x665d78 : ready ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.mutedTeal, 0.92);
    this.ultimateBack.beginPath();
    this.ultimateBack.arc(ULT_X, ULT_Y, 46, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio, false);
    this.ultimateBack.strokePath();
    if (!this.ultimateImage) drawStar(this.ultimateBack, ULT_X, ULT_Y - 5, 12, accent, STORYBOOK_UI.paperDark, locked ? 0.42 : 1);
    this.ultimateText.setText(locked ? '黒曜中' : ready ? '必殺技' : `必殺 ${Math.floor(ratio * 100)}%`);
    this.ultimateText.setColor(locked ? '#5a4c63' : ready ? '#5b1a23' : '#201117');
    this.ultimateText.setScale(ready && !locked ? 1 + pulse * 0.08 : 1);
    if (ready && !locked && !this.ultimateReadyNotified) {
      this.ultimateReadyNotified = true;
      this.showUltimateReadyNotice();
    }
  }

  private showUltimateReadyNotice(): void {
    const notice = this.scene.add.text(ULT_X, ULT_Y - 48, '必殺技が使える！', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: '#f4c46a',
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#0a0816',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 10).setAlpha(0).setScale(0.8);
    this.scene.tweens.add({
      targets: notice, alpha: 1, scale: 1, y: notice.y - 6, duration: 280, ease: 'Back.easeOut',
    });
    this.scene.tweens.add({
      targets: notice, alpha: 0, y: notice.y - 20, duration: 320, delay: 1200, ease: 'Quad.easeIn',
      onComplete: () => notice.destroy(),
    });
  }

  private drawXpHighlight(xpRatio: number): void {
    this.xpHighlight.clear();
    if (this.scene.time.now >= this.xpHighlightUntilMs || xpRatio <= 0.02) return;
    const progress = 1 - (this.xpHighlightUntilMs - this.scene.time.now) / 260;
    const barX = 92;
    const barY = 52;
    const barW = Math.max(0, Math.round((76 - 6) * xpRatio));
    const x = barX + 3 + Math.min(barW, Math.max(0, progress * (barW + 24) - 12));
    this.xpHighlight.fillStyle(0xffffff, 0.5 * (1 - progress));
    this.xpHighlight.fillRect(Math.round(x), barY + 2, Math.min(18, Math.max(0, barW)), 2);
  }

  private updatePortrait(berserk: BerserkState): void {
    const active = berserk.activeRemaining > 0;
    const fatigued = !active && berserk.fatigueRemaining > 0;
    const ready = berserk.ready;
    const ratio = active
      ? Math.max(0, Math.min(1, berserk.activeRemaining / berserk.durationSec))
      : fatigued
        ? Math.max(0, Math.min(1, berserk.fatigueRemaining / 0.8))
        : Math.max(0, Math.min(1, berserk.charge / berserk.maxCharge));
    const pulse = active ? 0.72 + Math.sin(this.scene.time.now * 0.018) * 0.28 : 1;
    const accent = active ? STORYBOOK_UI.dustyRose : fatigued ? 0x8b80a8 : ready ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.mutedTeal;

    this.portraitCharge.clear();
    const fillH = Math.max(0, Math.min(1, ratio)) * 102;
    const fillY = BOTTLE.y + 52 - fillH;
    const wave = active ? Math.sin(this.scene.time.now * 0.008) * 2 : 0;
    this.portraitCharge.fillStyle(active ? 0x8e1f38 : ready ? 0xb13a55 : 0x5d2e50, active ? 0.84 : 0.76);
    this.portraitCharge.fillRoundedRect(BOTTLE.x - 19, fillY + wave, 38, fillH + 8, 13);
    this.portraitCharge.fillStyle(active ? STORYBOOK_UI.dustyRose : STORYBOOK_UI.mutedTeal, active ? 0.32 * pulse : 0.16);
    this.portraitCharge.fillEllipse(BOTTLE.x, fillY + 3 + wave, 34, 7);
    if (ready || active) {
      this.portraitCharge.lineStyle(2, accent, active ? 0.46 * pulse : 0.36).strokeRoundedRect(BOTTLE.x - 25, BOTTLE.y - 62, 50, 126, 18);
    }

    this.drawBerserkFlame(active, fatigued, pulse);
    this.portraitImage?.setTint(active ? 0xffd0da : fatigued ? 0xc8c2d6 : 0xffffff);
    this.berserkText.setText(active ? `黒曜\n${Math.ceil(berserk.activeRemaining)}秒` : fatigued ? '黒曜\n反動' : ready ? '黒曜\nOK' : `黒曜\n${Math.floor(ratio * 100)}%`);
    this.berserkText.setColor(active ? '#4a101b' : fatigued ? '#5a4c63' : ready ? '#5b1a23' : '#1b0e16');
    this.portraitZone.setName(ready ? '黒曜化を発動' : '黒曜ゲージ');
  }

  private drawBerserkFlame(active: boolean, fatigued: boolean, pulse: number): void {
    this.portraitFlame.clear();
    if (!active && !fatigued) return;

    const flameAlpha = active ? 0.42 * pulse : 0.18;
    const edgeAlpha = active ? 0.88 * pulse : 0.32;
    this.portraitFlame.lineStyle(active ? 3 : 2, active ? STORYBOOK_UI.inkBlack : 0x5d5572, edgeAlpha);
    this.portraitFlame.strokeRoundedRect(BOTTLE.x - 33, BOTTLE.y - 68, 66, 140, 20);
    if (!active) return;

    this.portraitFlame.fillStyle(STORYBOOK_UI.inkBlack, flameAlpha);
    for (let i = 0; i < 5; i += 1) {
      const angle = -Math.PI * 0.9 + i * Math.PI * 0.45 + Math.sin(this.scene.time.now * 0.004 + i) * 0.08;
      const x = BOTTLE.x + Math.cos(angle) * 36;
      const y = BOTTLE.y + Math.sin(angle) * 66;
      this.portraitFlame.fillTriangle(x, y - 9, x - 5, y + 4, x + 5, y + 4);
    }
  }

  private updateInventory(state: RuntimeState): void {
    const items = [
      ...state.inventory.weapons.map((item) => ({ category: 'weapon' as const, itemId: item.id, level: item.level })),
      ...state.inventory.passives.map((item) => ({ category: 'passive' as const, itemId: item.id, level: item.level })),
      ...state.inventory.rareItems.map((item) => ({ category: 'rare' as const, itemId: item.id })),
    ];
    this.weaponSlots.forEach((slot, index) => {
      const item = items[index] ?? null;
      slot.update(item);
      this.drawInventoryCategoryDot(this.inventoryCategoryDots[index], item?.category ?? null);
    });
  }

  private drawInventoryCategoryDot(graphics: Phaser.GameObjects.Graphics, category: 'weapon' | 'passive' | 'rare' | null): void {
    graphics.clear();
    if (!category) return;
    const color = category === 'weapon'
      ? STORYBOOK_UI.dustyRose
      : category === 'passive'
        ? STORYBOOK_UI.mutedTeal
        : STORYBOOK_UI.goldLight;
    graphics.fillStyle(STORYBOOK_UI.inkBlack, 0.72).fillCircle(-20, 24, 5);
    graphics.fillStyle(color, 0.92).fillCircle(-20, 24, 3);
  }

  setVisible(visible: boolean): void {
    for (const object of [
      this.topBack, this.hpText, this.xpText, this.timeText, this.levelText, this.fragmentText,
      this.memoryStreetText, this.memoryProgress,
      this.hpDamageBar, this.hpBar, this.xpBar, this.xpHighlight, this.topIcons, this.pauseZone, this.pausePressVisual,
      this.speedBack, this.speedText, this.speedZone, this.speedPressVisual,
      this.inventoryBack, this.portraitFrame, this.portraitFlame, this.portraitCharge, this.portraitZone, this.portraitPressVisual,
      this.berserkText, this.ultimateBack, this.ultimateText, this.ultimateZone, this.ultimatePressVisual,
      ...this.hudImages, ...this.hudFallbacks, ...this.inventoryCategoryDots,
    ]) object.setVisible(visible);
    this.weaponSlots.forEach((slot) => slot.setVisible(visible));
    this.passiveSlots.forEach((slot) => slot.setVisible(visible));
    this.rareSlots.forEach((slot) => slot.setVisible(visible));
    this.portraitImage?.setVisible(visible);
    this.portraitFallback.setVisible(visible && !this.portraitImage);
    if (!visible) this.crestImage?.setVisible(false);
    if (!visible) this.debugText.setVisible(false);
  }

  destroy(): void {
    this.topBack.destroy();
    this.topIcons.destroy();
    this.pauseZone.destroy();
    this.pausePressVisual.destroy();
    this.hpDamageBar.destroy();
    this.hpBar.destroy();
    this.xpBar.destroy();
    this.xpHighlight.destroy();
    this.hpText.destroy();
    this.xpText.destroy();
    this.timeText.destroy();
    this.levelText.destroy();
    this.fragmentText.destroy();
    this.memoryStreetText.destroy();
    this.memoryCountText.destroy();
    this.memoryProgress.destroy();
    this.speedBack.destroy();
    this.speedText.destroy();
    this.speedZone.destroy();
    this.speedPressVisual.destroy();
    this.inventoryBack.destroy();
    this.portraitFrame.destroy();
    this.portraitFlame.destroy();
    this.portraitCharge.destroy();
    this.portraitFallback.destroy();
    this.berserkText.destroy();
    this.ultimateBack.destroy();
    this.ultimateText.destroy();
    this.portraitZone.destroy();
    this.portraitPressVisual.destroy();
    this.ultimateZone.destroy();
    this.ultimatePressVisual.destroy();
    this.hudImages.forEach((image) => image.destroy());
    this.hudFallbacks.forEach((graphics) => graphics.destroy());
    this.inventoryCategoryDots.forEach((graphics) => graphics.destroy());
    this.weaponSlots.forEach((slot) => slot.destroy());
    this.passiveSlots.forEach((slot) => slot.destroy());
    this.rareSlots.forEach((slot) => slot.destroy());
    this.debugText.destroy();
  }
}

function drawHangingPaperFallback(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  graphics.fillStyle(STORYBOOK_UI.inkBlack, 0.24).fillRoundedRect(x - w / 2 + 2, y - h / 2 + 3, w, h, 7);
  graphics.fillStyle(STORYBOOK_UI.paperBeige, 0.96).fillRoundedRect(x - w / 2, y - h / 2, w, h, 6);
  graphics.lineStyle(2, STORYBOOK_UI.paperDark, 0.78).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 6);
  graphics.lineStyle(1, STORYBOOK_UI.inkBlack, 0.22).strokeRoundedRect(x - w / 2 + 5, y - h / 2 + 5, w - 10, h - 10, 4);
  graphics.fillStyle(STORYBOOK_UI.deepNight, 0.64).fillCircle(x, y - h / 2 + 10, 4);
  graphics.lineStyle(2, STORYBOOK_UI.paperDark, 0.54).lineBetween(x, y - h / 2 - 9, x, y - h / 2 + 7);
}

function drawPaperPanelFallback(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  graphics.fillStyle(STORYBOOK_UI.inkBlack, 0.24).fillRoundedRect(x - w / 2 + 2, y - h / 2 + 2, w, h, 7);
  graphics.fillStyle(STORYBOOK_UI.paperBeige, 0.96).fillRoundedRect(x - w / 2, y - h / 2, w, h, 7);
  graphics.lineStyle(2, STORYBOOK_UI.paperDark, 0.72).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 7);
  graphics.lineStyle(1, STORYBOOK_UI.inkBlack, 0.18).strokeRoundedRect(x - w / 2 + 5, y - h / 2 + 5, w - 10, h - 10, 4);
}

function drawGaugeFrameFallback(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  graphics.fillStyle(STORYBOOK_UI.inkBlack, 0.42).fillRoundedRect(x - w / 2, y - h / 2, w, h, 4);
  graphics.lineStyle(2, STORYBOOK_UI.paperDark, 0.52).strokeRoundedRect(x - w / 2, y - h / 2, w, h, 4);
  graphics.lineStyle(1, STORYBOOK_UI.paperLight, 0.15).lineBetween(x - w / 2 + 8, y, x + w / 2 - 8, y);
}

function drawMemoryFrameFallback(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  graphics.fillStyle(STORYBOOK_UI.inkBlack, 0.38).fillRoundedRect(x - w / 2, y - h / 2 + 6, w, h - 12, 8);
  graphics.lineStyle(1, STORYBOOK_UI.goldLight, 0.45).strokeRoundedRect(x - w / 2, y - h / 2 + 6, w, h - 12, 8);
  graphics.fillStyle(STORYBOOK_UI.paperDark, 0.78).fillCircle(x - w / 2 + 23, y, 9);
  graphics.fillStyle(STORYBOOK_UI.paperDark, 0.78).fillCircle(x + w / 2 - 23, y, 9);
}

function drawBottleFallback(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  graphics.fillStyle(STORYBOOK_UI.inkBlack, 0.44).fillRoundedRect(x - w / 2 + 3, y - h / 2 + 4, w, h, 22);
  graphics.fillStyle(0x16111b, 0.72).fillRoundedRect(x - w * 0.28, y - h * 0.38, w * 0.56, h * 0.76, 18);
  graphics.lineStyle(3, STORYBOOK_UI.paperDark, 0.74).strokeRoundedRect(x - w * 0.28, y - h * 0.38, w * 0.56, h * 0.76, 18);
  graphics.fillStyle(STORYBOOK_UI.paperDark, 0.9).fillRoundedRect(x - w * 0.22, y - h * 0.48, w * 0.44, h * 0.13, 5);
  graphics.lineStyle(2, STORYBOOK_UI.inkBlack, 0.6).strokeRoundedRect(x - w * 0.22, y - h * 0.48, w * 0.44, h * 0.13, 5);
}

function drawUltimateFallback(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  drawWaxSeal(graphics, x, y, Math.min(w, h) * 0.38, {
    color: STORYBOOK_UI.dustyRose,
    alpha: 0.88,
    notches: 14,
  });
  graphics.fillStyle(STORYBOOK_UI.lanternCore, 0.22).fillCircle(x, y, Math.min(w, h) * 0.18);
  drawStar(graphics, x, y, Math.min(w, h) * 0.12, STORYBOOK_UI.goldLight, STORYBOOK_UI.paperDark, 1);
}

function drawInventorySlotFallback(
  graphics: Phaser.GameObjects.Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  drawPremiumPaperCard(graphics, x, y, w, h, {
    accent: STORYBOOK_UI.paperDark,
    paper: STORYBOOK_UI.paperBeige,
    shadowAlpha: 0.2,
    muted: true,
  });
  graphics.fillStyle(STORYBOOK_UI.deepNight, 0.7).fillCircle(x, y - h / 2 + 10, 5);
  graphics.lineStyle(1, STORYBOOK_UI.paperDark, 0.35).strokeCircle(x, y - h / 2 + 10, 8);
}
