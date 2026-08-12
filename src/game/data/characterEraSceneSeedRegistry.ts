import { CHARACTER_ERA_FINGERPRINTS } from './characterEraFingerprintRegistry.ts';

export const ERA_SCENE_SEED_RULES = {
  authority: 'docs/character-era-scene-seeds-v1.md',
  status: 'AUTHOR_CANDIDATE_NON_CANON',
  characterCountRequired: 36,
  exactYearAllowed: false,
  exactAgeAllowed: false,
  oneSceneMayProveEra: false,
  sceneMayAutoCanonizeRelationship: false,
  sceneMayAssignStarBeast: false,
  sceneMayAssignObsoleteConstellation: false,
  future15MeansFutureEra: false,
  oldMeansIgnorant: false,
  futureMeansSuperior: false,
  runtimeAutoPromotionAllowed: false,
} as const;

export type EraSceneSeed = Readonly<{
  id: string;
  ordinaryMismatch: string;
  plausibleMisread: string;
  materialOrRecordEvidence: string;
  reinterpretation: string;
  dialogueA: string;
  dialogueB: string;
  objectOrTrace: string;
  forbiddenShortcut: string;
}>;

export const CHARACTER_ERA_SCENE_SEEDS: readonly EraSceneSeed[] = [
  { id:'tomori', ordinaryMismatch:'包装紙を捨てず、破れ方まで見て畳み直す。', plausibleMisread:'単なる几帳面さ、または貧乏性に見える。', materialOrRecordEvidence:'後代のランタンに、彼が序盤で見せたのと同じ癖のある補修痕が残る。', reinterpretation:'「まだ使える」が節約の台詞ではなく、物が時代を越える作品テーマへ反転する。', dialogueA:'「それ、捨てるのか？」', dialogueB:'「破れたのは端だけだ。役目まで終わったわけじゃない」', objectOrTrace:'ランタンの補修線／古い星図の綴じ直し', forbiddenShortcut:'戦災・孤児・家族死亡・現代と異なる公式88星座を推定しない。' },
  { id:'michiru', ordinaryMismatch:'地図の最短経路より、水路・風・古い曲がり角を先に見る。', plausibleMisread:'方向音痴の逆、単なる勘の良さに見える。', materialOrRecordEvidence:'現行地図から消えた旧道が、古写真や地割にだけ残る。', reinterpretation:'「帰れる道」は感傷ではなく、消された地理の記憶だったと分かる。', dialogueA:'「近い方でいい？」', dialogueB:'「近い道と、帰れる道は同じじゃないよ」', objectOrTrace:'消えた道標／旧道の石縁', forbiddenShortcut:'反技術・懐古主義にしない。' },
  { id:'nagi', ordinaryMismatch:'他人の端末や記録を、開ける状態でも必ず許可を取る。', plausibleMisread:'臆病・潔癖な性格に見える。', materialOrRecordEvidence:'古い転送履歴や識別子が、本人の想定以上に複製されていた痕跡を持つ。', reinterpretation:'「見られる」と「見せた」の区別が、後のidentity問題へ繋がる。', dialogueA:'「これ、見てもいい？」', dialogueB:'「開くのと、見せてもらうのは別だから」', objectOrTrace:'古いメール転送ヘッダ／端末識別子', forbiddenShortcut:'現代のdeepfake・高度アルゴリズム知識を自動付与しない。' },
  { id:'yui', ordinaryMismatch:'分からないことを即検索するが、検索結果が多すぎると逆に止まる。', plausibleMisread:'現代っ子らしい依存に見える。', materialOrRecordEvidence:'デジタル記録では綺麗な物に、物理的には古い補修痕がある。', reinterpretation:'「残っている＝分かる」ではないことを身体で知る。', dialogueA:'「検索したら出るかな」', dialogueB:'「出た。……でも、これで本当に分かったことになる？」', objectOrTrace:'検索履歴と矛盾する実物の傷', forbiddenShortcut:'検索能力を正解率や知性と同一視しない。' },
  { id:'asa', ordinaryMismatch:'名札より先に「呼ばれたい名前」を聞く。', plausibleMisread:'気遣いの強い人に見える。', materialOrRecordEvidence:'後のidentity recordで、登録名・身体・分岐個体・選択名が別項目だと判明する。', reinterpretation:'序盤の礼儀が未来社会の普通だったと気づく。', dialogueA:'「登録名で呼ぶ？」', dialogueB:'「ううん。呼ばれたい方を教えて」', objectOrTrace:'複数identity fieldを持つ登録票', forbiddenShortcut:'アサをAndroid化・未来知識の万能説明役にしない。' },
  { id:'gen', ordinaryMismatch:'距離を駅名より坂・橋・角の順で説明する。', plausibleMisread:'地元に詳しい年長者に見える。', materialOrRecordEvidence:'現在消えた曲がり角の呼称が後の古記録に一致する。', reinterpretation:'「道は消えても曲がり方は残る」が群青残響録的な残響へ変わる。', dialogueA:'「何分くらい？」', dialogueB:'「時間より、二つ目の坂を覚えとけ」', objectOrTrace:'消えた橋名／曲がり角の俗称', forbiddenShortcut:'トモリと同年代・軍歴・保守思想を確定しない。' },
  { id:'hana', ordinaryMismatch:'空き瓶や箱を「何を入れるか」で見て、元の用途で呼ばない。', plausibleMisread:'生活上手・片付け好きに見える。', materialOrRecordEvidence:'二重ラベルの下から古い商品名・保存日記が出る。', reinterpretation:'容器そのものが複数の時代を生きた証拠になる。', dialogueA:'「それ、空いたよ」', dialogueB:'「空いたんじゃないの。次が決まってないだけ」', objectOrTrace:'重ね貼りラベルの保存瓶', forbiddenShortcut:'家事能力から性別役割・階級・職業を決めない。' },
  { id:'sen', ordinaryMismatch:'教科書や規則を引用した直後に「理由は別」と区切る。', plausibleMisread:'教師肌・理屈っぽさに見える。', materialOrRecordEvidence:'古い教材の分類と後世Archiveの分類が食い違う。', reinterpretation:'正本と現実が同じ速度で更新されないことの伏線になる。', dialogueA:'「本にはこう書いてあります」', dialogueB:'「ただし、本にあることと、決着したことは別です」', objectOrTrace:'改訂前教科書／書き込み', forbiddenShortcut:'職業や年齢を台詞だけで固定しない。' },
  { id:'ritsu', ordinaryMismatch:'連絡が取れない相手の分まで予定を背負おうとする。', plausibleMisread:'過保護・支配的に見える。', materialOrRecordEvidence:'届かなかった／伏せられた連絡が、悪意ではなく家庭内負担の偏りを示す。', reinterpretation:'「連絡がつく」と「頼っていい」が別という台詞が関係伏線になる。', dialogueA:'「返事がない。俺が行く」', dialogueB:'「……連絡がつくのと、頼っていいのは別か」', objectOrTrace:'未送信メモ／着信履歴', forbiddenShortcut:'親代わり・家族構成を自動確定しない。' },
  { id:'koyori', ordinaryMismatch:'正式名より、家で呼ばれていた呼び名を先に覚えている。', plausibleMisread:'子どもの曖昧な記憶に見える。', materialOrRecordEvidence:'公式記録にない呼び名が私物の裏書きだけに残る。', reinterpretation:'書いてない名前も人間関係の史料になる。', dialogueA:'「その名前、紙にないよ」', dialogueB:'「でも、みんなそう呼んでたよ？」', objectOrTrace:'私物の裏書き／呼び名', forbiddenShortcut:'子ども視点を魔法の真実判定にしない。' },
  { id:'yuubi', ordinaryMismatch:'「届いた」より「誰が受け取れたか」を気にする。', plausibleMisread:'細かい性格に見える。', materialOrRecordEvidence:'転送印や宛名修正が、移動時期をデータベースより早く示す。', reinterpretation:'配送痕が人物の移動史になる。', dialogueA:'「届いてるならいいだろ」', dialogueB:'「届いた先に、その人がいたかは別だ」', objectOrTrace:'転送印／消された住所', forbiddenShortcut:'紙媒体をデジタルより本質的に真実としない。' },
  { id:'kaname', ordinaryMismatch:'誰かの荷物を無言で持つが、途中で一度本人に返す。', plausibleMisread:'力自慢か世話焼きに見える。', materialOrRecordEvidence:'古い勤務・連絡習慣から「持てる人に負担が集中する」背景が見える。', reinterpretation:'善意にも同意が必要という境界へ繋がる。', dialogueA:'「持つよ」', dialogueB:'「……いや、持てるのと、持っていいのは別だな」', objectOrTrace:'肩紐の補修跡／持ち回り表', forbiddenShortcut:'体格から知性・職業・階級を推定しない。' },
  { id:'tsumugi', ordinaryMismatch:'修理を頼まれると、直す前に「どの傷を残すか」を聞く。', plausibleMisread:'職人気質に見える。', materialOrRecordEvidence:'縫い目の違いから、同じ物が別人の手を経たと分かる。', reinterpretation:'綺麗にすることが記憶を消す場合があると示す。', dialogueA:'「全部、綺麗に直して」', dialogueB:'「全部消したら、前に直した人まで消えるよ」', objectOrTrace:'異なる年代の縫い目', forbiddenShortcut:'手仕事を工業製品より道徳的に上位としない。' },
  { id:'madoka', ordinaryMismatch:'写真を見る時、写っている中心より端を拡大する。', plausibleMisread:'変わった観察癖に見える。', materialOrRecordEvidence:'有名な写真の外側に、別の人物や掲示の一部が残る。', reinterpretation:'「見た」と「知った」を分ける姿勢が事件伏線になる。', dialogueA:'「そこ、主役じゃないよ」', dialogueB:'「だから見るの。みんな主役しか覚えてないから」', objectOrTrace:'写真の端／反射像', forbiddenShortcut:'観察力を全知としない。' },
  { id:'shiro', ordinaryMismatch:'分類できない紙を捨てず「未分類」のまま保存する。', plausibleMisread:'収集癖に見える。', materialOrRecordEvidence:'しぶんぎ座流星群の名から古星図のQuadrans Muralisへ辿る。', reinterpretation:'「名前だけ残る」が星座史と群青残響録を結ぶCandidateになる。', dialogueA:'「分類できない」', dialogueB:'「じゃあ、捨てない。分からないまま残す」', objectOrTrace:'Quadrans Muralisを含む古星図', forbiddenShortcut:'古星座の所有者・星獣・運命へ直結しない。' },
  { id:'tobari', ordinaryMismatch:'駅の扉が閉じていても「道がない」とは言わない。', plausibleMisread:'都会慣れに見える。', materialOrRecordEvidence:'サービス停止記録と物理的通路の存続が別資料で確認できる。', reinterpretation:'閉鎖と消失の違いが人物・記憶のテーマに響く。', dialogueA:'「行けないね」', dialogueB:'「今は通れないだけ。道が消えたわけじゃない」', objectOrTrace:'閉鎖案内／古い通路図', forbiddenShortcut:'都市交通の万能知識にしない。' },
  { id:'nemu', ordinaryMismatch:'休憩中の返信を「休んだこと」に数えない。', plausibleMisread:'だらしなさへの反発に見える。', materialOrRecordEvidence:'通知履歴から、休息時間まで断続的に拘束されていたことが分かる。', reinterpretation:'眠り／休息を自己責任でなく境界問題として描ける。', dialogueA:'「寝てたなら休めたでしょ」', dialogueB:'「返事してた時間は、休んだ時間に入れなくていいよ」', objectOrTrace:'夜間通知履歴', forbiddenShortcut:'睡眠障害など医療設定を勝手に付けない。' },
  { id:'kuroori', ordinaryMismatch:'記録の空欄を見ても、すぐ「隠した」と言わない。', plausibleMisread:'秘密主義の擁護に見える。', materialOrRecordEvidence:'後で空欄が第三者保護のための意図的redactionだったと判明する。', reinterpretation:'書かないことも残し方だという倫理がMain Mysteryに使える。', dialogueA:'「ここ、消してある」', dialogueB:'「消したのか、残さなかったのか。まずそこから」', objectOrTrace:'墨消し／欠番', forbiddenShortcut:'プライバシー志向を罪・敵性と結びつけない。' },
  { id:'kasumi', ordinaryMismatch:'検索されやすい名前を場面ごとに使い分ける。', plausibleMisread:'正体を偽っているように見える。', materialOrRecordEvidence:'古い私物にだけ別のcall-nameが残り、犯罪性とは無関係と分かる。', reinterpretation:'名前の選択権と記録上の名前を分ける伏線になる。', dialogueA:'「本名じゃないの？」', dialogueB:'「本名って、一個じゃなきゃだめ？」', objectOrTrace:'古い呼び名入り私物', forbiddenShortcut:'犯罪・性別・裏切りを推定しない。' },
  { id:'toki', ordinaryMismatch:'正確な時刻を記録するが、出来事の順番は別にメモする。', plausibleMisread:'時間に神経質に見える。', materialOrRecordEvidence:'同一時刻のログでも、実際の因果順が違うことが後で分かる。', reinterpretation:'timestamp=truthではないと示せる。', dialogueA:'「時刻は合ってる」', dialogueB:'「だから順番まで合ってるとは言ってない」', objectOrTrace:'同時刻ログ／手書き順序メモ', forbiddenShortcut:'計測好き＝冷淡としない。' },
  { id:'ren', ordinaryMismatch:'二つの資料の同じ誤字を先に探す。', plausibleMisread:'揚げ足取りに見える。', materialOrRecordEvidence:'同じ誤字が「独立した複数証言」が共通source由来だと示す。', reinterpretation:'情報量が多くても独立性がないという伏線になる。', dialogueA:'「二件一致してる」', dialogueB:'「同じ間違いも一致してる。二件じゃないかも」', objectOrTrace:'共通誤字／版違い', forbiddenShortcut:'差分検出を確信・正解と同一視しない。' },
  { id:'hiyori', ordinaryMismatch:'集団会話のあと「誰が黙ってたか」を覚えている。', plausibleMisread:'気にしすぎに見える。', materialOrRecordEvidence:'議事録に発言者だけ残り、沈黙した人の存在が別写真で補われる。', reinterpretation:'記録に残らない反応も歴史の一部になる。', dialogueA:'「みんな賛成だったよね」', dialogueB:'「うん。でも、返事しなかった人もいたよ」', objectOrTrace:'議事録と集合写真', forbiddenShortcut:'Future15を未来起源としない。' },
  { id:'serika', ordinaryMismatch:'フォームの選択肢に当てはまらない人を見ると入力を止める。', plausibleMisread:'融通が利かないように見える。', materialOrRecordEvidence:'後に分類外の事例が古い記録から複数見つかる。', reinterpretation:'欄がない＝存在しない、ではないことが制度テーマになる。', dialogueA:'「どれを選べばいい？」', dialogueB:'「選ぶ前に、欄が足りない可能性を見たい」', objectOrTrace:'分類欄のない申請票', forbiddenShortcut:'組織力から地位・富・職業を決めない。' },
  { id:'chloe', ordinaryMismatch:'遠く離れた複数時代の習慣を自然に知るが、由来を語らない。', plausibleMisread:'博識・研究家に見える。', materialOrRecordEvidence:'別々の年代資料で、同じ癖・表現に似た痕跡が見つかるが本人同一性は確定しない。', reinterpretation:'複数Eraを跨ぐ特殊枠をMysteryとして保持できる。', dialogueA:'「それ、昔もこうしたよ」', dialogueB:'「どの昔かは、今は聞かないで」', objectOrTrace:'年代の離れた類似署名／癖', forbiddenShortcut:'不老不死・出生年・正体を確定しない。' },
  { id:'touma', ordinaryMismatch:'移動前に共有位置より集合条件を口頭で揃える。', plausibleMisread:'段取り好きに見える。', materialOrRecordEvidence:'位置共有が失敗した場面でも、事前の条件だけが全員を再集合させる。', reinterpretation:'技術の有無ではなく共有ルールの強さが残る。', dialogueA:'「位置送っとく」', dialogueB:'「それが見えなかった時の場所も決めよう」', objectOrTrace:'集合条件のメモ', forbiddenShortcut:'現代人物をテクノロジー依存として単純化しない。' },
  { id:'kuu', ordinaryMismatch:'検索候補より自分の感覚語で場所や物を説明する。', plausibleMisread:'語彙が曖昧に見える。', materialOrRecordEvidence:'後でその感覚語が特定の地域／家庭内表現と対応するが出身地は確定しない。', reinterpretation:'言葉は座標ではなく関係の痕跡になる。', dialogueA:'「正式名は？」', dialogueB:'「知らない。でも、うちではそう呼んでた」', objectOrTrace:'私的呼称メモ', forbiddenShortcut:'方言や語彙から知性・階級・出生地を断定しない。' },
  { id:'yomo', ordinaryMismatch:'猫や動物の比喩を使われても、自分のidentity説明には流用しない。', plausibleMisread:'動物モチーフのキャラに見える。', materialOrRecordEvidence:'Felisなどobsolete constellation資料が出ても本人との所有関係はない。', reinterpretation:'似ているモチーフとAuthority assignmentを分離する教育的伏線になる。', dialogueA:'「猫の星座、似合いそう」', dialogueB:'「似合うと、私のになるは別でしょ」', objectOrTrace:'Felis掲載古星図', forbiddenShortcut:'Felis・猫星座・星獣を自動割当しない。' },
  { id:'maki', ordinaryMismatch:'値段より「何回使えるか」を先に聞く。', plausibleMisread:'節約家に見える。', materialOrRecordEvidence:'サブスクや一時利用の総額が、表示価格と大きく違う場面が出る。', reinterpretation:'金額より所有／利用の時間感覚の差として描ける。', dialogueA:'「安いよ」', dialogueB:'「安いのは一回？　最後まで？」', objectOrTrace:'利用明細／更新履歴', forbiddenShortcut:'経済状況・階級を決めない。' },
  { id:'suzu', ordinaryMismatch:'通知音や機械音を人より先に聞き分けるが、意味は確認する。', plausibleMisread:'機械に強い人に見える。', materialOrRecordEvidence:'似た音でも別機器・別時代の規格で意味が違うと分かる。', reinterpretation:'感知能力と意味理解は別というCharacter Mysteryに使える。', dialogueA:'「今の、警告音」', dialogueB:'「音は分かる。何の警告かはまだ分からない」', objectOrTrace:'異なる機器の通知音記録', forbiddenShortcut:'聴覚特性から超能力・職業を付与しない。' },
  { id:'io', ordinaryMismatch:'同じデータを見ても「誰が後から直せるか」を気にする。', plausibleMisread:'管理癖に見える。', materialOrRecordEvidence:'改変履歴から、記録の内容より編集権限が事件の鍵になる。', reinterpretation:'情報の正しさだけでなくAuthorityの所在へ伏線を張れる。', dialogueA:'「内容は合ってるよ」', dialogueB:'「今はね。誰が直せる？」', objectOrTrace:'編集権限ログ', forbiddenShortcut:'権限意識を支配欲・敵性にしない。' },
  { id:'kai', ordinaryMismatch:'ナオと同じ物を選ぶと「区別できなくなる」と周囲に言われて少し苛立つ。', plausibleMisread:'双子らしい競争心に見える。', materialOrRecordEvidence:'同じEra・同じ家庭でも、別々の選択記録が残る。', reinterpretation:'違う選択をし続けることまでidentity義務ではないと示す。', dialogueA:'「また同じ？」', dialogueB:'「同じのが好きな日まで、別人の証明しなくていいだろ」', objectOrTrace:'同じ購入品＋別々の書き込み', forbiddenShortcut:'双子をコピー問題だけに還元しない。' },
  { id:'nao', ordinaryMismatch:'カイと違うものを選んだ時より、同じものを選べた時に安心することがある。', plausibleMisread:'依存に見える。', materialOrRecordEvidence:'同じ環境から異なる記憶・反応が蓄積した私物が見つかる。', reinterpretation:'同一性は差分の量で測れないという伏線になる。', dialogueA:'「今日は別のにする？」', dialogueB:'「今日は同じがいい。違う日は、勝手に来るから」', objectOrTrace:'同型の私物に異なる使用痕', forbiddenShortcut:'カイと別Era・別出生設定にしない。' },
  { id:'amane', ordinaryMismatch:'言葉を記録するとき、発言内容と「誰に向けたか」を分けて残す。', plausibleMisread:'会話分析が好きに見える。', materialOrRecordEvidence:'同じ文言が別相手には逆の意味だったことが後で分かる。', reinterpretation:'引用だけでは関係性を保存できないことを示す。', dialogueA:'「同じこと言ってたよ」', dialogueB:'「誰に言ったかが違う。同じ言葉じゃないよ」', objectOrTrace:'宛先付き会話メモ', forbiddenShortcut:'恋愛・嫌悪を色や一台詞で確定しない。' },
  { id:'noa', ordinaryMismatch:'複製された記憶を見ても「同じ人」と即答しない。', plausibleMisread:'未来技術に慎重な人に見える。', materialOrRecordEvidence:'同一snapshotから分岐した後の選択履歴が別々に残る。', reinterpretation:'共有記憶と現在のpersonhoodを分ける核心会話へ繋がる。', dialogueA:'「同じ記憶なら、同じ人？」', dialogueB:'「そこまでは同じ。そこから先は、もう二つある」', objectOrTrace:'同一snapshot＋分岐履歴', forbiddenShortcut:'記憶コピー＝同一人物／魂なしと断定しない。' },
  { id:'rum', ordinaryMismatch:'共有データについて「これは私の返事」と所有範囲を限定する。', plausibleMisread:'細かい言葉遣いに見える。', materialOrRecordEvidence:'共通知識層と個体ごとの意思決定ログが分離されている。', reinterpretation:'データの共有と主体の共有を分ける感情的な伏線になる。', dialogueA:'「それ、みんな知ってるんでしょ？」', dialogueB:'「知識はね。でも、この返事をしたのは私」', objectOrTrace:'共通知識DB＋個体decision log', forbiddenShortcut:'ロボットを人間性獲得の一本道にしない。' },
  { id:'renji', ordinaryMismatch:'新しい道具を見ても、説明書よりまず「壊れた時どう戻すか」を確認する。', plausibleMisread:'心配性に見える。', materialOrRecordEvidence:'後に復旧手順だけが古い方式との接続点を残している。', reinterpretation:'前進する技術にも過去へ戻る道が埋め込まれていると分かる。', dialogueA:'「まず使ってみようよ」', dialogueB:'「使う。戻し方を見てから」', objectOrTrace:'復旧手順／旧規格互換部', forbiddenShortcut:'年代を技術レベル一項目だけで確定しない。' },
];

const fingerprintIds = new Set(CHARACTER_ERA_FINGERPRINTS.map((entry) => entry.id));
export const ERA_SCENE_SEED_COVERAGE = CHARACTER_ERA_SCENE_SEEDS.map((entry) => ({
  id: entry.id,
  hasFingerprint: fingerprintIds.has(entry.id),
}));
