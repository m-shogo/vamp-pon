# ヨルノシルベ Kagemono Ecology / Encounter Recipes v1

Date: 2026-07-29  
Status: **CURRENT ENEMY BEHAVIOR GUIDE / EXACT SPAWN BALANCE OPEN**

> 目的: 48体を個別データの羅列で終わらせず、「一緒に出た時にどう見えるか」「同じ夜の生態としてどう振る舞うか」を統一する。
>
> 生態 = 生物学的な種族設定ではない。カゲモノは固定された意味が黒インク化した存在であり、**似たwrong readingが近くで互いを強めるように見える**程度の世界挙動を扱う。

関連:

- `docs/ENEMIES.md`
- `docs/enemy-encounter-relationship-pressure-v1.md`
- `src/game/data/enemyProductionDatabase.ts`
- `docs/enemies/omb-ombro-selected-direction.md`

---

# 0. Enemy hierarchyではなく「固定の濃さ」

カゲモノを軍隊にしない。

```txt
オンブ
= 小さい固定 / noise / fragment

オンブロ
= 長く残った固定 / 大きいpressure

Elite
= 特定の読み方がarena behaviorまで変える

Great Shadow
= 場所全体が一つのwrong answerへ固まった状態
```

オンブロがオンブの上司という設定ではない。
Bossが「命令」して雑魚が従う必要もない。

同じ方向へ動く時も:

> **同じ意味へ引っ張られている**

ように見せる。

---

# 1. Shared nonverbal behavior

## 1.1 普段

- Playerへ向く前にmotifへ一瞬反応してよい
- 近い同系統が同じ方向へ少し傾く
- 完全同期はしない
- idle周期をずらす
- 影炎の揺れを揃えない

「群れ」でもclone armyに見せない。

## 1.2 攻撃前

攻撃予兆は個体優先。
周囲のLore演出よりtelegraphを明確にする。

## 1.3 撃破

近くの同系統が一瞬だけ:

- 影炎を縮める
- 進路を変える
- motifへ寄る

程度の反応をしてもよいCandidate。

悲鳴 / 復讐行動で人格ある家族群へ寄せない。

---

# 2. Ombu family behavior

オンブは**小さな意味の固定**。

共通feel:

- 軽い
- 数がいる
- 一体は単純
- 組み合わせでrouteが変わる
- かわいさは表情でなくmotion

## Good group motion

```txt
前列: 少し速い個体
中央: basic approach
後列: delayed / wavering
```

全員同速度の丸い壁を避ける。

## Visual rule

大量にいても:

- 目
- インク芽
- silhouette modifier
- attack cue

のどれかが1xで読める。

---

# 3. Omburo family behavior

オンブロは**routeへ圧をかける重い存在**。

役割:

- 壁
- anchor
- lane control
- reach threat
- support pressure

通常オンブを強化する「buffer」へ固定しない。
Omburo自身の身体 / 擬手 / object motifがpressureになる。

## Group relation

オンブロが前へ出ることで:

- 小型オンブが左右へ流れる
- Playerの逃げ道が変わる

のは良い。

「オンブロを倒すまで全雑魚無敵」のような単純支配関係は多用しない。

---

# 4. Ecology clusters

## A. Name / Label cluster

Current:

- オンブ 名札
- オンブ 消印
- オンブ リボン
- オンブロ 名札
- Boss46 持ち主のない名前

Shared feel:

> **整理しようとして、逆に誰のものか分からなくなる。**

見せ方:

- labelが増える
- markが付く
- target候補が重なる

禁止:

- 小さい日本語文字をenemy bodyへ大量表示
- UIだけで混乱させる

silhouette / movementは最後まで読める。

---

## B. Box / Seal cluster

Current:

- オンブ しおり
- オンブ 鍵穴
- オンブロ 月箱
- Boss47 閉じた朝箱

Shared feel:

> **閉じるほど安全に見える。閉じ続けるほど動けなくなる。**

Encounter:

- temporary cover
- hardening
- route narrowing
- open-window counter

Playerへ「箱 = 壊す物」だけを学習させない。
開く / 閉じるtimingを変える。

