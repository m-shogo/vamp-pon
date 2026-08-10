import { characterCommercialIdentities } from './characterCommercialIdentity.ts';
import { toumonSigilById } from './toumonSimpleSigilCanon.ts';

export type CommercialPatternFamily =
  | 'ROUTE'
  | 'TOUMON_FRAGMENT'
  | 'OBJECT_TRACE'
  | 'STAR_BEAST_TRACE'
  | 'DAWN';

export type CommercialProductionProfile = {
  characterId: string;
  displayName: string;
  scope: 'current20' | 'official_reserve';
  launchEligible: boolean;
  oneColorSymbol: {
    authority: 'TOUMON';
    sigilName: string;
    singleInkTarget: true;
    masterVectorStatus: 'NOT_YET_DRAWN';
  };
  repeatPattern: {
    primary: CommercialPatternFamily;
    secondary: CommercialPatternFamily;
    rule: string;
  };
  plushReadability: {
    starBeast: string;
    target: 'HIGH' | 'MEDIUM';
    recognitionHook: string;
    posePriority: string[];
    avoid: string[];
  };
  embroiderySafe: {
    target: true;
    productionApproved: false;
    rule: string;
  };
  smallScaleReadability: {
    targetPx: 16;
    productionApproved: false;
    rule: string;
  };
  namedObjectReplica: {
    objectName: string;
    entryForm: string;
    collectorForm: string;
    premiumReplicaCandidate: string;
    spoilerRule: string;
  };
  pairGoodsPartnerIds: string[];
  pairGoodsGrammar: string;
  displayGoodsHook: string;
  carryGoodsHook: string;
  seasonalVariantRules: {
    mutable: string[];
    immutable: string[];
    characterAccent: string;
  };
  commercialNoGo: string[];
  productionArtworkReady: false;
  realSkuApproved: false;
};

type ProfileSeed = {
  characterId: string;
  repeatPattern: CommercialProductionProfile['repeatPattern'];
  starBeastRecognitionHook: string;
  pairGoodsPartnerIds: string[];
  pairGoodsGrammar: string;
  displayGoodsHook: string;
  carryGoodsHook: string;
  seasonalAccent: string;
  namedObjectEntryForm: string;
  namedObjectCollectorForm: string;
  replicaSpoilerRule: string;
  plushTarget?: 'HIGH' | 'MEDIUM';
  posePriority?: string[];
  plushAvoid?: string[];
  extraCommercialNoGo?: string[];
};

const COMMON_SEASONAL_IMMUTABLE = [
  'Toumon master geometry',
  'Character body identity',
  'relationship type',
  'Named Object ownership/truth',
  'Star Beast species/identity',
];

const COMMON_SEASONAL_MUTABLE = [
  'material',
  'background',
  'Theme HEX balance',
  'season scene',
  'packaging',
  'Star Beast pose',
  'ribbon/tag',
];

const COMMON_EMBROIDERY_RULE =
  'Toumonは単色・均一線幅を基本とし、刺繍都合で線を増やさない。最終vector master承認後に実刺繍sampleで潰れ/橋渡しを確認する。';
const COMMON_SMALL_SCALE_RULE =
  '16pxでCharacter間の識別が残ること。装飾追加で解決せず、主線・gap・nodeの差で読む。最終vector masterまではproduction approvalしない。';
const DEFAULT_POSES = ['rest', 'sleep', 'character-linked small action'];
const DEFAULT_PLUSH_AVOID = ['Character本人のミニ人形化', '武器/職業costumeの常設', 'species silhouetteを崩す装飾'];

