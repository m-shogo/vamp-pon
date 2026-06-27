# World Labels

Latest production-facing index: `docs/181-current-production-canon.md`.

Canonical data sources:

- Core labels: `src/game/data/worldTerms.ts`
- Core character art names: `src/game/data/characterArts.ts`
- Kokuyou character forms: `src/game/data/kokuyouForms.ts`
- Core5 pair arts: `src/game/data/pairLightArts.ts`
- Screen labels: `src/game/data/screenLabels.ts`
- Item production canon: `src/game/data/itemProductionCanon.ts` and `docs/design/item-and-character-production-canon.md`
- Character production plans: `src/game/data/characterProductionPlans.ts` and `docs/design/character-production-plans.md`
- A-Z emblems: `src/game/data/emblemCanon.ts`, `docs/design/emblem-canon.md`, and `docs/design/az-emblem-canon.md`

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
| Result | 旅の記録 |
| Stage clear | 夜明け |
| Fragment currency | 記憶片 |

## Inventory labels

| Target | Label |
| --- | --- |
| Weapon / active item | 灯具 |
| Passive | 持ち物 |
| Rare item | 忘れ物 |
| Field drop | 落とし物 |
| Recovery | 朝露 |
| Capsule | 記憶包み |
| Currency | 記憶片 |

## Stat labels

| Target | Label |
| --- | --- |
| Magnet | 回収 |
| Might | 灯力 |
| XP | 成長 |
| Move speed | 足取り |
| Cooldown | 手数 |

## Screen labels

| Target | Label |
| --- | --- |
| Home | 灯りの家 |
| Start | 夜へ出る |
| Continue | 灯を継ぐ |
| Retry | もう一度、夜へ |
| Character select | 旅人を選ぶ |
| Character detail | 旅人の記録 |
| Upgrade screen | 旅支度 |
| Permanent upgrade | 支度 |
| Shop | 忘れ物市 |
| Settings | 設定 |
| Initial weapon | 最初の忘れ物 |
| Pair art list | 灯合わせ録 |

## Emblem labels

| Target | Label |
| --- | --- |
| Common device | 灯紋具 |
| Character emblem | 灯紋 |
| Unlocked blank phase | 無紋 |
| Dawn phase | 暁紋 |
| Kokuyou phase | 黒紋 |
| Pair phase | 双灯紋 |
| Emblem series | A-Z灯紋 |

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

This game should avoid battle-only words such as 必殺, 殲滅, 暴走, and 覚醒 in player-facing UI unless the scene specifically needs danger.
Prefer 灯す, 継ぐ, 結ぶ, しまう, 導く, 直す, 返す, and 夜明け.
Kokuyou is the exception: it may use darker words, but the common visible label stays 黒耀化.

## Cutin and emblem rule

Cutin art and emblem art should stay textless.
Draw character names, labels, subtitles, AZ codes, phase labels, and art names with UI text.
