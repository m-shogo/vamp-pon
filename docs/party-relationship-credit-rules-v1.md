# 3人戦闘 Relationship Credit Rules v1

3人Partyは関係値の保存先ではない。

## Pairwise credit

A/B/Cを選んだ時、保持する関係参照はAB・AC・BCの3本。

- AがBを救援 → AB
- AがCへAssist → AC
- BとCが連携 → BC
- 3人同時Clear → AB / AC / BCへ同じ種類のpair eventを個別記録

## Directed Affinity

行為者と受け手を区別できるeventでは方向を残す。

例:

- AがBを庇う → A→B側のAffinity文脈へ強く寄せられる
- BがAへ礼を言わない → B→Aのspeech presentationだけが違ってよい

ただし数値増減はplaytest前にLOCKしない。

## Anti-transitive rule

A→Bが高い、B→Cが高い、という理由でA→Cを自動上昇させない。

## No punishment

低Bond/低Affinityを編成禁止や大幅stat penaltyへ使わない。
摩擦pairには摩擦pairのbattle bark・課題・別Assistを作れる。
