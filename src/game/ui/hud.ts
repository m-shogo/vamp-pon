import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { characterById } from '../data/characters';
import { spriteOrNull } from '../assets/assetHelpers';
import { YUI_HUD_FRAME_IDS } from '../assets/playerFrames';

const FONT = '"Hiragino Sans", "Yu Gothic", sans-serif';
const PORTRAIT_X = 38;
const PORTRAIT_Y = GAME_HEIGHT - 38;
const INVENTORY_TOP = GAME_HEIGHT - 88;
const SLOT_WEAPON_X = [112, 155, 198, 241, 284] as const;
const SLOT_RARE_X = [337, 372] as const;
const SLOT_WEAPON_Y = GAME_HEIGHT - 65;
const SLOT_PASSIVE_Y = GAME_HEIGHT - 28;

type InputEventLike = { stopPropagation?: () => void };
type SlotText = Phaser.GameObjects.Text;

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
  private weaponSlots: SlotText[];
  private passiveSlots: SlotText[];
  private rareSlots: SlotText[];
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

    this.weaponSlots = SLOT_WEAPON_X.map((x) => this.createSlotText(x, SLOT_WEAPON_Y));
    this.passiveSlots = SLOT_WEAPON_X.map((x) => this.createSlotText(x, SLOT_PASSIVE_Y));
    this.rareSlots = SLOT_RARE_X.map((x) => this.createSlotText(x, SLOT_PASSIVE_Y));

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
      this.inventoryBack.fillRoundedRect(x - 18, SLOT_WEAPON_Y - 13, 36, 26, 5);
      this.inventoryBack.fillRoundedRect(x - 18, SLOT_PASSIVE_Y - 13, 36, 26, 5);
    }
    for (const x of SLOT_RARE_X) {
      this.inventoryBack.fillRoundedRect(x - 14, SLOT_PASSIVE_Y - 13, 28, 26, 5);
    }

    this.inventoryBack.lineStyle(1, 0x6d6385, 0.65);
    for (const x of SLOT_WEAPON_X) {
      this.inventoryBack.strokeRoundedRect(x - 18, SLOT_WEAPON_Y - 13, 36, 26, 5);
      this.inventoryBack.strokeRoundedRect(x - 18, SLOT_PASSIVE_Y - 13, 36, 26, 5);
    }
    this.inventoryBack.lineStyle(1, COLORS.cardEdge, 0.8);
    for (const x of SLOT_RARE_X) {
      this.inventoryBack.strokeRoundedRect(x - 14, SLOT_PASSIVE_Y - 13, 28, 26, 5);
    }
  }

  private createSlotText(x: number, y: number): SlotText {
    return this.scene.add
      .text(x, y, '·', { fontFamily: FONT, fontSize: '11px', color: '#6e6680', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setDepth(VIEW_DEPTH.hud + 2);
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
    this.weaponSlots.forEach((text, index) => {
      const item = state.inventory.weapons[index];
      text
        .setText(item ? `${weaponIcon(item.id)}${item.level}` : '·')
        .setColor(item ? '#d9edff' : '#6e6680');
    });

    this.passiveSlots.forEach((text, index) => {
      const item = state.inventory.passives[index];
      text
        .setText(item ? `${passiveIcon(item.id)}${item.level}` : '·')
        .setColor(item ? '#eadcff' : '#6e6680');
    });

    this.rareSlots.forEach((text, index) => {
      const item = state.inventory.rareItems[index];
      text
        .setText(item ? rareIcon(item.id) : '·')
        .setColor(item ? '#ffe9a8' : '#6e6680');
    });
  }

  /** VisualGallery 用: HUD一式の表示切替。 */
  setVisible(visible: boolean): void {
    for (const obj of [
      this.timeText, this.levelText, this.hpBack, this.hpFill, this.hpText,
      this.xpBar, this.ultIcon, this.ultText, this.ultHintText, this.ultHitArea,
      this.inventoryBack, ...this.categoryLabels, this.portraitFrame, this.portraitRing,
      this.berserkText, ...this.weaponSlots, ...this.passiveSlots, ...this.rareSlots,
    ]) {
      obj.setVisible(visible);
    }
    this.portraitImage?.setVisible(visible);
    this.portraitFallback.setVisible(visible && !this.portraitImage);
    if (!visible) this.crestImage?.setVisible(false);
    if (!visible) this.debugText.setVisible(false);
  }

  destroy(): void {
    this.ultHitArea.destroy();
  }
}

function weaponIcon(id: string): string {
  switch (id) {
    case 'night_pencil': return '✎';
    case 'marble': return '●';
    case 'moon_bookmark': return '☾';
    case 'black_ink_bottle': return '瓶';
    case 'stardust_shot': return '✦';
    case 'postcard_blade': return '刃';
    case 'paper_airplane': return '飛';
    case 'streetlamp_ring': return '輪';
    case 'unfinished_line': return '線';
    case 'north_star_lantern': return '灯';
    case 'dawn_ink_lamp': return '朝';
    case 'unforgotten_name': return '名';
    case 'memory_marble': return '追';
    case 'addressless_blade': return '封';
    case 'tailwind_plane': return '風';
    default: return '道';
  }
}

function passiveIcon(id: string): string {
  switch (id) {
    case 'gold_compass': return '針';
    case 'travel_badge': return '章';
    case 'moonlight_bookmark': return '栞';
    case 'old_ticket': return '券';
    case 'white_margin': return '余';
    case 'pressed_flower': return '花';
    case 'loose_map_pin': return '鋲';
    case 'small_alarm_clock': return '時';
    default: return '欠';
  }
}

function rareIcon(id: string): string {
  switch (id) {
    case 'name_tag': return '名';
    case 'cracked_lens': return '鏡';
    case 'sealed_letter': return '封';
    case 'wind_mark': return '風';
    default: return '◇';
  }
}
