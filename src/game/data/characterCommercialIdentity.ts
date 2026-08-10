import { current21SilhouetteMatrixById } from './current21SilhouetteMatrix.ts';
import { characterThemeColorById } from './characterThemeColors.ts';

export type CharacterCommercialScope = 'current20' | 'official_reserve';

export type CharacterCommercialIdentity = {
  characterId: string;
  displayName: string;
  scope: CharacterCommercialScope;
  status: 'CURRENT_COMMERCIAL_DIRECTION' | 'RESERVE_COMMERCIAL_CANDIDATE';
  characterHook: string;
  themeHex: string;
  starBeast: string;
  namedObject: string;
  silhouetteLane: string;
  relationshipHooks: string[];
  entryGoods: string[];
  coreGoods: string[];
  premiumCandidate: string;
  sceneHooks: string[];
  popularityAxes: Array<
    | 'favoriteCharacter'
    | 'favoriteStarBeast'
    | 'favoriteRelationship'
    | 'wantToCollect'
    | 'wantMoreStory'
    | 'favoriteScene'
  >;
  commercialAvoid: string[];
};

type CommercialSeed = Omit<
  CharacterCommercialIdentity,
  'themeHex' | 'starBeast' | 'silhouetteLane' | 'popularityAxes'
>;

const ALL_POPULARITY_AXES: CharacterCommercialIdentity['popularityAxes'] = [
  'favoriteCharacter',
  'favoriteStarBeast',
  'favoriteRelationship',
  'wantToCollect',
  'wantMoreStory',
  'favoriteScene',
];

