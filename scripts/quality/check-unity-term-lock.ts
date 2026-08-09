import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { activeCurrentStateDocuments } from './unity-current-state.ts';

type Finding = {
  file: string;
  line: number;
  message: string;
};

type ContentContract = {
  file: string;
  required: string[];
  forbidden: string[];
};

const explicitFiles = [
  'docs/unity-visual-art-direction-lock-2026-06-30.md',
  'docs/unity-asset-intake-gate-2026-06-30.md',
  'docs/unity-sprite-import-policy-2026-06-30.md',
  'docs/unity-u5-1-quality-gate-review-2026-06-30.md',
  'src/game/data/achievements.ts',
  'src/game/data/collectionProgress.ts',
  'src/game/data/collectionSections.ts',
  'src/game/data/keeperRecords.ts',
  'src/game/persistence/profile.ts',
];

const contentContracts: ContentContract[] = [
  {
    file: 'docs/mobile-release-qa-gates.md',
    required: [
      'Status: current iOS release QA source',
      'Current: U49 actual-device audio/haptic',
      'Next: U50 device performance/touch metrics',
      'Then: U51 RC',
      'Compact: 360x800 / 375x812',
      'Standard: 390x844 / 393x852',
      'Large: 412x915 / 430x932',
      'audioMixerReady=false',
      'audioLatencyMeasured=false',
      'hapticMeasured=false',
      'mobileMetricsReady=false',
      'productionApproved=false',
      'https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/',
    ],
    forbidden: [
      'Google Play',
      'Android target API',
      'Vamp Ponをスマホ向け',
    ],
  },
  {
    file: 'docs/unity-mobile-performance-budget.md',
    required: [
      'Status: current U50 performance source',
      'Platform: iOS first / iOS-only current product scope',
      '## U50 measurement matrix',
      'p95 frame time',
      'p99 frame time',
      'sustained run',
      'mobileMetricsReady=false',
      'actual-device measurement matrix complete',
      'Premium means controlled, readable, measurable, and responsive on the actual device.',
    ],
    forbidden: [
      'low-end Android',
      'Phone test: at least plausible',
      'Unity 30秒 demo',
    ],
  },
  {
    file: 'docs/unity-responsive-screen-policy.md',
    required: [
      'Status: current iOS responsive source',
      'Platform scope: iOS first / current iOS-only product scope',
      'Compact: 360x800 / 375x812',
      'Standard: 390x844 / 393x852',
      'Large: 412x915 / 430x932',
      'actual-device Safe Area review',
      '390x844は設計のものさし',
    ],
    forbidden: [
      'iPhone / Android',
      'Android common portrait',
      'Android narrow portrait',
      'Android tall portrait',
      'U1 acceptance wording',
    ],
  },
  {
    file: 'docs/unity-current-doc-index-2026-07-10.md',
    required: [
      'docs/unity-mobile-performance-budget.md',
      'docs/mobile-release-qa-gates.md',
      'docs/unity-responsive-screen-policy.md',
    ],
    forbidden: [
      'docs/mobile-release-readiness-checklist.md',
    ],
  },
  {
    file: '.github/workflows/ci.yml',
    required: [
      'fetch-depth: 0',
      'cancel-in-progress: true',
      'timeout-minutes: 20',
      'pnpm implementation:preflight:check',
      'Upload implementation preflight log',
      'Run full implementation preflight',
      'pnpm implementation:preflight:full',
      'Upload full implementation preflight log',
      'Verify Core5 gameplay frames',
      'pnpm enemy48:design:check',
      'pnpm inventory-icons:check',
    ],
    forbidden: [],
  },
  {
    file: 'package.json',
    required: [
      '"named-object:check"',
      'pnpm named-object:check',
      'scripts/quality/check-named-object-registry.ts',
      '"currency-display:codemod:check"',
      '"currency-display:codemod:write"',
      'pnpm currency-display:codemod:check',
      'scripts/migrations/connect-meta-currency-display-surfaces.ts',
    ],
    forbidden: [],
  },
  {
    file: 'scripts/migrations/connect-meta-currency-display-surfaces.ts',
    required: [
      "id: 'migration_authority.flag'",
      "id: 'top.wallet_tag'",
      "id: 'stage_select.reset_refund'",
      "id: 'result.currency_reward'",
      "id: 'profile.currency_gain_upgrade'",
      'post-write verification failed',
      'wallet display codemod is partially applied',
    ],
    forbidden: [
      "candidateDisplay: '灯貨'",
      "currentDisplay: '灯貨'",
    ],
  },
  {
    file: 'src/game/persistence/profile.ts',
    required: [
      "group: '黒耀化'",
      "description: '黒耀化未使用の報酬倍率が増える'",
      'recordRunEarnedMetaCurrency(state.stats, currencyEarned);',
    ],
    forbidden: [
      "group: '黒曜化'",
      '黒曜化未使用の報酬倍率が増える',
    ],
  },
  {
    file: 'src/game/systems/collectionProgress.ts',
    required: [
      "case 'fs_019_collect_100_light_coin': return meetsStage1RunEarnedMetaCurrencyTarget(state.stats);",
    ],
    forbidden: [
      'state.stats.kills * 0.35 + state.stats.memoryFragmentsCollected * 0.7 >= 100',
    ],
  },
  {
    file: 'src/game/data/collectionEconomyTerminology.ts',
    required: [
      'CURRENT_TRACKED_COUNTER_PENDING_NAME',
      'earnedMetaCurrencyThisRun',
      'achievementReward、profile残高、記憶片数からのproxy計算は含めない。',
    ],
    forbidden: [
      'prototype-formula:kills*0.35+memoryFragmentsCollected*0.7',
    ],
  },
];

