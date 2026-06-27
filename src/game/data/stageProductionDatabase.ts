export type StageProductionPhase = 'core5' | 'season_seed' | 'future_seed' | 'shadow_seed';
export type StageAssetPromptKind = 'background_390x844' | 'parallax_layer_pack' | 'stage_thumbnail' | 'battle_tile_patch';

export type StageProductionEntry = {
  id: string;
  no: number;
  name: string;
  phase: StageProductionPhase;
  leadCharacterIds: string[];
  coreQuestion: string;
  storySeed: string;
  backgroundMotifs: string[];
  enemyAffinity: string[];
  itemSeeds: string[];
  stageMechanicSeed: string;
  colorScript: string[];
  assetKeywords: string[];
};

export type StageAssetPrompt = {
  stageId: string;
  stageName: string;
  kind: StageAssetPromptKind;
  title: string;
  outputPathHint: string;
  sizeSpec: string;
  prompt: string;
  negativePrompt: string;
  reviewChecklist: string[];
};

export const STAGE_ASSET_PROMPT_KINDS: StageAssetPromptKind[] = ['background_390x844', 'parallax_layer_pack', 'stage_thumbnail', 'battle_tile_patch'];

export const stageProductionEntries: StageProductionEntry[] = [
  { id: 'forgotten_street', no: 1, name: '忘れられた夜道', phase: 'core5', leadCharacterIds: ['yui'], coreQuestion: '誰のものか分からない記憶を、ユイは間違えずに拾えるか。', storySeed: '街灯の下に名前のない紙片が落ちている。', backgroundMotifs: ['夜の街', 'ランタン', '紙片', '黒インクの水たまり'], enemyAffinity: ['ombu_small_ink', 'omburo_ink_arm', 'boss_name_without_owner'], itemSeeds: ['記憶片', '朝露', '夜の鉛筆'], stageMechanicSeed: '基準ステージ。視認性と8分サバイバルの読みやすさを優先。', colorScript: ['deep navy', 'warm amber', 'paper cream'], assetKeywords: ['forgotten street', 'paper fragments', 'warm lantern glow', 'black ink puddles'] },
  { id: 'name_tag_alley', no: 2, name: '名札の路地', phase: 'core5', leadCharacterIds: ['asa'], coreQuestion: '貼り間違えられた名前を、誰のものとして結び直すか。', storySeed: '壁にたくさんの名札が貼られているが、どれも少しずれている。', backgroundMotifs: ['名札', '紙片の壁', '細い路地', '朝色の紐'], enemyAffinity: ['ombu_small_name', 'ombu_small_ribbon', 'omburo_nameplate'], itemSeeds: ['封のされた手紙', '旅のバッジ', '絵はがきカッター'], stageMechanicSeed: '印付け・マーキングの導入候補。', colorScript: ['soft dawn pink', 'paper cream', 'ink black'], assetKeywords: ['name tag alley', 'paper tags wall', 'dawn pink string', 'narrow street'] },
  { id: 'moon_box_library', no: 3, name: '月箱の書庫', phase: 'core5', leadCharacterIds: ['nagi'], coreQuestion: '守るためにしまったものを、いつ開けるか。', storySeed: '月の形をした鍵穴が、本棚の奥で光る。', backgroundMotifs: ['月箱', '古い本棚', '鍵穴', '青白い月光'], enemyAffinity: ['ombu_small_bookmark', 'ombu_small_keyhole', 'omburo_moon_box', 'boss_closed_morning_box'], itemSeeds: ['小さな銀の鍵', '月のしおり', '月明かりのしおり'], stageMechanicSeed: '安全圏と防御の導入候補。', colorScript: ['moon blue', 'silver', 'deep indigo'], assetKeywords: ['moon box library', 'keyhole moonlight', 'old bookshelf', 'quiet blue glow'] },
  { id: 'return_map_crossing', no: 4, name: '帰り道の交差点', phase: 'core5', leadCharacterIds: ['michiru'], coreQuestion: '帰り道が絡まっても、どの星を目印にするか。', storySeed: '地図線が夜道の上に重なり、星だけが正しい方向を示す。', backgroundMotifs: ['コンパス', '地図線', '交差点', '星図'], enemyAffinity: ['ombu_small_compass', 'ombu_small_pin', 'omburo_compass', 'boss_night_without_route'], itemSeeds: ['折れたコンパス針', '街灯の輪', '外れた地図ピン'], stageMechanicSeed: '位置取り・誘導・安全路の導入候補。', colorScript: ['map blue', 'starlight gold', 'night navy'], assetKeywords: ['return road crossing', 'star map lines', 'compass needle', 'night intersection'] },
  { id: 'repair_lamp_workshop', no: 5, name: '継火の修理工房', phase: 'core5', leadCharacterIds: ['tomori'], coreQuestion: '直した跡から漏れる夜を、もう一度灯せるか。', storySeed: '机の上に切れた灯芯と黒インクの小瓶が並ぶ。', backgroundMotifs: ['修理ランプ', '道具袋', '灯芯', '継ぎ目'], enemyAffinity: ['ombu_small_dew', 'ombu_small_match', 'ombu_small_thread', 'omburo_repair_seam'], itemSeeds: ['切れた灯芯', '黒インクの小瓶', '白い余白'], stageMechanicSeed: '設置・持続・再点火の導入候補。', colorScript: ['repair orange', 'tool brass', 'ink black'], assetKeywords: ['repair lamp workshop', 'stitched light', 'tool bag', 'small sparks'] },
  { id: 'chalk_classroom', no: 6, name: '白線の教室', phase: 'season_seed', leadCharacterIds: ['sen'], coreQuestion: '消された答えではなく、進む線を見つけられるか。', storySeed: '黒板の白線が床まで伸びて、道のように見える。', backgroundMotifs: ['黒板', 'チョーク粉', '机の影', '白線'], enemyAffinity: ['ombu_small_chalk', 'omburo_chalkboard'], itemSeeds: ['消された一文', 'チョークの線', '小さな黒板消し'], stageMechanicSeed: 'レーン攻撃と安全線の候補。', colorScript: ['green blackboard', 'chalk white', 'dust gray'], assetKeywords: ['chalk classroom', 'blackboard dust', 'white guide lines', 'empty desks'] },
  { id: 'half_candy_arcade', no: 7, name: '半分の駄菓子横丁', phase: 'season_seed', leadCharacterIds: ['ritsu'], coreQuestion: '分けた半分は、なくなったのではなく残したものか。', storySeed: '包み紙の端だけが灯り、半分の飴が夜に沈む。', backgroundMotifs: ['駄菓子屋', '包み紙', '半分の飴', '古い看板'], enemyAffinity: ['ombu_small_bell', 'ombu_small_match'], itemSeeds: ['半分の飴', '半分の包み紙', '残った片割れ'], stageMechanicSeed: '分裂弾・分配報酬候補。', colorScript: ['candy orange', 'wrapper cream', 'soft red'], assetKeywords: ['old candy alley', 'split candy wrapper', 'warm shop sign', 'memory snack'] },
  { id: 'paper_cord_playground', no: 8, name: '紙縒りの遊び場', phase: 'season_seed', leadCharacterIds: ['koyori'], coreQuestion: '呼び名は、小さくても誰かをつなげるか。', storySeed: '小さな名札が遊具に結ばれて、風で揺れている。', backgroundMotifs: ['紙縒り', '小さな名札', '遊具', '補助灯'], enemyAffinity: ['ombu_small_name', 'ombu_small_ribbon'], itemSeeds: ['書きかけの名前', '小さな名札', '呼び名の紙縒り'], stageMechanicSeed: '補助灯・召喚系候補。', colorScript: ['tiny amber', 'paper beige', 'soft lilac'], assetKeywords: ['paper cord playground', 'small name tags', 'tiny helper lights', 'soft lilac night'] },
  { id: 'old_compass_station', no: 9, name: '古針の駅前', phase: 'season_seed', leadCharacterIds: ['gen'], coreQuestion: '古い針が北を指さなくても、帰り道になるか。', storySeed: '駅前時計は止まり、コンパスだけが人の気配を示す。', backgroundMotifs: ['古い駅', 'コンパス', '錆びた針', '駅灯'], enemyAffinity: ['ombu_small_owl', 'omburo_compass'], itemSeeds: ['古いコンパス', '駅前の道火', '錆びた針箱'], stageMechanicSeed: '低速高耐久・安全地帯候補。', colorScript: ['old brass', 'station amber', 'rust brown'], assetKeywords: ['old compass station', 'rust needle', 'station lamp', 'quiet platform'] },
  { id: 'pressed_flower_archive', no: 10, name: '押花の保管庫', phase: 'season_seed', leadCharacterIds: ['hana'], coreQuestion: '枯れたものは、まだ残っていると言えるか。', storySeed: '本の間に押し花があり、花脈だけが朝の色に光る。', backgroundMotifs: ['押し花', '本棚', '薄い花脈', '透明な保管箱'], enemyAffinity: ['ombu_small_flower', 'ombu_small_photo'], itemSeeds: ['乾いた花びら', '押し花のしおり', '箱底の花'], stageMechanicSeed: '鈍足・持続ダメージ・保存罠候補。', colorScript: ['pressed flower pink', 'pale aqua', 'paper cream'], assetKeywords: ['pressed flower archive', 'transparent boxes', 'flower veins', 'soft aqua light'] },
  { id: 'unposted_post_office', no: 11, name: '未配達の郵便局', phase: 'season_seed', leadCharacterIds: ['yubi'], coreQuestion: '届かなかった返事にも、届く前の意味はあるか。', storySeed: '封筒が仕分け棚に残り、消印だけが黒くつぶれている。', backgroundMotifs: ['封筒', '消印', '仕分け棚', '赤い郵便灯'], enemyAffinity: ['ombu_small_envelope', 'ombu_small_stamp'], itemSeeds: ['未配達の封筒', '古い消印', '開かない返信'], stageMechanicSeed: '遅延攻撃・時間差着弾候補。', colorScript: ['post paper', 'stamp red', 'road amber'], assetKeywords: ['unposted post office', 'sealed envelopes', 'postmark shelves', 'delayed amber trail'] },
  { id: 'paper_plane_window', no: 12, name: '窓際の紙翼', phase: 'season_seed', leadCharacterIds: ['madoka'], coreQuestion: '見ていただけの時間にも、意味は残るか。', storySeed: '窓枠の外を紙飛行機が横切り、光だけが遅れて入る。', backgroundMotifs: ['窓枠', '紙飛行機', '薄いカーテン', '遠い街灯'], enemyAffinity: ['ombu_small_window', 'ombu_small_lens'], itemSeeds: ['窓際の紙飛行機', '曇った窓紙', '見ていた切れ端'], stageMechanicSeed: '索敵・可視化・先制候補。', colorScript: ['window blue', 'paper white', 'soft yellow'], assetKeywords: ['window paper wing', 'paper airplane', 'soft curtain', 'watching light'] },
  { id: 'white_bookmark_library', no: 13, name: '白栞の未分類棚', phase: 'season_seed', leadCharacterIds: ['shiro'], coreQuestion: '読めない頁を、捨てずにしまえるか。', storySeed: '未分類の本だけが集まる棚で、白いしおりが光る。', backgroundMotifs: ['白いしおり', '未分類の頁', '図書棚', '余白'], enemyAffinity: ['ombu_small_moth', 'ombu_small_blank'], itemSeeds: ['白いしおり', '未分類の頁', '読めない一頁'], stageMechanicSeed: '図鑑・変換・長期報酬候補。', colorScript: ['white paper', 'pale gold', 'library gray'], assetKeywords: ['white bookmark library', 'blank margins', 'unclassified shelves', 'pale page glow'] },
  { id: 'ticket_gate_station', no: 14, name: '片道ではない改札', phase: 'season_seed', leadCharacterIds: ['tobari'], coreQuestion: '境目は、止めるためか通すためか。', storySeed: '改札の切符穴が反対側からも光る。', backgroundMotifs: ['改札', '切符穴', '駅の境目', '横線の駅灯'], enemyAffinity: ['ombu_small_ticket', 'ombu_small_dog', 'omburo_ticket_gate'], itemSeeds: ['改札ばさみ', '古い切符', '片道ではない切符'], stageMechanicSeed: '通す/止める二面性候補。', colorScript: ['ticket beige', 'station green', 'gate amber'], assetKeywords: ['ticket gate station', 'ticket punch holes', 'station amber lines', 'old gate'] },
  { id: 'dream_waterway', no: 15, name: '夢頁の水路', phase: 'season_seed', leadCharacterIds: ['nemu'], coreQuestion: '夢で見た道は、朝にも残るか。', storySeed: '日記の頁が水面になり、文字が波として揺れる。', backgroundMotifs: ['夢日記', '水面', '眠り頁', '青紫の波'], enemyAffinity: ['ombu_small_sheep', 'ombu_small_blue', 'omburo_dream_wave'], itemSeeds: ['夢日記', '眠り頁', '夢で見た地図'], stageMechanicSeed: 'ランダム高振れ・書き換え候補。', colorScript: ['dream violet', 'water blue', 'paper cream'], assetKeywords: ['dream diary waterway', 'violet ripples', 'floating pages', 'sleepy reflections'] },
  { id: 'black_origami_roof', no: 16, name: '黒折り紙の屋根', phase: 'shadow_seed', leadCharacterIds: ['kuroori', 'kage1'], coreQuestion: '折りたたんだ影は、隠したものか守ったものか。', storySeed: '屋根の上に黒い折り紙が並び、折り目だけが光る。', backgroundMotifs: ['黒い折り紙', '屋根', '折り目', '紫黒の空'], enemyAffinity: ['ombu_small_crow', 'ombu_small_wolf', 'omburo_black_origami'], itemSeeds: ['黒い折り紙', '四つ折りの影', '開かない折り目'], stageMechanicSeed: '変形・近接リスク・黒耀化導線。', colorScript: ['ink black', 'deep purple', 'paper gray'], assetKeywords: ['black origami roof', 'fold line sky', 'purple black night', 'sharp paper shadows'] },
  { id: 'erased_name_wall', no: 17, name: '消し跡の壁', phase: 'shadow_seed', leadCharacterIds: ['kage2'], coreQuestion: '消した名前は、本当に消えたのか。', storySeed: '白い粉が壁に残り、一文字だけが消えずに浮く。', backgroundMotifs: ['消しゴム粉', '白い壁', '薄れ名', '一文字の余白'], enemyAffinity: ['ombu_small_eraser', 'ombu_small_gecko'], itemSeeds: ['消しゴムのかけら', '薄れ名', '消せない一文字'], stageMechanicSeed: '弱体化・デバフ・視界薄れ候補。', colorScript: ['eraser white', 'dust gray', 'ink black'], assetKeywords: ['erased name wall', 'white dust', 'one blank letter space', 'monochrome memory'] },
  { id: 'ruler_rooftop', no: 18, name: '夜測りの屋上', phase: 'shadow_seed', leadCharacterIds: ['kage3'], coreQuestion: '測れない夜を、どの角度で切り開くか。', storySeed: '屋上の床に斜めの定規線が走り、星が目盛りになる。', backgroundMotifs: ['夜読みの定規', '斜めの光', '屋上', '角度線'], enemyAffinity: ['ombu_small_ruler', 'ombu_small_bat'], itemSeeds: ['夜読みの定規', '角度の火', '割れた角度線'], stageMechanicSeed: '角度クリティカル・方向制御候補。', colorScript: ['ruler blue', 'night navy', 'cold white'], assetKeywords: ['ruler rooftop', 'diagonal angle lines', 'cold blue light', 'technical stage'] },
  { id: 'blank_card_room', no: 19, name: '余白の部屋', phase: 'shadow_seed', leadCharacterIds: ['kage4'], coreQuestion: '何も書かれていない場所は、終わりか始まりか。', storySeed: '中央だけ空いたカードが壁一面にあり、外周だけが灯る。', backgroundMotifs: ['空白カード', '黒い余白', '継ぎ目', '静かな金線'], enemyAffinity: ['ombu_small_blank', 'ombu_small_rabbit', 'omburo_blank_card'], itemSeeds: ['空白のカード', '余白の継ぎ目', '黒い余白'], stageMechanicSeed: '終盤成長・選択記録候補。', colorScript: ['blank white', 'ink black', 'quiet gold'], assetKeywords: ['blank card room', 'negative space wall', 'quiet gold rim', 'secret card'] },
  { id: 'dawn_return_square', no: 20, name: '夜明け前の広場', phase: 'future_seed', leadCharacterIds: ['yui', 'asa', 'nagi', 'michiru', 'tomori'], coreQuestion: 'すべての空白を埋めなくても、朝へ進めるか。', storySeed: '5人の灯紋が広場の石畳に薄く重なる。', backgroundMotifs: ['広場', '朝焼け前', '5つの灯紋', '石畳', '紙片の風'], enemyAffinity: ['boss_name_without_owner', 'boss_closed_morning_box', 'boss_night_without_route'], itemSeeds: ['記憶片', '朝露', '灯紋具'], stageMechanicSeed: 'Core5締めの総合ステージ候補。', colorScript: ['pre-dawn blue', 'warm amber', 'soft gold'], assetKeywords: ['pre dawn square', 'five emblems', 'stone pavement', 'paper wind'] },
];

