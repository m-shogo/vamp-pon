export type CollectionSectionId =
  | 'dawn_atlas'
  | 'bestiary'
  | 'lost_item_cards'
  | 'keeper_records'
  | 'word_records'
  | 'achievements';

export type CollectionSection = {
  id: CollectionSectionId;
  label: string;
  shortLabel: string;
  description: string;
  motif: 'star-map' | 'shadow-card' | 'lost-item' | 'keeper' | 'words';
  accent: number;
  lockedHint?: string;
};

export const collectionSections: CollectionSection[] = [
  {
    id: 'dawn_atlas',
    label: '夜明け星図',
    shortLabel: '星図',
    description: '夜でほどいた記録が、絵札として灯っていく地図。',
    motif: 'star-map',
    accent: 0xf4d69a,
  },
  {
    id: 'bestiary',
    label: 'カゲモノ図鑑',
    shortLabel: '影',
    description: '出会ったカゲモノと、ほどいた数を記す頁。',
    motif: 'shadow-card',
    accent: 0x9c74c5,
  },
  {
    id: 'lost_item_cards',
    label: '忘れ物絵札',
    shortLabel: '絵札',
    description: '拾った忘れ物の由来と、持ち主の気配を残す札。',
    motif: 'lost-item',
    accent: 0xd7a65b,
    lockedHint: '忘れ物を拾うと、札の輪郭が浮かびます。',
  },
  {
    id: 'keeper_records',
    label: '灯し手の記録',
    shortLabel: '灯',
    description: 'ユイたちの光る持ち物、黒耀化、暁開き、関係性を記す頁。',
    motif: 'keeper',
    accent: 0x79bea9,
    lockedHint: '灯し手の記録は、暁開きや会話で少しずつ開きます。',
  },
  {
    id: 'word_records',
    label: '言葉の記録',
    shortLabel: '言葉',
    description: '夜路で出会った名言、語句、キャラ返信を見返す頁。',
    motif: 'words',
    accent: 0xe0b0a6,
    lockedHint: '夜路で言葉を見ると、ここに写されます。',
  },
  {
    id: 'achievements',
    label: 'しるしの記録',
    shortLabel: '実績',
    description: '夜を歩いた証。達成すると黒曜片が戻る。',
    motif: 'star-map',
    accent: 0xf5d58a,
  },
];

export function getCollectionSection(id: CollectionSectionId): CollectionSection {
  const section = collectionSections.find((candidate) => candidate.id === id);
  if (!section) throw new Error(`Unknown collection section: ${id}`);
  return section;
}
