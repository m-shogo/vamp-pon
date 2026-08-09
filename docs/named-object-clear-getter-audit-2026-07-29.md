# ヨルノシルベ Named Object / Clear Getter Audit — 2026-07-29

Status: **DESIGN AUDIT / RUNTIME MIGRATION NOT PERFORMED**

> User direction: 全ての情報は大切。名前のあるものは全てつながる。100%にはかなり豪華な祝福が必要。

---

# 1. Audit result

## Overall

**PARTIAL before this pass.**

材料は多いが、以下が一本のauthorityへ接続されていなかった。

- Clear Getter
- item names
- Character luminous possessions
- Lost Item records
- Character keeper records
- 100% reward

今回、design Currentとして:

- `NAMED-OBJECT-CONNECTIONS.md`
- `character-luminous-personal-item-book-v1.md`
- `CLEAR-GETTER-AND-100-PERCENT-REWARD.md`

を追加した。

---

# 2. Clear Getter audit

Current runtime source:

- `src/game/data/collectionProgress.ts`

現状:

- Stage1 boardのみ
- 5x5 / 25 cell
- reward typeはlight coin / travel prep / memory text / cosmetic / sound
- natural / targeted / mastery / secret分類あり

良い点:

- Clear Getterらしい隣接reveal
- natural / targeted / mastery / secretの混在
- Stage clear / item level / special clear / lore閲覧の複合

不足:

- Stage2〜20 boardなし
- Character21 mastery constellationなし
- Current48 connection coverageなし
- named object lineage connectionなし
- global completion architectureなし
- 100% rewardなし

不整合:

- 表示文に旧 `黒曜化`
- Current enemy identityと異なる旧名
- `忘れ物通り` / `忘れられた夜道` 等、Stage naming authority確認が必要

Result:

> **良いprototypeだが、Current full Clear Getterとは呼べない。**

---

# 3. Character item audit

Source:

- `src/game/data/characterProductionPlans.ts`

Coverage:

- Current runtime/planning 20 IDs: 20/20
- starter gear: 20/20
- passive: 20/20
- rare: 20/20
- 灯継ぎ: 20/20
- 暁開き: 20/20

Reserve Ren:

- `reserveCharacterCanon.ts`にstarter / artsあり
- passive / rare exact namesなし

良い点:

- 物として読める名前が多い
- Stage motifとよく接続
- abstract RPG素材名へ寄っていない

不足:

- 同名が複数categoryへ出る理由が未記録
- personal luminous possessionとの関係が未記録
- Clear Getter nodeとの関係が未記録
- enemy connection / dawn stateが未記録
- current proper Shadow namesとruntime IDが分離

今回、same-nameを同じobjectのphase changeとして扱うCurrent directionを追加した。
Human Naming Reviewで別物判定された場合のみrenameする。

---

# 4. Keeper Record audit

Source:

- `src/game/data/keeperRecords.ts`

Coverage:

- Core5 only: 5/21

重大なstaleness:

- `黒曜化`表記
- アサが速度中心の旧core
- ナギがroute / star map中心の旧core
- ミチルがwater / memory中心の旧core

Current directionでは:

- アサ = name / naming consent
- ナギ = close / protect / permission
- ミチル = route / choice

したがって、このfileをCurrent21の光る持ち物authorityとして使わない。

Result:

> **runtime/history assetとして保持し、21-person migration対象。**

---

# 5. Lost Item Record audit

Source:

- `src/game/data/lostItemRecords.ts`

Coverage:

- 6 records only

良い点:

- name / owner hint / aura / flavor / memory text / unlock hintあり
- object story format自体は強い

Stale connection:

- `折れた地図の角` → keeper-nagi は旧route role由来
- `錆びた部屋の鍵` → keeper-michiru は旧closed-room role由来

Current directionなら再監査候補:

- route/map → ミチル / ゲン / トキ / レン
- key/closed room → ナギ / クロオリ / トバリ

即runtime ID変更はしない。
Save compatibility / testsを伴うmigrationで直す。

---

# 6. 100% reward audit

Previous state:

- special page
- music
- cosmetic
- title
- small seed

という候補のみ。

User directionに対して不足。

Current adopted direction:

## `全灯の朝`

複合reward:

1. playable Dawn Square celebration
2. Current21 + star beasts + luminous possessions
3. full ensemble animated page
4. completion medley
5. all-character cosmetic
6. remix play mode `星図継ぎの夜`
7. title / seal / archive frame
8. small future anomaly

True Endingではない。
Main Happy Endを最大級に祝うcompletion festival。

---

# 7. Named-object coverage after this pass

| Area | Design coverage | Runtime coverage |
| --- | ---: | ---: |
| Current21 luminous possessions | 21/21 | not migrated |
| Current20 item lineage | 20/20 | planning data exists |
| Reserve Ren lineage | partial | reserve data only |
| Stage1 Clear Getter | 25 cells | implemented legacy/prototype scope |
| Stage2〜20 Clear Getter | architecture only | not implemented |
| Current48 connection | semantic direction | not fully wired |
| Lost Item records | launch architecture direction | 6 existing |
| 100% reward | exact Current direction | not implemented |

---

# 8. Required implementation migration

Dedicated future batch:

1. stable named-object IDs
2. 21 luminous possession definitions
3. keeperRecords 21-person migration
4. lostItemRecords connection migration
5. Stage1 old label migration
6. global constellation save schema
7. progress migration / backwards compatibility
8. reduced-motion celebration version
9. `全灯の朝` asset / audio / scene production
10. tests / checker / evidence

Do not mix with U49 readiness promotion.

---

# 9. Conclusion

> **アイテム名そのものは十分豊富だったが、これまでは「全部がつながる」状態ではなかった。今回、人物・戦闘・敵・Stage・星図・黒耀化・夜明け・100%祝祭へ接続するCurrent骨格を追加した。次はruntime data migrationとvisual/audio productionが必要。**
