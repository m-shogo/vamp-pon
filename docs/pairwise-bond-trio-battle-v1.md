# Current21 Pairwise Bond / Trio Battle v1

Status: CONTENT ARCHITECTURE / RUNTIME GATED

## 1. 結論

戦闘は **異なる3人を選択**する予定。
好感度はParty単位ではなく、**個人同士**で持つ。

Current21なら:

- 全pair = 21C2 = **210**
- 向き付きAffinity = 210 × 2 = **420**
- 3人編成 = 21C3 = **1330** 通り
- 1Partyが参照するpair = AB / AC / BC の **3本**
- 1Partyが参照する向き付きAffinity = **6方向**

## 2. BondとAffinityを分ける

### shared Bond

二人で積んだ歴史・信頼・一緒に越えた夜。
Pairに1つ。

### directed Affinity

AがBをどう思っているか。
A→BとB→Aは別。

これにより:

- 片想い
- 一方だけ先に信頼
- 尊敬されているが本人は距離を取る
- 兄は心配しすぎ、妹はもう対等だと思っている

を表現できる。

**A→Bが高いからB→Aも自動上昇**にはしない。

## 3. Featured24と残り186

既存24 relationは捨てない。

- Featured24 = 専用arc / 専用呼称 / 専用gameplay payoffを持つ濃い関係
- Baseline186 = 全員と最低限Bond/Affinityを蓄積できる通常関係

全210を同じ密度で手書きしない。
ただし残り186も「好感度が存在しない」にはしない。

Featured24外では、専用呼称を勝手に捏造しない代わりに:

- 名前を呼ぶ頻度
- 依頼か命令か
- 助けを受けた時の反応
- 任せるか
- 弱音
- 冗談
- 無言の連携

をgeneric progressive registerで変える。

## 4. 3人戦闘

例: ユイ / アサ / ナギ

参照するのは:

- ユイ ↔ アサ
- ユイ ↔ ナギ
- アサ ↔ ナギ

だけ。

`ユイ・アサ・ナギ好感度 = 73` のようなgroup数値は保存しない。

### 戦闘event

- ユイがアサを救援 → ユイ/アサpairだけ
- ナギがユイをcover → ナギ/ユイpairだけ
- 3人同時連携 → AB / AC / BCの最大3pairへ個別eventとして分解

Partyを外しても関係は消えない。
Partyは関係の保存場所ではなく、関係が表面化する場所。

## 5. 低好感度を罰にしない

好きなCharacterを使い続けられることを優先。

低Bondだから:

- 編成不可
- permanent stat大幅減
- 必須攻略不能

にはしない。

差は:

- Assist timing
- battle bark
- rescue reaction
- Pair objective
- Relation art
- 会話
- 小さな連携特性

へ出す。

摩擦関係も「育てないと弱い」ではなく、摩擦だから別の強みが出る設計を許す。

## 6. 名前/喋り方

Featured24は既存の48 directed speech trackを使う。

残り186も段階変化は持つが、固有の呼び捨て等を自動生成しない。
通常呼称を維持しながら距離の変化を文法・行動で出す。

今後、人気が出たpairやStory上重要になったpairから、Baseline186 → Featuredへ昇格可能。
ただしrelation type / romance / blood relationをscoreだけで変えない。

## 7. Current boundary

- Current21全210pairの保存slotを設計
- 420 directed Affinity lane
- 1330 trio combinationを構造上許容
- Ren等の実runtime選択可否は別gate
- numeric tuning / save migration / runtime UIは未LOCK
- runtime auto-promotionなし

Machine source:
`src/game/data/pairwiseBondTrioBattleSource.ts`
