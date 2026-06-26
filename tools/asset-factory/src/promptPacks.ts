import type { AssetType, InspectResult } from './types';
import { ENEMY_PRESETS, WEAPON_PRESETS, ITEM_PRESETS } from './presets';

export type PromptPackType = AssetType | 'all';
export type PromptPackMode = 'ja-detail' | 'en-detail' | 'compact';

export const PACK_LABELS: Record<PromptPackType, string> = {
  character: 'Character',
  enemy: 'Enemy',
  weapon: 'Weapon',
  item: 'Item',
  background: 'Background',
  cutin: 'Cutin',
  all: 'All-in-One',
};

const WORLD_RULES_JA = `## Vamp Pon 世界観ルール

- ジャンル: モバイル2Dヴァンサバ系アクション
- 世界観: 夜の忘れ物の世界。忘れられた物が命を持ち、小さな光だけが道を照らす
- 主人公ユイ: ランタンを持つ少女。記憶を集める旅をしている
- 敵 (オンブ): 忘れられた物が意思を持った存在。敵意は薄く、哀愁がある
- ボス (オンブロ/番人): 大型の忘れ物の守護者
- 色調: 暗いが温かみがある。黒インク、紙、小さな灯り、記憶の断片
- UI: 夜空とランタンの光をモチーフにしたダークテーマ`;

const WORLD_RULES_EN = `## Vamp Pon World Rules

- Genre: Mobile 2D vampire-survivors-like action
- World: A nighttime world of forgotten things. Forgotten objects gain life; only small lights illuminate the path
- Protagonist Yui: A girl carrying a lantern, on a journey to collect memories
- Enemies (Ombu): Forgotten objects that gained consciousness. Not hostile — melancholic
- Bosses (Omburo / Keepers): Large guardian spirits of forgotten things
- Palette: Dark but warm. Black ink, paper, small lights, memory fragments
- UI: Dark theme inspired by night sky and lantern glow`;

const STYLE_RULES_JA = `## 共通スタイルルール

- Vamp Pon スタイル: 暗いが温かみのある雰囲気
- モチーフ: 紙 / 記憶 / 黒インク / 小さな光
- モバイルゲーム素材として読みやすいこと
- 透過PNG (真のアルファ、チェッカーボードではない)
- テキスト・ロゴ・ボーダー・チェッカーボード・白フリンジ禁止
- シルエットはシンプルで読みやすく
- ゲーム品質のクオリティ`;

const STYLE_RULES_EN = `## Common Style Rules

- Vamp Pon style: dark but warm atmosphere
- Motifs: paper / memory / black ink / small light
- Readable as mobile game asset
- Transparent PNG (true alpha, not checkerboard)
- No text, no logo, no border, no checkerboard, no white fringe
- Keep silhouette simple and readable
- Game-ready quality`;

const YUI_FIXED_RULES_JA = `## ユイ固定ルール

- ランタンはユイの右手に持つ (全フレーム共通)
- カバンのストラップは右肩から左腰へ
- カバン本体は左腰に配置
- ランタンは左向きフレームでも消えてはいけない
- 方向転換時、利き手・装備品の配置は体の部位基準で維持する
- スクリーン左右とボディ左右を混同しない`;

const YUI_FIXED_RULES_EN = `## Yui Fixed Rules

- Lantern is held in Yui's right hand (all frames)
- Bag strap goes from right shoulder to left hip
- Bag body is placed on the left hip
- Lantern must not disappear in left-facing frames
- When changing direction, dominant hand and equipment placement follow body-relative mapping
- Do not confuse screen-left/right with body-left/right`;

const CELL_RULES_JA = `## 180x180 セルルール

- キャンバスまたはスプライトシートのセル: 180 x 180 px
- 被写体はセル全体を埋めない — シルエット・アニメーション・装備・武器・グロー・エフェクト用の透明マージンを確保
- 不透明ピクセル・アクセサリ・影・グロー・エフェクトがセル端に接触しない
- ゲームサイズで読めなくなるほど被写体を縮小しない
- 関連フレーム・関連アセット間でスケールを一定に保つ`;

const CELL_RULES_EN = `## 180x180 Cell Rules

- Canvas or sprite sheet cell: 180 x 180 px
- Subject must not fill the whole 180 px — leave transparent room for silhouette, animation, equipment, weapons, glow, and effects
- No opaque pixel, accessory, shadow, glow, or effect may touch a cell edge
- Do not shrink the subject so far that it becomes unreadable at gameplay size
- Keep scale consistent across related frames and related assets`;

const NEGATIVE_PROMPT_JA = `## ネガティブプロンプト (生成時に除外すべき要素)

- テキスト・文字・ロゴ・透かし
- グリッド線・セルボーダー（画像上に描画されたもの）
- チェッカーボード背景（透明に見せかける偽装）
- 白フリンジ・白い輪郭・アンチエイリアスの白漏れ
- 実写風・写真風テクスチャ
- 過度に複雑なディテール（モバイル画面で潰れる）
- 3Dレンダリング風の光沢・反射
- アニメ風の過度な線画・ハッチング
- 血液・ゴア・暴力的表現
- 性的表現
- 既存IP・ブランドのデザイン模倣`;

const NEGATIVE_PROMPT_EN = `## Negative Prompt (Elements to Exclude)

- Text, letters, logos, watermarks
- Grid lines, cell borders drawn on the image
- Checkerboard background (fake transparency)
- White fringe, white outline, anti-aliasing white bleed
- Photorealistic / photo-like textures
- Overly complex detail (unreadable on mobile screens)
- 3D-rendered gloss / reflections
- Excessive line art / hatching in anime style
- Blood, gore, violent expressions
- Sexual content
- Imitation of existing IP / brand designs`;

const AFTER_CHECK_JA = `## 生成後チェックリスト (Asset Factory で確認)

1. **Asset Factory に PNG を読み込む** — ドラッグ&ドロップまたはファイル選択
2. **検査タブで確認:**
   - [ ] 空セルが想定通りか
   - [ ] セル端接触 (edge touch) エラーが 0 か
   - [ ] bbox 中心ガタつき (jitter) 警告が許容範囲か
3. **プレビューで確認:**
   - [ ] グリッドオーバーレイでセル配置が正しいか
   - [ ] 透過境界 (bbox) が各セル内に収まっているか
   - [ ] 市松模様モードで真の透過になっているか (白が漏れていないか)
4. **全体確認:**
   - [ ] 64px 表示サイズで読みやすいか
   - [ ] 全セルでキャラクターのアイデンティティが一貫しているか
   - [ ] 利き手・装備配置が方向転換で破綻していないか
   - [ ] Vamp Pon の夜 / 記憶 / 忘れ物 / 小さな光の世界観に合っているか
5. **OKなら** マニフェストタブで metadata を編集しライブラリに保存`;

