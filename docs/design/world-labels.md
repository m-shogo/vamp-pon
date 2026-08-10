# World Labels

Latest production-facing index: `docs/181-current-production-canon.md`.

Canonical data sources:

- Core labels: `src/game/data/worldTerms.ts`
- Persistent meta-currency display: `src/game/data/metaCurrencyDisplay.ts`
- Economy split: `src/game/data/collectionEconomyTerminology.ts`
- Core character art names: `src/game/data/characterArts.ts`
- Kokuyou character forms: `src/game/data/kokuyouForms.ts`
- Core5 pair arts: `src/game/data/pairLightArts.ts`
- Screen labels: `src/game/data/screenLabels.ts`
- Item production canon: `src/game/data/itemProductionCanon.ts` and `docs/design/item-and-character-production-canon.md`
- Character production plans: `src/game/data/characterProductionPlans.ts` and `docs/design/character-production-plans.md`
- **Current Toumon simple-sigil authority:** `src/game/data/toumonSimpleSigilCanon.ts` and `docs/design/toumon-simple-sigil-canon-v2.md`
- Emblem compatibility adapter: `src/game/data/emblemCanon.ts`; legacy A-Z notes: `docs/design/az-emblem-canon.md`
- IP symbol / merchandise system: `docs/design/ip-symbol-merch-system-v1.md`

## Product title

| Target | Label |
| --- | --- |
| Player-visible work title | ヨルノシルベ |
| Legacy development code names | Vamp Pon / VAMP PON / ヴァンサバ改 |

Legacy code names may remain in repository history, identifiers and migration notes, but must not be introduced as new production-facing title copy.

## Adopted labels

| Target | Label |
| --- | --- |
| Art categories | 灯技 / 継灯 / 暁灯 |
| Kokuyou form | 黒耀化 |
| Kokuyou backlash | 煤返り |
| Kokuyou gauge | 黒耀瓶 |
| Kokuyou value | 黒耀値 |
| Evolution / upgrade | 灯継ぎ |
| Second evolution / awakening | 暁開き |
| Fusion / pair art | 灯合わせ |
| Rare slot | 忘れ物 |
| Collection | 灯録 |
| Achievement | 記憶のしるし |
| Result archive concept | 旅の記録 |
| Stage clear | 夜明け |
| Run-only level-up pickup | 記憶片 |
| Persistent meta currency | `metaCurrencyDisplay.ts` Current label (`黒曜片` at 2026-07-29) |

`記憶片` and the persistent wallet are separate concepts. Do not use one display name for both.

`灯貨` remains a high-value candidate for the persistent wallet and is not Current until explicit Human naming approval.

## Inventory labels

| Target | Label |
| --- | --- |
| Weapon / active item | 灯具 |
| Passive | 持ち物 |
| Rare item | 忘れ物 |
| Field drop | 落とし物 |
| Recovery | 朝露 |
| Capsule | 記憶包み |
| Run fragment | 記憶片 |
| Persistent currency | `metaCurrencyDisplay.ts` Current label |

## Stat labels

| Target | Label |
| --- | --- |
| Magnet | 回収 |
| Might | 灯力 |
| XP stat concept | 成長 |
| Move speed | 足取り |
| Cooldown | 手数 |

The player-facing pickup itself is `記憶片`. Avoid first-run copy such as `EXPを拾う` when the actual visible pickup is a memory fragment.

## Screen labels

| Target | Label |
| --- | --- |
| Home flavor location | 灯りの家 |
| Start | 夜へ出る |
| Continue | 灯を継ぐ |
| Retry | もう一度、夜へ |
| Stage select | 夜の地図 |
| Character select | 旅人を選ぶ |
| Character detail | 旅人の記録 |
| Collection | 灯録 |
| Upgrade / meta growth | 旅支度 |
| Permanent upgrade section | 支度 |
| Shop | 忘れ物市 |
| Settings | 設定 |
| Initial weapon | 最初の灯具 |
| Pair art list | 灯合わせ録 |

`黒曜研究所` is not a Current screen label. Do not invent a facility/lore entity merely to name the growth screen; use `旅支度` and explain the function with short supporting copy.

## Settings baseline labels