---

## C. Route / Station cluster

Current:

- オンブ 切符
- オンブ 方位
- オンブ 地図ピン
- オンブ 犬切符
- オンブ 古梟
- オンブロ 迷針
- オンブロ 改札
- Boss48 帰路のない夜

Shared feel:

> **進めるが、同じ道に居続けると危ない。**

Mechanics:

- straight dash
- stop / redirect
- lane close
- reverse path
- safe route update

このclusterは移動ゲームとして気持ちよくする。
迷路UIを読ませる時間を増やしすぎない。

---

## D. Repair / Trace cluster

Current:

- オンブ 消し跡
- オンブ 糸
- オンブ 片ボタン
- オンブ 古写真
- オンブロ 継ぎ目

Shared feel:

> **直した跡 / 消した跡 / 残った跡が次の移動へ影響する。**

Mechanics:

- trail
- lingering floor
- temporary repaired obstacle
- weakpoint seam

「傷 = damage zone」だけにしない。
一部traceはPlayerが利用できてもよい。

---

## E. Dream / Water cluster

Current:

- オンブ 青灰
- オンブ 羊夢
- オンブ 朝露
- オンブロ 夢波

Shared feel:

> **移動が少し遅れて見える / 揺れる / 同じ場所へ戻る。**

注意:

夢Themeだから操作反転 / screen blurを乱用しない。
酔いや可読性低下より:

- wave timing
- delayed path
- slow moving field

を優先。

---

## F. Black Fold cluster

Current:

- オンブ 紫黒
- オンブ 烏紙
- オンブ 狼火
- オンブロ 黒折

Shared feel:

> **隠す / 折る / 近づきすぎる。**

Combat:

- diagonal movement
- form change
- sudden close pressure

Shadow charactersの専用軍勢にはしない。
同じThemeへ共鳴しやすいだけ。

---

## G. Observation / Archive cluster

Current:

- オンブ 窓
- オンブ レンズ
- オンブ 古写真
- オンブ 押花

Shared feel:

> **見えたもの / 保存されたものだけを真実と誤読する。**

Mechanics:

- side glide
- visual decoy
- afterimage
- preserved hazard

UI opacityを落としすぎて見えなくするのは禁止。

---

## H. Light / Dawn cluster

Current:

- オンブ 朝露
- オンブ マッチ
- オンブ 白蛾
- オンブロ 継ぎ目

Shared feel:

> **朝へ向かう物まで夜の固定へ巻き込まれている。**

Warm lightを敵の主色にしない。
Player lantern / pickup readabilityを奪わない。

---

# 5. Encounter recipe rules

1 encounterへ役割を詰め込みすぎない。

推奨:

```txt
1 x anchor/controller role
+
1 x movement pressure
+
0-1 x small modifier
```

例:

```txt
Omburo gate
+ ticket Ombu
+ compass Ombu少数
```

良い理由:

- gateが主問題
- ticketが移動を促す
- compassがroute変更を足す

悪い:

```txt
gate + blackboard + dream wave + lens + bell + compass
```

何を読めばいいか分からない。

---

# 6. Recipe 01 — Soft Swarm

Core:

- オンブ 墨
- オンブ 青灰

Purpose:

- basic movement
- weapon feedback
- pickup rhythm

Variation:

- 墨 = direct
- 青灰 = slight wavering

序盤にLore gimmickを足さない。
「倒す気持ちよさ」を先に作る。

---

# 7. Recipe 02 — Label Drift

Core:

- オンブ 名札
- オンブ 消印
- オンブロ 名札

Purpose:

- target focus
- mark confusion

Structure:

```txt
最初:
名札だけ

次:
消印が停止timingを作る

後:
オンブロ名札が横回りpressure
```

同時にlabel effectを3種類出さない。

---

# 8. Recipe 03 — Narrowing Gate

Core:

- オンブ 切符
- オンブロ 改札

Optional:

- オンブ 地図ピン

Purpose:

- lane selection
- route change

Gateが閉じる直前はticket chargeを一瞬減らすなど、telegraph競合を避ける。

---

