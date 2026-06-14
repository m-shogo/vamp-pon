import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from '../domain/constants';
import { VIEW_DEPTH } from './factory';
import { hasAsset } from '../assets/assetHelpers';

/**
 * 夜の街の床。参考: assets/concept-design/01_world/world_night-town_01.png
 * 藍紫のヴィネット + 紙グレイン + 縁の紙片/街灯/インク染み。
 * グリッド線は使わない。プレイ領域（中央）は明るめに保ち、敵/欠片/弾が見えること優先。
 */
export function createBackground(scene: Phaser.Scene): Phaser.GameObjects.Container {
  const c = scene.add.container(0, 0);
  c.setDepth(VIEW_DEPTH.background);

  // 画像タイルがあれば敷き詰める。無ければ Graphics fallback（以下）。
  if (hasAsset(scene, 'bg_stage1_paper_night')) {
    c.add(scene.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'bg_stage1_paper_night').setOrigin(0, 0));
    // 生成タイルの紙片/地図線が拾得物と競合しないよう、実画像時も必ず可読性レイヤーを重ねる。
    c.add(scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x20263d, 0.22));
    c.add(scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH - 56, GAME_HEIGHT - 176, 0x2f3854, 0.12));
    for (const spot of [
      { x: 26, y: 96 }, { x: GAME_WIDTH - 28, y: 250 }, { x: 38, y: GAME_HEIGHT - 200 }, { x: GAME_WIDTH - 34, y: GAME_HEIGHT - 120 },
    ]) {
      c.add(scene.add.circle(spot.x, spot.y, 46, COLORS.lantern, 0.025));
    }
    return c;
  }

  // ベース（中央やや明るい藍紫）
  c.add(scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.background));

  const g = scene.add.graphics();

  // 紙グレイン（細かい点を散らす。明暗まばら）
  for (let i = 0; i < 260; i += 1) {
    const x = Math.random() * GAME_WIDTH;
    const y = Math.random() * GAME_HEIGHT;
    const light = Math.random() < 0.5;
    g.fillStyle(light ? COLORS.backgroundTile : COLORS.backgroundEdge, 0.35);
    g.fillRect(x, y, 2, 2);
  }

  // 縁を暗くするヴィネット（中央は触らない。枠を内側へ重ねる）
  for (let i = 0; i < 5; i += 1) {
    g.lineStyle(26, COLORS.backgroundEdge, 0.1);
    g.strokeRect(-13 + i * 12, -13 + i * 12, GAME_WIDTH + 26 - i * 24, GAME_HEIGHT + 26 - i * 24);
  }
  c.add(g);

  // 散らばった淡い紙片（縁ほど多い）
  const scraps = scene.add.graphics();
  for (let i = 0; i < 30; i += 1) {
    const edge = Math.random() < 0.7;
    const x = edge ? (Math.random() < 0.5 ? Math.random() * 70 : GAME_WIDTH - Math.random() * 70) : Math.random() * GAME_WIDTH;
    const y = Math.random() * GAME_HEIGHT;
    const w = 5 + Math.random() * 7;
    scraps.fillStyle(COLORS.paperScrap, 0.16 + Math.random() * 0.1);
    scraps.fillRect(x, y, w, w * 0.7);
  }
  // まばらな黒インク染み
  for (let i = 0; i < 7; i += 1) {
    const x = Math.random() * GAME_WIDTH;
    const y = Math.random() * GAME_HEIGHT;
    const r = 6 + Math.random() * 10;
    scraps.fillStyle(COLORS.backgroundEdge, 0.5);
    scraps.fillEllipse(x, y, r * 2, r * 1.4);
  }
  c.add(scraps);

  // 隅の街灯の淡い暖光
  const lampSpots = [
    { x: 26, y: 96 },
    { x: GAME_WIDTH - 28, y: 250 },
    { x: 38, y: GAME_HEIGHT - 200 },
    { x: GAME_WIDTH - 34, y: GAME_HEIGHT - 120 },
  ];
  for (const spot of lampSpots) {
    c.add(scene.add.circle(spot.x, spot.y, 46, COLORS.lantern, 0.05));
    c.add(scene.add.circle(spot.x, spot.y, 22, COLORS.lantern, 0.06));
  }

  return c;
}
