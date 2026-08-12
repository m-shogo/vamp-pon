# ヨルノシルベ — Relationship Embodied Daily-Life Contract v1

Date: 2026-08-12  
Status: **CURRENT AUTHORING CONTRACT / EXTENDS EXISTING RELATIONSHIP AUTHORITIES / DOES NOT CREATE NEW RELATION EDGES**

## 0. Purpose

既存の `docs/RELATIONSHIPS.md`、Current Relationship Inventory、Relationship Arc、Bond Speech Prototypeを置き換えず、**関係が身体・距離・生活動作・持ち物・服への介入としてどう見えるか**を定義する。

目的は、関係が深くなった時に全組が:

- 呼び捨てになる
- タメ口になる
- 肩を組む
- お揃いアクセを付ける
- 距離が近くなる
- 甘い会話になる

というgeneric anime shorthandへ収束するのを防ぐこと。

Relationship edgeの有無・種類・Canon度は既存Authorityに従う。このContractは**既に存在する関係laneの演技解像度だけを上げる**。

---

# 1. Authority order

1. `docs/00-current-story-world-master.md`
2. `docs/RELATIONSHIPS.md`
3. `src/game/data/currentRelationshipInventory.ts`
4. detailed relationship arc / source-aware documents
5. `docs/relationship-bond-speech-prototype-v1.md`
6. per-character Living Visual Profile
7. Core5の場合 `docs/visual/core5-era-life-design-master-v1.md`
8. `docs/visual/world-character-scenario-design-council-master-v1.md`
9. 本Contract
10. scene / asset candidate

本Contractから新しい恋愛・血縁・親友・敵対関係を推測してはいけない。

---

# 2. Relationship is not one number

関係を「親密度」1軸で扱わない。

最低でも以下を別々に見る。

1. **speech distance** — 呼称、敬語、語尾、説明量
2. **physical distance** — 立つ距離、並び方、背中を向けられるか
3. **touch permission** — 肩、手、髪、服、小物へ触れてよいか
4. **object trust** — 荷物、鍵、端末、道具、食べ物を預けられるか
5. **care permission** — 傷、疲労、服の乱れを指摘・手当てできるか
6. **request style** — 頼む、命令する、察してもらう、遠慮する
7. **refusal safety** — 断っても関係が壊れないと信じられるか
8. **silence comfort** — 無言で同じ作業・待ち時間を共有できるか
9. **joke range** — どこまで茶化せるか、失敗した冗談をどう処理するか
10. **anger shape** — 声量、距離、皮肉、沈黙、手を止める等
11. **repair behavior** — 喧嘩後に誰が何をするか
12. **appearance intervention** — 服・髪・アクセ・露出・汚れへ口や手を出せる範囲

これらは同時に高くならない。

例:
- 呼称は変わらないが無言で隣にいられる
- よく喧嘩するが道具は安心して預ける
- 肩には触れないが食べ物は勝手に半分渡す
- 親しいが服装へは干渉しない

を普通に認める。

---

# 3. Appearance intervention rules

関係が深いことを、本人のLiving Visual Masterを破る理由にしない。

## 3.1 Never automatic

禁止:
- 恋人/親友だからピアスを開ける
- 仲良しだからお揃い刺青
- Bondが高いから露出が増える
- 相手の好みに合わせてbody shapeを変える
- ペア衣装のため本人の服装嗜好を無視する
- 相手から貰ったという理由だけでsignature accessoryを永久追加する

## 3.2 Allowed relationship traces

関係の痕跡は、より小さく生活的でよい。

Examples:
- 相手が直した縫い目
- 借りっぱなしの小物
- 返すつもりで畳んである布
- 相手だけが知るポケット位置
- 以前より手入れされている工具
- いつも同じ場所へ戻されるカップ
- 雨の日だけ貸す上着
- 本人は買わないが、贈られた時だけ使う色

ただし既存Canonと矛盾する場合は採用しない。

---

# 4. Body acting by relationship

同じ人物でも相手で姿勢・視線・間が変わる。

Character Masterのbody/posture identityは維持したまま、次をscene actingで変える。

