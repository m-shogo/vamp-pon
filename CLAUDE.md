# CLAUDE.md

このファイルは `vamp-pon` repo における Claude Code / Fable / 各種AIエージェント向けの恒久指示です。

対象repo:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

**このrepo以外は絶対に触らないこと。**

---

## 0. 最優先方針

このrepoでは、ドット絵素材を「それっぽく作る」ではなく、**ゲーム実装に耐える可読性・同一世界観・量産可能な運用**を重視する。

特に player / enemies / pickups / tiles / ui / background / effects のドット絵作業では、毎回以下を守ること。

1. **汎用ドット絵基礎ルールを先に読む**
2. **参考から離れない**
3. **1x実寸で読めることを最優先**
4. **同一人物・同一ファミリー・同一世界観・同一ライティングを維持する**
5. **見た目改善でゲームバランス定数を巻き込まない**
6. **public PNG 直編集ではなく source → export の運用を守る**
7. **毎回、問題点 → 差分 → 改善方針 → 実装 → 確認 の順で進める**
8. **微妙な素材を hand-final / final-candidate と呼ばない**

---

## 1. Pixel Art Director と汎用craft docsを必ず通す

ドット絵関連の作業では、`.claude/agents/pixel-art-director.md` と `.claude/skills/vamp-pon-pixel-art/SKILL.md` の内容を参照すること。

さらに、以下の汎用ドット絵基礎docsを必ず読むこと。

- `docs/pixel-art/README.md`
- `docs/pixel-art/human-character-craft-guide.md`
- `docs/pixel-art/ng-patterns.md`
- `docs/pixel-art/agent-quality-brief.md`
- `docs/pixel-art/research-notes.md`

これらはユイ専用ではなく、player / enemy / pickup / UI / props / background / effects 全体に適用する基礎ルール。

Claude Code / Fable の環境で `.claude` が自動読込されない場合でも、この `CLAUDE.md` と `docs/pixel-art/` の方針を常時ルールとして扱う。

Pixel Art Director の役割:

- 汎用NGに該当しないか確認する
- referenceとの差分を言語化する
- 現状素材を `keep / temporary / remake / final-candidate` に分類する
- 1x / 4x / 暗背景 / combat-mock の品質ゲートを通す
- 微妙なら採用しない
- 「仕様は満たすがダサい」を検出する
- commit前に未解決を明記する

---

## 2. 公式アート基準

このrepoの新しい基準は **soft painterly pixel art**。

目指すもの:

- 1xで読める
- 高密度だが濁らない
- かわいいがゲーム中で見やすい
- 役割がシルエットで分かる
- focal point がある
- cluster が整理されている
- 柔らかい陰影
- 強すぎないアウトライン
- 暗背景でも埋もれない
- player / enemies / pickups / UI / background / effects で画風を統一する

避けるもの:

- Luaの楕円・矩形・領域塗りだけで作った記号ドット
- 情報量だけ増えて読みにくい素材
- 1pxノイズが多い素材
- アンチエイリアス的に濁った素材
- 4xでは良いが1xで読めない素材
- 黒いだけの敵
- 綺麗だがゲームを邪魔する背景
- AI生成画像をそのまま縮小しただけの素材
- 報告だけ立派でbefore/afterが弱い素材

---

## 3. AI画像とAsepriteの役割分担

AI生成画像は **完成素材ではなく reference** として扱う。

- AI画像: 方向性、画風、色、密度、シルエットの参照
- Aseprite: 42px / 52px / 32px / tile 単位の実素材制作、手仕上げ、export
- scripts: canvas / palette / layer / export / sprite sheet / preview 補助
- VisualGallery / combat-mock: 1x・実背景・実戦密度の確認

重要:

- AI画像をそのまま縮小して完成素材扱いしない。
- Luaやscriptの図形生成だけで final-candidate を名乗らない。
- 参考絵との差分をレビューしてから、Asepriteでゲーム用ドットに落とす。
- scriptは final visual appeal / final silhouette / palette balance / prop appeal / background density を判断しない。

---

## 4. 品質ゲート

素材ごとに以下を5段階で自己評価する。

