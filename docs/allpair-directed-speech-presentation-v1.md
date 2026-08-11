# Current21 All-pair Directed Speech Presentation v1

Date: 2026-08-11  
Status: **PROTOTYPE CONTENT PRESENTATION / NUMERIC + DEFAULT ADDRESS NOT FINAL**

## Goal

Current21から自由に3人を選べるなら、Featured24以外のpairでも関係値が会話へ返らなければ「好感度は数字だけ」になる。

そのため:

```txt
210 unordered pairs
420 directed Affinity lanes
420 directed speech presentation lanes
```

を揃える。

## Authority split

### Featured24 / 48 directions

既存 `relationshipSpeechProgressionSource.ts` の手書きtrackをそのまま最優先する。

例:

- ユイ → アサ: アサちゃん → アサ
- アサ → ユイ: ユイのまま、主語/待ち方が変わる
- コヨリ → リツ: Dawnでも「お兄ちゃん」
- ミチル → ゲン: Dawnでも「ゲンさん」
- トキ: 高Bondでも敬語維持が成立

### Baseline186 / 372 directions

固有関係を捏造せず、安全なprogressive registerを使う。

変えるのは主に:

- 命令 → 依頼 / 相談
- Assistへの反応
- 名前を呼ぶ頻度
- 「任せる」
- 弱音
- 小さな冗談
- 言葉を省いても通じる範囲
- CRISIS時の一時的な防衛話法

呼称変更そのものは親密さの必須条件にしない。

## Bond + directed Affinity

会話距離をpair共有Bondだけで決めない。

Prototypeでは:

```txt
speech eligibility = min(shared Bond, speaker→target Affinity)
```

とする。

理由:

- 二人で長く戦った歴史は共有できる
- でもA→Bの感情とB→Aの感情は同じとは限らない

例:

```txt
A↔B Bond = 80
A→B Affinity = 80
B→A Affinity = 10

A→B presentation = DEEP_TRUST候補
B→A presentation = FIRST_READ相当
```

この数式/thresholdはplaytest前のprototypeであり最終balanceではない。

## Address policy

Featured24のexact call-nameはCurrent authority。

残り372方向のdefault addressは、会話制作を開始できるようspeaker registerから暫定生成するが:

> `PROTOTYPE_DEFAULT_ADDRESS_NOT_CANON`

であり、最終Canonではない。

暫定register:

- polite name + さん
- direct name
- younger polite

専用関係が追加された時は必ず専用trackが上書きする。

### Important

- high Bond = 呼び捨て、ではない
- high Bond = nickname、ではない
- 敬語が残る = 距離がある、ではない
- 呼び方が変わらない人物は、主語/依頼/沈黙/弱音で変化させる

## Crisis

CRISISはstored Bond/Affinityを下げない。

高関係でも:

- 急ぐ
- 一方的に守る
- 正解を押し付ける
- 説明しなくなる

など本人の古い防衛反応が一時的に戻る。

危機後に関係値を「リセット」しない。

## Dawn

baseline pairでもDAWN presentationを持てるが、scoreだけでは出さない。

`DAWN_PROOF` が必要。

つまり低Stage周回だけで最終会話にならない。

## Romance boundary

Bond/Affinityの数値から:

- 恋愛
- 友情
- 家族
- 師弟
- ライバル

を推定しない。

恋愛は別のContent authorityが明示した場合だけ扱う。

## 3-person battle

A/B/C Partyなら6方向:

```txt
A→B B→A
A→C C→A
B→C C→B
```

を持てる。

同じshared Bondでもdirected Affinityにより、Assistを受けた反応や呼びかけの温度が違ってよい。

ただし高Affinity pairが戦闘会話を独占しない。既存trio fairness policyを優先する。

## Runtime boundary

未実装:

- save schema for directed Affinity
- event ledger
- voice/subtitle variant selection
- seen-line history
- default address editorial lock
- localization grammar
- runtime speaker arbitration

Content prototypeだけでruntime readyとは扱わない。
