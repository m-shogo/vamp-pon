export type GoldenReferenceStatus =
  | 'approved-style-reference'
  | 'candidate-reference'
  | 'missing-required-reference'
  | 'retired';

export type GoldenReferenceAsset = {
  path: string;
  role: 'style' | 'identity' | 'composition' | 'gameplay-size' | 'palette';
  approvedForReference: boolean;
  approvedForRuntime: false;
  approvedAsFinal?: false;
  sha256?: string;
};

export type GoldenReferenceSet = {
  id: string;
  version: number;
  scope: 'global' | 'ui' | 'character' | 'enemy' | 'item' | 'stage';
  sourceId?: string;
  status: GoldenReferenceStatus;
  immutableUntilVersionBump: true;
  assets: GoldenReferenceAsset[];
  documents: string[];
  notes: string;
};

export const GOLDEN_REFERENCE_REGISTRY_SCHEMA_VERSION = 1 as const;

export const goldenReferenceSets: GoldenReferenceSet[] = [
  {
    id: 'global:visual-style-v1',
    version: 1,
    scope: 'global',
    status: 'approved-style-reference',
    immutableUntilVersionBump: true,
    assets: [
      {
        path: 'docs/design-targets/generated/top-final.png',
        role: 'style',
        approvedForReference: true,
        approvedForRuntime: false,
      },
      {
        path: 'docs/design-targets/generated/kokuyou-cutin-final.png',
        role: 'style',
        approvedForReference: true,
        approvedForRuntime: false,
      },
    ],
    documents: [
      'docs/88-adopted-visual-direction.md',
      'docs/181-current-production-canon.md',
      'docs/unity-ui-design-system-v1.md',
    ],
    notes: '全素材が参照する世界観・紙・黒インク・ランタン光の基準。runtime final承認とは別。',
  },
  {
    id: 'ui:stage-select-v1',
    version: 1,
    scope: 'ui',
    sourceId: 'stage-select',
    status: 'candidate-reference',
    immutableUntilVersionBump: true,
    assets: [
      {
        path: 'docs/design-targets/generated/unity-u45/screenshots/01-stage-select-app-quality.png',
        role: 'composition',
        approvedForReference: true,
        approvedForRuntime: false,
      },
    ],
    documents: ['docs/unity-ui-design-system-v1.md'],
    notes: 'U45 Simulator前の構成基準。候補画像のfinal承認ではない。',
  },
  {
    id: 'ui:battle-hud-v1',
    version: 1,
    scope: 'ui',
    sourceId: 'battle-hud',
    status: 'candidate-reference',
    immutableUntilVersionBump: true,
    assets: [
      {
        path: 'docs/design-targets/generated/unity-u45/screenshots/02-battle-hud-app-quality.png',
        role: 'gameplay-size',
        approvedForReference: true,
        approvedForRuntime: false,
      },
    ],
    documents: ['docs/unity-ui-design-system-v1.md'],
    notes: 'HUD占有率と実寸可読性の基準。P2コントラスト課題は継続。',
  },
  {
    id: 'ui:levelup-common-v1',
    version: 1,
    scope: 'ui',
    sourceId: 'levelup-common',
    status: 'candidate-reference',
    immutableUntilVersionBump: true,
    assets: [
      {
        path: 'docs/design-targets/generated/unity-u45/screenshots/03-levelup-common-card.png',
        role: 'composition',
        approvedForReference: true,
        approvedForRuntime: false,
      },
    ],
    documents: ['docs/unity-ui-design-system-v1.md'],
    notes: 'Commonカードの構成基準。文字余白とコントラスト課題は継続。',
  },
  {
    id: 'ui:levelup-rare-v1',
    version: 1,
    scope: 'ui',
    sourceId: 'levelup-rare',
    status: 'candidate-reference',
    immutableUntilVersionBump: true,
    assets: [
      {
        path: 'docs/design-targets/generated/unity-u45/screenshots/04-levelup-rare-card.png',
        role: 'palette',
        approvedForReference: true,
        approvedForRuntime: false,
      },
    ],
    documents: ['docs/unity-ui-design-system-v1.md'],
    notes: 'Rare差分の基準。rare tintと文字分離はU46以降で改善する。',
  },
  {
    id: 'ui:levelup-evolution-v1',
    version: 1,
    scope: 'ui',
    sourceId: 'levelup-evolution',
    status: 'candidate-reference',
    immutableUntilVersionBump: true,
    assets: [
      {
        path: 'docs/design-targets/generated/unity-u45/screenshots/05-levelup-evolution-card.png',
        role: 'palette',
        approvedForReference: true,
        approvedForRuntime: false,
      },
    ],
    documents: ['docs/unity-ui-design-system-v1.md'],
    notes: '進化差分の基準。紫面と本文コントラストはU46以降で改善する。',
  },
  {
    id: 'character:yui:identity-v1',
    version: 1,
    scope: 'character',
    sourceId: 'yui',
    status: 'approved-style-reference',
    immutableUntilVersionBump: true,
    assets: [
      {
        path: 'assets/reference/character-master/core5/yui-character-master-v1.png',
        role: 'identity',
        approvedForReference: true,
        approvedForRuntime: false,
        approvedAsFinal: false,
        sha256: '7e60d964246fc31f91ceb1df5bab8bd6c5fbdd381eadaa9e8a5f218c3338c7fe',
      },
      {
        path: 'public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png',
        role: 'gameplay-size',
        approvedForReference: true,
        approvedForRuntime: false,
        approvedAsFinal: false,
        sha256: 'a165e6cec801f342d6728b53abacedb4491c8cb4ecbe1abc7e25110d709f805e',
      },
    ],
    documents: ['docs/153-character-visual-reference-policy.md', 'docs/154-sprite-image-production-playbook.md'],
    notes: 'Identity anchors: brown bob hair, navy hood and cape, warm lantern. Body-relative continuity: lantern in right hand, strap from right shoulder to bag at left waist. Reference approval only; final/runtime approval remains false.',
  },
  {
    id: 'enemy:onbu:identity-v1',
    version: 1,
    scope: 'enemy',
    sourceId: 'onbu',
    status: 'approved-style-reference',
    immutableUntilVersionBump: true,
    assets: [
      {
        path: 'public/assets/prototypes/sprite-sheets/enemies-original/enemy-ombu-small-sheet-v2-1440x1080.png',
        role: 'identity',
        approvedForReference: true,
        approvedForRuntime: false,
        approvedAsFinal: false,
        sha256: '7d356a131623adf2a95b6c493cfbcee1eee0af00fed44722d287ebc3d6c92c15',
      },
    ],
    documents: ['docs/enemies/enemy-48-sprite-sheet-plan.md', 'docs/181-current-production-canon.md'],
    notes: 'Identity anchors: small armless rounded ink shadow, one short ink sprout, no mouth, thin face haze, black/deep navy/purple-black/blue-gray palette. Reference approval only; final/runtime approval remains false.',
  },
];

export const goldenReferenceSetById = new Map(goldenReferenceSets.map((set) => [set.id, set]));

export function hasApprovedIdentityReference(referenceSetId: string): boolean {
  const set = goldenReferenceSetById.get(referenceSetId);
  return Boolean(
    set
    && set.status === 'approved-style-reference'
    && set.assets.some((asset) => asset.role === 'identity' && asset.approvedForReference),
  );
}
