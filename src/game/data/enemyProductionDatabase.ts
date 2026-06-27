export type EnemyRank = 'small' | 'medium' | 'elite' | 'boss';
export type EnemyFamily = 'ombu' | 'omburo' | 'wrong_reading' | 'great_shadow';
export type EnemyAssetPromptKind = 'sprite_sheet_180' | 'reference' | 'attack_sheet' | 'collection_icon';

export type EnemyProductionEntry = {
  id: string;
  no: number;
  name: string;
  rank: EnemyRank;
  family: EnemyFamily;
  readableRole: string;
  wrongReading: string;
  releasedClue: string;
  movement: string;
  attackCue: string;
  silhouette: string;
  palette: string[];
  stageAffinity: string[];
  dropHint: string;
  assetKeywords: string[];
};

export type EnemyAssetPrompt = {
  enemyId: string;
  enemyName: string;
  kind: EnemyAssetPromptKind;
  title: string;
  outputPathHint: string;
  sizeSpec: string;
  prompt: string;
  negativePrompt: string;
  reviewChecklist: string[];
};

export const ENEMY_ASSET_PROMPT_KINDS: EnemyAssetPromptKind[] = [
  'sprite_sheet_180',
  'reference',
  'attack_sheet',
  'collection_icon',
];

export const enemyProductionEntries: EnemyProductionEntry[] = [
  { id: 'ombu_small_ink', no: 1, name: 'オンブ 墨', rank: 'small', family: 'ombu', readableRole: '基準雑魚。最初に読ませる黒い影。', wrongReading: 'ただの黒い塊に見える', releasedClue: '短い名前の端', movement: 'ゆっくり直進', attackCue: '体が一瞬だけ前へ伸びる', silhouette: '腕なし、短い一本のインク芽、丸い影炎', palette: ['ink black', 'deep navy'], stageAffinity: ['forgotten_street'], dropHint: '記憶片', assetKeywords: ['small ink shadow', 'one short sprout', 'round soft body', 'no arms'] },
  { id: 'ombu_small_blue', no: 2, name: 'オンブ 青灰', rank: 'small', family: 'ombu', readableRole: '水面や夢に混じる低速雑魚。', wrongReading: '濡れた記憶が乾かない', releasedClue: '水色の余白', movement: '少しふらつく直進', attackCue: '波のように体が揺れる', silhouette: '腕なし、短い芽、後方に青灰モヤ', palette: ['blue gray', 'deep navy'], stageAffinity: ['dream_waterway'], dropHint: '朝露', assetKeywords: ['blue gray ombu', 'wet memory shadow', 'soft wave body'] },
  { id: 'ombu_small_violet', no: 3, name: 'オンブ 紫黒', rank: 'small', family: 'ombu', readableRole: '黒耀化文脈の雑魚。', wrongReading: '強い感情を全部夜に読む', releasedClue: '紫のにじみ', movement: '少し速い蛇行', attackCue: '顔前のモヤが濃くなる', silhouette: '腕なし、紫黒の薄モヤ、口なし', palette: ['violet black', 'ink black'], stageAffinity: ['black_origami_roof'], dropHint: '記憶片', assetKeywords: ['violet black shadow', 'thin face mist', 'soft ink flame'] },
  { id: 'ombu_small_paper', no: 4, name: 'オンブ 紙片', rank: 'small', family: 'ombu', readableRole: '紙ステージ用の読みやすい雑魚。', wrongReading: '紙片が敵に見える', releasedClue: '折れた紙角', movement: '紙のように軽く寄る', attackCue: '紙片が一枚だけ跳ねる', silhouette: '丸い影に紙片が一枚刺さる', palette: ['paper cream', 'ink black'], stageAffinity: ['name_tag_alley', 'paper_plane_window'], dropHint: '記憶片', assetKeywords: ['paper fragment shadow', 'single paper shard', 'round ombu'] },
  { id: 'ombu_small_ticket', no: 5, name: 'オンブ 切符', rank: 'small', family: 'ombu', readableRole: '道・駅ステージ用。', wrongReading: '行き先が全部同じに見える', releasedClue: '切符穴', movement: '一直線に近い突進', attackCue: '切符穴が光る', silhouette: '切符片を背負った小影', palette: ['ticket beige', 'ink black'], stageAffinity: ['ticket_gate_station'], dropHint: '白い切符', assetKeywords: ['ticket shadow', 'punched ticket piece', 'small ombu'] },
  { id: 'ombu_small_name', no: 6, name: 'オンブ 名札', rank: 'small', family: 'ombu', readableRole: 'アサ文脈の雑魚。', wrongReading: '名前を貼り間違える', releasedClue: '名札の穴', movement: 'ターゲットへまっすぐ寄る', attackCue: '名札が黒く貼りつく', silhouette: '小さな名札が前面にある影', palette: ['paper beige', 'dawn pink', 'ink black'], stageAffinity: ['name_tag_alley'], dropHint: '迷子の鈴', assetKeywords: ['name tag shadow', 'paper tag front', 'small rounded body'] },
  { id: 'ombu_small_chalk', no: 7, name: 'オンブ 白線', rank: 'small', family: 'ombu', readableRole: '線で進路を読ませる雑魚。', wrongReading: '道筋が消されたように見える', releasedClue: 'チョーク粉', movement: '白線に沿うように曲がる', attackCue: '白い粉が前に散る', silhouette: '黒板粉をまとった小影', palette: ['chalk white', 'green blackboard', 'ink black'], stageAffinity: ['chalk_classroom'], dropHint: '記憶片', assetKeywords: ['chalk dust shadow', 'white guide line', 'small blackboard ombu'] },
  { id: 'ombu_small_bookmark', no: 8, name: 'オンブ しおり', rank: 'small', family: 'ombu', readableRole: '本・箱ステージ用。', wrongReading: '途中で閉じたページが進まない', releasedClue: 'しおり端', movement: 'ゆっくり回り込み', attackCue: 'しおりが前へ倒れる', silhouette: '縦長しおり片が背に立つ', palette: ['moon blue', 'paper cream', 'ink black'], stageAffinity: ['moon_box_library'], dropHint: '朝露', assetKeywords: ['bookmark shadow', 'vertical paper tab', 'moon blue tint'] },
  { id: 'ombu_small_compass', no: 9, name: 'オンブ 方位', rank: 'small', family: 'ombu', readableRole: '道案内系の雑魚。', wrongReading: '帰り道が敵の方向を指す', releasedClue: '小さな針', movement: '一度止まって向きを変える', attackCue: '針がプレイヤーを指す', silhouette: '小さな針が頭上に浮く', palette: ['starlight gold', 'map blue', 'ink black'], stageAffinity: ['return_map_crossing'], dropHint: '白い切符', assetKeywords: ['compass needle shadow', 'small path line', 'map blue'] },
  { id: 'ombu_small_flower', no: 10, name: 'オンブ 押花', rank: 'small', family: 'ombu', readableRole: '保存された記憶系。', wrongReading: '枯れたものは戻らない', releasedClue: '薄い花脈', movement: '遅いが密集しやすい', attackCue: '花脈が黒く光る', silhouette: '丸い影に押し花の筋', palette: ['pressed flower pink', 'pale aqua', 'ink black'], stageAffinity: ['pressed_flower_archive'], dropHint: '朝露', assetKeywords: ['pressed flower shadow', 'flower vein', 'pale aqua glow'] },
  { id: 'ombu_small_envelope', no: 11, name: 'オンブ 封筒', rank: 'small', family: 'ombu', readableRole: '遅延・時間差攻撃の読み。', wrongReading: '届かなかったものは意味がない', releasedClue: '薄い消印', movement: '遅れて追いつく', attackCue: '封が少し開く', silhouette: '封筒フラップのある小影', palette: ['post paper', 'stamp red', 'ink black'], stageAffinity: ['unposted_post_office'], dropHint: '記憶片', assetKeywords: ['envelope shadow', 'postmark', 'delayed trail'] },
  { id: 'ombu_small_window', no: 12, name: 'オンブ 窓', rank: 'small', family: 'ombu', readableRole: '視線・窓枠系。', wrongReading: '見ていただけで何もできない', releasedClue: '窓の光', movement: '横に滑る', attackCue: '窓枠が一瞬閉じる', silhouette: '小さな窓枠を背負う影', palette: ['window blue', 'paper white', 'ink black'], stageAffinity: ['paper_plane_window'], dropHint: '迷子の鈴', assetKeywords: ['window frame shadow', 'paper airplane hint', 'side glide'] },
  { id: 'ombu_small_eraser', no: 13, name: 'オンブ 消し跡', rank: 'small', family: 'ombu', readableRole: '名前を薄くする雑魚。', wrongReading: '消したものは最初から無い', releasedClue: '白い粉', movement: '近づくほど薄くなる', attackCue: '消しゴム粉が散る', silhouette: '白黒の粉をまとった影', palette: ['eraser white', 'dust gray', 'ink black'], stageAffinity: ['blank_card_room'], dropHint: '記憶片', assetKeywords: ['eraser dust shadow', 'monochrome powder', 'soft deleted edge'] },
  { id: 'ombu_small_ruler', no: 14, name: 'オンブ 定規', rank: 'small', family: 'ombu', readableRole: '角度・射線の読みを作る雑魚。', wrongReading: '正しい角度以外は間違い', releasedClue: '割れた目盛り', movement: '斜め直線', attackCue: '角度線が白く走る', silhouette: '三角定規の角が出た影', palette: ['ruler blue', 'cold white', 'ink black'], stageAffinity: ['ruler_rooftop'], dropHint: '白い切符', assetKeywords: ['ruler shadow', 'diagonal angle line', 'geometric ombu'] },
  { id: 'ombu_small_blank', no: 15, name: 'オンブ 余白', rank: 'small', family: 'ombu', readableRole: '空白・未確定用。', wrongReading: '何もないなら価値がない', releasedClue: '白い余白', movement: 'ゆっくり膨らむ', attackCue: '中央だけ黒く抜ける', silhouette: '輪郭だけ読める空白影', palette: ['blank white', 'ink black', 'quiet gold'], stageAffinity: ['blank_card_room'], dropHint: '記憶片', assetKeywords: ['blank card shadow', 'negative space center', 'quiet gold rim'] },
  { id: 'ombu_small_bell', no: 16, name: 'オンブ 鈴', rank: 'small', family: 'ombu', readableRole: '吸い寄せ/音の誘導。', wrongReading: '呼ぶ音が逆に迷わせる', releasedClue: '小さな鈴音', movement: '周囲の敵を寄せるように動く', attackCue: '鈴が揺れる', silhouette: '鈴の小突起がある小影', palette: ['soft brass', 'ink black'], stageAffinity: ['forgotten_street'], dropHint: '迷子の鈴', assetKeywords: ['lost bell shadow', 'small brass bell', 'sound ripple'] },
  { id: 'ombu_small_dew', no: 17, name: 'オンブ 朝露', rank: 'small', family: 'ombu', readableRole: '回復ドロップ周辺に出る対比。', wrongReading: '朝のものまで夜に沈む', releasedClue: '透明なしずく', movement: '遅く、きらっと止まる', attackCue: 'しずくが黒くなる', silhouette: '丸いしずく形の影', palette: ['pale aqua', 'ink black'], stageAffinity: ['repair_lamp_workshop'], dropHint: '朝露', assetKeywords: ['dew shadow', 'transparent droplet', 'pale aqua rim'] },
  { id: 'ombu_small_match', no: 18, name: 'オンブ マッチ', rank: 'small', family: 'ombu', readableRole: '一時強化の対になる雑魚。', wrongReading: '火をつける前に消える', releasedClue: '焦げた軸', movement: '短く速い突進', attackCue: '火花が黒く散る', silhouette: 'マッチ棒のような芽', palette: ['ember orange', 'ink black'], stageAffinity: ['repair_lamp_workshop'], dropHint: '夜明けマッチ', assetKeywords: ['matchstick shadow', 'tiny ember', 'short dash'] },
  { id: 'ombu_small_keyhole', no: 19, name: 'オンブ 鍵穴', rank: 'small', family: 'ombu', readableRole: '箱・封じの雑魚。', wrongReading: '閉じたものは守られているだけ', releasedClue: '鍵穴の光', movement: '近づくと硬くなる', attackCue: '鍵穴が黒く縦に開く', silhouette: '鍵穴型の顔前モヤ', palette: ['silver', 'moon blue', 'ink black'], stageAffinity: ['moon_box_library'], dropHint: '記憶片', assetKeywords: ['keyhole shadow', 'moon box hint', 'vertical black slit'] },
  { id: 'ombu_small_thread', no: 20, name: 'オンブ 糸', rank: 'small', family: 'ombu', readableRole: '修理・継ぎ目の雑魚。', wrongReading: '継いだ跡は傷でしかない', releasedClue: 'ほつれ糸', movement: '細い軌跡を残す', attackCue: '糸が前に伸びる', silhouette: '糸状の尾を持つ小影', palette: ['repair orange', 'tool brass', 'ink black'], stageAffinity: ['repair_lamp_workshop'], dropHint: '記憶片', assetKeywords: ['thread shadow', 'stitched trail', 'repair motif'] },
  { id: 'ombu_small_stamp', no: 21, name: 'オンブ 消印', rank: 'small', family: 'ombu', readableRole: '郵便・証明の雑魚。', wrongReading: '押された印がすべてを決める', releasedClue: '薄い日付跡', movement: '一定間隔で停止', attackCue: '丸い消印が出る', silhouette: '丸印が浮く影', palette: ['stamp red', 'post paper', 'ink black'], stageAffinity: ['unposted_post_office'], dropHint: '記憶片', assetKeywords: ['postmark shadow', 'round stamp mark', 'dated paper'] },
  { id: 'ombu_small_pin', no: 22, name: 'オンブ 地図ピン', rank: 'small', family: 'ombu', readableRole: '位置固定の雑魚。', wrongReading: '刺さった場所から動けない', releasedClue: '外れたピン先', movement: '止まってから突進', attackCue: 'ピンが床へ刺さる', silhouette: '頭に丸いピン', palette: ['map blue', 'starlight gold', 'ink black'], stageAffinity: ['return_map_crossing'], dropHint: '白い切符', assetKeywords: ['map pin shadow', 'pin head', 'short lunge'] },
  { id: 'ombu_small_button', no: 23, name: 'オンブ 片ボタン', rank: 'small', family: 'ombu', readableRole: '生活感のある回収対象。', wrongReading: '片方だけでは留められない', releasedClue: '二つ穴ボタン', movement: '円を描くように寄る', attackCue: '穴が黒く光る', silhouette: 'ボタン穴が二つ見える小影', palette: ['tool brass', 'paper gray', 'ink black'], stageAffinity: ['repair_lamp_workshop'], dropHint: '記憶片', assetKeywords: ['button shadow', 'two button holes', 'small domestic object'] },
  { id: 'ombu_small_ribbon', no: 24, name: 'オンブ リボン', rank: 'small', family: 'ombu', readableRole: '結ぶ/ほどくの対比。', wrongReading: 'ほどけるなら結んだ意味がない', releasedClue: '結び目の端', movement: '左右に揺れる', attackCue: '結び目が締まる', silhouette: '小さなリボン形の影炎', palette: ['soft lilac', 'ink black'], stageAffinity: ['name_tag_alley'], dropHint: '迷子の鈴', assetKeywords: ['ribbon shadow', 'small knot', 'soft lilac'] },
  { id: 'ombu_small_lens', no: 25, name: 'オンブ レンズ', rank: 'small', family: 'ombu', readableRole: '見える/見えないの雑魚。', wrongReading: '歪んで見えたものを本物と思う', releasedClue: '欠けたレンズ', movement: '見えにくい薄モヤ', attackCue: 'レンズが黒く反射', silhouette: '丸いレンズ輪郭の小影', palette: ['glass blue', 'paper gray', 'ink black'], stageAffinity: ['paper_plane_window'], dropHint: '記憶片', assetKeywords: ['broken lens shadow', 'glass ring', 'subtle reflection'] },
  { id: 'ombu_small_photo', no: 26, name: 'オンブ 古写真', rank: 'small', family: 'ombu', readableRole: '記録系の雑魚。', wrongReading: '写っていないものは無かった', releasedClue: '写真の白枠', movement: '画面端から滑る', attackCue: '白枠が黒く焼ける', silhouette: '写真枠が背中にある影', palette: ['sepia', 'paper cream', 'ink black'], stageAffinity: ['pressed_flower_archive'], dropHint: '記憶片', assetKeywords: ['old photo shadow', 'sepia frame', 'white photo border'] },
  { id: 'ombu_small_moth', no: 27, name: 'オンブ 白蛾', rank: 'small', family: 'ombu', readableRole: '灯りに寄る雑魚。', wrongReading: '光に寄るものは燃えるだけ', releasedClue: '白い羽粉', movement: '灯りへふらつく', attackCue: '羽粉が散る', silhouette: '蛾の羽のような後方モヤ', palette: ['white paper', 'library gray', 'ink black'], stageAffinity: ['white_bookmark_library'], dropHint: '記憶片', assetKeywords: ['white moth shadow', 'wing dust', 'lamp seeking'] },
  { id: 'ombu_small_crow', no: 28, name: 'オンブ 烏紙', rank: 'small', family: 'ombu', readableRole: '影側紙モチーフ。', wrongReading: '黒い紙は全部隠すもの', releasedClue: '折り目の白線', movement: '素早く斜め移動', attackCue: '折り目が開く', silhouette: '烏羽のような折り紙影', palette: ['ink black', 'deep purple'], stageAffinity: ['black_origami_roof'], dropHint: '記憶片', assetKeywords: ['black origami crow shadow', 'fold line', 'sharp paper wing'] },
  { id: 'ombu_small_rabbit', no: 29, name: 'オンブ 黒兎', rank: 'small', family: 'ombu', readableRole: '空白と跳ねの雑魚。', wrongReading: '跳ねた先だけが正解', releasedClue: '小さな耳型余白', movement: '小さく跳ねる', attackCue: '耳の影が伸びる', silhouette: '短い耳に見える影芽', palette: ['blank white', 'ink black'], stageAffinity: ['blank_card_room'], dropHint: '記憶片', assetKeywords: ['black rabbit shadow', 'short ear sprout', 'hopping motion'] },
  { id: 'ombu_small_wolf', no: 30, name: 'オンブ 狼火', rank: 'small', family: 'ombu', readableRole: '近接リスク雑魚。', wrongReading: '守るためなら近づきすぎていい', releasedClue: '隠し火', movement: '速めの接近', attackCue: '影が刃のように尖る', silhouette: '鋭い前傾小影', palette: ['shadow black', 'ember orange'], stageAffinity: ['black_origami_roof'], dropHint: '夜明けマッチ', assetKeywords: ['wolf fire shadow', 'hidden ember', 'sharp forward silhouette'] },
  { id: 'ombu_small_bat', no: 31, name: 'オンブ 蝙蝠', rank: 'small', family: 'ombu', readableRole: '斜め移動・角度読み。', wrongReading: '夜の角度だけが正しい', releasedClue: '斜めの線', movement: 'ジグザグ', attackCue: '羽角が開く', silhouette: '蝙蝠羽のような角', palette: ['ruler blue', 'night navy'], stageAffinity: ['ruler_rooftop'], dropHint: '白い切符', assetKeywords: ['bat angle shadow', 'zigzag motion', 'diagonal cold light'] },
  { id: 'ombu_small_gecko', no: 32, name: 'オンブ ヤモリ', rank: 'small', family: 'ombu', readableRole: '壁沿い・消し跡雑魚。', wrongReading: '残った跡だけを追う', releasedClue: '細い足跡', movement: '壁沿いに寄る', attackCue: '足跡が黒くなる', silhouette: '低い這う影', palette: ['eraser white', 'ink black'], stageAffinity: ['blank_card_room'], dropHint: '記憶片', assetKeywords: ['gecko shadow', 'low crawling silhouette', 'eraser dust'] },
  { id: 'ombu_small_sheep', no: 33, name: 'オンブ 羊夢', rank: 'small', family: 'ombu', readableRole: '眠り・夢の雑魚。', wrongReading: '夢なら何でも変えていい', releasedClue: '眠り頁', movement: 'ふわふわ遅い', attackCue: '夢波が出る', silhouette: 'ふわっとした雲状影', palette: ['dream violet', 'water blue', 'ink black'], stageAffinity: ['dream_waterway'], dropHint: '朝露', assetKeywords: ['dream sheep shadow', 'soft cloud silhouette', 'violet water ripple'] },
  { id: 'ombu_small_dog', no: 34, name: 'オンブ 犬切符', rank: 'small', family: 'ombu', readableRole: '追跡系の雑魚。', wrongReading: '待っているだけでは通れない', releasedClue: '切符の端', movement: 'プレイヤーをしつこく追う', attackCue: '切符穴が連続で光る', silhouette: '短い耳の追跡影', palette: ['ticket beige', 'station green', 'ink black'], stageAffinity: ['ticket_gate_station'], dropHint: '白い切符', assetKeywords: ['dog ticket shadow', 'tracking small enemy', 'station green'] },
  { id: 'ombu_small_owl', no: 35, name: 'オンブ 古梟', rank: 'small', family: 'ombu', readableRole: '古道具・夜目の雑魚。', wrongReading: '古い方角だけが安全', releasedClue: '古い針の光', movement: '一拍遅れて向く', attackCue: '目のような針が光る', silhouette: '丸く低い古道具影', palette: ['old brass', 'station amber', 'ink black'], stageAffinity: ['old_compass_station'], dropHint: '記憶片', assetKeywords: ['old owl compass shadow', 'brass needle eyes', 'slow turn'] },
  { id: 'omburo_ink_arm', no: 36, name: 'オンブロ 墨腕', rank: 'medium', family: 'omburo', readableRole: '基準中型。腕伸ばしで危険を読む。', wrongReading: '抱えたものを離せない', releasedClue: '太い黒い手跡', movement: '遅い直進', attackCue: '右腕が鈍く伸びる', silhouette: '両腕太い、手先3房、頭芽2本', palette: ['ink black', 'deep navy'], stageAffinity: ['forgotten_street'], dropHint: '記憶片多め', assetKeywords: ['omburo large arms', 'two head sprouts', 'three blunt fingers'] },
  { id: 'omburo_nameplate', no: 37, name: 'オンブロ 名札', rank: 'medium', family: 'omburo', readableRole: '名札の中型。印を貼る。', wrongReading: '貼られた名前を外せない', releasedClue: '名札の安全ピン', movement: '一定距離で横回り', attackCue: '名札を前に押し出す', silhouette: '太腕に名札プレート', palette: ['dawn pink', 'paper cream', 'ink black'], stageAffinity: ['name_tag_alley'], dropHint: '迷子の鈴', assetKeywords: ['large name tag omburo', 'paper plate chest', 'thick arms'] },
  { id: 'omburo_moon_box', no: 38, name: 'オンブロ 月箱', rank: 'medium', family: 'omburo', readableRole: '箱型防御。硬いが遅い。', wrongReading: 'しまえばなかったことになる', releasedClue: '銀の鍵傷', movement: '遅く押してくる', attackCue: '箱蓋が黒く開く', silhouette: '箱を抱えた太腕影', palette: ['moon blue', 'silver', 'ink black'], stageAffinity: ['moon_box_library'], dropHint: '朝露', assetKeywords: ['moon box omburo', 'large box arms', 'silver keyhole'] },
  { id: 'omburo_compass', no: 39, name: 'オンブロ 迷針', rank: 'medium', family: 'omburo', readableRole: '進路妨害。', wrongReading: '帰り道が絡まっている', releasedClue: '折れたコンパス針', movement: '斜めに割り込む', attackCue: '針が割れて二方向を指す', silhouette: '頭に大きな割れ針', palette: ['starlight gold', 'map blue', 'ink black'], stageAffinity: ['return_map_crossing'], dropHint: '白い切符', assetKeywords: ['compass omburo', 'broken needle head', 'map lines'] },
  { id: 'omburo_repair_seam', no: 40, name: 'オンブロ 継ぎ目', rank: 'medium', family: 'omburo', readableRole: '修理ステージ中型。持続範囲。', wrongReading: '直した跡から夜が漏れる', releasedClue: '灯芯の糸', movement: 'じわじわ近づく', attackCue: '継ぎ目から黒いしずく', silhouette: '縫い目が腹にある太腕影', palette: ['repair orange', 'tool brass', 'ink black'], stageAffinity: ['repair_lamp_workshop'], dropHint: '夜明けマッチ', assetKeywords: ['stitched omburo', 'repair seam', 'black leak'] },
  { id: 'omburo_ticket_gate', no: 41, name: 'オンブロ 改札', rank: 'medium', family: 'omburo', readableRole: '通路封鎖。', wrongReading: '通れないなら戻るしかない', releasedClue: '切符穴の列', movement: '横に壁を作る', attackCue: '腕がゲートのように閉じる', silhouette: '横幅のあるゲート影', palette: ['ticket beige', 'station green', 'ink black'], stageAffinity: ['ticket_gate_station'], dropHint: '白い切符', assetKeywords: ['ticket gate omburo', 'wide gate arms', 'punch holes'] },
  { id: 'omburo_chalkboard', no: 42, name: 'オンブロ 黒板', rank: 'medium', family: 'omburo', readableRole: '白線攻撃。', wrongReading: '消された答えが正解に見える', releasedClue: '白線の端', movement: '直線レーンを作る', attackCue: '白線が床に走る', silhouette: '黒板面のような胸', palette: ['green blackboard', 'chalk white', 'ink black'], stageAffinity: ['chalk_classroom'], dropHint: '記憶片多め', assetKeywords: ['blackboard omburo', 'chalk lane', 'broad chest'] },
  { id: 'omburo_dream_wave', no: 43, name: 'オンブロ 夢波', rank: 'medium', family: 'omburo', readableRole: 'ゆらぎ範囲。', wrongReading: '夢の中なら進路を変えられる', releasedClue: '水面文字', movement: 'ゆっくり揺れる', attackCue: '波紋が広がる', silhouette: '水面のように下が広い影', palette: ['dream violet', 'water blue', 'ink black'], stageAffinity: ['dream_waterway'], dropHint: '朝露', assetKeywords: ['dream wave omburo', 'water ripple body', 'violet blue'] },
  { id: 'omburo_black_origami', no: 44, name: 'オンブロ 黒折', rank: 'elite', family: 'omburo', readableRole: '影側エリート。形が変わる。', wrongReading: '折れば隠せる', releasedClue: '折り目の白い芯', movement: '斜め移動から停止', attackCue: '折り目が刃状に開く', silhouette: '菱形折り紙と太い影腕', palette: ['ink black', 'deep purple', 'paper gray'], stageAffinity: ['black_origami_roof'], dropHint: '記憶片多め', assetKeywords: ['black origami elite', 'folded diamond body', 'shadow arms'] },
  { id: 'omburo_blank_card', no: 45, name: 'オンブロ 余白枠', rank: 'elite', family: 'omburo', readableRole: '空白エリート。中央が抜ける。', wrongReading: '空白を黒で埋める', releasedClue: '金の外周線', movement: 'じわじわ大きく見える', attackCue: '中央の黒が広がる', silhouette: '四角い空白カード影', palette: ['blank white', 'quiet gold', 'ink black'], stageAffinity: ['blank_card_room'], dropHint: '記憶片多め', assetKeywords: ['blank card elite', 'negative space center', 'gold rim'] },
  { id: 'boss_name_without_owner', no: 46, name: '持ち主のない名前', rank: 'boss', family: 'great_shadow', readableRole: '名前テーマ大ボス。', wrongReading: '名前だけが残り、誰のものか分からない', releasedClue: '誰かの名前札', movement: '重く中央へ寄る', attackCue: '無数の名札が黒く貼りつく', silhouette: '大きな影に名札片が何枚も浮く', palette: ['ink black', 'paper cream', 'dawn pink'], stageAffinity: ['name_tag_alley'], dropHint: '忘れ物', assetKeywords: ['great shadow boss', 'many name tags', 'ownerless name'] },
  { id: 'boss_closed_morning_box', no: 47, name: '閉じた朝箱', rank: 'boss', family: 'great_shadow', readableRole: '箱と朝の大ボス。', wrongReading: '朝を箱にしまえば夜は終わらない', releasedClue: '小さな銀の鍵', movement: '外周から圧迫', attackCue: '箱の蓋が街全体にかぶる', silhouette: '巨大な箱と三日月の影', palette: ['moon blue', 'silver', 'ink black'], stageAffinity: ['moon_box_library'], dropHint: '忘れ物', assetKeywords: ['giant moon box boss', 'closed dawn box', 'crescent lock'] },
  { id: 'boss_night_without_route', no: 48, name: '帰路のない夜', rank: 'boss', family: 'great_shadow', readableRole: '道・総合大ボス。', wrongReading: '帰り道が無い夜は、ずっと続く', releasedClue: '折れたコンパス針', movement: '地図線を塗りつぶす', attackCue: '道糸が黒く絡まる', silhouette: '巨大なコンパス針と地図線の影', palette: ['starlight gold', 'map blue', 'ink black'], stageAffinity: ['return_map_crossing'], dropHint: '忘れ物', assetKeywords: ['route-less night boss', 'giant compass needle', 'tangled map lines'] },
];

