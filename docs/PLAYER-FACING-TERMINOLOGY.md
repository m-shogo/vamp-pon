# ヨルノシルベ Player-Facing Terminology

Date: 2026-07-29  
Status: **CURRENT PLAYER-FACING COPY AUTHORITY / IMPLEMENTATION CONNECTION INCOMPLETE**

> 目的: Codex / Unity / Web実装が画面ごとに別の言葉を発明しないよう、Playerが実際に見る語と短文を実装前に固定する。
>
> 世界設定を増やす資料ではない。既存Canonの意味を、操作可能なUI語へ落とすための正本。

Related sources:

- `src/game/data/worldTerms.ts`
- `src/game/data/playerFacingCopy.ts`
- `src/game/data/metaCurrencyDisplay.ts`
- `src/game/data/collectionEconomyTerminology.ts`
- `docs/design/world-labels.md`
- `docs/FIRST-RUN-EXPERIENCE.md`
- `docs/ACCESSIBILITY-BASELINE.md`
- `docs/181-current-production-canon.md`

---

# 1. Authority order

Player-facing copyは次の順で読む。

```txt
PLAYER-FACING-TERMINOLOGY.md
→ src/game/data/playerFacingCopy.ts
→ src/game/data/worldTerms.ts
→ metaCurrencyDisplay.ts / collectionEconomyTerminology.ts
→ screen-specific runtime implementation
```

`181-current-production-canon.md` の古い `Currency / fragment = 記憶片` 一括行は、2026-07-29以降のPlayer-facing economy splitには使わない。

Current split:

```txt
run内 level-up pickup = 記憶片
run外 persistent wallet = metaCurrencyDisplay Current label
2026-07-29 Current wallet label = 黒曜片
wallet rename candidate = 灯貨
Human naming approval = false
```

Runtime/save IDsはdisplay nameから分離する。

---

# 2. Product title

正式Player-visible title:

# **ヨルノシルベ**

Legacy development code names:

- Vamp Pon
- VAMP PON
- ヴァンサバ改

Legacy code nameは以下では保持可:

- repository history
- old screenshots/evidence
- migration notes
- stable technical identifiers where rename risk is高い

新しいproduction UI titleへは出さない。

---

# 3. One concept = one primary label

同じ機能に複数の主ラベルを与えない。

| Concept | Current player label | Notes |
| --- | --- | --- |
| Work title | ヨルノシルベ | VAMP PONはLegacy |
| Start | 夜へ出る | primary TOP action |
| Stage select | 夜の地図 | screen/system label |
| Collection | 灯録 | 忘れ物帳を新規主ラベルにしない |
| Growth/meta upgrade | 旅支度 | 黒曜研究所を廃止方向 |
| Settings | 設定 | clear label優先 |
| Weapon / active item | 灯具 | internal weapon IDは維持可 |
| Passive | 持ち物 |  |
| Rare item | 忘れ物 |  |
| Field drop | 落とし物 |  |
| Run fragment | 記憶片 | level-up pickup |
| Persistent wallet | 黒曜片 | naming review pending |
| Achievement | 記憶のしるし |  |
| Collection graph | 夜明け星図 | 灯録の中の主要view |
| Stage clear | 夜明け |  |
| Enemy defeat verb | ほどく | telemetry `kills`は内部のまま可 |
| Kokuyou form | 黒耀化 | 黒曜化はLegacy alias only |
| No-Kokuyou bonus | 黒耀化なし | `黒曜なし`をproduction copyに残さない |
| Initial weapon | 最初の灯具 | `最初の忘れ物`を使わない |

---

# 4. Economy vocabulary split

絶対に混ぜない:

```txt
記憶片
= run内で敵をほどいて拾う
= level-up / run growthへつながる
= persistent walletではない

黒曜片
= run外へ持ち帰るpersistent walletのCurrent表示
= PlayerProfile.currency系の表示
= Meta upgrade / 旅支度へ使う
= final nameは未承認

灯貨
= high-value candidate
= Stage1 one-run compatibility/counter文脈にも存在
= Current persistent wallet nameへ自動昇格しない
```

`記憶片`をwalletへ戻さない。
`黒曜片`をrun XP pickupへ使わない。
`灯貨`をHuman承認なしで全画面renameしない。

---

# 5. First-run copy

初回に見せる語は少なくする。

Current short copy:

