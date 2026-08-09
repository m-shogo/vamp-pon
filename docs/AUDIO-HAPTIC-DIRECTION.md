# ヨルノシルベ Audio / Haptic Creative Direction

Date: 2026-07-29  
Status: **CURRENT CREATIVE DIRECTION / U49 TECHNICAL READINESS UNAFFECTED**

> 目的: U49のrouting / latency / Core Haptics実証とは別に、「何をどんな音・振動で感じさせるか」をCurrent master化する。

Related:
- `docs/unity-game-feel-cookbook.md`
- `docs/COMBAT-RUN-DESIGN.md`
- `docs/BLACK-YOUKA.md`
- `docs/unity-u49-actual-device-audio-haptic-plan-2026-07-21.md`

---

# 1. Audio identity

ヨルノシルベの音は:
- 夜
- 紙
- 小さな灯り
- 黒インク
- 記憶片
- 朝

を軸にする。

派手なfantasy battle orchestraを常時鳴らさない。

> **静けさがあるから、小さい音が報酬になる。**

---

# 2. Dynamic range philosophy

全部を大きくしない。

Priority hierarchy:

```txt
ambient / room tone
< normal attack / pickup
< LevelUp / elite
< Evolution
< 黒耀化
< Boss defeat / Dawn
```

常時max loudnessにしない。

---

# 3. BGM dramaturgy

## TOP
- 静か
- 余白多め
- 1つの小さいmotif

## Stage Select
- 道 / 夜の広がり
- battle前に煽りすぎない

## Battle opening
- rhythmを早めに提示
-低密度

## Mid battle
- layer追加
- player growthと一緒に少し厚くなる

## Climax
- percussion / pulse等を増やせる
- melody全部盛りにしない

## Dawn
- battle layerを抜く
- warm harmonic resolution
- 勝利jingleだけで終わらせず呼吸を作る

---

# 4. Intentional silence

無音/低音数を失敗扱いにしない。

使える場面:
- 黒耀化直前
- Boss phase change
- Dawn直前
- 特定Story beat

ただし「音assetが無い」状態と区別する。

U49の`INTENTIONALLY_DISABLED`等のmachine-readable policyと矛盾させない。

---

# 5. Normal attack

要求:
-短い
-柔らかい
-連射しても疲れない
- pitch/variationでmachine-gun感を避ける

Normal hitへ毎回強hapticを付けない。

---

# 6. Enemy defeat

敵の死亡爆発ではなく「ほどける」音。

Layer候補:
- ink tear / soft burst
- paper fiber
- small memory chime

Normalは短い。
Elite/Bossだけ低域と余韻を増やす。

---

# 7. Memory fragment pickup

最重要micro rewardの一つ。

方向:
- small pitch-up
- muted glass / wood / paper hybrid
- coin soundにしない

連続pickup:
- pitch ladderを軽く使える
- 上がり続けて耳障りにならないようreset

目的:

> fragment streakを耳でも感じる。

---

# 8. LevelUp

Sequence:

```txt
battle duck/freeze
→ paper open / light cue
→ card reveal
→ select
→ paper confirm
→ battle return
```

Card revealは短く。
Rareだけ少しseal-like accent。

---

# 9. Evolution

EvolutionはLevelUpより明確に上。

欲しい:
- convergence
- before→afterの変化
- completion

Avoid:
- casino jackpot
- huge EDM drop
- long fanfare

Battleへ戻った直後、新weapon sound自体で変化を感じる。

---

# 10. 黒耀化

黒耀化は「evil transformation」soundにしない。

Three phases:

## Ready
- tension
- ink pressure

## Activate
- brief silence/duck
- ink slash
- lantern core
- low impact

## Recovery / 煤返り
- powerが消えるというより、息を吐く
- high frequencies / layersが抜ける

Character-specific差は将来:
- name
- box
- route
- repair
- etc.

のmotifで出せる。

---

# 11. Character motifs

全21人へ長い専用theme曲を作る必要はない。

候補:
- 2〜4音motif
- instrument color
- UI accent
- black-youka variant

Main 5から優先。

Character motifがBattle BGMを毎回乗っ取らない。

---

# 12. Star Beast sound

星獣をhuman voice mascot化しない。

音候補:
- tiny breath
- footstep
- bell-like cue
- fabric / wing / paw-specific subtle cue

情報用途:
- assist ready
- danger notice
- bond proximity

可愛さのために鳴き続けない。

---

# 13. UI sound

Paper UI:
- page
- tab
- seal
- pencil/ink

ただし毎tapに大きな紙音を付けない。

Hierarchy:
- hover/selection: tiny
- confirm: clear
- irreversible/important: distinct

---

# 14. Result Clear

Clearは:

```txt
combat noise減る
→ dawn air
→ page
→ seal
→ rewards
```

朝が一番大きい音ではなく、**一番開けた音**になる。

---

# 15. Result Defeat

罰の低音boomを使わない。

- battle layer fades
- ember remains
- paper/result cue

Retryへ心理的に戻りやすい音。

---

# 16. Haptic hierarchy

Hapticは少ないほど価値が出る。

Candidate hierarchy:

## H0 none
- movement
- normal pickup streak
- normal attack

## H1 micro
- card selection
- rare pickup

## H2 light-medium
- LevelUp confirm
- elite defeat
- damage warning if useful

## H3 strong
- Evolution
- 黒耀化 activate
- Boss major phase

## H4 special
- Dawn / major completion

毎イベント振動させない。

---

# 17. Haptic semantics

同じ強さだけで分類しない。

- confirm = crisp
- impact = short heavy
- charge = staged
- warning = distinct pulse
- Dawn = softer completion pattern

Core Hapticsでtexture差を出せる場合も、実機検証必須。

---

# 18. Accessibility

- master volume
- BGM
- SE
- haptic off

は最低候補。

音だけでdangerを伝えない。
Hapticだけでcritical informationを伝えない。

hearing/haptic unavailableでもplayable。

---

# 19. Ear fatigue audit

8〜10分runで確認:
- weapon loop fatigue
- pickup streak fatigue
- enemy hit density
- repeated LevelUp sound
- black-youka loudness

特にhigh-rate weaponのSEは単発で良くても連射で破綻する。

---

# 20. Physical-device review

U49 human reviewへcreative観点を接続:

- speakerでsmall soundsが消えない
- headphoneでharshでない
- max volume前提でmixしない
- hapticとSEが同時に過剰でない
- background/foreground復帰でloop破綻しない

Technical PASSとcreative GOODは別に記録する。

---

# 21. Runtime boundary

この文書で:
- audioReady=true
- hapticReady=true
- latency measured

にはならない。

U49実機gateは従来通り。

---

# 22. 一文

> **ヨルノシルベの音と振動は、画面を派手に補強するためではなく、静かな夜の中で「ほどけた」「拾えた」「選んだ」「朝へ届いた」という小さな確信を身体に残すために使う。**