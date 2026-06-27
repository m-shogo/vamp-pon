# Current Canon Index

## 目的

Vamp Ponの現行正史を一枚にまとめる。
実装・シナリオ・UI・アセット作成で迷った時は、この文書と `docs/181-current-production-canon.md` を最優先する。

古い検討メモと矛盾した時は、以下の順に優先する。

1. `docs/181-current-production-canon.md`
2. `docs/180-unified-character-canon.md`
3. `docs/design/world-labels.md`
4. `docs/design/character-production-plans.md`
5. `docs/design/emblem-canon.md`
6. `docs/design/az-emblem-canon.md`
7. `src/game/data/*` の正本データ

---

# 0. 実装前の固定事項

実装時にブレさせない。

```txt
P1はユイ基準。
Core5は設計・データ正本あり。ただし、全員を一気に本番プレイアブル化しない。
きずな/2人選択/恋愛/次世代/重い関係はP1に入れない。
ただし、将来拡張できる命名とデータ構造にする。
```

P1で必要な表現:

```txt
影を払う
記憶片を拾う
朝まで残る
ゲームオーバーは死亡ではなく読み筋失敗
```

P1で不要な表現:

```txt
友情ポイント
2人選択
コンビ必殺
恋愛イベント
次世代Seedの説明
50Stage全体説明
```

---

# 1. 世界法則

```txt
黒インク = 間違った意味を固定するもの
記憶片 = 固定から剥がれた意味片
朝 = その夜にほどけた意味の確定処理
ゲームオーバー = その夜の仮接続が黒インクに固定し直されること
再戦 = 未確定ページを別の読み順で開くこと
```

---

# 2. 主人公

```txt
ユイ = 持ち主を間違えない子
```

ユイは、ただ拾う子ではない。

```txt
黒インクで名前・場所・理由が読めなくなっても、
それが誰のものだったかだけは間違えない。
```

P1実装上は、以下で表現する。

```txt
記憶片を拾う
記憶片がユイへ寄る
小物に近づくと光る
```

---

# 3. ユイとアサ

```txt
公式恋愛ではない。
恋愛ラベルの外にある強い関係。
```

軸:

```txt
運命共同体
自己肯定
名前をめぐる相互救済
悲劇の読み替えを一緒にする関係
```

実装上の注意:

```txt
P1ではアサを主役級に出しすぎない。
出すとしても名前・名札・筆跡のSeedまで。
Core5展開時はアサを名づけ担当として段階導入する。
```

---

# 4. 恋愛/友情方針

```txt
友情 = メイン
恋愛 = サブ/別ページ束
重い関係 = サブ/後作/隠しページ
男同士 = 公式恋愛にしない。相棒/悪友/ライバル/兄弟的関係にする
百合 = サブや別ページ束なら可。ユイ/アサを公式百合にはしない
```

実装上の注意:

```txt
P1に恋愛・友情システムは入れない。
P2以降のデータ拡張を妨げない命名にする。
```

---

# 5. きずなシステム

```txt
きずな = 意味の接続安定度
```

```txt
接続が安定している = 安定して強い
接続が不安定 = 上振れが大きいが、下振れもある
```

仲が悪い関係は弱いのではない。

```txt
強いが、ほどけやすい。
```

実装上の注意:

```txt
P1では入れない。
将来的に bond / connection / pairSkill / pairLightArt を足せる余地だけ残す。
```

---

# 6. 現在の用語正本

| Target | Label |
| --- | --- |
| Base character art | 灯技 |
| Evolved character art | 継灯 |
| Decisive character art | 暁灯 |
| Kokuyou form | 黒耀化 |
| Kokuyou backlash | 煤返り |
| Kokuyou gauge | 黒耀瓶 |
| Weapon / active item | 灯具 |
| Passive | 持ち物 |
| Rare item | 忘れ物 |
| Field drop | 落とし物 |
| Currency / fragment | 記憶片 |
| Upgrade | 灯継ぎ |
| Awakening | 暁開き |
| Fusion / pair art | 灯合わせ |
| Collection | 灯録 |
| Achievement | 記憶のしるし |
| Result | 旅の記録 |
| Stage clear | 夜明け |
| Emblem device | 灯紋具 |
| Character emblem | 灯紋 |
| A-Z emblem series | A-Z灯紋 |

