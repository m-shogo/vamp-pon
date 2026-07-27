# ヨルノシルベ 全画面Heavy Design監査

## 結論

現runtimeは構造・操作境界を確認する`temporary structural UI`であり、完成visualとして未承認です。

実機human reviewは次を確定しました。

```txt
StageSelect=FAIL
LevelUp=FAIL
humanWholeAppVisualAccepted=false
characterAndEnemyVisuals=KEEP_CANDIDATE
otherScreenElements=NOT_APPROVED
```

「キャラクターと敵キャラクターの画像は良いが、それ以外はダサい」という判断をhuman visual rejectionとして扱います。自動captureのPASS、U48のasset promotion、formal PNGの存在は、この人間判断を上書きしません。

この監査はruntime source commit `6a18de469426f923aa107c7e5f1d5ebd9bc814c9`を対象とし、390×844で再収集しました。TOPとPauseはplayer-facing screenが存在しないため、capture不能ではなく`MISSING`です。

U47 captureはruntime-relevant treeを確定した直後、capture artifactを含むcommitを作る前に取得したため、既存manifestの`sourceHead`は親commitです。runtime sourceはそのまま`6a18de46`になり、Collectionは同じ変更なしSimulator buildの既存U46診断routeで再取得しました。この自己参照回避上の時系列を
`screen-audit.json.captureProvenance`
へ明記しています。

## U49との境界

本監査はU49 Audio/Hapticと独立です。

```txt
U49 scope=actual-device audio/haptic
audio/haptic evidence mutation=NONE
readiness promotion=NONE
readiness rollback=NONE
design implementation on U49 branch=NOT_STARTED
next heavy Design Phase ID=UNASSIGNED
```

StageSelect／LevelUpのFAILを理由に、音・振動evidenceを偽装、巻き戻し、昇格しません。U49のblocked状態と未完了human reviewをそのまま維持します。

## 維持する構造

- 非戦闘画面でbattle HUDを隠す。
- StageSelectの端切れを解消したresponsive構造。
- LevelUpのicon左、名称・効果右という情報順序。
- 44px以上のtap target、safe area、runtime hook。
- U47 Simulator smoke 23 capture / 11 semantic routeと既存assertion。
- pause、navigation、gameplay commandのownership。

これらは次のDesign Phaseで見た目を作り直しても戻しません。

## 画面別監査

| 画面 | 判定 | 現在の正式画像 | 現在のprimitive | 完成像 |
| --- | --- | --- | --- | --- |
| TOP | MISSING | なし | 独立state自体がない | 夜へ入る静かな一枚絵、灯りを点す主操作、灯録／設定への控えめな導線 |
| StageSelect | REPLACE | U48 title/card/state/metadata/button、U45 panel/accent | C# ScrollRect、3px単色route line、矩形card、TMP文字 | 紙地図ではなく「夜路」を主役にし、記憶の軌跡、ランタン地点、黒インク封印、小景を一続きの道として見せる |
| Battle background | POLISH | U48 stage1 background、Yui、Onbu、VFX | sliced一枚背景、procedural radial glow | 静かな夜道の奥行き、場所固有silhouette、紙粒子、局所ランタン光を重ねる |
| HUD | REPLACE | U48 HP/timer/inventory/rare/黒耀化 frame | C# bar、文字列、slot row、固定anchor | 必要情報だけを黒インクの細い記録帯へ整理し、formal iconと状態差を明瞭にする |
| Pause | MISSING | なし | pause coordinatorのみ | 夜を止めた静止感、紙片menu、設定・再開・帰還の明確な階層 |
| LevelUp | REPLACE | U48 card/title/description/frame/feedback | C# inner border、単色rarity、TMP label、placeholder icon | 三枚の記憶札。通常は静か、rare／進化だけ封印が解けてランタン光とインクが反応する |
| inventory | REPLACE | U48 slot frame | C# row、progress、text、empty state | 武具・受動・忘れ物を正式iconと紙タグで一目で判別できる携行記録 |
| replacement | REPLACE | U48 modal/candidate/slot/state/button | C# list、tint、text比較 | 捨てる記憶と迎える記憶の対比、選択中の灯り、確定時のインクstamp |
| evolution | REPLACE | U48 ground-area/VFX | 専用reveal screenなし | 二つの記憶が紙面上で重なり、印が割れて新しい正式iconと名称が現れる |
| awakening | REPLACE | gameplay sprite/VFX | 専用memory revealなし | 忘れ物との結びつきを短い記憶演出として見せ、通常LevelUpと明確に分離する |
| 黒耀化 | POLISH | U48 phase aura、gauge frame | C# phase bindingとscale | 黒インクが灯りを侵食し、ready／active／recoveryを照明・粒子・音と同期して区別する |
| Result | REPLACE | U46 candidate page/seal/chip/card、U48 panel/header/row/button | C# stat grid、文字主体reward list | 戦績dashboardではなく「持ち帰った記憶を綴る一頁」。重要結果、獲得物、次行動の順に視線を導く |
| Collection | POLISH | U46 book/page/tab/entry/lock/badge/nav | C# tabs/grid/labels/detail overlay | 本型baseは再利用候補。正式挿絵、分類印、発見状態、余白、typographyを再設計する |

