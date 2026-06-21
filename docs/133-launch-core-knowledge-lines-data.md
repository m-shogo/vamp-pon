# Launch Core Knowledge Lines Data

Vamp Pon / ヴァンサバ改のロード知識システムに最初に投入する Launch Core 22件の実装用データ正本。

この資料は、`docs/132-implementation-prompt-loading-knowledge-system.md` から実装へ移る時の転記ミスを減らすためのもの。

---

## 1. 方針

```txt
新しい候補は増やさない。
Launch Core 22件だけをTSデータ化しやすい形にする。
各KnowledgeLineにつきCharacterReplyはまず1件だけ。
```

初期実装では、以下のみ通常ロード候補にする。

```txt
launchTier: 'launch-core'
```

`context-gated` は次段階。

---

## 2. TypeScript前提

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
```

---

# 3. knowledgeLines.ts 草案

```ts
import type { KnowledgeLine } from '../types/knowledge';

export const launchCoreKnowledgeLines: KnowledgeLine[] = [
  {
    id: 'everyday-bless-you',
    category: 'everyday_phrase',
    originalText: 'Bless you.',
    sourceLabel: 'Common expression / English',
    languageLabel: 'English',
    meaningJa: 'くしゃみをした人へかける、ちいさな気づかいの言葉。',
    researchHooks: ['Bless you meaning', 'Bless you sneeze expression'],
    tags: ['care', 'small-ritual', 'sound'],
    commercialStatus: 'common-expression-candidate',
    presentationPattern: 'bell-ripple',
    minVisibleMs: 4600,
    launchTier: 'launch-core',
  },
  {
    id: 'everyday-take-care',
    category: 'everyday_phrase',
    originalText: 'Take care.',
    sourceLabel: 'Common expression / English',
    languageLabel: 'English',
    meaningJa: '気をつけて。また会うために渡す短い言葉。',
    researchHooks: ['Take care meaning', 'Take care farewell expression'],
    tags: ['care', 'farewell', 'road', 'delivery'],
    commercialStatus: 'common-expression-candidate',
    presentationPattern: 'postcard-stamp',
    minVisibleMs: 4600,
    launchTier: 'launch-core',
  },
  {
    id: 'everyday-good-night',
    category: 'everyday_phrase',
    originalText: 'Good night.',
    sourceLabel: 'Common expression / English',
    languageLabel: 'English',
    meaningJa: 'おやすみ。夜に渡す、やさしい別れの言葉。',
    researchHooks: ['Good night meaning', 'Good night farewell expression'],
    tags: ['night', 'farewell', 'light'],
    commercialStatus: 'common-expression-candidate',
    presentationPattern: 'lantern-reveal',
    minVisibleMs: 4600,
    launchTier: 'launch-core',
  },
  {
    id: 'everyday-see-you',
    category: 'everyday_phrase',
    originalText: 'See you.',
    sourceLabel: 'Common expression / English',
    languageLabel: 'English',
    meaningJa: 'またね。戻ってくる余白を残す別れの言葉。',
    researchHooks: ['See you meaning', 'See you farewell expression'],
    tags: ['farewell', 'return', 'name'],
    commercialStatus: 'common-expression-candidate',
    presentationPattern: 'postcard-stamp',
    minVisibleMs: 4600,
    launchTier: 'launch-core',
  },
  {
    id: 'everyday-fingers-crossed',
    category: 'everyday_phrase',
    originalText: 'Fingers crossed.',
    sourceLabel: 'Common expression / English',
    languageLabel: 'English',
    meaningJa: 'うまくいくように、指を重ねて願う言葉。',
    researchHooks: ['Fingers crossed meaning', 'Fingers crossed origin'],
    tags: ['wish', 'luck', 'small-ritual', 'delivery'],
    commercialStatus: 'common-expression-candidate',
    presentationPattern: 'postcard-stamp',
    minVisibleMs: 4600,
    launchTier: 'launch-core',
  },

  {
    id: 'rare-jp-kanwa-kyudai',
    category: 'rare_word',
    originalText: '閑話休題',
    sourceLabel: 'Japanese literary transition phrase',
    languageLabel: 'Japanese',
    meaningJa: 'それはさておき、本題に戻ること。',
    researchHooks: ['閑話休題 意味', '閑話休題 語源'],
    tags: ['transition', 'return', 'road'],
    commercialStatus: 'safe-candidate',
    presentationPattern: 'page-turn',
    minVisibleMs: 4600,
    launchTier: 'launch-core',
  },
  {
    id: 'rare-jp-aimai-moko',
    category: 'rare_word',
    originalText: '曖昧模糊',
    sourceLabel: 'Japanese four-character idiom',
    languageLabel: 'Japanese',
    meaningJa: 'ぼんやりして、はっきりしないこと。',
    researchHooks: ['曖昧模糊 意味', '曖昧模糊 語源'],
    tags: ['vague', 'road', 'name'],
    commercialStatus: 'safe-candidate',
    presentationPattern: 'ink-bloom',
    minVisibleMs: 4600,
    launchTier: 'launch-core',
  },
  {
    id: 'rare-jp-uya-muya',
    category: 'rare_word',
    originalText: '有耶無耶',
    sourceLabel: 'Japanese four-character idiom',
    languageLabel: 'Japanese',
    meaningJa: 'あるのかないのか、はっきりしないままにすること。',
    researchHooks: ['有耶無耶 意味', '有耶無耶 語源'],
    tags: ['uncertain', 'record', 'lost-item'],
    commercialStatus: 'safe-candidate',
    presentationPattern: 'ink-bloom',
    minVisibleMs: 4600,
    launchTier: 'launch-core',
  },
  {
    id: 'rare-jp-hakumei',
    category: 'rare_word',
    originalText: '薄明',
    sourceLabel: 'Japanese literary word',
    languageLabel: 'Japanese',
    meaningJa: '日の出前や日没後の、ほのかな明るさ。',
    researchHooks: ['薄明 意味', '薄明 時間帯'],
    tags: ['morning', 'twilight', 'light'],
    commercialStatus: 'safe-candidate',
    presentationPattern: 'lantern-reveal',
    minVisibleMs: 4600,
    launchTier: 'launch-core',
  },
  {
    id: 'rare-jp-garyu-tensei',
    category: 'rare_word',
    originalText: '画竜点睛',
    sourceLabel: 'Japanese four-character idiom',
    languageLabel: 'Japanese',
    meaningJa: '最後の大事な仕上げ。物事を完成させる一筆。',
    researchHooks: ['画竜点睛 意味', '画竜点睛 故事'],
    tags: ['finish', 'repair', 'fear'],
    commercialStatus: 'safe-candidate',
    presentationPattern: 'ink-bloom',
    minVisibleMs: 4600,
    launchTier: 'launch-core',
  },

  {
    id: 'quote-dickinson-dark',
    category: 'quote',
    originalText: 'We grow accustomed to the Dark.',
    sourceLabel: 'Emily Dickinson / We grow accustomed to the Dark',
    languageLabel: 'English',
    meaningJa: '人は、暗闇にも少しずつ慣れてしまう。',
    researchHooks: ['Emily Dickinson We grow accustomed to the Dark'],
    tags: ['dark', 'night', 'light'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'lantern-reveal',
    minVisibleMs: 5200,
    launchTier: 'launch-core',
  },
  {
    id: 'quote-virgil-lacrimae-rerum',
    category: 'quote',
    originalText: 'Sunt lacrimae rerum.',
    sourceLabel: 'Virgil / Aeneid I.462 / Latin',
    languageLabel: 'Latin',
    meaningJa: 'ものごとの中にも、涙のようなものがある。',
    researchHooks: ['Sunt lacrimae rerum', 'Virgil Aeneid I.462'],
    tags: ['lost-item', 'memory', 'water'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'ink-bloom',
    minVisibleMs: 5200,
    launchTier: 'launch-core',
  },
  {
    id: 'quote-dante-riveder-stelle',
    category: 'quote',
    originalText: 'E quindi uscimmo a riveder le stelle.',
    sourceLabel: 'Dante Alighieri / Inferno XXXIV.139 / Italian',
    languageLabel: 'Italian',
    meaningJa: 'そして私たちは外へ出て、もう一度星を見た。',
    researchHooks: ['Dante riveder le stelle', 'Inferno XXXIV.139'],
    tags: ['star', 'return', 'light'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'lantern-reveal',
    minVisibleMs: 5400,
    launchTier: 'launch-core',
  },
  {
    id: 'quote-shelley-soft-voices',
    category: 'quote',
    originalText: 'Music, when soft voices die, vibrates in the memory.',
    sourceLabel: 'Percy Bysshe Shelley / Music, When Soft Voices Die',
    languageLabel: 'English',
    meaningJa: 'やわらかな声が消えても、音は記憶の中で震え続ける。',
    researchHooks: ['Shelley Music When Soft Voices Die'],
    tags: ['sound', 'memory', 'silence'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'bell-ripple',
    minVisibleMs: 5600,
    launchTier: 'launch-core',
  },
  {
    id: 'quote-shakespeare-name',
    category: 'quote',
    originalText: "What's in a name?",
    sourceLabel: 'William Shakespeare / Romeo and Juliet II.ii',
    languageLabel: 'English',
    meaningJa: '名前の中には、何があるのだろう。',
    researchHooks: ["What's in a name Shakespeare", 'Romeo and Juliet II.ii'],
    tags: ['name', 'memory'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'page-turn',
    minVisibleMs: 5000,
    launchTier: 'launch-core',
  },
  {
    id: 'quote-sei-shonagon-spring-dawn',
    category: 'quote',
    originalText: '春はあけぼの。',
    sourceLabel: '清少納言 / 枕草子 / Japanese classical prose',
    languageLabel: 'Japanese',
    meaningJa: '春は、夜が明けるころがよい。',
    researchHooks: ['春はあけぼの', '枕草子 春はあけぼの'],
    tags: ['morning', 'spring', 'light'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'lantern-reveal',
    minVisibleMs: 5000,
    launchTier: 'launch-core',
  },
  {
    id: 'quote-hojoki-river-flow',
    category: 'quote',
    originalText: '行く川のながれは絶えずして、しかももとの水にあらず。',
    sourceLabel: '鴨長明 / 方丈記 / Japanese classical prose',
    languageLabel: 'Japanese',
    meaningJa: '川の流れは絶えないが、そこにある水は前と同じではない。',
    researchHooks: ['方丈記 行く川のながれ', '鴨長明 方丈記'],
    tags: ['river', 'flow', 'memory', 'water'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'ink-bloom',
    minVisibleMs: 5600,
    launchTier: 'launch-core',
  },

  {
    id: 'regional-europe-per-aspera-ad-astra',
    category: 'regional_quote',
    originalText: 'Per aspera ad astra.',
    sourceLabel: 'Latin proverb',
    languageLabel: 'Latin',
    meaningJa: '困難を越えて、星へ。',
    researchHooks: ['Per aspera ad astra meaning', 'Latin proverb ad astra'],
    region: 'europe',
    tags: ['star', 'road'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'lantern-reveal',
    minVisibleMs: 5000,
    launchTier: 'launch-core',
  },
  {
    id: 'regional-east-asia-daodejing-40',
    category: 'regional_quote',
    originalText: '反者道之動。',
    sourceLabel: '道徳経 第四十章 / Classical Chinese',
    languageLabel: 'Classical Chinese',
    meaningJa: '戻ること、反転することが、道の動きである。',
    researchHooks: ['反者道之動', '道徳経 第四十章', 'Daodejing 40'],
    region: 'east_asia',
    tags: ['return', 'road'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'ink-bloom',
    minVisibleMs: 5200,
    launchTier: 'launch-core',
  },
  {
    id: 'regional-east-asia-zhuangzi-uselessness',
    category: 'regional_quote',
    originalText: '無用之用',
    sourceLabel: '荘子 / Classical Chinese / uselessness motif',
    languageLabel: 'Classical Chinese',
    meaningJa: '役に立たないと思われるものにこそ、別の用い方がある。',
    researchHooks: ['無用之用', '荘子 無用之用', 'Zhuangzi uselessness'],
    region: 'east_asia',
    tags: ['uselessness', 'blank'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'page-turn',
    minVisibleMs: 5200,
    launchTier: 'launch-core',
  },
  {
    id: 'regional-japan-tsurezuregusa-incomplete',
    category: 'regional_quote',
    originalText: 'すべて何も皆事のととのほりたるはあしき事なり。',
    sourceLabel: '徒然草 / 吉田兼好 / Japanese classical prose',
    languageLabel: 'Japanese',
    meaningJa: '何もかも完全に整っているのは、かえってよくない。',
    researchHooks: ['徒然草 ととのほりたるはあしき事', '吉田兼好 不完全の美'],
    region: 'japan',
    tags: ['incomplete', 'repair', 'blank'],
    commercialStatus: 'public-domain-candidate',
    presentationPattern: 'ink-bloom',
    minVisibleMs: 5400,
    launchTier: 'launch-core',
  },
  {
    id: 'regional-caribbean-cat-luck-dog-luck',
    category: 'regional_quote',
    originalText: "Cat luck ain't dog luck.",
    sourceLabel: 'Bajan proverb / Barbados / Bajan Creole',
    languageLabel: 'Bajan Creole',
    meaningJa: '猫の幸運が、犬にも通じるとは限らない。',
    researchHooks: ["Cat luck ain't dog luck", 'Bajan proverb cat luck dog luck'],
    region: 'america_caribbean',
    tags: ['luck', 'road', 'delivery'],
    commercialStatus: 'final-check-required',
    presentationPattern: 'postcard-stamp',
    minVisibleMs: 5000,
    launchTier: 'launch-core',
  },
];
```

---

# 4. characterKnowledgeReplies.ts 草案

```ts
import type { CharacterKnowledgeReply } from '../types/knowledge';

export const launchCoreCharacterKnowledgeReplies: CharacterKnowledgeReply[] = [
  {
    id: 'reply-bless-you-yui',
    knowledgeLineId: 'everyday-bless-you',
    characterId: 'yui',
    replyJa: '忘れ物にも、言っていいのかな。',
    replyEn: 'Can I say it to a lost item too?',
    tone: 'gentle',
    tags: ['care', 'lost-item'],
    rank: 'S',
  },
  {
    id: 'reply-take-care-sena',
    knowledgeLineId: 'everyday-take-care',
    characterId: 'sena',
    replyJa: '気をつけることって、運ぶより重い。',
    replyEn: 'Taking care can be heavier than carrying.',
    tone: 'gentle',
    tags: ['care', 'delivery'],
    rank: 'S',
  },
  {
    id: 'reply-good-night-nemu',
    knowledgeLineId: 'everyday-good-night',
    characterId: 'nemu',
    replyJa: '夜が返事したら、どうするの。',
    replyEn: 'What do we do if the night answers back?',
    tone: 'quiet',
    tags: ['night'],
    rank: 'S',
  },
  {
    id: 'reply-see-you-chloe',
    knowledgeLineId: 'everyday-see-you',
    characterId: 'chloe',
    replyJa: 'それ、終わりっぽくなくて助かる。',
    replyEn: 'That helps. It does not sound like the end.',
    tone: 'dry',
    tags: ['farewell', 'return'],
    rank: 'S',
  },
  {
    id: 'reply-fingers-crossed-iori',
    knowledgeLineId: 'everyday-fingers-crossed',
    characterId: 'iori',
    replyJa: '重ねた指は、方位針には向いてない。',
    replyEn: 'Crossed fingers make a poor compass needle.',
    tone: 'dry',
    tags: ['wish', 'road'],
    rank: 'S',
  },

  {
    id: 'reply-kanwa-kyudai-nagi',
    knowledgeLineId: 'rare-jp-kanwa-kyudai',
    characterId: 'nagi',
    replyJa: '寄り道にも、帰り道があるんだね。',
    replyEn: 'Even detours have a way home.',
    tone: 'gentle',
    tags: ['road', 'return'],
    rank: 'S',
  },
  {
    id: 'reply-aimai-moko-shino',
    knowledgeLineId: 'rare-jp-aimai-moko',
    characterId: 'shino',
    replyJa: 'ぼんやりしているものほど、名前が遠い。',
    replyEn: 'The blurrier something is, the farther its name feels.',
    tone: 'quiet',
    tags: ['name', 'vague'],
    rank: 'S',
  },
  {
    id: 'reply-uya-muya-yui',
    knowledgeLineId: 'rare-jp-uya-muya',
    characterId: 'yui',
    replyJa: 'ないことにしたものほど、先に見つかる。',
    replyEn: 'The things we pretend are gone are often found first.',
    tone: 'gentle',
    tags: ['lost-item', 'uncertain'],
    rank: 'S',
  },
  {
    id: 'reply-hakumei-hinata',
    knowledgeLineId: 'rare-jp-hakumei',
    characterId: 'hinata',
    replyJa: '朝は、縫い目から先に明るくなる。',
    replyEn: 'Morning brightens the stitches first.',
    tone: 'gentle',
    tags: ['morning', 'repair'],
    rank: 'S',
  },
  {
    id: 'reply-garyu-tensei-haku',
    knowledgeLineId: 'rare-jp-garyu-tensei',
    characterId: 'haku',
    replyJa: '最後の一筆が怖い日もある。',
    replyEn: 'Some days, the last stroke is the scariest.',
    tone: 'quiet',
    tags: ['finish', 'blank'],
    rank: 'S',
  },

  {
    id: 'reply-dickinson-dark-yui',
    knowledgeLineId: 'quote-dickinson-dark',
    characterId: 'yui',
    replyJa: '慣れてしまう前に、灯したい。',
    replyEn: 'I want to light it before we get used to it.',
    tone: 'gentle',
    tags: ['light', 'night'],
    rank: 'S',
  },
  {
    id: 'reply-lacrimae-rerum-yui',
    knowledgeLineId: 'quote-virgil-lacrimae-rerum',
    characterId: 'yui',
    replyJa: '忘れ物にも、泣き方があるんだね。',
    replyEn: 'Even lost things have their own way to cry.',
    tone: 'gentle',
    tags: ['lost-item', 'memory'],
    rank: 'S',
  },
  {
    id: 'reply-riveder-stelle-nagi',
    knowledgeLineId: 'quote-dante-riveder-stelle',
    characterId: 'nagi',
    replyJa: 'もう一度、星を見に行こう。',
    replyEn: 'Let us go see the stars again.',
    tone: 'gentle',
    tags: ['star', 'return'],
    rank: 'S',
  },
  {
    id: 'reply-soft-voices-ritsu',
    knowledgeLineId: 'quote-shelley-soft-voices',
    characterId: 'ritsu',
    replyJa: '消えた声ほど、よく響くんだ。',
    replyEn: 'The voices that disappear echo the most.',
    tone: 'quiet',
    tags: ['sound', 'memory'],
    rank: 'S',
  },
  {
    id: 'reply-name-shino',
    knowledgeLineId: 'quote-shakespeare-name',
    characterId: 'shino',
    replyJa: '私には、まだ入りきらない。',
    replyEn: 'Mine still cannot hold all of me.',
    tone: 'quiet',
    tags: ['name'],
    rank: 'S',
  },
  {
    id: 'reply-spring-dawn-koharu',
    knowledgeLineId: 'quote-sei-shonagon-spring-dawn',
    characterId: 'koharu',
    replyJa: 'まだ寒くても、芽は知ってる。',
    replyEn: 'Even while it is cold, the sprouts know.',
    tone: 'gentle',
    tags: ['spring', 'morning'],
    rank: 'S',
  },
  {
    id: 'reply-river-flow-michiru',
    knowledgeLineId: 'quote-hojoki-river-flow',
    characterId: 'michiru',
    replyJa: '流したかったものだけ、残るんだね。',
    replyEn: 'Only the things I wanted to wash away remain.',
    tone: 'quiet',
    tags: ['water', 'memory'],
    rank: 'S',
  },

  {
    id: 'reply-per-aspera-nagi',
    knowledgeLineId: 'regional-europe-per-aspera-ad-astra',
    characterId: 'nagi',
    replyJa: '星に行くなら、遠回りでも地図がいる。',
    replyEn: 'If we are going to the stars, even detours need a map.',
    tone: 'gentle',
    tags: ['star', 'road'],
    rank: 'S',
  },
  {
    id: 'reply-daodejing40-nagi',
    knowledgeLineId: 'regional-east-asia-daodejing-40',
    characterId: 'nagi',
    replyJa: '戻る道も、地図に描いていいんだ。',
    replyEn: 'Even a road back belongs on the map.',
    tone: 'gentle',
    tags: ['return', 'road'],
    rank: 'S',
  },
  {
    id: 'reply-zhuangzi-uselessness-haku',
    knowledgeLineId: 'regional-east-asia-zhuangzi-uselessness',
    characterId: 'haku',
    replyJa: '白紙も、まだ使い道がないだけかもしれない。',
    replyEn: 'Maybe a blank page simply has not found its use yet.',
    tone: 'quiet',
    tags: ['blank', 'uselessness'],
    rank: 'S',
  },
  {
    id: 'reply-tsurezuregusa-incomplete-tomori',
    knowledgeLineId: 'regional-japan-tsurezuregusa-incomplete',
    characterId: 'tomori',
    replyJa: '直しすぎると、残らない傷もある。',
    replyEn: 'Some cracks disappear if you repair too much.',
    tone: 'gentle',
    tags: ['repair', 'incomplete'],
    rank: 'S',
  },
  {
    id: 'reply-cat-luck-nagi',
    knowledgeLineId: 'regional-caribbean-cat-luck-dog-luck',
    characterId: 'nagi',
    replyJa: 'じゃあ、私の地図も他の子には危ないね。',
    replyEn: 'Then my map might be dangerous for someone else.',
    tone: 'small-joke',
    tags: ['luck', 'road'],
    rank: 'S',
  },
];
```

---

# 5. 実装時の注意

## 5.1 commercialStatus

```txt
common-expression-candidate: 日常英語。初期表示可。
safe-candidate: 一般語/難語。初期表示可。
public-domain-candidate: 古典/公有領域候補。初期表示可。ただし最終商用前に確認。
final-check-required: 初期表示可にしているものは少数のみ。最終商用前に必ず確認。
```

## 5.2 Bajan proverb

`Cat luck ain't dog luck.` はLaunch Coreに含めるが、商用前には最終確認する。

```txt
commercialStatus: 'final-check-required'
```

理由:

```txt
地域の生活格言として魅力があるが、方言/出典の扱いを丁寧に確認する必要がある。
```

## 5.3 Quote translation

`meaningJa` は既存翻訳ではなく、ゲーム内で意味を伝えるための短い自前文として扱う。

---

# 6. 最終方針

この22件だけで、最初のロード体験は成立する。

```txt
日常英語で軽く入る。
日本語難語で知識欲を刺激する。
古典引用で格を出す。
地域格言で世界の広がりを出す。
キャラ返信でVamp Ponの価値観へ戻す。
```

まずはこの22件を実装し、表示時間・改行・重複回避・記録室保存の体験を確認する。
