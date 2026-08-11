import {
  CURRENT_RELATIONSHIP_CHARACTER_IDS,
  type CurrentRelationCharacterId,
} from './currentRelationshipInventory.ts';
import { currentCharacterCombatKitEntries } from './currentCharacterCombatKitSource.ts';
import { spotlightEnemyCharacterEntries } from './spotlightEnemyCharacterSource.ts';
import { yatsukageCallNames } from './yatsukageIdentitySource.ts';

export type YatsukageRelationLane =
  | 'FEAR'
  | 'ANGER'
  | 'EMPATHY'
  | 'CURIOSITY'
  | 'PROTECTIVE_REJECTION'
  | 'IDEOLOGICAL_RIVALRY'
  | 'RESCUE_IMPULSE'
  | 'GRUDGING_RESPECT';

export type YatsukageRelationDepth = 'BASELINE_REACTION' | 'FEATURED_ARC';

export type Current21YatsukageCharacterLens = {
  characterId: CurrentRelationCharacterId;
  defaultLane: YatsukageRelationLane;
  vulnerableQuestion: string;
  moralBoundary: string;
  compassionDoor: string;
  confrontationStyle: string;
};

export type FeaturedYatsukageRelationDetail = {
  enemyId: string;
  characterId: CurrentRelationCharacterId;
  lane: YatsukageRelationLane;
  personalQuestion: string;
  firstReaction: string;
  enemyFixation: string;
  battleDynamic: string;
  lateShift: string;
  postBattleAction: string;
};

export type Current21YatsukageRelationEntry = {
  relationId: string;
  enemyId: string;
  enemyCallName: string;
  characterId: CurrentRelationCharacterId;
  characterName: string;
  depth: YatsukageRelationDepth;
  primaryLane: YatsukageRelationLane;
  personalQuestion: string;
  firstReaction: string;
  enemyFixation: string;
  battleDynamic: string;
  lateShift: string;
  postBattleAction: string;
  sympathyMayExist: true;
  sympathyErasesHarm: false;
  romanceOrFriendshipScoreCreated: false;
  enemyRecruitmentImplied: false;
  runtimeAutoPromotionAllowed: false;
};