| Setting | Player label |
| --- | --- |
| BGM volume | BGM |
| SE volume | SE |
| Haptic toggle | 振動 |
| Reduced-motion mode | 演出を控えめに |

Exact implementation and persistence are defined in `docs/SETTINGS-BASELINE.md`.

## Result copy lock

| Meaning | Current player copy |
| --- | --- |
| Clear title | 夜明け |
| Failed-run title | 夜に飲まれた |
| Failed-run explanation | この読み方では、朝まで残れなかった。 |
| Rewards section | 持ち帰り |
| New records section | 新しい記録 |
| Elite row | 強敵 |
| No-black-youka bonus | 黒耀化なし |
| Defeated-enemy count | ほどいた影 |

Player-visible kill/death wording should not imply literal canonical death. Internal telemetry fields such as `kills` may remain unchanged.

## Emblem / symbol labels

| Target | Label |
| --- | --- |
| Common device | 灯紋具 |
| Character simple sigil | 灯紋 |
| Unlocked blank phase | 無紋 |
| Dawn phase | 暁紋 |
| Kokuyou phase | 黒紋 |
| Pair phase | 双灯紋 |
| Named Object history mark | 履歴刻 |
| Night route / station common mark | 夜路印 |
| Legacy implementation code family | A-Z灯紋 |

### Toumon visual naming rule

`A-Z灯紋` is a compatibility/asset-management family label, not a reason to put letters or numbers inside the Character mark.

Player-facing Toumon art is:

- textless
- one-color capable
- simple abstract geometry
- object/animal illustration-free

as defined in `toumon-simple-sigil-canon-v2.md`.

## Core5 art names

| Character | 灯技 | 継灯 | 暁灯 |
| --- | --- | --- | --- |
| ユイ | 夜解きの灯 | 忘れ火の道標 | 消えない名前 |
| アサ | 名札灯し | 暁綴り | 暁に結ぶ名 |
| ナギ | 月箱の鍵 | 封月の守り | 夜をしまう箱 |
| ミチル | 帰針 | 星図の道糸 | 帰り道の星 |
| トモリ | 継火 | ほころび灯し | 夜を直す灯 |

## Core5 Kokuyou subtitles

| Character | Subtitle |
| --- | --- |
| ユイ | 呼びすぎた名前 |
| アサ | 黒い名札 |
| ナギ | 開いた月箱 |
| ミチル | 迷い星図 |
| トモリ | ほころぶ継火 |

20-character Kokuyou subtitles are stored in `src/game/data/kokuyouForms.ts`.

## Core5 pair arts

| Pair | Name |
| --- | --- |
| ユイ x アサ | 名を呼ぶ灯 |
| ユイ x ナギ | しまえない灯 |
| ユイ x ミチル | 帰り道を呼ぶ灯 |
| ユイ x トモリ | 消えかけを継ぐ灯 |
| アサ x ナギ | 鍵つきの名札 |
| アサ x ミチル | 暁の道しるべ |
| アサ x トモリ | 綴じ直す名 |
| ナギ x ミチル | 月箱の星図 |
| ナギ x トモリ | 直した箱庭 |
| ミチル x トモリ | 継ぎ星の道 |

## Naming rule

One concept should have one primary player-facing label. Flavor text may paraphrase it, but buttons, counters, settings and tutorial instructions must not introduce a competing noun.

The game should avoid battle-only words such as 必殺, 殲滅, 暴走, and 覚醒 in player-facing UI unless the scene specifically needs danger.
Prefer 灯す, 継ぐ, 結ぶ, しまう, 導く, 直す, 返す, ほどく, and 夜明け.
Kokuyou is the exception: it may use darker words, but the common visible label stays 黒耀化.

For critical interaction labels, clarity beats poetic density. A poetic subtitle can sit below a clear system label; do not require the player to decode lore in order to operate the UI.

Core functional UI is Japanese-first. Decorative English may exist as visual texture, but primary section names and actions must not depend on English-only labels such as `Rewards`, `New Records`, or `Elite`.

## Cutin and Toumon rule

Cutin art and Toumon art stay textless.
Draw character names, labels, subtitles, legacy A-Z codes, phase labels, and art names with UI text.

Toumon master geometry is never changed merely because the product tier is premium or the cutin is more dramatic.
