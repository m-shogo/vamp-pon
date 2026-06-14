import Phaser from 'phaser';
import type { LevelUpChoice, CapsuleReward } from '../domain/types';
import type { RuntimeState } from '../runtime';
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
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, '移動: 左半分ドラッグ / WASD・矢印', 12, '#c9bfae'));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 62, '必殺技: 画面右半分タップ', 12, '#c9bfae'));
    const btn = this.button(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 130, 200, 52, 'はじめる', () => {
      this.clear();
      onStart();
    });
    c.add(btn);
  }

  showLevelUp(state: RuntimeState, choices: LevelUpChoice[], onPick: (c: LevelUpChoice) => void): void {
    const c = this.dim();
    c.add(this.text(GAME_WIDTH / 2, 120, '記憶が少し戻った', 24, '#f3ead2'));

    const cardW = 320;
    const cardH = 132;
    const gap = 18;
    const totalH = choices.length * cardH + (choices.length - 1) * gap;
    let y = GAME_HEIGHT / 2 - totalH / 2 + cardH / 2;

    for (const choice of choices) {
      const card = this.levelUpCard(GAME_WIDTH / 2, y, cardW, cardH, choice, () => {
        this.clear();
        onPick(choice);
      });
      c.add(card);
      y += cardH + gap;
    }
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT - 40, 'ひとつ選ぶ', 14, '#c9bfae'));
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
    const bg = this.scene.add.rectangle(0, 0, w, h, COLORS.cardBg, 1);
    bg.setStrokeStyle(3, COLORS.cardEdge, 1);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerdown', onClick);
    card.add(bg);

    const tag = tagFor(choice);
    const title = choice.title;
    const desc = choice.description;
    const lore = 'lore' in choice && choice.lore ? choice.lore : '';

    card.add(
      this.scene.add
        .text(0, -h / 2 + 22, title, { fontFamily: FONT, fontSize: '18px', color: '#3a3326', fontStyle: 'bold' })
        .setOrigin(0.5),
    );
    card.add(
      this.scene.add
        .text(0, -h / 2 + 46, tag, { fontFamily: FONT, fontSize: '11px', color: '#9a8d6f' })
        .setOrigin(0.5),
    );
    card.add(
      this.scene.add
        .text(0, -4, desc, { fontFamily: FONT, fontSize: '14px', color: '#3a3326', align: 'center', wordWrap: { width: w - 36 } })
        .setOrigin(0.5),
    );
    if (lore) {
      card.add(
        this.scene.add
          .text(0, h / 2 - 24, lore, {
            fontFamily: FONT,
            fontSize: '10px',
            color: '#9a8d6f',
            align: 'center',
            wordWrap: { width: w - 36 },
          })
          .setOrigin(0.5),
      );
    }
    return card;
  }

  showCapsule(state: RuntimeState, reward: CapsuleReward, onClose: () => void): void {
    const c = this.dim(0.6);
    const title =
      reward.type === 'evolution'
        ? '記憶がつながった'
        : reward.type === 'currency'
          ? '名前が戻った'
          : '道具が少し戻った';
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 70, '記憶カプセル', 14, '#bfe6ff'));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, title, 24, '#f3ead2'));
    c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, reward.title, 18, '#ffe9a8'));
    const lore = reward.type === 'evolution' ? reward.lore : '';
    if (lore) {
      c.add(this.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 48, lore, 12, '#c9bfae'));
    }

    const close = () => {
      this.clear();
      onClose();
    };
    const bg = c.list[0] as Phaser.GameObjects.Rectangle;
    bg.on('pointerdown', close);
    this.scene.time.delayedCall(1100, () => {
      if (this.current === c) close();
    });
  }

  showResult(state: RuntimeState, cleared: boolean, onRestart: () => void): void {
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
        430,
        cleared ? '黒いインクの下に、まだ道が残っている。' : 'まだ、戻せていない名前がある。',
        12,
        '#c9bfae',
      ),
    );

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
      .text(0, 0, label, { fontFamily: FONT, fontSize: '20px', color: '#3a3326', fontStyle: 'bold' })
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