const seeds: CommercialSeed[] = [
  {
    characterId: 'yui', displayName: 'ユイ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '拾う / 戻す / ランタン。作品の入口として最も説明しやすいが、全商品をユイ一極へ寄せない。',
    namedObject: '持ち主待ちのランタン', relationshipHooks: ['アサ', 'クロオリ', 'トモリ'],
    entryGoods: ['青フード色のprofile card', 'ランタンcharm', '子獅子「ルク」仮称 sticker'],
    coreGoods: ['子獅子 mascot', '忘れ物 / 名前 motif stationery', 'ユイ×アサ buddy goods', 'ユイ×クロオリ ideological mirror goods'],
    premiumCandidate: '持ち主待ちのランタン miniature / collector replica',
    sceneHooks: ['忘れ物を拾う夜', 'ランタンを誰かへ向ける瞬間', '夜→朝の主人公scene'],
    commercialAvoid: ['主人公だから全SKUを独占する', 'ユイ×アサを人気だけでromance化する', 'ランタンlineageの未確定事項を商品説明でCanon化する'],
  },
  {
    characterId: 'asa', displayName: 'アサ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '名前を聞く / 書く / 渡す。短く速い行動と紙物が日常商品へ自然に落ちる。',
    namedObject: '名結びの小鋏', relationshipHooks: ['ユイ', 'カスミ'],
    entryGoods: ['名札風card', '小鋏 icon charm', '若い雄羊 sticker'],
    coreGoods: ['名前を書くmini stationery set', '絵はがき / 手紙 paper goods', 'アサ×カスミ name/visibility pair goods'],
    premiumCandidate: '名結びの小鋏 motif letter-opening accessory',
    sceneHooks: ['初対面の名前を聞く', '誰かの名札を書く', '名前を公開する範囲を相談する'],
    commercialAvoid: ['元気娘だけに縮める', '名前を勝手につけることを正義として売る', 'ユイの色違い商品にする'],
  },
  {
    characterId: 'nagi', displayName: 'ナギ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '閉じる / 守る / 月箱。静かな境界管理を鍵・箱・月の形へ落とせる。',
    namedObject: '月箱の銀鍵', relationshipHooks: ['カナメ', 'トバリ'],
    entryGoods: ['銀鍵charm', '月箱card', '小さな蟹 pin'],
    coreGoods: ['鍵 / 箱 stationery', '月輪 acrylic', 'ナギ×カナメ 二つの守りpair goods'],
    premiumCandidate: '月箱 + 銀鍵 small keepsake box',
    sceneHooks: ['開ける時を一緒に決める', '帰る前に鍵を確認する', '箱を預かる夜'],
    commercialAvoid: ['守る=重装tank商品だけにする', '無口キャラだけで売る', '閉じる行為を絶対正義にする'],
  },
  {
    characterId: 'michiru', displayName: 'ミチル', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '道 / 地図 / 帰路。旅行・文具・地図系goodsとの相性が強い。',
    namedObject: '帰り針のコンパス', relationshipHooks: ['トキ', 'ゲン'],
    entryGoods: ['地図線 postcard', 'コンパス charm', '小熊 sticker'],
    coreGoods: ['folding map', 'route notebook', 'ミチル×トキ measure/choose pair goods'],
    premiumCandidate: '帰り針のコンパス collector object',
    sceneHooks: ['一緒に迷う', '帰り道を紙へ描く', '古い道と新しい道を比べる'],
    commercialAvoid: ['方向音痴ギャグ', '旅行者テンプレだけにする', '正しい道が一つあるというコピーへ戻す'],
  },
  {
    characterId: 'tomori', displayName: 'トモリ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '修理 / 継ぎ目 / 煤。工具と修理痕が強いcollector identityになる。',
    namedObject: '継火の修理ランプ', relationshipHooks: ['ツムギ', 'ユイ'],
    entryGoods: ['repair mark sticker', 'tool-tag charm', '煤けた若獅子 pin'],
    coreGoods: ['修理跡 stationery', 'tool pouch', 'トモリ×ツムギ repair/trace goods'],
    premiumCandidate: '継火の修理ランプ miniature / tool-set style collector box',
    sceneHooks: ['誰かの横で黙って直す', '古い修理跡を残す', '火を継ぎ直す'],
    commercialAvoid: ['発明家テンプレ', '新品の機械goodsへ寄せる', '傷を全部消すことを完成扱いする'],
  },
  {
    characterId: 'sen', displayName: 'セン', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '説明 / 白線 / 問いを残す。学用品・chalk motifに落とせる。',
    namedObject: '白線のチョーク灯', relationshipHooks: ['コヨリ', 'シロ'],
    entryGoods: ['chalk-line memo', '小烏 sticker', '白線 bookmark'],
    coreGoods: ['chalk case motif', 'branching-route notebook', 'セン×シロ 問い/未分類 booklet'],
    premiumCandidate: '白線のチョーク灯 desk object',
    sceneHooks: ['説明途中で教わる', '道筋を枝分かれさせる', '問いを一つ残す'],
    commercialAvoid: ['先生=スーツ眼鏡goodsへ固定', '説明役だけにする', '正解集のような商品コピー'],
  },
  {
    characterId: 'ritsu', displayName: 'リツ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '半分に分ける兄。兄妹 / 分担 / 包み紙を一つの形へまとめやすい。',
    namedObject: '半灯りの飴缶', relationshipHooks: ['コヨリ', 'カナメ'],
    entryGoods: ['half-wrapper card', '飴缶 charm', '大きい猟犬 pin'],
    coreGoods: ['リツ×コヨリ two-piece goods', 'half-light tin motif', 'protector relation goods'],
    premiumCandidate: '半灯りの飴缶 collector tin',
    sceneHooks: ['半分を渡す', '妹へ任せる', 'カナメと守備を分担する'],
    commercialAvoid: ['兄=保護者だけの人格', '兄妹をromance風に演出する', '大柄男性テンプレへ寄せる'],
  },
  {
    characterId: 'koyori', displayName: 'コヨリ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '小さな名前 / 紙縒り / 補助灯。小型goodsと二体mascot構成に強い。',
    namedObject: '呼び名の紙縒り札', relationshipHooks: ['リツ', 'セン'],
    entryGoods: ['small name-tag sticker', '紙縒り charm', '小さい猟犬 pin'],
    coreGoods: ['リツ×コヨリ two-piece goods', 'name-string bracelet motif', 'small helper light set'],
    premiumCandidate: '呼び名の紙縒り札 multi-charm set',
    sceneHooks: ['大人の名前を繋ぐ', '小物を配る', '守られる側から助ける側へ回る'],
    commercialAvoid: ['幼児化', '守られるだけの商品絵', '兄の付属品として扱う'],
  },
  {
    characterId: 'gen', displayName: 'ゲン', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '古い道 / 経験 / 駅灯。年長男性を渋い生活道具と一緒に推せる。',
    namedObject: '古針の駅灯', relationshipHooks: ['ミチル', 'トキ'],
    entryGoods: ['old-map postcard', 'compass pin', '大熊 sticker'],
    coreGoods: ['weathered notebook', 'station-lamp motif goods', 'ゲン×ミチル old/new route booklet'],
    premiumCandidate: '古針の駅灯 / 古いコンパス desk replica',
    sceneHooks: ['昔の道を語る', '新しい道を面白がる', '若い人へ道具を渡す'],
    commercialAvoid: ['老人ギャグ', '若返り商品絵', '賢者/wizard化'],
  },
  {
    characterId: 'hana', displayName: 'ハナ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '保存 / 押し花 / 布。ぽっちゃり年長女性の丸いsilhouetteを生活の安心感として活かす。',
    namedObject: '花脈の保管箱', relationshipHooks: ['ツムギ', 'シロ'],
    entryGoods: ['押し花しおり', '蘇芳 paper goods', 'ふっくらした白鳥 sticker'],
    coreGoods: ['丸いショール pattern cloth goods', '花脈 pouch', 'ハナ×ツムギ repair/preserve stationery', 'ハナ×シロ archive goods'],
    premiumCandidate: '押し花 / しおり / 花脈の保管箱をまとめた生活道具collector set',
    sceneHooks: ['押し花を移す', '分からない紙片を残す', '灯りの内側で小物を分ける'],
    commercialAvoid: ['ぽっちゃりを商品名の売りにする', '食べ物だけの商品line', '体重/XXL joke', '人気都合の細身化', 'fetish方向の誇張'],
  },
  {
    characterId: 'yubi', displayName: 'ユウビ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '手紙 / 配達 / 受取可能な時。postal graphicsと時間差演出が強い。',
    namedObject: '返事待ちの郵便灯', relationshipHooks: ['トバリ', 'カスミ', 'クロオリ'],
    entryGoods: ['postcard', 'stamp-style sticker', '小鳩 charm'],
    coreGoods: ['letter set', 'postal-light pin', 'ユウビ×トバリ route goods'],
    premiumCandidate: '返事待ちの郵便灯 + 未配達封筒 collector set',
    sceneHooks: ['今は渡さない', '遅れて届く返事', '門を通して配達する'],
    commercialAvoid: ['郵便屋コスプレだけにする', '手紙の中身を商品説明で勝手にCanon化する', '配達=速度だけで売る'],
  },
  {
    characterId: 'madoka', displayName: 'マドカ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '遠景 / 観測 / 紙飛行機。透明素材・窓・レンズとの相性が良い。',
    namedObject: '見送り窓の観測レンズ', relationshipHooks: ['レン', 'ネム'],
    entryGoods: ['paper-airplane card', 'lens sticker', '小鷲 charm'],
    coreGoods: ['transparent window card', 'observation notebook', 'マドカ×レン difference-finding goods'],
    premiumCandidate: '見送り窓の観測レンズ optical object',
    sceneHooks: ['遠くの差へ気づく', '不完全でも伝える', '窓越しに見送る'],
    commercialAvoid: ['長身美女だけで売る', '観測=冷たい無感情にする', 'RenをCurrent20へ商品都合で昇格する'],
  },
  {
    characterId: 'shiro', displayName: 'シロ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '未分類 / 白い頁 / 丸メガネ。Lorebook・文具との親和性が高い。',
    namedObject: '未分類の白栞灯', relationshipHooks: ['ツムギ', 'セン', 'ハナ'],
    entryGoods: ['white bookmark', 'round-glasses icon sticker', '山猫 pin'],
    coreGoods: ['unclassified-page notebook', 'archive divider set', 'シロ×ハナ archive goods'],
    premiumCandidate: '未分類頁 / 白栞灯 archival stationery box',
    sceneHooks: ['分からないまま残す', '頁を戻す', 'ハナと箱を整理する'],
    commercialAvoid: ['眼鏡=秀才だけで売る', 'Renとのvisual copy', '全て分類できる人として戻す'],
  },
  {
    characterId: 'tobari', displayName: 'トバリ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '門 / 切符 / 帰路。ticket graphics・travel goodsへ自然に広げられる。',
    namedObject: '往復穴の改札鋏', relationshipHooks: ['ユウビ', 'ナギ'],
    entryGoods: ['ticket-style card', 'punch-hole sticker', '大きな番犬 pin'],
    coreGoods: ['round-trip ticket booklet', 'gate acrylic', 'ユウビ×トバリ postal-route goods'],
    premiumCandidate: '往復穴の改札鋏 replica / ticket collector box',
    sceneHooks: ['帰れる門を空ける', '片道で終わらせない', '最後の人を待つ'],
    commercialAvoid: ['駅員コスプレだけ', '門番=無愛想', '実在交通会社の模倣へ寄せすぎる'],
  },
  {
    characterId: 'nemu', displayName: 'ネム', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '夢 / 水面 / 日記。柔らかい夜色とaudio/紙ものへ広げやすい。',
    namedObject: '夢頁の水面日記', relationshipHooks: ['トキ', 'マドカ'],
    entryGoods: ['dream-page card', 'water-ripple sticker', '小イルカ charm'],
    coreGoods: ['dream diary', 'translucent water-page goods', 'ネム×トキ dream/measure booklet'],
    premiumCandidate: '夢頁の水面日記 special-bound notebook',
    sceneHooks: ['夢を地図として持ち帰る', '眠りから起きて自分で決める', '夢と観測を照合する'],
    commercialAvoid: ['寝落ちギャグだけ', 'パジャマ商品だけ', '夢=未来予知の確定情報として売る'],
  },
  {
    characterId: 'kuroori', displayName: 'クロオリ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '黒紙 / 折る / 預かる。高いgraphic identityと紙物collector性を持つ。',
    namedObject: '折り目だけ光る黒紙', relationshipHooks: ['ユイ', 'ユウビ'],
    entryGoods: ['black-origami card', 'fold-line sticker', 'カメレオン charm'],
    coreGoods: ['folding paper set', 'seal-envelope goods', 'ユイ×クロオリ open/hold pair goods'],
    premiumCandidate: '黒折りseal / folding case collector object',
    sceneHooks: ['本人の時まで預かる', '折り目だけ残す', '開かずに守る夜'],
    commercialAvoid: ['悪役商品だけにする', '秘密の中身を商品で先バレする', 'ユイとの関係を単純恋愛/敵対へ潰す'],
  },
  {
    characterId: 'kage1', displayName: 'カナメ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '守る / intercept / 腕帯。ぽっちゃり若年男性の大きな柔らかいsilhouetteを外周の安心感として活かす。',
    namedObject: '受け灯の腕帯', relationshipHooks: ['ナギ', 'リツ'],
    entryGoods: ['腕帯 motif charm', '影の折り目 sticker', '大きな灰狼 pin'],
    coreGoods: ['protection motif cloth goods', 'gray-wolf mascot', 'カナメ×ナギ two-protection goods', 'カナメ×リツ protector goods'],
    premiumCandidate: '受け灯の腕帯 wearable replica',
    sceneHooks: ['風上へ立つ', '一〜二歩だけ速くinterceptする', '任せるため一歩下がる'],
    commercialAvoid: ['重量級/XXL joke', '大食いline', '鈍重tankだけで売る', '人気都合の細身化/bodybuilder化', 'fetish方向の誇張'],
  },
  {
    characterId: 'kage2', displayName: 'カスミ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: 'ぼかす / 戻せる痕跡 / 小狐。淡い濃淡と匿名性をstationeryへ落とせる。',
    namedObject: '消し跡の白灯', relationshipHooks: ['アサ', 'ユウビ'],
    entryGoods: ['eraser-trace sticker', 'white-light card', '淡い小狐 charm'],
    coreGoods: ['reversible-note stationery', 'layered translucent card', 'アサ×カスミ name/visibility goods'],
    premiumCandidate: '消し跡の白灯 reversible-light object',
    sceneHooks: ['戻せる痕跡だけ残す', '公開範囲を本人と選ぶ', '共同メモを静かに直す'],
    commercialAvoid: ['忍者/assassin goodsへ寄せる', '匿名=存在消去にする', '顔隠しだけで売る'],
  },
  {
    characterId: 'kage3', displayName: 'トキ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '測る / 角度 / 夜定規。細いgraphic lineとprecision goodsに向く。',
    namedObject: '星目盛りの夜定規', relationshipHooks: ['ミチル', 'ネム', 'ゲン', 'レン'],
    entryGoods: ['ruler bookmark', 'angle-line sticker', '細身の鶴 pin'],
    coreGoods: ['night ruler stationery', 'measurement notebook', 'ミチル×トキ route/measure goods'],
    premiumCandidate: '星目盛りの夜定規 metal/acrylic collector ruler',
    sceneHooks: ['測定外を一つ残す', '夢を仮説として測る', '古い道の角度を比べる'],
    commercialAvoid: ['細身=神経質商品copy', 'sniper motif', '数字だけで人格を売る'],
  },
  {
    characterId: 'kage4', displayName: 'ツムギ', scope: 'current20', status: 'CURRENT_COMMERCIAL_DIRECTION',
    characterHook: '糸 / 余白 / 継ぎ目。布・紙・手芸goodsへ強く接続できる。',
    namedObject: '余白を縫う糸巻き', relationshipHooks: ['トモリ', 'シロ', 'ハナ'],
    entryGoods: ['thread bookmark', 'seam sticker', '白灰の野兎 charm'],
    coreGoods: ['small sewing-kit motif', 'unfinished-edge stationery', 'ハナ×ツムギ preserve/trace goods'],
    premiumCandidate: '余白を縫う糸巻き / repair craft collector set',
    sceneHooks: ['最後の一箇所を空ける', '傷跡を残して直す', '糸を切って続きを許す'],
    commercialAvoid: ['幽霊/儚い白服だけで売る', 'ぼろ布 aestheticへ寄せる', '未完=完成拒否へ戻す'],
  },
  {
    characterId: 'ren', displayName: 'レン', scope: 'official_reserve', status: 'RESERVE_COMMERCIAL_CANDIDATE',
    characterHook: '差分 / 片焦点 / 観察。Current21理解には含めるがCurrent20商品展開へ自動昇格しない。',
    namedObject: '片焦点のレンズ灯', relationshipHooks: ['マドカ', 'トキ'],
    entryGoods: ['focal-lens bookmark candidate', '観察犬 sticker candidate'],
    coreGoods: ['difference-finding booklet candidate', 'マドカ×レン observation goods candidate'],
    premiumCandidate: '片焦点のレンズ灯 optical collector object — production scope未開放',
    sceneHooks: ['小さな差へ焦点を合わせる', '仮説として共有する', '全体を残して一点を見る'],
    commercialAvoid: ['reserveを人気だけでCurrent20へ昇格する', 'シロの丸メガネ商品copy', '商品化をplayable promotionの根拠にする'],
  },
];

