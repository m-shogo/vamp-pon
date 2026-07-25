import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

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
];

const activeFiles = [
  'README.md',
  'AGENTS.md',
  'CLAUDE.md',
  'docs/00-index.md',
  'docs/181-current-production-canon.md',
  'docs/agent-pr-workflow.md',
  'docs/mobile-release-qa-gates.md',
  'docs/unity-current-doc-index-2026-07-10.md',
  'docs/unity-mobile-performance-budget.md',
  'docs/unity-runtime-visual-readiness-gate-v1.md',
  'docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md',
  'docs/visual-qa-gates.md',
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
    file: 'docs/unity-current-doc-index-2026-07-10.md',
    required: [
      'docs/unity-mobile-performance-budget.md',
      'docs/mobile-release-qa-gates.md',
    ],
    forbidden: [],
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

const files = Array.from(new Set([...explicitFiles, ...activeFiles, ...listFutureUnityU6Docs()]));
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
    findings.push({ file: contract.file, line: 0, message: 'current mobile contract file is missing' });
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
  console.error('unity term and active mobile contract check failed');
  for (const finding of findings) {
    const location = finding.line > 0 ? `${finding.file}:${finding.line}` : finding.file;
    console.error(`- ${location}: ${finding.message}`);
  }
  process.exit(1);
}

console.log(`unity term and active mobile contract check passed: checked ${files.length} term-lock file(s) and ${contentContracts.length} current contract(s)`);
