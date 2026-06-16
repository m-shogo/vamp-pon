import Phaser from 'phaser';
import { core5PrototypeCharacterById, type Core5PrototypeCharacterId } from '../assets/core5PrototypeCharacters';
import { createBackground } from '../ui/background';
import { Core5SpriteSheetPreview } from '../ui/Core5SpriteSheetPreview';

const CORE5_DEBUG_KEY = 'core5sprites';
const CORE5_IDS: Core5PrototypeCharacterId[] = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];

export function isCore5SpriteSheetPreviewUrl(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.get('debug') === CORE5_DEBUG_KEY || params.get('scene') === CORE5_DEBUG_KEY;
}

function protoCharacterFromUrl(): Core5PrototypeCharacterId {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('protoCharacter') as Core5PrototypeCharacterId | null;
  if (raw && core5PrototypeCharacterById.has(raw)) return raw;
  return 'yui';
}

/**
 * Core5 52px sprite sheet 専用の debug preview。
 * 本編の player sprite は差し替えず、prototype sheet の切り出し・グリッド・セルキー確認だけを行う。
 */
export class Core5SpriteSheetPreviewScene extends Phaser.Scene {
  private preview?: Core5SpriteSheetPreview;

  constructor() {
    super('Core5SpriteSheetPreviewScene');
  }

  create(): void {
    createBackground(this);
    this.preview = new Core5SpriteSheetPreview(this, protoCharacterFromUrl());
    this.preview.render();

    const kb = this.input.keyboard;
    kb?.on('keydown-ONE', () => this.jumpTo('yui'));
    kb?.on('keydown-TWO', () => this.jumpTo('asa'));
    kb?.on('keydown-THREE', () => this.jumpTo('nagi'));
    kb?.on('keydown-FOUR', () => this.jumpTo('michiru'));
    kb?.on('keydown-FIVE', () => this.jumpTo('tomori'));
  }

  private jumpTo(id: Core5PrototypeCharacterId): void {
    const url = new URL(window.location.href);
    url.searchParams.set('debug', CORE5_DEBUG_KEY);
    url.searchParams.set('protoCharacter', id);
    window.history.replaceState(null, '', url);
    this.preview?.destroy();
    this.preview = new Core5SpriteSheetPreview(this, id);
    this.preview.render();
  }
}

export { CORE5_IDS };