const AFTER_CHECK_EN = `## Post-Generation Checklist (Verify in Asset Factory)

1. **Load PNG into Asset Factory** — drag & drop or file select
2. **Check in Inspect tab:**
   - [ ] Empty cells match expectations
   - [ ] Edge touch errors = 0
   - [ ] Bbox center jitter warnings within tolerance
3. **Check in Preview:**
   - [ ] Grid overlay confirms correct cell placement
   - [ ] Alpha bbox fits within each cell
   - [ ] Checkerboard mode confirms true transparency (no white bleed)
4. **Overall check:**
   - [ ] Readable at 64px display size
   - [ ] Character identity consistent across all cells
   - [ ] Handedness / equipment placement coherent across directions
   - [ ] Fits Vamp Pon's night / memory / forgotten-object / small-light world
5. **If OK** — edit metadata in Manifest tab and save to Library`;

const AFTER_CHECK_CUTIN_JA = `## 生成後チェックリスト (カットイン専用)

1. **Asset Factory に PNG を読み込む**
2. **サイズ確認:** 1440 x 360 px であること
3. **透過背景確認:** 市松模様モードで真の透過になっているか
4. **禁止要素確認:** テキスト・ロゴ・ボーダー・チェッカーボード・白フリンジがないこと
5. **キャラクター確認:** アイデンティティが正しく、ランタン配置が仕様通りか
6. **演出確認:** 横長バトルカットインとして機能するか
7. **OKなら** マニフェストタブで metadata を編集しライブラリに保存`;

const AFTER_CHECK_CUTIN_EN = `## Post-Generation Checklist (Cutin)

1. **Load PNG into Asset Factory**
2. **Verify size:** must be 1440 x 360 px
3. **Verify transparent background:** checkerboard mode confirms true transparency
4. **Verify no prohibited elements:** no text / logo / border / checkerboard / white fringe
5. **Verify character identity and lantern placement**
6. **Verify it works as a horizontal battle cutin**
7. **If OK** — edit metadata in Manifest tab and save to Library`;

const AFTER_CHECK_BG_JA = `## 生成後チェックリスト (背景専用)

1. **Asset Factory に PNG を読み込む**
2. **390x844 クロップ/視認性確認:** 戦闘画面として成立するか
3. **上部HUD安全領域確認:** UIが読めるか
4. **プレイヤー/敵/EXP視認性確認:** 戦闘要素が背景に沈まないか
5. **禁止要素確認:** UI・テキスト・キャラクターが画像に焼き込まれていないこと
6. **世界観確認:** 暗いが読みやすいVamp Ponの雰囲気に合っているか
7. **OKなら** マニフェストタブで metadata を編集しライブラリに保存`;

const AFTER_CHECK_BG_EN = `## Post-Generation Checklist (Background)

1. **Load PNG into Asset Factory**
2. **Verify 390x844 crop/readability:** works as a battle screen
3. **Check top HUD safe area:** UI remains readable
4. **Check player/enemy/EXP readability:** combat elements don't sink into background
5. **Verify no UI/text/character baked in**
6. **Verify dark but readable Vamp Pon mood**
7. **If OK** — edit metadata in Manifest tab and save to Library`;

function buildCharacterPack(mode: PromptPackMode): string {
  const ja = mode === 'ja-detail';
  const compact = mode === 'compact';

  if (compact) {
    return `# Character Prompt Pack (Compact)

Character sprite sheet, 2D mobile game "Vamp Pon".
Canvas: 1440x1080, grid 8x6, cell 180x180, transparent PNG.

Rows: idle-front(4)+idle-back(4) / walk-front(4)+walk-back(4) / idle-right(4)+idle-left(4) / walk-right(4)+walk-left(4) / attack(4)+special(4) / hit(4)+death(4)

Style: dark warm, paper/memory/ink/small-light, readable at 64px, no text/logo/border/checker/white-fringe.
Cell: subject centered, no edge touch, consistent scale, transparent margin.
Yui: lantern=right hand, strap=right-shoulder→left-hip, bag=left-hip, lantern visible in all directions.

Negative: text, grid lines, checkerboard bg, white fringe, photorealistic, 3D gloss, gore, sexual, IP copy.

Post-check: Asset Factory → inspect (edge touch=0, jitter OK) → preview (grid/bbox/transparency) → 64px readability → identity consistency → world fit.`;
  }

  const world = ja ? WORLD_RULES_JA : WORLD_RULES_EN;
  const style = ja ? STYLE_RULES_JA : STYLE_RULES_EN;
  const yui = ja ? YUI_FIXED_RULES_JA : YUI_FIXED_RULES_EN;
  const cell = ja ? CELL_RULES_JA : CELL_RULES_EN;
  const neg = ja ? NEGATIVE_PROMPT_JA : NEGATIVE_PROMPT_EN;
  const check = ja ? AFTER_CHECK_JA : AFTER_CHECK_EN;
  const title = ja ? 'キャラクター プロンプトパック' : 'Character Prompt Pack';

  const spec = ja
    ? `## キャラクタースプライトシート仕様

- キャンバス: 1440 x 1080 px
- グリッド: 8列 x 6行
- セルサイズ: 180 x 180 px
- 透過背景 (真のアルファ)
- グリッド線・セルボーダーは画像上に描画しない
- 各ポーズはセル内に中央配置
- 不透明ピクセルがセル端に接触しない
- 全セルで一貫したスケール
- 64px 表示サイズで読めること

### 行レイアウト (標準キャラクター)
- Row 0: 正面アイドル (4フレーム) + 背面アイドル (4フレーム)
- Row 1: 正面歩行 (4フレーム) + 背面歩行 (4フレーム)
- Row 2: 右向きアイドル (4フレーム) + 左向きアイドル (4フレーム)
- Row 3: 右向き歩行 (4フレーム) + 左向き歩行 (4フレーム)
- Row 4: 攻撃 (4フレーム) + 特殊 (4フレーム)
- Row 5: 被弾 (4フレーム) + 死亡 (4フレーム)`
    : `## Character Sprite Sheet Specification

- Canvas: 1440 x 1080 px
- Grid: 8 columns x 6 rows
- Cell size: 180 x 180 px
- Transparent background (true alpha)
- No grid lines, no cell borders drawn on the image
- Each pose centered within its cell
- No opaque pixel may touch a cell edge
- Consistent scale across all cells
- Must be readable at 64px display size

### Row Layout (Standard Character)
- Row 0: idle front (4 frames) + idle back (4 frames)
- Row 1: walk front (4 frames) + walk back (4 frames)
- Row 2: idle right (4 frames) + idle left (4 frames)
- Row 3: walk right (4 frames) + walk left (4 frames)
- Row 4: attack (4 frames) + special (4 frames)
- Row 5: hit (4 frames) + death (4 frames)`;

  return `# ${title}

${world}

${style}

${yui}

${cell}

${spec}

${neg}

${check}`;
}

