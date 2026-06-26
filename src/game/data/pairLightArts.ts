import { WORLD_TERMS } from './worldTerms';

export type PairLightArt = {
  id: string;
  label: string;
  characterIds: [string, string];
  name: string;
  description: string;
};

export const core5PairLightArts: PairLightArt[] = [
  { id: 'yui_asa', label: WORLD_TERMS.evolution.fusion, characterIds: ['yui', 'asa'], name: '名を呼ぶ灯', description: '名前を結び、忘れたものを呼び戻す' },
  { id: 'yui_nagi', label: WORLD_TERMS.evolution.fusion, characterIds: ['yui', 'nagi'], name: 'しまえない灯', description: '忘れてはいけない記憶を箱の外に残す' },
  { id: 'yui_michiru', label: WORLD_TERMS.evolution.fusion, characterIds: ['yui', 'michiru'], name: '帰り道を呼ぶ灯', description: '記憶片を帰り道へ集める' },
  { id: 'yui_tomori', label: WORLD_TERMS.evolution.fusion, characterIds: ['yui', 'tomori'], name: '消えかけを継ぐ灯', description: '壊れた記憶の火を灯し直す' },
  { id: 'asa_nagi', label: WORLD_TERMS.evolution.fusion, characterIds: ['asa', 'nagi'], name: '鍵つきの名札', description: '危ない名前をしまい、必要なときだけ開く' },
  { id: 'asa_michiru', label: WORLD_TERMS.evolution.fusion, characterIds: ['asa', 'michiru'], name: '暁の道しるべ', description: '名前と帰り道を結ぶ' },
  { id: 'asa_tomori', label: WORLD_TERMS.evolution.fusion, characterIds: ['asa', 'tomori'], name: '綴じ直す名', description: '破れた名前を直して結ぶ' },
  { id: 'nagi_michiru', label: WORLD_TERMS.evolution.fusion, characterIds: ['nagi', 'michiru'], name: '月箱の星図', description: 'しまった記憶へ道を引く' },
  { id: 'nagi_tomori', label: WORLD_TERMS.evolution.fusion, characterIds: ['nagi', 'tomori'], name: '直した箱庭', description: '壊れた箱を守り直す' },
  { id: 'michiru_tomori', label: WORLD_TERMS.evolution.fusion, characterIds: ['michiru', 'tomori'], name: '継ぎ星の道', description: '壊れた道を直して導く' },
];

export const pairLightArtById = new Map(core5PairLightArts.map((pair) => [pair.id, pair]));
