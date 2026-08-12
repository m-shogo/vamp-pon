# Character Reality Root Map Read Model v1

Status: **CURRENT AUTHORING GEOGRAPHY MAP / 36 CHARACTERS / REGION LEVEL / NO EXACT HOME PIN**

## Purpose

作者用プロフィールBookで、36人の**Reality Root / incident area / mobility / dialect visibility / source status**を地理的に見渡すためのread-model。

これは住所録ではない。`characterRealityRootRegistry` の情報を、出身・生活圏・事件参加地域を混同せず地図UIへ渡せる形にする。

## Core distinction

The map must keep these concepts separate:

- `root` — the character's current Reality Root/origin-side setting
- `incidentArea` — where an incident or major life lane may occur
- `mobility` — why movement between them is plausible
- `sourceStatus` — how authoritative the root setting currently is
- `dialectVisibility` — how visible regional speech residue may be, not what the person is like

**incident area is not automatically birthplace or home.**

## Coverage

- 36 characters
- Current21 = 21
- Future15 = 15
- route uses `authorId`
- stable profile ID remains visible for data provenance
- source status remains visible
- exact coordinates remain unset in v1

## Placement classes

### `REAL_JAPAN_REGION`

Use region-level placement only.

Examples include prefecture/city/cultural-zone scale such as 荒川区, 仙台圏, 静岡県西部, 山形県庄内, 金沢市圏, 横浜市圏, etc.

The future UI may resolve these labels to regional map positions, but must not invent an exact house, school, workplace, apartment, hospital, shop, or incident coordinate.

Pin policy: `REGION_LEVEL_ONLY`.

### `FUTURE_ABSTRACT`

Far-future roots such as future metropolitan Human households, activation sites, or municipal/service fleet regions do not belong on a present-day Japan street map as fake coordinates.

Render them in an abstract Future layer or separate map lane.

Pin policy: `ABSTRACT_FUTURE_LANE`.

### `OPEN_UNMAPPED`

When the Reality Root itself explicitly remains Open, the map should show `Open / 未確定` rather than guess a location.

Pin policy: `NO_PIN_OPEN`.

## Hard boundaries

The geography view must not infer:

- prefecture/region = personality
- dialect visibility = intelligence, class, friendliness, roughness, comedy, or morality
- skin tone = nationality/origin
- name = origin
- body type = region
- sexuality/gender/presentation = region
- incident area = birthplace
- current residence = birthplace
- mobility = trauma
- regional root = automatic historical-disaster involvement

A character from a region does not automatically represent that region.

## Dialect boundary

Dialect metadata may be displayed as authoring context, but it is not a script generator.

Existing levels remain source-owned:

- `D0_STANDARD_DOMINANT`
- `D1_LIGHT_RESIDUE`
- `D2_HOME_REGISTER`
- `D3_EMOTION_BREAKTHROUGH`
- `NONVERBAL_NOT_APPLICABLE`

A future script/voice pass may research exact wording separately. The map must not manufacture stereotyped regional lines.

## Incident / mobility boundary

The UI should be able to reveal a root-to-incident-area relationship without drawing it as destiny.

Mobility exists to answer: **「なぜその人がその時代・地域の出来事に関われるのか？」**

It does not mean every listed mobility candidate is already Canon. Source status and wording such as `*_OR_*` must remain visible rather than silently collapsing to one answer.

## Future representation

Future society has geographic continuity with Japan only where source says so. Abstract future metropolitan/fleet/activation regions should not be forced into a fake modern address.

Likewise, Future15 status does not mean future-era origin. Roster layer and temporal era are separate concepts.

## Pilgrimage / real-place boundary

Real place names are valuable for texture and possible future pilgrimage value, but v1 does not automatically generate:

- tourist recommendations
- exact photo spots
- private residences
- negative plot claims about real businesses
- “this real disaster happened to this character” associations

Those need separate story fit and review.

## UI guidance

Useful future filters:

- Current21 / Future15
- Reality Root status
- prefecture/region text
- root vs incident area
- mobility class
- dialect visibility
- profile route

Recommended map interaction:

1. select a region-level character marker
2. show root + status first
3. optionally show incident area and mobility as a separate connection
4. link to `/characters/{authorId}`
5. make `Candidate / Derived / Decided / Open` visually distinguishable

Do not make marker size equal importance or popularity.

## Runtime boundary

- no gameplay map
- no stage unlock generation
- no GPS
- no exact-coordinate save data
- no automatic pilgrimage content
- no Canon promotion

## Authoring principle

**地図は「この県の人だからこういう性格」を作るためではなく、その人がどこから来て、なぜ別の場所へ行けたのかをSource付きで確かめるために使う。**