function buildEnemyPack(mode: PromptPackMode): string {
  const ja = mode === 'ja-detail';
  const compact = mode === 'compact';

  const presetList = ENEMY_PRESETS.map(p => {
    const m = p.manifest as Record<string, unknown>;
    return `- **${p.label}** (${m.enemyId}): motif=${m.motif}, behavior=${m.behavior}, size=${m.sizeTier}`;
  }).join('\n');

  if (compact) {
    return `# Enemy Prompt Pack (Compact)

Enemy sprite sheet, 2D mobile game "Vamp Pon".
Canvas: 1440x1080, grid 8x6, cell 180x180, transparent PNG.

Rows: idle-front(4)+variations / walk-front(4-8) / idle-side+walk-side / attack / hit-damage / death-dissolve

Style: dark warm, paper/memory/ink/small-light, forgotten-object-come-alive, readable at 64px.
Cell: subject centered, no edge touch, consistent scale, same identity across all cells.

Presets:
${presetList}

Negative: text, grid lines, checkerboard bg, white fringe, photorealistic, 3D gloss, gore, sexual, IP copy.

Post-check: Asset Factory → inspect (edge touch=0, jitter OK) → preview (grid/bbox/transparency) → 64px readability → identity consistency → world fit.`;
  }

  const world = ja ? WORLD_RULES_JA : WORLD_RULES_EN;
  const style = ja ? STYLE_RULES_JA : STYLE_RULES_EN;
  const cell = ja ? CELL_RULES_JA : CELL_RULES_EN;
  const neg = ja ? NEGATIVE_PROMPT_JA : NEGATIVE_PROMPT_EN;
  const check = ja ? AFTER_CHECK_JA : AFTER_CHECK_EN;
  const title = ja ? '敵 プロンプトパック' : 'Enemy Prompt Pack';

  const spec = ja
    ? `## 敵スプライトシート仕様

- キャンバス: 1440 x 1080 px
- グリッド: 8列 x 6行
- セルサイズ: 180 x 180 px
- 透過背景 (真のアルファ)
- グリッド線・セルボーダーは画像上に描画しない
- 各ポーズ/フレームはセル内に中央配置
- 不透明ピクセルがセル端に接触しない
- 全セルで一貫したスケール
- 64px 表示サイズで読めること
- 全セルで同一の敵アイデンティティ (色・形・特徴) を維持

### 行レイアウト
- Row 0: 正面アイドル (4フレーム) + アイドルバリエーション
- Row 1: 正面歩行/移動 (4-8フレーム)
- Row 2: 横向きアイドル / 横歩行
- Row 3: 攻撃または特殊アクション
- Row 4: 被弾 / ダメージリアクション
- Row 5: 死亡 / 消滅シーケンス

### 敵デザインルール
- 忘れ物が意思を持った存在 — 哀愁と可愛さがある
- 敵意は薄く、どこか寂しげ
- 忘れられた物のシルエットが元の形から想像できること`
    : `## Enemy Sprite Sheet Specification

- Canvas: 1440 x 1080 px
- Grid: 8 columns x 6 rows
- Cell size: 180 x 180 px
- Transparent background (true alpha)
- No grid lines, no cell borders drawn on the image
- Each pose/frame centered within its cell
- No opaque pixel may touch a cell edge
- Consistent scale across all cells
- Must be readable at 64px display size
- Same enemy identity (color, shape, features) across ALL cells

### Row Layout
- Row 0: idle front (4 frames) + idle variations
- Row 1: walk/move front (4-8 frames)
- Row 2: idle side / walk side
- Row 3: attack or special action
- Row 4: hit / damage reaction
- Row 5: death / dissolve sequence

### Enemy Design Rules
- Forgotten objects that gained consciousness — melancholic and cute
- Not hostile, somewhat lonely
- Silhouette should hint at the original forgotten object`;

  const presetSection = ja
    ? `## 敵プリセット一覧\n\n${presetList}`
    : `## Enemy Presets\n\n${presetList}`;

  return `# ${title}

${world}

${style}

${cell}

${spec}

${presetSection}

${neg}

${check}`;
}

function buildWeaponPack(mode: PromptPackMode): string {
  const ja = mode === 'ja-detail';
  const compact = mode === 'compact';

  const presetList = WEAPON_PRESETS.map(p => {
    const m = p.manifest as Record<string, unknown>;
    return `- **${p.label}** (${m.weaponId}): motif=${m.motif}, trajectory=${m.trajectory}`;
  }).join('\n');

  if (compact) {
    return `# Weapon Prompt Pack (Compact)

Weapon icon, 2D mobile game "Vamp Pon".
Canvas: 1024x1024 (master), transparent PNG.

Subject centered, readable at 64px+32px. No text, no rarity frame/border (game UI applies).
Style: dark warm, paper/memory/ink/small-light, clean silhouette.

Presets:
${presetList}

Negative: text, logo, checkerboard bg, white fringe, photorealistic, 3D gloss, rarity border, gore, sexual, IP copy.

Post-check: Asset Factory → load PNG → verify transparency → check readability at small sizes → world fit.`;
  }

  const world = ja ? WORLD_RULES_JA : WORLD_RULES_EN;
  const style = ja ? STYLE_RULES_JA : STYLE_RULES_EN;
  const neg = ja ? NEGATIVE_PROMPT_JA : NEGATIVE_PROMPT_EN;
  const check = ja ? AFTER_CHECK_JA : AFTER_CHECK_EN;
  const title = ja ? '武器 プロンプトパック' : 'Weapon Prompt Pack';

  const spec = ja
    ? `## 武器アイコン仕様

- キャンバス: 1024 x 1024 px (マスターサイズ)
- 透過背景 (真のアルファ)
- 武器をキャンバス中央に配置
- 64px および 32px 表示サイズで読めること
- テキストを画像に焼き込まない
- レアリティ枠やボーダーを焼き込まない (ゲームUIが付与する)
- 明確で識別しやすいシルエット`
    : `## Weapon Icon Specification

- Canvas: 1024 x 1024 px (master size)
- Transparent background (true alpha)
- Weapon centered in canvas
- Must be readable at 64px and 32px display sizes
- No text baked into the image
- No rarity frame or border baked in (applied by game UI)
- Clean silhouette with identifiable shape`;

  const presetSection = ja
    ? `## 武器プリセット一覧\n\n${presetList}`
    : `## Weapon Presets\n\n${presetList}`;

  return `# ${title}

${world}

${style}

${spec}

${presetSection}

${neg}

${check}`;
}

