# ヨルノシルベ World Hub

Date: 2026-08-11  
Status: **CURRENT WORLD-SETTING ENTRYPOINT / CANON-CANDIDATE BOUNDARIES PRESERVED**

> 世界・社会・地理・歴史・生活・秘密・朔夜座・群青残響録・制作表現を考える時はここから入る。
> 古いworld memoを検索して直接Current authorityへ戻さない。
> **物語・年代・夜・星空・朔夜座・群青残響録については `docs/00-current-story-world-master.md` が現時点の最上位Authority。**

---

# 1. Read first

1. `docs/00-current-story-world-master.md`
2. `docs/CANON.md`
3. `docs/world-foundation-authority-v1.md`
4. `docs/world-setting-conflict-register-v1.md`
5. 必要なdomainだけ下記へ

全32項目のcoverage:
- `docs/world-setting-expansion-index-v1.md`

世界設定の矛盾監査:
- `docs/world-setting-conflict-register-v1.md`
- `src/game/data/worldSettingConflictRegister.ts`

Human consultation router:
- `docs/world-human-decision-queue-v1.md`

Stage20への実配置:
- `docs/stage-world-lore-integration-v1.md`
- `src/game/data/stageWorldLoreIntegration.ts`

原則:
> `UNRESOLVED_BLOCKER > 0`の状態でFinal Canon / character master productionへ進めない。

ただし、`00-current-story-world-master.md` で **HARD DECISION / USER-DECIDED** とされた内容を旧Candidateへ戻さない。

人気長期IPとの資料gap監査:
- `docs/franchise-content-gap-audit-v1.md`

---

# 2. P0 — 世界の骨格

| Area | Source |
|---|---|
| Current Story / World highest authority | `00-current-story-world-master.md` |
| 世界Authority / Layer | `world-foundation-authority-v1.md` |
| Institution / Faction | `world-institution-faction-map-v1.md` |
| Geography / Travel | `world-geography-travel-atlas-v1.md` |
| Knowledge / Secret | `world-knowledge-secret-matrix-v1.md` |
| Historical Incident | `world-historical-incident-ledger-v1.md` |
| Life / Death / Injury | `world-life-death-injury-rulebook-v1.md` |
| Mystery / Payoff | `world-mystery-foreshadow-payoff-ledger-v1.md` |
| Height / Age / Era visual lineup | `character-height-age-era-lineup-v1.md` |
| Stage world/lore placement | `stage-world-lore-integration-v1.md` |

---

# 3. 朔夜座 / legacy 八影・朔盟

Current formal name:
- **朔夜座（さくやざ）**
- Authority: `docs/00-current-story-world-master.md`

Current early observer identity:
- `src/game/data/yatsukageIdentitySource.ts`

Legacy redesign assets retained for member思想 / pair / deep-profile migration:
- `docs/sakumei-antagonist-organization-candidate-v1.md`
- `docs/sakumei-operational-bible-candidate-v1.md`
- `docs/sakumei-member-deep-profile-candidate-v1.md`
- `src/game/data/sakumeiCandidateSource.ts`

これらの旧資料で「朔盟」がCurrent名として書かれていても、**名称Authorityは朔夜座が優先**する。

Deep profileでは8memberそれぞれに:
- ordinary habit
- small softness
- genuinely frightening scene
- taboo
- failure response
- internal friction / respect
- fan attachment lane

まで持たせる。悲しい過去や美形だけで人気を作らず、**行動・思想・関係の違いから敵側にも推しが生まれる構造**を優先する。

Rule:
> 八影をその場で削除せず序盤の観測名として既存資産を生かす。朔盟名はlegacy Candidate。Current formal nameは朔夜座。

---

# 4. P1 — 人が暮らす世界

| Area | Source |
|---|---|
| Family / Household | `character-family-household-atlas-v1.md` |
| Civilian / Economy / Food / Calendar / Belief / Media / Language / Medicine | `world-civilian-society-bible-v1.md` |
| Character interior / Secret pressure / Gag / Callback / Mentor | `character-interior-social-dynamics-bible-v1.md` |
| Episode / Cliffhanger / Quiet / Emotional pacing | `story-episode-emotional-engine-v1.md` |

---

# 5. P2 — 見た目・音・商品へ落とす

- `world-production-expression-bible-v1.md`

Includes:
- Environment Visual
- Prop Master
- Audio / Leitmotif
- Localization
- Merch Scene Matrix

---

# 6. Existing upstream sources still authoritative

世界資料は以下を勝手に上書きしない。
ただし `00-current-story-world-master.md` のHARD DECISIONと衝突する古いStory / World前提だけは最上位Masterを優先する。

- `docs/character-appearance-source-book-v1.md`
- `docs/CHARACTERS.md`
- `docs/RELATIONSHIPS.md`
- `docs/STORY.md`
- `docs/story-book-v1.md`
- `docs/game-core-book-v1.md`
- `src/game/data/stageProductionDatabase.ts`
- Enemy48 / Current21 / Future15 stable IDs
- Named Object stable IDs

---

# 7. World hard invariants

- 現世は現実の日本。現代編は現代日本に間違いない生活証拠を複数持つ。
- 現実では人物が同時代とは限らない。
- 物 / 記録 / 言葉は時代を渡れる。
- 夜では別時代人物が関係を作れる。
- **ヨルノシルベには朝が来ない。人物は目覚めて各自の時代へ戻る。**
- ヨルノシルベでは星は見える。
- **星座は年代によって同一とは限らず、昔はあったが今はない / 昔はなく今はある星座を年代差とMain Mysteryの伏線にできる。**
- 月相は事件深度を示し、Boss Stageの朔では月がなくなる。星は残る。
- 主要敵8人のCurrent formal nameは**朔夜座**。
- 異なる世代の大事件中心人物群のCurrent総称は**群青残響録**。世代数が増えれば対象も増える。
- Game Overは現実死亡ではない。
- Retryは蘇生ではない。
- 黒耀化は外部悪人格ではない。
- 正史はHappy End。
- Main Mystery最終回答はHuman decision前にLOCKしない。

---

# 8. Normal future workflow

```txt
新しい世界設定案
↓
00-current-story-world-master.md のHARD DECISIONと照合
↓
WORLD.md
↓
World FoundationのLayer / status確認
↓
Conflict Register確認
↓
Human Decision Queueで相談gate確認
↓
既存P0/P1/P2 sourceへ追加
↓
Stage / Character / Object / Relationとの接続確認
↓
必要ならCANDIDATE / OPEN_HUMAN
↓
Human Review
↓
Canon / runtime migration
```

新しい単発docを無制限に増やさず、まず既存Bibleへ統合する。