import Phaser from 'phaser';
import type { LevelUpChoice, CapsuleReward, RewardRarity } from '../domain/types';
import type { RuntimeState } from '../runtime';
import type { PlayLog } from '../domain/playLog';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { weaponById } from '../data/weapons';

const FONT = '"Hiragino Sans", "Yu Gothic", sans-serif';
const D = VIEW_DEPTH.overlay;

export class Overlays {
  private current: Phaser.GameObjects.Container | null = null;

  constructor(private scene: Phaser.Scene) {}

  private dim(alpha = 0.72): Phaser.GameObjects.Container {
    this.clear();
    const c = this.scene.add.container(0, 0).setDepth(D);
    const bg = this.scene.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.overlay, alpha)
      .setInteractive();
    c.add(bg);
    this.current = c;
    return c;
  }

  clear(): void {
    this.current?.destroy();
    this.current = null;
  }

  private text(x: number, y: number, s: string, size: number, color: string, origin = 0.5): Phaser.GameObjects.Text {
    return this.scene.add
      .text(x, y, s, { fontFamily: FONT, fontSize: `${size}px`, color, align: 'center' })
      .setOrigin(origin, 0.5);
  }

  showReady(onStart: () => void): void {
    const c = this.dim(0.5);
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70, 'Vamp Pon', 40, '#f3ead2'));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, '夜の街で、忘れ物を集めて朝まで生きのびる。', 13, '#c9bfae'));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, '移動: どこでもドラッグ / WASD・矢印', 12, '#c9bfae'));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 62, '必殺技: 右上の丸アイコン', 12, '#c9bfae'));
    const btn = this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 130, 200, 52, 'はじめる', () => {
      this.clear();
      onStart();
    });
    c.add(btn);
  }

  showLevelUp(
    state: RuntimeState,
    choices: LevelUpChoice[],
    onPick: (c: LevelUpChoice) => void,
    onReroll: () => void,
  ): void {
    const c = this.dim();
    c.add(this.text(GAME_WIDTH / 2, 82, '記憶が少し戻った', 23, '#f3ead2'));
    c.add(this.text(GAME_WIDTH / 2, 110, 'たまに★付きの拾い物が出る', 11, '#c9bfae'));

    const cardW = 326;
    const cardH = 146;
    const gap = 10;
    const totalH = choices.length * cardH + (choices.length - 1) * gap;
    let y = GAME_HEIGHT / 2 - totalH / 2 + cardH / 2 + 6;

    for (const choice of choices) {
      const card = this.levelUpCard(GAME_WIDTH / 2, y, cardW, cardH, choice, () => {
        this.clear();
        onPick(choice);
      });
      c.add(card);
      y += cardH + gap;
    }

    const remaining = state.levelUpRerollsRemaining;
    const rerollLabel = remaining > 0 ? `入れ替え ${remaining}/3` : '入れ替え 0/3';
    const reroll = this.button(GAME_WIDTH / 2, GAME_HEIGHT - 44, 180, 38, rerollLabel, () => {
      if (state.levelUpRerollsRemaining <= 0) return;
      this.clear();
      onReroll();
    });
    reroll.setAlpha(remaining > 0 ? 1 : 0.45);
    c.add(reroll);
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT - 82, 'ひとつ選ぶ / 3回まで入れ替え', 12, '#c9bfae'));
  }

  private levelUpCard(
    cx: number,
    cy: number,
    w: number,
    h: number,
    choice: LevelUpChoice,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const card = this.scene.add.container(cx, cy);
    const rarity = choice.rarity ?? 'normal';
    const edge = rarityColor(rarity);
    const bg = this.scene.add.rectangle(0, 0, w, h, rarity === 'normal' ? COLORS.cardBg : 0xfff4cf, 1);
    bg.setStrokeStyle(rarity === 'rare' ? 5 : 3, edge, 1);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', onClick);
    card.add(bg);

    const icon = iconForChoice(choice);
    const title = choice.title;
    const desc = choice.description;
    const lore = 'lore' in choice && choice.lore ? choice.lore : '';

    const iconBg = this.scene.add.circle(-w / 2 + 38, -h / 2 + 39, 22, 0x3a3326, 1);
    iconBg.setStrokeStyle(2, edge, 1);
    card.add(iconBg);
    card.add(
      this.scene.add
        .text(-w / 2 + 38, -h / 2 + 39, icon, { fontFamily: FONT, fontSize: '20px', color: '#f3ead2', fontStyle: 'bold' })
        .setOrigin(0.5),
    );

    card.add(
      this.scene.add
        .text(-w / 2 + 72, -h / 2 + 23, title, {
          fontFamily: FONT,
          fontSize: '16px',
          color: '#3a3326',
          fontStyle: 'bold',
          wordWrap: { width: w - 92 },
        })
        .setOrigin(0, 0.5),
    );
    card.add(
      this.scene.add
        .text(-w / 2 + 72, -h / 2 + 52, `${rankFor(rarity)} / ${tagFor(choice)}`, {
          fontFamily: FONT,
          fontSize: '11px',
          color: rarity === 'normal' ? '#9a8d6f' : '#9a6024',
        })
        .setOrigin(0, 0.5),
    );
    card.add(
      this.scene.add
        .text(0, 12, desc, {
          fontFamily: FONT,
          fontSize: '13px',
          color: '#3a3326',
          align: 'center',
          wordWrap: { width: w - 38 },
          lineSpacing: 3,
        })
        .setOrigin(0.5),
    );
    if (lore) {
      card.add(
        this.scene.add
          .text(0, h / 2 - 18, lore, {
            fontFamily: FONT,
            fontSize: '9px',
            color: '#9a8d6f',
            align: 'center',
            wordWrap: { width: w - 46 },
          })
          .setOrigin(0.5),
      );
    }
    return card;
  }

  showCapsule(state: RuntimeState, reward: CapsuleReward, onClose: () => void): void {
    const isEvolution = reward.type === 'evolution';
    const c = this.dim(isEvolution ? 0.82 : 0.6);
    const title =
      reward.type === 'evolution'
        ? '記憶がつながった'
        : reward.type === 'currency'
          ? '名前が戻った'
          : '道具が少し戻った';

    if (isEvolution) {
      const flash = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xfff1b0, 0.22);
      const ring1 = this.scene.add.circle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 112, 0xffd45e, 0.08);
      ring1.setStrokeStyle(4, 0xfff1b0, 0.9);
      const ring2 = this.scene.add.circle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 74, 0xbfe6ff, 0.1);
      ring2.setStrokeStyle(3, 0xbfe6ff, 0.8);
      c.add([flash, ring1, ring2]);
      c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 116, 'EVOLUTION', 18, '#fff1b0'));
      c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 72, title, 28, '#f3ead2'));
      c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 18, reward.title, 24, '#ffe08a'));
    } else {
      c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70, '記憶カプセル', 14, '#bfe6ff'));
      c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, title, 24, '#f3ead2'));
      c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, reward.title, 18, '#ffe9a8'));
    }

    const lore = reward.type === 'evolution' ? reward.lore : '';
    if (lore) {
      c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 38, lore, 12, '#c9bfae'));
    }

    const close = () => {
      this.clear();
      onClose();
    };
    const bg = c.list[0] as Phaser.GameObjects.Rectangle;
    bg.on('pointerdown', close);
    this.scene.time.delayedCall(isEvolution ? 1900 : 1100, () => {
      if (this.current === c) close();
    });
  }

  showResult(state: RuntimeState, cleared: boolean, log: PlayLog, onRestart: () => void): void {
    const c = this.dim(0.8);
    const s = state.stats;
    const survived = Math.floor(s.survivedSec);
    const mm = Math.floor(survived / 60).toString().padStart(2, '0');
    const ss = (survived % 60).toString().padStart(2, '0');

    c.add(this.text(GAME_WIDTH / 2, 110, cleared ? '朝まで残った' : '夜に飲まれた', 28, '#f3ead2'));

    const lines = [
      `生存時間   ${mm}:${ss}`,
      `倒した影   ${s.kills}`,
      `集めた欠片 ${s.memoryFragmentsCollected}`,
      `到達Lv     ${state.player.level}`,
      `カプセル   ${s.capsulesOpened}`,
      `必殺技     ${s.ultimateUses}回`,
    ];
    c.add(
      this.scene.add
        .text(GAME_WIDTH / 2, 240, lines.join('\n'), {
          fontFamily: FONT,
          fontSize: '16px',
          color: '#f3ead2',
          align: 'center',
          lineSpacing: 8,
        })
        .setOrigin(0.5, 0.5),
    );

    const evoNames = s.evolutions.map((id) => weaponById.get(id)?.name ?? id).join(' / ');
    if (evoNames) {
      c.add(this.text(GAME_WIDTH / 2, 360, `進化: ${evoNames}`, 14, '#ffe9a8'));
    }

    c.add(
      this.text(
        GAME_WIDTH / 2,
        404,
        cleared ? '黒いインクの下に、まだ道が残っている。' : 'まだ、戻せていない名前がある。',
        12,
        '#c9bfae',
      ),
    );

    // プレイログ（計測値）。詳細1行JSONはコンソールにも出力。
    const fmt = (n: number | null) => (n === null ? '--' : `${n.toFixed(1)}s`);
    const eliteMark = (b: boolean) => (b ? '○' : '×');
    const logLines = [
      `初撃破 ${fmt(log.firstKillSec)}   Lv2 ${fmt(log.level2Sec)}`,
      `初被弾 ${fmt(log.firstDamageSec)}   初カプセル ${fmt(log.firstCapsuleSec)}`,
      `エリート撃破 3分${eliteMark(log.elite3mKilled)} 5分${eliteMark(log.elite5mKilled)} 7分${eliteMark(log.elite7mKilled)}`,
    ];
    c.add(
      this.scene.add
        .text(GAME_WIDTH / 2, 470, logLines.join('\n'), {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#9fe0a0',
          align: 'center',
          lineSpacing: 6,
        })
        .setOrigin(0.5, 0.5),
    );
    c.add(this.text(GAME_WIDTH / 2, 524, '※ 詳細ログはブラウザのコンソールに出力', 10, '#7c8a7c'));

    const btn = this.button(GAME_WIDTH / 2, GAME_HEIGHT - 90, 200, 52, 'もう一度', () => {
      this.clear();
      onRestart();
    });
    c.add(btn);
  }

  showPause(onResume: () => void): void {
    const c = this.dim(0.6);
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, 'やすみ中', 24, '#f3ead2'));
    const btn = this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, 200, 52, 'つづける', () => {
      this.clear();
      onResume();
    });
    c.add(btn);
  }

  private button(
    cx: number,
    cy: number,
    w: number,
    h: number,
    label: string,
    onClick: () => void,
  ): Phaser.GameObjects.Container {
    const c = this.scene.add.container(cx, cy);
    const bg = this.scene.add.rectangle(0, 0, w, h, COLORS.cardBg, 1);
    bg.setStrokeStyle(3, COLORS.cardEdge, 1);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', onClick);
    const t = this.scene.add
      .text(0, 0, label, { fontFamily: FONT, fontSize: '18px', color: '#3a3326', fontStyle: 'bold' })
      .setOrigin(0.5);
    c.add([bg, t]);
    return c;
  }
}

