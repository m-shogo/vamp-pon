// Detects drift between the runtime canonical FireFlipbook anchor and the review pack.
//
// Single source of truth: TopLivingNightView.FinalV3FireAnchor (bottom-referenced).
// The review overlay + incoming/review/fire-anchor.json must be derived from it, the
// bridge/V2 anchor must stay put, and smoke/embers must share the fire delta. Any
// divergence fails CI so the review anchor cannot silently disagree with the runtime.

import { existsSync, readFileSync } from 'node:fs';

const viewPath =
  'unity/VampPonUnity/Assets/_Project/Scripts/UI/Screens/TopLivingNightView.cs';
const anchorJsonPath =
  'docs/design-targets/generated/top-living-night-v3/incoming/review/fire-anchor.json';
const EPS = 1e-4;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function parseAnchor(src: string, name: string): { x: number; y: number } {
  const m = src.match(
    new RegExp(`${name}\\s*=\\s*new Vector2\\(\\s*([0-9.]+)f\\s*,\\s*([0-9.]+)f\\s*\\)`),
  );
  invariant(m, `could not parse ${name} from TopLivingNightView.cs`);
  return { x: Number(m![1]), y: Number(m![2]) };
}

function near(a: number, b: number): boolean {
  return Math.abs(a - b) <= EPS;
}

invariant(existsSync(viewPath), `missing runtime view: ${viewPath}`);
const view = readFileSync(viewPath, 'utf8');

const bridge = parseAnchor(view, 'BridgeFireAnchor');
const final = parseAnchor(view, 'FinalV3FireAnchor');

// 1) Bridge/V2 anchor must not move.
invariant(
  near(bridge.x, 0.5) && near(bridge.y, 0.245),
  `BridgeFireAnchor drifted from (0.5, 0.245): got (${bridge.x}, ${bridge.y})`,
);

// 2) Final anchor must stay in the lower-middle band and above the button-safe zone,
//    matching the candidate fire center (bottom-ref y in (0.245, 0.5)).
invariant(
  final.y > bridge.y + 0.02 && final.y < 0.5,
  `FinalV3FireAnchor bottom-ref y must sit above the bridge and below center: got ${final.y}`,
);

// 3) Fire placement must be gated on the final effect pack (no unconditional move).
invariant(
  view.includes('useFinalEffectPack ? FinalV3FireAnchor : BridgeFireAnchor'),
  'FireFlipbook anchor is not gated on useFinalEffectPack',
);

// 4) Smoke and embers must share the same fire-center delta.
const smokeIdx = view.indexOf('private void BuildSmoke');
const emberIdx = view.indexOf('private void BuildEmbers');
invariant(smokeIdx >= 0 && emberIdx >= 0, 'BuildSmoke/BuildEmbers not found');
const smokeBody = view.slice(smokeIdx, emberIdx);
const emberBody = view.slice(emberIdx);
invariant(
  smokeBody.includes('FinalEffectPackAnchorDeltaPixels()'),
  'smoke does not apply the shared fire-center delta',
);
invariant(
  emberBody.includes('FinalEffectPackAnchorDeltaPixels()'),
  'embers do not apply the shared fire-center delta',
);

// 5) The review anchor JSON must be derived from the runtime value (no re-definition).
invariant(existsSync(anchorJsonPath), `missing review anchor json: ${anchorJsonPath}`);
const anchor = JSON.parse(readFileSync(anchorJsonPath, 'utf8'));
const rb = anchor.runtimeFinalFireAnchorBottomRef;
const rt = anchor.reviewFireAnchorTopRef;
invariant(rb && rt, 'fire-anchor.json missing anchor fields');
invariant(
  near(rb.x, final.x) && near(rb.y, final.y),
  `review bottom-ref anchor drifted from runtime FinalV3FireAnchor: json=(${rb.x}, ${rb.y}) runtime=(${final.x}, ${final.y})`,
);
invariant(
  near(rt.x, final.x) && near(rt.y, 1 - final.y),
  `review top-ref anchor is not 1-bottomRef: json=(${rt.x}, ${rt.y}) expected=(${final.x}, ${1 - final.y})`,
);

console.log(
  `TOP fire-anchor drift check: PASS (bridge=(${bridge.x},${bridge.y}) final-bottomRef=(${final.x},${final.y}) review-topRef=(${rt.x},${rt.y}))`,
);
