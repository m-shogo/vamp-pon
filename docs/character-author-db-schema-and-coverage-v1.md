# ヨルノシルベ — Character Author DB Schema / Coverage v1

Date: 2026-08-12  
Status: **CURRENT AUTHOR-DB INDEX STRUCTURE / CONTENT STATUS INHERITED / NO CANON FLATTENING**

Purpose:

> Character設定を増やすほど「どのファイルが正本か」「CurrentなのかCandidateなのか」「21人とFuture15でIDが違うのか」が分からなくなる事故を防ぐ。

この層は設定を決める正本ではない。

**各sourceのstatusを保ったまま横断して探すための索引。**

---

# 1. Data layers

## A. Current authority

Examples:

- `docs/00-current-story-world-master.md`
- Physical Identity Master subdomain
- Character Reality Root registryの各`DECIDED / CURRENT_DERIVED`
- Season architectureのCurrent決定
- Current relationship inventory

Currentは作者DB/Webで明確にCurrent badgeを付ける。

## B. Candidate / Reservoir

Examples:

- ordinary life
- social chemistry
- behavior identity
- lived artifact
- living place
- theme color
- S2 antagonist candidate
- Future15 planning

Candidate/Reservoirは**量を多く持ってよい**。
ただしCurrent風UIで表示しない。

## C. Open

- 未決定
- 不明
- 確認待ち
- 今は決めなくてよい

`OPEN != false`。

Example:

> `romance: OPEN`

は:

> `romance: NO`

ではない。

---

# 2. Identity keys

Author DBでは2 IDを区別する。

## `authorId`

Story/World側の読みやすいsemantic ID。

Examples:

- `yuubi`
- `kaname`
- `kasumi`
- `toki`
- `tsumugi`

## `stableProfileId`

既存のrelationship/profile/runtime-adjacent sourceで使われているstable ID。

Mappings:

| Character | authorId | stableProfileId |
|---|---|---|
| ユウビ | `yuubi` | `yubi` |
| カナメ | `kaname` | `kage1` |
| カスミ | `kasumi` | `kage2` |
| トキ | `toki` | `kage3` |
| ツムギ | `tsumugi` | `kage4` |

All other current working 36 are currently same ID in this manifest.

Important:

> **Alias mapはrename migration命令ではない。**

Do not:

- rename runtime IDs just for aesthetic consistency
- rewrite historical evidence files
- break save/data compatibility

Future clean-up needs separate migration plan and tests.

---

# 3. Current manifest coverage target

Each of 36 named Character should be locatable across:

1. Reality Root
2. Season architecture
3. Ordinary Life Reservoir
4. Social Chemistry
5. Behavior Identity
6. Lived Artifact
7. Theme Color
8. Living Place / pilgrimage reservoir
9. Physical Identity authority

Target:

```txt
36 named characters
× 9 discoverability dimensions
```

This does **not** mean every field in every source is Canon.

---

# 4. Current21 vs Future15

## Current21

`rosterLayer = CURRENT21`

- 21 characters
- social chemistry uses Current21 source
- all-pair directed speech has Current21-specific 210 pair / 420 directed lanes
- Current relationship inventory is a separate authority

## Future15

`rosterLayer = FUTURE15`

- 15 characters
- social chemistry uses Future15 reservoir
- season assignment does not promote to Current21
- appearing in Author DB does not promote to Current21
- having full profile coverage does not promote to playable

Important:

> **データが充実した = 本編登場確定**ではない。

---

# 5. Coverage does not imply authority

Example:

```txt
Yui
realityRoot: DECIDED
ordinaryLife: AUTHOR_RESERVOIR_NON_CANON
themeColor: AUTHOR_RESERVOIR_NON_CANON
physicalIdentity: CURRENT
```

A web page can show all four, but styling must distinguish them.

Recommended author-only UI:

- `CURRENT` = solid badge
- `CANDIDATE` = outline badge
- `RESERVOIR` = dotted badge
- `OPEN` = empty badge
- `SUPERSEDED` = struck/archived

Do not use only color for these statuses.

---

# 6. Per-character Author DB page skeleton

Recommended schema:

```txt
Character
├── Identity
│   ├── authorId
│   ├── stableProfileId
│   ├── displayName
│   └── rosterLayer
├── Current Profile
│   ├── core status
│   ├── Reality Root
│   ├── Era
│   ├── Physical Identity
│   └── Current relationships
├── Candidate / Reservoir
│   ├── ordinary life
│   ├── social chemistry
│   ├── behavior identity
│   ├── lived artifacts
│   ├── living places
│   └── theme colors
├── Story
│   ├── Season assignment
│   ├── incident function
│   ├── relationship hooks
│   └── former-enemy interactions
├── Production
│   ├── visual assets
│   ├── voice/animation notes
│   ├── generated-art review
│   └── implementation status
└── Authority
    ├── current sources
    ├── candidate sources
    ├── superseded sources
    └── last reviewed
```

---

# 7. Example — Yui

Do not duplicate full profile here; resolve from sources.

Expected source states:

- Author ID: `yui`
- Stable profile ID: `yui`
- roster: Current21
- Reality Root: **Arakawa / DECIDED**
- Present Era: Current
- Physical Identity: Current
- Ordinary Life: Reservoir
- Social Chemistry: Reservoir
- Behavior Identity: Reservoir
- Lived Artifact: Reservoir
- Living Place: Reservoir with Arakawa upstream Current
- Theme Color: Reservoir Candidate

Important:

> Yui page can be rich without pretending all rich data is Canon.

---

# 8. Example — Nagi / Yui lineage Candidate