function buildItemPack(mode: PromptPackMode): string {
  const ja = mode === 'ja-detail';
  const compact = mode === 'compact';

  const presetList = ITEM_PRESETS.map(p => {
    const m = p.manifest as Record<string, unknown>;
    return `- **${p.label}** (${m.itemId}): category=${m.category}, effect=${m.effectType}, rarity=${m.rarity}`;
  }).join('\n');

  if (compact) {
    return `# Item Prompt Pack (Compact)

Item icon, 2D mobile game "Vamp Pon".
Canvas: 1024x1024 (master), transparent PNG.

Subject centered, readable at 64px+32px. No text, no rarity frame/border (game UI applies).
Style: dark warm, paper/memory/ink/small-light, clean silhouette.

Presets:
${presetList}

Negative: text, logo, checkerboard bg, white fringe, photorealistic, 3D gloss, rarity border, gore, sexual, IP copy.

Post-check: Asset Factory → load PNG → verify transparency → check readability at small sizes → world fit.`;
  }

  const world = ja ? WORLD_RULES_JA : WORLD_RULES_EN;
  const style = ja ? STYLE_RULES_JA : STYLE_RULES_EN;
  const neg = ja ? NEGATIVE_PROMPT_JA : NEGATIVE_PROMPT_EN;
  const check = ja ? AFTER_CHECK_JA : AFTER_CHECK_EN;
  const title = ja ? 'アイテム プロンプトパック' : 'Item Prompt Pack';

  const spec = ja
    ? `## アイテムアイコン仕様

- キャンバス: 1024 x 1024 px (マスターサイズ)
- 透過背景 (真のアルファ)
- アイテムをキャンバス中央に配置
- 64px および 32px 表示サイズで読めること
- テキストを画像に焼き込まない
- レアリティ枠やボーダーを焼き込まない (ゲームUIが付与する)
- 明確で識別しやすいシルエット`
    : `## Item Icon Specification

- Canvas: 1024 x 1024 px (master size)
- Transparent background (true alpha)
- Item centered in canvas
- Must be readable at 64px and 32px display sizes
- No text baked into the image
- No rarity frame or border baked in (applied by game UI)
- Clean silhouette with identifiable shape`;

  const presetSection = ja
    ? `## アイテムプリセット一覧\n\n${presetList}`
    : `## Item Presets\n\n${presetList}`;

  return `# ${title}

${world}

${style}

${spec}

${presetSection}

${neg}

${check}`;
}

function buildBackgroundPack(mode: PromptPackMode): string {
  const ja = mode === 'ja-detail';
  const compact = mode === 'compact';

  if (compact) {
    return `# Background Prompt Pack (Compact)

Portrait mobile battle background, 2D mobile game "Vamp Pon".
Target: 390x844 px (portrait mobile). Larger master allowed only if crop-safe to 390x844.
Full illustration, no transparency needed. Not endless runner, not platformer, not side-scroller.

Combat readability first: player/enemy/EXP/HUD must remain visible.
Safe top HUD area. Avoid noisy center. Avoid high contrast behind player.
Dark but readable. Paper texture. Night street / memory / forgotten object / black ink mood.

Style: dark warm, paper/memory/ink/small-light. No text/logo/UI baked in/character baked in.

Negative: text, logo, watermark, UI elements, character baked in, photorealistic, overly bright, 3D gloss, gore, sexual, IP copy.

Post-check: Asset Factory → load PNG → verify 390x844 crop/readability → check top HUD safe area → player/enemy/EXP readability → no UI/text/character baked in → dark but readable Vamp Pon mood.`;
  }

  const world = ja ? WORLD_RULES_JA : WORLD_RULES_EN;
  const neg = ja ? NEGATIVE_PROMPT_JA : NEGATIVE_PROMPT_EN;
  const check = ja ? AFTER_CHECK_BG_JA : AFTER_CHECK_BG_EN;
  const title = ja ? '背景 プロンプトパック' : 'Background Prompt Pack';

  const spec = ja
    ? `## 背景イラスト仕様

- ターゲットサイズ: 390 x 844 px (モバイル縦向き戦闘背景)
- より大きいマスター画像は 390x844 へのクロップが安全な場合のみ許可
- フル背景イラスト、透過不要
- エンドレスランナーではない、プラットフォーマーでもない、横スクロールでもない
- 戦闘の視認性が最優先: プレイヤー・敵・EXP・HUD が見えること
- 上部HUD安全領域を確保
- 中央にうるさいパターンを置かない
- プレイヤー背後の高コントラストを避ける
- 暗いが読みやすい。紙テクスチャ

### 背景デザインルール
- 夜の世界が舞台 — 月明かり、街灯、ランタンの光が点在
- 忘れ物の世界感 — 古びた街角、忘れられた路地、薄暗い公園
- 夜の通り / 記憶 / 忘れ物 / 黒インクの雰囲気
- テキスト・ロゴ・UI・キャラクターを画像に焼き込まない
- 過度に明るい部分を作らない`
    : `## Background Illustration Specification

- Target size: 390 x 844 px (portrait mobile battle background)
- Larger master allowed only if clearly stated as crop-safe to 390x844
- Full background illustration, no transparency needed
- Not endless runner, not platformer, not side-scroller
- Combat readability first: player / enemy / EXP / HUD must remain visible
- Safe top HUD area
- Avoid noisy center
- Avoid high contrast behind player
- Dark but readable. Paper texture

### Background Design Rules
- Nighttime world setting — moonlight, street lamps, lantern glow scattered throughout
- Forgotten-things world — worn-down street corners, forgotten alleys, dim parks
- Night street / memory / forgotten object / black ink mood
- No text, no logo, no UI baked in, no character baked in
- Avoid overly bright areas`;

  const styleRules = ja ? STYLE_RULES_JA : STYLE_RULES_EN;

  return `# ${title}

${world}

${styleRules}

${spec}

${neg}

${check}`;
}

