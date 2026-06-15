/**
 * 比較用 prototype アセット（本番ではない）。
 *
 * 本番の assetManifest とは分離して管理する。これらは VisualGallery の比較ページ
 * (`?scene=yui-redesign32`) でのみ読み込み、本番のユイ素材を上書きしない。
 * 生成パイプライン（generate-pixel-assets / assets:verify）も対象外。
 *
 * 作り方: assets/source/aseprite/player/prototypes/*.aseprite を編集し、
 * `pnpm aseprite:export:proto` で public/assets/sprites/player/prototypes/ へ export する。
 */
export type PrototypeAssetEntry = {
  /** Phaser テクスチャキー。 */
  id: string;
  /** public/ からの相対パス。 */
  path: string;
  width: number;
  height: number;
  /** 比較対象の本番アセットid（並べて見せる用）。 */
  compareWith: string;
  /** 比較ページ用の短いラベル。 */
  label: string;
};

export const prototypeAssets: PrototypeAssetEntry[] = [
  {
    id: 'yui_idle_v3_32',
    path: 'assets/sprites/player/prototypes/yui_idle_v3_32.png',
    width: 32,
    height: 32,
    compareWith: 'yui_idle',
    label: 'idle v3 (32px高密度案)',
  },
];

export const prototypeById = new Map(prototypeAssets.map((p) => [p.id, p]));
