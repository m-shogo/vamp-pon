# ヨルノシルベ Named Object / Clear Getter Runtime Migration Plan v1

Date: 2026-07-29  
Status: **CURRENT MIGRATION PLAN / NOT EXECUTED**

> 名前のある情報をCurrentへつなぐ時、古い名前や記録を削除して整えるのではなく、stable IDとmigration ledgerを使って失わず移行する。

---

# 1. Scope

対象:

- `collectionProgress.ts`
- `keeperRecords.ts`
- `lostItemRecords.ts`
- `characterProductionPlans.ts`
- `reserveCharacterCanon.ts`
- Collection save data
- 夜明け星図 UI
- 灯し手の記録
- 忘れ物絵札
- item / evolution definitions
- 100% completion state

対象外:

- U49 readiness promotion
- U50 metrics promotion
- visual asset final approval
- Main Mystery answer

---

# 2. Non-destructive principle

禁止:

- display nameをkeyとして使い続ける
- old itemを削除して新itemだけ残す
- save内のunknown IDを無視して消す
- Nagi / Michiruの古いbindingをsilent overwrite
- `kage1..4`をCurrent proper nameへ一括置換
- 100%計算を既読テキスト数へ依存

採用:

```txt
stable object ID
+ display name version
+ alias / legacy name list
+ current connection target
+ migration status
```

---

# 3. Phase 0 — Inventory snapshot

全named entryを抽出する。

Categories:

- Character
- Stage
- Enemy
- 灯具
- 持ち物
- 忘れ物
- 落とし物
- 光る持ち物
- 灯技 / 継灯 / 暁灯
- 灯継ぎ / 暁開き / 灯合わせ
- 黒耀化
- 記憶のしるし
- archive record
- story prop

Output candidate:

```txt
docs/design-targets/generated/named-object-registry-v1.json
```

各entry:

```json
{
  "id": "stable-id",
  "displayName": "Current name",
  "aliases": ["legacy name"],
  "status": "CURRENT|WORKING|LEGACY",
  "source": "path",
  "connections": []
}
```

---

# 4. Phase 1 — Orphan / collision checker

Checker rules:

1. Current named objectにstable IDがある
2. owner / Stage / gameplay / archiveのうち3 connection以上
3. same display nameが複数IDにある場合collision明示
4. same IDがphase名を持つ場合lineage明示
5. Current docからLegacy sourceだけを参照していない
6. `黒曜化`をCurrent displayへ出さない
7. Current21 luminous possessions = 21
8. Current48 enemy connection targetが解決
9. Stage identity targetが1〜20で解決
10. 100% denominatorが有限かつversioned

Checkerは警告とerrorを分ける。
Working nameはwarning、orphan Currentはerror。

---

# 5. Phase 2 — Character object definitions

新Definition候補:

```txt
CharacterLuminousPossessionDefinition
NamedObjectConnectionDefinition
ItemLineageDefinition
```

Current21へ:

- stable ID
- object name
- light behavior
- visual prop
- starter gear connection
- black-youka distortion
- dawn state
- archive key

を持たせる。

`keeperRecords.ts`の古い5人データを直接authorityにしない。
新Definitionからread modelを生成し、旧record IDはaliasとして保持する。

---

# 6. Phase 3 — Lost Item migration

Existing 6 recordsは削除しない。

再分類:

```txt
CURRENT CONNECTION
LEGACY CONNECTION PRESERVED
MIGRATION REVIEW REQUIRED
```

特に:

- `lost-folded-map-corner`
- `lost-rusted-room-key`

はNagi / Michiruの旧role由来bindingを監査する。

新Current connectionへ移しても、旧表示文・旧関連履歴はmigration ledgerへ残す。

---

# 7. Phase 4 — Clear Getter schema

Current save:

- completed
- claimed
- revealed
- hinted

を維持しつつversion化。

追加候補:

```txt
boardVersion
nodeDefinitionVersion
connectedObjectIds
completionGroupStates
hundredPercentState
completionRewardClaimed
```

100% denominatorはversionごとにfreezeする。

例:

```txt
launch-v1 completion
post-launch added constellation
```

後からnodeを追加して既存100%を勝手に剥奪しない。

---

# 8. Phase 5 — Stage1 label migration

`collectionProgress.ts`の25 cellsを監査する。

分類:

- KEEP condition
- RENAME display only
- REBIND current enemy
- SPLIT active/cross-link/decorative
- LEGACY archive

旧IDを維持できる場合、displayだけversioned mappingで変える。
ID変更が必要ならsave migration tableを作る。

---

# 9. Phase 6 — Global constellation

UI:

```txt
大星図
├ 夜路
├ 灯し手
├ 灯具
├ カゲモノ
├ 結び
└ 夜の余白
```

必要:

- zoom / filtering
- related object jump
- visible hints
- hidden node staged hint
- reduced motion
- semantic order
- controller/keyboard optional path

全ての線を同時表示して読めなくしない。

---

# 10. Phase 7 — 全灯の朝

Definition gate:

- launch-v1 100% denominator fixed
- completion migration tested
- reward claim idempotent
- celebration can replay
- cosmetic unlock persists
- music unlock persists
- remix mode unlock persists
- offline safe
- reduced-motion fallback

Scene contentはasset approval後に接続。

---

# 11. Verification

Required:

- typecheck
- unit tests
- save fixture migration
- old save / partial save / 100% save
- duplicate claim prevention
- unknown legacy ID preservation
- snapshot of all Current names
- orphan checker
- same-name lineage checker
- UI 390x844
- VoiceOver semantic order
- reduced motion
- physical device touch

---

# 12. Promotion boundary

次を全て分ける。

```txt
Design Current
Named registry generated
Runtime definitions connected
Save migrated
UI connected
Human naming approved
Visual approved
Device verified
100% celebration production ready
```

一段通っただけで後段をtrueにしない。

---

# 13. 一文

> **名前をCurrentへ揃えるとは、古い名前を消すことではなく、stable IDの周りへ旧名・現在名・持ち主・Stage・遊び・記録・夜明けを失わず結び直すこと。**
