import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

type Finding = {
  file: string;
  line: number;
  message: string;
};

const explicitFiles = [
  'docs/unity-visual-art-direction-lock-2026-06-30.md',
  'docs/unity-asset-intake-gate-2026-06-30.md',
  'docs/unity-sprite-import-policy-2026-06-30.md',
  'docs/unity-u5-1-quality-gate-review-2026-06-30.md',
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

const files = Array.from(new Set([...explicitFiles, ...listFutureUnityU6Docs()]));
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
      if (line.includes(rule.term)) {
        findings.push({
          file,
          line: index + 1,
          message: `${rule.message}: found "${rule.term}"`,
        });
      }
    }
  });
}

if (findings.length > 0) {
  console.error('unity term lock check failed');
  for (const finding of findings) {
    const location = finding.line > 0 ? `${finding.file}:${finding.line}` : finding.file;
    console.error(`- ${location}: ${finding.message}`);
  }
  process.exit(1);
}

console.log(`unity term lock check passed: checked ${files.length} file(s)`);
