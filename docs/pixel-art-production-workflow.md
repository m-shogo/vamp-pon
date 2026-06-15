# Pixel Art Production Workflow

Vamp Pon のドット絵制作ワークフロー。
目的は、AI画像・Aseprite・実装確認の役割を分け、**ダサい仮素材をfinal扱いしない**こと。

---

## 1. 役割分担

| 役割 | 使い方 | 完成素材扱い |
| --- | --- | --- |
| AI image generation | 方向性・reference作成 | しない |
| Aseprite | 実素材制作・手仕上げ | する |
| Lua scripts | bootstrap / 再現性ある土台 | 単独ではしない |
| VisualGallery | 並置比較 | 確認用 |
| combat-mock | 実戦密度確認 | 確認用 |
| docs | 基準と監査の固定 | 運用用 |

---

## 2. 正しい流れ

```txt
referenceを作る
↓
referenceの良い点を言語化する
↓
現状素材との差分を書く
↓
Aseprite sourceを作る / 直す
↓
exportする
↓
1x / 4x / 背景 / combat-mockで確認する
↓
品質ゲートで採用可否を決める
↓
docsとasset statusを更新する
```

---

## 3. やってはいけない流れ

```txt
良いドット絵にして、と頼む
↓
Luaで楕円/矩形を調整する
↓
仕様要素が入ったのでhand-finalと呼ぶ
```

これは禁止。
仕様を満たすことと、絵として良いことは別。

---

## 4. Aseprite作業の原則

- public PNGを直接手修正しない
- `.aseprite` sourceを正にする
- export経由でPNGを更新する
- レイヤーや領域をレビューしやすくする
- bootstrap scriptは土台。最終品質は手仕上げと確認で決める

---

## 5. ユイ制作フロー

1. `yui_idle_42` を reference基準で直す
2. idleだけで品質ゲートを通す
3. idleを基準に move を作る
4. moveを確認する
5. hurtを作る
6. ultimateを作る

idleが弱いまま4ポーズ展開しない。

---

## 6. 敵制作フロー

1. `ink_blob` を作る
2. `torn_paper_wisp` を作る
3. `hooded_ink_specter` を作る
4. `ink_hound` を作る
5. 4体を並べて、シルエット差と黒インクfamily感を見る
6. player / background と合わせて見る

敵は黒くしすぎると読めない。
光る目、紙片、フード、獣の輪郭で差を出す。

---

## 7. 背景制作フロー

1. referenceの良い空気感を分解する
2. ゲーム用に情報量を落とす
3. 32x32 or 64x64 tileへ落とす
4. repeatingで確認する
5. player / enemy / projectile / pickup を重ねる
6. 視認性が落ちたら背景を弱くする

背景は主役ではない。

---

## 8. commit前チェック

ドット絵関連commitでは以下を確認する。

- referenceとの差分を書いたか
- 1xで読めるか
- 4xだけで判断していないか
- gameplay定数を巻き込んでいないか
- public PNG直編集になっていないか
- `temporary` と `final-candidate` を混同していないか
- docsに未解決を書いたか

---

## 9. 完了報告テンプレ

```md
## 現状の問題

## Referenceとの差分

## 改善方針

## 実装内容

## Quality Gate

## 確認結果

## 未解決

## 次の一手
```
