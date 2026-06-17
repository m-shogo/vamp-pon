import Phaser from 'phaser';
import type { BerserkState, RuntimeState } from '../runtime';
import { GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { characterById } from '../data/characters';
import { spriteOrNull } from '../assets/assetHelpers';
import { YUI_HUD_FRAME_IDS } from '../assets/playerFrames';
import { InventorySlotView } from './inventorySlot';
import {
  STORYBOOK_FONT,
  STORYBOOK_NUMBER_FONT,
  STORYBOOK_UI,
  drawBar,
  drawFragment,
  drawHeart,
  drawPause,
  drawStar,
  drawStorybookPanel,
} from './storybookUi';

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
const EMPTY_BERSERK: BerserkState = {
  maxCharge: 100,
  charge: 0,
  ready: false,
  durationSec: 8,
  activeRemaining: 0,
};

type InputEventLike = { stopPropagation?: () => void };

export class Hud {
  private topBack: Phaser.GameObjects.Graphics;
  private hpText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private fragmentText: Phaser.GameObjects.Text;
  private hpBar: Phaser.GameObjects.Graphics;
  private xpBar: Phaser.GameObjects.Graphics;
  private topIcons: Phaser.GameObjects.Graphics;
  private pauseZone: Phaser.GameObjects.Zone;
  private inventoryBack: Phaser.GameObjects.Graphics;
  private portraitFrame: Phaser.GameObjects.Graphics;
  private portraitCharge: Phaser.GameObjects.Graphics;
  private portraitImage: Phaser.GameObjects.Image | null;
  private portraitFallback: Phaser.GameObjects.Text;
  private crestImage: Phaser.GameObjects.Image | null;
  private berserkText: Phaser.GameObjects.Text;
  private portraitZone: Phaser.GameObjects.Zone;
  private ultimateBack: Phaser.GameObjects.Graphics;
  private ultimateText: Phaser.GameObjects.Text;
  private ultimateZone: Phaser.GameObjects.Zone;
  private weaponSlots: InventorySlotView[];
  private passiveSlots: InventorySlotView[];
  private rareSlots: InventorySlotView[];
  private debugText: Phaser.GameObjects.Text;

  constructor(
    private scene: Phaser.Scene,
    private onUltimate: () => void,
    private onBerserk: () => void = () => {},
    private onPause: () => void = () => {},
  ) {
    this.topBack = scene.add.graphics().setDepth(DEPTH);
    drawStorybookPanel(
      this.topBack,
      GAME_WIDTH / 2,
      TOP_HEIGHT / 2,
      GAME_WIDTH,
      TOP_HEIGHT,
      STORYBOOK_UI.nightPanel,
      STORYBOOK_UI.gold,
      0.9,
    );

    this.topIcons = scene.add.graphics().setDepth(DEPTH + 2);
    drawHeart(this.topIcons, 22, 23, 16);
    drawFragment(this.topIcons, GAME_WIDTH - 91, 25, 8);
    drawPause(this.topIcons, PAUSE_X, PAUSE_Y, 32);

    this.hpText = scene.add.text(42, 12, '100 / 100', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '15px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0, 0).setDepth(DEPTH + 3);

    this.timeText = scene.add.text(GAME_WIDTH / 2, 8, '04:32', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '25px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#0a0e20',
      strokeThickness: 2,
    }).setOrigin(0.5, 0).setDepth(DEPTH + 3);

    this.levelText = scene.add.text(GAME_WIDTH / 2, 39, 'Lv.1', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '12px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#090d1d',
      strokeThickness: 2,
    }).setOrigin(0.5, 0).setDepth(DEPTH + 3);

    this.fragmentText = scene.add.text(GAME_WIDTH - 76, 16, '0', {
      fontFamily: STORYBOOK_NUMBER_FONT,
      fontSize: '15px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0, 0).setDepth(DEPTH + 3);

    this.hpBar = scene.add.graphics().setDepth(DEPTH + 2);
    this.xpBar = scene.add.graphics().setDepth(DEPTH + 2);

    this.pauseZone = scene.add.zone(PAUSE_X, PAUSE_Y, 42, 42)
      .setOrigin(0.5)
      .setDepth(DEPTH + 5)
      .setInteractive({ useHandCursor: true });
    this.pauseZone.on(
      Phaser.Input.Events.POINTER_DOWN,
      (_pointer: Phaser.Input.Pointer, _x: number, _y: number, event?: InputEventLike) => {
        event?.stopPropagation?.();
        this.onPause();
      },
    );

    this.inventoryBack = scene.add.graphics().setDepth(DEPTH);
    drawStorybookPanel(
      this.inventoryBack,
      GAME_WIDTH / 2,
      INVENTORY_Y,
      GAME_WIDTH - 8,
      82,
      STORYBOOK_UI.nightPanel,
      STORYBOOK_UI.gold,
      0.84,
    );

    this.portraitFrame = scene.add.graphics().setDepth(DEPTH + 1);
    drawStorybookPanel(this.portraitFrame, PORTRAIT_X, PORTRAIT_Y, 60, 60, 0x10162d, STORYBOOK_UI.gold, 0.96);
    this.portraitCharge = scene.add.graphics().setDepth(DEPTH + 4);
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
    this.berserkText = scene.add.text(PORTRAIT_X, GAME_HEIGHT - 5, '暴走 0%', {
      fontFamily: STORYBOOK_FONT,
      fontSize: '9px',
      color: STORYBOOK_UI.textMuted,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#080b18',
      strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(DEPTH + 5);
    this.portraitZone = scene.add.zone(PORTRAIT_X, PORTRAIT_Y, 70, 70)
      .setOrigin(0.5)
      .setDepth(DEPTH + 6)
      .setInteractive({ useHandCursor: true });
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
      fontSize: '9px',
      color: STORYBOOK_UI.textLight,
      fontStyle: 'bold',
      resolution: 2,
      stroke: '#080b18',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(DEPTH + 3);
    this.ultimateZone = scene.add.zone(ULT_X, ULT_Y, 72, 72)
      .setOrigin(0.5)
      .setDepth(DEPTH + 5)
      .setInteractive({ useHandCursor: true });
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

    this.debugText = scene.add.text(8, 78, '', {
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

    const player = state.player;
    const hpRatio = Math.max(0, player.hp / player.maxHp);
    this.hpText.setText(`${Math.ceil(player.hp)} / ${player.maxHp}`);
    this.hpBar.clear();
    drawBar(this.hpBar, 40, 39, 105, 10, hpRatio, STORYBOOK_UI.hpBack, STORYBOOK_UI.hp);

    const xpRatio = Math.max(0, Math.min(1, player.xp / player.xpToNext));
    this.xpBar.clear();
    drawBar(this.xpBar, 132, 59, 126, 5, xpRatio, 0x302742, STORYBOOK_UI.xp);

    const berserk = state.berserk ?? EMPTY_BERSERK;
    const ultimateRatio = Math.max(0, Math.min(1, state.ultimate.ready ? 1 : state.ultimate.charge / state.ultimate.chargeSeconds));
    this.drawUltimate(ultimateRatio, state.ultimate.ready, berserk.activeRemaining > 0);
    const ultimateName = characterById.get(state.characterId)?.ultimate.name ?? '必殺技';
    this.ultimateZone.setName(ultimateName);
    this.updatePortrait(berserk);
    this.updateInventory(state);

    if (state.debug) {
      this.debugText.setVisible(true).setText([
        `t=${state.elapsedSec.toFixed(1)} status=${state.status}`,
        `enemies=${state.enemies?.length ?? 0} proj=${state.projectiles?.length ?? 0}`,
        `hp=${player.hp.toFixed(0)} lv=${player.level} xp=${player.xp.toFixed(1)}/${player.xpToNext}`,
        `berserk=${berserk.charge.toFixed(0)}/${berserk.maxCharge} active=${berserk.activeRemaining.toFixed(1)}`,
        `kills=${state.stats?.kills ?? 0} fragments=${state.stats?.memoryFragmentsCollected ?? 0}`,
      ].join('\n'));
    } else {
      this.debugText.setVisible(false);
    }
  }

  private drawUltimate(ratio: number, ready: boolean, locked: boolean): void {
    const accent = locked ? 0x665d78 : ready ? STORYBOOK_UI.goldLight : 0x8b80a8;
    this.ultimateBack.clear();
    this.ultimateBack.fillStyle(0x0c1228, 0.48).fillCircle(ULT_X, ULT_Y, 33);
    this.ultimateBack.lineStyle(2, accent, 0.9).strokeCircle(ULT_X, ULT_Y, 33);
    this.ultimateBack.lineStyle(1, 0xffffff, 0.18).strokeCircle(ULT_X, ULT_Y, 27);
    drawStar(this.ultimateBack, ULT_X, ULT_Y - 5, 13, accent, STORYBOOK_UI.gold, locked ? 0.42 : 1);
    this.ultimateBack.lineStyle(3, locked ? 0x665d78 : ready ? STORYBOOK_UI.goldLight : STORYBOOK_UI.xp, 0.9);
    this.ultimateBack.beginPath();
    this.ultimateBack.arc(ULT_X, ULT_Y, 30, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio, false);
    this.ultimateBack.strokePath();
    this.ultimateText.setText(locked ? '暴走中' : ready ? '必殺 OK' : `必殺 ${Math.floor(ratio * 100)}%`);
  }

  private updatePortrait(berserk: BerserkState): void {
    const active = berserk.activeRemaining > 0;
    const ready = berserk.ready;
    const ratio = active
      ? Math.max(0, Math.min(1, berserk.activeRemaining / berserk.durationSec))
      : Math.max(0, Math.min(1, berserk.charge / berserk.maxCharge));
    const accent = active ? 0xff718c : ready ? 0xffc06a : STORYBOOK_UI.xp;

    this.portraitCharge.clear();
    this.portraitCharge.lineStyle(4, 0x090d1d, 0.9).strokeCircle(PORTRAIT_X, PORTRAIT_Y, 33);
    this.portraitCharge.lineStyle(3, accent, active || ready ? 1 : 0.86);
    this.portraitCharge.beginPath();
    this.portraitCharge.arc(PORTRAIT_X, PORTRAIT_Y, 33, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio, false);
    this.portraitCharge.strokePath();

    if (this.portraitImage) {
      const texture = active ? YUI_HUD_FRAME_IDS.portraitAlt : YUI_HUD_FRAME_IDS.portraitNeutral;
      if (this.scene.textures.exists(texture) && this.portraitImage.texture.key !== texture) this.portraitImage.setTexture(texture);
      this.portraitImage.setTint(active ? 0xffc8d0 : 0xffffff);
      this.portraitImage.setDisplaySize(44, 44);
    }
    if (this.crestImage) {
      const texture = active ? YUI_HUD_FRAME_IDS.crestBlack : YUI_HUD_FRAME_IDS.crestNormal;
      if (this.scene.textures.exists(texture) && this.crestImage.texture.key !== texture) this.crestImage.setTexture(texture);
      this.crestImage.setVisible(active || ready);
    }

    this.berserkText.setText(active ? `暴走 ${Math.ceil(berserk.activeRemaining)}秒` : ready ? '暴走 OK' : `暴走 ${Math.floor(ratio * 100)}%`);
    this.berserkText.setColor(active ? '#ffb3c0' : ready ? '#ffe3a8' : STORYBOOK_UI.textMuted);
    this.portraitZone.setName(ready ? '暴走を発動' : '暴走ゲージ');
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
      this.hpBar, this.xpBar, this.topIcons, this.pauseZone,
      this.inventoryBack, this.portraitFrame, this.portraitCharge, this.portraitZone,
      this.berserkText, this.ultimateBack, this.ultimateText, this.ultimateZone,
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
    this.portraitZone.destroy();
    this.ultimateZone.destroy();
    this.weaponSlots.forEach((slot) => slot.destroy());
    this.passiveSlots.forEach((slot) => slot.destroy());
    this.rareSlots.forEach((slot) => slot.destroy());
  }
}
