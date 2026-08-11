# 夜綴りの八影（よつづりの・やつかげ） v1

Status: CURRENT CONTENT IDENTITY / RUNTIME PROMOTION GATED

## 総称

正式総称: **夜綴りの八影**  
短縮: **八影（やつかげ）**

これは悪の組織名ではない。
夜に残った八つの強い「読み違い」を、Current側の観測記録でまとめて呼ぶtaxonomy。

- 8体が仲間とは限らない
- 上下関係を意味しない
- 共通の創造者を意味しない
- 黒幕の配下を意味しない
- 真名を知ったことを意味しない

ファン/作中人物が「八影の誰が好き？」と呼べるブランド名として使う。

## 8体の呼び名

| Current enemy identity | 作中で定着する呼び名 | 読み | 役割 |
|---|---|---|---|
| 持ち主のない名前 | **ナシロ** | なしろ | ambiguous threat |
| 閉じた朝箱 | **アサトジ** | あさとじ | tragic mirror |
| 帰路のない夜 | **ミチグレ** | みちぐれ | overwhelming force |
| オンブロ 黒折 | **オリネ** | おりね | recurring rival |
| オンブロ 余白枠 | **ハクマ** | はくま | uncanny observer |
| オンブロ 継ぎ目 | **ツグリ** | つぐり | broken caretaker |
| オンブロ 夢波 | **ユラネ** | ゆらね | tempting escape |
| オンブロ 名札 | **ペタ** | ぺた | petty nemesis |

## 名前の扱い

この8つは**真名ではなく呼び名**。
ヨルノシルベでは「名前を付ける」こと自体が物語テーマなので、便利だからといって真実を固定しない。

特にナシロは、名前を勝手に固定する敵へこちらがまた勝手な本名を与える矛盾を避けるため、明示的に「呼び名」とする。

ペタだけは意図的に軽い。
八影が全員重苦しい悲劇敵になるのを避け、「またペタいる」と言われる recurring petty rival の愛着枠にする。

## Production rule

既存Enemy48の `id / current name / silhouette / palette / attackCue` を上書きしない。
八影Identityはその上に載るcharacter-facing layer。

Machine source:
- `src/game/data/yatsukageIdentitySource.ts`

Do not:
- Enemy49を追加する
- 八影を秘密結社化する
- 八影全員を改心させる
- 真名・人間時代・前世を自動Canon化する
- 呼び名だけでruntime unlockを作る
