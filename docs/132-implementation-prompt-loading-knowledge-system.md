# Implementation Prompt: Loading Knowledge System

Vamp Pon / ヴァンサバ改のロード知識システムを実装するための、Claude Code / Codex 向け実装プロンプト正本。

この資料は、以下の設計資料を実装作業に落とすためのもの。

- `docs/122-loading-text-presentation-patterns.md`
- `docs/124-morning-poems-and-memory-room-spec.md`
- `docs/125-loading-knowledge-system-production-plan.md`
- `docs/126-loading-knowledge-consistency-guardrails.md`
- `docs/127-everyday-english-phrase-final-candidates.md`
- `docs/128-rare-japanese-literary-phrase-final-candidates.md`
- `docs/129-serious-literary-quote-final-candidates.md`
- `docs/130-regional-quote-proverb-final-candidates.md`
- `docs/131-initial-knowledge-lines-integration-spec.md`

---

## 1. 実装対象

あなたは `/Users/m-shogo/Developer/personal/vamp-pon` のみを対象に作業してください。
GitHub repo は `https://github.com/m-shogo/vamp-pon.git` です。
このrepo以外は絶対に触らないでください。

目的:

```txt
ロード画面に、名言・格言・日常英語・難語・地域の言葉・キャラ返信を表示する基盤を作る。
ただし最初から全部盛らず、Launch Core 22件だけを通常ロード候補にする。
Context Gated 12件はデータ化してもよいが、条件がない限り通常候補から除外する。
```

---

## 2. 最重要方針

```txt
ロード名言は、知識欲と世界観の入口。
キャラ返信は、その子の価値観。
朝明ポエムは、その子が少し進んだ証。
記録室は、プレイヤーが調べたい/見返したい欲求の受け皿。
```

この実装では、まず `ロード名言 + キャラ返信 + 既読保存` の最小実装を優先する。

朝明ポエム/記録室は、今回できる範囲で下地だけでもよい。

---

# 3. 作るファイル

既存構成を確認して、適切な場所に置くこと。
候補は以下。

```txt
src/data/knowledgeLines.ts
src/data/characterKnowledgeReplies.ts
src/data/morningPoems.ts
src/systems/LoadingKnowledgeManager.ts
src/ui/LoadingTextRenderer.ts
src/scenes/MemoryRoomScene.ts または src/ui/MemoryRoomPanel.ts
```

既存命名規則が違う場合は、repoの規則に合わせる。

---

# 4. TypeScript型

必要に応じて `src/types/knowledge.ts` などに分離してよい。

```ts
export type KnowledgeCategory =
  | 'quote'
  | 'regional_quote'
  | 'everyday_phrase'
  | 'rare_word'
  | 'vamp_original'
  | 'parody_prompt';

export type KnowledgeRegion =
  | 'india'
  | 'europe'
  | 'east_asia'
  | 'japan'
  | 'america_caribbean';

export type CommercialStatus =
  | 'safe-candidate'
  | 'common-expression-candidate'
  | 'public-domain-candidate'
  | 'final-check-required'
  | 'original'
  | 'do-not-display';

export type PresentationPattern =
  | 'ink-bloom'
  | 'lantern-reveal'
  | 'page-turn'
  | 'bell-ripple'
  | 'postcard-stamp'
  | 'star-pin'
  | 'water-memory'
  | 'thread-stitch'
  | 'black-glitch'
  | 'curtain-whisper';

export type KnowledgeLine = {
  id: string;
  category: KnowledgeCategory;
  originalText: string;
  sourceLabel: string;
  languageLabel: string;
  meaningJa: string;
  researchHooks: string[];
  region?: KnowledgeRegion;
  tags: string[];
  commercialStatus: CommercialStatus;
  presentationPattern: PresentationPattern;
  minVisibleMs: number;
  launchTier: 'launch-core' | 'context-gated' | 'hold';
  gateTags?: string[];
};

export type CharacterKnowledgeReply = {
  id: string;
  knowledgeLineId: string;
  characterId: string;
  replyJa: string;
  replyEn?: string;
  tone: 'serious' | 'small-joke' | 'sad-funny' | 'dry' | 'gentle' | 'quiet' | 'soft-parody';
  tags: string[];
  rank: 'S' | 'A' | 'B' | 'C';
};

export type SeenKnowledgeEntry = {
  id: string;
  firstSeenAt: number;
  lastSeenAt: number;
  seenCount: number;
  completedReadCount: number;
  stagesSeenIn: string[];
  replyIdsSeen: string[];
};
```

