import type Phaser from 'phaser';
import type { CapsuleReward, LevelUpChoice } from '../domain/types';
import type { RuntimeState } from '../runtime';
import { GAME_HEIGHT, GAME_WIDTH } from '../domain/constants';
import { resolveInventoryIconTexture, type InventoryIconCategory } from '../assets/inventoryIcons';
import { VIEW_DEPTH } from './factory';
import {
  LEVEL_UP_CARD_WIDTH,
  REPLACE_ROW_WIDTH,
  levelUpCardCenters,
  replaceRowCenters,
} from './itemSelectionLayout';

const DETAIL_SIZE = 60;
const LIST_SIZE = 30;
const DEPTH = VIEW_DEPTH.overlay + 12;

type IconRef = { category: InventoryIconCategory; itemId: string };

export class OverlayInventoryIcons {
  private current: Phaser.GameObjects.Container | null = null;

  constructor(private scene: Phaser.Scene) {}

  clear(): void {
    this.current?.destroy(true);
    this.current = null;
  }

  showLevelUp(choices: LevelUpChoice[]): void {
    const layer = this.startLayer();
    const centers = levelUpCardCenters(choices.length);
    choices.forEach((choice, index) => {
      const ref = iconRefForChoice(choice);
      if (!ref) return;
      const x = GAME_WIDTH / 2 - LEVEL_UP_CARD_WIDTH / 2 + 34;
      this.addIcon(layer, ref, x, centers[index] - 34, DETAIL_SIZE, 32);
    });
  }

  showReplace(state: RuntimeState, choice: LevelUpChoice): void {
    const incoming = iconRefForChoice(choice);
    const layer = this.startLayer();
    if (incoming) {
      const x = GAME_WIDTH / 2 + REPLACE_ROW_WIDTH / 2 - 38;
      this.addIcon(layer, incoming, x, 120, DETAIL_SIZE, 31);
    }

    const category = categoryForChoice(choice);
    if (!category) return;
    const items = category === 'weapon'
      ? state.inventory.weapons
      : category === 'passive'
        ? state.inventory.passives
        : state.inventory.rareItems;
    const centers = replaceRowCenters(items.length);
    items.forEach((item, index) => {
      const x = GAME_WIDTH / 2 - REPLACE_ROW_WIDTH / 2 + 32;
      this.addIcon(layer, { category, itemId: item.id }, x, centers[index], LIST_SIZE, 18);
    });
  }

  showCapsule(reward: CapsuleReward): void {
    const ref = iconRefForReward(reward);
    if (!ref) {
      this.clear();
      return;
    }
    const layer = this.startLayer();
    this.addIcon(layer, ref, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 92, DETAIL_SIZE, 34);
  }

  destroy(): void {
    this.clear();
  }

  private startLayer(): Phaser.GameObjects.Container {
    this.clear();
    const layer = this.scene.add.container(0, 0).setDepth(DEPTH);
    this.current = layer;
    return layer;
  }

  private addIcon(
    layer: Phaser.GameObjects.Container,
    ref: IconRef,
    x: number,
    y: number,
    size: number,
    radius: number,
  ): void {
    const texture = resolveInventoryIconTexture(this.scene.textures, ref.category, ref.itemId);
    if (!texture) return;
    const backing = this.scene.add.circle(x, y, radius, 0x211b35, 0.96);
    backing.setStrokeStyle(2, 0x9b8355, 0.9);
    const image = this.scene.add.image(x, y, texture).setDisplaySize(size, size);
    layer.add([backing, image]);
  }
}

function categoryForChoice(choice: LevelUpChoice): InventoryIconCategory | null {
  if (choice.type === 'weapon_new' || choice.type === 'weapon_upgrade') return 'weapon';
  if (choice.type === 'passive_new' || choice.type === 'passive_upgrade') return 'passive';
  if (choice.type === 'rare_new') return 'rare';
  return null;
}

function iconRefForChoice(choice: LevelUpChoice): IconRef | null {
  const category = categoryForChoice(choice);
  return category && 'itemId' in choice ? { category, itemId: choice.itemId } : null;
}

function iconRefForReward(reward: CapsuleReward): IconRef | null {
  if (reward.type === 'evolution') return { category: 'weapon', itemId: reward.evolvedWeaponId };
  if (reward.type === 'weapon_upgrade') return { category: 'weapon', itemId: reward.itemId };
  if (reward.type === 'passive_upgrade') return { category: 'passive', itemId: reward.itemId };
  return null;
}