export const characterCommercialIdentities: CharacterCommercialIdentity[] = seeds.map((seed) => {
  const theme = characterThemeColorById.get(seed.characterId);
  const silhouette = current21SilhouetteMatrixById.get(seed.characterId);
  if (!theme) throw new Error(`Missing theme source for commercial identity: ${seed.characterId}`);
  if (!silhouette) throw new Error(`Missing silhouette source for commercial identity: ${seed.characterId}`);
  return {
    ...seed,
    themeHex: theme.themeColor.hex,
    starBeast: theme.starBeastTheme.starBeast,
    silhouetteLane: silhouette.visualLane,
    popularityAxes: [...ALL_POPULARITY_AXES],
  };
});

export const characterCommercialIdentityById = new Map(
  characterCommercialIdentities.map((entry) => [entry.characterId, entry]),
);

export const CHARACTER_COMMERCIAL_IDENTITY_POLICY = {
  expectedCount: 21,
  current20Count: 20,
  reserveIds: ['ren'],
  entryPillars: ['character', 'star-beast', 'named-object', 'relationship', 'scene'],
  popularityAxes: ALL_POPULARITY_AXES,
  bodyDiversityHardLockIds: ['hana', 'kage1'],
  popularityMayChange: ['goods mix', 'restock', 'optional story priority', 'seasonal art', 'event feature order'],
  popularityMustNotChange: ['personality', 'relationship type', 'body shape', 'age', 'family relation', 'Main Mystery truth', 'Named Object truth'],
  rule: 'Commercial identity creates more ways to love an existing character; it never rewrites the character to fit sales data.',
} as const;
