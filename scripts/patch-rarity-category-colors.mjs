import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';

const overlayPath = 'src/game/ui/overlays.ts';
const hudPath = 'src/game/ui/hud.ts';
const workflowPath = '.github/workflows/patch-rarity-category-colors.yml';
const scriptPath = 'scripts/patch-rarity-category-colors.mjs';

function replaceOnce(source, before, after, label) {
  if (!source.includes(before)) {
    throw new Error(`pattern not found: ${label}`);
  }
  return source.replace(before, after);
}

let overlays = readFileSync(overlayPath, 'utf8');

if (!overlays.includes('const RARE_CATEGORY_EDGE')) {
  overlays = replaceOnce(
    overlays,
    "const LIST_ICON_SIZE = 45;\n",
    "const LIST_ICON_SIZE = 45;\nconst RARE_CATEGORY_EDGE = 0xb27acb;\nconst RARE_CATEGORY_FILL = 0x30233f;\n",
    'rarity constants',
  );

  overlays = replaceOnce(
    overlays,
    "c.add(this.inventoryChip(320, 113, 106, 'レア', `${state.inventory.rareItems.length}/${state.inventory.rareItemSlots}`, 0xd2ae62));",
    "c.add(this.inventoryChip(320, 113, 106, 'レア', `${state.inventory.rareItems.length}/${state.inventory.rareItemSlots}`, RARE_CATEGORY_EDGE));",
    'rare inventory chip',
  );

  overlays = replaceOnce(
    overlays,
    "    const incoming = this.scene.add.container(GAME_WIDTH / 2, 124);\n    incoming.add(this.panel(0, 0, REPLACE_ROW_WIDTH, 68, 0x2b243d, 0xd2ae62, 0xffd45e, 6, 2));",
    "    const incoming = this.scene.add.container(GAME_WIDTH / 2, 124);\n    const incomingCategory = category ?? 'passive';\n    const incomingEdge = iconAccentColor(incomingCategory);\n    incoming.add(this.panel(\n      0,\n      0,\n      REPLACE_ROW_WIDTH,\n      68,\n      iconPanelColor(incomingCategory),\n      incomingEdge,\n      incomingEdge,\n      6,\n      2,\n    ));",
    'incoming category panel',
  );

  overlays = replaceOnce(
    overlays,
    "        0xd2ae62,\n      );",
    "        incomingEdge,\n      );",
    'incoming icon edge',
  );

  overlays = replaceOnce(
    overlays,
    "        color: '#ffe9a8',",
    "        color: categoryLightTextColor(incomingCategory),",
    'incoming title color',
  );

  overlays = replaceOnce(
    overlays,
    "    const rarity = choice.rarity ?? 'normal';\n    const edge = rarityColor(rarity);",
    "    const rarity = choice.rarity ?? 'normal';\n    const edge = rarityColor(rarity);\n    const category = categoryForChoice(choice);\n    const categoryColor = category ? categoryTextColor(category) : '#715f46';",
    'level card category',
  );

  overlays = replaceOnce(
    overlays,
    "    card.add(this.scene.add.text(textX, -31, `${rankFor(rarity)} / ${tagFor(choice)}`, {",
    "    card.add(this.scene.add.text(textX, -31, tagFor(choice), {",
    'remove rarity words',
  );

  overlays = replaceOnce(
    overlays,
    "      color: rarity === 'normal' ? '#715f46' : '#855920',",
    "      color: categoryColor,",
    'category label color',
  );

  overlays = replaceOnce(
    overlays,
    "    }).setOrigin(0, 0));\n    card.add(this.scene.add.text(textX, -5, wrapUiText(choice.description, 19, 2), {",
    "    }).setOrigin(0, 0));\n    this.addRarityPips(card, width / 2 - 22, -height / 2 + 17, rarity);\n    card.add(this.scene.add.text(textX, -5, wrapUiText(choice.description, 19, 2), {",
    'rarity pips call',
  );

  overlays = replaceOnce(
    overlays,
    "  showCapsule(_state: RuntimeState, reward: CapsuleReward, onClose: () => void): void {",
    "  private addRarityPips(\n    container: Phaser.GameObjects.Container,\n    x: number,\n    y: number,\n    rarity: RewardRarity,\n  ): void {\n    const count = rarity === 'rare' ? 3 : rarity === 'good' ? 2 : 1;\n    const color = rarityColor(rarity);\n    const graphics = this.scene.add.graphics();\n    for (let index = 0; index < count; index += 1) {\n      const centerX = x - (count - 1) * 7 + index * 14;\n      graphics.fillStyle(color, 1);\n      graphics.fillRect(centerX - 2, y - 4, 4, 2);\n      graphics.fillRect(centerX - 4, y - 2, 8, 4);\n      graphics.fillRect(centerX - 2, y + 2, 4, 2);\n    }\n    container.add(graphics);\n  }\n\n  showCapsule(_state: RuntimeState, reward: CapsuleReward, onClose: () => void): void {",
    'rarity pips method',
  );

  overlays = replaceOnce(
    overlays,
    "    case 'rare': return 0x3a2f20;",
    "    case 'rare': return RARE_CATEGORY_FILL;",
    'rare icon panel fill',
  );

  overlays = replaceOnce(
    overlays,
    "    case 'rare': return 0xd2ae62;",
    "    case 'rare': return RARE_CATEGORY_EDGE;",
    'rare icon accent',
  );

  overlays = replaceOnce(
    overlays,
    "function cardFillFor(rarity: RewardRarity): number {",
    "function categoryTextColor(category: InventoryIconCategory): string {\n  switch (category) {\n    case 'weapon': return '#476a82';\n    case 'passive': return '#745883';\n    case 'rare': return '#7d4b8f';\n  }\n}\n\nfunction categoryLightTextColor(category: InventoryIconCategory): string {\n  switch (category) {\n    case 'weapon': return '#b9d3e6';\n    case 'passive': return '#d7c7e8';\n    case 'rare': return '#e6c7f0';\n  }\n}\n\nfunction cardFillFor(rarity: RewardRarity): number {",
    'category color helpers',
  );

  overlays = replaceOnce(
    overlays,
    "function rankFor(rarity: RewardRarity): string {\n  switch (rarity) {\n    case 'rare': return '大当たり';\n    case 'good': return '良い';\n    case 'normal': return 'ふつう';\n  }\n}\n\n",
    '',
    'remove rank labels',
  );

  writeFileSync(overlayPath, overlays);
}

let hud = readFileSync(hudPath, 'utf8');
if (!hud.includes("color: '#e6c7f0'")) {
  hud = replaceOnce(
    hud,
    "        color: '#ffe9a8',",
    "        color: '#e6c7f0',",
    'hud rare label color',
  );
  hud = replaceOnce(
    hud,
    "      fill: 0x3a2f20,\n      edge: 0xb18d43,",
    "      fill: 0x30233f,\n      edge: 0x8c62a6,",
    'hud rare category panel',
  );
  hud = replaceOnce(
    hud,
    "        edge: COLORS.cardEdge,\n        accent: 0xd2ae62,",
    "        edge: 0x8c62a6,\n        accent: 0xb27acb,",
    'hud rare slots',
  );
  writeFileSync(hudPath, hud);
}

unlinkSync(scriptPath);
unlinkSync(workflowPath);
console.log('rarity/category UI patch applied');
