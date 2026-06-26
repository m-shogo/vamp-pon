# 実画像投入 QA ガイド

AI 画像生成で作った実素材を Asset Factory に投入するときのチェックガイド。
fixture (構造テスト用) とは別に、実画像特有の問題を見つけるためのもの。

## アセットタイプ別チェック

### Enemy Spritesheet (1440x1080 / 8x6 / 180px)

**Asset Factory で見る場所:**
- 検査タブ: edge touch / empty cell / jitter / too-small / too-large
- プレビュー: グリッドオーバーレイ + 市松模様 (白漏れ確認)

**よくある失敗:**
- 白い背景が透過に見せかけて実は白ベタ塗り
- セル間でキャラのスケールが大きくばらつく (identity drift)
- 端のセルで図形がはみ出す
- 全く同じポーズが複数セルにコピーされている (アニメーション不成立)
- テキスト・ロゴ・透かしが焼き込まれている

**再生成プロンプトに入れるべき修正文:**
- "Keep consistent scale and identity across all 48 cells"
- "True alpha transparency, not white background"
- "No opaque pixel may touch cell edge — keep 10px padding"

**approved 基準:**
- edge touch = 0
- 全セルに描画あり (空セルが意図的でない限り)
- 64px で読めるシルエット
- 全セルで同一キャラクターと識別可能
- 白背景・白フリンジなし
- テキスト・ロゴなし

**rejected 基準:**
- 別のキャラクターに見える (identity drift が激しい)
- 白ベタ背景 (透過でない)
- 3セル以上で edge touch
- テキスト・ロゴ・透かし入り
- 64px で何か分からない

---

### Weapon / Item Icon (1024x1024)

**Asset Factory で見る場所:**
- プレビュー: 市松模様で透過確認
- 目視: 32px まで縮小して読めるか

**よくある失敗:**
- レアリティ枠やボーダーが焼き込まれている
- 白フリンジ (アンチエイリアスの白漏れ)
- 被写体が小さすぎてアイコンサイズで潰れる
- 装飾的なフレームが入っている
- 背景がチェッカーボードパターン (偽透過)

**再生成プロンプトに入れるべき修正文:**
- "No rarity frame or border — game UI applies these"
- "Center the subject, readable at 32px HUD icon size"
- "True alpha, no white fringe, no decorative frame"

**approved 基準:**
- 透過背景 (真のアルファ)
- 32px で識別可能なシルエット
- レアリティ枠なし
- 白フリンジなし
- Vamp Pon の世界観に合う

**rejected 基準:**
- レアリティ枠焼込み
- 白ベタ背景
- 32px で何か分からない
- 他ゲームのアイテムに見える

---

### Character Sheet (1440x1080 / 8x6 / 180px)

**Asset Factory で見る場所:**
- Enemy と同じ検査項目
- アンカータブ: head / hands / waist / feet 位置

**よくある失敗:**
- ランタンが消える (左向きフレームなど)
- カバンの位置が左右で入れ替わる
- 利き手と装備の関係が方向転換で破綻する
- ユイのアイデンティティが崩れる

**approved 基準:**
- Enemy シート基準 + ユイ固定ルール準拠
- ランタン右手・カバン左腰が全方向で維持
- ユイとして識別可能

---

### Cutin (1440x360)

**Asset Factory で見る場所:**
- サイズ確認: 1440x360
- 市松模様: 透過確認

**よくある失敗:**
- 縦長ポスター構図になっている (1440x360 は横長)
- 白ベタ背景
- キャラクターがカットインの端にしか居ない
- ランタン位置が仕様と異なる

**再生成プロンプトに入れるべき修正文:**
- "Horizontal wide composition, not poster, not vertical portrait"
- "1440x360 transparent PNG, character identity stable"

**approved 基準:**
- 1440x360 で横長構図
- 真の透過背景
- キャラクターアイデンティティ安定
- ランタン配置正しい

**rejected 基準:**
- 縦長構図
- 白ベタ背景
- キャラクターが誰か分からない

---

### Background (390x844)

**Asset Factory で見る場所:**
- サイズ確認: 390x844
- 目視: 戦闘画面として成立するか

**よくある失敗:**
- 中央がうるさくてプレイヤー/敵/EXP が沈む
- UI 要素が焼き込まれている
- キャラクターが焼き込まれている
- 明るすぎて HUD が読めない
- エンドレスランナー風のレイアウトになっている

**再生成プロンプトに入れるべき修正文:**
- "Combat readability first — player/enemy/EXP must stay visible"
- "Dark but readable, no UI/text/character baked in"
- "Not endless runner — portrait mobile battle background"

**approved 基準:**
- 390x844 で戦闘画面として成立
- プレイヤー/敵/EXP が沈まない
- UI/テキスト/キャラクター焼込みなし
- Vamp Pon の夜の世界観

**rejected 基準:**
- プレイヤーが見えなくなるほどうるさい
- UI・テキスト・キャラクター焼込み
- エンドレスランナー風

---

## Manual Issues チェックボックス

マニフェストタブの「手動チェック問題」セクションで以下をチェックできる:

| ID | 日本語 | 典型的な原因 |
|----|--------|-------------|
| white-background | 白背景 | AI が透過を白で代替 |
| checkerboard-background | チェッカーボード背景 | AI が透過を示すつもりのパターン |
| white-fringe | 白フリンジ | アンチエイリアスの白漏れ |
| identity-drift | アイデンティティずれ | セル間でキャラが変わる |
| too-noisy | 中央がうるさい | 背景の中央が派手 |
| baked-text | テキスト焼込み | ロゴ/文字が画像内 |
| wrong-size | サイズ不正 | 仕様と異なるサイズ |
| wrong-direction | 方向不正 | 左右/上下が逆 |
| lantern-missing | ランタン欠落 | ユイのランタンが消えた |
| bag-position-wrong | カバン位置不正 | ユイのカバンが逆 |
| rarity-frame-baked | レアリティ枠焼込み | アイコンに枠が入った |
| poster-composition | ポスター構図 | カットインが縦長 |
| ui-baked-in | UI焼込み | 偽UIが画像内 |

これらは自動検出が難しいため、人間の目で確認してチェックする。
チェック済みの問題はライブラリカードにバッジとして表示される。

## 推奨ワークフロー

1. Prompt Pack で生成指示を作成
2. AI に画像生成を依頼
3. 生成画像を Asset Factory に読込
4. 検査タブで自動検査
5. プレビューで市松模様 → 白背景/白フリンジを目視確認
6. マニフェストタブで手動チェック問題をチェック
7. 問題あり → needs-regeneration + 再生成プロンプト作成
8. 問題なし → approved + スコア設定
9. Approved Export で Unity Handoff JSON 出力