```txt
指を置いて、そのまま動かす
攻撃は自動。
記憶片を拾ってレベルアップ。
```

敗北/fail-forward:

```txt
朝まで残れなくても、{persistent currency}は持ち帰れる。
```

`やられても`をCanon上の死亡表現として使わない。
`EXPを拾ってレベルアップ`は使わない。Playerが見ているpickup名と一致させる。

黒耀化、Bond、全rarity、全slot rule、夜の正体はFirst Runで説明しない。

---

# 6. Result copy

Current:

| Meaning | Copy |
| --- | --- |
| Clear title | 夜明け |
| Failed-run title | 夜に飲まれた |
| Failed-run explanation | この読み方では、朝まで残れなかった。 |
| Reward section | 持ち帰り |
| New records | 新しい記録 |
| Elite label | 強敵 |
| Defeated count | ほどいた影 |
| No-Kokuyou bonus | 黒耀化なし |

Internal fields:

- `kills`
- `elitesKilled`
- `currencyEarned`

などはrename不要。
Player copyだけCurrent語へ寄せる。

---

# 7. Japanese-first functional UI

Core action/sectionは日本語で理解できるようにする。

置換対象:

```txt
Rewards      → 持ち帰り
New Records  → 新しい記録
Elite        → 強敵
```

Decorative Englishは背景/装飾としては可。
ただしPrimary action、section heading、重要stateを英語だけに依存させない。

---

# 8. Poetic copy vs functional copy

ヨルノシルベらしい語は残すが、操作語まで謎解きにしない。

Good:

```txt
旅支度
持ち帰った灯りで、次の夜を少し楽にする
```

Avoid:

```txt
黒曜研究所
```

理由:

- 実在facilityという新設定を暗黙に増やす
- 黒耀化と黒曜片の語感をさらに混ぜる
- Growthという機能を初見で説明しにくい

Playerが操作するラベルは明確、雰囲気はsubtitle / ornament / flavor lineで足す。

---

# 9. Active production copy migration targets

Definition source:

- `src/game/data/playerFacingCopy.ts`

Current known targets:

```txt
VAMP PON
忘れ物帳
黒曜研究所
黒曜なし
EXPを拾ってレベルアップ
Rewards
New Records
Elite
```

これらはLegacy/history全体から消すのではない。
Active production screen / current Web reference / Unity production UIを検索し、Current copyへ移行する。

---

# 10. Do not mass-replace

禁止:

- `黒曜`という字をrepo全体で一括置換
- `VAMP PON`をhistory/evidence/technical IDsから消す
- `kills`等internal telemetry rename
- `PlayerProfile.currency` rename
- `light_coin` stable compatibility ID rename
- `黒曜片 → 灯貨`自動実施
- `旅支度`を新しいLore facilityとして設定追加

実装はdisplay layerを優先する。

---

# 11. Settings wording

Release前のCurrent baselineは4項目。

```txt
BGM
SE
振動
演出を控えめに
```

詳細:

- `docs/SETTINGS-BASELINE.md`
- `src/game/data/settingsBaseline.ts`

Language selector、notification、cloud sync、analytics consent等は、実サービスが存在しない段階で見せかけの設定を作らない。

---

# 12. Open wording decisions

実装を止めないOPEN:

- persistent wallet final name: `黒曜片` Current / `灯貨` candidate
- Stage numberを `Stage 1` / `第1夜` / 別表現のどれにするか
- `灯りの家`を最終Home screen titleとして全面採用するか
- Shop `忘れ物市`をlaunch scopeへ入れるか

Codexはこれらを独断でLOCKしない。

---

# 13. Implementation acceptance

Player-facing terminology migrationが完了と言える条件:

1. active production titleが`ヨルノシルベ`
2. run pickupが`記憶片`
3. persistent walletはshared formatter
4. Collection主ラベルが`灯録`
5. Growth主ラベルが`旅支度`
6. `黒曜なし`がactive UIから消え、`黒耀化なし`
7. First Runの`EXP`説明がactive UIから消える
8. Result core headingsが日本語Current copy
9. Legacy/historyは必要分保持
10. tests/build/visual reviewが実行済み

Definitionだけでruntime connection completeとは扱わない。

---

# 14. One sentence

> **ヨルノシルベのPlayer-facing copyは、雰囲気語を増やすより「一つの意味に一つの主語」を優先し、記憶片・persistent wallet・黒耀化・灯録・旅支度を混線させない。**