const characterLenses: readonly Current21YatsukageCharacterLens[] = [
  { characterId: 'yui', defaultLane: 'CURIOSITY', vulnerableQuestion: '拾った意味を、自分が正しいと思った瞬間に固定していないか。', moralBoundary: '本人より先に答えを決めない。', compassionDoor: '間違った読みでも、守ろうとした理由は見る。', confrontationStyle: 'まず観察し、相手の一手だけ違う行動を見逃さない。' },
  { characterId: 'asa', defaultLane: 'ANGER', vulnerableQuestion: '急いで助けるために、本人の訂正を待てているか。', moralBoundary: '名前と意思は本人へ返す。', compassionDoor: '間違いを認めた一瞬は見逃さない。', confrontationStyle: '最初は直球。後半は一拍待ってから動く。' },
  { characterId: 'nagi', defaultLane: 'PROTECTIVE_REJECTION', vulnerableQuestion: '守るために閉じることが、いつ本人の選択を奪うのか。', moralBoundary: '安全と監禁を同じにしない。', compassionDoor: '守りたい恐怖そのものは理解できる。', confrontationStyle: '危険を受け止めながら、閉じる期限を問い続ける。' },
  { characterId: 'michiru', defaultLane: 'CURIOSITY', vulnerableQuestion: '迷わない道を求めることが、選ぶ自由を減らしていないか。', moralBoundary: '道を一本にしない。', compassionDoor: '迷わせたくない善意は分かる。', confrontationStyle: '戦いながら別routeを作って答える。' },
  { characterId: 'tomori', defaultLane: 'EMPATHY', vulnerableQuestion: '直せることと、直してよいことを混同していないか。', moralBoundary: '傷跡を勝手に新品へ戻さない。', compassionDoor: '直せない怖さに最も近い。', confrontationStyle: '壊すより修理の仕方を変えて対抗する。' },
  { characterId: 'sen', defaultLane: 'IDEOLOGICAL_RIVALRY', vulnerableQuestion: '説明することで、分からなさを奪っていないか。', moralBoundary: '仮説を答えとして教え込まない。', compassionDoor: '誤解を減らしたい願いは共有できる。', confrontationStyle: '相手のルールを言語化し、例外を一つ作る。' },
  { characterId: 'ritsu', defaultLane: 'PROTECTIVE_REJECTION', vulnerableQuestion: '守る側が全部を背負うほど、相手を弱く扱っていないか。', moralBoundary: '守る相手の選択を消さない。', compassionDoor: '抱え込みの怖さには心当たりがある。', confrontationStyle: 'まず前へ出るが、最後は誰かへ任せる。' },
  { characterId: 'koyori', defaultLane: 'RESCUE_IMPULSE', vulnerableQuestion: '小さい自分が「守られる役」だけになっていないか。', moralBoundary: '大人の善意でも、本人が嫌なら止める。', compassionDoor: '間違いを怖がる相手へ最初に声をかけられる。', confrontationStyle: '怖がりながらも相手を呼び、返事を待つ。' },
  { characterId: 'gen', defaultLane: 'GRUDGING_RESPECT', vulnerableQuestion: '昔の正しさを、今にもそのまま当てはめていないか。', moralBoundary: '古い道具や経験を唯一解にしない。', compassionDoor: '長く続いた失敗ほど簡単には笑わない。', confrontationStyle: '相手の癖を一度受け、古い経験を別の使い方へ変える。' },
  { characterId: 'hana', defaultLane: 'EMPATHY', vulnerableQuestion: '残すことが、変化を拒むことになっていないか。', moralBoundary: '保存のために本人を止めない。', compassionDoor: '残したい気持ちと手放す怖さを両方知る。', confrontationStyle: '消さず、壊さず、別の残し方を置く。' },
  { characterId: 'yubi', defaultLane: 'RESCUE_IMPULSE', vulnerableQuestion: '届けることを優先して、今は渡さない選択を無視していないか。', moralBoundary: '宛名が正しくても、渡す時は本人が決める。', compassionDoor: '届かなかったものへの執着は理解できる。', confrontationStyle: '受け取る/受け取らないの選択肢を残す。' },
  { characterId: 'madoka', defaultLane: 'CURIOSITY', vulnerableQuestion: '見えているのに、声を上げず観測だけで終わっていないか。', moralBoundary: '見た事実を本人の代わりの結論にしない。', compassionDoor: '遠くから見続ける孤独には気づける。', confrontationStyle: '異変を最初に言葉へして仲間へ渡す。' },
  { characterId: 'shiro', defaultLane: 'CURIOSITY', vulnerableQuestion: '分類しないことと、向き合わないことを混同していないか。', moralBoundary: '未分類を消去しない。', compassionDoor: '分からないまま残す怖さを受け止められる。', confrontationStyle: '答えを埋めず、観測欄そのものを増やす。' },
  { characterId: 'tobari', defaultLane: 'PROTECTIVE_REJECTION', vulnerableQuestion: '門を守ることが、帰る人まで締め出していないか。', moralBoundary: '境界は出入口であって牢ではない。', compassionDoor: '閉じる判断の責任は理解する。', confrontationStyle: '閉じた相手へ、開ける条件を具体的に示す。' },
  { characterId: 'nemu', defaultLane: 'EMPATHY', vulnerableQuestion: '夢を守るために、目覚める権利を奪っていないか。', moralBoundary: '夢を事実へすり替えない。', compassionDoor: '眠り続けたい誘惑を最も理解する。', confrontationStyle: '夢を否定せず、起きた後の選択を守る。' },
  { characterId: 'kuroori', defaultLane: 'IDEOLOGICAL_RIVALRY', vulnerableQuestion: '見せない責任が、永遠に閉じる正当化へ変わっていないか。', moralBoundary: '隠すなら、誰がいつ開けるかの責任を残す。', compassionDoor: '危険な意味を閉じたい動機は誰より理解する。', confrontationStyle: '相手の思想を否定せず、限界だけを突く。' },
  { characterId: 'kage1', defaultLane: 'PROTECTIVE_REJECTION', vulnerableQuestion: '全部受けることが、周囲の成長を止めていないか。', moralBoundary: '守るための自己犠牲を標準にしない。', compassionDoor: '壊れたものを抱え込む癖には共感する。', confrontationStyle: '正面から受け、途中で味方に任せる。' },
  { characterId: 'kage2', defaultLane: 'IDEOLOGICAL_RIVALRY', vulnerableQuestion: '隠すことが本人のためか、自分が怖いだけか。', moralBoundary: '痕跡を消して本人まで消さない。', compassionDoor: '見つからないよう守る知恵は理解する。', confrontationStyle: '相手と同じ隠し方を一度使い、違う出口を作る。' },
  { characterId: 'kage3', defaultLane: 'CURIOSITY', vulnerableQuestion: '測れないものを存在しない扱いしていないか。', moralBoundary: '数値は判断材料であって本人ではない。', compassionDoor: '曖昧さを怖がる理由は理解できる。', confrontationStyle: '測定し、測定できなかった部分も記録する。' },
  { characterId: 'kage4', defaultLane: 'EMPATHY', vulnerableQuestion: '継ぐことが、傷を消すことになっていないか。', moralBoundary: '未完成のまま渡す権利を残す。', compassionDoor: '直したい、残したい、でも直らない痛みに近い。', confrontationStyle: '壊れた箇所を隠さず、そこから別の形へ継ぐ。' },
  { characterId: 'ren', defaultLane: 'CURIOSITY', vulnerableQuestion: '差分を追うことが、今の本人を置き去りにしていないか。', moralBoundary: '記録の変化を本人の正体へしない。', compassionDoor: '変わってしまったものを怖がらず追える。', confrontationStyle: '前回との差を声にし、同じ敵にも新しい見方を残す。' },
] as const;

