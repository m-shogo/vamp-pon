# Character Era Scene Seeds v1

Status: **AUTHOR CANDIDATE / NON-CANON**

36人全員について、Era差を説明台詞ではなく「日常の小さな違和感 → 誤読 → 物証 → 再解釈」で見せる作者用scene reservoir。

## Scene grammar

各人物は最低でも次の要素を持つ。

1. ordinary mismatch — 普通の行動なのに少しだけ前提がずれる。
2. plausible misread — 性格・癖でも説明でき、年代伏線と即断できない。
3. material / record evidence — 傷、修理、道、写真、転送印、ログ、分類、呼び名などが後から絞り込む。
4. reinterpretation — 序盤の何気ない台詞が後半で別の意味を持つ。
5. dialogue pair — 設定説明ではなく、人物同士の応答で見せる。
6. object / trace — ヨルノシルベの「消えても残る」を物質・記録に接続する。

## Key chains

- **Tomori → Yui:** 「まだ使える」→補修癖→後代ランタンの同一系統の修理痕。Tomoriの時代に公式88星座が違った、という誤設定にはしない。
- **Quadrantid / Shiro:** 現代の「しぶんぎ座流星群」というname fossilから、継承古星図のQuadrans Muralisへ辿る。古星座をCharacter ownership / zodiac / Star Beastへ自動接続しない。
- **Michiru:** 現行地図から消えた道を、地割・石縁・古写真が裏づける。「地図が間違い」ではなく地理の履歴を見せる。
- **Nagi → Asa:** accessとconsentの区別から、後のidentity / authorizationの歴史差へ繋ぐ。未来側を上位文明扱いしない。
- **Noa / Rum:** shared data、shared memory、chosen reply、personhoodを分離する。コピー=同一人物／魂なし、のどちらにも短絡しない。
- **Kai / Nao:** 同じEra・同じ家庭由来でも、同じ選択をしてよい。双子の個別性を「常に違うものを選ぶ義務」にしない。
- **Chloe:** cross-eraの痕跡だけを置き、不老不死・出生年・正体を確定しない。

## Relationship use

会話seedは新relationship Canonではない。誰と話すかはCurrent relationship lanes、arc availability、scene necessityを参照して選ぶ。線がない人物同士の会話を「既存の深い関係」として捏造しない。

## Mystery use

伏線は最低二段以上の反復と反証を置く。一発の古い言葉、一つの道具、一つの食べ物だけで年代を確定しない。Main Mysteryへ使う場合もResearch/Candidateから始める。

## Hard boundaries

- exact year / birth year / age remain OPEN unless separately authoritative.
- Future15 != future-era origin.
- old != ignorant / conservative.
- future != superior / omniscient.
- era clue != birthplace / class / intelligence / family tragedy.
- obsolete constellation != evil.
- era scene != zodiac / Star Beast / fate assignment.
- no runtime or Canon auto-promotion.

Implementation: `src/game/data/characterEraSceneSeedRegistry.ts`
Guard: `scripts/quality/check-character-era-scene-seeds.ts`