---

# 5. 初期投入データ

まずは Launch Core 22件だけを通常ロード候補にする。

## 5.1 Launch Core 22件

```txt
Bless you.
Take care.
Good night.
See you.
Fingers crossed.

閑話休題
曖昧模糊
有耶無耶
薄明
画竜点睛

We grow accustomed to the Dark.
Sunt lacrimae rerum.
E quindi uscimmo a riveder le stelle.
Music, when soft voices die, vibrates in the memory.
What's in a name?
春はあけぼの。
行く川のながれは絶えずして、しかももとの水にあらず。

Per aspera ad astra.
反者道之動。
無用之用
すべて何も皆事のととのほりたるはあしき事なり。
Cat luck ain't dog luck.
```

各データの詳細は以下のdocsから転記する。

```txt
docs/127-everyday-english-phrase-final-candidates.md
docs/128-rare-japanese-literary-phrase-final-candidates.md
docs/129-serious-literary-quote-final-candidates.md
docs/130-regional-quote-proverb-final-candidates.md
docs/131-initial-knowledge-lines-integration-spec.md
```

## 5.2 Context Gated 12件

データ化してもよいが、通常ロード候補には入れない。

```txt
No worries.
Hang in there.
Knock on wood.

余談ながら
序破急
蛇足

The rest is silence.

tasmād asaktaḥ satataṁ kāryaṁ karma samācara
phandanaṁ capalaṁ cittaṁ dūrakkhaṁ dunnivārayaṁ...
Sit in thy cell and thy cell will teach thee all.
すべて、何も皆、始め終りこそをかしけれ。
Wuh ain't miss you, ain't pass you.
```

---

# 6. 初期返信

まずは各KnowledgeLineにつき、返信1件だけでよい。

```txt
Bless you. → ユイ
Take care. → セナ
Good night. → ネム
See you. → クロエ
Fingers crossed. → イオリ

閑話休題 → ナギ
曖昧模糊 → シノ
有耶無耶 → ユイ
薄明 → ヒナタ
画竜点睛 → ハク

We grow accustomed to the Dark. → ユイ
Sunt lacrimae rerum. → ユイ
E quindi uscimmo a riveder le stelle. → ナギ
Music, when soft voices die... → リツ
What's in a name? → シノ
春はあけぼの。 → コハル
行く川のながれは絶えずして... → ミチル

Per aspera ad astra. → ナギ
反者道之動。 → ナギ
無用之用 → ハク
徒然草 不完全 → トモリ
Cat luck ain't dog luck. → ナギ
```

返信本文は、それぞれの候補docから転記する。

---

# 7. LoadingKnowledgeManager

実装する責務:

```txt
1. KnowledgeLine候補を選ぶ。
2. do-not-display は絶対に除外する。
3. launchTier === 'launch-core' を通常候補にする。
4. context-gated は context.tags と gateTags が一致した時だけ候補に入れる。
5. 直近3ロードで同じKnowledgeLineを出さない。
6. 直近5ロードで同じCharacterReplyを出さない。
7. 同じcategoryは3連続禁止。
8. rare_wordは2連続禁止。
9. 同じregionは3連続禁止。
10. selectedCharacterId がある場合、そのキャラ返信を優先する。ただし該当返信がなければ無理に出さない。
```

Context型の例:

```ts
export type LoadingKnowledgeContext = {
  selectedCharacterId?: string;
  stageId?: string;
  tags?: string[];
  isFirstBoot?: boolean;
  isAfterDefeat?: boolean;
  isBlackGaugeHigh?: boolean;
};
```

