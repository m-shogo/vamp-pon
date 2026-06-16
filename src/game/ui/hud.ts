import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { characterById } from '../data/characters';
import { spriteOrNull } from '../assets/assetHelpers';
import { YUI_HUD_FRAME_IDS } from '../assets/playerFrames';
import { InventorySlotView } from './inventorySlot';
import { PixelGlyphText, UI_FONT, drawPixelBar, drawPixelPanel } from './pixelUi';

const PORTRAIT_X = 38;
const PORTRAIT_Y = GAME_HEIGHT - 38;
const INVENTORY_TOP = GAME_HEIGHT - 88;
const SLOT_WEAPON_X = [112, 155, 198, 241, 284] as const;
const SLOT_RARE_X = [337, 372] as const;
const SLOT_WEAPON_Y = GAME_HEIGHT - 65;
const SLOT_PASSIVE_Y = GAME_HEIGHT - 28;
const ULT_X = GAME_WIDTH - 42;
const ULT_Y = 39;

type InputEventLike = { stopPropagation?: () => void };

export class Hud {
  private hudBack: Phaser.GameObjects.Graphics;
  private timeLabel: Phaser.GameObjects.Text;
  private timeDigits: PixelGlyphText;
  private levelText: PixelGlyphText;
  private hpText: PixelGlyphText;
  private hpBar: Phaser.GameObjects.Graphics;
  private xpBar: Phaser.GameObjects.Graphics;
  private ultIcon: Phaser.GameObjects.Graphics;
  private ultLabel: Phaser.GameObjects.Text;
  private ultValue: PixelGlyphText;
  private ultHint: PixelGlyphText;
  private ultHitArea: Phaser.GameObjects.Zone;
  private inventoryBack: Phaser.GameObjects.Graphics;
  private categoryLabels: Phaser.GameObjects.Text[];
  private portraitFrame: Phaser.GameObjects.Graphics;
  private portraitCharge: Phaser.GameObjects.Graphics;
  private portraitImage: Phaser.GameObjects.Image | null;
  private portraitFallback: Phaser.GameObjects.Text;
  private crestImage: Phaser.GameObjects.Image | null;
  private berserkBack: Phaser.GameObjects.Graphics;
  private berserkLabel: Phaser.GameObjects.Text;
  private berserkValue: PixelGlyphText;
  private weaponSlots: InventorySlotView[];
  private passiveSlots: InventorySlotView[];
  private rareSlots: InventorySlotView[];
  private debugText: Phaser.GameObjects.Text;