# 9. Recipe 04 — Broken Compass

Core:

- オンブ 方位
- オンブロ 迷針

Purpose:

- direction cue
- update old decision

Playerが「針を見る」ことを覚えた後、迷針で二方向へ割る。
最初から二重cueにしない。

---

# 10. Recipe 05 — Repair Trail

Core:

- オンブ 糸
- オンブ 消し跡
- オンブロ 継ぎ目

Purpose:

- floor memory
- path planning

重要:

残るtraceの寿命 / 見た目を統一して、昔のhazardと今のtelegraphを区別する。

---

# 11. Recipe 06 — Quiet Dream

Core:

- オンブ 青灰
- オンブ 羊夢
- オンブロ 夢波

Purpose:

- slower rhythmic dodge

高速enemyを大量に混ぜない。
Dream encounterは「難しい」より**別tempo**を作る。

---

# 12. Recipe 07 — Folded Ambush

Core:

- オンブ 烏紙
- オンブ 狼火
- オンブロ 黒折

Purpose:

- diagonal threat
- close-range risk
- form read

Telegraph:

- fold line
- forward sharpen

を共有visual languageにする。

---

# 13. Recipe 08 — Archive Error

Core:

- オンブ 古写真
- オンブ レンズ
- オンブ 押花

Purpose:

- recorded image vs current behavior

Candidate:

古写真が短いafterimageを残し、レンズ個体だけ本体輪郭を一瞬歪める。

ただしPlayer攻撃判定 / enemy hitbox自体を嘘にしすぎない。

---

# 14. Recipe 09 — Closed Safety

Core:

- オンブ 鍵穴
- オンブロ 月箱

Purpose:

- hardening
- flank / wait / open-window

Boss47のtutorial grammarにもなる。

```txt
small keyhole:
近づくと硬い

moon box:
蓋openingが攻撃予兆 / weak window

Boss47:
safe areaそのものが閉じる
```

mechanic vocabularyを段階学習させる。

---

# 15. Recipe 10 — Dawn Contrast

Core:

- オンブ 朝露
- オンブ マッチ
- オンブ 白蛾

Purpose:

- heal / temporary power motifとの見間違いを防ぎつつThemeを対比

重要:

Enemy朝露 / マッチをpickupと同じsilhouette / brightnessへしない。

```txt
pickup = warm / clear / readable
Kagemono = black core first, motif second
```

---

# 16. Boss lead-in

Boss直前にBoss mechanicを全部tutorialしない。

良いlead-in:

```txt
Boss46前:
labelの信頼性が少し揺らぐ

Boss47前:
閉じる安全 / open windowを知る

Boss48前:
route更新 / reverse lineを知る
```

Bossは既知grammarを**組み替える**。
完全新ruleを10個出さない。

---

# 17. Telegraph collision rule

複数enemyの予兆が重なる時:

優先順位:

```txt
lethal / boss
> hard movement blocker
> medium attack
> small contact
> ambient lore effect
```

同じ色 / 同じ線幅 / 同じ音を同時に使わない。

Theme上「全部黒インク」でも、telegraph channelまで全部黒にしない。

---

# 18. Audio / haptic implication — DESIGN ONLY

U49の実装 / readinessを変更しない。
将来設計として:

- swarmは個体ごとにSEを鳴らさない
- controller / elite cueを優先
- route gate / boss phaseは位置変化が分かるcue
- hapticは全enemy attackへ付けない
- character damage / major threatとのpriority競合を避ける

**この文書はU49 completion evidenceではない。**

---

# 19. Performance implication — DESIGN ONLY

大量swarmで:

- transparent particles
- independent shadow flame
- per-enemy dynamic light
- per-enemy text label

を無制限に増やさない。

Enemy identityはshader負荷ではなく:

- silhouette
- motion
- few accent pixels
- shared batched effect

で作る。

U50 thresholdは別authorityであり、この文書で数値をLOCKしない。

---

# 20. 一文

> **カゲモノは48体の孤立したモンスターではなく、同じ夜で“意味が固まる仕方”の違いとして群れ、組み合わせた時に一つの戦闘文法を作る。**