戻り値の例:

```ts
export type SelectedKnowledgeLine = {
  line: KnowledgeLine;
  reply?: CharacterKnowledgeReply;
};
```

---

# 8. localStorage保存

保存キー案:

```txt
vampPon.seenKnowledgeEntries.v1
vampPon.recentKnowledgeHistory.v1
```

保存内容:

```txt
seenKnowledgeEntries: SeenKnowledgeEntry[]
recentKnowledgeLineIds: string[]
recentReplyIds: string[]
recentCategories: KnowledgeCategory[]
recentRegions: KnowledgeRegion[]
```

要件:

```txt
localStorage parse失敗時は空として扱う。
保存データが壊れていてもゲームを止めない。
```

---

# 9. LoadingTextRenderer

最小実装でよい。

表示順:

```txt
Original
Source
日本語訳/意味
Character reply
```

UI条件:

```txt
390x844のスマホ縦画面で読める。
左右24px以上の余白。
Originalは最大3行。
Meaningは最大3行。
Replyは最大2行。
出典は小さめ。
```

文字演出:

初期は以下5種類だけ。

```txt
lantern-reveal
ink-bloom
page-turn
bell-ripple
postcard-stamp
```

まだ本格アニメーションが難しい場合:

```txt
CSS class / Phaser tween / alpha / slight y offset の差だけでもよい。
ただし pattern ごとに見た目が少し変わるようにする。
```

重要:

```txt
演出完了後、最低1.5秒は完全に読める状態を保持する。
```

---

# 10. 表示時間

初期値:

```txt
minVisibleMs: 4600〜5600
skipEnableMs: 1200〜2400
readableHoldMs: 1500
```

ルール:

```txt
初見は短すぎない。
既読は早めにスキップ可。
キャラ返信つきは少し長め。
```

---

# 11. Memory Room 下地

今回必須ではないが、できるなら下地だけ作る。

MVP:

```txt
見たKnowledgeLineだけ一覧に出す。
詳細で Original / Source / Meaning / Reply を見られる。
```

後回し:

```txt
検索
SNS共有
音声再生
高度なアニメーション
外部リンク
```

---

# 12. 実装時の禁止事項

```txt
原文をVamp Pon風に改変しない。
出典不明な言葉を本物っぽく追加しない。
新規候補を勝手に増やさない。
do-not-displayを出さない。
現代作品の台詞/歌詞/ゲーム台詞を入れない。
宗教/文化の言葉に軽口返信をつけない。
読めないほど文字を動かさない。
```

---

# 13. 検証項目

実装後に確認する。

```txt
□ 起動してロード画面が壊れない
□ KnowledgeLineが1件表示される
□ Original / Source / Meaning / Reply の順で読める
□ 390x844で改行が崩れない
□ 直近同じ文が連続しない
□ rare_wordが2連続しない
□ context-gatedが通常ロードに混ざらない
□ localStorage破損時も落ちない
□ do-not-displayが表示されない
□ TypeScriptエラーがない
```

可能なら:

```txt
npm run typecheck
npm run lint
npm test
npm run build
```

repoに存在するコマンドだけ実行する。

---

# 14. 実装順

```txt
1. docsを読み、既存ロード/シーン構成を確認する。
2. 型を追加する。
3. knowledgeLines.ts に Launch Core 22件を入れる。
4. characterKnowledgeReplies.ts に22返信を入れる。
5. LoadingKnowledgeManager を作る。
6. LoadingTextRenderer を作る。
7. 既存ロード/起動フローに接続する。
8. localStorageのseen/recent保存を入れる。
9. 表示崩れと重複回避を確認する。
10. 余裕があればMemory Room下地を作る。
```

---

# 15. 最終ゴール

```txt
ロードで言葉が読める。
出典と意味が分かる。
キャラ返信でその子の価値観が見える。
同じ文がしつこく出ない。
あとで記録室に残せる下地がある。
```

この段階では、量より破綻しない体験を優先する。