  constructor(
    private scene: Phaser.Scene,
    private onUltimate: () => void,
  ) {
    const depth = VIEW_DEPTH.hud;

    this.hudBack = scene.add.graphics().setDepth(depth);
    drawPixelPanel(this.hudBack, 71, 38, 134, 62, {
      fill: 0x171328,
      edge: 0x665d80,
      accent: 0xb8a06a,
      cut: 7,
      border: 2,
    });
    drawPixelPanel(this.hudBack, GAME_WIDTH / 2, 27, 126, 44, {
      fill: 0x171328,
      edge: 0x665d80,
      accent: 0xffce7a,
      cut: 7,
      border: 2,
    });

    this.timeLabel = scene.add.text(GAME_WIDTH / 2, 10, '朝まで', {
      fontFamily: UI_FONT,
      fontSize: '9px',
      color: '#d8cfe8',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0.5, 0).setDepth(depth + 2);
    this.timeDigits = new PixelGlyphText(scene, GAME_WIDTH / 2, 24, 2, 0xfff0b0, 'center', 1)
      .setDepth(depth + 2);

    this.levelText = new PixelGlyphText(scene, 17, 14, 1, 0xf3ead2, 'left', 1)
      .setText('LV1')
      .setDepth(depth + 2);
    this.hpText = new PixelGlyphText(scene, 17, 34, 1, 0xf3ead2, 'left', 1)
      .setText('HP100/100')
      .setDepth(depth + 2);

    this.xpBar = scene.add.graphics().setDepth(depth + 1);
    this.hpBar = scene.add.graphics().setDepth(depth + 1);

    this.ultIcon = scene.add.graphics().setDepth(depth + 1);
    this.ultLabel = scene.add.text(ULT_X, ULT_Y - 15, '必殺', {
      fontFamily: UI_FONT,
      fontSize: '9px',
      color: '#d8cfe8',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0.5).setDepth(depth + 2);
    this.ultValue = new PixelGlyphText(scene, ULT_X, ULT_Y - 2, 1, 0xf3ead2, 'center', 1)
      .setDepth(depth + 2);
    this.ultHint = new PixelGlyphText(scene, ULT_X, ULT_Y + 13, 1, 0xcfe6ff, 'center', 1)
      .setDepth(depth + 2);

    this.ultHitArea = scene.add
      .zone(ULT_X, ULT_Y, 70, 70)
      .setOrigin(0.5)
      .setDepth(depth + 3)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true });
    this.ultHitArea.on(
      Phaser.Input.Events.POINTER_DOWN,
      (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event?: InputEventLike) => {
        event?.stopPropagation?.();
        this.onUltimate();
      },
    );

    this.inventoryBack = scene.add.graphics().setDepth(depth);
    this.drawInventoryFrame();
    this.categoryLabels = [
      scene.add.text(82, SLOT_WEAPON_Y, '武器', {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: '#d7e6f0',
        fontStyle: 'bold',
        resolution: 1,
      }).setOrigin(0.5).setDepth(depth + 1),
      scene.add.text(82, SLOT_PASSIVE_Y, '忘物', {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: '#e0d1ee',
        fontStyle: 'bold',
        resolution: 1,
      }).setOrigin(0.5).setDepth(depth + 1),
      scene.add.text(316, SLOT_PASSIVE_Y, 'レア', {
        fontFamily: UI_FONT,
        fontSize: '8px',
        color: '#ffe9a8',
        fontStyle: 'bold',
        resolution: 1,
      }).setOrigin(0.5).setDepth(depth + 1),
    ];

    this.portraitFrame = scene.add.graphics().setDepth(depth + 1);
    drawPixelPanel(this.portraitFrame, PORTRAIT_X, PORTRAIT_Y, 68, 68, {
      fill: 0x171328,
      edge: COLORS.cardEdge,
      accent: 0xffce7a,
      cut: 9,
      border: 2,
    });
    this.portraitCharge = scene.add.graphics().setDepth(depth + 3);

    this.portraitImage = spriteOrNull(scene, YUI_HUD_FRAME_IDS.portraitNeutral, 58, 58);
    this.portraitImage?.setPosition(PORTRAIT_X, PORTRAIT_Y).setDepth(depth + 2);
    this.portraitFallback = scene.add.text(PORTRAIT_X, PORTRAIT_Y, 'ユ', {
      fontFamily: UI_FONT,
      fontSize: '23px',
      color: '#f3ead2',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0.5).setDepth(depth + 2).setVisible(!this.portraitImage);

    this.crestImage = spriteOrNull(scene, YUI_HUD_FRAME_IDS.crestNormal, 18, 18);
    this.crestImage?.setPosition(PORTRAIT_X + 24, PORTRAIT_Y - 23).setDepth(depth + 4).setVisible(false);

    this.berserkBack = scene.add.graphics().setDepth(depth + 3);
    drawPixelPanel(this.berserkBack, PORTRAIT_X, INVENTORY_TOP + 4, 70, 18, {
      fill: 0x171328,
      edge: 0x665d80,
      accent: 0xaa6f8b,
      cut: 4,
      border: 1,
    });
    this.berserkLabel = scene.add.text(8, INVENTORY_TOP + 4, '暴走', {
      fontFamily: UI_FONT,
      fontSize: '8px',
      color: '#d8cfe8',
      fontStyle: 'bold',
      resolution: 1,
    }).setOrigin(0, 0.5).setDepth(depth + 4);
    this.berserkValue = new PixelGlyphText(scene, 66, INVENTORY_TOP, 1, 0xcfe6ff, 'right', 1)
      .setDepth(depth + 4);

    this.weaponSlots = SLOT_WEAPON_X.map((x) => new InventorySlotView(scene, x, SLOT_WEAPON_Y, 30, depth + 2));
    this.passiveSlots = SLOT_WEAPON_X.map((x) => new InventorySlotView(scene, x, SLOT_PASSIVE_Y, 30, depth + 2));
    this.rareSlots = SLOT_RARE_X.map((x) => new InventorySlotView(scene, x, SLOT_PASSIVE_Y, 24, depth + 2));

    this.debugText = scene.add.text(8, 74, '', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#9fe0a0',
      backgroundColor: '#11151ccc',
      resolution: 1,
      padding: { left: 4, right: 4, top: 3, bottom: 3 },
    }).setDepth(depth + 8).setVisible(false);
  }

