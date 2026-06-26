import { WORLD_TERMS } from './worldTerms';

export type KokuyouForm = {
  characterId: string;
  label: string;
  subtitle: string;
  shortCopy: string;
  distortedTrait: string;
};

export const kokuyouForms: KokuyouForm[] = [
  { characterId: 'yui', label: WORLD_TERMS.kokuyou.transformation, subtitle: '呼びすぎた名前', shortCopy: '名前を呼ぶほど、夜が濃くなる', distortedTrait: '呼び戻す力が、無理やり名前を引き寄せる力へ歪む' },
  { characterId: 'asa', label: WORLD_TERMS.kokuyou.transformation, subtitle: '黒い名札', shortCopy: '名札が、影に貼りつく', distortedTrait: '名づける力が、間違った名前を貼る力へ歪む' },
  { characterId: 'nagi', label: WORLD_TERMS.kokuyou.transformation, subtitle: '開いた月箱', shortCopy: '箱の中で、夜が増える', distortedTrait: 'しまう力が、何でも閉じ込める力へ歪む' },
  { characterId: 'michiru', label: WORLD_TERMS.kokuyou.transformation, subtitle: '迷い星図', shortCopy: '帰り道が、黒く絡まる', distortedTrait: '導く力が、間違った道へ誘う力へ歪む' },
  { characterId: 'tomori', label: WORLD_TERMS.kokuyou.transformation, subtitle: 'ほころぶ継火', shortCopy: '直した跡から、夜が漏れる', distortedTrait: '直す力が、壊れたまま繋ぐ力へ歪む' },
  { characterId: 'sen', label: WORLD_TERMS.kokuyou.transformation, subtitle: '消えた一文', shortCopy: '教えた線が、黒く消える', distortedTrait: '教える力が、消された道筋へ歪む' },
  { characterId: 'ritsu', label: WORLD_TERMS.kokuyou.transformation, subtitle: '焦げた半分', shortCopy: '分けた片方だけが、黒く残る', distortedTrait: '分ける力が、片方だけを残す力へ歪む' },
  { characterId: 'koyori', label: WORLD_TERMS.kokuyou.transformation, subtitle: 'ほどけた呼び名', shortCopy: '小さな名前の端がほどける', distortedTrait: '呼び名を守る力が、名前の端をほどく力へ歪む' },
  { characterId: 'gen', label: WORLD_TERMS.kokuyou.transformation, subtitle: '錆びた帰針', shortCopy: '古い針が、帰り道を沈める', distortedTrait: '古い道を示す力が、錆びた道へ戻す力へ歪む' },
  { characterId: 'hana', label: WORLD_TERMS.kokuyou.transformation, subtitle: '黒い花脈', shortCopy: '残した花に、夜が染みる', distortedTrait: '保存する力が、傷ごと残す力へ歪む' },
  { characterId: 'yubi', label: WORLD_TERMS.kokuyou.transformation, subtitle: 'つぶれた消印', shortCopy: '届くはずの返事が、黒く潰れる', distortedTrait: '届ける力が、遅れたまま封じる力へ歪む' },
  { characterId: 'madoka', label: WORLD_TERMS.kokuyou.transformation, subtitle: '黒い窓', shortCopy: '見ていた窓だけが、夜になる', distortedTrait: '見る力が、見なかったことにする力へ歪む' },
  { characterId: 'shiro', label: WORLD_TERMS.kokuyou.transformation, subtitle: '抜け落ちた頁', shortCopy: '読めない頁の中央が抜ける', distortedTrait: '整理する力が、読めないまま分類する力へ歪む' },
  { characterId: 'tobari', label: WORLD_TERMS.kokuyou.transformation, subtitle: '閉じた改札', shortCopy: '通るはずの境目が閉じる', distortedTrait: '通す力が、境目を閉じる力へ歪む' },
  { characterId: 'nemu', label: WORLD_TERMS.kokuyou.transformation, subtitle: '黒い夢波', shortCopy: '夢の道が、黒い水面になる', distortedTrait: '夢で写す力が、現実を曖昧にする力へ歪む' },
  { characterId: 'kuroori', label: WORLD_TERMS.kokuyou.transformation, subtitle: '開かない折り目', shortCopy: '折り目の奥から、黒耀が漏れる', distortedTrait: '折って隠す力が、開けない記憶へ歪む' },
  { characterId: 'kage1', label: WORLD_TERMS.kokuyou.transformation, subtitle: '守りすぎた影', shortCopy: '守る影が、黒い刃になる', distortedTrait: '隠して守る力が、近づくものを拒む力へ歪む' },
  { characterId: 'kage2', label: WORLD_TERMS.kokuyou.transformation, subtitle: '消せない一文字', shortCopy: '消したはずの一文字だけ残る', distortedTrait: '消す力が、消せない痕を残す力へ歪む' },
  { characterId: 'kage3', label: WORLD_TERMS.kokuyou.transformation, subtitle: '割れた角度', shortCopy: '測った夜が、斜めに割れる', distortedTrait: '測る力が、測れない夜を切り出す力へ歪む' },
  { characterId: 'kage4', label: WORLD_TERMS.kokuyou.transformation, subtitle: '黒い余白', shortCopy: '書くべき場所だけが、黒く残る', distortedTrait: '余白を残す力が、何も書けない余白へ歪む' },
];

export const kokuyouFormByCharacterId = new Map(kokuyouForms.map((form) => [form.characterId, form]));
