import Phaser from 'phaser';
import type { BerserkState, RuntimeState } from '../runtime';
import { GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { characterById } from '../data/characters';
import { spriteOrNull } from '../assets/assetHelpers';
import { YUI_HUD_FRAME_IDS } from '../assets/playerFrames';
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
import { drawPaperScrap, drawWaxSeal } from './premiumPaperUi';

const DEPTH = VIEW_DEPTH.hud;
const TOP_HEIGHT = 72;
const PORTRAIT_X = 36;
const PORTRAIT_Y = GAME_HEIGHT - 42;
const INVENTORY_Y = GAME_HEIGHT - 43;
const SLOT_WEAPON_X = [94, 132, 170, 208, 246] as const;
const SLOT_PASSIVE_X = [94, 132, 170, 208, 246] as const;
const SLOT_RARE_X = [306, 344] as const;
const SLOT_WEAPON_Y = GAME_HEIGHT - 61;
const SLOT_PASSIVE_Y = GAME_HEIGHT - 26;
const ULT_X = GAME_WIDTH - 42;
const ULT_Y = GAME_HEIGHT - 132;
const PAUSE_X = GAME_WIDTH - 24;
const PAUSE_Y = 28;
const SPEED_X = 42;
const SPEED_Y = 84;
const SPEED_W = 68;
const SPEED_H = 28;
const EMPTY_BERSERK: BerserkState = {
  maxCharge: 100,
  charge: 0,
  ready: false,
  durationSec: 8,
  activeRemaining: 0,
  fatigueRemaining: 0,
};

type InputEventLike = { stopPropagation?: () => void };

export class Hud {
  private topBack: Phaser.GameObjects.Graphics;
  private hpText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private fragmentText: Phaser.GameObjects.Text;
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
  private portraitZone: Phaser.GameObjects.Zone;
  private ultimateBack: Phaser.GameObjects.Graphics;
  private ultimateText: Phaser.GameObjects.Text;
  private ultimatePressVisual: Phaser.GameObjects.Container;
  private ultimateZone: Phaser.GameObjects.Zone;
  private weaponSlots: InventorySlotView[];
  private passiveSlots: InventorySlotView[];
  private rareSlots: InventorySlotView[];
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
    this.topBack.fillStyle(STORYBOOK_UI.deepNight, 0.92).fillRect(0, 0, GAME_WIDTH, TOP_HEIGHT);
    this.topBack.fillStyle(STORYBOOK_UI.inkViolet, 0.4).fillRect(0, TOP_HEIGHT - 3, GAME_WIDTH, 3);
    this.topBack.lineStyle(1, STORYBOOK_UI.paperDark, 0.28).lineBetween(0, TOP_HEIGHT, GAME_WIDTH, TOP_HEIGHT);
    drawPaperScrap(this.topBack, GAME_WIDTH / 2, 20, 140, 28, STORYBOOK_UI.paperBeige, 0.06);
    drawPaperScrap(this.topBack, 60, 44, 120, 18, STORYBOOK_UI.paperBeige, 0.04);

    this.topIcons = scene.add.graphics().setDepth(DEPTH + 2);
    drawHeart(this.topIcons, 22, 23, 16);
    drawFragment(this.topIcons, GAME_WIDTH - 91, 25, 8);
    drawPause(this.topIcons, PAUSE_X, PAUSE_Y, 32);

    this.hpText = scene.add.text(42, 12, '100 / 100', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '16px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#0a0816',
      strokeThickness: 2,
    }).setOrigin(0, 0).setDepth(DEPTH + 3);

    this.timeText = scene.add.text(GAME_WIDTH / 2, 8, '04:32', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '26px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#0a0816',
      strokeThickness: 3,
    }).setOrigin(0.5, 0).setDepth(DEPTH + 3);

    this.levelText = scene.add.text(GAME_WIDTH / 2, 39, 'Lv.1', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5, 0).setDepth(DEPTH + 3);

    this.fragmentText = scene.add.text(GAME_WIDTH - 76, 16, '0', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '16px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#0a0816',
      strokeThickness: 2,
    }).setOrigin(0, 0).setDepth(DEPTH + 3);

    this.hpDamageBar = scene.add.graphics().setDepth(DEPTH + 1);
    this.hpBar = scene.add.graphics().setDepth(DEPTH + 2);
    this.xpBar = scene.add.graphics().setDepth(DEPTH + 2);
    this.xpHighlight = scene.add.graphics().setDepth(DEPTH + 3);

    this.pausePressVisual = scene.add.container(PAUSE_X, PAUSE_Y).setDepth(DEPTH + 6);
    this.pauseZone = scene.add.zone(PAUSE_X, PAUSE_Y, 42, 42)
      .setOrigin(0.5)
      .setDepth(DEPTH + 7)
      .setInteractive({ useHandCursor: true });
    attachPressFeedback(scene, this.pauseZone, this.pausePressVisual, {
      x: PAUSE_X,
      y: PAUSE_Y,
      width: 42,
      height: 42,
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

    this.speedBack = scene.add.graphics().setDepth(DEPTH + 5);
    this.speedText = scene.add.text(SPEED_X, SPEED_Y, 'x1.0', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '13px',
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
    const invLeft = 4;
    const invTop = Math.round(INVENTORY_Y - 41);
    const invW = GAME_WIDTH - 8;
    const invH = 82;
    this.inventoryBack.fillStyle(STORYBOOK_UI.deepNight, 0.88).fillRect(invLeft, invTop, invW, invH);
    this.inventoryBack.fillStyle(STORYBOOK_UI.inkViolet, 0.3).fillRect(invLeft, invTop, invW, 3);
    this.inventoryBack.lineStyle(1, STORYBOOK_UI.paperDark, 0.22).lineBetween(invLeft, invTop, invLeft + invW, invTop);
    drawPaperScrap(this.inventoryBack, GAME_WIDTH / 2, INVENTORY_Y, 200, 30, STORYBOOK_UI.paperBeige, 0.04);

    this.portraitFrame = scene.add.graphics().setDepth(DEPTH + 1);
    this.portraitFrame.fillStyle(STORYBOOK_UI.inkBlack, 0.4).fillCircle(PORTRAIT_X + 2, PORTRAIT_Y + 2, 30);
    this.portraitFrame.fillStyle(STORYBOOK_UI.deepNight, 0.96).fillCircle(PORTRAIT_X, PORTRAIT_Y, 30);
    this.portraitFrame.lineStyle(2, STORYBOOK_UI.paperDark, 0.5).strokeCircle(PORTRAIT_X, PORTRAIT_Y, 30);
    this.portraitFrame.lineStyle(1, STORYBOOK_UI.warmAmber, 0.18).strokeCircle(PORTRAIT_X, PORTRAIT_Y, 27);
    this.portraitFlame = scene.add.graphics().setDepth(DEPTH + 3);
    this.portraitCharge = scene.add.graphics().setDepth(DEPTH + 4);
    this.portraitPressVisual = scene.add.container(PORTRAIT_X, PORTRAIT_Y).setDepth(DEPTH + 7);
    this.portraitImage = spriteOrNull(scene, YUI_HUD_FRAME_IDS.portraitNeutral, 44, 44);
    this.portraitImage?.setPosition(PORTRAIT_X, PORTRAIT_Y).setDepth(DEPTH + 2);
    this.portraitFallback = scene.add.text(PORTRAIT_X, PORTRAIT_Y, 'ユ', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '20px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 2).setVisible(!this.portraitImage);
    this.crestImage = spriteOrNull(scene, YUI_HUD_FRAME_IDS.crestNormal, 14, 14);
    this.crestImage?.setPosition(PORTRAIT_X + 20, PORTRAIT_Y - 20).setDepth(DEPTH + 5).setVisible(false);
    this.berserkText = scene.add.text(PORTRAIT_X, GAME_HEIGHT - 10, '黒曜 0%', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '11px',
      color: STORYBOOK_UI.textMuted,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#0a0816',
      strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(DEPTH + 5);
    this.portraitZone = scene.add.zone(PORTRAIT_X, PORTRAIT_Y, 70, 70)
      .setOrigin(0.5)
      .setDepth(DEPTH + 8)
      .setInteractive({ useHandCursor: true });
    attachPressFeedback(scene, this.portraitZone, this.portraitPressVisual, {
      x: PORTRAIT_X,
      y: PORTRAIT_Y,
      width: 70,
      height: 70,
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
    this.ultimateText = scene.add.text(ULT_X, ULT_Y + 18, '必殺', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '11px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      stroke: '#0a0816',
      strokeThickness: 2,
      resolution: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 3);
    this.ultimatePressVisual = scene.add.container(ULT_X, ULT_Y).setDepth(DEPTH + 6);
    this.ultimateZone = scene.add.zone(ULT_X, ULT_Y, 72, 72)
      .setOrigin(0.5)
      .setDepth(DEPTH + 7)
      .setInteractive({ useHandCursor: true });
    attachPressFeedback(scene, this.ultimateZone, this.ultimatePressVisual, {
      x: ULT_X,
      y: ULT_Y,
      width: 72,
      height: 72,
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

    this.weaponSlots = SLOT_WEAPON_X.map((x) => new InventorySlotView(scene, x, SLOT_WEAPON_Y, 28, DEPTH + 2, 'weapon'));
    this.passiveSlots = SLOT_PASSIVE_X.map((x) => new InventorySlotView(scene, x, SLOT_PASSIVE_Y, 28, DEPTH + 2, 'passive'));
    this.rareSlots = SLOT_RARE_X.map((x) => new InventorySlotView(scene, x, SLOT_PASSIVE_Y, 26, DEPTH + 2, 'rare'));

    this.debugText = scene.add.text(8, 112, '', {
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
    this.timeText.setText(`${minutes}:${seconds}`);
    this.levelText.setText(`Lv.${state.player.level}`);
    this.fragmentText.setText(String(state.stats?.memoryFragmentsCollected ?? 0));
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
    drawBar(this.hpDamageBar, 40, 39, 105, 10, this.delayedHpRatio, STORYBOOK_UI.hpBack, 0x9f2438);
    this.hpBar.clear();
    this.hpBar.x = shake;
    drawBar(this.hpBar, 40, 39, 105, 10, hpRatio, STORYBOOK_UI.hpBack, STORYBOOK_UI.hp);

    const xpRatio = Math.max(0, Math.min(1, player.xp / player.xpToNext));
    if (xpRatio > this.previousXpRatio + 0.001 || (this.previousXpRatio > 0.9 && xpRatio < 0.1)) {
      this.xpHighlightUntilMs = this.scene.time.now + 260;
    }
    this.previousXpRatio = xpRatio;
    this.xpBar.clear();
    drawBar(this.xpBar, 132, 59, 126, 5, xpRatio, 0x1a1428, STORYBOOK_UI.xp);
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
    drawWaxSeal(this.ultimateBack, ULT_X, ULT_Y, 30, {
      color: locked ? 0x3a3548 : ready ? STORYBOOK_UI.dustyRose : 0x4a3d5a,
      alpha: locked ? 0.6 : 0.88,
      notches: 14,
    });
    if (ready && !locked) {
      this.ultimateBack.fillStyle(STORYBOOK_UI.lanternCore, 0.06 + pulse * 0.06).fillCircle(ULT_X, ULT_Y, 38 + pulse * 3);
      this.ultimateBack.lineStyle(1, STORYBOOK_UI.warmAmber, 0.22 + pulse * 0.18).strokeCircle(ULT_X, ULT_Y, 38 + pulse * 3);
      this.ultimateBack.fillStyle(STORYBOOK_UI.lanternCore, 0.3 + pulse * 0.2);
      for (let i = 0; i < 4; i += 1) {
        const angle = this.scene.time.now * 0.0018 + i * Math.PI * 0.5;
        this.ultimateBack.fillCircle(ULT_X + Math.cos(angle) * 40, ULT_Y + Math.sin(angle) * 40, 1.5 + pulse);
      }
    }
    drawStar(this.ultimateBack, ULT_X, ULT_Y - 5, 12, accent, STORYBOOK_UI.paperDark, locked ? 0.42 : 1);
    this.ultimateBack.lineStyle(3, locked ? 0x665d78 : ready ? STORYBOOK_UI.warmAmber : STORYBOOK_UI.mutedTeal, 0.9);
    this.ultimateBack.beginPath();
    this.ultimateBack.arc(ULT_X, ULT_Y, 27, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio, false);
    this.ultimateBack.strokePath();
    this.ultimateText.setText(locked ? '黒曜中' : ready ? '必殺 OK' : `必殺 ${Math.floor(ratio * 100)}%`);
    this.ultimateText.setColor(locked ? '#8b80a8' : ready ? '#ffe8a8' : STORYBOOK_UI.textLight);
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
    const barX = 132;
    const barY = 59;
    const barW = Math.max(0, Math.round((126 - 6) * xpRatio));
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
    this.portraitCharge.lineStyle(4, STORYBOOK_UI.inkBlack, 0.8).strokeCircle(PORTRAIT_X, PORTRAIT_Y, 33);
    this.portraitCharge.lineStyle(active ? 4 : 3, accent, active ? pulse : active || ready ? 1 : 0.86);
    this.portraitCharge.beginPath();
    this.portraitCharge.arc(PORTRAIT_X, PORTRAIT_Y, 33, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio, false);
    this.portraitCharge.strokePath();

    this.drawBerserkFlame(active, fatigued, pulse);
    if (this.portraitImage) {
      const texture = active ? YUI_HUD_FRAME_IDS.portraitAlt : YUI_HUD_FRAME_IDS.portraitNeutral;
      if (this.scene.textures.exists(texture) && this.portraitImage.texture.key !== texture) this.portraitImage.setTexture(texture);
      this.portraitImage.setTint(active ? 0xffc8d0 : fatigued ? 0xc8c2d6 : 0xffffff);
      this.portraitImage.setDisplaySize(44, 44);
    }
    if (this.crestImage) {
      const texture = active ? YUI_HUD_FRAME_IDS.crestBlack : YUI_HUD_FRAME_IDS.crestNormal;
      if (this.scene.textures.exists(texture) && this.crestImage.texture.key !== texture) this.crestImage.setTexture(texture);
      this.crestImage.setVisible(active || ready);
    }

    this.berserkText.setText(active ? `黒曜 ${Math.ceil(berserk.activeRemaining)}秒` : fatigued ? '黒曜反動' : ready ? '黒曜 OK' : `黒曜 ${Math.floor(ratio * 100)}%`);
    this.berserkText.setColor(active ? (pulse > 0.78 ? '#e8b0b8' : '#b96a76') : fatigued ? '#b8b0cc' : ready ? '#f4c46a' : STORYBOOK_UI.textMuted);
    this.portraitZone.setName(ready ? '黒曜化を発動' : '黒曜ゲージ');
  }

  private drawBerserkFlame(active: boolean, fatigued: boolean, pulse: number): void {
    this.portraitFlame.clear();
    if (!active && !fatigued) return;

    const flameAlpha = active ? 0.42 * pulse : 0.18;
    const edgeAlpha = active ? 0.88 * pulse : 0.32;
    this.portraitFlame.lineStyle(active ? 3 : 2, active ? STORYBOOK_UI.inkBlack : 0x5d5572, edgeAlpha);
    this.portraitFlame.strokeCircle(PORTRAIT_X, PORTRAIT_Y, active ? 38 : 35);
    if (!active) return;

    this.portraitFlame.fillStyle(STORYBOOK_UI.inkBlack, flameAlpha);
    for (let i = 0; i < 5; i += 1) {
      const angle = -Math.PI * 0.9 + i * Math.PI * 0.45 + Math.sin(this.scene.time.now * 0.004 + i) * 0.08;
      const x = PORTRAIT_X + Math.cos(angle) * 35;
      const y = PORTRAIT_Y + Math.sin(angle) * 35;
      this.portraitFlame.fillTriangle(x, y - 9, x - 5, y + 4, x + 5, y + 4);
    }
  }

  private updateInventory(state: RuntimeState): void {
    this.weaponSlots.forEach((slot, index) => {
      const item = state.inventory.weapons[index];
      slot.update(item ? { category: 'weapon', itemId: item.id, level: item.level } : null);
    });
    this.passiveSlots.forEach((slot, index) => {
      const item = state.inventory.passives[index];
      slot.update(item ? { category: 'passive', itemId: item.id, level: item.level } : null);
    });
    this.rareSlots.forEach((slot, index) => {
      const item = state.inventory.rareItems[index];
      slot.update(item ? { category: 'rare', itemId: item.id } : null);
    });
  }

  setVisible(visible: boolean): void {
    for (const object of [
      this.topBack, this.hpText, this.timeText, this.levelText, this.fragmentText,
      this.hpDamageBar, this.hpBar, this.xpBar, this.xpHighlight, this.topIcons, this.pauseZone, this.pausePressVisual,
      this.speedBack, this.speedText, this.speedZone, this.speedPressVisual,
      this.inventoryBack, this.portraitFrame, this.portraitFlame, this.portraitCharge, this.portraitZone, this.portraitPressVisual,
      this.berserkText, this.ultimateBack, this.ultimateText, this.ultimateZone, this.ultimatePressVisual,
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
    this.pauseZone.destroy();
    this.pausePressVisual.destroy();
    this.hpDamageBar.destroy();
    this.hpBar.destroy();
    this.xpBar.destroy();
    this.xpHighlight.destroy();
    this.speedBack.destroy();
    this.speedText.destroy();
    this.speedZone.destroy();
    this.speedPressVisual.destroy();
    this.portraitZone.destroy();
    this.portraitPressVisual.destroy();
    this.ultimateZone.destroy();
    this.ultimatePressVisual.destroy();
    this.weaponSlots.forEach((slot) => slot.destroy());
    this.passiveSlots.forEach((slot) => slot.destroy());
    this.rareSlots.forEach((slot) => slot.destroy());
  }
}
