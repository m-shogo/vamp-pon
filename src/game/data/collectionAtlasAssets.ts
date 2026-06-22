import type { CollectionSectionId } from './collectionSections';
import type { KeeperRecord } from './keeperRecords';
import type { LostItemRecord } from './lostItemRecords';

export type CollectionAtlasImageAsset = {
  key: string;
  path: string;
  description: string;
};

export type CollectionAtlasSectionAsset = {
  sectionId: CollectionSectionId;
  backdrop: CollectionAtlasImageAsset;
};

export type CollectionAtlasCardAsset = {
  id: string;
  image: CollectionAtlasImageAsset;
};

const BASE_PATH = 'assets/prototypes/collection-atlas';

export const collectionAtlasSectionAssets: CollectionAtlasSectionAsset[] = [
  {
    sectionId: 'dawn_atlas',
    backdrop: {
      key: 'collection-atlas-backdrop-dawn-atlas',
      path: `${BASE_PATH}/tabs/dawn-atlas-backdrop.png`,
      description: '夜明け星図の星座背景',
    },
  },
  {
    sectionId: 'bestiary',
    backdrop: {
      key: 'collection-atlas-backdrop-bestiary',
      path: `${BASE_PATH}/tabs/bestiary-backdrop.png`,
      description: 'カゲモノ図鑑の影標本背景',
    },
  },
  {
    sectionId: 'lost_item_cards',
    backdrop: {
      key: 'collection-atlas-backdrop-lost-items',
      path: `${BASE_PATH}/tabs/lost-items-backdrop.png`,
      description: '忘れ物絵札の小物カード背景',
    },
  },
  {
    sectionId: 'keeper_records',
    backdrop: {
      key: 'collection-atlas-backdrop-keeper-records',
      path: `${BASE_PATH}/tabs/keeper-records-backdrop.png`,
      description: '灯し手の記録の光紋背景',
    },
  },
  {
    sectionId: 'word_records',
    backdrop: {
      key: 'collection-atlas-backdrop-word-records',
      path: `${BASE_PATH}/tabs/word-records-backdrop.png`,
      description: '言葉の記録の紙片背景',
    },
  },
];

export const lostItemCardAssets: CollectionAtlasCardAsset[] = [
  card('lost-small-bag-tag', 'lost-small-bag-tag.png', '名前の消えた荷札'),
  card('lost-folded-map-corner', 'lost-folded-map-corner.png', '折れた地図の角'),
  card('lost-cold-lantern-glass', 'lost-cold-lantern-glass.png', '冷めたランタン硝子'),
  card('lost-red-thread-knot', 'lost-red-thread-knot.png', 'ほどけない赤い糸'),
  card('lost-dull-light-coin', 'lost-dull-light-coin.png', 'くすんだ灯貨'),
  card('lost-rusted-room-key', 'lost-rusted-room-key.png', '錆びた部屋の鍵'),
];

export const keeperEmblemAssets: CollectionAtlasCardAsset[] = [
  emblem('keeper-yui', 'keeper-yui-emblem.png', 'ユイのランタン紋章'),
  emblem('keeper-asa', 'keeper-asa-emblem.png', 'アサの朝焼け紋章'),
  emblem('keeper-nagi', 'keeper-nagi-emblem.png', 'ナギの星図紋章'),
  emblem('keeper-michiru', 'keeper-michiru-emblem.png', 'ミチルの水面紋章'),
  emblem('keeper-tomori', 'keeper-tomori-emblem.png', 'トモリの縫い目紋章'),
];

export function getCollectionSectionBackdrop(sectionId: CollectionSectionId): CollectionAtlasImageAsset | undefined {
  return collectionAtlasSectionAssets.find((asset) => asset.sectionId === sectionId)?.backdrop;
}

export function getLostItemCardAsset(id: LostItemRecord['id']): CollectionAtlasImageAsset | undefined {
  return lostItemCardAssets.find((asset) => asset.id === id)?.image;
}

export function getKeeperEmblemAsset(id: KeeperRecord['id']): CollectionAtlasImageAsset | undefined {
  return keeperEmblemAssets.find((asset) => asset.id === id)?.image;
}

function card(id: string, fileName: string, description: string): CollectionAtlasCardAsset {
  return {
    id,
    image: {
      key: `collection-atlas-card-${id}`,
      path: `${BASE_PATH}/cards/${fileName}`,
      description,
    },
  };
}

function emblem(id: string, fileName: string, description: string): CollectionAtlasCardAsset {
  return {
    id,
    image: {
      key: `collection-atlas-emblem-${id}`,
      path: `${BASE_PATH}/cards/${fileName}`,
      description,
    },
  };
}
