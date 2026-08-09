# ヨルノシルベ Mobile Control Experience

Date: 2026-07-29  
Status: **CURRENT MOBILE INPUT DIRECTION / EXISTING RUNTIME-ALIGNED / PHYSICAL-DEVICE TUNING OPEN**

> 目的: 390x844縦持ちのヴァンサバ系として、「考えず動ける」操作を正式なGame Design contractにする。
>
> 新しいvirtual stick UIを増やす文書ではない。現行`PlayerController`のpointer-drag入力を基準に、何を守り何を実機で調整するかを定義する。

Current runtime baseline:
- touch / mouse pointer anchor-drag
- movement area: left 52% × lower 46%
- dead zone: shortest side × 4%
- virtual stick-equivalent radius: shortest side × 22%
- keyboard fallback
- UI上のpointerはmovement inputとして扱わない

Exact ratiosはCurrent implementation値であり、Human device test後に調整可能。

---

# 1. Primary principle

> **戦闘中にPlayerが意識して操作する主入力は移動。**

Auto attackがCore。

Battleで常時必要な入力を増やさない。

避ける:
- attack button連打
- dodge button必須
- camera control
- 右スティックaim必須
- 3本指gesture

黒耀化 / pause等の明示actionは例外。

---

# 2. Input model

Current preferred model:

```txt
movement areaへ指を置く
↓
その位置がanchor
↓
anchorからのdeltaで移動方向/強さ
↓
指を離すと減速して停止
```

固定joystick位置ではなく**floating anchor**。

理由:
- 親指が決まった点へ正確に戻る必要がない
- 端末サイズ差へ強い
- UI chromeを増やさない
- ヨルノシルベの静かな画面と相性がよい

---

# 3. Movement area

現行:

```txt
x <= 52% screen width
y <= 46% screen height
```

つまり主に左下。

Current design direction:
- 初期defaultは左親指想定
- Player characterや敵を指で覆いにくい
- Stage HUD / LevelUp / Pauseと競合しない
- movement input開始点はUI外だけ

## Open before final lock

実機testで:
- iPhone mini相当
- standard
- large

それぞれで親指可動範囲を確認。

左利き対応として**mirror movement area option**を検討可能。
ただしrelease前にUI複雑化するなら、まずdefaultの快適性を優先。

---

# 4. Dead zone

Current runtime baseline:

```txt
shortest screen side × 0.04
```

目的:
- 指を置いただけでcharacterが震えない
- 小さい方向変更は反応する

調整判断:

dead zone too small:
- stopしづらい
- jitter
- UI近辺で誤移動

dead zone too large:
- 最初の反応が鈍い
- 細いrouteを通りにくい

Finalは数値だけでなく**停止しやすさ / 微調整しやすさ**で決める。

---

# 5. Stick radius / response

Current baseline:

```txt
shortest screen side × 0.22
```

anchorからこの距離でfull-speed相当。

Wanted feeling:
- 少し倒す = 微調整
- 普通に親指を動かす = cruising
- 大きく倒す = max movement

避ける:
- 5mm動かしただけで常時max speed
- max speedへ届くため親指を大きく伸ばす

---

# 6. Acceleration / deceleration

Current runtime baseline:
- moveSpeed around current config / fallback 3.35
- acceleration fallback 15
- deceleration fallback 18

これらは**implementation baselineでありfinal balance lockではない**。

Design intention:
- input開始はresponsive
- 方向転換に少しbody feel
- finger release時は素早く止まれる

ヴァンサバ系で慣性を強くしすぎない。

優先順位:

```txt
避けたい方向へすぐ動ける
>
動きに重量感がある
```

---

# 7. Finger occlusion

Mobileではfingerそのものが視界を隠す。

Rules:
- critical enemy telegraphをmovement area最下部だけに置かない
- Player重要状態を指下だけで示さない
- 黒耀化 gauge / HP / Pauseをmovement anchor近くへ置かない
- pickupがfinger下に大量滞留しても意味が分かるようにする

Optional test:
- finger silhouette overlayをcaptureへ重ねて視界監査

---

# 8. Character position

