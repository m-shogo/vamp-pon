import type Phaser from 'phaser';
import { PLAYER_DEFAULTS } from '../domain/constants';
import type { RuntimeState } from '../runtime';
import { YUI_FRAME_IDS, type PlayerFacing } from '../assets/playerFrames';

const PLAYER_SPRITE_DATA_KEY = 'playerSprite';
const PLAYER_VISUAL_MODE_DATA_KEY = 'playerVisualMode';
const PLAYER_FACING_DATA_KEY = 'playerFacing';
const CORE5_VISUAL_MODE = 'core5-yui';
const WALK_FPS = 7;

export type YuiFrameState = {
  facing: PlayerFacing;
  moving: boolean;
  walkFrame: 0 | 1;
  hurt: boolean;
  ultimate: boolean;
};

export function resolveFacing(
  current: PlayerFacing,
  inputX: number,
  inputY: number,
): PlayerFacing {
  if (Math.hypot(inputX, inputY) < 0.12) return current;
  if (Math.abs(inputX) > Math.abs(inputY)) return inputX < 0 ? 'left' : 'right';
  return inputY < 0 ? 'back' : 'front';
}

export function resolveYuiFrame(state: YuiFrameState): string {
  if (state.ultimate) return YUI_FRAME_IDS.ultimate;
  if (state.hurt) return YUI_FRAME_IDS.hurt[state.facing];
  if (state.moving) return YUI_FRAME_IDS.walk[state.facing][state.walkFrame];
  return YUI_FRAME_IDS.idle[state.facing];
}

/**
 * 180pxキャンバス内の足元が約94%位置にあるため、コンテナ原点を足元へ合わせる。
 * 180→60pxは正確な1/3縮小で、PLAYER_DEFAULTS.visualSize=42相当の本体高を確保する。
 */
export function attachCore5PlayerSprite(
  container: Phaser.GameObjects.Container,
  sprite: Phaser.GameObjects.Image,
): void {
  sprite.setOrigin(0.5, 0.94);
  sprite.setDisplaySize(60, 60);
  container.setData(PLAYER_SPRITE_DATA_KEY, sprite);
  container.setData(PLAYER_VISUAL_MODE_DATA_KEY, CORE5_VISUAL_MODE);
  container.setData(PLAYER_FACING_DATA_KEY, 'front' satisfies PlayerFacing);
}

/** createPlayerViewの子要素から画像を見つけ、Core5用の足元原点へ切り替える。 */
export function attachCore5PlayerView(container: Phaser.GameObjects.Container): boolean {
  const sprite = container.list.find((child) => {
    const candidate = child as Partial<Phaser.GameObjects.Image>;
    return candidate.texture != null && typeof candidate.setTexture === 'function';
  }) as Phaser.GameObjects.Image | undefined;

  if (!sprite) return false;
  attachCore5PlayerSprite(container, sprite);
  return true;
}

export function isCore5PlayerView(container: Phaser.GameObjects.Container): boolean {
  return container.getData(PLAYER_VISUAL_MODE_DATA_KEY) === CORE5_VISUAL_MODE;
}

/** 入力・被弾・必殺状態に応じて、ユイの表示フレームだけを更新する。 */
export function updatePlayerVisual(state: RuntimeState): void {
  const container = state.playerView;
  if (!isCore5PlayerView(container)) return;

  const sprite = container.getData(PLAYER_SPRITE_DATA_KEY) as Phaser.GameObjects.Image | undefined;
  if (!sprite) return;

  const currentFacing = (container.getData(PLAYER_FACING_DATA_KEY) as PlayerFacing | undefined) ?? 'front';
  const facing = resolveFacing(currentFacing, state.inputVec.x, state.inputVec.y);
  container.setData(PLAYER_FACING_DATA_KEY, facing);

  const moving = Math.hypot(state.inputVec.x, state.inputVec.y) >= 0.12;
  const hurtWindowStart = Math.max(0, PLAYER_DEFAULTS.invulnSec - 0.22);
  const nextTexture = resolveYuiFrame({
    facing,
    moving,
    walkFrame: (Math.floor(state.elapsedSec * WALK_FPS) % 2) as 0 | 1,
    hurt: state.player.flashRemaining > hurtWindowStart,
    ultimate: state.ultimate.activeRemaining > 0,
  });

  const textures = sprite.scene.textures;
  const fallback = YUI_FRAME_IDS.idle.front;
  const resolvedTexture = textures.exists(nextTexture)
    ? nextTexture
    : textures.exists(fallback)
      ? fallback
      : 'yui_idle';

  if (sprite.texture.key !== resolvedTexture) sprite.setTexture(resolvedTexture);
}