  private drawInventoryFrame(): void {
    const panelX = 76;
    const panelWidth = GAME_WIDTH - panelX - 4;
    const centerX = panelX + panelWidth / 2;
    this.inventoryBack.clear();
    drawPixelPanel(this.inventoryBack, centerX, INVENTORY_TOP + 42, panelWidth, 84, {
      fill: 0x120f24,
      edge: 0x5b5272,
      accent: 0xb8a06a,
      cut: 8,
      border: 2,
    });

    drawPixelPanel(this.inventoryBack, 82, SLOT_WEAPON_Y, 24, 24, {
      fill: 0x18263f,
      edge: 0x6d83a0,
      cut: 4,
      border: 1,
    });
    drawPixelPanel(this.inventoryBack, 82, SLOT_PASSIVE_Y, 24, 24, {
      fill: 0x2b203d,
      edge: 0x8f70a2,
      cut: 4,
      border: 1,
    });
    drawPixelPanel(this.inventoryBack, 316, SLOT_PASSIVE_Y, 26, 24, {
      fill: 0x3a2f20,
      edge: 0xb18d43,
      cut: 4,
      border: 1,
    });

    for (const x of SLOT_WEAPON_X) {
      drawPixelPanel(this.inventoryBack, x, SLOT_WEAPON_Y, 34, 32, {
        fill: 0x171328,
        edge: 0x6d6385,
        accent: 0x7ea5c2,
        cut: 5,
        border: 1,
      });
      drawPixelPanel(this.inventoryBack, x, SLOT_PASSIVE_Y, 34, 32, {
        fill: 0x171328,
        edge: 0x6d6385,
        accent: 0xa98bc2,
        cut: 5,
        border: 1,
      });
    }
    for (const x of SLOT_RARE_X) {
      drawPixelPanel(this.inventoryBack, x, SLOT_PASSIVE_Y, 30, 30, {
        fill: 0x171328,
        edge: COLORS.cardEdge,
        accent: 0xd2ae62,
        cut: 5,
        border: 1,
      });
    }
  }

  update(state: RuntimeState): void {
    const remain = Math.max(0, Math.ceil(state.durationSec - state.elapsedSec));
    const minutes = Math.floor(remain / 60).toString().padStart(2, '0');
    const seconds = (remain % 60).toString().padStart(2, '0');
    this.timeDigits.setText(`${minutes}:${seconds}`);
    this.levelText.setText(`LV${state.player.level}`);

    const xpRatio = Math.max(0, Math.min(1, state.player.xp / state.player.xpToNext));
    this.xpBar.clear();
    drawPixelBar(this.xpBar, 0, 0, GAME_WIDTH, 6, xpRatio, COLORS.xpBack, COLORS.xpFill, 30);

    const player = state.player;
    const hpRatio = Math.max(0, player.hp / player.maxHp);
    const lowBlink = hpRatio <= 0.35 && Math.floor(state.elapsedSec * 4) % 2 === 0;
    this.hpBar.clear();
    drawPixelBar(
      this.hpBar,
      12,
      52,
      118,
      11,
      hpRatio,
      COLORS.hpBack,
      lowBlink ? 0xffffff : COLORS.hpFill,
      12,
    );
    this.hpText.setText(`HP${Math.ceil(player.hp)}/${player.maxHp}`);

    const character = characterById.get(state.characterId);
    const ultimateName = character?.ultimate.name ?? '必殺技';
    const ultimateRatio = Math.max(
      0,
      Math.min(1, state.ultimate.ready ? 1 : state.ultimate.charge / state.ultimate.chargeSeconds),
    );
    this.drawUltimate(ultimateRatio, state.ultimate.ready);
    this.ultValue
      .setText(state.ultimate.ready ? 'OK' : `${Math.floor(ultimateRatio * 100)}%`)
      .setColor(state.ultimate.ready ? 0xfff0b0 : 0xf3ead2);
    this.ultHint
      .setText(state.ultimate.ready ? 'TAP' : '')
      .setColor(state.ultimate.ready ? 0xffd45e : 0xcfe6ff);
    this.ultHitArea.setName(ultimateName);

    this.updateBerserkPortrait(state, ultimateRatio);
    this.updateInventorySlots(state);

    if (state.debug) {
      const telemetry = state.telemetry;
      const format = (value: number | null) => (value === null ? '--' : value.toFixed(1));
      this.debugText.setVisible(true).setText([
        `t=${state.elapsedSec.toFixed(1)} status=${state.status}`,
        `enemies=${state.enemies.length} proj=${state.projectiles.length}`,
        `pickups=${state.pickups.length} areas=${state.areas.length}`,
        `hp=${player.hp.toFixed(0)} lv=${state.player.level} xp=${state.player.xp.toFixed(1)}/${state.player.xpToNext}`,
        `kills=${state.stats.kills} ult=${state.ultimate.charge.toFixed(0)}/${state.ultimate.chargeSeconds}`,
        `reroll=${state.levelUpRerollsRemaining}`,
        `1stKill=${format(telemetry.firstKillSec)} lv2=${format(telemetry.level2Sec)} 1stDmg=${format(telemetry.firstDamageSec)}`,
        `cap1=${format(telemetry.firstCapsuleSec)} elites=${telemetry.eliteKillSecs.length}`,
      ].join('\n'));
    } else {
      this.debugText.setVisible(false);
    }
  }

