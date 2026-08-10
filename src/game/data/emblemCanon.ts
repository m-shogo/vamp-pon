import { characterThemeColorById } from './characterThemeColors.ts';
import { toumonSigils } from './toumonSimpleSigilCanon.ts';

export type EmblemPhase = 'blank' | 'normal' | 'dawn' | 'kokuyou' | 'pair';

/**
 * Compatibility-facing shape used by existing Asset Factory / Character Database code.
 *
 * IMPORTANT:
 * - `crestShape` now describes the SIMPLE ABSTRACT SIGIL stroke formula, not a shield/crest illustration.
 * - `constellationAnimal` is a legacy field name; the value is the Current Star Beast, never the old v1 animal set.
 * - Current visual authority lives in `toumonSimpleSigilCanon.ts`.
 */
export type CharacterEmblemCanon = {
  characterId: string;
  azCode: string;
  emblemName: string;
  crestShape: string;
  coreSymbols: string[];
  constellationAnimal: string;
  normalLight: string;
  dawnChange: string;
  kokuyouScar: string;
  deviceChange: string;
  merchHook: string;
  visualKeywords: string[];
};

export const EMBLEM_SYSTEM_LABELS = {
  device: '灯紋具',
  emblem: '灯紋',
  blank: '無紋',
  dawn: '暁紋',
  kokuyou: '黒紋',
  pair: '双灯紋',
  series: 'A-Z灯紋',
} as const;

export const EMBLEM_PHASE_RULES: Record<EmblemPhase, string> = {
  blank: '未解放。主線の一部だけを薄く見せ、Character固有geometryはまだ完成させない。',
  normal: '通常解放。1色・数本の線・点・intentional gapだけでCharacterの選び方を表す。',
  dawn: '暁灯/暁開き後。羽・星・王冠を足さず、接続/開放/延長など1つの幾何操作だけで変化する。',
  kokuyou: '黒耀化中。全体を禍々しく作り直さず、長所を示す既存線1本だけが過剰になる。',
  pair: '灯合わせ。2人の原型を保ち、shared nodeまたはshared gapを1つだけ共有する。恋愛専用ではない。',
};

const AZ_CODES: Record<string, string> = {
  yui: 'Y-01',
  asa: 'A-02',
  nagi: 'N-03',
  michiru: 'M-04',
  tomori: 'T-05',
  sen: 'S-06',
  ritsu: 'R-07',
  koyori: 'K-08',
  gen: 'G-09',
  hana: 'H-10',
  yubi: 'U-11',
  madoka: 'D-12',
  shiro: 'I-13',
  tobari: 'B-14',
  nemu: 'E-15',
  kuroori: 'O-16',
  kage1: 'V-17',
  kage2: 'C-18',
  kage3: 'J-19',
  kage4: 'Q-20',
};

const CURRENT20_SIGILS = toumonSigils.filter((sigil) => sigil.scope === 'current20');

export const characterEmblems: CharacterEmblemCanon[] = CURRENT20_SIGILS.map((sigil) => {
  const theme = characterThemeColorById.get(sigil.characterId);
  if (!theme) throw new Error(`Missing Character Theme authority for Toumon: ${sigil.characterId}`);

  const azCode = AZ_CODES[sigil.characterId];
  if (!azCode) throw new Error(`Missing legacy A-Z compatibility code for Toumon: ${sigil.characterId}`);

  return {
    characterId: sigil.characterId,
    azCode,
    emblemName: sigil.sigilName,
    crestShape: sigil.strokeFormula,
    coreSymbols: [...sigil.coreVerb],
    // Legacy property name. Value is Current Star Beast authority.
    constellationAnimal: theme.starBeastTheme.starBeast,
    normalLight: '単色のbase geometry。色や発光が無くても形だけで読めること。',
    dawnChange: sigil.dawnChange,
    kokuyouScar: sigil.kokuyouScar,
    deviceChange: '灯紋具中央では同じMaster geometryを使う。外周の豪華装飾やCharacter別device形状で識別を代替しない。',
    merchHook: `${sigil.merchStrength} grade。pin / embroidery / foil / engraving / UIで同一geometryを使う。`,
    visualKeywords: [
      'simple abstract sigil',
      'single color',
      'few strokes',
      'intentional negative space',
      sigil.dominantFamily,
      sigil.signatureAsymmetry,
      'no literal object icon',
      'no literal animal icon',
      'no shield crown wreath wings',
    ],
  };
});

export const characterEmblemById = new Map(characterEmblems.map((emblem) => [emblem.characterId, emblem]));
