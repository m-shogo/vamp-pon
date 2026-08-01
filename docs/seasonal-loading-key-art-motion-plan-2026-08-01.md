# ヨルノシルベ 四季Loading Key Art / Motion Plan

Date: 2026-08-01  
Status: human-selected loading direction / candidate assets / runtime not connected  
Base authority: `main@9af0418418eece712a5ea6f170630c4ee8770086`

## 決定

2026-08-01の明示的人間判断により、春・夏・秋・冬の縦長集合絵4枚を**Loading Key Artの採用方向**とする。

TOPのprimary backgroundにはしない。4枚は情報密度、人物密度、縦方向の視線誘導が強く、TOPの正式タイトル、主操作「夜へ入る」、Collection / Settings導線を重ねると絵と操作の両方が弱くなるためである。

役割を次のように分離する。

| Surface | 採用要素 |
| --- | --- |
| Loading | 四季集合絵をfull-bleedで1枚だけ表示する |
| TOP | 四季絵そのものではなく、空の色、灯り、低密度particle、緩いparallaxだけを継承する |
| Runtime UI | title、loading copy、progress、button labelは必ずruntime描画する |

この判断はU49 Audio/Haptic evidence、readiness flags、PR #76を変更しない。PR #76へHeavy Design runtime変更を混ぜない。

## 現在の承認境界

```txt
humanSelectedForDirection=true
usageDecision=LOADING_KEY_ART
assetStatus=candidate
approvedAsFinal=false
runtimeApproved=false
runtimeConnected=false
finalApprovalBlocked=true
```

ユーザーの「めっちゃいい、TOPかLoadingで採用」は方向選定の明示承認として記録する。ただし、生成時のexact prompt / seed / generator versionが保存されておらず、layer分離、Compact / Standard / Large、Simulator、実機、性能の確認も未実施であるため、production finalへは昇格しない。

## 季節選択

日本の季節感を基準に、端末のlocal monthだけで決定する。network時刻や位置情報には依存しない。

| Season | Month | Art |
| --- | --- | --- |
| spring | 3–5 | 桜坂、満月、橋、灯り |
| summer | 6–8 | 湖面、星空、花火、灯籠 |
| autumn | 9–11 | 森林駅、紅葉、時計、収穫 |
| winter | 12–2 | 雪の町、紙飛行機、暖炉光 |

QAではseason overrideを持たせ、端末日付を変更せず4枚を確認できるようにする。

## Motionの最優先順位

### P0: 火 / 灯り

ヨルノシルベの共通記号として最重要。画面内すべての灯りを動かさず、前景1、中景1、遠景1程度に絞る。

- 炎は6–8 frame、8–10 fpsの小さなflipbook。
- glowは不規則なnoiseで輝度を4–7%だけ揺らす。規則的なsine点滅は禁止。
- 前景のglow半径は基準の0.96–1.04倍。色相は動かさない。
- 炎の周囲だけ極小のheat distortionを許可する。人物の顔や文字へ到達させない。
- Loading終端では、主灯のglowを一度だけ広げ、TOPの小さな灯りへmatch transitionする。

### P1: 空

- 月、星、雲を別layerにし、4–8秒で2–6pxだけ移動する。
- 星の明滅は同時点滅させず、alpha差は最大10%。
- cameraは開始時1.012倍から1.0倍へ戻す程度の非常に遅いpush / pullに限定する。
- gyroは初期OFF。採用する場合も最大4px、Reduced Motionでは必ずOFF。

### P2: 季節の一手

常時派手にせず、1画面につきsignature motionを1種類だけ強くする。

| Season | Signature motion | Secondary motion |
| --- | --- | --- |
| spring | 月前を横切る桜の花びら | 橋と手前の灯りが微かに揺れる |
| summer | 遠景花火をLoading中に最大1回 | 水面の反射と灯籠がゆっくり上下する |
| autumn | 1枚の紅葉がZ字に落ちる | 駅の煙と時計の秒針を極小に動かす |
| winter | 光る紙飛行機が一度だけ進む | 雪、煙突の煙、手前の灯りを低速で動かす |

### P3: 人物

- 前景2人まで、胸郭1–2pxの呼吸と髪先 / 袖先2–4pxの揺れだけを許可する。
- 顔、目、口を生成補間で動かさない。別人化、不自然な瞬き、表情崩れを避ける。
- 動物は耳または尻尾のどちらか一方だけ、ロボットはeye lightの短いscanだけにする。
- 全員を同じ周期で動かさない。

## Loading choreography

```txt
0.00–0.18s  blackからkey artへfade in
0.18–0.45s  主灯とsky layerを開始
0.45s–end   低密度のseason motion、実loading progressを表示
last 0.30s  主灯のglow → 黒インクの細いwipe → TOPの小さな灯りへ接続
```

実loadが短い場合、絵を見せるために長いfake loadingを入れない。最小表示は初回0.65秒、連続起動0.25秒を上限目安とし、完了後は即transition可能にする。

## UI safe zone

- titleや操作buttonは載せない。
- 下端safe areaの上に、loading copy 1行とprogressだけを置く。
- copyは季節絵へ焼き込まない。
- readability用に下端20–24%へ黒紺gradientを重ねる。最大alpha 0.48。
- progressは細い一本線。装飾は主灯と競合させない。
- 360x800 / 390x844 / 430x932で人物の顔、動物、ロボット、signature motionがsafe crop内に残るか確認する。

## Performance budget

- 4枚を同時loadしない。選択季節の1枚だけをloadし、不要になったら明示的に解放する。
- 原本は853x1844前後。Unity runtime derivativeはMax Size 2048、Mipmap OFF、Clamp、Bilinearを候補とする。
- iOSはASTC 6x6を第一候補とし、顔と細線の劣化を実機比較する。
- motion overlayは共有atlas 1枚 + 季節atlas 1枚までを目標にする。
- particle上限は同時48、signature particleは同時12以下を目安にする。
- full-screen video、全画面shader noise、全灯同時animationは禁止。
- Reduced Motionでは静止画 + 250ms crossfade + progressだけにする。

## 次の制作単位

原本全体を無理にAI動画化しない。以下を透明PNG / flipbook / maskへ分解する。

1. 共通lantern flame atlas。
2. 共通lantern glow mask。
3. 春petal、夏firework + water ripple、秋leaf + smoke、冬snow + paper airplane。
4. sky / middle character group / foregroundのdepth mask。
5. Loading runtime component、season resolver、QA override。
6. Compact / Standard / Large capture。
7. Simulator比較、人間review、iPhone performance review。

Unity実装開始前に、layer breakdown、safe crop、import policy、performance risk、implementation branchを承認済みにする。

## 禁止

- 4枚をcarouselのようにLoading中に切り替える。
- 全要素を常時動かす。
- 顔をAI補間で喋らせる / 瞬きさせる。
- Loading完了後も不要textureを4枚保持する。
- fake progressを実loading progressとして見せる。
- baked text、baked logo、baked progress。
- この方向選定だけで`approvedAsFinal`または`runtimeApproved`をtrueにする。

