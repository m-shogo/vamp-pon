# ヨルノシルベ Design Human Decision Interaction Protocol v1

Date: 2026-07-28
Status: **ADOPTED / mandatory for Heavy Design documentation refinement**
Repository: `m-shogo/vamp-pon`

## 1. 目的

この文書は、Heavy Designのドキュメントを深める途中で人間判断が必要になった場合に、ユーザーへ過剰な質問をせず、必要な判断だけを短い選択式で確認するための正本である。

現在のHeavy Designは`HOLD / documentation refinement only`であり、本書の採用は画像生成、asset加工、Unity実装、runtime変更、U49 evidence変更を開始するものではない。

```txt
heavyDesignStatus=HOLD
documentationRefinementAllowed=true
imageGenerationStarted=false
unityDesignImplementationStarted=false
u49EvidenceMutation=false
humanDecisionInteractionMode=SINGLE_DECISION_CLICK_SELECT
```

## 2. 基本原則

1. Repository、既存document、runtime code、既存targetから判断できることは、ユーザーへ質問せず調査して決める。
2. 一般的なbest practiceで明確に決められる技術事項は、推奨案を採用して理由をGitへ残す。
3. ヨルノシルベの印象、感情、好み、ブランド、最終承認に関わる事項だけをユーザーへ確認する。
4. 1回のやり取りでは、原則として1つの判断だけを求める。
5. 質問は2〜4択のクリック式を優先する。
6. 推奨案を最初の選択肢として示し、なぜ推奨かを質問前の短い説明に含める。
7. 選択肢は抽象語だけにせず、選ぶと何が決まるかが分かる具体的な文言にする。
8. 未回答中は、その判断に依存するdesign lock、画像生成、production昇格、Unity実装へ進まない。
9. 人間判断はappend-onlyで記録し、過去判断を削除または黙って上書きしない。
10. 自動テスト、画像ファイル名、AI推奨、formal PNGの存在は人間判断を代替しない。

## 3. ユーザーへ聞かずに進める領域

次は原則として作業側が自走する。

- 現在のGit branch、HEAD、PR、CI、readinessの確認。
- Existing target、helper、runtime capture、source codeの棚卸し。
- 文書間の矛盾検出と事実関係の整理。
- Color contrast、Safe Area、tap target、responsive tierなど客観基準の調査。
- Texture import、9-slice、atlas padding、naming、hash、provenanceなどの技術仕様案。
- Component stateの不足確認。
- Accessibility、performance、technical art、commercial provenanceに必要な項目の追加。
- 既存の明示的人間判断を正本へ同期する作業。
- 明らかな誤記、古いphase参照、用語不一致の修正。
- 複数案を提示する前の調査、比較表、推奨理由の作成。

ユーザーの時間を使わずに解決できることを、確認目的だけで質問してはいけない。

## 4. ユーザー判断が必要な領域

次のいずれかに該当するときだけ選択式で確認する。

### 4.1 Brand-defining decision

- TOPで最初に感じさせる感情の強さ。
- 夜、紙、黒インク、ランタン光の最終的な主従。
- 暗さ、温かさ、寂しさ、絵本感の最終バランス。
- Typographyが与える作品印象。
- CharacterとUIの質感を接続する最終方向。

### 4.2 Visually subjective decision

- 複数の有効なart directionから1つを選ぶ。
- 過去targetの良い部分を残すか、大きく再構成するか。
- 装飾密度、紙の荒さ、インクの強さなど、正解が1つでない項目。
- 生成した複数candidateの方向選択。

### 4.3 Scope or trade-off decision

- 品質、実装量、performance、制作量の優先順位が衝突する。
- 1つの選択が複数画面の制作範囲を大きく変える。
- 高品質化のために新規asset familyを追加するか、既存familyを再利用するか。

### 4.4 Explicit approval decision

- Art Directionを`LOCKED`にする。
- Generation briefを承認する。
- Direction candidateを選択する。
- Component familyを承認する。
- Whole screenを承認する。
- Whole-app visualをfreezeする。

これらはrepository agent、CI、checker、ChatGPTが代理承認してはいけない。

## 5. クリック式質問の形式

### 5.1 1問1判断

1つの質問に複数の独立判断を混ぜない。

悪い例:

```txt
TOPは暖かくしますか、暗くしますか。フォントと紙質も選んでください。
```

良い例:

```txt
TOPの第一印象はどれにしますか？
```

### 5.2 選択肢数

```txt
minimum=2
preferred=3
maximum=4
```

候補が5つ以上ある場合は、作業側で比較して3案程度まで絞ってから聞く。

### 5.3 推奨案

推奨案は原則として最初に置く。

```txt
A. 静かな夜＋小さな温かさ（推奨）
B. より寂しく幻想的
C. 絵本らしく親しみやすい
```

推奨案を隠して中立を装わない。ただし、推奨案を自動承認扱いにもしない。

### 5.4 選択肢の品質

各選択肢は次を満たす。

