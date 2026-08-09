import { describe, expect, it } from 'vitest';
import {
  currentStateKeys,
  parseDocumentCurrentStateSource,
  readCanonicalCurrentState,
} from './unity-current-state.ts';

const canonical = readCanonicalCurrentState();
const block = (json: string) =>
  `before\n<!-- CURRENT_STATE_BEGIN -->\n\`\`\`json\n${json}\n\`\`\`\n<!-- CURRENT_STATE_END -->\nafter`;

describe('Unity current-state structural guard', () => {
  it('accepts the canonical state with exact markers and keys', () => {
    expect(parseDocumentCurrentStateSource(block(JSON.stringify(canonical, null, 2)), 'valid')).toEqual(canonical);
  });

  it('rejects duplicate markers', () => {
    const source = `${block(JSON.stringify(canonical, null, 2))}\n<!-- CURRENT_STATE_BEGIN -->`;
    expect(() => parseDocumentCurrentStateSource(source, 'duplicate-markers')).toThrow('markers must each appear exactly once');
  });

  it('rejects duplicate JSON keys before JSON.parse can hide them', () => {
    const json = JSON.stringify(canonical, null, 2).replace(
      '"runtimeVisualReady": true,',
      '"runtimeVisualReady": true,\n  "runtimeVisualReady": false,',
    );
    expect(() => parseDocumentCurrentStateSource(block(json), 'duplicate-key')).toThrow('duplicate current-state key');
  });

  it('rejects missing and unknown keys', () => {
    const { rcReady: _removed, ...missing } = canonical;
    expect(() => parseDocumentCurrentStateSource(block(JSON.stringify(missing, null, 2)), 'missing-key')).toThrow('missing current-state key');
    expect(() => parseDocumentCurrentStateSource(
      block(JSON.stringify({ ...canonical, inventedReady: true }, null, 2)),
      'unknown-key',
    )).toThrow('unknown current-state key');
  });

  it('keeps the canonical schema key registry unique', () => {
    expect(new Set(currentStateKeys).size).toBe(currentStateKeys.length);
  });
});