## 横断要素監査

| 要素 | 判定 | 理由 |
| --- | --- | --- |
| buttons | REPLACE | 画像frameはあるが、主・副・危険・disabled・押下のfamilyが画面横断で未統一 |
| cards | REPLACE | 矩形と文字の比率が強く、記憶札・記録頁・戦利品の意味差が弱い |
| frames | POLISH | 一部PNGは再利用候補だが、線幅、角、紙質、390×844 pixel-fitを再設計する |
| icons | MISSING | weapon、passive、rare、settings、navigationの正式な統一icon familyがない |
| typography | REPLACE | 汎用TMP配置が主体で、見出し、本文、数値、印の和文階層が未完成 |
| transitions | MISSING | 紙、黒インク、ランタン光を用いた画面遷移familyがない |
| backgrounds | POLISH | battle／Collectionのbase余地はあるが、TOP／StageSelect／Pause／Resultが不足 |
| particles | POLISH | gameplay VFXはあるが、UI選択、rare、unlock、transition用familyが不足 |
| lighting | POLISH | procedural glow中心で、意味と同期するlantern lighting systemがない |
| selection states | REPLACE | tint、単色glow、文字label中心で特別感が不足 |
| disabled / locked | REPLACE | 黒インク封印、記憶欠落、未解放の固有表現が弱い |

画面単位の判定と素材由来は
`docs/design-targets/generated/unity-whole-app-design-audit-2026-07-27/screen-audit.json`
を正本とします。

## formal imageとprimitiveの実態

### 本当に正式画像を使っている部分

- U48 ProductionのYui／Onbu animation sprite。
- U48 Productionのstage1 background、pickup、projectile、hit、enemy death、ground area、黒耀化aura。
- U48 ProductionのHUD、LevelUp、replacement、Result、StageSelect用PNG 30 group。
- U46 CandidateのResult／Collection用book、page、seal、tab、card、button。

ただしU46はコード上も`Candidate / ApprovedAsFinal=false / RuntimeApproved=false`です。U48 UI PNGはproduction pathに存在しますが、今回のwhole-screen human rejectionにより「完成画面として利用可能」とは扱いません。個別素材の再利用可否は次phaseで再判定します。

### C#／uGUI primitiveで構成している部分

- `new GameObject`と`RectTransform`で画面、card、row、bar、slotを生成。
- `Image.color`による単色背景、選択、disabled、rarity、glow。
- StageSelect routeは幅3pxの単色Imageを回転して接続。
- LevelUp inner border、content background、rare glowは矩形Imageと色。
- Result／Collectionの情報階層は固定anchorとTextMeshPro中心。
- battle lantern glowはprocedural radial sprite。
- item-specific iconは正式assetがなく、frameと簡易表現が中心。

この混在が、正式PNGを使っていても画面全体を「CSSで箱を並べたような開発用UI」に見せる主要因です。

## 画面別asset制作計画