const seeds: ProfileSeed[] = [
  {
    characterId: 'yui',
    repeatPattern: { primary: 'ROUTE', secondary: 'TOUMON_FRAGMENT', rule: 'return hookとopen endを疎に置き、ランタン絵の総柄へ戻さない。' },
    starBeastRecognitionHook: '子獅子の小さな体格と短い鬣。トモリ側の若獅子より一段幼いsilhouetteを維持する。',
    pairGoodsPartnerIds: ['asa', 'kuroori', 'tomori'], pairGoodsGrammar: 'open endを相手へ向けるが接続し切らず、return/name/hold/repairの差を残す。',
    displayGoodsHook: '夜の駅ホーム端の「返却待ち」slot。ランタンminiature・灯紋pin・route ticketを同じ場所へ置ける。',
    carryGoodsHook: 'return-tag strap + small lantern pocket。顔なしでもユイへ戻れる携帯導線。',
    seasonalAccent: '#264A86を残し、季節感は夜→朝の明度差と素材で足す。',
    namedObjectEntryForm: 'ランタン輪郭metal charm / paper tag', namedObjectCollectorForm: '小型ランタンminiature + return-tag',
    replicaSpoilerRule: '未確定lineageや真の持ち主を刻印・商品説明で確定しない。',
  },
  {
    characterId: 'asa',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'DAWN', rule: '切り線・結び目・余白を使い、名札そのものを敷き詰めない。' },
    starBeastRecognitionHook: '若い雄羊の小ぶりな角と前向きの頭位置。巨大巻角やbattle ram化を避ける。',
    pairGoodsPartnerIds: ['yui', 'kage2'], pairGoodsGrammar: '交差しても接触しない線を維持し、相手のname/visibilityを奪わないgapを残す。',
    displayGoodsHook: 'name-tag rail。cardを差し替えられ、固定名ではなく本人が選んだ表示を主役にする。',
    carryGoodsHook: 'tag wallet / mini letter case。書く・渡す・しまうの3動作を一つにする。',
    seasonalAccent: '#F4A7B9は紙端・糸・小面積へ。全面pink化しない。',
    namedObjectEntryForm: '小鋏silhouette charm / tag card', namedObjectCollectorForm: 'letter-opening accessory style miniature',
    replicaSpoilerRule: '名前の公開範囲や誰の名を扱ったかを商品側で新規Canon化しない。',
  },
  {
    characterId: 'nagi',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'ROUTE', rule: '鍵穴・箱の継ぎ目・open gateを使い、月や鍵の絵だけへ縮退しない。' },
    starBeastRecognitionHook: '小さな蟹の低い横幅と小さな鋏。守備tankや巨大甲羅の記号にしない。',
    pairGoodsPartnerIds: ['kage1', 'tobari'], pairGoodsGrammar: '守る方向を分担し、囲い切らず必ずexit gapを一つ残す。',
    displayGoodsHook: 'openable archive shelf。箱を閉じた展示と少し開けた展示の両方を完成形として扱う。',
    carryGoodsHook: 'key sleeve + small box pouch。鍵を支配ではなく預かりの記号として持つ。',
    seasonalAccent: '#7B90D2を境界線へ残し、季節背景よりopen/closedの読みを優先する。',
    namedObjectEntryForm: '銀鍵metal charm', namedObjectCollectorForm: '月箱 + 銀鍵 keepsake miniature',
    replicaSpoilerRule: '箱の中身や開けるべき人物を商品説明で確定しない。',
  },
  {
    characterId: 'michiru',
    repeatPattern: { primary: 'ROUTE', secondary: 'DAWN', rule: '帰路lineとopen nodeを中心にし、装飾的compass rose柄へしない。' },
    starBeastRecognitionHook: '小熊の丸い耳・短い手足・探索する前傾姿勢。大熊のゲン側とsize/readを分ける。',
    pairGoodsPartnerIds: ['kage3', 'gen'], pairGoodsGrammar: 'routeとmeasure/old routeを重ねても、最後のnodeは二択以上に開く。',
    displayGoodsHook: 'folding route-map stand。ticket・compass・灯紋を別layerで並べる。',
    carryGoodsHook: 'map-fold pocket + compass tag。実用方位磁針を必須機能にしない。',
    seasonalAccent: '#2E5C6Eをroute lineへ残し、季節色はnode周辺へ限定する。',
    namedObjectEntryForm: 'compass-ring charm / route card', namedObjectCollectorForm: '帰り針のコンパス desk miniature',
    replicaSpoilerRule: '唯一の正しい方向を示す魔法道具として固定しない。',
  },
  {
    characterId: 'tomori',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'TOUMON_FRAGMENT', rule: '縫い目・修理跡・煤点を疎に使い、新品工具patternへしない。' },
    starBeastRecognitionHook: '少し煤けた若獅子。ユイの子獅子より胴と鬣を一段成熟させ、同じLeoでも別個体と読む。',
    pairGoodsPartnerIds: ['kage4', 'yui'], pairGoodsGrammar: '切れ線を隠さず、一つのstitchだけ共有して「直した跡」を残す。',
    displayGoodsHook: 'repair bench tray。傷ありminiatureを未完成扱いせず、修理痕ごと展示する。',
    carryGoodsHook: 'tool-tag pouch / seam strap。使い込みを汚れギャグにしない。',
    seasonalAccent: '#8F2E14を火だけでなく修理痕にも使い、炎Character一辺倒にしない。',
    namedObjectEntryForm: 'repair-tag / stitched metal charm', namedObjectCollectorForm: '修理ランプminiature + tool-set box',
    replicaSpoilerRule: '修理前の所有履歴や未確定lineageを新規に刻まない。',
  },
  {
    characterId: 'sen',
    repeatPattern: { primary: 'ROUTE', secondary: 'OBJECT_TRACE', rule: 'branch line / chalk traceを使い、黒板や教師iconの反復にしない。' },
    starBeastRecognitionHook: '小烏の小さな嘴と首傾げ。賢者帽や不吉記号を追加しない。',
    pairGoodsPartnerIds: ['koyori', 'shiro'], pairGoodsGrammar: 'branchの一枝を相手へ渡し、中央に「未回答」gapを残す。',
    displayGoodsHook: 'branching white-line board。cardをランキング一列ではなく枝分かれで置く。',
    carryGoodsHook: 'chalk-light pen sleeve + question-tag。文具として自然に使える。',
    seasonalAccent: '#6E7955を白線の補色として少量使い、学校色テンプレにしない。',
    namedObjectEntryForm: 'chalk-line bookmark / slim charm', namedObjectCollectorForm: '白線のチョーク灯 desk object',
    replicaSpoilerRule: '問いに公式正解を書き込んだ商品へしない。',
  },
  {
    characterId: 'ritsu',
    repeatPattern: { primary: 'TOUMON_FRAGMENT', secondary: 'STAR_BEAST_TRACE', rule: '左右の間隔と大きい猟犬の足跡rhythmを使い、兄妹の顔patternにしない。' },
    starBeastRecognitionHook: '二頭のうち大きい猟犬。脚と胸郭をコヨリ側より一段大きくし、狼化しない。',
    pairGoodsPartnerIds: ['koyori', 'kage1'], pairGoodsGrammar: '左右が同じ形へ融合せず、shared spacingだけを揃える。兄妹はromance文法禁止。',
    displayGoodsHook: 'two-slot half-light stand。片方を空けても成立し、欠品表現にしない。',
    carryGoodsHook: 'split pocket case。二つの小物を分けて持てるが保護者専用品にしない。',
    seasonalAccent: '#D75455は包み紙edgeへ。兄=赤い強者の記号へ固定しない。',
    namedObjectEntryForm: 'half-tin charm / wrapper card', namedObjectCollectorForm: '半灯りの飴缶 collector tin',
    replicaSpoilerRule: '飴や食欲をCharacter中心ネタにせず、分ける行為を中心にする。',
  },
  {
    characterId: 'koyori',
    repeatPattern: { primary: 'TOUMON_FRAGMENT', secondary: 'OBJECT_TRACE', rule: '細いpaper twistと小さなgapを使い、幼児向け総柄へ寄せない。' },
    starBeastRecognitionHook: '二頭のうち小さい猟犬。小柄でも子犬固定にせず、リツ側の付属品にしない。',
    pairGoodsPartnerIds: ['ritsu', 'sen'], pairGoodsGrammar: '細い線を結び切らずshared nodeだけで助ける側にも回れることを残す。',
    displayGoodsHook: 'small-helper rail。小物を主役cardの下ではなく同じ高さへ置く。',
    carryGoodsHook: 'name-string strap / mini organizer。小型でも実用品として扱う。',
    seasonalAccent: '#F7C8D0は細線のみ。幼児pink商品へ寄せない。',
    namedObjectEntryForm: 'paper-twist charm / name tag', namedObjectCollectorForm: '呼び名の紙縒り札 multi-charm set',
    replicaSpoilerRule: '呼び名を一つに固定する商品設計へしない。',
  },
  {
    characterId: 'gen',
    repeatPattern: { primary: 'ROUTE', secondary: 'OBJECT_TRACE', rule: '古いroute tick・錆跡・open Uを使い、アンティーク装飾を盛りすぎない。' },
    starBeastRecognitionHook: '大熊の大きな手と安定した重心。年長=眠い/遅いという記号へ結ばない。',
    pairGoodsPartnerIds: ['michiru', 'kage3'], pairGoodsGrammar: 'old/new routeの線齢差を残し、片方を正解として太くしない。',
    displayGoodsHook: 'weathered station shelf。新旧routeを横並びで比較できる。',
    carryGoodsHook: 'map notebook cover / brass-like tag。年長男性=渋色一択にしない。',
    seasonalAccent: '#867835を金属だけでなく紙端にも使い、老人色へ固定しない。',
    namedObjectEntryForm: 'old-route pin / compass needle charm', namedObjectCollectorForm: '古針の駅灯 / 古いコンパス desk replica',
    replicaSpoilerRule: '古い道が唯一正しいという商品copyを付けない。',
  },
  {
    characterId: 'hana',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'STAR_BEAST_TRACE', rule: '花脈・布目・白鳥の水面跡を使い、花柄だけ/体型記号へしない。' },
    starBeastRecognitionHook: 'ふっくらした白鳥の丸い胸・滑らかな首・落ち着いた姿。丸さを笑い/fetishへ使わない。',
    pairGoodsPartnerIds: ['kage4', 'shiro'], pairGoodsGrammar: '保存側のcurveが相手を囲い切らず、shared gapを「残す場所」として見せる。',
    displayGoodsHook: 'archive tray + soft-cloth backing。保管作業の場として見せる。',
    carryGoodsHook: 'flower-vein pouch / shawl-pattern inner pocket。容量を体型ネタへ使わない。',
    seasonalAccent: '#B5495Bを花脈/布縁へ。春=花だけのCharacterへ固定しない。',
    namedObjectEntryForm: 'pressed-flower bookmark / flower-vein charm', namedObjectCollectorForm: '花脈の保管箱 + pressed-flower collector set',
    replicaSpoilerRule: '保存物の中身を商品で勝手に決めず、空の余白も価値として残す。',
    extraCommercialNoGo: ['body sizeをpattern密度や線幅へ変換しない', 'Happy End/季節版で若返り・細身化しない'],
  },
  {
    characterId: 'yubi',
    repeatPattern: { primary: 'ROUTE', secondary: 'OBJECT_TRACE', rule: '配達路・未接続stamp・封edgeを使い、封筒icon総柄にしない。' },
    starBeastRecognitionHook: '小鳩の丸い胸と短い歩幅。郵便帽/手紙を常設せずspeciesで読む。',
    pairGoodsPartnerIds: ['tobari', 'kage2', 'kuroori'], pairGoodsGrammar: 'lineが相手のgap直前で止まり、「今は渡さない」状態も完成形にする。',
    displayGoodsHook: 'pending-mail rack。届いた/未配達/返事待ちを上下関係なく並べる。',
    carryGoodsHook: 'ticket-letter case / stamp tag。実在郵便logoへ近づけない。',
    seasonalAccent: '#C1693Cを消印/route nodeへ。秋限定色に固定しない。',
    namedObjectEntryForm: 'postmark card / postal-light charm', namedObjectCollectorForm: '返事待ちの郵便灯 + 未配達封筒 collector set',
    replicaSpoilerRule: '封筒本文・返事内容・相手を商品説明で確定しない。',
  },
  {
    characterId: 'madoka',
    repeatPattern: { primary: 'ROUTE', secondary: 'DAWN', rule: '遠点・窓端・焦点外lineを使い、紙飛行機反復だけにしない。' },
    starBeastRecognitionHook: '小鷲の短めの翼と見上げる姿。猛禽の威圧や軍章化を避ける。',
    pairGoodsPartnerIds: ['ren', 'nemu'], pairGoodsGrammar: '二つの焦点を同一中心へ揃えず、周辺視野の余白を保持する。',
    displayGoodsHook: 'layered window stand。前景/遠景の二層へcardを置き、差分を見る。',
    carryGoodsHook: 'transparent card sleeve / lens tag。透明素材でも可読性を犠牲にしない。',
    seasonalAccent: '#89C3EBを窓辺の細光へ。夏空だけのCharacterにしない。',
    namedObjectEntryForm: 'lens sticker/charm + window card', namedObjectCollectorForm: '見送り窓の観測レンズ optical object',
    replicaSpoilerRule: 'レンズを真実を見抜く魔法道具として売らない。',
  },
  {
    characterId: 'shiro',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'TOUMON_FRAGMENT', rule: '余白・頁端・栞跡を使い、本/眼鏡iconを全面反復しない。' },
    starBeastRecognitionHook: '山猫の耳先と体輪郭を優先し、丸眼鏡を星獣へ移植しない。',
    pairGoodsPartnerIds: ['hana', 'sen', 'kage4'], pairGoodsGrammar: 'parallel marginの外側に相手の線を置き、分類外を一枠残す。',
    displayGoodsHook: 'unclassified page board。空白slotを未所持ではなく正当な余白として残す。',
    carryGoodsHook: 'bookmark sleeve / index pouch。丸眼鏡だけをCharacter logoにしない。',
    seasonalAccent: '#E3E5E8は背景へ同化させず濃紺outlineとセットで使う。',
    namedObjectEntryForm: 'bookmark/page-edge goods', namedObjectCollectorForm: '白栞/未分類頁 archival sleeve set',
    replicaSpoilerRule: '未分類の内容を商品側で分類済みにしない。',
  },
  {
    characterId: 'tobari',
    repeatPattern: { primary: 'ROUTE', secondary: 'OBJECT_TRACE', rule: '往復穴・gate line・return routeを使い、実在鉄道柄へ寄せない。' },
    starBeastRecognitionHook: '大きな番犬の胸・耳・落ち着いた正面姿。威嚇顔をdefaultにしない。',
    pairGoodsPartnerIds: ['yubi', 'nagi'], pairGoodsGrammar: '片道で閉じず、必ずreturn gapを相手側にも残す。',
    displayGoodsHook: 'night platform gate display。ticketを「入場」と「帰路」両側へ差せる。',
    carryGoodsHook: 'pass case / round-trip ticket holder。交通会社公式品と誤認する意匠を避ける。',
    seasonalAccent: '#56564Bをgate金属/布へ。無彩色だけで地味役にしない。',
    namedObjectEntryForm: 'punch-hole ticket / gate charm', namedObjectCollectorForm: '往復穴の改札鋏 replica + ticket collector box',
    replicaSpoilerRule: '実在交通会社の券面・鋏形状を近似しすぎない。',
  },
  {
    characterId: 'nemu',
    repeatPattern: { primary: 'DAWN', secondary: 'STAR_BEAST_TRACE', rule: '水面波・sleep arc・イルカ軌跡を使い、月/枕のsleep icon柄へ寄せない。' },
    starBeastRecognitionHook: '小イルカの短い吻・丸い背・小さな背びれ。水背景なしでもsilhouetteで読む。',
    pairGoodsPartnerIds: ['kage3', 'madoka'], pairGoodsGrammar: '波の位相差を残し、夢/測定/観測を一つの正解へ合流させない。',
    displayGoodsHook: 'translucent water-page stand。重ねても一部が隠れることを意味として残す。',
    carryGoodsHook: 'dream diary cover / translucent mini pouch。sleepwear商品だけへ閉じない。',
    seasonalAccent: '#B4A5D4を水面反射へ。季節ごとに人格を固定しない。',
    namedObjectEntryForm: 'ripple bookmark / translucent page card', namedObjectCollectorForm: '夢頁の水面日記 special-bound notebook',
    replicaSpoilerRule: '夢の内容を未来予知の確定Canonとして印刷しない。',
  },
  {
    characterId: 'kuroori',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'TOUMON_FRAGMENT', rule: '折り目・黒紙edge・open foldを使い、悪役紋を混ぜない。' },
    starBeastRecognitionHook: '黒紙のカメレオン。身体輪郭より折れた面と尾curveで読み、黒一色潰れを避ける。',
    pairGoodsPartnerIds: ['yui', 'yubi'], pairGoodsGrammar: '相手のopen endを塞がず、一時的なshared hold nodeだけを置く。',
    displayGoodsHook: 'sealed archive slot。開封展示を上位状態にせず、閉じたままでも完成。',
    carryGoodsHook: 'folding document case / black-paper tag。秘密持ちギャグ商品にしない。',
    seasonalAccent: '#1C1C1Cは素材差/空押しで読み、季節色は外側へ足す。',
    namedObjectEntryForm: 'fold-line black card / seal charm', namedObjectCollectorForm: '黒折りseal + folding case collector object',
    replicaSpoilerRule: '封じた記憶の中身を文字/透かしで漏らさない。',
    plushTarget: 'MEDIUM',
  },
  {
    characterId: 'kage1',
    repeatPattern: { primary: 'TOUMON_FRAGMENT', secondary: 'STAR_BEAST_TRACE', rule: 'intercept bracketと灰狼の歩線を使い、太線=大柄という短絡を禁止。' },
    starBeastRecognitionHook: '大きな灰狼の長い背・大きな足・落ち着いた耳。筋肉/牙ではなくsizeで読む。',
    pairGoodsPartnerIds: ['nagi', 'ritsu'], pairGoodsGrammar: 'intercept lineを分担し、カナメ一人が全て受ける形へ閉じない。',
    displayGoodsHook: 'protector handoff rail。前衛/後衛順位ではなく受け渡し位置を可変にする。',
    carryGoodsHook: 'arm-band inspired strap / protection cloth pouch。重量級商品名を使わない。',
    seasonalAccent: '#2B2B2Bを線幅ではなく面/素材差で使う。体型は不変。',
    namedObjectEntryForm: 'arm-band motif tag/charm', namedObjectCollectorForm: '受け灯の腕帯 wearable replica',
    replicaSpoilerRule: '装着物は複数サイズを公平に用意し、Character体型の冗談にしない。',
    extraCommercialNoGo: ['body sizeを線幅・商品容量・XXL記号へ変換しない', '季節/暁版で細身化・bodybuilder化しない'],
  },
  {
    characterId: 'kage2',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'DAWN', rule: '消し跡・薄層・戻せる痕跡を使い、狐顔patternや忍者記号へしない。' },
    starBeastRecognitionHook: '淡い小狐の細い耳・小さな尾。低contrastでも輪郭を消さない。',
    pairGoodsPartnerIds: ['asa', 'yubi'], pairGoodsGrammar: 'visibility layerをずらし、どちらかが相手を完全露出させない。',
    displayGoodsHook: 'reversible layer frame。表/裏どちらも正面として成立する。',
    carryGoodsHook: 'layered card sleeve / reversible tag。本人が選んだ非公開を尊重する。',
    seasonalAccent: '#787D7Bを痕跡の中間toneへ。季節で完全透明化しない。',
    namedObjectEntryForm: 'eraser-trace sticker / reversible card', namedObjectCollectorForm: '消し跡の白灯 reversible-light object',
    replicaSpoilerRule: '匿名/非公開を消滅や死亡表現へ変換しない。',
  },
  {
    characterId: 'kage3',
    repeatPattern: { primary: 'ROUTE', secondary: 'TOUMON_FRAGMENT', rule: '角度線・目盛・測定外gapを使い、数式patternや照準器へ寄せない。' },
    starBeastRecognitionHook: '細身の鶴の長脚・細首・小さな頭。細さを弱さ/神経質の記号にしない。',
    pairGoodsPartnerIds: ['michiru', 'nemu', 'gen', 'ren'], pairGoodsGrammar: 'shared tickを一つだけ置き、測定外を残すgapを必須とする。',
    displayGoodsHook: 'calibration board。複数route/objectを同一物差しで順位化しない。',
    carryGoodsHook: 'precision stationery sleeve / ruler tag。武器ケース風にしない。',
    seasonalAccent: '#2D2D48をtechnical lineへ。寒色=冷たい人格に結びつけない。',
    namedObjectEntryForm: 'ruler bookmark / angle charm', namedObjectCollectorForm: '星目盛りの夜定規 metal/acrylic collector ruler',
    replicaSpoilerRule: '目盛に未来/正解数値を刻まない。',
  },
  {
    characterId: 'kage4',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'TOUMON_FRAGMENT', rule: '糸・縫い目・unfinished edgeを使い、破れ/ボロ布美学だけにしない。' },
    starBeastRecognitionHook: '白灰の野兎の長耳・丸い腰・軽い跳躍。白背景でもoutlineを失わない。',
    pairGoodsPartnerIds: ['tomori', 'shiro', 'hana'], pairGoodsGrammar: 'one stitchだけ共有し、相手の傷/余白を覆い隠さない。',
    displayGoodsHook: 'unfinished-edge textile board。端を一部openのまま完成品として見せる。',
    carryGoodsHook: 'repair craft mini case / thread strap。実製品の縫製強度は安全基準を優先する。',
    seasonalAccent: '#F2F2EDは濃いedgeと併用し、白=幽霊表現へ寄せない。',
    namedObjectEntryForm: 'thread bookmark / seam charm', namedObjectCollectorForm: '余白を縫う糸巻き + repair craft collector set',
    replicaSpoilerRule: '完成=全部縫い閉じるにせず、最後の余白を残せる構造にする。',
  },
  {
    characterId: 'ren',
    repeatPattern: { primary: 'ROUTE', secondary: 'TOUMON_FRAGMENT', rule: '焦点差・parallel crescent・周辺nodeを使うが、Reserve専用premium patternとして先行販売しない。' },
    starBeastRecognitionHook: '小さな観察犬の耳・視線方向・小さな足。探偵帽/虫眼鏡を常設しない。',
    pairGoodsPartnerIds: ['madoka', 'kage3'], pairGoodsGrammar: '二焦点を完全一致させず、差分を確認するparallel gapを残す。',
    displayGoodsHook: 'observation side-slot candidate。Current20 displayの必須穴として扱わない。',
    carryGoodsHook: 'lens-tag candidate。Current20 trading lineへ自動封入しない。',
    seasonalAccent: '#A2D7DDはcandidate accent。seasonal releaseでReserve境界を迂回しない。',
    namedObjectEntryForm: 'focal-lens bookmark candidate', namedObjectCollectorForm: '片焦点のレンズ灯 optical collector candidate',
    replicaSpoilerRule: 'Reserveのためproduction launch不可。商品化をPlayable昇格根拠にしない。',
    extraCommercialNoGo: ['Current20 trading/blind lineへ自動混入しない', 'goods人気をPlayable/Canon昇格の根拠にしない'],
  },
];