共通:

- 1x可読性
- role clarity
- visual appeal
- ゲーム中視認性
- 背景との分離
- 同一画風
- final候補としての自信

主役級・マスコット級:

- 可愛さ / 魅力
- mascot silhouette
- merchandise potential

**3以下が1つでもある素材は final-candidate にしない。**

評価結果は必要に応じて `docs/pixel-art-quality-gate.md` または作業報告に残す。

---

## 5. ユイ基準

ユイは player asset の最優先対象。ただしユイ専用ルールは、`docs/pixel-art/` の汎用ドット絵基礎ルールの上に乗せる。

ユイは以下を固定アイデンティティとして扱う。

- 丸く大きい青フード
- 茶赤の前髪
- 大きめで可愛い顔
- 白ハイライト入りの目
- ほんのり頬
- 生成り〜古紙色の服
- 服の厚み
- 右手側ランタン
- ランタンは `hitCore` と誤認しない
- front / back / side で同一人物性を保つ
- 柔らかい陰影
- 強すぎないアウトライン

ポーズ展開の順番:

1. `yui_idle_42` または明示された `yui_master_52`
2. `yui_move_42`
3. `yui_hurt_42`
4. `yui_ultimate_42`

**idle / master が弱いまま他ポーズへ進まないこと。**

---

## 6. 敵基準

黒インク敵は、黒いだけで終わらせない。
以下4系統を基本ファミリーとして扱う。

- `ink_blob`: 小型。低HP・群れ。黒インク溜まり + 光る目。
- `torn_paper_wisp`: 紙片。中距離・浮遊。破れ紙 + インク縁 + 光る目。
- `hooded_ink_specter`: 中型。圧力役。フード影 + 小さな光。
- `ink_hound`: 高速。横方向圧力。インク犬 / 影獣。

敵の品質基準:

- シルエットで種類が分かる
- 目 / 小物 / 形で見分けられる
- プレイヤーと混ざらない
- 背景に沈まない
- 黒インク family として統一されている
- `dominant blob shape` で止まらない

---

## 7. 背景基準

背景は「綺麗な一枚絵」ではなく、ゲーム背景として設計する。

- 低コントラスト
- 装飾控えめ
- キャラ / 敵 / 弾 / 欠片を邪魔しない
- 夜街、紙、地図線、忘れ物を薄く入れる
- tile化前提で考える
- 32x32 or 64x64 tile 基準
- repeating 時に目立つ線や明部を作りすぎない

背景は `pretty but noisy` より `subtle but playable` を優先する。

---

## 8. プレイ仕様を巻き込まないルール

ドット絵改善で、以下は原則変更禁止。

- `PLAYER_DEFAULTS.radius`
- `PLAYER_DEFAULTS.hp`
- `PLAYER_DEFAULTS.moveSpeed`
- `PLAYER_DEFAULTS.invulnSec`
- pickup の `collectRadius`
- pickup の `magnetRange`
- pickup の `magnetSpeed`
- `hitCore`
- `debugHitCircle`

`visualSize` は、見た目サイズ検討の明示タスク時のみ変更可。
それ以外では勝手に変えないこと。

---

## 9. ドット絵作業の標準手順

毎回この順で進める。

1. `docs/pixel-art/` の汎用基礎ルールを読む
2. 対象ファイルを棚卸しする
3. 現状の問題点を具体的に書く
4. 汎用NGに該当する点を列挙する
5. referenceとの差分を言語化する
6. 改善方針を短く決める
7. draft/prototypeで作業する
8. sourceを修正する
9. exportする
10. 1x / 4x / 実背景 / combat-mockで確認する
11. 品質ゲートで採用可否を判断する
12. docs / status を更新する
13. 未解決を報告する

---

## 10. 迷った時の判断基準

迷ったら以下を優先する。

1. 1xで読める方
2. 役割が明確な方
3. シルエットが強い方
4. referenceに近い方
5. 同一人物 / 同一ファミリーに見える方
6. プレイ中に見やすい方
7. 情報量が少なくても整理された方

「凝っているが読みにくい」より、**シンプルだが伝わる**方を採用すること。
