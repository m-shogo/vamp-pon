# Player (ユイ) Docs

ユイを「Vamp Pon の顔として長く愛されるIPキャラ」にするための設計・ハンドオフ文書群。

これらは設計書であり、sprite 完成判定ではない。
script 生成だけ / この文書だけで sprite を完成扱いにしないこと。

## 文書

- [yui-52px-master-design.md](yui-52px-master-design.md) — 52px master の IP核 / 比率 / 色 / NG / サイズ役割
- [yui-merchandise-character-checklist.md](yui-merchandise-character-checklist.md) — アクキー/ステッカー/ぬいぐるみ/スタンプ視点の IP採点（5段階）
- [yui-aseprite-gui-handoff.md](yui-aseprite-gui-handoff.md) — Aseprite GUI で手仕上げする人向けの具体手順
- [../reviews/yui-next-production-readiness-plan.md](../reviews/yui-next-production-readiness-plan.md) — production 反映の必須条件
- [../reviews/yui-idle-production-revert-note.md](../reviews/yui-idle-production-revert-note.md) — 失敗例 c10e6c0 の記録

## 進め方

1. master-design で方針を固定
2. gui-handoff で 52px master を GUI 手仕上げ
3. merchandise-checklist と pixel-art-quality-gate で採点
4. readiness-plan のゲートを全て満たすまで production に入れない