const featuredDetails: readonly FeaturedYatsukageRelationDetail[] = [
  { enemyId: 'boss_name_without_owner', characterId: 'yui', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '拾う人と名付ける人の境界はどこか。', firstReaction: '誤った札を敵自身が剥がした一手を見て、完全な悪意ではないと気づく。', enemyFixation: 'ナシロは「拾ったまま決めない」ユイの行為を未完成として執拗に固定しようとする。', battleDynamic: 'ユイのMARKED橋渡しとナシロのMARKED固定が同じ記号を逆向きに使う。', lateShift: 'ユイはナシロを理解しても「本人より先に決めた」責任は免除しない。', postBattleAction: '空欄の札を埋めずに持ち帰る。' },
  { enemyId: 'boss_name_without_owner', characterId: 'asa', lane: 'ANGER', personalQuestion: '名前を返す速さは、本人を待つことと両立するか。', firstReaction: '勝手な名札貼りへ即座に怒る。', enemyFixation: '訂正の速いアサへ次々別名を貼り、待てるか試す。', battleDynamic: 'アサは貼られた札を即剥がすより、本人確認の一拍を作ることで攻略する。', lateShift: '怒りは消えないが、間違いを認められない怖さは理解する。', postBattleAction: '剥がした札へ訂正線だけ残し、上貼りしない。' },
  { enemyId: 'boss_name_without_owner', characterId: 'kage2', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '名前を隠すことと、名前を固定することは本当に反対か。', firstReaction: 'カスミはナシロを嫌うが、自分も本人より先に痕跡を扱う危うさを感じる。', enemyFixation: '隠された名を「空欄」と解釈して埋めようとする。', battleDynamic: '隠す/貼るの応酬が、本人不在で情報を扱う危険を可視化する。', lateShift: 'カスミは隠す時ほど解除条件を残すようになる。', postBattleAction: '隠した札の場所を本人だけに伝える。' },
  { enemyId: 'boss_name_without_owner', characterId: 'yubi', lane: 'RESCUE_IMPULSE', personalQuestion: '宛名が分からないものを、誰へ届けるべきか。', firstReaction: '札より持ち主を探そうとする。', enemyFixation: '未配達を失敗とみなし、ユウビの保留便を勝手に分類する。', battleDynamic: '正しい宛名でも今は渡さない、という選択がcounterになる。', lateShift: '届かないまま残すことも責任だと認める。', postBattleAction: '空欄札を「保留」で預かる。' },

  { enemyId: 'boss_closed_morning_box', characterId: 'nagi', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '閉じる守りに期限を持たせられるか。', firstReaction: '攻撃より「閉じる前の一拍」に自分と同じ迷いを見る。', enemyFixation: 'ナギの月箱を正しい永続封印だと誤読し、味方扱いするような挙動を一度見せる。', battleDynamic: '同じ封じる技術を、期限付き/解除可能で使う差が攻略になる。', lateShift: 'ナギは箱を否定せず、期限のない保護だけを拒否する。', postBattleAction: '銀鍵に開封条件を記す。' },
  { enemyId: 'boss_closed_morning_box', characterId: 'kage1', lane: 'PROTECTIVE_REJECTION', personalQuestion: '全部を自分が受ければ守ったことになるのか。', firstReaction: '箱の外側へ立ち、まず全圧を受けようとする。', enemyFixation: 'カナメの抱え込みを「最も安全な箱」とみなし集中する。', battleDynamic: '途中で仲間へ受け渡さないと圧が増す仕組みが本人の癖を突く。', lateShift: '守ることを分担できるようになる。', postBattleAction: '鍵を一人で持たず共有保管する。' },
  { enemyId: 'boss_closed_morning_box', characterId: 'tobari', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '閉じた門は、いつ出口へ戻るのか。', firstReaction: '箱を門として読み、開く条件を探す。', enemyFixation: 'トバリの境界線を永続封鎖へ変えようとする。', battleDynamic: '閉鎖と開門を交互に使うことで、固定された箱圧を崩す。', lateShift: '守る境界には退出手段が必要だと再確認する。', postBattleAction: '開封期限の空欄を見て、条件欄を残す。' },
  { enemyId: 'boss_closed_morning_box', characterId: 'koyori', lane: 'RESCUE_IMPULSE', personalQuestion: '守られる側は「開けて」と言えるか。', firstReaction: '怖がりながら箱へ直接声をかける。', enemyFixation: '小さいコヨリを最優先保護対象として閉じ込めようとする。', battleDynamic: '守られる対象自身の拒否が箱のwrong readingを崩す。', lateShift: 'コヨリは「大丈夫」ではなく「自分で選ぶ」と言えるようになる。', postBattleAction: '鍵を大人へ渡さず、自分で置き場所を決める。' },

  { enemyId: 'boss_night_without_route', characterId: 'michiru', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '正しい帰路ではなく、帰れる選択肢をどう残すか。', firstReaction: '道を消す巨体へ怒るより、新しい細道を探す。', enemyFixation: 'ミチルが示す複数routeを誤差として消す。', battleDynamic: '移動し続けることでrouteを一つに固定させない。', lateShift: '迷うこと自体を失敗と見なくなる。', postBattleAction: '折れた針を方角ではなく分岐の印に使う。' },
  { enemyId: 'boss_night_without_route', characterId: 'kage3', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '測定結果が複数なら、どれを正解にするのか。', firstReaction: '消える道を測ろうとして追いつけない。', enemyFixation: 'トキの測定線を唯一routeとして固定し利用する。', battleDynamic: '測れない変動域を正式データとして残すことで攻略する。', lateShift: '不確実性を欠損値ではなく情報として扱う。', postBattleAction: '折れた針の揺れ幅まで記録する。' },
  { enemyId: 'boss_night_without_route', characterId: 'gen', lane: 'GRUDGING_RESPECT', personalQuestion: '昔の道が消えた時、経験は何を残せるか。', firstReaction: '敵が古い危険路から消す癖を見抜く。', enemyFixation: 'ゲンの古道知識を「古いから安全」と固定しようとする。', battleDynamic: '昔は正しかったが今は違うrouteを囮に使う。', lateShift: '経験は答えでなく比較材料として残る。', postBattleAction: '古地図へ現在日付を書き足す。' },
  { enemyId: 'boss_night_without_route', characterId: 'ren', lane: 'CURIOSITY', personalQuestion: '昨日と違う道を、同じ場所と呼べるか。', firstReaction: '消された線より差分を追う。', enemyFixation: 'レンが残した変更履歴から次に消すrouteを予測する。', battleDynamic: '差分記録を偽装せず、更新頻度そのものを利用する。', lateShift: '変化を追うことと、今を選ぶことを分ける。', postBattleAction: '針の向きではなく変化時刻を記録する。' },

  { enemyId: 'omburo_black_origami', characterId: 'kuroori', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '見せないことを選ぶなら、誰へ返す責任が残るか。', firstReaction: '自分の思想を模倣したような黒折へ苛立つ。', enemyFixation: 'クロオリの封じ方を「永遠に開かない正解」として強化する。', battleDynamic: '同じDARK/BLANK文脈なのに、解除条件の有無が差になる。', lateShift: 'クロオリは隠す技術より返却責任を言葉にする。', postBattleAction: '最後の黒紙を開かず、返す相手の欄だけ残す。' },
  { enemyId: 'omburo_black_origami', characterId: 'yui', lane: 'CURIOSITY', personalQuestion: '拾った黒紙を開かないことも、拾う責任に含まれるか。', firstReaction: '同じ折り目が毎回残ることを覚える。', enemyFixation: 'ユイが拾ったものを必ず開くと誤読し、罠のように紙を落とす。', battleDynamic: '開けない選択で再登場patternを一つ崩す。', lateShift: '知ることと暴くことを分けられるようになる。', postBattleAction: '一枚だけ未開封で保管する。' },
  { enemyId: 'omburo_black_origami', characterId: 'kage2', lane: 'GRUDGING_RESPECT', personalQuestion: '隠す技術は、誰のためなら許されるのか。', firstReaction: '折り方の巧さには即座に気づく。', enemyFixation: 'カスミの隠し道具を同類の折り目へ変える。', battleDynamic: '隠蔽同士の読み合いで、出口を残した側が勝つ。', lateShift: '技術への敬意と行為への拒否を同時に持つ。', postBattleAction: '折り順だけ写し、中身は記録しない。' },
  { enemyId: 'omburo_black_origami', characterId: 'yubi', lane: 'RESCUE_IMPULSE', personalQuestion: '開けない封筒を、どう届けるか。', firstReaction: '黒紙を未配達物として扱おうとする。', enemyFixation: '届け先が不明なものを全部自分の折りへ回収する。', battleDynamic: '未配達のまま持ち続けることで「隠す=消す」を崩す。', lateShift: '届けない責任も配達の一部になる。', postBattleAction: '宛名なしの黒紙を期限付きで預かる。' },

  { enemyId: 'omburo_blank_card', characterId: 'shiro', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '未分類と空白化はどこで違うのか。', firstReaction: '中央へ何も書かないこと自体を情報として見る。', enemyFixation: 'シロの未分類頁を「空白に戻す許可」と誤読する。', battleDynamic: '未分類タグを残し、消去ではない保留を示す。', lateShift: '分からないものへ関わり続ける責任を持つ。', postBattleAction: '図鑑に「未記入」を正式状態として残す。' },
  { enemyId: 'omburo_blank_card', characterId: 'kage4', lane: 'EMPATHY', personalQuestion: '埋めないことと、継がないことは同じか。', firstReaction: '空白を無理に縫おうとしない。', enemyFixation: 'ツムギの未完成部分を欠損として広げる。', battleDynamic: '未完成fieldを残したまま機能させることでcounterする。', lateShift: '空白にも継ぎ目にも、残す理由が必要だと知る。', postBattleAction: '白いカードへ糸穴だけ開け、文字は書かない。' },
  { enemyId: 'omburo_blank_card', characterId: 'hana', lane: 'EMPATHY', personalQuestion: '意味が分からない物を、保存し続けられるか。', firstReaction: '空白カードを捨てずに保管対象として見る。', enemyFixation: '意味のない保存を無価値として白紙化しようとする。', battleDynamic: '用途不明の物を残す行為そのものがcounterになる。', lateShift: '保存は説明できるものだけの権利ではないと示す。', postBattleAction: 'カードを押花台紙と同じ棚へ置く。' },
  { enemyId: 'omburo_blank_card', characterId: 'sen', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '教えないことは、空白へ逃げることか。', firstReaction: '答え欄を埋めたくなる自分の癖を突かれる。', enemyFixation: 'センの説明を「唯一の記入例」として固定する。', battleDynamic: '複数仮説を並べ、正解欄を作らないことで崩す。', lateShift: '説明には「まだ分からない」を含められる。', postBattleAction: 'カードへ答えでなく質問だけ残す。' },

  { enemyId: 'omburo_repair_seam', characterId: 'tomori', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '直せる自分を証明するために修理していないか。', firstReaction: '敵が壊れた物へ先に向く癖に、自分の焦りを見る。', enemyFixation: 'トモリの修理跡を不完全として上から縫い直す。', battleDynamic: '新品化ではなく機能回復だけを選ぶことがcounterになる。', lateShift: '直らなかった記録を失敗として隠さなくなる。', postBattleAction: '結び目を切らず、そのまま記録する。' },
  { enemyId: 'omburo_repair_seam', characterId: 'kage4', lane: 'GRUDGING_RESPECT', personalQuestion: '継ぐ技術に、持ち主の意思をどう織り込むか。', firstReaction: '縫い目の技術は評価するが勝手な修理を拒む。', enemyFixation: 'ツムギの継ぎ目を「隠すべき傷」として縫い潰す。', battleDynamic: '見える継ぎ目を残すほど敵の圧が弱まる。', lateShift: '上手に直すより、誰と直すかを重視する。', postBattleAction: '敵の糸を一本だけ素材として残す。' },
  { enemyId: 'omburo_repair_seam', characterId: 'hana', lane: 'EMPATHY', personalQuestion: '保存と修理は、どこまで同じ行為か。', firstReaction: '直せない物を捨てない点には共感する。', enemyFixation: '古い台紙や傷んだ花を勝手に新品状態へ戻そうとする。', battleDynamic: '経年そのものを価値として守る。', lateShift: '敵の善意を理解しても所有者不在の修理は拒否する。', postBattleAction: '修理前後を両方保存する。' },
  { enemyId: 'omburo_repair_seam', characterId: 'gen', lane: 'GRUDGING_RESPECT', personalQuestion: '古い物は、直すべきか使い切るべきか。', firstReaction: '敵の作業癖を職人気質として観察する。', enemyFixation: 'ゲンの古道具を故障品として一律修理する。', battleDynamic: '壊れたまま役立つ道具を使って想定を外す。', lateShift: '直さない判断も手入れの一種だと示す。', postBattleAction: '敵の糸を補修ではなく目印に使う。' },

  { enemyId: 'omburo_dream_wave', characterId: 'nemu', lane: 'IDEOLOGICAL_RIVALRY', personalQuestion: '夢を大切にしながら、どう起きるか。', firstReaction: '心地よさに最も強く引かれる。', enemyFixation: 'ネムのDREAMを同意と誤読し、眠りを深くする。', battleDynamic: '夢を消さず、目覚め条件を自分で選ぶことでcounterする。', lateShift: '夢は逃避だけでなく記録にもなるが、現実の代わりにはしない。', postBattleAction: '夢頁へ「事実ではない」を追記して残す。' },
  { enemyId: 'omburo_dream_wave', characterId: 'madoka', lane: 'RESCUE_IMPULSE', personalQuestion: '眠っている人を、いつ起こすべきか。', firstReaction: '本人が苦しんでいないように見えて判断を迷う。', enemyFixation: '観測だけ続けるマドカを安全な傍観者として夢の外へ置く。', battleDynamic: '見えている危険を声にすることが攻略の起点になる。', lateShift: '優しい景色でも危険なら伝える。', postBattleAction: '起こした理由を本人へ説明する。' },
  { enemyId: 'omburo_dream_wave', characterId: 'kage3', lane: 'CURIOSITY', personalQuestion: '夢の中の経験を、測定不能として捨ててよいか。', firstReaction: '測れないtempo変化へ苛立つ。', enemyFixation: 'トキが測れた波だけを強調し、夢全体を単純化させる。', battleDynamic: '測定不能区間も正式に記録することでpatternが見える。', lateShift: '数値化できない経験も比較対象へ入れる。', postBattleAction: '波形に空白区間を残す。' },
  { enemyId: 'omburo_dream_wave', characterId: 'nagi', lane: 'PROTECTIVE_REJECTION', personalQuestion: '眠らせて守ることは、閉じ込めることと何が違うか。', firstReaction: '安全圏に見える夢へ一瞬だけ安心する。', enemyFixation: 'ナギの保護範囲を眠りの檻へ変える。', battleDynamic: '本人が退出できる安全圏だけを維持する。', lateShift: '穏やかさだけでは安全を判定しない。', postBattleAction: '眠る/起きる合図を仲間と決める。' },

  { enemyId: 'omburo_nameplate', characterId: 'asa', lane: 'ANGER', personalQuestion: '間違いを訂正する時、前の間違いを消すべきか。', firstReaction: 'ペタの上貼り癖に本気で腹を立てる。', enemyFixation: 'アサが訂正するほどさらに札を貼り、意地の張り合いになる。', battleDynamic: '剥がすより訂正線を残すと隙が生まれる。', lateShift: 'アサは速く訂正しつつ、前の自分の間違いも隠さない。', postBattleAction: '残った札に大きな訂正線を引く。' },
  { enemyId: 'omburo_nameplate', characterId: 'yui', lane: 'CURIOSITY', personalQuestion: '何度間違えても、呼び直せる関係をどう残すか。', firstReaction: 'ペタの札が毎回違う位置へ増えるのを観察する。', enemyFixation: 'ユイが札を拾うたび「採用された」と誤解する。', battleDynamic: '拾うが使わない、という行動が敵の期待を外す。', lateShift: '名前を間違えないことより呼び直せることを重視する。', postBattleAction: '札を捨てず失敗例として束ねる。' },
  { enemyId: 'omburo_nameplate', characterId: 'kage2', lane: 'GRUDGING_RESPECT', personalQuestion: '間違いを隠すための上貼りと、守るための隠蔽はどこで分かれるか。', firstReaction: '小細工の巧さには少し感心する。', enemyFixation: 'カスミの隠し札の上へさらに偽札を貼る。', battleDynamic: '嘘を増やすより、見せない一枚を選ぶことで差を作る。', lateShift: 'カスミは隠す理由を自分で説明する必要を感じる。', postBattleAction: '偽札を剥がさず「偽」とだけ書く。' },
  { enemyId: 'omburo_nameplate', characterId: 'koyori', lane: 'RESCUE_IMPULSE', personalQuestion: '大人が間違った時、子どもから訂正してよいか。', firstReaction: '怖がらず「ちがうよ」と言う。', enemyFixation: 'コヨリの小さな名札を最も貼り替えやすい対象とみなす。', battleDynamic: '本人の訂正を優先するルールがペタのMARKEDを崩す。', lateShift: 'コヨリは守られるだけでなく大人の間違いを直す役になる。', postBattleAction: 'ペタの札へ自分で×印を付ける。' },
] as const;

