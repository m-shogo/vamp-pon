# Lorebook Cross-Era Foreshadow Desk v1

Status: **AUTHOR VIEW / CHECKED PROJECTION / AUTHOR_CANDIDATE NON-CANON**

## Goal

既存 `/lorebook/` のOverviewへ、`characterCrossEraEchoReservoir.ts` の10本を作者が会話として読める入口を追加する。

新しいStory masterは作らない。Web JSONは表示用projectionで、専用CIがTypeScript reservoirと照合する。

## Reading order

Each card shows:

1. Story usefulness — `CORE / STRONG / SUPPORT`
2. participant IDs
3. `SETUP / FIRST READ` dialogue
4. Story function
5. `PAYOFF / REINTERPRETED` dialogue
6. Evidence Gate count
7. forbidden shortcut
8. `AUTHOR_CANDIDATE` status

The purpose is to make it obvious how an ordinary line can gain a second meaning later without forcing an early answer.

## Coverage

- 10 chains
- CORE: 5
- STRONG: 4
- SUPPORT: 1

These are Story-use categories, **not quality/readiness scores**.

## Core chains

- Tomori / Yui — repair trace
- Shiro / Tomori / Yui — Quadrantid name fossil
- Michiru / Tobari / Gen — erased route / closed path / remembered name
- Nagi / Asa — access/consent and registered/chosen identity
- Noa / Rum — shared snapshot / separate present choices

## Strong chains

- Ritsu / Koyori — household name vs formal record
- Kai / Nao — same choice without identity erasure
- Sen / Madoka / Io — correct partial records and Authority
- Chloe / Shiro / Toki — cross-era evidence remains Open

## Support chain

- Yomo / Shiro — obsolete motif similarity does not create assignment

## Hard boundaries

- Candidate != Canon
- one clue != era proof
- one object != identity proof
- dialogue pairing != relationship Canon
- dialogue pairing != group membership Canon
- 朔夜座 remains the fixed enemy-group name
- 群青残響録 remains a later record-name, not an organization
- obsolete constellation != Star Beast / fate / morality / enemy role
- Tomori official constellation set != Yui official constellation set remains forbidden
- Chloe identity / birth year / 朔夜座 membership / 群青残響録 membership remain Open unless separately evidenced
- no runtime or Canon auto-promotion

## Evidence Gate

A chain must keep at least three independent evidence requirements before Canon consideration. The Web shows the gate count, but it does not convert evidence quantity into confidence percentage.

## Authoring principle

**最初の台詞は、その場だけでも成立する。後から別人物の言葉と物証が重なった時だけ、意味が増える。**

That delayed reinterpretation is the intended emotional payoff.

## Files

- Authority/reservoir: `src/game/data/characterCrossEraEchoReservoir.ts`
- Web projection: `public/lorebook/data/cross-era-echo-chains.v1.json`
- UI: `public/lorebook/cross-era-echo-enhancement.js`
- CSS: `public/lorebook/cross-era-echo.css`
- Checker: `scripts/quality/check-lorebook-cross-era-echo-desk.ts`
