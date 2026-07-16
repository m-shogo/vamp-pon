# U47 Stage1 Gameplay Data / Runtime 完了記録

Web正本からU47対象sliceをdeterministic JSONへexportし、UnityのDefinition / Registry / 1-run Runtime Stateへ接続した。Definition assetは再importでGUIDを維持する。U47 completion evidenceでは、Registry候補、full-slot replacement、ground-area DoT、進化、rare item、dawn_ticket復帰、黒耀化、Result反映、retry resetを実runtime経路で確認した。

`docs/design-targets/generated/unity-u47/readiness.json`の`productionApproved=true`はU47 gameplay data/runtime sliceの完了判定である。`runtimeVisualReady`、production character/enemy asset、U47 icon final/runtime approvalはfalseのままであり、ゲーム全体のproduction visual approvalやRC昇格を意味しない。U48は`U48_BLOCKED`を維持する。

## Production capacityとSimulator verification capacity

Productionの所持枠はWeb正本どおりweapon 5 / passive 5 / rare 2であり、変更していない。`RunGameplayState`はoption未指定時に必ずRegistry由来のproduction 5 / 5 / 2を使う。Registry数からproduction slot上限を自動変更しない。

U47 full-slot replacement scenarioだけ、通常取得可能なdistinct候補を1種未所持で残すため、`eligibleDistinctCandidateCount - 1`を明示注入する。進化武器は通常取得候補へ含めない。現在のverification capacityはweapon 2 / passive 3 / rare 2である。このoptionは`VAMPPON_AI_SIMULATOR_SMOKE`と`VAMPPON_U47_AI_SIMULATOR_SMOKE=1`で隔離されたSimulator bridgeからのみ開始され、各scenario cleanup、成功、失敗、bridge破棄の各経路でproduction capacityへ戻る。

## Full-slot replacement

正常な登録済みIDだけを使い、weaponは`night_pencil + black_ink_bottle`の2枠満杯から未所持の`streetlamp_ring`を提示する。実replacement UIで内部index 1のslotを選択してもinventoryは変化せず、selected rowと有効化された確定ボタンを確認後、実confirm buttonを押して`black_ink_bottle`だけを除去した。結果は`night_pencil + streetlamp_ring`である。

passiveは`old_ticket + gold_compass + travel_badge`の3枠満杯から未所持の`white_margin`を提示し、内部index 1のslot選択後もinventory不変を確認してから実confirm buttonを押し、`gold_compass`だけを除去した。結果は`old_ticket + travel_badge + white_margin`である。未選択confirmはdisabled、cancelはcommit 0でinventory不変、modal close後はselection/listenerを消去する。duplicate ID、未登録ID、進化武器の直接注入は使用していない。UI表示名はRegistry正本を使う。

## Ground-area DoT

ground-areaはpickup/drop/inventory actorではなくDoT攻撃executorである。既存Registryの`black_ink_bottle`、`streetlamp_ring`、`dawn_ink_lamp`を独立scenarioで実行した。各runtime JSONはdefinition ID、`GroundArea` executor、actor表示、world position、radius、DPS、tick interval、tick数、hit数、duration、despawn、sorting order、HUD背面、inventory不変、pickupなし、duplicate executor 0、exception 0を記録する。

areaのsorting order 8はstage ground/backgroundの-100/-20より前、enemy 15 / player 20より後、HUD canvas 90より背面である。各スクリーンショットでもactorとの重なりを目視確認した。

## Dawn ticket revival

復帰は`dawn_ticket`によるHP 30% revivalであり、snapshot resume/save-loadではない。HP 110、致死damage 220、ticket 1個から通常game overを抑止し、既存正本の`floor(maxHp * RevivalHpRatio + 0.0001), minimum 1`によりHP 33へ復帰、ticket 0、gameplay継続となった。2回目の復帰は抑止された。snapshot保存、runtime再初期化、resume、save/load機能は追加していない。

## Canonical capture catalog

capture正本は次の23件である。

1. `01-stage-select`
2. `02-initial-night-pencil`
3. `03-levelup-actual-choices`
4. `04-inventory-weapon-passive`
5. `05-inventory-full`
6. `06-levelup-decline`
7. `07-levelup-replacement`
8. `08-black-ink-area`
9. `09-streetlamp-area`
10. `10-fusion-ready`
11. `11-dawn-ink-lamp`
12. `12-name-tag-owned`
13. `13-unforgotten-name`
14. `14-dawn-ticket-owned`
15. `15-revival-30-percent`
16. `16-kokuyou-charging`
17. `17-kokuyou-ready`
18. `18-kokuyou-active`
19. `19-kokuyou-recovery`
20. `20-result-u47-summary`
21. `21-retry-reset`
22. `22-compact-gameplay`
23. `23-large-gameplay`

Catalog schemaは2、`expectedCaptureCount=23`、semantic route数は`baseRouteId`のunique数から導出した11である。1–21はStandard 390x844、22は同じ`stage1-gameplay`をCompact 360x800で再実行、23は同routeをLarge 430x932で再実行した。23を独立semantic routeとは扱わず、23x3の69件直積も行っていない。Unity Resourcesコピーとdata正本は同一で、catalog hashは`fc2152a0116358584c3820810bd6304d2cd168055d747324391feb973c265859`である。

## Candidate crystal occupancy

candidate EXP水晶はsource sprite width 1254px、PPU 180、pre-clamp scale 0.048804、applied scale 0.048804、final world width/height 0.34、finite=trueである。非有限boundsを拒否し、scaleを0.01–1.0へclampする。colliderはbefore/afterともnone、pickup radiusと取得距離、gameplay stateは変更していない。

## Evidence

- capture catalog: `data/unity/u47-simulator-route-catalog.json`
- manifest: `docs/design-targets/generated/unity-u47/simulator-smoke/manifest.json`
- runtime summary: `docs/design-targets/generated/unity-u47/simulator-smoke/summary.json`
- 23 screenshots: `docs/design-targets/generated/unity-u47/simulator-smoke/screenshots/`
- 23 runtime JSON: `docs/design-targets/generated/unity-u47/simulator-smoke/runtime-results/`
- contact sheets: `contact-sheet-01-captures-01-12.png` / `contact-sheet-02-captures-13-23.png`
- visual review: `docs/design-targets/generated/unity-u47/simulator-smoke/visual-review.json`
- detailed replacement transition: `docs/design-targets/generated/unity-u47/simulator-capacity-result.json`

画像生成・既存画像再生成・candidate assetのfinal昇格は行っていない。
