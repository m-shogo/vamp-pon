import {
  currentRelationshipInventoryById,
  type CurrentRelationCharacterId,
} from './currentRelationshipInventory.ts';
import {
  admitPairwiseRelationshipLedgerEvent,
  type AuthoredAffinityDirection,
  type PairwiseRelationshipLedgerAdmission,
  type PairwiseRelationshipLedgerEvent,
} from './pairwiseRelationshipEventLedgerSource.ts';

export type FeaturedAffinityBeatKind = 'FRICTION' | 'RECOGNITION' | 'CHOSEN_TRUST';
export type FeaturedAffinityPlacementBand = 'EARLY_FLEX' | 'MID_FLEX' | 'LATE_FLEX';

export type FeaturedRelationshipAffinityBeat = {
  beatId: string;
  relationId: string;
  kind: FeaturedAffinityBeatKind;
  placementBand: FeaturedAffinityPlacementBand;
  storyMeaning: string;
  gameplayEcho: string;
  event: PairwiseRelationshipLedgerEvent;
  admission: PairwiseRelationshipLedgerAdmission;
  exactIncidentFrozen: false;
  exactStageFrozen: false;
  numericDeltaFrozen: false;
  romanceInferred: false;
  runtimeAutoPromotionAllowed: false;
};

export type FeaturedRelationshipAffinityArc = {
  relationId: string;
  participants: readonly [CurrentRelationCharacterId, CurrentRelationCharacterId];
  relationLabel: string;
  beats: readonly [FeaturedRelationshipAffinityBeat, FeaturedRelationshipAffinityBeat, FeaturedRelationshipAffinityBeat];
  asymmetricProgressionAllowed: true;
  frictionMustNotEraseBond: true;
  chosenTrustMustAuthorBothDirections: true;
  romanceInferred: false;
  exactIncidentFrozen: false;
  runtimeAutoPromotionAllowed: false;
};

type ShiftSeed = {
  from: CurrentRelationCharacterId;
  to: CurrentRelationCharacterId;
  direction: AuthoredAffinityDirection['direction'];
  reasonKey: string;
  storyMeaning: string;
  gameplayEcho: string;
};

type MutualSeed = {
  aToB: AuthoredAffinityDirection['direction'];
  bToA: AuthoredAffinityDirection['direction'];
  aReasonKey: string;
  bReasonKey: string;
  storyMeaning: string;
  gameplayEcho: string;
};

type ArcSeed = {
  relationId: string;
  friction: ShiftSeed;
  recognition: ShiftSeed;
  chosenTrust: MutualSeed;
};

function relationParticipants(relationId: string): readonly [CurrentRelationCharacterId, CurrentRelationCharacterId] {
  const relation = currentRelationshipInventoryById.get(relationId);
  if (!relation) throw new Error(`unknown Featured relationship: ${relationId}`);
  return relation.participants;
}

function shiftBeat(
  relationId: string,
  kind: 'FRICTION' | 'RECOGNITION',
  placementBand: 'EARLY_FLEX' | 'MID_FLEX',
  seed: ShiftSeed,
): FeaturedRelationshipAffinityBeat {
  const participants = relationParticipants(relationId);
  const event: PairwiseRelationshipLedgerEvent = {
    eventId: `${relationId}:${kind.toLowerCase()}:${seed.reasonKey}`,
    kind: 'AUTHORED_AFFINITY_SHIFT',
    participants,
    authoredAffinityDirections: [{ from: seed.from, to: seed.to, direction: seed.direction, reasonKey: seed.reasonKey }],
  };
  return {
    beatId: event.eventId,
    relationId,
    kind,
    placementBand,
    storyMeaning: seed.storyMeaning,
    gameplayEcho: seed.gameplayEcho,
    event,
    admission: admitPairwiseRelationshipLedgerEvent(event),
    exactIncidentFrozen: false,
    exactStageFrozen: false,
    numericDeltaFrozen: false,
    romanceInferred: false,
    runtimeAutoPromotionAllowed: false,
  };
}