const kitByCharacter = new Map(currentCharacterCombatKitEntries.map((entry) => [entry.characterId, entry]));
const lensByCharacter = new Map(characterLenses.map((entry) => [entry.characterId, entry]));
const callNameByEnemy = new Map(yatsukageCallNames.map((entry) => [entry.enemyId, entry]));
const spotlightByEnemy = new Map(spotlightEnemyCharacterEntries.map((entry) => [entry.enemyId, entry]));
const featuredByKey = new Map(featuredDetails.map((entry) => [`${entry.enemyId}:${entry.characterId}`, entry]));

export const current21YatsukageRelationshipEntries: readonly Current21YatsukageRelationEntry[] =
  spotlightEnemyCharacterEntries.flatMap((enemy) =>
    CURRENT_RELATIONSHIP_CHARACTER_IDS.map((characterId) => {
      const kit = kitByCharacter.get(characterId);
      const lens = lensByCharacter.get(characterId);
      const callName = callNameByEnemy.get(enemy.enemyId);
      if (!kit || !lens || !callName) throw new Error(`missing Current21 x 八影 relation dependency: ${enemy.enemyId}/${characterId}`);

      const featured = featuredByKey.get(`${enemy.enemyId}:${characterId}`);
      const isDeclaredMirror = enemy.mirrorCharacterIds.includes(characterId);
      if (Boolean(featured) !== isDeclaredMirror) {
        throw new Error(`featured 八影 relation must match Spotlight mirror declaration: ${enemy.enemyId}/${characterId}`);
      }

      if (featured) {
        return {
          relationId: `${enemy.enemyId}::${characterId}`,
          enemyId: enemy.enemyId,
          enemyCallName: callName.callName,
          characterId,
          characterName: kit.characterName,
          depth: 'FEATURED_ARC',
          primaryLane: featured.lane,
          personalQuestion: featured.personalQuestion,
          firstReaction: featured.firstReaction,
          enemyFixation: featured.enemyFixation,
          battleDynamic: featured.battleDynamic,
          lateShift: featured.lateShift,
          postBattleAction: featured.postBattleAction,
          sympathyMayExist: true,
          sympathyErasesHarm: false,
          romanceOrFriendshipScoreCreated: false,
          enemyRecruitmentImplied: false,
          runtimeAutoPromotionAllowed: false,
        } as const;
      }

      return {
        relationId: `${enemy.enemyId}::${characterId}`,
        enemyId: enemy.enemyId,
        enemyCallName: callName.callName,
        characterId,
        characterName: kit.characterName,
        depth: 'BASELINE_REACTION',
        primaryLane: lens.defaultLane,
        personalQuestion: lens.vulnerableQuestion,
        firstReaction: `${kit.characterName}は${callName.callName}の行為を、自分の「${lens.moralBoundary}」という境界から読む。`,
        enemyFixation: `${callName.callName}は${kit.characterName}の得意な守り方/読み方を、自分の「${enemy.currentWant}」へ都合よく固定しようとする。`,
        battleDynamic: `${lens.confrontationStyle} ${callName.callName}の矛盾「${enemy.contradiction}」を戦闘中の読みへ返す。`,
        lateShift: `${lens.compassionDoor} ただし被害の責任と同情は分ける。`,
        postBattleAction: `${kit.characterName}は勝利後、相手を理解した証拠より、自分の境界「${lens.moralBoundary}」を一つ行動で残す。`,
        sympathyMayExist: true,
        sympathyErasesHarm: false,
        romanceOrFriendshipScoreCreated: false,
        enemyRecruitmentImplied: false,
        runtimeAutoPromotionAllowed: false,
      } as const;
    }),
  );