function buildCutinPack(mode: PromptPackMode): string {
  const ja = mode === 'ja-detail';
  const compact = mode === 'compact';

  if (compact) {
    return `# Cutin Prompt Pack (Compact)

Horizontal wide cut-in illustration, 2D mobile game "Vamp Pon".
Canvas: 1440x360 px, PNG RGBA, transparent background.

Full-width impact, readable silhouette, character identity stable.
Normal / ultimate / kokuyou versions. Warm lantern core remains.
Style: dark warm, paper/memory/ink/small-light.

Negative: text, logo, border, checkerboard bg, white fringe, photorealistic, 3D gloss, gore, sexual, IP copy.

Post-check: Asset Factory → load PNG → verify 1440x360 → verify transparent bg → no text/logo/border/checkerboard/white fringe → character identity + lantern placement → works as horizontal battle cutin.`;
  }

  const world = ja ? WORLD_RULES_JA : WORLD_RULES_EN;
  const style = ja ? STYLE_RULES_JA : STYLE_RULES_EN;
  const yui = ja ? YUI_FIXED_RULES_JA : YUI_FIXED_RULES_EN;
  const neg = ja ? NEGATIVE_PROMPT_JA : NEGATIVE_PROMPT_EN;
  const check = ja ? AFTER_CHECK_CUTIN_JA : AFTER_CHECK_CUTIN_EN;
  const title = ja ? 'カットイン プロンプトパック' : 'Cutin Prompt Pack';

  const spec = ja
    ? `## カットインイラスト仕様

- キャンバス: 1440 x 360 px (横長ワイドカットイン)
- PNG RGBA、透過背景 (真のアルファ)
- 横幅いっぱいのインパクト
- 読みやすいシルエット、キャラクターアイデンティティ安定
- テキスト・ロゴ・ボーダー・チェッカーボード・白フリンジ禁止
- 通常版 / 必殺版 / 黒曜版を想定
- 黒曜版でもランタンの温かい芯は残す

### カットインデザインルール
- レベルアップ・必殺技発動・ボス登場などの横長演出で使用
- キャラクターの個性が最も引き立つ構図
- 背景は透過 — ゲーム画面に重ねて表示する`
    : `## Cut-in Illustration Specification

- Canvas: 1440 x 360 px (horizontal wide cutin)
- PNG RGBA, transparent background (true alpha)
- Full-width impact, readable silhouette, character identity stable
- No text, no logo, no border, no checkerboard, no white fringe
- Normal / ultimate / kokuyou versions
- Warm lantern core remains even in kokuyou version

### Cutin Design Rules
- Used for level-up, special attack activation, boss appearance — horizontal wide format
- Composition that best highlights the character's personality
- Background is transparent — overlaid on game screen`;

  return `# ${title}

${world}

${style}

${yui}

${spec}

${neg}

${check}`;
}

export type PresetExpansion = 'none' | 'all' | string;

export function buildPromptPack(packType: PromptPackType, mode: PromptPackMode, presetExpansion: PresetExpansion = 'none'): string {
  if (packType === 'all') {
    const types: AssetType[] = ['character', 'enemy', 'weapon', 'item', 'background', 'cutin'];
    const separator = '\n\n---\n\n';
    const header = mode === 'ja-detail'
      ? '# Vamp Pon 全素材 プロンプトパック\n\n以下に全アセットタイプのプロンプトパックをまとめています。'
      : mode === 'en-detail'
        ? '# Vamp Pon All Assets Prompt Pack\n\nAll asset type prompt packs are compiled below.'
        : '# Vamp Pon All Assets Prompt Pack (Compact)\n\nAll asset types compiled below.';
    return header + separator + types.map(t => buildPromptPack(t, mode, presetExpansion)).join(separator);
  }

  let base: string;
  switch (packType) {
    case 'character': base = buildCharacterPack(mode); break;
    case 'enemy': base = buildEnemyPack(mode); break;
    case 'weapon': base = buildWeaponPack(mode); break;
    case 'item': base = buildItemPack(mode); break;
    case 'background': base = buildBackgroundPack(mode); break;
    case 'cutin': base = buildCutinPack(mode); break;
  }

  if (presetExpansion !== 'none' && (packType === 'enemy' || packType === 'weapon' || packType === 'item')) {
    const expanded = buildPresetPrompts(packType, mode, presetExpansion);
    if (expanded) base += '\n\n' + expanded;
  }

  return base;
}

// --- Preset-specific prompt data ---