Camera / world designで、Player characterが常時画面中央固定とは限らないが、縦画面では:
- upper halfへ寄せすぎない
- bottom UIと重ねない
- finger occlusionと離す

Combat readable zoneを確保。

Exact camera behaviorはruntime/Stage testで決める。

---

# 9. Pause

Pauseは戦闘中に到達できる必要がある。

Rules:
- 一発で押せる
- movement areaと離す
- accidental pauseしにくい
- notch / safe areaを守る
- pause中はmovement inputを確実にblock/reset

Resume時:
- old anchorを保持して急に動き出さない
- new touchからmovementを再開

---

# 10. 黒耀化 action

黒耀化がmanual activationの場合:
- movementしながら意図して押せる
- Pauseより目立つが誤爆しにくい
- charge/ready/active/recoveryが色だけでなく形/animationでも分かる

重要:

> 黒耀化buttonを押すためにmovementを大きく中断させない。

ただしmultitouch requirementを過度に複雑にしない。
実機で「移動中に押せるか」を必須確認。

---

# 11. UI interaction priority

Current runtimeはpointer-over-UIをmovement開始/継続から除外する。

Design contract:

```txt
UI interaction wins over movement
```

ただし巨大な透明raycast panelでmovement areaを奪わない。

QA:
- invisible raycast blocker
- safe-area overlay
- modal残骸
- LevelUp close後のraycast

を確認。

---

# 12. LevelUp transition

LevelUp開時:
- movement input block
- velocityを止める
- old touchを再利用しない

Choice後:
- panelが消える
- 新しいtouchでbattle movement再開

選択tapがbattle復帰直後のmovement anchorとして誤解釈されないことを確認。

---

# 13. Left-handed option

Candidate:

```txt
Movement side:
[ Left ] [ Right ]
```

Right modeではmovement start areaを左右mirror。

ただし:
- HUD placementも必要に応じmirror/avoid
- 黒耀化buttonとの競合確認

「左利き対応」と書くだけでbuttonだけ反転しない。

Status: **CURRENT accessibility candidate, runtime not claimed**。

---

# 14. Keyboard / controller

KeyboardはEditor / desktop verificationで有効。

Production mobile Game Design上は:
- keyboard = development / optional desktop fallback
- controller = future optional

として、mobile UIをcontroller前提にしない。

---

# 15. Haptic relation

Movementそのものへ連続hapticを付けない。

Hapticは:
- heavy impact
- Evolution
- 黒耀化
- Boss / Dawn等

重要イベントへ予算を残す。

U49のtechnical haptic verificationとは別にcreative hierarchyを管理する。

---

# 16. Physical-device acceptance

最低3サイズで確認:

1. 片手でStage1 8分を完走できる
2. 30秒以内に操作説明を見なくても移動できる
3. stopしたい場所で止まれる
4. 細い敵間を抜けられる
5. 方向転換が遅いと感じない
6. 親指を無理に伸ばさずmax speedへ届く
7. 指でPlayer HP/主要telegraphが見えなくならない
8. LevelUp後に勝手に移動しない
9. Pause復帰後に勝手に移動しない
10. 黒耀化を移動中に意図して押せる
11. 10分相当でも親指疲労が過度でない
12. UIとmovementが誤競合しない

---

# 17. Metrics / evidence

Technical:
- touch down→movement開始latency
- input vector→velocity response
- false movement after modal
- unintended UI interaction

Human:
- thumb fatigue
- fine control
- stop confidence
- finger occlusion
- left/right reach

U50 performance/touch metricsと接続できるが、thresholdは実機測定前に捏造しない。

---

# 18. Runtime boundary

現行`PlayerController`に近い設計を採用しているが、この文書だけで:
- physical-device approved
- left-handed mode implemented
- U50 ready

にはならない。

変更時はcurrent runtimeの挙動を壊さない形で実機証跡を取る。

---

# 19. 一文

> **ヨルノシルベの操作は、画面にスティックを置いて操作させるのではなく、親指を置いた場所から自然に歩けて、Playerの意識をbuildと敵の読みへ戻せる操作にする。**