const ENEMY_NEGATIVE_PROMPT = 'no text, no letters, no numbers, no logo, no watermark, no checkerboard, no white background, no white fringe, no gore, no realistic monster, no hard horror';

function buildEnemyPrompt(enemy: EnemyProductionEntry, kind: EnemyAssetPromptKind): EnemyAssetPrompt {
  const sizeSpecByKind: Record<EnemyAssetPromptKind, string> = {
    sprite_sheet_180: '1440x1080 PNG RGBA, 8 columns x 6 rows, 48 cells, 180x180 per cell, transparent background, no edge contact.',
    reference: '1024x1024 PNG RGBA, single enemy reference, front 3/4 view, transparent background.',
    attack_sheet: '1440x1080 PNG RGBA, 8 columns x 6 rows, 48 cells, attack anticipation and hit frames, transparent background.',
    collection_icon: '512x512 PNG, one enemy icon, pure #00FF00 chroma key source background, no text.',
  };
  return {
    enemyId: enemy.id,
    enemyName: enemy.name,
    kind,
    title: `${enemy.name} ${kind}`,
    outputPathHint: `public/assets/prototypes/enemies/${enemy.id}/${enemy.id}-${kind}-v1.png`,
    sizeSpec: sizeSpecByKind[kind],
    prompt: [
      'Vamp Pon enemy asset, paper storybook pixel-art flavor, black ink memory shadow, readable mobile game silhouette, dark but not horror.',
      `Enemy: ${enemy.name} (${enemy.id}).`,
      `Rank/family: ${enemy.rank} / ${enemy.family}.`,
      `Readable role: ${enemy.readableRole}.`,
      `Wrong reading: ${enemy.wrongReading}.`,
      `Released clue: ${enemy.releasedClue}.`,
      `Movement: ${enemy.movement}. Attack cue: ${enemy.attackCue}.`,
      `Silhouette: ${enemy.silhouette}.`,
      `Palette: ${enemy.palette.join(', ')}.`,
      `Keywords: ${enemy.assetKeywords.join(', ')}.`,
      `Output spec: ${sizeSpecByKind[kind]}`,
    ].join('\n'),
    negativePrompt: ENEMY_NEGATIVE_PROMPT,
    reviewChecklist: [
      '小さいシルエットでも敵種が読める',
      'オンブは腕なし、オンブロは太腕という差が残っている',
      '怖すぎず、紙片・黒インク・記憶の文脈に見える',
      '攻撃予兆が1フレームで読める',
      '文字・数字・ロゴを焼いていない',
    ],
  };
}

export const enemyById = new Map(enemyProductionEntries.map((enemy) => [enemy.id, enemy]));
export const enemyAssetPrompts: EnemyAssetPrompt[] = enemyProductionEntries.flatMap((enemy) => ENEMY_ASSET_PROMPT_KINDS.map((kind) => buildEnemyPrompt(enemy, kind)));
export const enemyAssetPromptByKey = new Map(enemyAssetPrompts.map((prompt) => [`${prompt.enemyId}:${prompt.kind}`, prompt]));

export function getEnemyAssetPrompt(enemyId: string, kind: EnemyAssetPromptKind): EnemyAssetPrompt | undefined {
  return enemyAssetPromptByKey.get(`${enemyId}:${kind}`);
}

export const enemyProductionSummary = {
  total: enemyProductionEntries.length,
  small: enemyProductionEntries.filter((enemy) => enemy.rank === 'small').length,
  mediumOrElite: enemyProductionEntries.filter((enemy) => enemy.rank === 'medium' || enemy.rank === 'elite').length,
  boss: enemyProductionEntries.filter((enemy) => enemy.rank === 'boss').length,
  promptCount: enemyAssetPrompts.length,
} as const;