const ENEMY_DETAILS: Record<string, { silhouette: string; colorRule: string; extra: string }> = {
  'ombu-small': {
    silhouette: 'Tiny round shadow blob with a single short ink sprout on top. No arms. Two small glowing dots for eyes. Simplest Ombu form.',
    colorRule: 'Base: blue-black body. Eyes: faint warm amber dots. No bright colors.',
    extra: 'Basic chaser enemy. Floats toward player gently. Must feel melancholic, not threatening. The simplest enemy — silhouette must be identifiable even at 32px.',
  },
  'ombu-shoe-zigzag': {
    silhouette: 'Small shadow creature shaped like a single lost shoe. The shoe form should be recognizable but organically melted into the shadow body. Laces trail like tendrils.',
    colorRule: 'Base: blue-black with slight brown undertone. Lace trails: slightly lighter shadow.',
    extra: 'Zigzag movement — sways left-right while approaching. The shoe is a forgotten item that wanted to walk home. Walk frames should show lateral sway, not straight movement. Not scary, not horror.',
  },
  'ombu-umbrella-shield': {
    silhouette: 'Small Ombu shadow creature carrying a broken umbrella silhouette. The umbrella canopy acts as a shield — sometimes open, sometimes closed. Umbrella is slightly too large for the small body.',
    colorRule: 'Base: blue-black body. Umbrella: darker silhouette with faint warm highlight at the handle tip.',
    extra: 'Shield behavior — umbrella opens/closes but remains simple. The umbrella wanted to protect someone from rain. Shield pose: umbrella open facing player. Vulnerability pose: umbrella closed or tilted. Not scary, not horror. Readable at 64px. 8x6 spritesheet, transparent background, no cell borders, no edge contact.',
  },
  'ombu-key-dasher': {
    silhouette: 'Small shadow creature with old key motif. Keyhole-like face or key-shaped horn protruding from top. Body is compact for fast movement. Sharp but cute-dark silhouette.',
    colorRule: 'Base: blue-black with slight metallic grey-blue tint. Key horn: slightly lighter, aged brass shadow.',
    extra: 'Dash / charge movement — builds up then rushes in a straight line. The key could never open its door. Charge-up frames: body compresses. Dash frames: elongated blur. Stable identity across all frames — same key horn, same face.',
  },
  'ombu-letter-shooter': {
    silhouette: 'Small shadow creature holding or made of an old envelope. Paper fragments float around it. The envelope flap is slightly open. Body merges with the letter form.',
    colorRule: 'Base: blue-black body. Envelope: slightly warmer shadow with faint paper-beige edge highlight.',
    extra: 'Paper fragment projectile pose — shoots torn paper pieces. The letter never reached its destination. Attack frames show paper scraps launching. No readable text on letter. No logo. No writing visible. Projectile scraps are simple triangular fragments.',
  },
  'omburo-lamppost-aura': {
    silhouette: 'Large Omburo shadow with a bent lamppost growing from its back. Two heavy arms with blunt 3-fingered hands. Long shadow flame on head. The lamppost emits a faint warm circle.',
    colorRule: 'Base: deep navy-black. Arms: dark purple shadow. Lamppost light: small warm amber glow — the only warm color. Eyes: faint ember.',
    extra: 'Aura / wall behavior — the lamppost light creates a zone. Mid-boss level enemy. Heavier, slower, more imposing than regular Ombu. The lamppost still tries to light the way. Must fit 180x180 cells despite larger size — use about 70% of cell. Not too detailed — readable at 64px.',
  },
  'forgotten-umbrella-keeper': {
    silhouette: 'Boss version of umbrella Ombu. Large broken umbrella silhouette dominates the upper body. Shadow body is wide and grounded. Multiple umbrella ribs extend like wings or antennae. Horizontally readable boss body.',
    colorRule: 'Base: deep black-purple. Umbrella ribs: dark grey-blue metallic shadow. Weak point: single warm amber glow at chest center (the memory core). Rain drops: faint blue-grey.',
    extra: '2 phase feeling. Phase 1: umbrella open, defensive, rain of dark drops. Phase 2: umbrella closes/breaks, aggressive charges. Still fits 180x180 cells if spritesheet — use about 75% of cell. Not too detailed. Clear phase transition in pose. The umbrella keeper guarded something precious under the rain but was forgotten.',
  },
};

const WEAPON_DETAILS: Record<string, { silhouette: string; colorRule: string; extra: string }> = {
  'north-star-lantern': {
    silhouette: 'Small handheld lantern with a star-shaped light core. Handle is simple curved wire. Glass panels suggest warmth inside. The north star motif appears as a subtle 4-point gleam.',
    colorRule: 'Body: warm dark brass. Glass: faint warm amber glow. Star core: bright warm white-gold point.',
    extra: 'Yui\'s signature weapon. Radial / cone trajectory. The lantern guides through the night. Icon must be the most recognizable weapon in the game. Readable at 32px — the star gleam is the key identifier.',
  },
  'night-pencil': {
    silhouette: 'Small magical pencil of night and memory. Pencil body is dark with faint star-line trail. Tip glows subtly. Simple elongated form with slight curve.',
    colorRule: 'Body: dark graphite grey-blue. Tip: faint warm amber point. Trail: subtle star-dust particles.',
    extra: 'Paper / graphite / faint star line motif. Directional straight-line weapon. Writes memories in the dark. Icon readable at 32px. No text. No rarity frame. The pencil should feel like a small everyday object with quiet magic.',
  },
  'paper-plane': {
    silhouette: 'Simple folded paper airplane. Clean geometric folds visible. Slight trail of paper dust behind.',
    colorRule: 'Body: warm paper-beige with dark ink edges. Fold shadows: slight warm grey.',
    extra: 'Homing projectile — gently curves toward enemies. A letter folded into a plane, sent to find someone. Clean, simple icon. The paper texture should be implied, not photorealistic.',
  },
  'black-ink-bottle': {
    silhouette: 'Small round ink bottle with cork or cap slightly askew. Black ink edge pools around the base. Bottle shape is compact and readable.',
    colorRule: 'Bottle: dark glass with faint warm reflection highlight. Ink: pure black with very subtle warm amber light reflection at edge. Cap: dark warm brown.',
    extra: 'Area weapon — creates ink pools on the ground. Black ink edge with warm tiny light reflection. No poison bottle look. No skull. No horror. The ink is creative, not toxic — it writes memories. Cork/cap detail is charming, not threatening.',
  },
  'lamp-post-ring': {
    silhouette: 'Circular ring of lamppost light. The ring is clean and geometric. Small lamppost silhouettes or light bulb shapes integrated into the ring circumference.',
    colorRule: 'Ring: warm amber outline on dark background. Lamppost details: darker warm brass within the glow.',
    extra: 'Orbit weapon — circles around the player as protection. The street lamps remember the way home. Clean circular icon with warm glow. Simple enough for 32px readability.',
  },
  'ink-lamp-ring': {
    silhouette: 'Fusion of black ink bottle and lamp-post ring. Black circular ring with warm lantern core at center. Ink drips along the ring edge. The fusion is dangerous but beautiful.',
    colorRule: 'Ring: black ink outer edge. Core: warm amber-gold lantern glow. Transition: ink bleeds into warm light at contact points.',
    extra: 'Evolved weapon icon — the fusion of black-ink-bottle and lamp-post-ring. Black circular ring with warm lantern core. Dangerous but beautiful. The ink and light learned to coexist. More complex than base weapons but still readable at 64px. No rarity frame baked in.',
  },
};