---

# 7. キャラ量産の採用条件

関係性・小物・キャラを採用する条件:

```txt
小物にできる
黒インクの誤解固定にできる
ゲーム効果にできる
回収後に意味が反転する
恋愛以外にも読める
灯紋に圧縮できる
グッズ化できる
```

新キャラは名前だけで採用しない。
最低限、次を持つ。

```txt
初期灯具
持ち物
忘れ物
灯技
継灯
暁灯
灯継ぎ
暁開き
黒耀化副題
黒耀化の歪み
灯合わせ候補
A-Z灯紋
素材キーワード
グッズ展開フック
```

---

# 8. A-Z灯紋

```txt
A-Z灯紋 = キャラの持ち物・核動詞・黒耀化の歪み・グッズ展開を1つに圧縮する紋章システム。
```

表示名:

```txt
灯紋具 = 共通デバイス
灯紋 = 通常キャラ紋章
無紋 = 未解放
暁紋 = 暁灯/暁開き後
黒紋 = 黒耀化中
双灯紋 = 灯合わせ
```

画像ルール:

```txt
文字を焼かない
AZコードを焼かない
キャラ名を焼かない
1画像1エンブレム
UI textで名前・コード・ラベルを出す
```

---

# 9. 長期展開

```txt
1本だけで完結する。
でも、世界の前提はすべて説明されない。
シリーズを追うと、前作で見えていた小物や違和感の意味が変わる。
```

続編予告ではなく、再読Seedを置く。

実装上の注意:

```txt
P1で続編匂わせUIは不要。
背景や小物にSeedを置く余地だけ残す。
```

---

# 10. 無理なく採用するバズSeed

Season 1でSeedとして置けるもの:

```txt
未配達の封筒
折り目の違う紙片
片目のボタン
同点のスコアカード
毎年同じ日付の手紙
知らない綴じ糸
A-Z灯紋の未解放枠
```

Season 1で主題化するもの:

```txt
名札
箱
切符
ランタン
灯紋具
```

実装上の注意:

```txt
P1ではSeedを詰め込まない。
背景アセットやドロップアイテム名で後から追加できるようにする。
```

---

# 11. 優先参照ドキュメント

現行正史として優先する。

```txt
181-current-production-canon.md
180-unified-character-canon.md
design/world-labels.md
design/item-and-character-production-canon.md
design/character-production-plans.md
design/emblem-canon.md
design/az-emblem-canon.md
prompts/az-emblem-asset-prompts.md
130-season-1-truth-map.md
131-long-term-scenario-architecture.md
132-50-stage-20-character-connection-rail.md
133-world-logic-and-story-consistency.md
134-why-first-scenario-design-rules.md
135-causal-scenario-logic.md
136-game-over-retry-and-revival-logic.md
137-next-generation-sequel-architecture.md
138-relationship-romance-safety-architecture.md
139-friendship-romance-and-bond-system.md
140-unstable-bond-and-variance-system.md
141-emotional-relationship-archetype-catalog.md
142-natural-buzz-seed-adoption-plan.md
143-current-canon-index.md
```

---

# 12. 実装で使う言葉

P1のUI/ログ/変数名で使ってよい言葉。

```txt
memory_fragment
ink_shadow
night_pencil
morning
survive_until_morning
kokuyou
dawn_light
lamp_art
inherited_light
emblem
az_emblem
game_over_as_unread_night
```

表示文候補:

```txt
朝まで残る
記憶片
夜にのまれた
この読み方では、朝まで残れなかった
灯を継ぐ
旅の記録
```

避ける言葉:

```txt
死亡
蘇生
恋愛ルート
好感度
記憶復活
浄化だけ
必殺技
暴走
強化石
魔石
```

---

# 13. 最重要

Vamp Ponは、関係性や設定を盛るゲームではない。

```txt
小物だけ見て気になる。
遊ぶと意味が変わる。
後から考察したくなる。
スクショで共有したくなる。
グッズにしても意味が残る。
```

これを守る。
