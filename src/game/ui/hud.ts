import Phaser from 'phaser';
import type { RuntimeState } from '../runtime';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { weaponById } from '../data/weapons';
import { passiveById } from '../data/passives';
import { characterById } from '../data/characters';

const FONT = '"Hiragino Sans", "Yu Gothic", sans-serif';

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
      .text(12, 16, 'Lv.1', { fontFamily: FONT, fontSize: '16px', color: '#f3ead2' })
      .setOrigin(0, 0)
      .setDepth(d);

    this.xpBar = scene.add.graphics().setDepth(d);

    this.hpBack = scene.add.graphics().setDepth(d);
    this.hpFill = scene.add.graphics().setDepth(d);
    this.hpText = scene.add
      .text(16, GAME_HEIGHT - 40, '', { fontFamily: FONT, fontSize: '12px', color: '#f3ead2' })
      .setDepth(d);

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
      (_pointer: Phaser.Input.Pointer, _localX: number, _localY: number, event?: Phaser.Types.Input.EventData) => {
        event?.stopPropagation();
        this.onUltimate();
      },
    );

    this.itemsText = scene.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 18, '', { fontFamily: FONT, fontSize: '12px', color: '#f3ead2' })
      .setOrigin(0.5, 0.5)
      .setDepth(d);

    this.debugText = scene.add
      .text(8, 44, '', { fontFamily: 'monospace', fontSize: '10px', color: '#9fe0a0' })
      .setDepth(d)
      .setVisible(false);
  }

  update(state: RuntimeState): void {
    const remain = Math.max(0, Math.ceil(state.durationSec - state.elapsedSec));
    const mm = Math.floor(remain / 60).toString().padStart(2, '0');
    const ss = (remain % 60).toString().padStart(2, '0');
    this.timeText.setText(`朝まで ${mm}:${ss}`);
    this.levelText.setText(`Lv.${state.player.level}`);

    // XPバー（画面上端）
    const xpRatio = Math.max(0, Math.min(1, state.player.xp / state.player.xpToNext));
    this.xpBar.clear();
    this.xpBar.fillStyle(COLORS.xpBack, 0.7).fillRect(0, 0, GAME_WIDTH, 4);
    this.xpBar.fillStyle(COLORS.xpFill, 1).fillRect(0, 0, GAME_WIDTH * xpRatio, 4);

    // HPバー（左下）
    const p = state.player;
    const hpRatio = Math.max(0, p.hp / p.maxHp);
    const hpW = 150;
    const hpY = GAME_HEIGHT - 24;
    this.hpBack.clear().fillStyle(COLORS.hpBack, 0.85).fillRect(16, hpY, hpW, 12);
    const lowBlink = hpRatio <= 0.35 && Math.floor(state.elapsedSec * 4) % 2 === 0;
    this.hpFill.clear().fillStyle(lowBlink ? 0xffffff : COLORS.hpFill, 1).fillRect(16, hpY, hpW * hpRatio, 12);
    this.hpText.setText(`${Math.ceil(p.hp)} / ${p.maxHp}`).setPosition(16, hpY - 16);

    // 必殺技アイコン（右上・丸ゲージ）
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
    this.ultHintText
      .setText(state.ultimate.ready ? 'TAP' : `${Math.floor(ultRatio * 100)}%`)
      .setColor(state.ultimate.ready ? '#fff1b0' : '#cfe6ff');
    this.ultHitArea.setName(ultName);

    // 所持武器/パッシブ
    const wStr = state.inventory.weapons
      .map((w) => `${weaponById.get(w.id)?.name ?? w.id}${w.level}`)
      .join(' ');
    const pStr = state.inventory.passives
      .map((pp) => `${passiveById.get(pp.id)?.name ?? pp.id}${pp.level}`)
      .join(' ');
    this.itemsText.setText([wStr, pStr].filter(Boolean).join('  /  '));

    // デバッグ
    if (state.debug) {
      const t = state.telemetry;
      const f = (n: number | null) => (n === null ? '--' : n.toFixed(1));
      this.debugText.setVisible(true).setText(
        [
          `t=${state.elapsedSec.toFixed(1)} status=${state.status}`,
          `enemies=${state.enemies.length} proj=${state.projectiles.length}`,
          `pickups=${state.pickups.length} areas=${state.areas.length}`,
          `hp=${p.hp.toFixed(0)} lv=${state.player.level} xp=${state.player.xp.toFixed(1)}/${state.player.xpToNext}`,
          `kills=${state.stats.kills} ult=${state.ultimate.charge.toFixed(0)}/${state.ultimate.chargeSeconds}`,
          `1stKill=${f(t.firstKillSec)} lv2=${f(t.level2Sec)} 1stDmg=${f(t.firstDamageSec)}`,
          `cap1=${f(t.firstCapsuleSec)} elites=${t.eliteKillSecs.length}`,
        ].join('\n'),
      );
    }
  }

  destroy(): void {
    this.ultHitArea.destroy();
  }
}