const ITEM_DETAILS: Record<string, { silhouette: string; colorRule: string; extra: string }> = {
  'warm-shoes': {
    silhouette: 'Small pair of warm shoes, slightly worn but cozy. Visible as a matched pair — not a single shoe. Simple rounded shoe form with short laces.',
    colorRule: 'Body: warm brown with slight amber inner glow. Sole: darker warm grey. Laces: lighter warm thread.',
    extra: 'Traveler item — speed up passive. Readable pair silhouette. Cozy but not childish. These shoes remember long walks. The warmth is subtle, not glowing — just comfortable. No cartoon proportions.',
  },
  'bigger-lantern-core': {
    silhouette: 'A slightly oversized lantern wick or core element. Flame-shaped with a wider base than a normal wick. Warm glow radiates from center.',
    colorRule: 'Core: bright warm amber-gold. Base: dark warm brass. Glow: soft warm halo.',
    extra: 'Pickup range increase passive. The bigger core draws light (and items) closer. Simple icon — a glowing core with warm halo. Must read as "lantern part" not "generic flame".',
  },
  'paper-armor': {
    silhouette: 'Layered sheets of old paper folded into a rough armor or shield shape. Paper edges are slightly torn. Multiple layers visible from the side.',
    colorRule: 'Papers: warm beige with dark ink edges. Fold shadows: warm grey. Slight ink writing marks (decorative, not readable).',
    extra: 'MaxHP increase passive. Paper that protects — fragile but willing. The armor is made of letters, notes, and memories layered together. Not a traditional metal armor. Charming and papery.',
  },
  'quiet-clock': {
    silhouette: 'Small pocket watch or desk clock with hands frozen at an angle. Round face with minimal markings. Chain or loop at top.',
    colorRule: 'Body: dark warm brass-gold. Face: slightly lighter with dark hands. Chain: thin warm metal.',
    extra: 'Cooldown reduction passive. The clock is quiet because time moves gently. Not ticking loudly — peaceful. Not a scary stopped clock. No skull or death imagery. The clock chose to slow down, not stop.',
  },
  'dawn-ticket': {
    silhouette: 'Small old ticket with rounded corners and a tear line. Faint dawn-color gradient visible. Ticket stub shape — torn at one edge as if already used once.',
    colorRule: 'Body: warm paper with faint dawn orange-pink gradient at one edge. Text area: no readable text — just faint lines. Tear edge: slightly darker warm.',
    extra: 'Revive consumable — one use only. Revival / return feeling. No readable text. No letters. No logo. The ticket is a promise of one more chance — the dawn will come. The orange-pink is subtle, not a full sunrise. Mostly warm paper color.',
  },
  'cracked-map': {
    silhouette: 'Folded map with visible crack lines / fold creases. Partially open to show route lines. Worn edges.',
    colorRule: 'Body: warm aged paper. Crack lines: dark ink seeping through. Route marks: faint warm amber traces.',
    extra: 'EXP bonus passive with increased damage taken risk. The map shows paths nobody walks anymore. Cracks suggest fragility and danger. Not a treasure map — a forgotten travel guide.',
  },
  'keeper-bell': {
    silhouette: 'Small bell with a soft curved shape. A faint memory glow emanates from inside. Simple clapper visible. Short handle or loop at top.',
    colorRule: 'Body: warm dark brass with subtle amber inner glow. Clapper: slightly darker. Handle: simple dark metal.',
    extra: 'Magnet passive — attracts drops after mid-boss. Soft sound motif. Not a Christmas bell — darker, older, more mysterious. Not luxury gold — humble brass. The bell calls memory fragments closer. Sound implied by shape, not by visual effects.',
  },
};

function buildPresetPrompts(type: 'enemy' | 'weapon' | 'item', mode: PromptPackMode, expansion: PresetExpansion): string {
  const compact = mode === 'compact';
  const ja = mode === 'ja-detail';
  const presets = type === 'enemy' ? ENEMY_PRESETS : type === 'weapon' ? WEAPON_PRESETS : ITEM_PRESETS;
  const details = type === 'enemy' ? ENEMY_DETAILS : type === 'weapon' ? WEAPON_DETAILS : ITEM_DETAILS;
  const header = ja ? '## プリセット別 個別プロンプト' : '## Preset-Specific Prompts';

  const filteredPresets = expansion === 'all'
    ? presets
    : presets.filter(p => p.id === expansion);

  if (filteredPresets.length === 0) return '';

  const outputSpec = type === 'enemy'
    ? 'Canvas: 1440x1080, grid 8x6, cell 180x180 px, transparent PNG (true alpha).'
    : 'Canvas: 1024x1024 px (master), transparent PNG (true alpha).';

  const sections = filteredPresets.map(p => {
    const m = p.manifest as Record<string, unknown>;
    const d = details[p.id];
    if (!d) return null;

    if (compact) {
      return `### ${p.label} (${m[type + 'Id'] || p.id})
${d.silhouette} ${d.extra}
Color: ${d.colorRule}
Output: ${outputSpec} No text, no border, no edge contact.`;
    }

    const negLine = ja
      ? 'テキスト・ロゴ・チェッカーボード背景・白フリンジ・実写風・3D光沢・ゴア・性的表現・既存IPコピー禁止'
      : 'No text, logo, checkerboard bg, white fringe, photorealistic, 3D gloss, gore, sexual content, IP copy';
    const checkLine = ja
      ? 'Asset Factory で読込 → 検査 (edge touch=0, jitter OK) → プレビュー (grid/bbox/透過確認) → 64px可読性 → アイデンティティ一貫性'
      : 'Load in Asset Factory → inspect (edge touch=0, jitter OK) → preview (grid/bbox/transparency) → 64px readability → identity consistency';

    return `### ${p.label}

- **ID:** ${m[type + 'Id'] || p.id}
- **Display Name:** ${p.label}
- **Motif:** ${m.motif || '-'}
${type === 'enemy' ? `- **Behavior:** ${m.behavior || '-'}\n- **Size:** ${m.sizeTier || '-'}` : ''}${type === 'weapon' ? `- **Trajectory:** ${m.trajectory || '-'}` : ''}${type === 'item' ? `- **Category:** ${m.category || '-'}\n- **Effect:** ${m.effectType || '-'}\n- **Rarity:** ${m.rarity || '-'}` : ''}

**Silhouette:** ${d.silhouette}

**Color Rule:** ${d.colorRule}

**Design Notes:** ${d.extra}

**Output:** ${outputSpec}

**Negative:** ${negLine}

**Check:** ${checkLine}`;
  }).filter(Boolean);

  return `${header}\n\n${sections.join('\n\n---\n\n')}`;
}

// --- Regeneration Prompt Builder ---

