# Visual Master Production handoff — 2026-08-12

Status: CURRENT REVIEW CHECKPOINT / PR #304 DRAFT / NO STORY, GAMEPLAY OR RUNTIME PROMOTION

## 現在地

- Repository: `m-shogo/vamp-pon` only
- Branch: `agent/visual-asset-inventory`
- PR: #304（設計・Human visual reviewが整うまでdraft維持）
- PR #300は別Story作業で対象外。
- U49/U50/U51 readiness、Gameplay、U48 production runtime providerは変更しない。

## 実装済み基盤

- 36人をそれぞれ1 logical Character Design Master Packとして登録。
- Packごとに4 source sheet roleをuniqueに予約。
- 36 Overviewをdeterministic read modelとして分離。Masterやgeneration parentにしない。
- 36 Pack plan prompt skeletonとstructured upstream authority snapshot。
- production planは480 rows:
  - 36 logical Character Design Master Packs
  - 144 source-sheet evidence rows（4 × 36。独立Masterとして数えない）
  - 36 deterministic Overview read models
  - 8 朔夜座、21 Star Beast、21 named-object
  - 142 Lorebook derivatives、72 Gameplay derivatives
- partial Packのactual parent fieldsはnull/empty。planned parentだけを保持し、生成禁止。
- 既存Asset Factory 977 contractsはindex参照し、重複DBを作らない。
- 36人handedness/equipment registry、Yui reject ledger、objective checker、CIを接続。

## Yui

`data/character-assets/reviews/yui-character-design-master-pack-v1.json`がSheet 01 Identity / Turnaroundのversioned packet。

- 同一縮尺のneutral front / anatomical left / anatomical right / back。
- dominant handは`OPEN_NO_SOURCE`。
- lantern = anatomical right hand。
- strap = anatomical right shoulder → anatomical left waist。
- bag = anatomical left waist。
- paper = anatomical left hand。
- frontのbody-rightはviewer left、backのanatomical rightはviewer right。
- `YOUNG_ADULT`、soft oval、rounded cheeks、non-pointed chin、small almost-level almond-round brown eyes、tapered double eyelids、soft straight brows、warm-dark asymmetric bob、one ear tuck、bilateral smile dimplesを固定。

Sheet 01は同一contractの4候補生成準備ができているが、Human identity/construction approvalは未実施。Sheet 02–04、Pack approval、Lorebook/Gameplay派生、Story/final/runtime昇格はすべてblocked。

以前のYui Full Body v2 4候補と会話内試作は全件reject/learning-only。正本やparentにしない。

## 次の順序

1. export、objective checker、tests、build、implementation preflight、diff review。
2. scoped commit/push、PR #304本文更新、CI確認。draft維持。
3. Humanが生成開始を指示した場合だけ、Yui Sheet 01を同じcontractで4候補生成する。
4. Automatic QAと比較を提示し、HumanがIdentity/Constructionを承認するまでSheet 02–04へ進まない。
5. Yui identity anchor承認後は別characterのSheet 01を並列化できる。同じcharacterの依存sheetは先走らない。

## 不変境界

- Visual approval != Story Canon。
- Future15 != future era。
- 群青残響録 != organization。
- 外典星座 != 朔夜座。
- obsolete != evil / Star Beast。
- root != birthplace / incident area。
- Candidate != Current/Canon/final/runtime。
- quality score、completion %、popularity score、台詞最低文字数は禁止。
