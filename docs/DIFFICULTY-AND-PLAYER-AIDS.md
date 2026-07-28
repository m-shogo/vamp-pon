# ヨルノシルベ Difficulty / Player Aid Philosophy

Date: 2026-07-29  
Status: **CURRENT DESIGN DIRECTION / EXACT MODIFIERS NOT LOCKED**

> 目的: 難易度を「敵HP倍率」ではなく、Playerがどんな圧力を読み、どれだけ支援を受けるかとして設計する。

Related:
- `docs/COMBAT-RUN-DESIGN.md`
- `docs/STAGE-ENCOUNTER-DESIGN.md`
- `docs/FIRST-RUN-EXPERIENCE.md`
- `docs/FUN-BALANCE-PLAYTEST.md`

---

# 1. Difficulty exists for choice, not punishment

Difficultyを分ける理由:
- Storyを見せる/見せないためではない
- 上手いPlayerへ作業量を増やすためではない
- reward倍率だけで釣るためではない

目的:

> **同じCoreを、違うpressureと許容幅で楽しめるようにする。**

---

# 2. Baseline philosophy

通常難易度は作品の基準。

想定:
- 初見でも学習すればClear可能
- build失敗が即run終了にならない
- Evolution / 黒耀化へ到達しやすい
- Supportの価値が分かる
- Story/Happy Endへ普通に到達できる

Story completionをHardへ置かない。

---

# 3. Easy / Assist direction

Easy/Assistは恥ずかしいmodeとして扱わない。

Playerへ与えられる候補:
- contact damage緩和
- enemy speed緩和
- pressure direction数を減らす
- pickup radius増加
- LevelUp choice comfort
- revival comfort
- clearer telegraph
- 黒耀化recovery緩和

避ける:
- enemyをほぼ出さずCoreが消える
- auto clear
- reward/Storyを大きく削る
- UIで「初心者向け」「下手な人向け」と煽る

---

# 4. Hard direction

Hardで優先して上げる:

```txt
1. enemy direction variety
2. movement pattern overlap
3. controller + movement pressure
4. telegraph response demand
5. elite timing
6. spatial restriction
7. speed/contact threat
8. HP modestly
```

HP spongeを最後にする。

Hardでも敵を倒す快感は残す。

---

# 5. Story access

Canonical Happy End / Main Storyはstandard clearで到達可能。

Hard rewardは:
- Clear Getter
- cosmetic / record
- alternate build unlock
- challenge proof
- optional lore fragment

などに寄せられる。

禁止:
- HardをクリアしないとMain endingが欠落
- accessibility assistを使うとStory不可

---

# 6. Reward difference

Hard reward差を付ける場合も、Normalを損に見せない。

良い:
- challenge-specific star mark
- extra meta currency modest bonus
- special Clear Getter
- unique cosmetic

悪い:
- Normal reward半減
- Hardだけ必須Character unlock
- Hard周回が圧倒的効率で他difficultyが死ぬ

---

# 7. Player aids as orthogonal settings

DifficultyとAccessibilityを全部同じsliderにしない。

Separate candidate aids:
- reduced motion
- stronger telegraph contrast
- damage number simplify
- pickup assist
- movement side
- larger touch targets
- haptic off
- screen shake off

これらを使ってもdifficulty accomplishmentを不必要に無効化しない。

---

# 8. Black-youka and difficulty

Hardほど黒耀化を必須化しない。

狙い:
- Hardではrisk/rewardの価値が上がる
- しかしno-黒耀化clearも成立
- special Clear Getterで両方のplaystyleを促す

例:
- 黒耀化を1回以上使ってClear
- 黒耀化なしでClear

どちらも遊び方として扱う。

---

# 9. Difficulty scaling by stage

全Stageで同じ倍率表を掛けるだけにしない。

Stage identityを壊さず:
- Stage1: direction / density
- Stage2: target / mark ambiguity
- Stage3: seal / reopen timing
- Stage4: route uncertainty
- Stage5: repair state / persistent field

のように**そのStageの問いを難しくする**。

---

# 10. Failure readability

高難易度でも死因が分かること。

PlayerがResultで:
- damage source
- time
- stage pressure
- build state

から大体の原因を推測できる。

「何が起きたか分からず死ぬ」はHardではなくreadability failure。

---

# 11. Adaptive difficulty

自動で敵を弱く/強くするhidden adaptive difficultyはdefault採用しない。

理由:
- build改善の成果が分かりにくくなる
- Clear Getter条件が曖昧になる
- player agencyを損ねる

必要なら明示的Assistとして提供する。

---

# 12. Playtest questions

各difficultyで確認:

1. 敵を倒す快感が残っているか
2. 難しさの原因を説明できるか
3. HardがHPだけになっていないか
4. EasyでもCore loopが消えていないか
5. Normalが中途半端なmodeになっていないか
6. Support選択が変わるか
7. build diversityが変わるか
8. no-黒耀化clearが可能か
9. Story accessに不当なgateがないか
10. Assist使用でUIが罪悪感を与えていないか

---

# 13. Runtime boundary

Exact:
- damage multiplier
- enemy speed multiplier
- spawn multiplier
- HP multiplier
- reward multiplier

はplaytest前にfinal lockしない。

---

# 14. 一文

> **ヨルノシルベの難易度は、敵をスポンジにすることではなく、同じ夜をどれだけ多くの方向から読まなければならないかを変える。**