# Pixel Art Craft Guides

Vamp Pon の全ドット絵制作で参照する基礎ノウハウ集です。

対象は player だけではありません。

- player characters
- enemies
- pickups
- UI icons
- paper/map props
- background tiles
- effects

## 読む順番

1. `docs/pixel-art/human-character-craft-guide.md`
   - 人物・小型キャラの比率、顔、髪、服、小物、シルエットの考え方。
2. `docs/pixel-art/ng-patterns.md`
   - 低品質化しやすい汎用NG例と修正方針。
3. `docs/pixel-art/agent-quality-brief.md`
   - Claude / Codex に守らせる作業ルール。
4. `docs/pixel-art/research-notes.md`
   - 調査メモと参照元。
5. `docs/pixel-art/vamp-pon-pixel-art-pipeline-v1.md`
   - 制作基盤（運用レイヤー）。人間ルート（player/主役級の手仕上げ・最終レビュー）と
     procedural ルート（量産・基礎底上げ）の分離、asset status、production昇格条件、recipe/finisher/quality gate。

## 目的

- 低品質なscript素材を production に入れない。
- `読めるだけ` ではなく、`見た目に残るドット絵` を作る。
- 1x gameplay readability と 4x/6x visual appeal の両方を満たす。
- キャラ・敵・アイテム・UI・背景で、同じ世界観と同じ品質基準を使う。

## このdocsの立ち位置

個別キャラのデザイン仕様ではなく、全体の制作作法です。
固有キャラの名前や色は、必要な場合だけ例として扱います。
