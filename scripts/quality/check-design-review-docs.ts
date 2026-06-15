import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

type Finding = {
  file: string;
  message: string;
};

const REVIEW_ROOT = 'docs/reviews';
const IGNORED_DIRS = new Set(['templates', 'bad-examples']);

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];

  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (!IGNORED_DIRS.has(entry)) out.push(...walk(path));
      continue;
    }
    if (entry.endsWith('.md')) out.push(path);
  }
  return out;
}

function isDesignReview(text: string): boolean {
  const markers = [
    'Design role',
    'Current score',
    'Target score',
    'Missing points for 80',
    'A/B/C',
    'production-candidate',
    'pro app quality',
  ];
  return markers.some((marker) => text.includes(marker));
}

function hasAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

const requiredSections = [
  { name: 'Current score', terms: ['Current score', 'current score'] },
  { name: 'Target score', terms: ['Target score', 'target score'] },
  { name: 'Missing points for 80', terms: ['Missing points for 80', 'not 80 yet', 'what is missing for 80'] },
  { name: 'Keep', terms: ['Keep', 'keep:'] },
  { name: 'Discard', terms: ['Discard', 'discard:'] },
  { name: 'Final decision', terms: ['Final decision', 'Decision', 'final decision'] },
];

function parseScore(text: string, labels: string[]): number | null {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = text.match(new RegExp(`${escaped}[^0-9]{0,24}(\\d{1,3})`, 'i'));
    if (match) return Number(match[1]);
  }
  return null;
}

const findings: Finding[] = [];
const files = walk(REVIEW_ROOT);
let checked = 0;

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (!isDesignReview(text)) continue;

  checked += 1;

  for (const section of requiredSections) {
    if (!hasAny(text, section.terms)) {
      findings.push({ file, message: `missing ${section.name}` });
    }
  }

  if (!hasAny(text, ['A/B/C', 'iteration history', 'Iteration history', 'v1', 'v2'])) {
    findings.push({ file, message: 'missing A/B/C comparison or iteration history' });
  }

  if (text.includes('production-candidate')) {
    const targetScore = parseScore(text, ['Target score', 'target score']);
    const currentScore = parseScore(text, ['Current score', 'current score']);
    const bestScore = Math.max(targetScore ?? 0, currentScore ?? 0);

    if (bestScore < 80) {
      findings.push({ file, message: 'production-candidate requires score >= 80' });
    }

    for (const evidence of ['Production touched', 'source', 'preview', 'review']) {
      if (!text.toLowerCase().includes(evidence.toLowerCase())) {
        findings.push({ file, message: `production-candidate missing evidence: ${evidence}` });
      }
    }
  }
}

if (findings.length > 0) {
  console.error('design review verification failed');
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.message}`);
  }
  process.exit(1);
}

console.log(`design review verification passed: checked ${checked} design review docs`);
