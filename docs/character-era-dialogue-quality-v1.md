# Character Era Dialogue Quality v1

Status: **AUTHORING QUALITY GUARD / NON-CANON**

## Goal

36人分のEra scene/dialogueが、データ上は別でも実際には同じテンプレへ収束することを防ぐ。

This guard protects **surface diversity and continuity boundaries**. It does not rank dialogue quality and does not promote any Candidate scene to Canon.

## Exact-duplicate guard

Across all 36 character scene seeds, these fields may not be exact duplicates:

- ordinary mismatch
- plausible misread
- material / record evidence
- reinterpretation
- dialogue A
- dialogue B
- object / trace
- forbidden shortcut

Dialogue is also normalized by removing common Japanese punctuation/spacing before duplicate comparison.

## Minimum scene substance

Each scene needs enough material to function as a reveal seed:

- mismatch
- plausible alternative reading
- evidence
- reinterpretation
- two distinct dialogue lines
- object or trace
- explicit forbidden shortcut

The guard does not enforce prose taste or character popularity. It only rejects structurally empty seeds.

## No era exposition shortcut

Era clues should not become lines such as:

- 「私の時代では……」
- 「俺は○○時代の生まれだ」
- exact calendar year / era-year announcement
- exact age announcement

Exact chronology remains separate Authority/Open unless explicitly decided elsewhere.

## Twin boundary

Kai / Nao must keep shared Era and Reality continuity where authoritative, while their dialogue and material trace stay individually distinguishable.

`same twins != same scene seed`

## Constellation boundary

Tomori dialogue/scene material must keep the official-88 rejection guard:

**Tomori official constellation set != Present Yui official constellation set is forbidden.**

Any obsolete-constellation clue is archival/research material and cannot auto-assign Star Beast, fate, morality, or enemy identity.

## What this does not do

- no dialogue score
- no completion percentage
- no “good dialogue” AI score
- no romance/relationship auto-Canon
- no exact Era promotion
- no Star Beast assignment
- no obsolete constellation assignment
- no runtime promotion

## Guard

`node --experimental-strip-types scripts/quality/check-character-era-dialogue-quality.ts`

## Writing principle

**一人だけ読んでも、その人らしい。36人並べても、同じ作者テンプレには見えない。**
