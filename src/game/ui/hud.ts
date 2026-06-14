import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { characterById } from '../data/characters';

const FONT = '"Hiragino Sans", "Yu Gothic", sans-serif';

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
  private itemsText: Phaser.GameObjects.Text;
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

    this.itemsText = scene.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 18, '', { fontFamily: FONT, fontSize: '11px', color: '#f3ead2' })
      .setOrigin(0.5, 0.5)
      .setDepth(d);

    this.debugText = scene.add
      .text(8, 68, '', { fontFamily: 'monospace', fontSize: '10px', color: '#9fe0a0' })
      .setDepth(d)
      .setVisible(false);
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

    const wStr = state.inventory.weapons.map((w) => `${weaponIcon(w.id)}${w.level}`).join(' ');
    const pStr = state.inventory.passives.map((pp) => `${passiveIcon(pp.id)}${pp.level}`).join(' ');
    const rStr = state.inventory.rareItems.map((item) => `${rareIcon(item.id)}`).join(' ');
    const slots = `武${state.inventory.weapons.length}/${state.inventory.weaponSlots} 忘${state.inventory.passives.length}/${state.inventory.passiveSlots} レア${state.inventory.rareItems.length}/${state.inventory.rareItemSlots}`;
    this.itemsText.setText(`${slots}  ${[wStr, pStr, rStr].filter(Boolean).join('  /  ')}`);

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
    }
  }

  /** VisualGallery 用: HUD一式の表示切替。 */
  setVisible(visible: boolean): void {
    for (const obj of [
      this.timeText, this.levelText, this.hpBack, this.hpFill, this.hpText,
      this.xpBar, this.ultIcon, this.ultText, this.ultHintText, this.ultHitArea, this.itemsText,
    ]) {
      obj.setVisible(visible);
    }
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
