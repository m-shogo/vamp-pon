import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const profilePath = 'data/visual/core5-living-visual-profiles-v1.json';
const queuePath = 'data/visual/all-character-life-choice-author-review-queue-v1.json';
const profileText = readFileSync(resolve(root, profilePath), 'utf8');
const profile = JSON.parse(profileText);
const queue = JSON.parse(readFileSync(resolve(root, queuePath), 'utf8'));
const profileSha256 = createHash('sha256').update(profileText).digest('hex');

const core5 = new Set(queue.core5 ?? []);
const p0Domains = Object.entries(queue.domainPriority ?? {}).filter(([,priority]) => priority === 'P0').map(([domain]) => domain);
const selectors: Record<string,string[]> = {
  bodyAdornment: ['piercingPolicy','tattooPolicy','jewelryPolicy'],
  skinCoverage: ['exposurePreference'],
};

function markerPaths(value: unknown, marker: (text: string) => boolean, prefix = ''): string[] {
  if (typeof value === 'string' && marker(value)) return [prefix];
  if (Array.isArray(value)) return value.flatMap((item,index) => markerPaths(item, marker, `${prefix}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value as Record<string,unknown>).flatMap(([key,item]) => markerPaths(item, marker, prefix ? `${prefix}.${key}` : key));
  return [];
}

const openPaths = (value: unknown, prefix = '') => markerPaths(value, (text) => text.startsWith('OPEN_AUTHOR_DECISION'), prefix);
const pendingReviewPaths = (value: unknown, prefix = '') => markerPaths(value, (text) => text.includes('PENDING_REVIEW'), prefix);

function sourceKinds(value: any): string[] {
  const result = new Set<string>();
  const visit = (node: any) => {
    if (!node || typeof node !== 'object') return;
    if (typeof node.source === 'string') result.add(node.source);
    for (const child of Object.values(node)) visit(child);
  };
  visit(value);
  return [...result].sort();
}

const characters = (profile.characters ?? []).filter((character: any) => core5.has(character.id)).map((character: any) => ({
  id: character.id,
  name: character.name,
  domains: Object.fromEntries(p0Domains.map((domain) => {
    const evidence = Object.fromEntries((selectors[domain] ?? []).map((selector) => {
      const value = character[selector];
      return [selector, {
        present: value !== undefined,
        sourceKinds: sourceKinds(value),
        openAuthorDecisionPaths: openPaths(value, selector),
        pendingReviewPaths: pendingReviewPaths(value, selector),
        value,
      }];
    }));
    return [domain, {
      state: 'AUTHOR_REVIEW_REQUIRED',
      evidence,
      requiresHumanDecision: true,
      canonPromotionBlocked: true,
      imageModelFreedom: false,
      generatedImageMayCloseItem: false,
    }];
  })),
}));

const contract = {
  id: 'yoru-no-shirube-core5-p0-life-choice-review-contract-v1',
  date: '2026-08-14',
  status: 'DERIVED_REVIEW_CONTRACT_NON_CANON',
  sourceProfile: profilePath,
  sourceProfileSha256: profileSha256,
  sourceQueue: queuePath,
  scope: { characterCount: characters.length, domainCount: p0Domains.length, reviewItemCount: characters.length * p0Domains.length },
  policy: {
    noNewCharacterFactsAuthored: true,
    requiresHumanDecision: true,
    canonPromotionBlocked: true,
    imageModelFreedom: false,
    generatedImageMayCloseItem: false,
    openAuthorDecisionPreserved: true,
    pendingReviewPreserved: true,
  },
  characters,
};

const markdown = [
  '# Core5 P0 Life-Choice Review Contract v1','',
  'Status: `DERIVED_REVIEW_CONTRACT_NON_CANON`','',
  'This document exposes existing profile evidence for the ten P0 review items. It does not decide any candidate, absence, placement, count, exposure boundary, OPEN_AUTHOR_DECISION, or pending-review marker.','',
  ...characters.flatMap((character: any) => [
    `## ${character.name} / ${character.id}`,'',
    ...p0Domains.flatMap((domain) => {
      const entry = character.domains[domain];
      return [
        `### ${domain}`,'',
        ...Object.entries(entry.evidence).flatMap(([selector, raw]: any) => [
          `- ${selector}: ${JSON.stringify(raw.value)}`,
          `  - sources: ${raw.sourceKinds.length ? raw.sourceKinds.join(', ') : 'NONE'}`,
          `  - OPEN paths: ${raw.openAuthorDecisionPaths.length ? raw.openAuthorDecisionPaths.join(', ') : 'none'}`,
          `  - pending-review paths: ${raw.pendingReviewPaths.length ? raw.pendingReviewPaths.join(', ') : 'none'}`,
        ]),
        '',
      ];
    }),
  ]),
  '## Review boundary','',
  '- Human/author review may accept, reject, explicitly mark absence, or leave a candidate unresolved.',
  '- Generated images are never evidence and cannot close an item.',
  '- Missing data is not absence.',
  '- OPEN_AUTHOR_DECISION remains open until an explicit authored decision exists.',
  '- PENDING_REVIEW remains pending until explicit human/author review resolves it.','',
].join('\n');

if (process.argv.includes('--emit')) {
  console.log('P0_CONTRACT_JSON_BEGIN');
  console.log(JSON.stringify(contract, null, 2));
  console.log('P0_CONTRACT_JSON_END');
  console.log('P0_CONTRACT_MARKDOWN_BEGIN');
  console.log(markdown);
  console.log('P0_CONTRACT_MARKDOWN_END');
} else {
  console.log(`[core5-p0-life-choice-review] OK: ${contract.scope.reviewItemCount} review items across ${characters.length} characters`);
}
