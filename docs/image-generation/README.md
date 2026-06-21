# Image Generation Entry Point

Vamp Pon の画像生成依頼で最初に読む入口。

## Current temporary default

当面、画像生成の元素材は **1素材 = 180×180px** を基本単位にする。

- キャラクター、敵、武器、アイテム、UIアイコン、カットイン元絵は 180×180px
- 背景は 180×180px のシームレスタイル
- 複数素材をまとめる場合も、1セル180×180pxで構成する
- 絵の品質と参照画像への忠実さを最優先する
- 長大な仕様を画像生成プロンプトへ詰め込みすぎない
- 配置、切り出し、縮小、runtime接続、機械検査は生成後の別工程とする

これは暫定運用であり、永久仕様ではない。

## Category rules

- 敵: `docs/enemies/README.md`
- 背景: `docs/image-generation/background-rules.md`
- 必殺技・暴走・HUDアイコン・カットイン: `docs/image-generation/cutin-icon-rules.md`
- ChatGPTへ投げる短いテンプレ: `docs/image-generation/chatgpt-template.md`
- 暴走モード仕様案: `docs/berserk-mode-draft.md`

## Prompt policy

画像生成では以下を優先する。

1. 承認済み参照画像
2. 今回作る対象の短い視覚説明
3. 180×180px単位
4. 透過、はみ出し、背景有無などの最低限の契約

repoの正本は制作側が読み、画像生成に必要な視覚要点だけを短く抽出する。
ユーザーへ毎回長いテンプレを再入力させない。

## Asset packaging policy

生成画像を見ただけで、RGBA、alpha 0、セル数、safe border、overflow 0、PASSを宣言しない。
実ファイルをスクリプトで検査した結果だけを報告する。

横長カットインやHUD表示は、180×180pxの元絵をruntime側で切り抜き・拡大・紙帯・インク演出と合成する。
画像生成時点で横長完成画面を作る必要はない。
