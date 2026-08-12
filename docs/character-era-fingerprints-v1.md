# Character Era Fingerprints v1

Status: **AUTHOR CANDIDATE / NON-CANON except upstream era locks**

This layer makes Reality-era differences emerge from ordinary behavior instead of exposition. It derives all 36 characters from `characterEraForeshadowDialogueReservoir.ts` and gives every character nine observable fingerprint dimensions while preserving each character's existing personal anchors.

## Nine fingerprint dimensions

1. vocabulary
2. food
3. communication
4. school
5. work
6. transport
7. tools
8. money
9. humor

A fingerprint is a writing reservoir, not a biography fact. No single cue proves a character's era, age, occupation, class, education, birthplace, family history, zodiac, Star Beast ownership, or morality.

## Reveal grammar

Era reveals should prefer this five-beat sequence:

1. **ordinary mismatch** — a tiny assumption feels slightly off.
2. **repeat with new context** — a second situation makes the mismatch harder to dismiss.
3. **counterevidence from another character** — somebody offers a plausible alternative explanation.
4. **Reality object / record evidence** — a physical trace, route, repair, archive, message, label, or identity record narrows the interpretation.
5. **earlier line reinterpreted** — an earlier harmless line gains a second meaning after the evidence is understood.

The point is delayed recognition, not trivia exposition.

## Strong chain candidates

- **Tomori → Yui:** repair/reuse habit → repeated material literacy → Yui assumes it is personality → a later-owned object carries Tomori's repair trace → his early “why throw it away?” line becomes temporal evidence without changing the official constellation boundary.
- **Nagi → Asa:** early-network privacy etiquette → repeated distinction between access and consent → present characters read it as caution → later identity/authentication evidence exposes a deeper historical gap → Asa's future identity language reframes Nagi's earlier warning.
- **Michiru → present route users:** old-route instinct → route mismatch repeats → live map appears to contradict memory → physical/archival trace proves an erased route existed → “new map does not mean new road” becomes a time clue rather than nostalgia.
- **Noa / Rum / copy-personhood lane:** ordinary treatment of copied data → repeated disagreement about sameness → another character offers technical equivalence → identity/personhood evidence separates copied state from chosen self → an earlier casual naming choice becomes emotionally significant.
- **Kai / Nao twins:** same-era cues should align while personal reactions diverge. Their era evidence must never be used to erase twin individuality.

## Hard boundaries

- exact year remains OPEN.
- exact birth year remains OPEN.
- exact age remains OPEN unless separately authoritative.
- Dream appearance does not prove Reality generation.
- `Future15` does not mean future-origin.
- older era is not ignorance or conservatism.
- future era is not superiority or omniscience.
- obsolete constellation is not evil.
- character era does not assign zodiac, Star Beast, fate, family tragedy, occupation, or class automatically.
- Tomori/Yui must not imply a different official IAU 88 constellation list.
- no runtime or Canon auto-promotion from this reservoir.

## Implementation

- Data: `src/game/data/characterEraFingerprintRegistry.ts`
- Guard: `scripts/quality/check-character-era-fingerprints.ts`
- Source era reservoir: `src/game/data/characterEraForeshadowDialogueReservoir.ts`
