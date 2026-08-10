# Character Reference Candidate Intake

Date: 2026-08-10  
Status: **CURRENT POST-GENERATION INTAKE / MANUAL REFERENCE APPROVAL REQUIRED**

## Purpose

`P0_CHARACTER_REFERENCE_HANDOFF.md` で生成したCharacter reference PNGを、repoへ置いただけで「採用済み」にしない。

生成後は:

```txt
PNG generated
↓
candidate registration
↓
Asset Factory / manual visual review
↓
approved_reference OR needs_regeneration OR rejected
↓
only later: downstream sprite / cutin production
```

Runtime / final art approvalはこの経路では扱わない。

---

## Register a generated candidate

Hana example:

```bash
node --experimental-strip-types tools/asset-factory/scripts/register-character-reference-candidate.ts \
  --character hana \
  --source-file public/assets/prototypes/characters/hana/references/hana-reference-v1.png
```

Kaname:

```bash
node --experimental-strip-types tools/asset-factory/scripts/register-character-reference-candidate.ts \
  --character kage1 \
  --source-file public/assets/prototypes/characters/kage1/references/kage1-reference-v1.png
```

Default candidate records:

```txt
data/asset-factory/character-reference-candidates/hana.candidate.json
data/asset-factory/character-reference-candidates/kage1.candidate.json
```

---

## Registration gate

Registration requires:

- source path exactly matches Current handoff output path
- PNG header
- `1024x1024`
- bit depth 8
- PNG color type 6 = truecolor + alpha / RGBA
- Current prompt provenance hash
- source SHA-256
- Git intake commit

Existing candidate record is **not silently overwritten**.

If a new generation is needed, review/reject the current candidate and preserve provenance rather than replacing history invisibly.

---

## Initial state

Every newly registered image starts:

```json
{
  "decision": "pending",
  "approvedForReference": false,
  "approvedForRuntime": false,
  "approvedAsFinal": false
}
```

All manual review fields start `null`.

---

## Manual review fields

Before `approved_reference`:

- identityMatchesCurrentCanon
- silhouetteMatchesCurrentCanon
- postureMatchesCurrentCanon
- clothingMassMatchesCurrentCanon
- namedObjectReadable
- mobileReadability390x844
- noBakedTextOrUi
- noBackgroundOrFringeIssue
- bodyRepresentationGuardPassed

All must be `true` for reference approval.

For Hana / Kaname, `bodyRepresentationGuardPassed=true` is mandatory.

### Hana body review

- plus-size older woman remains clear
- round torso / arms / cheeks remain visible
- no slimming / rejuvenation
- shawl does not hide the body shape to fake compliance
- no food / clumsy comedy

### Kaname body review

- plus-size broad young adult man remains clear
- thick soft torso, arms and legs
- not bodybuilder triangle
- not slim anime male
- fast-intercept posture still reads
- no slow / overeating comedy

---

## Candidate provenance CI

`scripts/quality/check-character-reference-candidates.ts` verifies every committed candidate record against:

- actual PNG SHA
- actual PNG header
- Current handoff output path
- Current prompt hash
- approval-state rules
- manual review completeness

If Current prompt authority changes after a candidate was registered, the provenance check fails rather than silently treating an old image as current.

That forces an explicit decision:

```txt
Current visual change is irrelevant to this candidate → update/review provenance deliberately
OR
Current visual change materially affects the candidate → regenerate/re-review
```

---

## Approval boundary

This intake can reach:

```txt
approved_reference = true
```

It can never set:

```txt
approvedForRuntime = true
approvedAsFinal = true
```

Those require separate production/runtime evidence.

> **Generated art first becomes evidence to review, not truth to adopt.**