function chosenTrustBeat(relationId: string, seed: MutualSeed): FeaturedRelationshipAffinityBeat {
  const [a, b] = relationParticipants(relationId);
  const event: PairwiseRelationshipLedgerEvent = {
    eventId: `${relationId}:chosen-trust`,
    kind: 'AUTHORED_MUTUAL_CHOICE',
    participants: [a, b],
    storyKey: `${relationId}_chosen_trust_v1`,
    authoredAffinityDirections: [
      { from: a, to: b, direction: seed.aToB, reasonKey: seed.aReasonKey },
      { from: b, to: a, direction: seed.bToA, reasonKey: seed.bReasonKey },
    ],
  };
  return {
    beatId: event.eventId,
    relationId,
    kind: 'CHOSEN_TRUST',
    placementBand: 'LATE_FLEX',
    storyMeaning: seed.storyMeaning,
    gameplayEcho: seed.gameplayEcho,
    event,
    admission: admitPairwiseRelationshipLedgerEvent(event),
    exactIncidentFrozen: false,
    exactStageFrozen: false,
    numericDeltaFrozen: false,
    romanceInferred: false,
    runtimeAutoPromotionAllowed: false,
  };
}

const seeds: readonly ArcSeed[] = [
  {
    relationId: 'yui-asa',
    friction: { from: 'asa', to: 'yui', direction: 'DOWN', reasonKey: 'asa_rejects_overchecking', storyMeaning: 'アサはユイの確認が「待つ」ではなく足止めに見え、善意でも苛立ちを隠さない。', gameplayEcho: '救援を急ぐ局面で二人のtimingが一度噛み合わない。' },
    recognition: { from: 'asa', to: 'yui', direction: 'UP', reasonKey: 'asa_sees_yui_return_choice', storyMeaning: 'ユイが自分で決めず本人へ選択を返した瞬間を見て、アサ側の評価だけが先に戻る。', gameplayEcho: 'アサの突入前にユイの短い確認cueを待てるようになる。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'yui_trusts_asa_waiting', bReasonKey: 'asa_trusts_yui_decision', storyMeaning: '速いアサと慎重なユイが互いを矯正せず、違う速度のまま一緒に行くことを選ぶ。', gameplayEcho: 'Pair Assistが「先に行く/追う」ではなく交互の橋渡しになる。' },
  },
  {
    relationId: 'yui-kuroori',
    friction: { from: 'yui', to: 'kuroori', direction: 'DOWN', reasonKey: 'yui_rejects_unexplained_withholding', storyMeaning: 'クロオリが理由を言わず預かったものを返さず、ユイは「守る」を口実にされたと感じる。', gameplayEcho: '封じたobjectをユイが無理に回収しようとして摩擦が出る。' },
    recognition: { from: 'kuroori', to: 'yui', direction: 'UP', reasonKey: 'kuroori_sees_yui_not_open', storyMeaning: 'ユイが拾ったものを「今は開けない」と自分で選び、クロオリ側が先に相手の責任感を認める。', gameplayEcho: '回収後に即使用せず保留できる選択が関係のechoになる。' },
    chosenTrust: { aToB: 'UP', bToA: 'UNCHANGED', aReasonKey: 'yui_accepts_conditional_withholding', bReasonKey: 'kuroori_keeps_measured_trust', storyMeaning: 'ユイは「預かるなら返す条件を残す」クロオリを選び直すが、クロオリは急に親密にならず静かな信頼を維持する。', gameplayEcho: '封じ/開封の交代権が明示される。' },
  },
  {
    relationId: 'nagi-kaname',
    friction: { from: 'kage1', to: 'nagi', direction: 'DOWN', reasonKey: 'kaname_rejects_closed_protection', storyMeaning: 'カナメはナギの安全策が仲間を閉じ込める瞬間を見て、自分と同じ抱え込みだと苛立つ。', gameplayEcho: '二人とも前へ出て守り、役割が重複して後衛が空く。' },
    recognition: { from: 'nagi', to: 'kage1', direction: 'UP', reasonKey: 'nagi_sees_kaname_delegate', storyMeaning: 'カナメが一度だけ防御を他人へ任せたことで、ナギが「守る人も任せられる」と認識する。', gameplayEcho: 'Guard交代後に空いた側が後衛を支える役へ回れる。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'nagi_accepts_shared_guard', bReasonKey: 'kaname_accepts_nagi_exit', storyMeaning: '二人は「全部守る」で競わず、閉じる人と受ける人を状況で交換する。', gameplayEcho: '二重防御ではなく防御relayへ変わる。' },
  },
  {
    relationId: 'michiru-toki',
    friction: { from: 'kage3', to: 'michiru', direction: 'DOWN', reasonKey: 'toki_rejects_unmeasured_detour', storyMeaning: 'トキはミチルの勘で選ぶ迂回を再現不能として低く見る。', gameplayEcho: 'route選択で測定値と直感が食い違う。' },
    recognition: { from: 'michiru', to: 'kage3', direction: 'UP', reasonKey: 'michiru_uses_uncertainty_record', storyMeaning: 'トキが「測れなかった」を消さず正式記録にしたことで、ミチルが測定を束縛ではなく余白として見る。', gameplayEcho: '不確実routeにも危険幅表示が残る。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'michiru_trusts_measurement_as_tool', bReasonKey: 'toki_trusts_michiru_choice', storyMeaning: '測る人と選ぶ人が、最後の決定を互いへ奪わず同行する。', gameplayEcho: '測定guideと自由routeが同時に有効になる。' },
  },
  {
    relationId: 'tomori-tsumugi',
    friction: { from: 'kage4', to: 'tomori', direction: 'DOWN', reasonKey: 'tsumugi_rejects_erased_seam', storyMeaning: 'トモリが綺麗に直しすぎて傷跡まで消し、ツムギは「残すものまで直された」と距離を取る。', gameplayEcho: 'repair結果の完全化が一度pair bonusを生まない。' },
    recognition: { from: 'tomori', to: 'kage4', direction: 'UP', reasonKey: 'tomori_sees_unfinished_value', storyMeaning: '未完成をそのまま渡すツムギの判断から、トモリが機能回復と新品化を分けて考え始める。', gameplayEcho: 'repairに「跡を残す」選択が増える。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'tomori_trusts_visible_seam', bReasonKey: 'tsumugi_trusts_requested_repair', storyMeaning: '二人は直す前に「どこまで」を聞き合い、継ぎ目を失敗ではなく共同作業の痕にする。', gameplayEcho: '修理/継承effectを共同で完成させる。' },
  },
  {
    relationId: 'ritsu-koyori',
    friction: { from: 'koyori', to: 'ritsu', direction: 'DOWN', reasonKey: 'koyori_rejects_brother_overprotection', storyMeaning: 'コヨリは兄の先回りが「自分には無理」と言われたように感じ、初めて明確に拒む。', gameplayEcho: 'リツが自動で庇うほどコヨリの行動機会を奪う局面を置く。' },
    recognition: { from: 'ritsu', to: 'koyori', direction: 'UP', reasonKey: 'ritsu_sees_koyori_rescue_others', storyMeaning: 'コヨリが自分以外を救った姿を見て、リツ側が「守る妹」だけの見方を更新する。', gameplayEcho: 'コヨリ発の救援を受けて、リツが庇う前に任せる判断を取れる。' },
    chosenTrust: { aToB: 'UNCHANGED', bToA: 'UP', aReasonKey: 'ritsu_love_stays_family_not_more', bReasonKey: 'koyori_trusts_brother_to_wait', storyMeaning: '兄妹の愛情を数値上の「さらに好き」にせず、リツは変わらぬ家族愛、コヨリは待ってくれる兄への信頼を上げる。', gameplayEcho: '「お兄ちゃん」の呼称は変えず、庇う/任せる条件だけが変わる。' },
  },
  {
    relationId: 'sen-koyori',
    friction: { from: 'koyori', to: 'sen', direction: 'DOWN', reasonKey: 'koyori_rejects_rule_without_voice', storyMeaning: 'センが安全なruleを先に決め、コヨリは子どもの自分だけ意見を聞かれなかったと怒る。', gameplayEcho: 'tutorial的指示が一度コヨリの行動と衝突する。' },
    recognition: { from: 'sen', to: 'koyori', direction: 'UP', reasonKey: 'sen_learns_from_koyori_rule', storyMeaning: 'コヨリが作った単純なruleの方が全員に伝わり、センが教える側だけではいられないと認める。', gameplayEcho: 'コヨリ提案のshort cueがparty ruleになる。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'sen_trusts_koyori_authority', bReasonKey: 'koyori_trusts_sen_to_ask', storyMeaning: '先生/子どもの上下だけでなく、互いに教えられる関係を選ぶ。', gameplayEcho: 'セン先生の呼称が残っても質問の往復が増える。' },
  },
  {
    relationId: 'yubi-tobari',
    friction: { from: 'tobari', to: 'yubi', direction: 'DOWN', reasonKey: 'tobari_rejects_immediate_delivery', storyMeaning: 'ユウビが「届くなら今」と進め、トバリは開ける時を守れない配達へ警戒する。', gameplayEcho: 'delivery routeとgate timingが噛み合わない。' },
    recognition: { from: 'yubi', to: 'tobari', direction: 'UP', reasonKey: 'yubi_sees_gate_as_return_path', storyMeaning: 'トバリの閉門が拒絶ではなく帰路を守るためだと知り、ユウビ側が開閉条件を尊重する。', gameplayEcho: '配達をholdしてgate cueを待つ。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'yubi_trusts_tobari_timing', bReasonKey: 'tobari_trusts_yubi_hold', storyMeaning: '届ける人と門を守る人が「渡さない/開けない」選択も仕事として認め合う。', gameplayEcho: 'Delivery Assistがgate conditionを無視しなくなる。' },
  },
  {
    relationId: 'madoka-ren',
    friction: { from: 'ren', to: 'madoka', direction: 'DOWN', reasonKey: 'ren_rejects_unspoken_observation', storyMeaning: 'マドカが気づいていたのに言わなかった差分を知り、レンは観測だけでは遅いと感じる。', gameplayEcho: '異変noticeのtimingが一度遅れる。' },
    recognition: { from: 'madoka', to: 'ren', direction: 'UP', reasonKey: 'madoka_sees_ren_report_without_judgment', storyMeaning: 'レンが差分を結論にせず本人へ返す姿を見て、マドカが自分の観測を共有しやすくなる。', gameplayEcho: '差分cueを二人で照合し、結論を急がず共有できる。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'madoka_trusts_ren_receiver', bReasonKey: 'ren_trusts_madoka_to_speak', storyMeaning: '見る人と伝える人を固定せず、気づいた側が声を出し、受けた側が決めつけない関係を選ぶ。', gameplayEcho: 'Reserveを含む関係なのでruntime昇格は別gateのまま。' },
  },
  {
    relationId: 'shiro-tsumugi',
    friction: { from: 'shiro', to: 'kage4', direction: 'DOWN', reasonKey: 'shiro_rejects_unrecorded_unfinished', storyMeaning: 'ツムギが未完のまま残した理由を記録しないことで、シロは分類不能ではなく放置に見える。', gameplayEcho: '未完objectの扱いで記録と継承が衝突する。' },
    recognition: { from: 'kage4', to: 'shiro', direction: 'UP', reasonKey: 'tsumugi_sees_shiro_keep_unknown', storyMeaning: 'シロが分からない項目を消さず「未分類」で残し、ツムギ側が記録を信頼し始める。', gameplayEcho: '未分類tagを保持したまま継ぐ。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'shiro_trusts_unfinished_context', bReasonKey: 'tsumugi_trusts_nonfinal_record', storyMeaning: '未分類と未完成を「いつか必ず完成させる欠陥」ではなく、残してよい状態として共同管理する。', gameplayEcho: '分類/修復を強制しないsupport stateが成立する。' },
  },
  {
    relationId: 'nemu-toki',
    friction: { from: 'kage3', to: 'nemu', direction: 'DOWN', reasonKey: 'toki_rejects_dream_as_measurement', storyMeaning: 'トキはネムの夢報告を再現不能として扱い、ネムは「見たのに無かったことにされた」と感じる。', gameplayEcho: '夢cueと計測cueが一致しない。' },
    recognition: { from: 'nemu', to: 'kage3', direction: 'UP', reasonKey: 'nemu_sees_toki_record_unknown', storyMeaning: 'トキが測れない区間を空欄ではなく「測定不能」と記録し、ネム側が現実確認を頼れるようになる。', gameplayEcho: 'DREAM情報にuncertain labelが付く。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'nemu_trusts_toki_reality_check', bReasonKey: 'toki_trusts_nemu_experience', storyMeaning: '夢を事実にせず、事実でないから無価値にもせず、二人で別レイヤーとして扱う。', gameplayEcho: '夢effectとmeasurementを重ねて読む。' },
  },
  {
    relationId: 'gen-michiru',
    friction: { from: 'michiru', to: 'gen', direction: 'DOWN', reasonKey: 'michiru_rejects_old_route_authority', storyMeaning: 'ゲンが昔の安全路を強く勧め、ミチルは今の地図を見てもらえていないと反発する。', gameplayEcho: '古routeと新routeが競合する。' },
    recognition: { from: 'gen', to: 'michiru', direction: 'UP', reasonKey: 'gen_sees_michiru_return_from_new_route', storyMeaning: 'ミチルが新しい道からちゃんと帰ったことで、ゲン側が経験を答えから参考へ下げる。', gameplayEcho: '古地図に新routeを追記する。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'gen_trusts_current_route_choice', bReasonKey: 'michiru_trusts_old_context', storyMeaning: '昔の道と今の道を勝敗にせず、どちらも「その時の帰り方」として残す。', gameplayEcho: 'route選択にold/new両hintが共存する。' },
  },
  {
    relationId: 'asa-kasumi',
    friction: { from: 'asa', to: 'kage2', direction: 'DOWN', reasonKey: 'asa_rejects_hidden_identity', storyMeaning: 'カスミが本人を守るため名を伏せ、アサは「名乗る権利まで奪った」と強く反発する。', gameplayEcho: '即公開/秘匿の判断がぶつかる。' },
    recognition: { from: 'kage2', to: 'asa', direction: 'UP', reasonKey: 'kasumi_sees_asa_wait_for_name', storyMeaning: 'アサが名乗らせようと急がず本人の沈黙を待ち、カスミ側が先に見方を変える。', gameplayEcho: '公開cueを本人入力までholdする。' },
    chosenTrust: { aToB: 'UP', bToA: 'UNCHANGED', aReasonKey: 'asa_accepts_temporary_hiding', bReasonKey: 'kasumi_keeps_guarded_respect', storyMeaning: 'アサは期限と本人同意のある秘匿を認める。カスミは急に心を開かず、敬意だけを維持する。', gameplayEcho: '隠す/名乗るを本人選択へ返す。' },
  },
  {
    relationId: 'yui-tomori',
    friction: { from: 'yui', to: 'tomori', direction: 'DOWN', reasonKey: 'yui_rejects_repair_before_owner', storyMeaning: 'トモリが拾った物を先に直し、ユイは持ち主の選択より修理が先になったことへ違和感を持つ。', gameplayEcho: 'repair可能objectを即修理しない選択が必要になる。' },
    recognition: { from: 'tomori', to: 'yui', direction: 'UP', reasonKey: 'tomori_sees_yui_preserve_damage', storyMeaning: 'ユイが壊れた状態も記録として残したことで、トモリが「直す前」を見るようになる。', gameplayEcho: 'before/after双方を拾える。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'yui_trusts_requested_repair', bReasonKey: 'tomori_trusts_owner_return', storyMeaning: '拾う人と直す人が、持ち主へ返すまでを共同作業として選ぶ。', gameplayEcho: 'pickup→confirm→repair→returnのrelayになる。' },
  },
  {
    relationId: 'hana-tsumugi',
    friction: { from: 'kage4', to: 'hana', direction: 'DOWN', reasonKey: 'tsumugi_rejects_preservation_overwrite', storyMeaning: 'ハナが大切に保存するため傷んだ部分を整え、ツムギは経年の痕まで消えたと感じる。', gameplayEcho: '保存buffが一度継ぎ目情報を薄くする。' },
    recognition: { from: 'hana', to: 'kage4', direction: 'UP', reasonKey: 'hana_sees_seam_as_record', storyMeaning: 'ツムギが傷を隠さず残すことで、ハナが保存対象を「綺麗なもの」から「変化したもの」へ広げる。', gameplayEcho: 'damaged stateにもcollection価値が付く。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'hana_trusts_visible_age', bReasonKey: 'tsumugi_trusts_hana_to_keep', storyMeaning: '残す人と継ぐ人が、変化を消さない保存を選ぶ。', gameplayEcho: 'archiveとrepairの両方で同じ傷跡IDを保持する。' },
  },
  {
    relationId: 'sen-shiro',
    friction: { from: 'shiro', to: 'sen', direction: 'DOWN', reasonKey: 'shiro_rejects_explanation_as_classification', storyMeaning: 'センが分かりやすく説明した瞬間、シロは未分類だったものへ早すぎる枠が付いたと感じる。', gameplayEcho: '説明hintが一度unknown stateを消しかける。' },
    recognition: { from: 'sen', to: 'shiro', direction: 'UP', reasonKey: 'sen_sees_unknown_as_valid', storyMeaning: 'シロが「不明」を正式な状態として運用し、センが教えないことも責任だと学ぶ。', gameplayEcho: 'unknown labelを残したtutorialが成立する。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'sen_trusts_shiro_uncertainty', bReasonKey: 'shiro_trusts_sen_question', storyMeaning: '説明する人と分類しない人が、答えより質問を共有する。', gameplayEcho: 'hint UIが複数仮説を並べる。' },
  },
  {
    relationId: 'nagi-tobari',
    friction: { from: 'tobari', to: 'nagi', direction: 'DOWN', reasonKey: 'tobari_rejects_seal_without_exit', storyMeaning: 'ナギが危険を閉じたまま出口条件を残さず、トバリは「門ではなく壁だ」と拒む。', gameplayEcho: 'seal areaにexit cueがなくなる。' },
    recognition: { from: 'nagi', to: 'tobari', direction: 'UP', reasonKey: 'nagi_sees_gate_close_to_return', storyMeaning: 'トバリが閉じる時ほど帰還routeを残し、ナギ側が境界の作り方を学ぶ。', gameplayEcho: 'sealにreturn gateを併設する。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'nagi_trusts_tobari_exit', bReasonKey: 'tobari_trusts_nagi_timeout', storyMeaning: '閉じる/開けるを対立させず、期限と退出手段を持つ守りを共同で選ぶ。', gameplayEcho: 'temporary seal + explicit exitへ統合する。' },
  },
  {
    relationId: 'kaname-ritsu',
    friction: { from: 'ritsu', to: 'kage1', direction: 'DOWN', reasonKey: 'ritsu_rejects_self_sacrifice_competition', storyMeaning: 'カナメが全部受けようとし、リツは自分まで守られる側へ押し込まれたと反発する。', gameplayEcho: '二人が同じdamageを引き受けようとしてresourceを浪費する。' },
    recognition: { from: 'kage1', to: 'ritsu', direction: 'UP', reasonKey: 'kaname_sees_ritsu_delegate', storyMeaning: 'リツが自分以外へ任せる判断を見せ、カナメ側が「強さ=全部受ける」を崩す。', gameplayEcho: 'tank roleの交代が成立する。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'kaname_trusts_ritsu_shared_burden', bReasonKey: 'ritsu_trusts_kaname_to_stop', storyMeaning: '守る人同士が、先に倒れる競争ではなく「止まれる方も強い」を選ぶ。', gameplayEcho: 'Guardのoverlapを避けるpair arbitrationへ繋ぐ。' },
  },
  {
    relationId: 'yubi-kasumi',
    friction: { from: 'yubi', to: 'kage2', direction: 'DOWN', reasonKey: 'yubi_rejects_hidden_recipient', storyMeaning: 'カスミが宛名を隠したまま渡せと言い、ユウビは配達責任を果たせないと拒む。', gameplayEcho: 'delivery targetが見えない。' },
    recognition: { from: 'kage2', to: 'yubi', direction: 'UP', reasonKey: 'kasumi_sees_yubi_hold_delivery', storyMeaning: 'ユウビが届けられるのに敢えて保留し、カスミ側が「見せない選択を守れる人」と認める。', gameplayEcho: 'delivery holdが成功条件になる。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'yubi_trusts_masked_address', bReasonKey: 'kasumi_trusts_delivery_timing', storyMeaning: '宛名を完全公開せずとも、本人へ届く経路と時機を二人で守る。', gameplayEcho: 'masked recipient + consent deliveryへ繋がる。' },
  },
  {
    relationId: 'madoka-nemu',
    friction: { from: 'madoka', to: 'nemu', direction: 'DOWN', reasonKey: 'madoka_rejects_dream_as_report', storyMeaning: 'ネムが夢で見たことを現実の出来事のように話し、マドカは観測を壊されたと距離を置く。', gameplayEcho: '現実cueと夢cueが混在する。' },
    recognition: { from: 'nemu', to: 'madoka', direction: 'UP', reasonKey: 'nemu_sees_madoka_listen_without_agreeing', storyMeaning: 'マドカが否定も同意もせず最後まで聞き、「見たこととは別に残そう」と言う。', gameplayEcho: 'dream logを別layerへ保存する。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'madoka_trusts_nemu_label_dream', bReasonKey: 'nemu_trusts_madoka_reality', storyMeaning: '見たことと夢で見たことを混ぜず、どちらも話せる関係を選ぶ。', gameplayEcho: '二種類のobservation cueを統合表示する。' },
  },
  {
    relationId: 'gen-toki',
    friction: { from: 'kage3', to: 'gen', direction: 'DOWN', reasonKey: 'toki_rejects_anecdote_as_data', storyMeaning: 'ゲンの経験談をトキが再現性なしとして切り捨て、ゲンも数字だけで夜を読む態度へ反発する。', gameplayEcho: '経験hintと測定値が矛盾する。' },
    recognition: { from: 'gen', to: 'kage3', direction: 'UP', reasonKey: 'gen_sees_toki_measure_old_claim', storyMeaning: 'トキがゲンの昔話を笑わず測定対象にし、ゲン側が数値を否定するのをやめる。', gameplayEcho: '古い経験からtestable hypothesisを作る。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'gen_trusts_toki_measurement_limit', bReasonKey: 'toki_trusts_gen_context', storyMeaning: '古い経験と現在の測定を、互いの上位互換にせず比較する。', gameplayEcho: 'context + measurementのdual hintへ繋ぐ。' },
  },
  {
    relationId: 'hana-shiro',
    friction: { from: 'hana', to: 'shiro', direction: 'DOWN', reasonKey: 'hana_rejects_unknown_without_care', storyMeaning: 'シロが意味不明の物を未分類棚へ置くだけで、ハナは「分からないから大切にしない」に見えてしまう。', gameplayEcho: 'unknown itemがcare対象から外れかける。' },
    recognition: { from: 'shiro', to: 'hana', direction: 'UP', reasonKey: 'shiro_sees_hana_preserve_unknown', storyMeaning: 'ハナが意味の分からない物も同じ手間で保存し、シロ側が分類前のcareを学ぶ。', gameplayEcho: 'unknown itemにもpreservation actionが付く。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'hana_trusts_shiro_unknown_shelf', bReasonKey: 'shiro_trusts_hana_without_label', storyMeaning: '意味が分かる物/分からない物を同じ棚で扱い、説明がなくても残せる共同ルールを選ぶ。', gameplayEcho: 'collection UIにunknown-safe storageを残す。' },
  },
  {
    relationId: 'kuroori-yubi',
    friction: { from: 'yubi', to: 'kuroori', direction: 'DOWN', reasonKey: 'yubi_rejects_indefinite_hold', storyMeaning: 'クロオリが「今は渡さない」まま期限を言わず、ユウビは預かりが未配達の放置へ変わったと怒る。', gameplayEcho: 'held deliveryにdeadlineがない。' },
    recognition: { from: 'kuroori', to: 'yubi', direction: 'UP', reasonKey: 'kuroori_sees_yubi_respect_hold', storyMeaning: 'ユウビが届ける力を持ちながら本人の準備を待ち、クロオリ側が配達を侵入ではなく責任として見る。', gameplayEcho: 'hold conditionを尊重する。' },
    chosenTrust: { aToB: 'UP', bToA: 'UNCHANGED', aReasonKey: 'kuroori_trusts_yubi_conditional_delivery', bReasonKey: 'yubi_keeps_professional_boundary', storyMeaning: 'クロオリは渡す相手としてユウビを選び直す。ユウビは親密さより「期限と条件を明示するなら預かる」という仕事上の信頼を維持する。', gameplayEcho: 'conditional delivery contractへ繋ぐ。' },
  },
  {
    relationId: 'ren-toki',
    friction: { from: 'kage3', to: 'ren', direction: 'DOWN', reasonKey: 'toki_rejects_difference_without_scale', storyMeaning: 'レンが細かな差分を大量に持ち込み、トキは重要度のない変化が測定を濁すと切る。', gameplayEcho: 'change logがnoiseになる。' },
    recognition: { from: 'ren', to: 'kage3', direction: 'UP', reasonKey: 'ren_sees_toki_keep_outlier', storyMeaning: 'トキが一つの外れ値を削除せず残し、レン側が測定を「差分を消す行為」と見るのをやめる。', gameplayEcho: 'outlierを残したcomparisonが成立する。' },
    chosenTrust: { aToB: 'UP', bToA: 'UP', aReasonKey: 'ren_trusts_toki_scale', bReasonKey: 'toki_trusts_ren_difference', storyMeaning: '差分を見つける人と測る人が、何を重要とするかを一緒に決める。', gameplayEcho: 'Reserve relationなのでruntime/save昇格は別gateを維持。' },
  },
] as const;

export const featuredRelationshipAffinityArcs: readonly FeaturedRelationshipAffinityArc[] = seeds.map((seed) => {
  const relation = currentRelationshipInventoryById.get(seed.relationId);
  if (!relation) throw new Error(`Featured Affinity seed escaped Current24: ${seed.relationId}`);
  const beats = [
    shiftBeat(seed.relationId, 'FRICTION', 'EARLY_FLEX', seed.friction),
    shiftBeat(seed.relationId, 'RECOGNITION', 'MID_FLEX', seed.recognition),
    chosenTrustBeat(seed.relationId, seed.chosenTrust),
  ] as const;
  return {
    relationId: seed.relationId,
    participants: relation.participants,
    relationLabel: relation.displayLabel,
    beats,
    asymmetricProgressionAllowed: true,
    frictionMustNotEraseBond: true,
    chosenTrustMustAuthorBothDirections: true,
    romanceInferred: false,
    exactIncidentFrozen: false,
    runtimeAutoPromotionAllowed: false,
  };
});

export const featuredRelationshipAffinityBeats = featuredRelationshipAffinityArcs.flatMap((entry) => entry.beats);

export const featuredRelationshipAffinityBeatSummary = {
  relationCount: featuredRelationshipAffinityArcs.length,
  beatCount: featuredRelationshipAffinityBeats.length,
  frictionBeatCount: featuredRelationshipAffinityBeats.filter((entry) => entry.kind === 'FRICTION').length,
  recognitionBeatCount: featuredRelationshipAffinityBeats.filter((entry) => entry.kind === 'RECOGNITION').length,
  chosenTrustBeatCount: featuredRelationshipAffinityBeats.filter((entry) => entry.kind === 'CHOSEN_TRUST').length,
  downwardDirectedOutcomeCount: featuredRelationshipAffinityBeats.flatMap((entry) => entry.admission.authoredAffinityDirections).filter((entry) => entry.direction === 'DOWN').length,
  unchangedDirectedOutcomeCount: featuredRelationshipAffinityBeats.flatMap((entry) => entry.admission.authoredAffinityDirections).filter((entry) => entry.direction === 'UNCHANGED').length,
  upwardDirectedOutcomeCount: featuredRelationshipAffinityBeats.flatMap((entry) => entry.admission.authoredAffinityDirections).filter((entry) => entry.direction === 'UP').length,
  exactIncidentFrozen: false,
  exactStageFrozen: false,
  numericDeltaFrozen: false,
  romanceInferred: false,
  runtimeAutoPromotionAllowed: false,
} as const;