| 画面 | 必要asset | 既存再利用 | 生成 | 手作業 | Unity shader / runtime |
| --- | --- | --- | --- | --- | --- |
| TOP | night key art、title mark、灯りの主button、sub navigation ornament | character silhouetteは再検討 | key art候補4案 | typography、余白、9-slice仕上げ | lantern flicker、paper dust、transition |
| StageSelect | 夜路背景、記憶の軌跡、地点node、選択lantern、lock ink seal、stage vignette | U48 cardは参考止まり | 背景・小景候補 | 道の連続性、node family、状態差、slice | scroll parallax、選択light、ink reveal |
| Battle | background layer、foreground silhouette、landmark、lighting mask | U48 backgroundをbase候補 | stage scenery候補 | tile/seam、gameplay readability | parallax、fog/paper dust、local light |
| HUD | top frame、HP/EXP、timer、inventory、rare、黒耀化、formal icons | current frameは比較候補 | 装飾候補 | pixel-fit、9-slice、icon cleanup | fill mask、damage/ready feedback |
| Pause | paper menu、button family、settings icon、seal | なし | panel候補 | hierarchy、focus、safe area | dim、time-stop ink wash |
| LevelUp | memory slip、rarity frame/seal/light、weapon/passive icons、selected reaction | information orderのみKEEP | paper/ornament/icon候補 | icon統一、rarity family、9-slice | lantern pulse、ink reaction、rare reveal |
| inventory / replacement | slot、tag、empty、selected、confirm stamp、icons | interaction contractのみKEEP | icon/ornament候補 | comparison hierarchy、disabled state | selection light、stamp transition |
| evolution / awakening | fusion seal、memory trail、result icon plate、name reveal | U48 gameplay VFXを一部再検討 | reveal art候補 | timing board、symbol continuity | compositing、mask dissolve、light |
| 黒耀化 | phase overlay、gauge family、activation mark | U48 auraは再利用候補 | overlay候補 | phase readability | distortion、ink spread、lighting |
| Result | record page、rank seal、reward card、stat ornament、button | U46/U48は参考・部分再利用候補 | page/ornament候補 | information hierarchy、9-slice | page-in、stamp、reward reveal |
| Collection | book、category tabs、entry frame、lock seal、illustrations | U46 book baseは再利用候補 | entry illustration候補 | typography、grid、detail layout | page turn、new mark、unlock ink |

生成物は必ずcandidateから開始し、Golden Reference、4候補比較、prompt/reference/output hash、Generation Lineage、自動QA、人間reviewを通します。生成画像を画面へ直接貼ってfinal扱いしません。text/controlを一枚絵へ焼き込みません。

## 最低限必要な正式制作物

- StageSelectの夜路背景、道／記憶の軌跡、地点node、選択地点のランタン光、未解放地点の黒インク封印、stage固有小景・silhouette。
- LevelUpの紙片／記憶札base、rarity別frame・印・光、weapon／passive／rare正式icon、選択中の灯り・インク反応。
- 見出し／label装飾、汎用button正式9-slice、panel、divider、tag、seal、stamp。
- Battle HUD正式frame、formal item icon、状態別fill／feedback。
- Result／Collection正式background、page、ornament、entry illustration。
- TOP、Pause、transition、particle、lighting、selected／disabled／locked state family。

## 固定原則

1. 色数を増やしすぎない。
2. 紙UI・黒インク・ランタン光を主軸にする。
3. rare演出だけ派手にする。
4. 通常画面は静かにする。
5. 文字可読性を最優先する。
6. character素材とUI素材の質感を統一する。
7. 生成画像をそのまま混ぜない。
8. 汎用mobile UI／管理画面風を禁止する。
9. 枠線と単色矩形だけで完成扱いにしない。
10. 390×844実機サイズで成立して初めて承認候補とする。

## Design Phase開始条件

実装前に次を揃えるまで、U49 branch上の場当たり的な色変更・矩形追加を禁止します。

- 全主要画面の390×844完成target。
- Golden Referenceと現runtimeの並列比較。
- screenごとのasset manifestとreuse decision。
- generation／manual finishing／shaderのowner。
- typography、button、card、panel、icon、stateの横断system。
- Compact／Standard／Large capture matrix。
- human review項目と承認者。

`visual approval=true`へ進めるのは、実機390×844で全主要画面を再reviewし、人間が明示承認した場合だけです。
