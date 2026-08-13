# Character Design Feedback Recurrence Master v1

Status: `TOP_LEVEL_POST_REVIEW_GENERATION_GOVERNANCE`

## Purpose

Turn reviewed character-image feedback into controlled future-generation constraints without allowing one rejected image, assistant diagnosis, or generated visual accident to silently become canon.

This Master sits **after candidate review and before the next candidate generation**. It does not approve artwork. It controls what reviewed learning is allowed to recur in later resolved prompts.

## Core rule

`candidate image -> human review -> ledger -> explicit recurrence promotion -> later resolved prompt`

Never:

`candidate image -> model notices something -> permanent design rule`

## Authority boundary

Only `ACTIVE` entries in `data/visual/character-design-feedback-ledger.json#recurrenceDirectives` may alter later production prompts.

Candidate-review fields remain evidence/history. They do not automatically become generation instructions.

### Allowed active authorities

- `USER_DECIDED`
- `HUMAN_APPROVED_DESIGN_RULE`
- `CANDIDATE_LEARNING` only for character-scoped, non-canon recurrence control

`CANDIDATE_LEARNING` may not create a global ban or rewrite higher-authority Character / Living Visual / Appearance / World Masters.

## Directive actions

### KEEP
Protect an accepted element already supported by the loaded design. Do not expand the element beyond what was accepted.

### BAN
Prevent recurrence of a reviewed failure. A BAN does **not** authorize the model to invent an alternative.

### REPLACE
Remove a reviewed failure and require a named positive target. `replacement` is mandatory.

### WARN
Increase review attention. WARN does not override higher authorities and does not make an optional detail mandatory.

## Scope

### CHARACTER
Applies only to the exact production character ID.

### GLOBAL
Must use `USER_DECIDED` or `HUMAN_APPROVED_DESIGN_RULE`. Global rules require deliberate human promotion; repeated assistant diagnosis is insufficient.

## Anti-overlearning

Forbidden:

- turning one disliked candidate into a global style ban
- treating `REJECT` as automatic permanent prohibition
- promoting assistant diagnosis without human approval
- learning body normalization from accepted rendering artifacts
- learning accidental piercing, tattoo, exposure, jewelry, scars, glow or prop changes from generated images
- treating a generated face mutation as a new face signature
- replacing a banned element with random ornament
- merging user feedback text into assistant interpretation
- allowing feedback learning to outrank `USER_DECIDED`, current canon, Living Visual, Appearance Contract, World Material, Identity, Embodied Acting, or Readiness Masters

## Repeated drift

A recurring failure may become `CANDIDATE_LEARNING` only when its recurrence is explicitly recorded and the directive remains character-scoped. Promotion to a global or approved design rule still requires human approval.

Examples of recurrence classes:

- same-face-base drift
- unsupported gold/gem/belt/harness filler
- exposure increase
- piercing/tattoo invention
- age/body normalization
- prop floating or impossible storage
- generic hero pose
- universal rim/bloom treatment
- world motif pasted as decoration
- relationship intimacy invented by composition

## Prompt injection

The final learning-aware exporter must:

1. call the Character Image Generation Readiness final exporter;
2. require `READY_FOR_CANDIDATE_GENERATION`;
3. load the feedback ledger;
4. filter to `ACTIVE` directives valid for the target character or valid global scope;
5. reject malformed, unauthorized, image-created, or unsafe directives;
6. append active directives after all higher design authorities;
7. preserve the authority order: feedback recurrence can narrow later candidates but cannot rewrite canon;
8. emit `feedbackRecurrenceGenerationEntrypoint: true`;
9. emit `generatedImageCreatesFeedbackRule: false`.

If there are no active directives, generation remains READY and the prompt explicitly states that no feedback recurrence override is active.

## Review taxonomy

Candidate review should classify meaningful deltas into:

- `KEEP`
- `REMOVE`
- `REPLACE`
- `BAN_NEXT_GENERATION`
- `AUTHOR_CANDIDATE_FOR_REVIEW`

This taxonomy is a review aid. It becomes executable only after explicit recurrence promotion into the ledger.

## Conflict resolution

1. `USER_DECIDED`
2. current character/world/relationship canon
3. Living Visual / Appearance / Identity / Embodied / Garment / Night-Light / World Material Masters
4. Image Generation Readiness Master
5. active `HUMAN_APPROVED_DESIGN_RULE` feedback directive
6. active character-scoped `CANDIDATE_LEARNING`
7. generation prompt wording
8. generated image

A lower layer may never expand an upper-layer unknown into a concrete design detail.

## Production acceptance

A feedback-aware prompt is valid only if:

- image readiness is READY;
- every applied directive is ACTIVE;
- character scope matches or global authority is human-approved/user-decided;
- `createdByGeneratedImageAlone` is false;
- REPLACE has a positive target;
- BAN does not imply a random replacement;
- no directive contradicts higher authority;
- the output remains `CANDIDATE_REVIEW_REQUIRED`.
