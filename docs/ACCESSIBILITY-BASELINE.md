# ヨルノシルベ Accessibility Baseline

Date: 2026-07-29  
Status: **CURRENT BASELINE / PLATFORM-SPECIFIC IMPLEMENTATION EVIDENCE SEPARATE**

> 目的: 詳細なcomponent matrixがPROPOSEDのままでも、releaseへ向けて最低限絶対に守るaccessibility契約だけはCurrentにする。

Related:
- `docs/design-component-state-accessibility-matrix-v1.md`
- `docs/MOBILE-CONTROL-EXPERIENCE.md`
- `docs/FIRST-RUN-EXPERIENCE.md`
- `docs/AUDIO-HAPTIC-DIRECTION.md`

---

# 1. Information must survive one channel disappearing

Critical informationを1つのchannelだけへ置かない。

禁止:
- colorだけでrare / locked / damageを区別
- soundだけで成功/失敗
- hapticだけでdamage / rare
- animationだけでstate transition

最低2つを組み合わせる:
- text
- shape
- position
- icon
- color
- motion
- audio
- haptic

---

# 2. Touch targets

Baseline:
- minimum interactive hit area: **44x44pt相当以上を目標**
- frequent/primary action: comfortable sizeを優先
- visible iconが小さくてもhit areaは広げる
- safe areaを装飾より優先

Exact Unity pixel mappingはdevice scaleを確認して実装する。

---

# 3. Typography

Current minimum direction:
- Body: Compact 14相当 / Standard 15相当以上を基準
- Button: Compact 15 / Standard 16相当以上を基準
- Caption 11相当は補助情報のみ
- critical numericは大きく明瞭に

Rules:
- Auto Size任せにしない
- 長文をNight backgroundへ直置きしない
- important conditionをtooltipだけに隠さない
- ellipsisで意味が変わるならlayoutを変える

---

# 4. Contrast / state

Paper UI:
- ink textを基本

Night scene:
- 長文禁止
- outline / backing / local contrastを使う

State:
- Selected
- Disabled
- Locked
- Rare
- Evolution
- 黒耀化

をcolorだけで表現しない。

---

# 5. Reduced motion

Reduced Motion modeでは:
- large zoomを削る
- camera shakeを削る/無効
- long travel animationを短縮
- lantern pulseをstatic haloへ
- ink spreadをfinal shape + short fadeへ

重要:

> **motionを減らしても操作可能になる時刻を遅くしない。**

Reward hierarchyはstatic light / shape / sound optionalで残す。

---

# 6. Flash safety

- full-screen white flashを常用しない
- repeated high-contrast flashingを避ける
- climaxもshort one-shot
- reduced motionではflashをさらに削る

Combat readabilityを派手さより優先。

---

# 7. Audio / haptic alternatives

Audio offでも:
- LevelUp
- rare
- damage
- black-youka ready
- Dawn

が理解できる。

Haptic unavailable/offでも同じ。

Volume controls候補:
- Master
- BGM
- SE
- Haptic toggle

---

# 8. Semantic order

Platform-specific VoiceOver実装は別technical taskだが、screenの意味順はCurrentで固定する。

```txt
Screen title
→ current status
→ primary content
→ selection state
→ primary action
→ secondary action
→ navigation / close
```

Decorative imageはsemantic contentにしない。

Icon-only actionはaccessible name必須方向。

---

# 9. Selection content

LevelUp card等は意味として:
- name
- type
- level / rarity where relevant
- effect
- selected state
- action

を持つ。

weapon/passive/rare/evolutionを見た目だけで区別しない。

---

# 10. Locked / Disabled distinction

Locked:
- 未解放
- reason確認可能

Disabled:
- 現在条件不足
- 条件が変われば使える

同じ灰色表現にしない。

---

# 11. Error / empty state

Empty:
- 何が空か
- なぜ空か
- 次に何をすると増えるか

Error:
- technical codeを主表示にしない
- retry / back / safe continuationを提示

「データがありません」だけで終わらせない。

---

# 12. First-run accessibility

First Runでは:
- modal説明を連打させない
- movement hintは短く消える
- HUDを一度に全部説明しない
- first LevelUpのprimary choiceを明確化
- Result→next actionを順番で見せる

理解を文章量で補わない。

---

# 13. Mobile-specific baseline

- movement areaとUI actionを重ねない
- finger occlusionへcritical infoを置かない
- pauseは一発到達
- LevelUp/Pause後にold touchで勝手に移動しない
- left/right hand差をphysical testで観測

---

# 14. Cognitive load

1screenのPrimary actionは原則1つ。

Combat:
- new mechanicを同時に複数教えない

LevelUp:
- 3choicesを比較可能にする

Result:
- result
- reward
- new unlock
- next action

の順。

---

# 15. Discoverability test

初見Human testで:
1. 5秒程度でprimary actionを指せるか
2. selected / locked / disabledを区別できるか
3. 戻り方が分かるか
4. 音OFFでも操作結果が分かるか
5. motion reducedでもstate changeが分かるか
6. 指でcritical infoが隠れないか

Exact time thresholdはtest後にlock可能。

---

# 16. Platform implementation boundary

このbaselineだけで:
- VoiceOver implemented
- Dynamic Type fully supported
- all devices accessibility approved

とは扱わない。

各platformで:

```txt
semantic design
→ implementation
→ device test
→ evidence
```

が必要。

---

# 17. Relation to proposed matrix

`design-component-state-accessibility-matrix-v1.md` は詳細設計reservoirとして継続。

本書と衝突した場合:
- 本書のBaselineを最低条件
- Matrixの詳細stateはimplementation前にreview

とする。

---

# 18. 一文

> **ヨルノシルベは、色・音・振動・派手なmotionのどれか一つが使えなくても、何が起き、何を選べて、次に何をすればよいかが残る設計にする。**