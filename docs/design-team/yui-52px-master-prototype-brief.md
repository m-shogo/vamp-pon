# Yui 52px Master Prototype Brief

status: prototype brief（production briefではない）
date: 2026-06-15
対象: `yui_idle` 52px master の方向性決定（A/B/C比較用）

---

## 0. このbriefの位置づけ

このdocは「ユイを作品全体のビジュアル基準にする」ための最初の一歩。

ここで作るのは **52px master の prototype と方向性比較** であって、production sprite ではない。

絶対条件:

- production sprite / production .aseprite source / gameplay定数は触らない
- 80点未満を `final-candidate` / `hand-final` / `final` と呼ばない
- Lua図形生成だけのものは prototype 止まり（[pixel-art-quality-gate](../pixel-art-quality-gate.md)）
- 今回の final decision は基本 `iterate`

参照した実在docs:

- [114-yui-asa-character-bible](../114-yui-asa-character-bible.md)
- [112-memory-loop-story-bible](../112-memory-loop-story-bible.md)（世界観）
- [pixel-art-quality-gate](../pixel-art-quality-gate.md)
- [reviews/yui-idle-production-revert-note](../reviews/yui-idle-production-revert-note.md)（v5「青いキノコ」失敗の教訓）
- `CLAUDE.md` sec.5 ユイ基準

> 注: ユーザー指示が参照していた `docs/168` / `169` / `170` / `173` / `docs/design-team/*` /
> `docs/pixel-art/*` / `docs/story-map/*` は現状repoに存在しない（doc番号は147まで）。
> 上記の実在する等価docsを基準にした。詳細は完了報告参照。

---

## 1. なぜ 52px master か

現行 production は 42px。42px の idle は revert note の通り「青いキノコ」問題で production 不採用になっている。

52px にする狙い:

- 顔・目・前髪・服の厚み・ランタンの「手で持っている感」に割けるpixel予算を増やす
- 1x可読性とcharmを両立させやすくする
- master を 52px で固め、そこから他pose / 他サイズへ派生させる

52px は **master（基準原画）** であり、ゲーム内表示サイズ（visualSize）とは別物。
visualSize / radius / hp 等の gameplay定数は今回も一切触らない。

---

## 2. ユイ固定アイデンティティ（master要件）

[114](../114-yui-asa-character-bible.md) と CLAUDE.md sec.5 より、52px master でも必ず保持:

- 丸く大きい **青フード**（ただし「きのこ/帽子」に見せない＝冠部を締める）
- **茶赤の前髪**（額にフリンジ、顔の左右にも少し）
- 大きめで可愛い顔、潰れない
- **白ハイライト入りの目**
- ほんのり頬
- 生成り〜古紙色の服、**服の厚み**（裾バンド）
- **右手側ランタン**＝記憶を読み直す火の精霊の灯り
- ランタン光は敵・欠片・hitCore と混ざらない
- 体がただの三角形にならない（台形＋腕で「立っている子」に）
- 柔らかい陰影 / 強すぎないアウトライン

物語的固定（[114](../114-yui-asa-character-bible.md)）:

- ランタンは「殺す炎」ではなく「間違った読みをほどく灯り」
- ユイは戦う子ではなく、持ち主を間違えない子
- → 攻撃的・戦闘的ポーズにしない。守る/読む空気を残す

---

## 3. A/B/C の役割分担

3案は**必ず別物**として作る。1案の微調整ではなく、優先軸を変える。

### A: silhouette-first
小さい画面で一瞬で「ユイだ」と分かることを最優先。
青フード・顔・ランタン・体の重心・輪郭を最も強くする。
- 太めアウトライン（2px相当）
- フード最大・最高コントラスト
- ランタンの core を明るく

### B: charm-first
キャラとして可愛い・愛着が湧くことを最優先。
表情・前髪・服・ランタンの持ち方・「少し不安だけど優しい」空気を強くする。
- 顔と目を大きく、ダブルキャッチライト
- 頬を強め、口を小さく柔らかく
- フードを少し締めてmushroom回避
- ランタンを体寄りに

### C: gameplay-first
スマホ縦画面のプレイ中に見失わないことを最優先。
背景・敵・欠片と混ざらず、1xでHP位置・当たり判定中心・ランタン位置が読める。
- フード左上にリムライト（暗背景分離）
- ランタン glow を最小に閉じ込める（pickupと混ざらせない）
- ランタンを中心 hitCore から最も離す（中心の読みを確保）
- 余計な微細ディテールを減らし1xで消えない要素に絞る

---

## 4. 品質条件（master最低ライン）

[pixel-art-quality-gate](../pixel-art-quality-gate.md) の7軸に加え、master固有:

- 1xでユイと分かる / 青フードが読める / 茶前髪が読める
- 顔が潰れない / ランタンが右側に読める / ランタン光が敵・欠片と混ざらない
- 体が三角形にならない / 4xでcharmがある / 縦スマホ暗背景で埋もれない
- 既存Vamp Pon世界観から浮かない

NG（即減点）:

- 髪色だけの差別化 / ランタンがただの黄色点 / フードがきのこ・帽子
- 顔が無表情の点 / 服がただの三角 / ランタン光で弱いドット誤魔化し
- 32pxの情報量を引き伸ばしただけ / 生成画像そのまま本番 / 80点未満をfinal

---

## 5. 成果物

- source: `assets/source/prototypes/yui_idle_52_{A,B,C}.aseprite`
- png: `public/assets/prototypes/yui_idle_52_{A,B,C}.png`
- review sheet: `public/assets/prototypes/yui_idle_52_review_sheet.png`（1x + 6x / 夜背景）
- generator: `scripts/prototypes/build-yui-52-master.lua`（variant=A/B/C）
- review: [docs/reviews/design-team/yui-52px-master-abc-review.md](../reviews/design-team/yui-52px-master-abc-review.md)

すべて prototype。production への昇格は、合成v2 → GUI手仕上げ → 80点rubric通過 の後にのみ検討する。
