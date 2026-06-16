import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { characterById } from '../data/characters';
import { spriteOrNull } from '../assets/assetHelpers';
import { YUI_HUD_FRAME_IDS } from '../assets/playerFrames';
import { InventorySlotView } from './inventorySlot';

const FONT = '"Hiragino Sans", "Yu Gothic", sans-serif';
const PORTRAIT_X = 38;
const PORTRAIT_Y = GAME_HEIGHT - 38;
const INVENTORY_TOP = GAME_HEIGHT - 88;
const SLOT_WEAPON_X = [112, 155, 198, 241, 284] as const;
const SLOT_RARE_X = [337, 372] as const;
const SLOT_WEAPON_Y = GAME_HEIGHT - 65;
const SLOT_PASSIVE_Y = GAME_HEIGHT - 28;

type InputEventLike = { stopPropagation?: () => void };

export class Hud {
  private timeText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private hpBack: Phaser.GameObjects.Graphics;
  private hpFill: Phaser.GameObjects.Graphics;
  private hpText: Phaser.GameObjects.Text;
  private xpBar: Phaser.GameObjects.Graphics;
  private ultIcon: Phaser.GameObjects.Graphics;
  private ultText: Phaser.GameObjects.Text;
  private ultHintText: Phaser.GameObjects.Text;
  private ultHitArea: Phaser.GameObjects.Zone;
  private inventoryBack: Phaser.GameObjects.Graphics;
  private categoryLabels: Phaser.GameObjects.Text[];
  private portraitFrame: Phaser.GameObjects.Graphics;
  private portraitRing: Phaser.GameObjects.Graphics;
  private portraitImage: Phaser.GameObjects.Image | null;
  private portraitFallback: Phaser.GameObjects.Text;
  private crestImage: Phaser.GameObjects.Image | null;
  private berserkText: Phaser.GameObjects.Text;
  private weaponSlots: InventorySlotView[];
  private passiveSlots: InventorySlotView[];
  private rareSlots: InventorySlotView[];
  private debugText: Phaser.GameObjects.Text;