export function buildRegenerationPrompt(inspectResult: InspectResult, assetType: AssetType, displayName: string): string {
  const issues: string[] = [];
  const fixes: string[] = [];
  const isSpriteSheet = assetType === 'character' || assetType === 'enemy';
  const isIcon = assetType === 'weapon' || assetType === 'item';
  const isBg = assetType === 'background';
  const isCutin = assetType === 'cutin';

  const emptyCells = inspectResult.cells.filter(c => c.empty);
  const edgeTouchCells = inspectResult.cells.filter(c => c.touchesEdge);
  const tooSmall = inspectResult.warnings.filter(w => w.message.includes('極端に小さい'));
  const tooLarge = inspectResult.warnings.filter(w => w.message.includes('極端に大きい'));
  const jitter = inspectResult.warnings.filter(w => w.message.includes('ガタつき'));
  const sizeError = inspectResult.warnings.filter(w => w.message.includes('シートサイズ'));

  if (isSpriteSheet) {
    if (emptyCells.length > 0) {
      issues.push(`Empty cells detected: ${emptyCells.length} cells have no opaque pixels (cells: ${emptyCells.map(c => `[${c.row},${c.col}]`).join(', ')})`);
      fixes.push('All ' + inspectResult.totalCells + ' cells must contain a valid frame. Do not leave empty transparent cells.');
    }
    if (edgeTouchCells.length > 0) {
      issues.push(`Edge contact detected: ${edgeTouchCells.length} cells have opaque pixels touching cell edges (cells: ${edgeTouchCells.map(c => `[${c.row},${c.col}]`).join(', ')})`);
      fixes.push('Keep at least 10px transparent padding inside each ' + inspectResult.format.cellWidth + 'x' + inspectResult.format.cellHeight + ' cell. No body part or effect may touch the cell edge.');
    }
    if (jitter.length > 0) {
      issues.push(`Center jitter detected: ${jitter.length} cells have bbox centers offset from the average position`);
      fixes.push('Keep character/enemy scale and center stable across all frames.');
    }
    if (tooSmall.length > 0) {
      issues.push(`Too small: ${tooSmall.length} cells have very small opaque area`);
      fixes.push('Make the subject larger and readable at 64px.');
    }
    if (tooLarge.length > 0) {
      issues.push(`Too large: ${tooLarge.length} cells have opaque area filling most of the cell`);
      fixes.push('Make the subject smaller and keep safe transparent padding.');
    }
  }

  if (isIcon) {
    if (tooSmall.length > 0) {
      issues.push(`Icon subject too small — must be readable at 64px and 32px`);
      fixes.push('Center the subject in the 1024x1024 canvas. Make it clearly readable at 64px and 32px display sizes.');
    }
    if (edgeTouchCells.length > 0) {
      issues.push(`Subject touches canvas edge — must have transparent padding`);
      fixes.push('Keep transparent padding around the subject. No part may touch the canvas edge.');
    }
    fixes.push('1024x1024 px icon, transparent background, centered, no text/logo/rarity frame, no white fringe.');
  }

  if (isBg) {
    if (sizeError.length > 0) {
      issues.push('Image dimensions do not match 390x844 battle background spec');
      fixes.push('Use 390x844 px or a larger master that is crop-safe to 390x844.');
    }
    fixes.push('390x844 portrait mobile battle background. Combat readability first. No UI/text/character baked in. Dark but readable.');
  }

  if (isCutin) {
    if (sizeError.length > 0) {
      issues.push('Image dimensions do not match 1440x360 cutin spec');
      fixes.push('Use 1440x360 px canvas for horizontal wide cutin.');
    }
    fixes.push('1440x360 horizontal cutin, transparent background, character identity stable, no text/logo.');
  }

  if (sizeError.length > 0 && !isBg && !isCutin) {
    issues.push(`Sheet size mismatch: image dimensions do not match expected grid`);
    fixes.push('Use PNG RGBA with correct canvas size matching the grid specification.');
  }

  if (issues.length === 0) {
    issues.push('No technical issues detected.');
    fixes.push('No fixes required — asset passes inspection.');
  }

  const negPrompt = `- Text, letters, logos, watermarks
- Grid lines, cell borders drawn on the image
- Checkerboard background (fake transparency)
- White fringe, white outline, anti-aliasing white bleed
- Photorealistic / photo-like textures
- 3D-rendered gloss / reflections
- Blood, gore, violent expressions
- Imitation of existing IP / brand designs`;

  const outputSpec = isSpriteSheet
    ? `- **Grid:** ${inspectResult.format.columns}x${inspectResult.format.rows} / ${inspectResult.format.cellWidth}x${inspectResult.format.cellHeight}px\n- **Expected Cells:** ${inspectResult.totalCells} (filled: ${inspectResult.filledCells}, empty: ${inspectResult.emptyCells})\n- 8x6 / 180px spritesheet, PNG RGBA, transparent background`
    : isIcon
      ? `- 1024x1024 px icon, PNG RGBA, transparent background, centered, readable at 64px and 32px`
      : isBg
        ? `- 390x844 px portrait battle background, no transparency needed`
        : `- 1440x360 px horizontal cutin, PNG RGBA, transparent background`;

  const recheckSteps = isSpriteSheet
    ? `1. Load regenerated PNG into Asset Factory
2. Select asset type: ${assetType}
3. Run inspection — verify edge touch = 0, jitter within tolerance
4. Check preview with grid overlay and checkerboard mode
5. Verify 64px readability and identity consistency
6. If passing, save to library with updated review status`
    : isIcon
      ? `1. Load regenerated PNG into Asset Factory
2. Select asset type: ${assetType}
3. Verify transparent background (checkerboard mode)
4. Verify readability at 64px and 32px
5. Verify no text/logo/rarity frame/white fringe
6. If passing, save to library with updated review status`
      : isBg
        ? `1. Load regenerated PNG into Asset Factory
2. Select asset type: background
3. Verify 390x844 crop/readability
4. Check top HUD safe area
5. Check player/enemy/EXP readability
6. Verify no UI/text/character baked in
7. If passing, save to library with updated review status`
        : `1. Load regenerated PNG into Asset Factory
2. Select asset type: cutin
3. Verify size is 1440x360
4. Verify transparent background
5. Verify character identity and lantern placement
6. Verify it works as horizontal battle cutin
7. If passing, save to library with updated review status`;

  return `# Regeneration Prompt

## Detected Issues

${issues.map(i => '- ' + i).join('\n')}

## Fix Instructions

${fixes.map(f => '- ' + f).join('\n')}
- Regenerate the same asset, preserving identity and motif, fixing only the technical issues listed above.

## Original Asset Intent

- **Asset Type:** ${assetType}
- **Display Name:** ${displayName || '(unnamed)'}
- **Source File:** ${inspectResult.fileName}
${outputSpec}

## Negative Prompt

${negPrompt}

## Asset Factory Recheck Steps

${recheckSteps}`;
}

export function suggestQualityScore(inspectResult: InspectResult): number {
  const errors = inspectResult.warnings.filter(w => w.level === 'error').length;
  const warns = inspectResult.warnings.filter(w => w.level === 'warn').length;
  const edgeTouch = inspectResult.cells.filter(c => c.touchesEdge).length;

  if (errors > 0 || edgeTouch > 3) return 1;
  if (edgeTouch > 0 || warns > 10) return 2;
  if (warns > 5) return 3;
  if (warns > 0) return 4;
  return 5;
}
