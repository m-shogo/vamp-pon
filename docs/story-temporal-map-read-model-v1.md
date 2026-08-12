# Story Temporal Map Read Model v1

Status: **CURRENT AUTHORING TEMPORAL MAP / 5 REALITY ERA LANES + DREAM OVERLAY / EXACT YEARS OPEN**

## Purpose

ヨルノシルベの複数時代構造を、作者用プロフィールBookでひと目で追えるようにするread-model。

これは西暦を埋めるための確定年表ではない。現在のAuthorityが持つ **5つのReality Era lane** と、そこを横断して人物が交差する **Dream World overlay** を表示可能な形へ投影する。

## Reality chronology

The five Core5 reality lanes are ordered in chronological direction:

1. トモリ — 戦後復興・物資不足期
   - rough historical band: `POST_1945_TO_EARLY_1950S_LIKE`
2. ミチル — 高度成長末期〜公害・石油危機の転換期
   - rough historical band: `LATE_1960S_TO_1970S_LIKE`
3. ナギ — バブル崩壊後〜携帯Internet初期
   - rough historical band: `LATE_1990S_TO_EARLY_2000S_LIKE`
4. ユイ — 現代日本
   - rough historical band: `2020S_CURRENT`
5. アサ — 遠未来 Human / Android / Robot / Avatar共存社会
   - rough historical band: `FAR_FUTURE_EXACT_YEAR_OPEN`

## Exact-year boundary

All exact years remain **Open**.

The rough historical bands are authoring/display reference bands, not exact date authority. The UI must not convert them into fake dates such as `1948`, `1973`, `1999`, or a fixed future year merely because a concrete axis looks cleaner.

Recommended display:

- `戦後復興・物資不足期 — おおよそ1945年以後〜1950年代初頭相当`
- `高度成長末期〜公害・石油危機の転換期 — 1960年代末〜1970年代相当`
- `バブル崩壊後〜携帯Internet初期 — 1990年代末〜2000年代初頭相当`
- `現代日本 — 2020年代現在相当`
- `遠未来 — exact year Open`

The UI should visibly say **approx / rough band / Open** rather than silently presenting precision that the source does not have.

## Historical incident boundary

Real historical events may be used as research evidence for the social texture of an era. They must not be renamed and copied into fiction as the major incident.

Each lane keeps its current fictional incident direction and `forbiddenAutoCanon` list visible to author tooling.

- real incident != renamed fictional incident
- an incident from one era must not be copied unchanged into another era
- present-day social assumptions are not the default correct answer
- future society is not a Human upgrade ladder

## Dream overlay

**Dream World is not a sixth physical era.**

ヨルノシルベ overlays the five reality lanes so people from different eras can coexist inside a shared dream-like space.

Important boundaries:

- physical morning does not exist inside the dream layer
- waking returns each person to **their own reality era**, not to one shared present
- normal waking explicitly loses dream memory
- implicit learning may remain
- resolution-direction memory recovery remains possible
- explicit time tags are intentionally weak inside the dream

This means the authoring timeline should draw the Dream World as a band or layer crossing the reality lanes, not as one more point at the right edge of chronological time.

## Sky / constellation overlay

The temporal map intentionally exposes a future sky overlay hook because the series uses the night sky as both visual identity and historical clue.

Current boundaries:

- stars remain visible
- the same constellation set is **not required across eras**
- constellations used historically can later disappear from accepted lists
- constellations can be introduced later in history
- real astronomy is useful research material but is not an absolute constraint on the dream world's representation
- the final cause/reason for constellation change remains Open

A future Profile Book may therefore add a sky strip above the era lanes, showing historically appropriate constellation differences or “not yet adopted / later abandoned” clues when backed by source research.

## UI guidance

Recommended authoring visualization:

- horizontal reality lanes in chronological direction
- each lane card shows lead, rough band, status and fictional incident direction
- exact year area explicitly says `Open`
- Dream overlay spans all five lanes
- sky/constellation overlay may sit above the timeline
- source/provenance should be inspectable

Do not encode:

- left = primitive / wrong
- right = advanced / correct
- future = morally superior
- older era = ignorant
- present = objective standard
- dream = later chronological era

## Future expansion

Later source-aware projections can add:

- fictional incident markers
- historical research context markers
- character birth/life bands only where authoritative enough
- relationship changes by era/season
- constellation-history markers
- seasonal story events

Do not fabricate missing years merely to make those layers line up.

## Runtime boundary

- no game clock
- no save chronology
- no runtime era unlock order
- no automatic Story/Canon promotion
- no automatic constellation gameplay rule

## Authoring principle

**「年表」は年号を埋めるためではなく、同じ星空の下で何が違い、夢の中で何が交差するかを見せる地図にする。**
