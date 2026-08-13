# 夜綴りの八影（よつづりの・やつかげ） v1

Status: **SUPERSEDED / LEGACY EARLY OBSERVER LABEL / COMPATIBILITY SOURCE ONLY**

> Current formal Season 1 antagonist team is **朔夜座（さくやざ）**.
> Highest authority: `docs/00-current-story-world-master.md`.
> Migration authority: `docs/sakuyaza-current-identity-v1.md`.
>
> この文書は旧 `八影 / 夜綴りの八影` 名義で作られた呼び名・Enemy ID・関係・pair・演出資産を失わないための互換資料であり、Currentの正式team名・Visual Master名・player-facing final labelのAuthorityではない。

## 旧観測ラベル

Legacy formal label: **夜綴りの八影**  
Legacy short label: **八影（やつかげ）**

Current migration:

```txt
八影 / 夜綴りの八影
= early observer label / legacy authored namespace

朔夜座
= Season 1 Current formal antagonist team
```

旧資料では、夜に残った八つの強い「読み違い」をCurrent側の観測記録からまとめたtaxonomyとして扱っていた。
この意味・呼び名の成立過程はmigration reservoirとして保持するが、**現在の8人がformal teamではない**という旧organization semanticsはCurrentへ自動復帰させない。

## 8人の呼び名 — compatibility data

| Enemy identity | 作中で定着した呼び名 | 読み | 旧役割メモ |
|---|---|---|---|
| 持ち主のない名前 | **ナシロ** | なしろ | ambiguous threat |
| 閉じた朝箱 | **アサトジ** | あさとじ | tragic mirror |
| 帰路のない夜 | **ミチグレ** | みちぐれ | overwhelming force |
| オンブロ 黒折 | **オリネ** | おりね | recurring rival |
| オンブロ 余白枠 | **ハクマ** | はくま | uncanny observer |
| オンブロ 継ぎ目 | **ツグリ** | つぐり | broken caretaker |
| オンブロ 夢波 | **ユラネ** | ゆらね | tempting escape |
| オンブロ 名札 | **ペタ** | ぺた | petty nemesis |

この8呼称は削除しない。現在の朔夜座8人へ継承されるcall-name / stable Enemy lineageとして扱う。

## 名前の扱い

この8つは**真名ではなく呼び名**。

- ナシロ等のcall nameからReality本名・前世名・speciesを自動Canon化しない。
- 旧 `八影` 名義で作られたrelationship / encounter / pair assetsは削除せず、朔夜座Authorityの下で再審査する。
- 旧文書名・旧machine IDを理由に、`八影` をCurrent formal team名へ戻さない。
- `八影` をS2/S3のteam名へ転用しない。

## Production / migration rule

既存Enemy48の `id / current name / silhouette / palette / attackCue` は保持する。

Machine compatibility source:
- `src/game/data/yatsukageIdentitySource.ts`

Current S1 source:
- `src/game/data/storyWorldMasterSource.ts`
- `src/game/data/sakumeiCandidateSource.ts` (`SAKUYAZA_CURRENT_IDENTITY`)
- `docs/sakuyaza-current-identity-v1.md`

Do not:
- Enemy49を追加する
- legacy `八影` taxonomyをCurrent formal factionへ戻す
- 旧pair / relation資料を名前だけ置換して無検証Canon化する
- 真名・人間時代・前世を自動Canon化する
- legacy labelだけでruntime unlockを作る

## Compatibility guarantee

旧Asset / relation / pair / call-name lineageは保持する。
ただしCurrent表示・新規設定画・攻略DB・TOP・Loading・最終Visual Masterでは、明示的なearly-observer sceneを除き**朔夜座**をCurrent formal nameとして扱う。
