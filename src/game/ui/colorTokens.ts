import type { InventoryIconCategory } from '../assets/inventoryIcons';

type StorybookUiTokens = {
  night: number;
  nightPanel: number;
  gold: number;
  goldLight: number;
  paper: number;
  paperLight: number;
  paperShadow: number;
  paperEdge: number;
  paperDark: number;
  textDark: string;
  textSoft: string;
  textLight: string;
  textMuted: string;
  hp: number;
  hpBack: number;
  xp: number;
  weapon: number;
  passive: number;
  rare: number;
  special: number;
  deepNight: number;
  inkViolet: number;
  paperBeige: number;
  warmAmber: number;
  lanternCore: number;
  mutedTeal: number;
  dustyRose: number;
  dawnPeach: number;
  inkBlack: number;
};

export const STORYBOOK_UI: StorybookUiTokens = {
  night: 0x0b1022,
  nightPanel: 0x10162d,
  gold: 0xd2a45c,
  goldLight: 0xf4d69a,
  paper: 0xe8d8b8,
  paperLight: 0xf4ead4,
  paperShadow: 0xc3aa85,
  paperEdge: 0x6c5747,
  paperDark: 0x6e5a3b,
  textDark: '#2e2730',
  textSoft: '#6c5d52',
  textLight: '#f4e8cf',
  textMuted: '#cabda8',
  hp: 0xe56f7c,
  hpBack: 0x5b3442,
  xp: 0x9c74c5,
  weapon: 0xd7a65b,
  passive: 0xa98bd2,
  rare: 0x79bea9,
  special: 0xd9879b,
  deepNight: 0x0f1320,
  inkViolet: 0x151020,
  paperBeige: 0xd8c49a,
  warmAmber: 0xf4c46a,
  lanternCore: 0xffe7ae,
  mutedTeal: 0x6fae9b,
  dustyRose: 0xb96a76,
  dawnPeach: 0xdfa07a,
  inkBlack: 0x07060b,
};

export function storybookCategoryPalette(category: InventoryIconCategory | 'heal') {
  switch (category) {
    case 'weapon': return { accent: STORYBOOK_UI.weapon, paper: 0xead9b8, label: '武器' };
    case 'passive': return { accent: STORYBOOK_UI.passive, paper: 0xe5d9bd, label: '忘れ物' };
    case 'rare': return { accent: STORYBOOK_UI.rare, paper: 0xe4dbc0, label: 'レア' };
    case 'heal': return { accent: STORYBOOK_UI.special, paper: 0xebd9c0, label: '回復' };
  }
}