  constructor(
    private scene: Phaser.Scene,
    private onUltimate: () => void,
  ) {
    const d = VIEW_DEPTH.hud;

    this.timeText = scene.add
      .text(GAME_WIDTH / 2, 14, '', { fontFamily: FONT, fontSize: '20px', color: '#f3ead2' })
      .setOrigin(0.5, 0)
      .setDepth(d);

    this.levelText = scene.add
      .text(12, 13, 'Lv.1', { fontFamily: FONT, fontSize: '16px', color: '#f3ead2' })
      .setOrigin(0, 0)
      .setDepth(d);

    this.xpBar = scene.add.graphics().setDepth(d);
    this.hpBack = scene.add.graphics().setDepth(d);
    this.hpFill = scene.add.graphics().setDepth(d);
    this.hpText = scene.add.text(12, 35, '', { fontFamily: FONT, fontSize: '10px', color: '#f3ead2' }).setDepth(d);

    this.ultIcon = scene.add.graphics().setDepth(d + 1);
    this.ultText = scene.add
      .text(GAME_WIDTH - 42, 37, '必', { fontFamily: FONT, fontSize: '17px', color: '#3a3326', fontStyle: 'bold' })
      .setOrigin(0.5, 0.5)
      .setDepth(d + 2);
    this.ultHintText = scene.add
      .text(GAME_WIDTH - 42, 64, '', { fontFamily: FONT, fontSize: '9px', color: '#cfe6ff' })
      .setOrigin(0.5, 0.5)
      .setDepth(d + 2);

    this.ultHitArea = scene.add
      .zone(GAME_WIDTH - 42, 44, 64, 64)
      .setOrigin(0.5, 0.5)
      .setDepth(d + 3)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });
    this.ultHitArea.on(
      Phaser.Input.Events.POINTER_DOWN,
      (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event?: InputEventLike) => {
        event?.stopPropagation?.();
        this.onUltimate();
      },
    );

    this.inventoryBack = scene.add.graphics().setDepth(d);
    this.drawInventoryFrame();
    this.categoryLabels = [
      scene.add.text(82, SLOT_WEAPON_Y, '武', { fontFamily: FONT, fontSize: '9px', color: '#b9d3e6' }).setOrigin(0.5).setDepth(d + 1),
      scene.add.text(82, SLOT_PASSIVE_Y, '忘', { fontFamily: FONT, fontSize: '9px', color: '#d7c7e8' }).setOrigin(0.5).setDepth(d + 1),
      scene.add.text(316, SLOT_PASSIVE_Y, 'レ', { fontFamily: FONT, fontSize: '8px', color: '#ffe9a8' }).setOrigin(0.5).setDepth(d + 1),
    ];

    this.portraitFrame = scene.add.graphics().setDepth(d + 1);
    this.portraitFrame
      .fillStyle(0x171328, 0.92)
      .fillCircle(PORTRAIT_X, PORTRAIT_Y, 32)
      .lineStyle(2, COLORS.cardEdge, 0.9)
      .strokeCircle(PORTRAIT_X, PORTRAIT_Y, 32);

    this.portraitImage = spriteOrNull(scene, YUI_HUD_FRAME_IDS.portraitNeutral, 58, 58);
    this.portraitImage?.setPosition(PORTRAIT_X, PORTRAIT_Y).setDepth(d + 2);
    this.portraitFallback = scene.add
      .text(PORTRAIT_X, PORTRAIT_Y, 'ユ', { fontFamily: FONT, fontSize: '23px', color: '#f3ead2', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setDepth(d + 2)
      .setVisible(!this.portraitImage);

    this.portraitRing = scene.add.graphics().setDepth(d + 3);
    this.crestImage = spriteOrNull(scene, YUI_HUD_FRAME_IDS.crestNormal, 18, 18);
    this.crestImage?.setPosition(PORTRAIT_X + 23, PORTRAIT_Y - 22).setDepth(d + 4).setVisible(false);
    this.berserkText = scene.add
      .text(PORTRAIT_X, INVENTORY_TOP - 2, '暴走 0%', { fontFamily: FONT, fontSize: '9px', color: '#cfe6ff', fontStyle: 'bold' })
      .setOrigin(0.5, 1)
      .setDepth(d + 4);

    this.weaponSlots = SLOT_WEAPON_X.map((x) => new InventorySlotView(scene, x, SLOT_WEAPON_Y, 30, d + 2));
    this.passiveSlots = SLOT_WEAPON_X.map((x) => new InventorySlotView(scene, x, SLOT_PASSIVE_Y, 30, d + 2));
    this.rareSlots = SLOT_RARE_X.map((x) => new InventorySlotView(scene, x, SLOT_PASSIVE_Y, 24, d + 2));

    this.debugText = scene.add
      .text(8, 68, '', { fontFamily: 'monospace', fontSize: '10px', color: '#9fe0a0' })
      .setDepth(d)
      .setVisible(false);
  }

  private drawInventoryFrame(): void {
    const panelX = 76;
    const panelW = GAME_WIDTH - panelX - 4;
    this.inventoryBack.clear();
    this.inventoryBack.fillStyle(0x120f24, 0.78).fillRoundedRect(panelX, INVENTORY_TOP, panelW, 84, 10);
    this.inventoryBack.lineStyle(1, 0x5b5272, 0.7).strokeRoundedRect(panelX, INVENTORY_TOP, panelW, 84, 10);

    this.inventoryBack.fillStyle(0x171328, 0.88);
    for (const x of SLOT_WEAPON_X) {
      this.inventoryBack.fillRoundedRect(x - 17, SLOT_WEAPON_Y - 16, 34, 32, 5);
      this.inventoryBack.fillRoundedRect(x - 17, SLOT_PASSIVE_Y - 16, 34, 32, 5);
    }
    for (const x of SLOT_RARE_X) {
      this.inventoryBack.fillRoundedRect(x - 14, SLOT_PASSIVE_Y - 14, 28, 28, 5);
    }

    this.inventoryBack.lineStyle(1, 0x6d6385, 0.65);
    for (const x of SLOT_WEAPON_X) {
      this.inventoryBack.strokeRoundedRect(x - 17, SLOT_WEAPON_Y - 16, 34, 32, 5);
      this.inventoryBack.strokeRoundedRect(x - 17, SLOT_PASSIVE_Y - 16, 34, 32, 5);
    }
    this.inventoryBack.lineStyle(1, COLORS.cardEdge, 0.8);
    for (const x of SLOT_RARE_X) {
      this.inventoryBack.strokeRoundedRect(x - 14, SLOT_PASSIVE_Y - 14, 28, 28, 5);
    }
  }

  update(state: RuntimeState): void {
    const remain = Math.max(0, Math.ceil(state.durationSec - state.elapsedSec));
    const mm = Math.floor(remain / 60).toString().padStart(2, '0');
    const ss = (remain % 60).toString().padStart(2, '0');
    this.timeText.setText(`朝まで ${mm}:${ss}`);
    this.levelText.setText(`Lv.${state.player.level}`);

    const xpRatio = Math.max(0, Math.min(1, state.player.xp / state.player.xpToNext));
    this.xpBar.clear();
    this.xpBar.fillStyle(COLORS.xpBack, 0.7).fillRect(0, 0, GAME_WIDTH, 4);
    this.xpBar.fillStyle(COLORS.xpFill, 1).fillRect(0, 0, GAME_WIDTH * xpRatio, 4);

    const p = state.player;
    const hpRatio = Math.max(0, p.hp / p.maxHp);
    const hpW = 118;
    const hpY = 50;
    this.hpBack.clear().fillStyle(COLORS.hpBack, 0.86).fillRect(12, hpY, hpW, 10);
    const lowBlink = hpRatio <= 0.35 && Math.floor(state.elapsedSec * 4) % 2 === 0;
    this.hpFill.clear().fillStyle(lowBlink ? 0xffffff : COLORS.hpFill, 1).fillRect(12, hpY, hpW * hpRatio, 10);
    this.hpText.setText(`HP ${Math.ceil(p.hp)}/${p.maxHp}`).setPosition(12, hpY - 14);

    const char = characterById.get(state.characterId);
    const ultName = char?.ultimate.name ?? '必殺技';
    const ultRatio = Math.max(0, Math.min(1, state.ultimate.ready ? 1 : state.ultimate.charge / state.ultimate.chargeSeconds));
    const cx = GAME_WIDTH - 42;
    const cy = 44;
    const r = 24;
    this.ultIcon.clear();
    this.ultIcon.fillStyle(COLORS.xpBack, 0.9).fillCircle(cx, cy, r);
    this.ultIcon.lineStyle(3, COLORS.enemyInkEdge, 0.8).strokeCircle(cx, cy, r);
    this.ultIcon.lineStyle(5, state.ultimate.ready ? COLORS.ultReady : COLORS.ultFill, 1);
    this.ultIcon.beginPath();
    this.ultIcon.arc(cx, cy, r + 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ultRatio, false);
    this.ultIcon.strokePath();
    this.ultIcon.fillStyle(state.ultimate.ready ? COLORS.ultReady : COLORS.ultFill, state.ultimate.ready ? 0.95 : 0.25);
    this.ultIcon.slice(cx, cy, r - 4, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ultRatio, false).fillPath();

    this.ultText.setText(state.ultimate.ready ? 'OK' : '必').setColor(state.ultimate.ready ? '#3a3326' : '#f3ead2');
    this.ultHintText.setText(state.ultimate.ready ? 'TAP' : `${Math.floor(ultRatio * 100)}%`).setColor(state.ultimate.ready ? '#fff1b0' : '#cfe6ff');
    this.ultHitArea.setName(ultName);

    this.updateBerserkPortrait(state, ultRatio);
    this.updateInventorySlots(state);

    if (state.debug) {
      const t = state.telemetry;
      const f = (n: number | null) => (n === null ? '--' : n.toFixed(1));
      this.debugText.setVisible(true).setText([
        `t=${state.elapsedSec.toFixed(1)} status=${state.status}`,
        `enemies=${state.enemies.length} proj=${state.projectiles.length}`,
        `pickups=${state.pickups.length} areas=${state.areas.length}`,
        `hp=${p.hp.toFixed(0)} lv=${state.player.level} xp=${state.player.xp.toFixed(1)}/${state.player.xpToNext}`,
        `kills=${state.stats.kills} ult=${state.ultimate.charge.toFixed(0)}/${state.ultimate.chargeSeconds}`,
        `reroll=${state.levelUpRerollsRemaining}`,
        `1stKill=${f(t.firstKillSec)} lv2=${f(t.level2Sec)} 1stDmg=${f(t.firstDamageSec)}`,
        `cap1=${f(t.firstCapsuleSec)} elites=${t.eliteKillSecs.length}`,
      ].join('\n'));
    } else {
      this.debugText.setVisible(false);
    }
  }

  private updateBerserkPortrait(state: RuntimeState, ratio: number): void {
    const active = state.ultimate.activeRemaining > 0;
    const ready = state.ultimate.ready;
    const pulse = 0.78 + Math.sin(state.elapsedSec * 14) * 0.18;
    const ringColor = active ? COLORS.hpFill : ready ? COLORS.ultReady : COLORS.ultFill;

    this.portraitRing.clear();
    this.portraitRing.lineStyle(4, 0x28223d, 0.95).strokeCircle(PORTRAIT_X, PORTRAIT_Y, 35);
    this.portraitRing.lineStyle(active ? 6 : 4, ringColor, active ? pulse : 1);
    this.portraitRing.beginPath();
    this.portraitRing.arc(
      PORTRAIT_X,
      PORTRAIT_Y,
      35,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * (active ? 1 : ratio),
      false,
    );
    this.portraitRing.strokePath();

    if (this.portraitImage) {
      const texture = active ? YUI_HUD_FRAME_IDS.portraitAlt : YUI_HUD_FRAME_IDS.portraitNeutral;
      if (this.scene.textures.exists(texture) && this.portraitImage.texture.key !== texture) {
        this.portraitImage.setTexture(texture);
      }
      this.portraitImage.setTint(active ? 0xffd6d6 : 0xffffff);
    }

    if (this.crestImage) {
      const texture = active ? YUI_HUD_FRAME_IDS.crestBlack : YUI_HUD_FRAME_IDS.crestNormal;
      if (this.scene.textures.exists(texture) && this.crestImage.texture.key !== texture) {
        this.crestImage.setTexture(texture);
      }
      this.crestImage.setVisible(active || ready).setAlpha(active ? pulse : 1);
    }

    const label = active ? '暴走中' : ready ? '暴走 READY' : `暴走 ${Math.floor(ratio * 100)}%`;
    this.berserkText
      .setText(label)
      .setColor(active ? '#ffb3b3' : ready ? '#fff1b0' : '#cfe6ff');
  }

  private updateInventorySlots(state: RuntimeState): void {
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

  /** VisualGallery 用: HUD一式の表示切替。 */
  setVisible(visible: boolean): void {
    for (const obj of [
      this.timeText, this.levelText, this.hpBack, this.hpFill, this.hpText,
      this.xpBar, this.ultIcon, this.ultText, this.ultHintText, this.ultHitArea,
      this.inventoryBack, ...this.categoryLabels, this.portraitFrame, this.portraitRing,
      this.berserkText,
    ]) {
      obj.setVisible(visible);
    }
    this.weaponSlots.forEach((slot) => slot.setVisible(visible));
    this.passiveSlots.forEach((slot) => slot.setVisible(visible));
    this.rareSlots.forEach((slot) => slot.setVisible(visible));
    this.portraitImage?.setVisible(visible);
    this.portraitFallback.setVisible(visible && !this.portraitImage);
    if (!visible) this.crestImage?.setVisible(false);
    if (!visible) this.debugText.setVisible(false);
  }

  destroy(): void {
    this.ultHitArea.destroy();
    this.weaponSlots.forEach((slot) => slot.destroy());
    this.passiveSlots.forEach((slot) => slot.destroy());
    this.rareSlots.forEach((slot) => slot.destroy());
  }
}
