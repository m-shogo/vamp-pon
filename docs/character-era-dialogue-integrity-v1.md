# Character Era Dialogue Integrity v1

Status: **AUTHORING QUALITY GUARD / NON-CANON**

## Goal

36人のEra scene/dialogueが、将来の編集で同じテンプレや露骨な年代説明へ崩れることを防ぐ。

This is an **objective integrity guard**, not an AI prose score.

## Guarded invariants

Across all 36 scene seeds:

- 36 unique character IDs
- matching Era and fingerprint source rows
- no empty reveal fields
- dialogue A != dialogue B
- no normalized duplicate dialogue lines
- no duplicated full eight-field scene signature
- no TODO/TBD/FIXME/placeholder leakage
- no exact year / era-year / exact-age leakage
- no direct 「私の時代では」 style era exposition

## Why full-scene duplication, not arbitrary prose length

A previous diagnostic experiment considered minimum character counts for every prose field. That is intentionally **not** part of this final guard.

A short object label can still be good authoring data. Integrity should reject structural duplication and unsafe chronology shortcuts, not pretend prose length is quality.

## Twin boundary

Kai / Nao share continuity where authoritative, but their dialogue and material traces must remain distinguishable.

`same twins != same scene seed`

## Constellation boundary

Tomori scene material must preserve:

**Tomori official constellation set != Present Yui official constellation set is forbidden.**

Obsolete constellation research remains separate from Star Beast / fate / morality / enemy assignment.

## Source boundaries kept alive

- exact year remains Open
- Future15 != future-era origin
- old era != ignorance
- future era != superiority
- one scene != era proof
- dialogue != relationship Canon
- scene != Star Beast assignment
- scene != obsolete constellation assignment

## What this does not do

- no dialogue score
- no readiness percentage
- no minimum prose-length grading
- no Candidate→Canon promotion
- no popularity ranking
- no runtime promotion

## Guard

`node --experimental-strip-types scripts/quality/check-character-era-dialogue-integrity.ts`

## Writing principle

**一人だけ読んでもその人らしく、36人並べても完全なコピペsceneは存在しない。**