const allowedCodeNameLine = 'Code names only: Vamp Pon / vanp pon / ヴァンサバ改';

const forbiddenTerms = [
  { term: '黒曜化', message: 'use 黒耀化' },
  { term: 'Vamp Ponの', message: 'use ヨルノシルベ for the work title in Unity-facing docs' },
  { term: 'Vamp Ponらしい', message: 'use ヨルノシルベらしい' },
  { term: 'Vamp Ponを', message: 'do not use Vamp Pon as the work title' },
  { term: 'Vamp Ponは', message: 'do not use Vamp Pon as the work title' },
  { term: 'Vamp Pon visual', message: 'do not use Vamp Pon as the visual direction title' },
  { term: 'Vamp Pon Visual', message: 'do not use Vamp Pon as the visual direction title' },
];

function listFutureUnityU6Docs(): string[] {
  const docsDir = 'docs';
  if (!existsSync(docsDir)) return [];

  return readdirSync(docsDir)
    .map((entry) => join(docsDir, entry))
    .filter((path) => {
      if (!path.match(/^docs\/unity-u6-.*\.md$/)) return false;
      return statSync(path).isFile();
    })
    .sort();
}

function isExplicitCorrection(line: string, term: string): boolean {
  if (term !== '黒曜化') return false;
  if (!line.includes('黒耀化')) return false;
  return /(never|ではなく|use|誤記|禁止|not\s+use|必ず)/i.test(line);
}

const files = Array.from(new Set([...explicitFiles, ...activeCurrentStateDocuments, ...listFutureUnityU6Docs()]));
const findings: Finding[] = [];

for (const file of files) {
  if (!existsSync(file)) {
    findings.push({ file, line: 0, message: 'expected term-lock target file is missing' });
    continue;
  }

  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.includes(allowedCodeNameLine)) return;

    for (const rule of forbiddenTerms) {
      if (line.includes(rule.term) && !isExplicitCorrection(line, rule.term)) {
        findings.push({
          file,
          line: index + 1,
          message: `${rule.message}: found "${rule.term}"`,
        });
      }
    }
  });
}

for (const contract of contentContracts) {
  if (!existsSync(contract.file)) {
    findings.push({ file: contract.file, line: 0, message: 'current contract file is missing' });
    continue;
  }

  const source = readFileSync(contract.file, 'utf8');
  for (const phrase of contract.required) {
    if (!source.includes(phrase)) {
      findings.push({ file: contract.file, line: 0, message: `required current contract phrase is missing: "${phrase}"` });
    }
  }
  for (const phrase of contract.forbidden) {
    if (source.includes(phrase)) {
      findings.push({ file: contract.file, line: 0, message: `obsolete or out-of-scope phrase remains: "${phrase}"` });
    }
  }
}

if (findings.length > 0) {
  console.error('unity term and active contract check failed');
  for (const finding of findings) {
    const location = finding.line > 0 ? `${finding.file}:${finding.line}` : finding.file;
    console.error(`- ${location}: ${finding.message}`);
  }
  process.exit(1);
}

console.log(`unity term and active contract check passed: checked ${files.length} term-lock file(s) and ${contentContracts.length} current contract(s)`);
