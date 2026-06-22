import Phaser from 'phaser';
import type { PresentationPattern, SelectedKnowledgeLine } from '../types/knowledge';
import { STORYBOOK_FONT, STORYBOOK_TITLE_FONT, STORYBOOK_UI, drawStorybookPanel } from './storybookUi';

type LoadingTextRendererOptions = {
  x: number;
  y: number;
  width: number;
  depth?: number;
};

type RenderedLoadingText = {
  container: Phaser.GameObjects.Container;
  destroy: () => void;
};

const DEFAULT_DEPTH = 100;
const SOURCE_PREFIX = '— ';

export class LoadingTextRenderer {
  constructor(private readonly scene: Phaser.Scene) {}

  render(selection: SelectedKnowledgeLine, options: LoadingTextRendererOptions): RenderedLoadingText {
    const depth = options.depth ?? DEFAULT_DEPTH;
    const container = this.scene.add.container(options.x, options.y).setDepth(depth);
    const panelHeight = this.measurePanelHeight(selection);
    const panel = this.scene.add.graphics();
    drawStorybookPanel(panel, 0, 0, options.width, panelHeight, STORYBOOK_UI.nightPanel, this.patternAccent(selection.line.presentationPattern), 0.94);

    const original = this.makeText(0, -panelHeight / 2 + 32, selection.line.originalText, {
      fontFamily: STORYBOOK_TITLE_FONT,
      fontSize: 19,
      color: STORYBOOK_UI.textLight,
      wordWrapWidth: options.width - 42,
      lineSpacing: 4,
      fontStyle: 'bold',
    });

    const source = this.makeText(0, original.y + original.height + 15, `${SOURCE_PREFIX}${selection.line.sourceLabel}`, {
      fontSize: 10,
      color: STORYBOOK_UI.textMuted,
      wordWrapWidth: options.width - 48,
      lineSpacing: 2,
    });

    const meaning = this.makeText(0, source.y + source.height + 22, selection.line.meaningJa, {
      fontSize: 15,
      color: STORYBOOK_UI.textLight,
      wordWrapWidth: options.width - 44,
      lineSpacing: 5,
    });

    container.add([panel, original, source, meaning]);

    if (selection.reply) {
      const reply = this.makeText(0, meaning.y + meaning.height + 26, selection.reply.replyJa, {
        fontSize: 15,
        color: '#ffe9b8',
        wordWrapWidth: options.width - 48,
        lineSpacing: 4,
        fontStyle: 'bold',
      });
      const speaker = this.makeText(0, reply.y + reply.height + 13, `— ${this.characterLabel(selection.reply.characterId)}`, {
        fontSize: 10,
        color: STORYBOOK_UI.textMuted,
        wordWrapWidth: options.width - 48,
        lineSpacing: 2,
      });
      container.add([reply, speaker]);
    }

    this.applyPatternAnimation(container, selection.line.presentationPattern);

    return {
      container,
      destroy: () => container.destroy(true),
    };
  }

  private makeText(
    x: number,
    y: number,
    value: string,
    options: {
      fontFamily?: string;
      fontSize: number;
      color: string;
      wordWrapWidth: number;
      lineSpacing: number;
      fontStyle?: string;
    },
  ): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, value, {
      fontFamily: options.fontFamily ?? STORYBOOK_FONT,
      fontSize: `${options.fontSize}px`,
      color: options.color,
      fontStyle: options.fontStyle ?? 'normal',
      align: 'center',
      resolution: 2,
      lineSpacing: options.lineSpacing,
      wordWrap: { width: options.wordWrapWidth, useAdvancedWrap: true },
    }).setOrigin(0.5, 0);
  }

  private measurePanelHeight(selection: SelectedKnowledgeLine): number {
    const originalLines = Math.max(1, Math.ceil(selection.line.originalText.length / 22));
    const meaningLines = Math.max(1, Math.ceil(selection.line.meaningJa.length / 20));
    const replyLines = selection.reply ? Math.max(1, Math.ceil(selection.reply.replyJa.length / 20)) : 0;
    const estimated = 106 + originalLines * 27 + meaningLines * 24 + replyLines * 25 + (selection.reply ? 42 : 8);
    return Phaser.Math.Clamp(estimated, 210, 330);
  }

  private patternAccent(pattern: PresentationPattern): number {
    switch (pattern) {
      case 'bell-ripple': return 0x96d7cf;
      case 'postcard-stamp': return 0xd8b070;
      case 'ink-bloom': return 0x8d76c9;
      case 'page-turn': return STORYBOOK_UI.gold;
      case 'lantern-reveal': return STORYBOOK_UI.goldLight;
      case 'star-pin': return 0xf4d69a;
      case 'water-memory': return 0x86bfe0;
      case 'thread-stitch': return 0xe0b0a6;
      case 'black-glitch': return 0xaa82d8;
      case 'curtain-whisper': return 0xd5a0c8;
    }
  }

  private applyPatternAnimation(container: Phaser.GameObjects.Container, pattern: PresentationPattern): void {
    container.setAlpha(0);
    const y = container.y;
    const offset = pattern === 'postcard-stamp' ? 10 : pattern === 'ink-bloom' ? 4 : 7;
    container.setY(y + offset);

    this.scene.tweens.add({
      targets: container,
      alpha: 1,
      y,
      duration: this.patternDuration(pattern),
      ease: pattern === 'bell-ripple' ? 'Sine.easeOut' : 'Quad.easeOut',
    });

    if (pattern === 'lantern-reveal' || pattern === 'bell-ripple') {
      this.scene.tweens.add({
        targets: container,
        scale: { from: 0.985, to: 1 },
        duration: 780,
        ease: 'Sine.easeOut',
      });
    }
  }

  private patternDuration(pattern: PresentationPattern): number {
    switch (pattern) {
      case 'ink-bloom': return 760;
      case 'bell-ripple': return 840;
      case 'postcard-stamp': return 680;
      case 'page-turn': return 620;
      case 'lantern-reveal': return 820;
      default: return 720;
    }
  }

  private characterLabel(characterId: string): string {
    const labels: Record<string, string> = {
      yui: 'ユイ / Yui',
      asa: 'アサ / Asa',
      nagi: 'ナギ / Nagi',
      michiru: 'ミチル / Michiru',
      tomori: 'トモリ / Tomori',
      shino: 'シノ / Shino',
      shion: 'シオン / Shion',
      chloe: 'クロエ / Chloe',
      koharu: 'コハル / Koharu',
      ren: 'レン / Ren',
      mayoi: 'マヨイ / Mayoi',
      iori: 'イオリ / Iori',
      haku: 'ハク / Haku',
      suzu: 'スズ / Suzu',
      ritsu: 'リツ / Ritsu',
      hinata: 'ヒナタ / Hinata',
      kaname: 'カナメ / Kaname',
      sena: 'セナ / Sena',
      yura: 'ユラ / Yura',
      nemu: 'ネム / Nemu',
    };
    return labels[characterId] ?? characterId;
  }
}