- torso orientation
- eye contact duration
- shoulder tension
- hand occupation
- standing/sitting distance
- whether they walk ahead / beside / behind
- who stops first
- who waits
- whether they expose their back
- whether they keep an object between them

**親しい = 常に近距離**ではない。

例えば距離を必要とする人物にとって:

> 相手が一歩近づく

より

> 相手が近づかず、その距離を守れる

方が深い信頼表現になり得る。

---

# 5. Ordinary relationship reservoirs

関係を深めるsceneは大事件だけにしない。

最低限、関係laneごとに以下から複数を持てる状態を目指す。

- 同じものを食べるが注文が違う
- 待ち合わせに片方が早い/遅い
- 傘/上着/工具/充電/紙を貸す
- 道を聞く/聞かない
- 買うか直すかで揉める
- 荷物を持つ/持たせない
- 相手の苦手な食べ物を覚えている
- 無言で修理/掃除/準備する
- 呼んだのに聞こえていない
- 冗談が滑る
- 説明しすぎて止められる
- 相手が疲れていることだけ先に気づく
- 誰が座る場所を譲るか
- 何を勝手に触らないか
- 帰る時に歩調を合わせる/合わせない

これらはRelationship Arcの代替ではない。Arcの**日常証拠**として使う。

---

# 6. Era differences inside relationships

Core5は別Eraの普通を持つ。

同じ行為でも意味が違う。

Examples:
- 連絡がつかない: 未来/現代/携帯Internet初期/固定連絡中心で不安の形が違う
- 写真を撮る: 記録の希少性・共有前提・削除感覚が違う
- 借り物: 買い替え可能性や修理感覚が違う
- 待つ: 待ち合わせの再連絡可能性が違う
- 個人情報を聞く: privacy normが違う

Scenarioは「時代ギャップ解説」を台詞でやるより、**小さな戸惑い/行動差**で見せる。

---

# 7. Conflict / repair

喧嘩をrelationship meterの減点演出にしない。

各pairは可能なら以下を別々に設計する。

- what triggers irritation
- what they refuse to say
- what makes them leave
- what makes them stay
- who resumes ordinary activity first
- apology style
- non-verbal repair
- what remains unresolved

謝罪は必ず「ごめん」と言う形でなくてよい。

- 壊したものを直す
- 温かい飲み物を置く
- 次は先に聞く
- 距離を戻す
- 約束した時間に来る

等もrepairになり得る。

---

# 8. Relationship visual QA

二人絵・会話絵・4コマ・イベントCGでは以下を確認する。

1. 名前を隠してもbody/postureで誰かわかる
2. 二人の距離に関係理由がある
3. 手が何をしているか決まっている
4. 二人の間に置かれる物/置かれない物に理由がある
5. 視線がgenericな相互見つめ合いへ固定されていない
6. 親密さを露出・アクセ・身体接触だけで表現していない
7. Living Visual Profileを関係演出が破っていない
8. Era差が必要なpairでは日常行動へ反映されている
9. 同じpairでもordinary / conflict / crisis / dawnで身体演技が変わる
10. 関係の成長後、日常の小さな行動差で証明できる

---

# 9. Machine-readable scene fields to add when needed

Relationship-driven scene briefは必要に応じて次を持つ。

```json
{
  "pair": ["characterA", "characterB"],
  "relationshipSource": "existing-authority-path",
  "speechDistance": "",
  "physicalDistance": "",
  "touchPermission": "",
  "objectTrust": "",
  "carePermission": "",
  "requestStyle": "",
  "refusalSafety": "",
  "silenceComfort": "",
  "jokeRange": "",
  "angerShape": "",
  "repairBehavior": "",
  "appearanceIntervention": "",
  "ordinaryProof": ""
}
```

未設定pairについて、AIが関係値を発明して埋めない。

---

# 10. Positive target

目標は「全員仲良し」ではない。

**相手によって同じ人の違う面が自然に出ること。**

その違いが、呼称だけではなく:

- 距離
- 待ち方
- 触らなさ
- 貸し借り
- 食事
- 歩調
- 沈黙
- 服や持ち物への介入
- 喧嘩後の修復

として見える状態を作る。
