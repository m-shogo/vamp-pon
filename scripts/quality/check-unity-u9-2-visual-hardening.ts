import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const unity = resolve(root, "unity/VampPonUnity");

let ok = true;
function check(label: string, condition: boolean) {
  if (!condition) {
    console.error(`FAIL: ${label}`);
    ok = false;
  }
}

// Review doc
check(
  "U9.2 review doc exists",
  existsSync(
    resolve(
      root,
      "docs/unity-u9-2-font-prefab-visual-hardening-review-2026-06-30.md"
    )
  )
);

// Screenshots
const ssDir = resolve(
  root,
  "docs/design-targets/generated/unity-u9-2/screenshots"
);
const requiredScreenshots = [
  "u9-2-result-proof-390x844.png",
  "u9-2-result-proof-360x800.png",
  "u9-2-result-proof-430x932.png",
  "u9-2-stageselect-proof-route-a-390x844.png",
  "u9-2-stageselect-proof-route-a-360x800.png",
  "u9-2-stageselect-proof-route-a-430x932.png",
  "u9-2-stageselect-proof-route-b-390x844.png",
  "u9-2-stageselect-proof-route-b-360x800.png",
  "u9-2-stageselect-proof-route-b-430x932.png",
  "u9-2-kokuyou-rare-proof-390x844.png",
];
for (const f of requiredScreenshots) {
  check(`screenshot ${f}`, existsSync(resolve(ssDir, f)));
}

// TMP SDF Font Asset
check(
  "ZenMaruGothic SDF asset exists",
  existsSync(
    resolve(
      unity,
      "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset"
    )
  )
);

// Font license
check(
  "ZenMaruGothic LICENSE exists",
  existsSync(
    resolve(unity, "Assets/_Project/Fonts/ZenMaruGothic/LICENSE.txt")
  )
);

// productionApproved=0 via manifests
import { readFileSync } from "node:fs";

function checkManifestApproved(label: string, path: string) {
  if (!existsSync(path)) {
    check(`${label} manifest exists`, false);
    return;
  }
  const manifest = JSON.parse(readFileSync(path, "utf-8"));
  const items = manifest.items || manifest;
  const approved = Array.isArray(items)
    ? items.filter(
        (i: { productionStatus?: string }) =>
          i.productionStatus === "approved"
      ).length
    : 0;
  check(`${label} productionApproved=0`, approved === 0);
}

checkManifestApproved(
  "U5",
  resolve(
    root,
    "docs/design-targets/generated/unity-u5/u5-visual-candidate-manifest.json"
  )
);
checkManifestApproved(
  "U8",
  resolve(
    root,
    "docs/design-targets/generated/unity-u8/u8-visual-candidate-manifest.json"
  )
);
checkManifestApproved(
  "U8.1",
  resolve(
    root,
    "docs/design-targets/generated/unity-u8-1/u8-1-visual-refinement-manifest.json"
  )
);

// No Addressables
check(
  "no Addressables package",
  !existsSync(resolve(unity, "Assets/AddressableAssetsData"))
);

// No formal Result/StageSelect runtime hook
const scriptsDir = resolve(unity, "Assets/_Project/Scripts");
import { readdirSync } from "node:fs";

function searchFiles(dir: string, pattern: RegExp): boolean {
  if (!existsSync(dir)) return false;
  for (const entry of readdirSync(dir, { withFileTypes: true, recursive: true })) {
    if (entry.isFile() && entry.name.endsWith(".cs") && !entry.name.includes("Editor")) {
      const p = resolve(entry.parentPath || dir, entry.name);
      if (p.includes("/Editor/")) continue;
      if (p.includes("/U14/")) continue;
      if (p.includes("/U18/")) continue;
      const content = readFileSync(p, "utf-8");
      if (pattern.test(content)) return true;
    }
  }
  return false;
}

check(
  "no formal Result scene hook",
  !searchFiles(scriptsDir, /ResultScene|ResultManager|ResultController/)
);
check(
  "no formal StageSelect scene hook",
  !searchFiles(scriptsDir, /StageSelectScene|StageSelectManager|StageSelectController/)
);
check(
  "no kokuyou runtime hook",
  !searchFiles(scriptsDir, /KokuyouRuntime|KokuyouGauge|KokuyouButton/)
);

// No public/assets/sprites usage
check(
  "no public/assets/sprites",
  !existsSync(resolve(root, "public/assets/sprites/active"))
);

// Resources proof-only
for (const d of ["U5Candidates", "U8Candidates", "U8Refined"]) {
  check(
    `Resources/${d} exists (proof-only)`,
    existsSync(resolve(unity, `Assets/_Project/Resources/${d}`))
  );
}

if (ok) {
  console.log(
    `unity U9.2 visual hardening check passed: screenshots=${requiredScreenshots.length}, sdfFont=true, productionApproved=0`
  );
  process.exit(0);
} else {
  process.exit(1);
}