const seedById = new Map(seeds.map((seed) => [seed.characterId, seed]));

export const commercialProductionProfiles: CommercialProductionProfile[] = characterCommercialIdentities.map((identity) => {
  const seed = seedById.get(identity.characterId);
  const toumon = toumonSigilById.get(identity.characterId);
  if (!seed) throw new Error(`Missing commercial production seed: ${identity.characterId}`);
  if (!toumon) throw new Error(`Missing Toumon authority for commercial production: ${identity.characterId}`);

  return {
    characterId: identity.characterId,
    displayName: identity.displayName,
    scope: identity.scope,
    launchEligible: identity.scope === 'current20',
    oneColorSymbol: {
      authority: 'TOUMON',
      sigilName: toumon.sigilName,
      singleInkTarget: true,
      masterVectorStatus: 'NOT_YET_DRAWN',
    },
    repeatPattern: seed.repeatPattern,
    plushReadability: {
      starBeast: identity.starBeast,
      target: seed.plushTarget ?? 'HIGH',
      recognitionHook: seed.starBeastRecognitionHook,
      posePriority: seed.posePriority ?? DEFAULT_POSES,
      avoid: seed.plushAvoid ?? DEFAULT_PLUSH_AVOID,
    },
    embroiderySafe: { target: true, productionApproved: false, rule: COMMON_EMBROIDERY_RULE },
    smallScaleReadability: { targetPx: 16, productionApproved: false, rule: COMMON_SMALL_SCALE_RULE },
    namedObjectReplica: {
      objectName: identity.namedObject,
      entryForm: seed.namedObjectEntryForm,
      collectorForm: seed.namedObjectCollectorForm,
      premiumReplicaCandidate: identity.premiumCandidate,
      spoilerRule: seed.replicaSpoilerRule,
    },
    pairGoodsPartnerIds: seed.pairGoodsPartnerIds,
    pairGoodsGrammar: seed.pairGoodsGrammar,
    displayGoodsHook: seed.displayGoodsHook,
    carryGoodsHook: seed.carryGoodsHook,
    seasonalVariantRules: {
      mutable: [...COMMON_SEASONAL_MUTABLE],
      immutable: [...COMMON_SEASONAL_IMMUTABLE],
      characterAccent: seed.seasonalAccent,
    },
    commercialNoGo: [...identity.commercialAvoid, ...(seed.extraCommercialNoGo ?? [])],
    productionArtworkReady: false,
    realSkuApproved: false,
  };
});

export const commercialProductionProfileById = new Map(
  commercialProductionProfiles.map((profile) => [profile.characterId, profile]),
);

export const COMMERCIAL_PRODUCTION_PROFILE_POLICY = {
  authority: 'CURRENT_COMMERCIAL_PRODUCTION_DIRECTION',
  expectedCount: 21,
  current20Count: 20,
  reserveIds: ['ren'],
  toumonVectorStatus: 'NOT_YET_DRAWN',
  imageGenerationRequired: false,
  realSkuApprovalDefault: false,
  productionArtworkReadyDefault: false,
  collectionHub: '夜の記録帳',
  ipPillars: ['character', 'toumon', 'star-beast', 'named-object', 'night-station-route', 'relationship-scene'],
  rule: 'Design merchandise expansion paths now; do not manufacture, launch, retcon, or generate final art by implication.',
} as const;