- 選択結果が具体的に想像できる。
- 他の選択肢と意味が重複しない。
- 「良い感じ」「お任せ」だけの曖昧な選択肢にしない。
- 技術用語だけでユーザーに判断させない。
- 選択による影響を必要最小限の説明で示す。

### 5.5 UI

ChatGPT上では、利用可能な場合は`single_select`型のクリックUIを使用する。

```txt
interaction=CLICK_SELECT
selectionType=SINGLE_SELECT
oneDecisionPerTurn=true
```

複数選択は、項目が本当に独立しており、同時選択しても矛盾しない場合だけ使用する。

クリックUIが利用できない場合のみ、`A / B / C`の一文字返信で代替する。長文回答を必須にしない。

## 6. 質問前に作業側が用意するもの

ユーザーへ判断を求める前に、次を完了する。

1. 関係する正本を読む。
2. 既存targetとcurrent runtimeを比較する。
3. 既に決定済みの人間判断と矛盾しないか確認する。
4. 客観的に除外できる案を除外する。
5. 2〜4案へ整理する。
6. 各案のメリット、弱点、他画面への影響を把握する。
7. 推奨案と推奨理由を決める。
8. 判断後に更新するdocument／registryを特定する。

調査不足をユーザー質問で埋めてはいけない。

## 7. 回答後の処理

ユーザーが選択したら次を行う。

1. 選択内容をそのまま確認する。
2. 関係するdocumentへ反映する。
3. Decision IDを付与する。
4. 日付、source chat、選択肢、選択結果、理由、影響範囲を記録する。
5. Supersedeする過去判断がある場合は参照関係を残す。
6. 選択で解放された次のdocumentation taskだけを進める。
7. 画像生成またはUnity実装は、それぞれの別gateが揃うまで開始しない。

Decision recordの最低項目:

```json
{
  "decisionId": "HD-DEC-0001",
  "status": "DECIDED",
  "question": "",
  "options": [],
  "recommendedOption": "",
  "selectedOption": "",
  "decisionSource": "USER_CLICK_SELECTION",
  "decidedAt": "YYYY-MM-DD",
  "affectedDocuments": [],
  "affectedScreens": [],
  "supersedes": [],
  "notes": ""
}
```

## 8. Decision status

```txt
NOT_RESEARCHED
RESEARCHING
READY_TO_ASK
AWAITING_USER_SELECTION
DECIDED
SUPERSEDED
CANCELLED
```

`READY_TO_ASK`へ進めるには、比較と推奨理由が完成している必要がある。

`AWAITING_USER_SELECTION`中は、依存作業をHOLDする。

## 9. 質問をまとめすぎない

ユーザーの負担を減らすため、複数のdesign decisionを一度に一覧で投げない。

推奨順:

```txt
1. 最も上流で、他の判断を左右する1問
2. 回答をGitへ反映
3. 次のdocument refinementを進める
4. 次に必要になった1問だけを提示
```

1回の返信で大量の選択を求めることを禁止する。

## 10. 想定される将来の判断順

これは現時点で質問を開始するものではない。調査後、必要なものだけを1問ずつ確認する。

1. ヨルノシルベ全体の最終感情バランス。
2. Paper UIの質感方向。
3. Typographyの印象方向。
4. Icon familyの表現方向。
5. TOPのcomposition direction。
6. StageSelectの夜路direction。
7. LevelUpの記憶札direction。
8. Battle HUDの情報密度。
9. Resultの余韻と達成感の配分。
10. 各生成candidateの人間選択。

上流判断が未決定のまま下流の画像候補を選ばせてはいけない。

## 11. 現在値

```txt
humanDecisionProtocol=ADOPTED
pendingHumanDecisionCount=0
activeHumanDecision=null
nextAction=CONTINUE_DOCUMENTATION_REFINEMENT_AUTONOMOUSLY
imageGeneration=NOT_STARTED
unityDesignImplementation=NOT_STARTED
```

現時点でユーザーへ求めるdesign decisionはない。

今後、ユーザー判断が本当に必要になった時点で、クリック式の1問だけを提示する。

## 12. Stop conditions

次の場合は作業を停止し、選択式判断を求める。

- 有効な複数方向が残り、客観基準だけでは1つへ決められない。
- 既存の人間判断と新しい設計案が衝突する。
- ブランド印象を変える可能性がある。
- 画像生成briefの承認が必要。
- Candidate selectionが必要。
- Production／whole-screen／whole-app承認が必要。

次の場合は質問せず、自走して修正する。

- 明らかなdocument contradiction。
- 技術上不可能または品質gateを満たさない案の除外。
- 誤記、古いphase、壊れたリンク、重複した正本。
- 一般的なmobile UI、accessibility、performance、asset pipelineのbest practice適用。

## 13. Final rule

Heavy Designの目的は、ユーザーに設計作業を丸投げすることではない。

作業側が調査、比較、推奨、文書化を最大限進め、作品固有の判断と最終承認だけを、短いクリック式でユーザーへ委ねる。
