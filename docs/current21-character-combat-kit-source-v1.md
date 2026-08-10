# ヨルノシルベ Current21 Character Combat Kit Source v1

## Status / Authority

- Scope: **Current21**（Core5 + Circle10 + Shadow5 + Reserve Ren）
- Machine source: `src/game/data/currentCharacterCombatKitSource.ts`
- Seed source:
  - `src/game/data/currentCharacterCombatKitSeedsA.ts`
  - `src/game/data/currentCharacterCombatKitSeedsB.ts`
  - `src/game/data/currentCharacterCombatKitSeedsC.ts`
- Authority: **CONTENT_SOURCE_ONLY**
- この原本だけでCurrent runtimeを自動置換しない。
- Candidateのstarting weaponは「将来のstarting plan」であり、現在のruntime starter変更を意味しない。
- **Future15**をCurrentへ昇格しない。
- ReserveのレンをCurrent Core/Circleへ自動昇格しない。
- Main Mystery、恋愛、血縁、exact incidentをこのCombat Sourceから新しくLOCKしない。

## 目的

Current21を属性ラベルだけの21人にせず、人物史・Star Beast・関係性・黒耀化・武器選択を、実際のbuild差へ変換する。

各Characterへ最低限、次を持たせる。

- starting weapon
- intrinsic attributes / proficient attributes
- Star Beast mechanic
- signature Buff / Debuff
- special passive
- 黒耀化 combat change + tradeoff
- Awakening
- preferred build / friction build
- relation assist / pair synergy

人物関係の正本は `currentRelationshipInventory.ts`、属性と星獣の正本は `characterStarBeastCombatSource.ts` を上流とする。このファイル側で別の関係・別の星獣・別の本体属性を作らない。

## Current21 overview

| Character | starting weapon plan | Combat core | relation assist partner |
|---|---|---|---|
| ユイ | 夜の鉛筆 / Current | MARKEDを他属性Reactionへ橋渡しするHero Anchor | アサ |
| アサ | 送り風の扇 / Candidate | 走行・WIND・進路作成。速さを戻る力にもする | ユイ |
| ナギ | 月のしおり / Current | safe arc・CHILL・SEALEDで開閉tempoを制御 | カナメ |
| ミチル | 星図のピン / Candidate | 遠距離star pointとroute判断 | トキ |
| トモリ | 灯芯針 / Candidate | BURN seamとREPAIRで盤面を育てる | ツムギ |
| セン | 境界チョーク / Candidate | 一本のlaneを観察・更新するEARTH専門 | コヨリ |
| リツ | 火種のマッチ箱 / Candidate | 群れへBURNを配りMETAL Breakへつなぐ | コヨリ |
| コヨリ | 押花札 / Candidate | 小trap・補助灯・ROOTEDで退路を作る | リツ |
| ゲン | 石畳の小槌 / Candidate | safe point・踏ん張り・heavy Break | ミチル |
| ハナ | 押花札 / Candidate | BLOOM/WATERの持続・ROOTED・再生 | ツムギ |
| ユウビ | 紙ひこうき / Current | delayed projectileとreturn route | トバリ |
| マドカ | ひび鏡 / Candidate | 観察・reflect・ILLUMINATED・遠望 | レン |
| シロ | 白い消しゴム / Candidate | BLANK cleanseと「未分類枠」 | ツムギ |
| トバリ | 境界チョーク / Candidate | 止める線 / 通す線の二面boundary | ユウビ |
| ネム | 夢の目覚まし / Candidate | delay・DROWSY・呼吸tempo | トキ |
| クロオリ | 黒折り扇 / Candidate | veilを閉じる / 自分で開く二段式 | ユイ |
| カナメ (`kage1`) | 石畳の小槌 / Candidate | guard line・受ける守り・任せる守り | ナギ |
| カスミ (`kage2`) | 眠りのリボン / Candidate | 痕跡ぼかし・DROWSY・逃走支援 | アサ |
| トキ (`kage3`) | 帰針 / Candidate | angle precision・MARKED・Break | ミチル |
| ツムギ (`kage4`) | 継ぎ糸車 / Candidate | stitchを結ぶ / 切る / 未完成を残す | トモリ |
| レン | ひび鏡 / Candidate | missed cueを次の観察材料へ変える学習型 | マドカ |

この表はoverviewであり、実際のCombat Kit詳細はmachine sourceの各entryが正本。

## starting weapon boundary

Current runtimeに既に存在するBase Weaponをstarting planとして使うのは3人。

- ユイ → `night_pencil`
- ナギ → `moon_bookmark`
- ユウビ → `paper_airplane`

残る18人はBase Weapon Candidateをstarting planへ割り当てている。

これは**runtime promotionではない**。
Candidateは引き続き `CONTENT_SOURCE_ONLY` であり、後工程の実装・balance test・Human Review・promotionが必要。

この分離により、Character identityだけ先に濃くしつつ、Current runtimeへ未実装武器を存在するものとして扱う事故を防ぐ。

## Star Beast mechanic

Star Beastは属性を配る装置ではない。

例:

- ユイ / 子獅子: 散った記憶を全部回収する王ではなく、別のReactionへ渡す「拾い直し線」。
- ナギ / かに: 甲羅=防御力ではなく、横からsafe arcを作る守り。
- ミチル / こぐま: 正解の北を教えるのではなく、小さなstar pointを帰路候補として残す。
- トモリ / 煤けた若獅子: 炎の王ではなく、BURN seamをREPAIRへ接続する継火。
- クロオリ / カメレオン: 色替えではなく、閉じるveilと自分で開く判断。

