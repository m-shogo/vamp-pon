import { CHARACTER_ERA_SCENE_SEEDS } from './characterEraSceneSeedRegistry.ts';
import {
  CHARACTER_CROSS_ERA_ECHO_CHAINS as BASE_CHAINS,
  CROSS_ERA_ECHO_RULES,
} from './characterCrossEraEchoReservoir.ts';

/**
 * Current projection of the AUTHOR_CANDIDATE cross-era echo reservoir.
 *
 * PR #300 expanded the reservoir to 16 chains but left Serika as the only
 * uncovered authoring character. Keep the original candidate reservoir as
 * source history and apply the narrow coverage correction here: Serika's
 * existing "classification field missing != person absent" seed joins the
 * record-authority chain. This does not create a Canon relationship.
 */
export { CROSS_ERA_ECHO_RULES };

export const CHARACTER_CROSS_ERA_ECHO_CHAINS = BASE_CHAINS.map((chain) => {
  if (chain.id !== 'record-authority-sen-madoka-io') return chain;

  return {
    ...chain,
    participantIds: ['sen', 'madoka', 'io', 'serika'] as const,
    sourceSceneSeedIds: ['sen', 'madoka', 'io', 'serika'] as const,
    setupScene:
      'センは「本にあること」と決着を分け、マドカは写真の端を見て、イオは編集権限を気にし、セリカは分類欄に当てはまらない入力で止まる。',
    setupDialogue: [
      'セン「本にはこう書いてあります。ただし、決着したこととは別です」',
      'マドカ「みんな中心しか見てないから、端を見るの」',
      'イオ「内容は合ってる。今はね。誰が直せる？」',
      'セリカ「選ぶ前に、欄が足りない可能性を見たい」',
    ] as const,
    plausibleMisread:
      '四人それぞれの職人気質・観察癖・管理癖・融通の利かなさに見える。',
    counterScene:
      '同じ事件について、教科書・写真・データベース・申請フォームがすべて「間違ってはいない」のに、記録できる範囲と分類欄が違うため結論だけ食い違う。',
    evidenceGate: [
      '版・撮影範囲・編集履歴・分類schemaのSource',
      '資料群が同じ原典へ依存していないかの確認',
      '分類外の事例が古い記録にも存在すること',
      'Authorityと真実を同一視しない世界ルール',
    ] as const,
    payoffScene:
      '欠けていた情報ではなく「誰が、何を、どこまで記録・分類できたか」の差がMain Mysteryを解く鍵になる。',
    payoffDialogue: [
      'マドカ「写ってないんじゃない。外にいたんだ」',
      'セン「資料が嘘だったわけではありません」',
      'イオ「権限の外だった、ってことか」',
      'セリカ「欄がなかっただけで、いなかったことにはならない」',
    ] as const,
    storyFunction:
      'Main Mysteryを「隠された真実」一辺倒にせず、正しい部分記録と分類枠のズレから解く構造を作る。',
    forbiddenShortcut:
      '陰謀・改ざん・悪意を自動原因にせず、分類外＝異常・虚偽とも決めず、観察力やAuthorityを全知化しない。',
  } as const;
});

const sceneSeedIds = new Set(CHARACTER_ERA_SCENE_SEEDS.map((entry) => entry.id));
const participantCounts = new Map<string, number>();
for (const chain of CHARACTER_CROSS_ERA_ECHO_CHAINS) {
  for (const participantId of chain.participantIds) {
    participantCounts.set(participantId, (participantCounts.get(participantId) ?? 0) + 1);
  }
}

export const CHARACTER_CROSS_ERA_ECHO_COVERAGE = CHARACTER_ERA_SCENE_SEEDS.map((entry) => ({
  id: entry.id,
  chainCount: participantCounts.get(entry.id) ?? 0,
  covered: (participantCounts.get(entry.id) ?? 0) > 0,
}));

export const CROSS_ERA_ECHO_CHAIN_INTEGRITY = CHARACTER_CROSS_ERA_ECHO_CHAINS.map((chain) => ({
  id: chain.id,
  participantsResolvable: chain.participantIds.every((id) => sceneSeedIds.has(id)),
  sourceSeedsResolvable: chain.sourceSceneSeedIds.every((id) => sceneSeedIds.has(id)),
}));
