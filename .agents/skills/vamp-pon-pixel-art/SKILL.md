# Vamp Pon Pixel Art Skill

このSkillは Vamp Pon の pixel art 作業時だけ使う。
目的は「素材を作ること」ではなく、**低品質素材を通さないこと**。

---

## When to use

以下の作業では必ず使う。

- player sprite 改善
- enemy sprite 改善
- pickup sprite 改善
- background / tile 改善
- UI card / HUD visual 改善
- props / effects 改善
- asset status / visual gallery の品質判定
- reference art の追加・整理

---

## Required craft docs

作業開始前に、まず汎用ドット絵基礎ルールを読む。

- `docs/pixel-art/README.md`
- `docs/pixel-art/human-character-craft-guide.md`
- `docs/pixel-art/ng-patterns.md`
- `docs/pixel-art/agent-quality-brief.md`
- `docs/pixel-art/research-notes.md`

これらはユイ専用ではなく、player / enemy / pickup / UI / props / background / effects 全体に適用する。

---

## Core rules

1. generic pixel-art craft docs を読む
2. reference を確認する
3. 現状素材との差分を言語化する
4. 汎用NGに該当する点を列挙する
5. 1x可読性を最優先にする
6. 生成スクリプトだけで完成扱いしない
7. Aseprite source → export → gallery確認を必須にする
8. 微妙なら final-candidate と呼ばない
9. gameplay定数を巻き込まない

---

## Workflow

```txt
craft docs確認
↓
reference確認
↓
現状素材の棚卸し
↓
問題点を書く
↓
汎用NGとの照合
↓
referenceとの差分を書く
↓
改善案を決める
↓
draft/prototypeで作業
↓
sourceを修正
↓
export
↓
1x / 4x / 暗背景 / combat-mockで確認
↓
quality gate判定
↓
docs更新
```

---

## Quality gate

以下を5段階評価する。

Common:

- 1x可読性
- role clarity
- visual appeal
- ゲーム中視認性
- 背景との分離
- 同一画風
- final候補としての自信

For player / mascot-level assets:

- 魅力
- mascot silhouette
- merchandise potential

**3以下がある場合は final-candidate にしない。**

---

## Craft checks

毎回以下を確認する。

- silhouette: 黒塗りでも役割が読めるか
- focal point: 見る場所が1つに絞れているか
- clusters: 1pxノイズではなく面で読めるか
- palette: 明度差が足りているか
- outline: 強すぎないか
- props/effects: 本体や役割と接続しているか
- scale: 1xだけ/4xだけ良い状態になっていないか
- gameplay: hitCore / pickup / enemy / glow と混ざらないか

---

## Reference handling

AI生成画像は完成素材ではない。

- 良い点を抽出する
- サイズに合わせて要素を減らす
- Asepriteでドットとして手仕上げする
- 1xで読めるまで採用しない

---

## Script handling

Scripts may help with:

- canvas setup
- palette setup
- layer setup
- deterministic export
- sprite sheet / GIF preview generation
- contact sheets
- dark background previews

Scripts must not decide:

- final visual appeal
- final silhouette
- final palette balance
- final prop appeal
- final background density
- final-candidate status

---

## Forbidden

- public PNG 直接手修正
- AI画像の縮小だけで完成扱い
- Lua / script 図形生成だけでfinal扱い
- referenceから離れた勝手な再解釈
- 黒いだけの敵
- 綺麗だが邪魔な背景
- poseごとの別人化
- 3以下の評価がある素材をfinal扱い
- before/afterが弱いのに改善扱い
- reportだけ立派で実物が変わっていない状態

---

## Required docs

作業時は以下を確認する。

- `AGENTS.md`
- `docs/pixel-art/README.md`
- `docs/pixel-art/human-character-craft-guide.md`
- `docs/pixel-art/ng-patterns.md`
- `docs/pixel-art/agent-quality-brief.md`
- `docs/art-direction.md`
- `docs/reference-art-map.md`
- `docs/pixel-art-quality-gate.md`
- `docs/asset-quality-audit.md`
- `docs/pixel-art-production-workflow.md`
