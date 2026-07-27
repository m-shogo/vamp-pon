import { readFileSync } from 'node:fs';

export const currentStatePath = 'docs/design-targets/generated/unity-current-state/state.json';

export const activeCurrentStateDocuments = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'docs/00-index.md',
  'docs/181-current-production-canon.md',
  'docs/agent-pr-workflow.md',
  'docs/mobile-release-qa-gates.md',
  'docs/unity-big-implementation-control-center-v1.md',
  'docs/unity-current-doc-index-2026-07-10.md',
  'docs/unity-mobile-performance-budget.md',
  'docs/unity-responsive-screen-policy.md',
  'docs/unity-runtime-visual-readiness-gate-v1.md',
  'docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md',
  'docs/visual-qa-gates.md',
] as const;

export const currentStateKeys = [
  'schemaVersion',
  'currentPhase',
  'nextPhase',
  'thenPhase',
  'runtimeVisualReady',
  'physicalDeviceReady',
  'devicePlayableReady',
  'audioMixerImplemented',
  'audioMixerDeviceVerified',
  'audioReady',
  'audioLatencyMeasured',
  'hapticReady',
  'hapticMeasured',
  'u50ThresholdsDefined',
  'mobileMetricsReady',
  'rcReady',
  'productionApproved',
] as const;

export type CurrentState = {
  [K in (typeof currentStateKeys)[number]]: K extends 'schemaVersion'
    ? number
    : K extends 'currentPhase' | 'nextPhase' | 'thenPhase'
      ? string
      : boolean;
};

const beginMarker = '<!-- CURRENT_STATE_BEGIN -->';
const endMarker = '<!-- CURRENT_STATE_END -->';

function count(source: string, needle: string): number {
  return source.split(needle).length - 1;
}

function assertExactKeys(value: Record<string, unknown>, label: string): void {
  const expected = new Set<string>(currentStateKeys);
  const actual = Object.keys(value);
  const unknown = actual.filter((key) => !expected.has(key));
  const missing = currentStateKeys.filter((key) => !(key in value));
  if (unknown.length > 0) throw new Error(`${label}: unknown current-state key(s): ${unknown.join(', ')}`);
  if (missing.length > 0) throw new Error(`${label}: missing current-state key(s): ${missing.join(', ')}`);
}

function parseFlatJsonWithDuplicateGuard(jsonSource: string, label: string): CurrentState {
  const keys = [...jsonSource.matchAll(/^\s*"([^"]+)"\s*:/gm)].map((match) => match[1]);
  const duplicates = [...new Set(keys.filter((key, index) => keys.indexOf(key) !== index))];
  if (duplicates.length > 0) throw new Error(`${label}: duplicate current-state key(s): ${duplicates.join(', ')}`);

  let value: unknown;
  try {
    value = JSON.parse(jsonSource);
  } catch (error) {
    throw new Error(`${label}: malformed current-state JSON: ${(error as Error).message}`);
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label}: current-state block must be a JSON object`);
  }
  assertExactKeys(value as Record<string, unknown>, label);
  return value as CurrentState;
}

export function readCanonicalCurrentState(): CurrentState {
  return parseFlatJsonWithDuplicateGuard(readFileSync(currentStatePath, 'utf8'), currentStatePath);
}

export function parseDocumentCurrentState(path: string): CurrentState {
  const source = readFileSync(path, 'utf8');
  if (count(source, beginMarker) !== 1 || count(source, endMarker) !== 1) {
    throw new Error(`${path}: current-state markers must each appear exactly once`);
  }
  const begin = source.indexOf(beginMarker) + beginMarker.length;
  const end = source.indexOf(endMarker);
  if (begin >= end) throw new Error(`${path}: malformed current-state marker order`);
  const block = source.slice(begin, end).trim();
  const match = block.match(/^```json\s*\n([\s\S]*?)\n```$/);
  if (!match) throw new Error(`${path}: current-state block must contain exactly one fenced JSON object`);
  return parseFlatJsonWithDuplicateGuard(match[1], path);
}

export function assertActiveCurrentStateDocuments(): void {
  const canonical = readCanonicalCurrentState();
  const canonicalText = JSON.stringify(canonical);
  for (const path of activeCurrentStateDocuments) {
    const documentState = parseDocumentCurrentState(path);
    if (JSON.stringify(documentState) !== canonicalText) {
      throw new Error(`${path}: current-state block does not exactly match ${currentStatePath}`);
    }
  }
}
