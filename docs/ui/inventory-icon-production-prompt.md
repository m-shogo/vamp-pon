# Inventory Icon Production Prompt

以下を画像制作担当、Aseprite作業者、コーディングエージェントへそのまま渡す。
一度に27種すべてを作らず、`TARGET_BATCH` をA〜Dのいずれかに差し替えて実行する。

---

```txt
あなたは /Users/m-shogo/Developer/personal/vamp-pon のみを対象に作業してください。
GitHub repo は https://github.com/m-shogo/vamp-pon.git です。
このrepo以外は絶対に触らないでください。

目的:
Vamp Ponの下部HUD、レベルアップ候補、入れ替え画面で使う32×32pxのインベントリアイコンを制作し、実ゲームで確認できる状態まで仕上げる。

TARGET_BATCH:
- A = 通常武器8種
- B = 忘れ物8種
- C = レアアイテム4種
- D = 進化・合体・覚醒武器7種

今回のTARGET_BATCHは「A」。

作業開始前に必ず確認する正本:
- docs/ui/inventory-icon-design-bible.md
- data/ui-assets/inventory-icon-requirements.json
- docs/visual-direction.md
- docs/sprite-size-guide.md
- docs/pixel-art-generation-prompts.md
- src/game/assets/inventoryIcons.ts
- src/game/ui/inventorySlot.ts

絶対条件:
- 1ファイル32×32px
- PNG RGBA
- 背景は完全透過
- 1ドット=1pxのネイティブ制作
- 実絵は中央28×28px以内
- 四辺2px以上の完全透明安全域
- アンチエイリアス禁止
- 画像内にスロット枠、Lv数字、文字、ロゴを描かない
- 4〜8色を基本とし、進化系でも10色以内
- 左上から弱い光、右下へ影
- 1pxの暗い輪郭
- 夜背景 #2a2747 で輪郭が消えない
- 16px、24px、32pxのすべてで主モチーフが分かる
- ネオン、魔法陣、SFビーム、巨大glow、リアル厚塗りは禁止
- 他作品の有名アイコンを模倣しない

制作方針:
1. まず対象Batch全種の白黒シルエット案を作る。
2. 24px表示で、名前を隠しても各アイコンを識別できるか確認する。
3. 輪郭が似ている物は着色前に形を修正する。
4. docs/ui/inventory-icon-design-bible.md の個別方針に従って着色する。
5. 夜背景 #2a2747 と古紙背景 #f3e9cf の両方で確認する。
6. 16pxで消える細部は増やさず削る。
7. 個別PNGとして指定パスへ出力する。
8. 台帳の対象行を planned から draft へ変更する。
9. pnpm inventory-icons:check を実行する。
10. pnpm test と pnpm build を実行する。
11. pnpm dev で実ゲームHUDを確認する。
12. 実機確認後、必要な1px手直しを行う。
13. 採用可能な物だけ status を ready へ変更する。
14. commit / pushまで行う。

TARGET_BATCH Aの対象と必須シルエット:

1. night_pencil / 夜の鉛筆
- 短い鉛筆本体、左下から右上へ斜め
- 芯先と木軸が分かる
- 線だけにしない
- path: public/assets/ui/inventory-icons/weapon/night_pencil.png

2. marble / ビー玉
- 小さな球、青灰ガラス
- 白ハイライトは1点
- 宝石や多面体にしない
- path: public/assets/ui/inventory-icons/weapon/marble.png

3. moon_bookmark / 月のしおり
- 細い短冊、先端の切れ込み、小さな月チャーム
- 斜めで動的
- 忘れ物のmoonlight_bookmarkと同じ輪郭にしない
- path: public/assets/ui/inventory-icons/weapon/moon_bookmark.png

4. black_ink_bottle / 黒インクの小瓶
- コルク付き小瓶、中の黒インク、小さな一滴
- インク染みだけにしない
- 毒瓶やポーション瓶にしない
- path: public/assets/ui/inventory-icons/weapon/black_ink_bottle.png

5. stardust_shot / 星くず弾
- 金色の主星1つと小粒2つ
- 宇宙背景や巨大な五芒星にしない
- path: public/assets/ui/inventory-icons/weapon/stardust_shot.png

6. postcard_blade / 絵はがきカッター
- 長方形の紙片、片端だけ鋭い
- 旅先色は小面積
- 金属ナイフにしない
- path: public/assets/ui/inventory-icons/weapon/postcard_blade.png

7. paper_airplane / 紙ひこうき
- クリーム紙の三角形、折り目2本
- 戦闘機、鳥の羽、ジェット炎にしない
- path: public/assets/ui/inventory-icons/weapon/paper_airplane.png

8. streetlamp_ring / 街灯の輪
- 小型街灯の灯部と足元の小さな暖光リング
- 光る円だけにしない
- ネオンリングにしない
- path: public/assets/ui/inventory-icons/weapon/streetlamp_ring.png

レビュー用出力:
- 個別PNGが正本
- 追加で確認用ボードを作ってよい
- 確認用ボードは8列×1行、1セル32×32、全体256×32px
- ボード内へ文字やラベルを描かない
- ボードは production asset として扱わない

機械検査:
- 各PNGが32×32である
- RGBAである
- alpha=0の背景を持つ
- 四辺2px以内に非透明ピクセルがない
- 対象ファイル数がBatch定義と一致する
- 台帳のstatus=readyならファイルが必ず存在する

実機レビュー項目:
- 画面下の固定スロットで中央に収まる
- 右下のレベルバッジと主モチーフが重ならない
- 5個並んでも同じ形に見えない
- 夜背景で輪郭が消えない
- 24px表示で名称なしに識別できる
- 仮の弾画像よりインベントリの道具として分かりやすい

禁止される完了報告:
- 「生成しました」だけで完了扱いしない
- 画像サイズ、透過、安全域、実機確認、テスト結果を省略しない
- 生成画像を確認せずreadyにしない
- 元画像を勝手に縮小・補間して32px化しない

完了報告に必ず含める:
- 作成した全ファイル
- 各ファイルの32×32 / RGBA / 安全域検査結果
- draftとreadyの内訳
- 実ゲームHUDで見つけた修正点と実施内容
- pnpm inventory-icons:check の結果
- pnpm test の結果
- pnpm build の結果
- commit SHA
- push先branch
```

---

## Batch差し替え

### Batch B: 忘れ物8

```txt
gold_compass
travel_badge
moonlight_bookmark
old_ticket
white_margin
pressed_flower
loose_map_pin
small_alarm_clock
```

忘れ物は武器より静的。正面または軽い斜め。glowは原則なし。
生活物としての擦れ、折れ、ひび、乾きを1要素だけ残す。

### Batch C: レア4

```txt
name_tag
cracked_lens
sealed_letter
wind_mark
```

金色でレア感を説明しない。物語モチーフで通常アイテムとの差を出す。

### Batch D: 進化・合体・覚醒7

```txt
unfinished_line
north_star_lantern
dawn_ink_lamp
unforgotten_name
memory_marble
addressless_blade
tailwind_plane
```

元武器のシルエットと角度を残し、追加モチーフで系譜を示す。
別の神器や魔法アイテムへ作り替えない。
