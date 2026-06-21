# Aseprite Hand-Finish Workflow

Asepriteを買った意味を出すため、このrepoではAsepriteを単なる自動生成の出力先ではなく、**最終素材を手仕上げする制作ツール**として扱う。

---

## 1. 結論

`.aseprite` が存在するだけでは hand-final ではない。

hand-final candidate と呼んでよいのは、以下を満たす素材だけ。

- referenceとの差分をレビュー済み
- Aseprite sourceがある
- Aseprite上で1px単位の手仕上げを行っている
- public PNGはsourceからexportされている
- 1x / 4x / 暗背景 / combat-mockで確認済み
- quality gateで3以下がない

---

## 2. Luaの正しい役割

Luaは悪くない。
ただし、Luaは完成判断ではなく、制作補助に使う。

Luaに任せてよいもの:

- 42px / 32pxキャンバス作成
- palette固定
- レイヤー作成
- rough配置
- seed作成
- export補助
- sprite sheet出力

Luaに任せないもの:

- 顔の可愛さ
- 服の厚み
- 小物の魅力
- 背景密度の最終判断
- final-candidate判定

---

## 3. Aseprite手仕上げの定義

Aseprite手仕上げとは、以下を人間の目で調整した状態を指す。

- 顔
- 目
- 前髪
- フードの丸み
- 服の厚み
- ランタンや小物
- 敵のシルエット
- 背景ノイズ
- 1xでの読みやすさ

scriptで出力されたままの素材は `bootstrap` / `temporary` 扱い。

---

## 4. 標準フロー

```txt
referenceを見る
↓
現状素材との差分を書く
↓
既存素材に引っ張られない範囲を決める
↓
Aseprite sourceを開く/作る
↓
必要ならLuaで土台を作る
↓
Asepriteで1px単位の手仕上げをする
↓
sourceからexportする
↓
1x / 4x / 暗背景 / combat-mockで確認する
↓
quality gateを通す
↓
未解決をdocsに残す
```

---

## 5. 既存素材に引っ張られないルール

現状の `yui_idle_42` や `build-yui-42-source.lua` は、サイズ・ファイル構造・export導線の参考にはしてよい。

ただし、アート品質の基準にはしない。

新しい基準は reference art と `docs/art-direction.md`。

---

## 6. ユイ作業での適用

`yui_idle_42` を最優先にする。

- idleが品質ゲートを通るまで他ポーズに展開しない
- 顔、フード、服、ランタンを1px単位で調整する
- ランタンは `hitCore` と混ざらない位置・形にする
- 4xだけで判断せず、1xを基準にする

---

## 7. 完了報告に必ず書くこと

```md
## Aseprite Hand-Finish Check

- source:
- Lua/scriptの役割:
- 手仕上げした箇所:
- 1x確認:
- 4x確認:
- dark background確認:
- combat mock確認:
- quality gate:
- status:
```
