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

type ProfileSeed = Omit<
  CommercialProductionProfile,
  | 'displayName'
  | 'scope'
  | 'launchEligible'
  | 'oneColorSymbol'
  | 'plushReadability'
  | 'namedObjectReplica'
  | 'commercialNoGo'
  | 'productionArtworkReady'
  | 'realSkuApproved'
> & {
  characterId: string;
  plushTarget: 'HIGH' | 'MEDIUM';
  starBeastRecognitionHook: string;
  starBeastPosePriority: string[];
  starBeastAvoid: string[];
  namedObjectEntryForm: string;
  namedObjectCollectorForm: string;
  replicaSpoilerRule: string;
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
  'Toumonは単色・均一線幅を基本とし、糸密度の都合で線を増やさない。最終vector master承認後に実刺繍sampleで潰れ/橋渡しを確認する。';
const COMMON_SMALL_SCALE_RULE =
  '16pxでCharacter間の識別が残ること。装飾追加で解決せず、主線・gap・nodeの差で読む。最終vector masterまではproduction approvalしない。';

const seeds: ProfileSeed[] = [
  {
    characterId: 'yui',
    repeatPattern: { primary: 'ROUTE', secondary: 'TOUMON_FRAGMENT', rule: 'return hookとopen endを疎に置き、ランタン絵の総柄へ戻さない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '子獅子らしい小さな体格と短い鬣の輪郭を最優先。主人公色を全身へ塗らずtagでCharacterへ戻す。',
    starBeastPosePriority: ['sit', 'sleep', 'small forward step'], starBeastAvoid: ['adult lion化', '王冠/勇者記号', 'ユイのミニ人形化'],
    namedObjectEntryForm: 'ランタン輪郭のmetal charm / paper tag', namedObjectCollectorForm: '小型miniature + return-tag', replicaSpoilerRule: '未確定lineageや真の持ち主を刻印・説明文で確定しない。',
    pairGoodsPartnerIds: ['asa', 'kuroori', 'tomori'], pairGoodsGrammar: 'open endを相手へ向けるが接続し切らない。return / name / hold / repairの違いを残す。',
    displayGoodsHook: '夜の駅ホーム端に「返却待ち」slotを作り、ランタンminiature・灯紋pin・route ticketを同じ場所へ置ける。',
    carryGoodsHook: 'return-tag strap + small lantern pocket。Character顔なしでもユイへ戻れる携帯導線。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '季節色は#264A86を消さず、夜→朝の明度差だけで季節感を足す。' },
  },
  {
    characterId: 'asa',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'DAWN', rule: '切り線・結び目・余白を使い、名札そのものを敷き詰めない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '若い雄羊の小ぶりな角と前向きな頭位置。角を巨大化して攻撃性を足さない。',
    starBeastPosePriority: ['stand', 'small hop', 'sleep curl'], starBeastAvoid: ['巨大巻角', 'battle ram化', 'pink mascot固定'],
    namedObjectEntryForm: '小鋏silhouette charm / tag card', namedObjectCollectorForm: 'letter-opening accessory style miniature', replicaSpoilerRule: '名前の公開範囲や誰の名を切ったかを商品で新規Canon化しない。',
    pairGoodsPartnerIds: ['yui', 'kage2'], pairGoodsGrammar: '交差しても接触しない線を維持し、相手の名前/visibilityを奪わないgapを中央に残す。',
    displayGoodsHook: 'name-tag rail。cardを差し替えられ、固定名ではなく「自分で選んだ表示」を主役にする。',
    carryGoodsHook: 'tag wallet / mini letter case。書く・渡す・しまうの3動作が自然にできる。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#F4A7B9は紙端・糸・小面積だけ。季節版でも全面pink化しない。' },
  },
  {
    characterId: 'nagi',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'ROUTE', rule: '鍵穴/箱の継ぎ目とopen gateを使い、月や鍵の絵だけへ縮退しない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '小さな蟹の低い横幅と小さな鋏。守備tank記号にしない。',
    starBeastPosePriority: ['rest low', 'side step', 'claws tucked'], starBeastAvoid: ['巨大甲羅', '盾化', '攻撃的な鋏誇張'],
    namedObjectEntryForm: '銀鍵metal charm', namedObjectCollectorForm: '月箱 + 銀鍵 keepsake miniature', replicaSpoilerRule: '何が箱に入るか/誰が開けるべきかを商品説明で確定しない。',
    pairGoodsPartnerIds: ['kage1', 'tobari'], pairGoodsGrammar: '守りの方向を二人で分担し、囲い切らず必ずexit gapを一つ残す。',
    displayGoodsHook: 'openable archive shelf。箱を閉じた展示と少し開けた展示の両方を許す。',
    carryGoodsHook: 'key sleeve + small box pouch。鍵を「支配」の記号ではなく預かり物として持つ。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#7B90D2を月光の細線に限定し、季節背景より境界線を優先。' },
  },
  {
    characterId: 'michiru',
    repeatPattern: { primary: 'ROUTE', secondary: 'DAWN', rule: '帰路lineとopen nodeを中心にし、コンパスroseの装飾柄にしない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '小熊の丸い耳・短い手足・少し前傾した探索姿勢。',
    starBeastPosePriority: ['walk', 'sit with map-like gaze', 'sleep'], starBeastAvoid: ['大熊化', '登山マスコット化', 'compassを持たせる'],
    namedObjectEntryForm: 'compass-ring charm / route card', namedObjectCollectorForm: '帰り針のコンパス desk miniature', replicaSpoilerRule: '唯一の正解方向を示すpropとして固定しない。',
    pairGoodsPartnerIds: ['kage3', 'gen'], pairGoodsGrammar: 'routeとmeasure/old routeを重ねるが、最後のnodeは二択以上に開く。',
    displayGoodsHook: 'folding route-map stand。ticket・compass・灯紋を地図上の別layerで並べる。',
    carryGoodsHook: 'map-fold pocket + compass tag。実用の方位磁針機能を必須にしない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#2E5C6Eをroute lineへ残し、季節色はnode周辺だけに入れる。' },
  },
  {
    characterId: 'tomori',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'TOUMON_FRAGMENT', rule: '縫い目・修理跡・煤点を疎に使い、新品工具patternへしない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '少し煤けた若獅子。ユイの子獅子より胴と鬣を一段成熟させ、同じLeoでも別個体と読む。',
    starBeastPosePriority: ['crouch near work', 'sit', 'sleep'], starBeastAvoid: ['ユイのルク色違い', 'adult lion化', '工具を咥えさせ続ける'],
    namedObjectEntryForm: 'repair-tag / stitched metal charm', namedObjectCollectorForm: '修理ランプ miniature + tool-set box', replicaSpoilerRule: '修理前の所有履歴や未確定lineageを新規に刻まない。',
    pairGoodsPartnerIds: ['kage4', 'yui'], pairGoodsGrammar: '切れ線を相手の線で隠さず、一つのstitchだけ共有して「直した跡」を残す。',
    displayGoodsHook: 'repair bench tray。傷ありminiatureを完成品として堂々と置ける。',
    carryGoodsHook: 'tool-tag pouch / seam strap。使い込んだ質感を汚れギャグにしない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#8F2E14は火色ではなく修理痕のaccentにも使い、炎一辺倒にしない。' },
  },
  {
    characterId: 'sen',
    repeatPattern: { primary: 'ROUTE', secondary: 'OBJECT_TRACE', rule: 'branch line / chalk traceを使い、黒板や教師アイコンの反復にしない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '小烏の小さな嘴と首傾げ。賢者・不吉の記号を盛らない。',
    starBeastPosePriority: ['head tilt', 'perch', 'sleep tuck'], starBeastAvoid: ['大烏化', '博士帽', '不吉ホラー化'],
    namedObjectEntryForm: 'chalk-line bookmark / slim charm', namedObjectCollectorForm: '白線のチョーク灯 desk object', replicaSpoilerRule: '問いに公式正解を書き込んだ商品へしない。',
    pairGoodsPartnerIds: ['koyori', 'shiro'], pairGoodsGrammar: 'branchの一枝を相手へ渡し、中央に「未回答」gapを残す。',
    displayGoodsHook: 'branching white-line board。カードを一列順位ではなく枝分かれで置く。',
    carryGoodsHook: 'chalk-light pen sleeve + question-tag。文具として自然に使える。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#6E7955を白線の補色として少量。学校色テンプレにしない。' },
  },
  {
    characterId: 'ritsu',
    repeatPattern: { primary: 'TOUMON_FRAGMENT', secondary: 'STAR_BEAST_TRACE', rule: '左右の間隔と大きい猟犬の足跡rhythmを使い、兄妹2人の顔patternにしない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '二頭のうち大きい猟犬。脚と胸郭を一段大きくし、コヨリ側とsize/readで区別する。',
    starBeastPosePriority: ['stand guard', 'sit beside', 'sleep back-to-back candidate'], starBeastAvoid: ['狼化', '番犬威圧', 'コヨリ側と同サイズ'],
    namedObjectEntryForm: 'half-tin charm / wrapper card', namedObjectCollectorForm: '半灯りの飴缶 collector tin', replicaSpoilerRule: '食べ物キャラ化せず、分ける行為を中心にする。',
    pairGoodsPartnerIds: ['koyori', 'kage1'], pairGoodsGrammar: '左右が同じ形へ融合せず、shared spacingだけを揃える。兄妹はromance文法禁止。',
    displayGoodsHook: 'two-slot half-light tin stand。片方を空けても成立する。',
    carryGoodsHook: 'split pocket case。二つの小物を分けて持てるが「保護者専用」にはしない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#D75455は包み紙edgeへ。兄=赤の強者記号に固定しない。' },
  },
  {
    characterId: 'koyori',
    repeatPattern: { primary: 'TOUMON_FRAGMENT', secondary: 'OBJECT_TRACE', rule: '細いpaper twistと小さなgapを使い、幼児向け総柄へ寄せない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '二頭のうち小さい猟犬。小柄でも子犬固定にせず、敏捷な成熟個体として読む。',
    starBeastPosePriority: ['small alert sit', 'quick step', 'curl sleep'], starBeastAvoid: ['baby化', 'うさぎ化', 'リツ側の付属品化'],
    namedObjectEntryForm: 'paper-twist charm / name tag', namedObjectCollectorForm: '呼び名の紙縒り札 multi-charm set', replicaSpoilerRule: '呼び名を一つに固定する商品設計へしない。',
    pairGoodsPartnerIds: ['ritsu', 'sen'], pairGoodsGrammar: '細い線を相手の線へ結び切らず、shared nodeだけで「助ける側にも回れる」を残す。',
    displayGoodsHook: 'small-helper rail。小物を主役cardの下ではなく同じ高さへ置ける。',
    carryGoodsHook: 'name-string strap / mini organizer。小型でも実用品として扱う。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#F7C8D0は細線のみ。幼児pink商品へ寄せない。' },
  },
  {
    characterId: 'gen',
    repeatPattern: { primary: 'ROUTE', secondary: 'OBJECT_TRACE', rule: '古いroute tick / 錆跡 / open Uを使い、アンティーク装飾を盛りすぎない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '大熊の重心と大きな手を素朴に。年長=眠そう/遅いという演出へ結ばない。',
    starBeastPosePriority: ['steady stand', 'sit', 'rest'], starBeastAvoid: ['老人化', 'wizard bear', '鈍重ギャグ'],
    namedObjectEntryForm: 'old-route pin / compass needle charm', namedObjectCollectorForm: '古針の駅灯 / 古いコンパス desk replica', replicaSpoilerRule: '古い道が唯一正しいという説明を付けない。',
    pairGoodsPartnerIds: ['michiru', 'kage3'], pairGoodsGrammar: 'old/new routeの線齢差を残し、片方を正解として太くしない。',
    displayGoodsHook: 'weathered station shelf。新旧routeを横並びで比較できる。',
    carryGoodsHook: 'map notebook cover / brass-like tag。年長男性向け=渋色一択にしない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#867835は錆/金属だけでなく紙端にも使い、老人色へ固定しない。' },
  },
  {
    characterId: 'hana',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'STAR_BEAST_TRACE', rule: '花脈・布目・白鳥の水面跡を使い、花柄だけ/体型記号へしない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: 'ふっくらした白鳥の丸い胸・滑らかな首・落ち着いた座り姿。丸さを笑いへ使わない。',
    starBeastPosePriority: ['rest sit', 'sleep neck tuck', 'gentle float'], starBeastAvoid: ['痩身白鳥', 'food joke', '丸さの誇張/fetish'],
    namedObjectEntryForm: 'pressed-flower bookmark / flower-vein charm', namedObjectCollectorForm: '花脈の保管箱 + pressed-flower collector set', replicaSpoilerRule: '保存物の中身を商品で勝手に決めず、空の余白も商品価値として残す。',
    pairGoodsPartnerIds: ['kage4', 'shiro'], pairGoodsGrammar: '保存側のcurveが相手を囲い切らず、shared gapを「残す場所」として見せる。',
    displayGoodsHook: 'archive tray + soft-cloth backing。丸いshowcaseではなく保管作業の場として見せる。',
    carryGoodsHook: 'flower-vein pouch / shawl-pattern inner pocket。体型をサイズ名や容量ネタへ使わない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#B5495Bを花脈/布縁に限定し、春=花だけへ固定しない。' },
    extraCommercialNoGo: ['body sizeをpattern密度や線幅へ変換しない', 'Happy End/季節版で若返り・細身化しない'],
  },
  {
    characterId: 'yubi',
    repeatPattern: { primary: 'ROUTE', secondary: 'OBJECT_TRACE', rule: '配達路・未接続stamp・封のedgeを使い、封筒アイコン総柄にしない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '小鳩の丸い胸と短い歩幅。郵便帽など職業costumeを常設しない。',
    starBeastPosePriority: ['walk', 'perch', 'sleep'], starBeastAvoid: ['郵便鳩costume固定', '速度競争', '手紙を咥え続ける'],
    namedObjectEntryForm: 'postmark card / postal-light charm', namedObjectCollectorForm: '返事待ちの郵便灯 + 未配達封筒 collector set', replicaSpoilerRule: '封筒の本文・返事内容・相手を商品説明で確定しない。',
    pairGoodsPartnerIds: ['tobari', 'kage2', 'kuroori'], pairGoodsGrammar: 'lineが相手のgap直前で止まり、「今は渡さない」状態も完成形として扱う。',
    displayGoodsHook: 'pending-mail rack。届いた/未配達/返事待ちを上下関係なく並べる。',
    carryGoodsHook: 'ticket-letter case / stamp tag。現実郵便ロゴへ近づけない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#C1693Cは消印/路線nodeへ。秋限定色に固定しない。' },
  },
  {
    characterId: 'madoka',
    repeatPattern: { primary: 'ROUTE', secondary: 'DAWN', rule: '遠点・窓端・焦点外lineを使い、紙飛行機の反復だけにしない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '小鷲の小さな頭・短めの翼・見上げる姿勢。猛禽の威圧を弱める。',
    starBeastPosePriority: ['perch and watch', 'small wing open', 'sleep'], starBeastAvoid: ['巨大鷲', '軍章化', '鋭い爪の誇張'],
    namedObjectEntryForm: 'lens sticker/charm + window card', namedObjectCollectorForm: '見送り窓の観測レンズ optical object', replicaSpoilerRule: 'レンズが真実を見抜く魔法道具であるかのように売らない。',
    pairGoodsPartnerIds: ['ren', 'nemu'], pairGoodsGrammar: '二つの焦点を同一中心へ揃えず、周辺視野の余白を保持する。',
    displayGoodsHook: 'layered window stand。前景/遠景の二層にcardを置き、差分を見る。',
    carryGoodsHook: 'transparent card sleeve / lens tag。透明素材でも文字可読性を犠牲にしない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#89C3EBを窓辺の細光へ。夏空だけのCharacterにしない。' },
  },
  {
    characterId: 'shiro',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'TOUMON_FRAGMENT', rule: '余白・頁端・栞の痕跡を使い、本/眼鏡iconを全面反復しない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '山猫の耳先・短い尾/体輪郭を読みやすくし、眼鏡を星獣へ移植しない。',
    starBeastPosePriority: ['sit observe', 'page-side rest', 'sleep'], starBeastAvoid: ['眼鏡装着', '図書館猫テンプレ', '白一色で輪郭消失'],
    namedObjectEntryForm: 'bookmark/page-edge goods', namedObjectCollectorForm: '白栞/未分類頁を収納する archival sleeve set', replicaSpoilerRule: '未分類の内容を商品側で分類済みにしない。',
    pairGoodsPartnerIds: ['hana', 'sen', 'kage4'], pairGoodsGrammar: 'parallel marginの外側に相手の線を置き、分類外を一枠残す。',
    displayGoodsHook: 'unclassified page board。空白slotを「未所持」ではなく正当な余白として残せる。',
    carryGoodsHook: 'bookmark sleeve / index pouch。丸眼鏡だけをCharacter logo代わりにしない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#E3E5E8は背景同化させず濃紺outlineとセットで使う。' },
  },
  {
    characterId: 'tobari',
    repeatPattern: { primary: 'ROUTE', secondary: 'OBJECT_TRACE', rule: '往復穴・gate line・return routeを使い、実在駅/鉄道柄へ寄せない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '大きな番犬の胸・耳・落ち着いた正面姿。威嚇顔をdefaultにしない。',
    starBeastPosePriority: ['sit at gate', 'stand wait', 'sleep'], starBeastAvoid: ['警察犬costume', '牙の誇張', '怖い番犬だけ'],
    namedObjectEntryForm: 'punch-hole ticket / gate charm', namedObjectCollectorForm: '往復穴の改札鋏 replica + ticket collector box', replicaSpoilerRule: '実在交通会社の券面・鋏形状を近似しすぎない。',
    pairGoodsPartnerIds: ['yubi', 'nagi'], pairGoodsGrammar: '片道で閉じず、必ずreturn gapを相手側にも残す。',
    displayGoodsHook: 'night platform gate display。ticketを「入場」と「帰路」両側へ差せる。',
    carryGoodsHook: 'pass case / round-trip ticket holder。交通会社公式品と誤認する意匠を避ける。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#56564Bをgate金属/布へ。無彩色だけで地味役にしない。' },
  },
  {
    characterId: 'nemu',
    repeatPattern: { primary: 'DAWN', secondary: 'STAR_BEAST_TRACE', rule: '水面波・sleep arc・イルカの軌跡を使い、雲/月/枕のsleep icon柄へ寄せない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '小イルカの短い吻・丸い背・小さな背びれ。水なしでもsilhouetteで読む。',
    starBeastPosePriority: ['gentle swim', 'surface rest', 'curl-like sleep composition'], starBeastAvoid: ['水族館logo化', '夢予知マスコット', 'baby dolphin化しすぎる'],
    namedObjectEntryForm: 'ripple bookmark / translucent page card', namedObjectCollectorForm: '夢頁の水面日記 special-bound notebook', replicaSpoilerRule: '夢の内容を未来予知の確定Canonとして印刷しない。',
    pairGoodsPartnerIds: ['kage3', 'madoka'], pairGoodsGrammar: '波の位相差を残し、夢/測定/観測を一つの正解へ合流させない。',
    displayGoodsHook: 'translucent water-page stand。重ねるほど全部見えるのではなく、一部が隠れる設計。',
    carryGoodsHook: 'dream diary cover / translucent mini pouch。sleepwear商品だけへ閉じない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#B4A5D4を水面反射へ。冬=眠り、春=夢など季節人格を固定しない。' },
  },
  {
    characterId: 'kuroori',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'TOUMON_FRAGMENT', rule: '折り目・黒紙edge・open foldを使い、烏/悪役紋を混ぜない。' },
    plushTarget: 'MEDIUM', starBeastRecognitionHook: '黒紙のカメレオンとして、身体輪郭より折れた面と尾のcurveで読む。黒一色潰れを避ける。',
    starBeastPosePriority: ['still perch', 'half-turn', 'rest fold'], starBeastAvoid: ['literal paper toyだけ', '悪魔化', '虹色カメレオン化'],
    namedObjectEntryForm: 'fold-line black card / seal charm', namedObjectCollectorForm: '黒折りseal + folding case collector object', replicaSpoilerRule: '封じた記憶の中身を文字/透かしで漏らさない。',
    pairGoodsPartnerIds: ['yui', 'yubi'], pairGoodsGrammar: '相手のopen endを塞がず、一時的なshared hold nodeだけを置く。',
    displayGoodsHook: 'sealed archive slot。開封展示を上位状態にせず、閉じたままでも完成。',
    carryGoodsHook: 'folding document case / black-paper tag。秘密持ちギャグ商品にしない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#1C1C1Cは紙面で潰れないよう素材差/空押しで読む。季節色は外側へ。' },
  },
  {
    characterId: 'kage1',
    repeatPattern: { primary: 'TOUMON_FRAGMENT', secondary: 'STAR_BEAST_TRACE', rule: 'intercept bracketと灰狼の歩線を使い、太線=大柄という短絡を禁止。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '大きな灰狼の長い背・大きな足・落ち着いた耳。bodybuilder/獰猛化ではなく大きさを読む。',
    starBeastPosePriority: ['side guard', 'sit', 'one-step intercept'], starBeastAvoid: ['筋肉誇張', '牙の威圧', 'slow tank pose'],
    namedObjectEntryForm: 'arm-band motif tag/charm', namedObjectCollectorForm: '受け灯の腕帯 wearable replica', replicaSpoilerRule: 'サイズ展開をCharacter体型の冗談にせず、装着物として複数サイズを公平に用意する。',
    pairGoodsPartnerIds: ['nagi', 'ritsu'], pairGoodsGrammar: 'intercept lineを二人で分担し、カナメ一人が全て受ける形へ閉じない。',
    displayGoodsHook: 'protector handoff rail。前衛/後衛順位ではなく受け渡し位置を可変にする。',
    carryGoodsHook: 'arm-band inspired strap / protection cloth pouch。重量級商品名を使わない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#2B2B2Bを線幅ではなく面/素材差で使う。体型は不変。' },
    extraCommercialNoGo: ['body sizeを線幅・商品容量・XXL記号へ変換しない', '季節/暁版で細身化・bodybuilder化しない'],
  },
  {
    characterId: 'kage2',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'DAWN', rule: '消し跡・薄層・戻せる痕跡を使い、狐顔patternや忍者記号へしない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '淡い小狐の細い耳・小さな尾・低コントラストでも消えない輪郭。',
    starBeastPosePriority: ['half-hide', 'sit', 'sleep curl'], starBeastAvoid: ['透明化で見えなくする', '九尾化', 'assassin mascot'],
    namedObjectEntryForm: 'eraser-trace sticker / reversible card', namedObjectCollectorForm: '消し跡の白灯 reversible-light object', replicaSpoilerRule: '匿名/非公開を「消滅」や死亡表現へ変換しない。',
    pairGoodsPartnerIds: ['asa', 'yubi'], pairGoodsGrammar: 'visibility layerをずらし、どちらかが相手の名前を完全露出させない。',
    displayGoodsHook: 'reversible layer frame。表/裏どちらも正面として成立する。',
    carryGoodsHook: 'layered card sleeve / reversible tag。透明素材でも本人の選択した非公開を尊重する。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#787D7Bを痕跡の中間toneへ。季節で完全透明化しない。' },
  },
  {
    characterId: 'kage3',
    repeatPattern: { primary: 'ROUTE', secondary: 'TOUMON_FRAGMENT', rule: '角度線・目盛・測定外gapを使い、数式patternや照準器へ寄せない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '細身の鶴の長脚・細首・小さな頭。細さを神経質/弱さの記号にしない。',
    starBeastPosePriority: ['stand measure-like', 'one step', 'rest neck'], starBeastAvoid: ['折れそうな誇張', '狙撃照準', '和柄鶴だけへ固定'],
    namedObjectEntryForm: 'ruler bookmark / angle charm', namedObjectCollectorForm: '星目盛りの夜定規 metal/acrylic collector ruler', replicaSpoilerRule: '目盛に未来/正解数値を刻まない。',
    pairGoodsPartnerIds: ['michiru', 'nemu', 'gen', 'ren'], pairGoodsGrammar: 'shared tickを一つだけ置き、測定外を残すgapを必須とする。',
    displayGoodsHook: 'calibration board。複数route/objectを同一物差しで順位化しない。',
    carryGoodsHook: 'precision stationery sleeve / ruler tag。武器ケース風にしない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#2D2D48をtechnical lineへ。寒色=冷たい人格に結びつけない。' },
  },
  {
    characterId: 'kage4',
    repeatPattern: { primary: 'OBJECT_TRACE', secondary: 'TOUMON_FRAGMENT', rule: '糸・縫い目・unfinished edgeを使い、破れ/ボロ布美学だけにしない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '白灰の野兎の長耳・丸い腰・軽い跳躍。白背景でもoutlineを失わない。',
    starBeastPosePriority: ['sit ears offset', 'small hop', 'sleep'], starBeastAvoid: ['真白で輪郭消失', '幼児うさぎ化', '儚さだけの演出'],
    namedObjectEntryForm: 'thread bookmark / seam charm', namedObjectCollectorForm: '余白を縫う糸巻き + repair craft collector set', replicaSpoilerRule: '「完成=全部縫い閉じる」にしない。最後の余白を残せる構造にする。',
    pairGoodsPartnerIds: ['tomori', 'shiro', 'hana'], pairGoodsGrammar: 'one stitchだけ共有し、相手の傷/余白を覆い隠さない。',
    displayGoodsHook: 'unfinished-edge textile board。端処理を一部openのまま完成品として見せる。',
    carryGoodsHook: 'repair craft mini case / thread strap。実際の縫製強度は商品安全基準を優先する。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#F2F2EDは濃いedgeと併用し、白=幽霊表現へ寄せない。' },
  },
  {
    characterId: 'ren',
    repeatPattern: { primary: 'ROUTE', secondary: 'TOUMON_FRAGMENT', rule: '焦点差・parallel crescent・周辺nodeを使うが、Reserve専用premium patternとして先行販売しない。' },
    plushTarget: 'HIGH', starBeastRecognitionHook: '小さな観察犬の耳・視線方向・小さな足。探偵帽/虫眼鏡を常設しない。',
    starBeastPosePriority: ['observe sit', 'small side look', 'sleep'], starBeastAvoid: ['detective costume', 'シロの眼鏡転用', 'Current20 mascot lineへの自動混入'],
    namedObjectEntryForm: 'focal-lens bookmark candidate', namedObjectCollectorForm: '片焦点のレンズ灯 optical collector candidate', replicaSpoilerRule: 'Reserveのためproduction launch不可。設定保存のみで、商品化をPlayable昇格根拠にしない。',
    pairGoodsPartnerIds: ['madoka', 'kage3'], pairGoodsGrammar: '二焦点を完全一致させず、差分を確認するparallel gapを残す。',
    displayGoodsHook: 'observation side-slot candidate。Current20 displayの必須穴として扱わない。',
    carryGoodsHook: 'lens-tag candidate。Current20 trading lineへ自動封入しない。',
    seasonalVariantRules: { mutable: COMMON_SEASONAL_MUTABLE, immutable: COMMON_SEASONAL_IMMUTABLE, characterAccent: '#A2D7DDはcandidate accent。Reserve状態をseasonal releaseで迂回しない。' },
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
      target: seed.plushTarget,
      recognitionHook: seed.starBeastRecognitionHook,
      posePriority: seed.starBeastPosePriority,
      avoid: seed.starBeastAvoid,
    },
    embroiderySafe: {
      target: true,
      productionApproved: false,
      rule: COMMON_EMBROIDERY_RULE,
    },
    smallScaleReadability: {
      targetPx: 16,
      productionApproved: false,
      rule: COMMON_SMALL_SCALE_RULE,
    },
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
    seasonalVariantRules: seed.seasonalVariantRules,
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
