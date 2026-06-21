import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import type { ProjectileVisualKind } from '../domain/weaponVisual';
import { createBackground } from '../ui/background';
import { areaTickFeedback, orbiterHitFeedback, projectileBounceFeedback, projectileHitFeedback, projectileTrail } from '../ui/weaponFeedback';
import { FONT } from '../ui/visualDesign';

const SAMPLE_PROJECTILES: Array<{ label: string; kind: ProjectileVisualKind; x: number; y: number; angle: number }> = [
  { label: '鉛筆', kind: 'pencil', x: 92, y: 205, angle: 0.15 },
  { label: '灯り', kind: 'paper_lantern', x: 298, y: 205, angle: Math.PI - 0.2 },
  { label: '紙刃', kind: 'blade', x: 92, y: 350, angle: -0.45 },
  { label: 'ビー玉', kind: 'glass_marble', x: 298, y: 350, angle: Math.PI + 0.35 },
  { label: '紙飛行機', kind: 'paper_airplane', x: 195, y: 498, angle: -0.1 },
];

export function isWeaponFeedbackQaUrl(search = typeof window === 'undefined' ? '' : window.location.search): boolean {
  const params = new URLSearchParams(search);
  const scene = params.get('scene') ?? params.get('debug') ?? '';
  return scene === 'weapon-fx-qa';
}

export class WeaponFeedbackQaScene extends Phaser.Scene {
  private fireCount = 0;
  private lastFxText?: Phaser.GameObjects.Text;

  constructor() {
    super('WeaponFeedbackQaScene');
  }

  create(): void {
    createBackground(this);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x101124, 0.76);
    this.add.rectangle(GAME_WIDTH / 2, 412, GAME_WIDTH - 24, 628, 0x171a32, 0.22)
      .setStrokeStyle(1, 0xfff2c7, 0.28);
    this.add.text(GAME_WIDTH / 2, 26, '武器別 hit / trail QA', {
      fontFamily: FONT,
      fontSize: '18px',
      color: '#fff2c7',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);
    this.add.text(GAME_WIDTH / 2, 60, '数値・当たり判定を変えず、見た目の文法だけ確認', {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#cfe6f0',
    }).setOrigin(0.5, 0);

    this.lastFxText = this.add.text(GAME_WIDTH / 2, 88, 'last FX: none', {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#ffe7a8',
      backgroundColor: '#080914',
      padding: { left: 6, right: 6, top: 3, bottom: 3 },
    }).setOrigin(0.5, 0);

    for (const sample of SAMPLE_PROJECTILES) {
      this.addSample(sample.label, sample.kind, sample.x, sample.y, sample.angle);
    }

    this.addAreaSample(82, 654, 'インク範囲', 'ink');
    this.addAreaSample(195, 654, '街灯範囲', 'lamp');
    this.addAreaSample(308, 654, '夜明け範囲', 'dawn');
    this.addButton(195, 748, 'オービット命中', () => {
      orbiterHitFeedback(this, 195, 700, 0.7);
      this.markFired('orbit hit');
    });

    this.add.text(GAME_WIDTH / 2, 804, '?scene=weapon-fx-qa', {
      fontFamily: FONT,
      fontSize: '10px',
      color: '#9eb3c5',
    }).setOrigin(0.5, 0);
  }

  private addSample(label: string, kind: ProjectileVisualKind, x: number, y: number, angle: number): void {
    this.add.text(x, y - 48, label, {
      fontFamily: FONT,
      fontSize: '12px',
      color: '#ffe7a8',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.addButton(x, y, 'hit', () => {
      projectileHitFeedback(this, kind, x, y + 12, angle);
      this.markFired(`${label} hit`);
    }, 72);
    this.addButton(x - 39, y + 56, 'trail', () => {
      for (let i = 0; i < 5; i += 1) projectileTrail(this, kind, x - i * Math.cos(angle) * 9, y + 58 - i * Math.sin(angle) * 9, angle);
      this.markFired(`${label} trail`);
    }, 68);
    this.addButton(x + 39, y + 56, '反射', () => {
      projectileBounceFeedback(this, kind, x + 6, y + 58);
      this.markFired(`${label} bounce`);
    }, 68);
  }

  private addAreaSample(x: number, y: number, label: string, kind: 'ink' | 'lamp' | 'dawn'): void {
    this.addButton(x, y, label, () => {
      areaTickFeedback(this, kind, x, y - 42, 40);
      this.markFired(label);
    }, 94);
  }

  private addButton(x: number, y: number, label: string, action: () => void, width = 120): void {
    const button = this.add.rectangle(x, y, width, 42, 0xead9a6, 1).setInteractive({ useHandCursor: true });
    button.setStrokeStyle(2, 0x6b5634, 1);
    button.on('pointerdown', action);
    this.add.text(x, y, label, {
      fontFamily: FONT,
      fontSize: '11px',
      color: '#352c20',
      fontStyle: 'bold',
    }).setOrigin(0.5);
  }

  private markFired(label: string): void {
    this.fireCount += 1;
    this.lastFxText?.setText(`last FX: ${label} #${this.fireCount}`);
  }
}