const STAGE_NEGATIVE_PROMPT = 'no text, no letters, no numbers, no logo, no watermark, no UI mock labels, no photorealism, no horror gore, no cluttered unreadable background';

function buildStagePrompt(stage: StageProductionEntry, kind: StageAssetPromptKind): StageAssetPrompt {
  const sizeSpecByKind: Record<StageAssetPromptKind, string> = {
    background_390x844: '390x844 PNG concept source, vertical mobile background, no UI text, readable play area, dark but clear.',
    parallax_layer_pack: 'Layered background plan for 390x844 vertical mobile scene, separate foreground/midground/background notes, no baked UI.',
    stage_thumbnail: '512x512 PNG stage thumbnail source, centered readable motif, no text, no logo.',
    battle_tile_patch: '1024x1024 seamless-ish paper/night tile patch source, no text, no hard grid, readable under gameplay effects.',
  };
  return {
    stageId: stage.id,
    stageName: stage.name,
    kind,
    title: `${stage.name} ${kind}`,
    outputPathHint: `public/assets/prototypes/stages/${stage.id}/${stage.id}-${kind}-v1.png`,
    sizeSpec: sizeSpecByKind[kind],
    prompt: [
      'Vamp Pon stage asset, vertical mobile survival roguelite background, paper storybook pixel-art flavor, night memory mood, clear gameplay readability.',
      `Stage: ${stage.name} (${stage.id}).`,
      `Phase: ${stage.phase}. Leads: ${stage.leadCharacterIds.join(', ')}.`,
      `Core question: ${stage.coreQuestion}.`,
      `Story seed: ${stage.storySeed}.`,
      `Motifs: ${stage.backgroundMotifs.join(', ')}.`,
      `Enemy affinity: ${stage.enemyAffinity.join(', ')}. Item seeds: ${stage.itemSeeds.join(', ')}.`,
      `Mechanic seed: ${stage.stageMechanicSeed}.`,
      `Color script: ${stage.colorScript.join(', ')}.`,
      `Keywords: ${stage.assetKeywords.join(', ')}.`,
      `Output spec: ${sizeSpecByKind[kind]}`,
    ].join('\n'),
    negativePrompt: STAGE_NEGATIVE_PROMPT,
    reviewChecklist: [
      '390x844でプレイヤー・敵・記憶片が読める余白がある',
      '背景が綺麗でもゲームプレイの邪魔をしない',
      'ステージ固有モチーフが1秒で伝わる',
      '文字・ロゴ・UIを背景へ焼いていない',
      '黒インクと小さな光の階層が保たれている',
    ],
  };
}

export const stageAssetPrompts: StageAssetPrompt[] = stageProductionEntries.flatMap((stage) => STAGE_ASSET_PROMPT_KINDS.map((kind) => buildStagePrompt(stage, kind)));
export const stageById = new Map(stageProductionEntries.map((stage) => [stage.id, stage]));
export const stageAssetPromptByKey = new Map(stageAssetPrompts.map((prompt) => [`${prompt.stageId}:${prompt.kind}`, prompt]));

export function getStageAssetPrompt(stageId: string, kind: StageAssetPromptKind): StageAssetPrompt | undefined {
  return stageAssetPromptByKey.get(`${stageId}:${kind}`);
}

export const stageProductionSummary = {
  total: stageProductionEntries.length,
  core5: stageProductionEntries.filter((stage) => stage.phase === 'core5').length,
  seed: stageProductionEntries.filter((stage) => stage.phase !== 'core5').length,
  promptCount: stageAssetPrompts.length,
} as const;
