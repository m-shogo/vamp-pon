# P0 Character Reference Generation Handoff

Date: 2026-08-10  
Status: **CURRENT EXTERNAL GENERATION HANDOFF / GENERATED ART REMAINS CANDIDATE**

## Purpose

帰宅後にCodex等の外部画像生成作業へ渡す時、ハナ / カナメのpromptを手で再構成しない。

Current production dataから、その時点の:

- Theme HEX
- Star Beast
- silhouette
- posture
- clothing shape
- Named Object
- motion signature
- hard body direction
- negative prompt
- review checklist
- expected output path

をまとめてexportする。

## Default P0

```txt
hana   = ハナ   = plus-size older woman
kage1  = カナメ = plus-size young adult man
```

P0で最初に作るのは **character_reference** のみ。

いきなりsprite / cutinを量産しない。

## Export command

Markdown:

```bash
node --experimental-strip-types tools/asset-factory/scripts/export-character-reference-handoff.ts \
  --priority P0 \
  --format markdown \
  --output tmp/character-reference-handoff-p0.md
```

JSON:

```bash
node --experimental-strip-types tools/asset-factory/scripts/export-character-reference-handoff.ts \
  --priority P0 \
  --format json \
  --output tmp/character-reference-handoff-p0.json
```

標準出力でよければ `--output` は省略できる。

Priority:

```txt
P0
P1
P2
all
```

Format:

```txt
markdown
json
```

## Expected P0 outputs

Hana:

```txt
public/assets/prototypes/characters/hana/references/hana-reference-v1.png
```

Kaname:

```txt
public/assets/prototypes/characters/kage1/references/kage1-reference-v1.png
```

出力先はprototype / candidate領域。

## Non-negotiable visual locks

### Hana

- plus-size older woman
- soft round torso / arms / cheeks
- visible age impression
- rounded shawl
- `#B5495B`
- ふっくらした白鳥
- 押し花 / 花脈の保管箱

禁止:

- slim model proportions
- rejuvenation
- food comedy
- slow/clumsy body comedy
- weight-loss Dawn reward

### Kaname

- plus-size broad young adult man
- wide shoulders + thick soft torso
- thick arms / legs
- strong but **not bodybuilder triangle**
- `#2B2B2B`
- 大きな灰狼
- 受け灯の腕帯
- fast protective intercept posture

禁止:

- slim anime male normalization
- bodybuilder conversion
- clumsy / slow / overeating comedy
- body-size-as-tank-stat shorthand
- slimming Dawn reward

## After generation

生成しただけでは:

```txt
NOT approved reference
NOT final art
NOT runtime art
NOT runtime wired
```

初期状態:

```txt
CANDIDATE_REVIEW_REQUIRED
```

次の順で扱う。

```txt
reference image generated
↓
Asset Factory import / visual QA
↓
manual review
↓
queue state update
↓
reference registration candidate
↓
explicit reference approval if accepted
↓
only later: sprite / cutin generation
```

`Character Reference Readiness` CIは、新しいreference画像がrepoへ入ったのにqueueをmissingのまま放置するとfailする。

## Existing Core5 handling

P1のアサ / ナギ / ミチル / トモリは既存masterを先にreviewする。

**新AIで作り直した方が新しいから**という理由だけで再生成しない。

YuiはGolden identity referenceをrevalidateし、問題がなければ維持する。

## Reserve Ren

RenはCurrent21 silhouette coverageに含まれるが、Current20 Asset Factory production scopeにはまだ自動追加しない。

## One sentence

> **画像生成セッションへ渡す情報は手書きで再現せず、Current repo dataからその場でexportする。ハナとカナメの身体性は生成時もreview時もhard lockとして扱う。**