同じfamily・似た象徴でも別の人物ならmechanicを同じにしない。

## Signature Buff / Debuff

Signature Buffは既存Star Beast Combat Sourceの `resonanceBuff` をそのまま上流Authorityとして使う。

Signature Statusは既存16 Status vocabulary内だけを使い、新Statusを人物ごとに勝手に増やさない。

そのためCharacter差は「専用Status名を21個増やす」のでなく、既存Statusをどう作り、どう手放し、どのReactionへ渡すかで出す。

## 黒耀化

黒耀化を単純な「悪化」「闇堕ち」「ATK大幅UP」にしない。

全21人の共通grammar:

> その人物の長所 / 守り方 / 生き方が過剰になる
> → 戦闘上は強い局面が生まれる
> → 同時に可逆的なtradeoffが発生する
> → 手放す / 任せる / 移動する / 開く等の本人らしい行為で戻せる

例:

- ナギ: safe arcが強くなるほど内側が狭くなる。
- リツ: 全部受けるほどguard counterは強いが足が止まる。
- ハナ: 保存trapが残り過ぎて新しい場所へ移れない。
- クロオリ: veilが強いほど敵だけでなくroute/drop情報も失う。
- トキ: 一点精度は上がるが別targetを見られなくなる。
- ツムギ: stitchを残すほど新しい継ぎ目を作れない。

黒耀化による**恒久的な属性追加は禁止**。3属性化の抜け道にしない。

## Awakening

Awakeningは最高レア化ではなく、人物の成長をCombat ruleへ変える。

既存 `weaponTransformationSource.ts` にあり、Current21へ安全に接続できるAwakening Candidateは6件だけ既存IDへlinkする。

- ナギ → `awake_nagi_closed_moon`
- ミチル → `awake_michiru_home_star`
- トモリ → `awake_tomori_repair_fire`
- ハナ → `awake_hana_kept_flower`
- クロオリ → `awake_kuroori_open_fold`
- ゲン → `awake_gen_old_needle`

残る15人にもAwakeningの人物的方向は設計するが、このSourceでは**concept only / CONTENT_SOURCE_ONLY**。
新しいProduction transformationを15件確定したことにはしない。

Awakeningの意味は、例えば:

- ユイ: 全部思い出すのではなく、残す記憶を本人と一緒に選ぶ。
- アサ: 先に走るだけでなく、待って戻れる。
- リツ: 自分だけで守らず、コヨリに救われることを受け入れる。
- ツムギ: 全部の傷を閉じず、縫わない一目を残す。

というStory growthと一致させる。

## preferred build / friction build

全員へ「得意build」と「本人らしさが出にくいbuild」を持たせる。

friction buildは使用禁止ではない。

- Item
- Fusion
- Stage counter
- general weapon power

でclear可能にし、好きなCharacterが特定Stage/Buildから排除されないようにする。

主人公ユイも例外ではない。
ユイは強いHero Anchorだが、WIND専門はアサ、controlはナギ、STAR遠距離はミチル、FIRE/METAL installはトモリが上回る。

## relation assist / pair synergy

relation assist / pair synergy は、既存 `currentRelationshipInventory.ts` にあるCurrent relationだけへ接続する。

Combat Sourceから新しい恋愛・血縁・Main Mystery事実を確定しない。

特に保持する方向:

- ユイ × アサ: 恋愛rewardではない主人公級バディ / 方法論の衝突。
- ナギ × カナメ: safe arc / guard lineという二つの守り。
- ミチル × トキ: route point / precision line。選ぶことと測ること。
- トモリ × ツムギ: BURN seam / stitch。直すことと跡を残すこと。
- リツ × コヨリ: **兄だけが守る一方向連携は禁止**。互いに救援を返す。
- ユウビ × トバリ: 届ける / 通す。
- マドカ × レン: 見る / 気づきを返す。
- ネム × トキ: 夢を計測で否定せず、予測幅だけ狭める。

pair synergyは「二人を一緒に使うと常時+30%」のような恋愛/関係性tier rewardにしない。
人物同士の行動grammarが短いCombat interactionになる形を優先する。

## Reserve Ren

レンはCurrent21 inventory上のReserveとしてCombat Kitを設計する。

これはCore/Circle昇格ではない。

- LIGHT単属性専門
- ひび鏡Candidate starter plan
- missed attack cueを次の学習へ変える
- マドカとのCurrent Reserve relationをassistへ接続

までを原本化し、roster promotionは別Human decisionに残す。

## Future15 boundary

このSourceはCurrent21専用。

Future15の:

- starting weapon
- 黒耀化
- Awakening
- relation assist

をCurrent21へ混ぜない。

既存Awakening CandidateにNoa / LumのFuture-only案が存在しても、このCurrent21 sourceからlinkしない。

## Runtime promotion boundary

このSourceの目的はCharacter/Story/Combatを接続すること。

ここから先のruntime実装には別工程が必要:

1. Candidate Base Weapon選定
2. hook implementation
3. balance test
4. Stage progressionとの接続
5. VFX / audio implementation
6. gameplay QA
7. Current promotion review

この順序を飛ばさない。
