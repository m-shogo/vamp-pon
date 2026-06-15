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
- asset status / visual gallery の品質判定
- reference art の追加・整理

---

## Core rules

1. reference を確認する
2. 現状素材との差分を言語化する
3. 1x可読性を最優先にする
4. 生成スクリプトだけで完成扱いしない
5. Aseprite source → export → gallery確認を必須にする
6. 微妙なら final-candidate と呼ばない
7. gameplay定数を巻き込まない

---

## Workflow

```txt
reference確認
↓
現状素材の棚卸し
↓
問題点を書く
↓
referenceとの差分を書く
↓
改善案を決める
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

- 1x可読性
- reference一致
- 魅力
- ゲーム中視認性
- 背景との分離
- 同一画風
- final候補としての自信

**3以下がある場合は final-candidate にしない。**

---

## Reference handling

AI生成画像は完成素材ではない。

- 良い点を抽出する
- サイズに合わせて要素を減らす
- Asepriteでドットとして手仕上げする
- 1xで読めるまで採用しない

---

## Forbidden

- public PNG 直接手修正
- AI画像の縮小だけで完成扱い
- Lua図形生成だけでfinal扱い
- referenceから離れた勝手な再解釈
- 黒いだけの敵
- 綺麗だが邪魔な背景
- poseごとの別人化
- 3以下の評価がある素材をfinal扱い

---

## Required docs

作業時は以下を確認する。

- `CLAUDE.md`
- `docs/art-direction.md`
- `docs/reference-art-map.md`
- `docs/pixel-art-quality-gate.md`
- `docs/asset-quality-audit.md`
- `docs/pixel-art-production-workflow.md`
