import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  CHARACTER_REFERENCE_HANDOFF_POLICY,
  characterReferenceGenerationHandoff,
  type CharacterReferenceGenerationHandoffItem,
} from '../../../src/game/data/characterReferenceGenerationHandoff.ts';

type PriorityArg = 'P0' | 'P1' | 'P2' | 'all';
type FormatArg = 'markdown' | 'json';

type CliOptions = {
  priority: PriorityArg;
  format: FormatArg;
  output: string | null;
};

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    priority: 'P0',
    format: 'markdown',
    output: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--') continue;
    if (arg === '--priority') {
      const value = args[index + 1] as PriorityArg | undefined;
      if (!value || !['P0', 'P1', 'P2', 'all'].includes(value)) {
        throw new Error('--priority requires P0, P1, P2, or all');
      }
      options.priority = value;
      index += 1;
      continue;
    }
    if (arg === '--format') {
      const value = args[index + 1] as FormatArg | undefined;
      if (!value || !['markdown', 'json'].includes(value)) {
        throw new Error('--format requires markdown or json');
      }
      options.format = value;
      index += 1;
      continue;
    }
    if (arg === '--output') {
      const value = args[index + 1];
      if (!value) throw new Error('--output requires a path');
      options.output = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function selectEntries(priority: PriorityArg): CharacterReferenceGenerationHandoffItem[] {
  return priority === 'all'
    ? characterReferenceGenerationHandoff
    : characterReferenceGenerationHandoff.filter((entry) => entry.priority === priority);
}

function markdownForEntry(entry: CharacterReferenceGenerationHandoffItem): string {
  const lines = [
    `## ${entry.priority} — ${entry.displayName} (${entry.characterId})`,
    '',
    `- Mode: \`${entry.mode}\``,
    `- Output: \`${entry.outputPath}\``,
    `- Approval after generation: \`${entry.approvalStateAfterGeneration}\``,
    `- Reason: ${entry.reason}`,
    `- Downstream: ${entry.downstreamRule}`,
  ];

  if (entry.existingMasterPath) {
    lines.push(`- Existing master: \`${entry.existingMasterPath}\``);
  }
  if (entry.sizeSpec) {
    lines.push(`- Size: ${entry.sizeSpec}`);
  }

  if (entry.mode === 'generate') {
    lines.push(
      '',
      '### Prompt',
      '',
      '```text',
      entry.prompt ?? '',
      '```',
      '',
      '### Negative prompt',
      '',
      '```text',
      entry.negativePrompt ?? '',
      '```',
    );
  }

  lines.push('', '### Review checklist', '');
  for (const item of entry.reviewChecklist) lines.push(`- [ ] ${item}`);

  return lines.join('\n');
}

function renderMarkdown(entries: CharacterReferenceGenerationHandoffItem[], priority: PriorityArg): string {
  return [
    '# ヨルノシルベ Character Reference Generation Handoff',
    '',
    `Priority: **${priority}**`,
    '',
    '> このhandoffはCurrent production dataから都度生成する。画像生成後はcandidate review requiredであり、runtime/final approvalではない。',
    '>',
    '> 特にハナ / カナメはplus-size hard lockを維持し、細身化・若返り・bodybuilder化・体型ギャグを禁止する。',
    '',
    `Items: ${entries.length}`,
    '',
    ...entries.flatMap((entry) => [markdownForEntry(entry), '', '---', '']),
  ].join('\n').trimEnd() + '\n';
}

function renderJson(entries: CharacterReferenceGenerationHandoffItem[], priority: PriorityArg): string {
  return `${JSON.stringify({
    schemaVersion: 1,
    generatedBy: 'tools/asset-factory/scripts/export-character-reference-handoff.ts',
    priority,
    policy: CHARACTER_REFERENCE_HANDOFF_POLICY,
    itemCount: entries.length,
    items: entries,
  }, null, 2)}\n`;
}

const options = parseArgs(process.argv.slice(2));
const entries = selectEntries(options.priority);
if (entries.length === 0) throw new Error(`No character reference handoff entries for ${options.priority}`);

const output = options.format === 'json'
  ? renderJson(entries, options.priority)
  : renderMarkdown(entries, options.priority);

if (options.output) {
  mkdirSync(dirname(options.output), { recursive: true });
  writeFileSync(options.output, output);
  console.log(`character reference handoff exported: ${options.output}`);
} else {
  process.stdout.write(output);
}