export type YatsukagePartyEncounterPlan = {
  enemyId: string;
  enemyCallName: string;
  party: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId, CurrentRelationCharacterId];
  relations: readonly Current21YatsukageRelationEntry[];
  featuredArcCharacterIds: readonly CurrentRelationCharacterId[];
  dialogueRule: 'THREE_PERSON_FAIRNESS';
  openingPriority: 'FEATURED_ARC_THEN_EVENT_RELEVANCE';
  tacticalReplyMustUseDifferentCharacterWhenPossible: true;
  afterimageMayUseThirdCharacter: true;
  groupEnemyAffinityStored: false;
  partyBondCreated: false;
  runtimeAutoPromotionAllowed: false;
};

export function buildYatsukagePartyEncounterPlan(
  enemyId: string,
  party: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId, CurrentRelationCharacterId],
): YatsukagePartyEncounterPlan {
  if (new Set(party).size !== 3) throw new Error('Yatsukage battle party must contain three distinct Current21 characters');
  const callName = callNameByEnemy.get(enemyId);
  if (!callName || !spotlightByEnemy.has(enemyId)) throw new Error(`unknown 八影 enemy: ${enemyId}`);

  const relations = party.map((characterId) => {
    const relation = current21YatsukageRelationshipEntries.find(
      (entry) => entry.enemyId === enemyId && entry.characterId === characterId,
    );
    if (!relation) throw new Error(`missing 八影 party relation: ${enemyId}/${characterId}`);
    return relation;
  });

  return {
    enemyId,
    enemyCallName: callName.callName,
    party,
    relations,
    featuredArcCharacterIds: relations.filter((entry) => entry.depth === 'FEATURED_ARC').map((entry) => entry.characterId),
    dialogueRule: 'THREE_PERSON_FAIRNESS',
    openingPriority: 'FEATURED_ARC_THEN_EVENT_RELEVANCE',
    tacticalReplyMustUseDifferentCharacterWhenPossible: true,
    afterimageMayUseThirdCharacter: true,
    groupEnemyAffinityStored: false,
    partyBondCreated: false,
    runtimeAutoPromotionAllowed: false,
  };
}

export const current21YatsukageRelationshipSummary = {
  currentCharacterCount: CURRENT_RELATIONSHIP_CHARACTER_IDS.length,
  yatsukageCount: spotlightEnemyCharacterEntries.length,
  relationCount: current21YatsukageRelationshipEntries.length,
  featuredArcCount: current21YatsukageRelationshipEntries.filter((entry) => entry.depth === 'FEATURED_ARC').length,
  baselineReactionCount: current21YatsukageRelationshipEntries.filter((entry) => entry.depth === 'BASELINE_REACTION').length,
  charactersCovered: new Set(current21YatsukageRelationshipEntries.map((entry) => entry.characterId)).size,
  enemiesCovered: new Set(current21YatsukageRelationshipEntries.map((entry) => entry.enemyId)).size,
  friendshipScoreCreated: false,
  enemyRecruitmentImplied: false,
  sympathyErasesHarm: false,
  runtimeAutoPromotionAllowed: false,
} as const;