function tagFor(choice: LevelUpChoice): string {
  switch (choice.type) {
    case 'weapon_new':
      return '新しい道具';
    case 'passive_new':
      return '忘れ物';
    case 'weapon_upgrade':
    case 'passive_upgrade':
      return '強化';
    case 'heal':
      return 'ひとやすみ';
  }
}

function rankFor(rarity: RewardRarity): string {
  switch (rarity) {
    case 'rare':
      return '★★★ 大当たり';
    case 'good':
      return '★★ 良い';
    case 'normal':
      return '★ ふつう';
  }
}

function rarityColor(rarity: RewardRarity): number {
  switch (rarity) {
    case 'rare':
      return 0xffd45e;
    case 'good':
      return 0xbfe6ff;
    case 'normal':
      return COLORS.cardEdge;
  }
}

function iconForChoice(choice: LevelUpChoice): string {
  if (choice.type === 'heal') return '＋';
  if (choice.type === 'weapon_new' || choice.type === 'weapon_upgrade') {
    return weaponIcon(choice.itemId);
  }
  return passiveIcon(choice.itemId);
}

function weaponIcon(id: string): string {
  switch (id) {
    case 'night_pencil':
      return '✎';
    case 'marble':
      return '●';
    case 'moon_bookmark':
      return '☾';
    case 'black_ink_bottle':
      return '瓶';
    case 'stardust_shot':
      return '✦';
    case 'postcard_blade':
      return '刃';
    case 'paper_airplane':
      return '飛';
    case 'streetlamp_ring':
      return '輪';
    case 'unfinished_line':
      return '線';
    case 'north_star_lantern':
      return '灯';
    default:
      return '道';
  }
}

function passiveIcon(id: string): string {
  switch (id) {
    case 'gold_compass':
      return '針';
    case 'travel_badge':
      return '章';
    case 'moonlight_bookmark':
      return '栞';
    case 'old_ticket':
      return '券';
    case 'white_margin':
      return '余';
    case 'pressed_flower':
      return '花';
    case 'loose_map_pin':
      return '鋲';
    case 'small_alarm_clock':
      return '時';
    default:
      return '欠';
  }
}