  private drawUltimate(ratio: number, ready: boolean): void {
    const activeColor = ready ? COLORS.ultReady : COLORS.ultFill;
    this.ultIcon.clear();
    drawPixelPanel(this.ultIcon, ULT_X, ULT_Y, 68, 68, {
      fill: 0x171328,
      edge: 0x665d80,
      accent: ready ? 0xffd45e : 0x7ea5c2,
      cut: 9,
      border: 2,
    });
    drawPixelChargeBorder(this.ultIcon, ULT_X, ULT_Y, 60, 60, ratio, activeColor, 0x332d49, 16);
  }

  private updateBerserkPortrait(state: RuntimeState, ratio: number): void {
    const active = state.ultimate.activeRemaining > 0;
    const ready = state.ultimate.ready;
    const pulse = 0.78 + Math.sin(state.elapsedSec * 14) * 0.18;
    const chargeColor = active ? COLORS.hpFill : ready ? COLORS.ultReady : COLORS.ultFill;

    this.portraitCharge.clear();
    drawPixelChargeBorder(
      this.portraitCharge,
      PORTRAIT_X,
      PORTRAIT_Y,
      66,
      66,
      active ? 1 : ratio,
      chargeColor,
      0x332d49,
      20,
      active ? pulse : 1,
    );

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

    this.berserkLabel
      .setText(active ? '暴走中' : ready ? '暴走' : '暴走')
      .setColor(active ? '#ffb3b3' : ready ? '#fff1b0' : '#d8cfe8');
    this.berserkValue
      .setText(active ? '100%' : ready ? 'OK' : `${Math.floor(ratio * 100)}%`)
      .setColor(active ? 0xffb3b3 : ready ? 0xfff1b0 : 0xcfe6ff);
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
    for (const object of [
      this.hudBack,
      this.timeLabel,
      this.timeDigits.container,
      this.levelText.container,
      this.hpText.container,
      this.hpBar,
      this.xpBar,
      this.ultIcon,
      this.ultLabel,
      this.ultValue.container,
      this.ultHint.container,
      this.ultHitArea,
      this.inventoryBack,
      ...this.categoryLabels,
      this.portraitFrame,
      this.portraitCharge,
      this.berserkBack,
      this.berserkLabel,
      this.berserkValue.container,
    ]) {
      object.setVisible(visible);
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
    this.timeDigits.destroy();
    this.levelText.destroy();
    this.hpText.destroy();
    this.ultValue.destroy();
    this.ultHint.destroy();
    this.berserkValue.destroy();
    this.weaponSlots.forEach((slot) => slot.destroy());
    this.passiveSlots.forEach((slot) => slot.destroy());
    this.rareSlots.forEach((slot) => slot.destroy());
  }
}

function drawPixelChargeBorder(
  graphics: Phaser.GameObjects.Graphics,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  ratio: number,
  activeColor: number,
  inactiveColor: number,
  segments: number,
  alpha = 1,
): void {
  const positions: Array<[number, number]> = [];
  const horizontal = Math.max(2, Math.floor(segments / 4));
  const vertical = Math.max(2, Math.floor((segments - horizontal * 2) / 2));
  const left = centerX - width / 2;
  const right = centerX + width / 2 - 4;
  const top = centerY - height / 2;
  const bottom = centerY + height / 2 - 4;

  for (let index = 0; index < horizontal; index += 1) {
    const x = left + 4 + index * ((width - 12) / Math.max(1, horizontal - 1));
    positions.push([x, top], [right - (x - left), bottom]);
  }
  for (let index = 0; index < vertical; index += 1) {
    const y = top + 6 + index * ((height - 16) / Math.max(1, vertical - 1));
    positions.push([right, y], [left, bottom - (y - top)]);
  }

  const activeCount = Math.round(Phaser.Math.Clamp(ratio, 0, 1) * positions.length);
  positions.forEach(([x, y], index) => {
    graphics.fillStyle(index < activeCount ? activeColor : inactiveColor, index < activeCount ? alpha : 0.75);
    graphics.fillRect(Math.round(x), Math.round(y), 4, 4);
  });
}
