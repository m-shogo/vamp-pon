# ヨルノシルベ — World Setting Conflict Register v3

Date: 2026-08-11  
Status: **CONTRADICTION CONTROL / MASTER-ALIGNED / ZERO UNRESOLVED BLOCKERS**

> 最上位: `00-current-story-world-master.md`。
> `OPEN_HUMAN`は欠陥ではなく、意図的にHuman decisionへ残している項目。

---

# 1. Status

- `GUARDED` — 上流ruleで両立方法を固定済み。
- `OPEN_HUMAN` — Human decision前に確定しない。
- `CANDIDATE_DEPENDENT` — 別Candidate / evidence次第。
- `UNRESOLVED_BLOCKER` — 現在の資料同士が両立しない。0維持。

---

# 2. Conflict lanes

| ID | Topic | Status | Current guard |
|---|---|---|---|
| CF-001 | Current21年代差 / Core5 distinct era | GUARDED | Reality eraとDream共存を分離。**Core5は5/5で別Reality era**。誰がどの年代かはOpen。Dream内では時間タグが弱い。 |
| CF-002 | 夢世界 vs 最終mechanism | OPEN_HUMAN | **ヨルノシルベ=夢世界は決定**。起源 / 共有mechanism / 最終正体だけOpen。 |
| CF-003 | Game Over / Death | GUARDED | Game Over≠Reality death、Retry≠蘇生、帰還はWaking。 |
| CF-004 | 死者がDreamへ現れるか | OPEN_HUMAN | 生者 / 過去時点本人 / Record残響をHuman decisionまで分離。 |
| CF-005 | 八影 / 朔盟 / 朔夜座 | GUARDED | 八影=early observer label、朔盟=Superseded Candidate、**朔夜座=Current formal name**。 |
| CF-006 | Shadow5 / 朔夜座 | GUARDED | 自動的に同Faction化しない。 |
| CF-007 | 朔夜座Founder / 絶対Leader | OPEN_HUMAN | 名前決定だけで絶対首領を追加しない。旧pair資産は保持可能。 |
| CF-008 | Stage20地理 | GUARDED | Gameplay順≠Reality隣接。Dreamでは異年代場所を折り畳める。 |
| CF-009 | 全Characterを一事故へ接続 | GUARDED | 全員同じ悲劇 / 一事件 / 一黒幕へ収束させない。 |
| CF-010 | Gameplay economy / Reality economy | GUARDED | Run資源≠現実通貨。Dreamの基本衣食住に通常経済を必須化しない。 |
| CF-011 | Belief / metaphysical truth | GUARDED | 星 / 宗教 / 噂は真相証明ではない。 |
| CF-012 | Major family facts | OPEN_HUMAN | 日常home textureは作れるが重大死別 / 親子等は勝手にLOCKしない。 |
| CF-013 | exact height / age / era | OPEN_HUMAN | 相対bandで制作し、exact値はHuman review後。Core5もdistinctだけHardで個人割当はここに含めOpen。 |
| CF-014 | 黒耀化 / 病気・憑依 | GUARDED | 本人の長所 / 願いの過剰化。外部悪人格にしない。 |
| CF-015 | Named Object lineage | CANDIDATE_DEPENDENT | 似ているだけでsameObjectにしない。stable ID / evidence優先。 |
| CF-016 | Future15 promotion | GUARDED | World利用だけでCurrentへ昇格しない。 |
| CF-017 | Generated visual / Character Canon | GUARDED | 生成事故detailをCanonへ逆流させない。 |
| CF-018 | P2 / runtime | GUARDED | World設定追加≠runtime完成。 |
| CF-019 | Dream provisioning / 直接生成 / 万能願望 | GUARDED | **食 / 飲 / 日用品は食糧庫・冷蔵庫・棚・厨房等の収納を介し「最初から入っていた」ように見つかる。手元 / 空中への直接food spawnはSuperseded。** 心 / 同意 / 記憶真実 / Unique evidence / 黒耀化 / 現世事件は補完不可。 |
| CF-020 | 同じ星 / 年代別星座 | GUARDED | 星が同じでも結び方 / 名 / 物語 / 存在が年代で変わり得る。最終原因はMystery。 |
| CF-021 | 群青残響録 / 固定時代Boss | GUARDED | 群青残響録=大事件中心人物 / 人物群の後世的記録名。1時代1人 / 固定人数 / 必須戦闘Boss / 必須悪役にしない。 |
| CF-022 | 朔夜座 / 群青残響録 hierarchy | GUARDED | 上司 / 部下 / Creator関係へ固定せず時代ごとに協力・利用・対立等を変えられる。 |
| CF-023 | Reality動物 / 星獣 | GUARDED | 犬猫は星獣と別category。万能賢者 / 魂証明装置にしない。 |
| CF-024 | Android成長 / 人間化 | GUARDED | 「人間になる」をgoalにせずAndroidのまま個人・友達になれる。 |

---

# 3. Current summary

Machine source:
`src/game/data/worldSettingConflictRegister.ts`

```txt
TOTAL                = 24
GUARDED              = 18
OPEN_HUMAN           = 5
CANDIDATE_DEPENDENT  = 1
UNRESOLVED_BLOCKER   = 0
```

---

# 4. Highest-priority Open decisions

現在の作業を止めないが、以下へ踏み込む直前にUser consultationする。

1. ヨルノシルベの最終mechanism / 起源
2. 死者が本人としてDreamへ現れるか
3. 朔夜座のFounder / 絶対Leaderを置くか
4. 主要Characterの重大Family fact
5. exact age / height / exact era
6. **Core5 5人それぞれのexact person-to-era mapping**

加えてMasterでOpen指定された:

- 群青残響録正式member / 名
- 各時代大事件のexact内容
- Android最終名 / acronym / version体系
- 星座増減の最終原因
- 星獣との最終関係
- 各大事件に戦闘Bossを置くか
- 飲酒 / 喫煙CharacterのFinal age / era整合とperson assignment

は勝手にCanon化しない。

---

# 5. Future rule

新案がMasterと衝突したら:

1. Masterを旧案へ戻さない。
2. 既存stable資産を即削除しない。
3. 本RegisterへConflict laneを追加または既存laneを強化。
4. Derivedで安全に解ければ`GUARDED`。
5. 高影響なら`OPEN_HUMAN`。
6. `UNRESOLVED_BLOCKER > 0`のままFinal Character Master / Final Canonへ進めない。