Manifest must not infer:

```txt
same relationship hook
+ both have full profiles
+ related theme
= parent-child Canon
```

Lineage evidence remains separate.

Do not display:

> Parent: Nagi

until actual authority promotes it.

Author-only view can display:

> `PARENT_CANDIDATE / SPOILER-SENSITIVE`

from the correct lineage source later.

---

# 9. Example — Future15

Hiyori may have:

- full ordinary-life reservoir
- social chemistry
- behavior identity
- theme colors
- place seeds
- Reality root candidate

Yet:

```txt
rosterLayer = FUTURE15
Current21Promotion = false
Playable = not decided by this layer
```

This is intentional.

Deep author data should be prepared before promotion decisions.

---

# 10. Source hierarchy in UI

When same field conflicts:

1. explicit latest subdomain authority
2. current Story/World Master
3. Current registry/source
4. Candidate source
5. Reservoir
6. legacy/superseded

Do not merge values with majority vote.

Example:

Old profile:
> Yui favorite food = 焼きおにぎり

New Current authority:
> もんじゃ / たい焼き / 大判焼き

Correct:
> show new Current; old value may remain in history as superseded.

Wrong:
> list all four as equally current.

---

# 11. API / DB shape candidate

Future web implementation can expose:

```ts
type AuthorField<T> = {
  value: T | null;
  status: 'CURRENT' | 'CANDIDATE' | 'RESERVOIR' | 'OPEN' | 'SUPERSEDED';
  authority: string;
  spoiler: 'PUBLIC' | 'AUTHOR' | 'SPOILER';
  updatedAt?: string;
};
```

Character response Candidate:

```txt
id
stableIds
identity
appearance
reality
relationships
ordinaryLife
behavior
artifacts
places
colors
story
production
authority
```

Do not flatten every field into plain strings.

---

# 12. Spoiler boundary

Author DB may know more than public Character Book.

Minimum levels Candidate:

- `PUBLIC_PROFILE`
- `PUBLIC_AFTER_S1`
- `PUBLIC_AFTER_S2`
- `AUTHOR_ONLY`
- `MAIN_MYSTERY_LOCKED`

Examples:

- favorite food: public
- broad hometown after reveal: public/profile depending Story
- Nagi→Yui lineage Candidate: author/spoiler
- Main Mystery evidence chain: locked
- exact Future personhood reveal: spoiler

Public app must not expose all author data merely because machine source can access it.

---

# 13. Unknown handling

Do not fabricate to make UI complete.

Good:

```txt
exact hometown: OPEN
exact occupation: OPEN
exact romance: OPEN
```

Bad:

```txt
exact hometown: Tokyo (guessed)
occupation: teacher (inferred from personality)
romance: none (because no record)
```

Unknown fields are useful planning data.

---

# 14. Data quality dashboard candidate

Per Character show:

- Current fields count
- Candidate fields count
- Reservoir fields count
- Open questions count
- conflicted fields count
- superseded fields count
- missing production art count
- unreviewed generated visual count

Do not convert this to Character quality score.

A Character with many OPEN fields is not worse.

---

# 15. Relationship graph integration

Relationship graph should reference IDs, not duplicate relation prose.

Possible edge record:

```txt
fromId
toId
relationType
status
authority
season
spoilerLevel
callNamePresentation
historyEvents
```

Current21 all-pair 210 combinations can remain presentation layer without turning all 210 into Current emotional relationships.

---

# 16. Location integration

Living-place reservoir stores broad Character-linked anchors.

Future exact place object Candidate:

```txt
placeId
characterId
placeName
geo
status
authority
storyUses[]
realBusinessReview
spoilerLevel
pilgrimageReady
```

Exact real place does not become pilgrimageReady until Story/review gate.

---

# 17. Theme color integration

Theme color object:

```txt
primaryHex
accentHex
nightGlowHex
status
authority
familyHueCandidate
```

UI still needs non-color identifiers.

Theme color must not overwrite Physical Identity palette automatically.

---

# 18. Production status separation

Character may have Current story profile but missing art.

Keep separate:

```txt
storyReady
profileReady
physicalIdentityReady
artCandidateReady
artApproved
runtimeImplemented
voiceDirectionReady
animationDirectionReady
```

Do not infer:

> story complete = runtime complete

or:

> generated image exists = art approved

---

# 19. Current coverage represented by manifest

The machine manifest currently checks discoverability for all 36 across:

- Reality Root
- Season
- Ordinary Life
- Social Chemistry
- Behavior Identity
- Lived Artifact
- Theme Color
- Living Place
- Physical Identity authority

Expected result after current Reservoir batches:

```txt
36 / 36 discoverable across all 9 dimensions
```

If future sources intentionally become optional, update schema explicitly rather than silently weakening checker.

---

# 20. Author workflow

When adding a fact:

1. Decide whether it is Current / Candidate / Reservoir / Open.
2. Add it to the appropriate domain source.
3. Do not edit this manifest to fake coverage.
4. Checker should discover it from actual source.
5. If two sources conflict, resolve authority first.
6. Public UI reads spoiler/status rules.
7. Runtime promotion remains separate.

---

# 21. Completion

Required:

- 36 identities
- Current21 21
- Future15 15
- stable alias map explicit
- aliases do not trigger migration
- 9 discoverability dimensions
- 36/36 coverage after current batches
- source status remains visible
- Candidate not promoted to Current
- Future15 not promoted to Current21
- runtime does not auto-read Author DB

> **設定を一つに潰すDBではなく、「何が決まっていて、何が候補で、どこに根拠があるか」が一目で分かるDBにする。**
