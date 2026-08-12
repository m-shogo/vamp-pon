import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
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

type LivingVisualProfile = Record<string, unknown> & {
  id: string;
  name?: string;
};

type ResolvedCharacterReferenceGenerationHandoffItem = CharacterReferenceGenerationHandoffItem & {
  livingVisualProfile: LivingVisualProfile;
  livingVisualProfileSourceStatus: string | null;
  prompt: string | null;
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

const profileDocumentCache = new Map<string, any>();

function loadLivingVisualProfile(entry: CharacterReferenceGenerationHandoffItem): {
  profile: LivingVisualProfile;
  sourceStatus: string | null;
} {
  const filePath = resolve(process.cwd(), entry.livingVisualProfilePath);
  let document = profileDocumentCache.get(filePath);
  if (!document) {
    document = JSON.parse(readFileSync(filePath, 'utf8'));
    profileDocumentCache.set(filePath, document);
  }

  const profile = (document.characters ?? []).find((candidate: LivingVisualProfile) => candidate.id === entry.characterId);
  if (!profile) {
    throw new Error(
      `Living Visual Profile missing for ${entry.characterId} in ${entry.livingVisualProfilePath}; export blocked.`,
    );
  }

  return {
    profile,
    sourceStatus: typeof document.status === 'string' ? document.status : null,
  };
}

function livingVisualPromptBlock(entry: CharacterReferenceGenerationHandoffItem, profile: LivingVisualProfile): string {
  return [
    'LIVING VISUAL PROFILE — REQUIRED CHARACTER AUTHORITY.',
    `Source: ${entry.livingVisualProfilePath}.`,
    'Treat USER_CONFIRMED / CURRENT_CANON / APPEARANCE_SOURCE / HUMAN_APPROVED_VISUAL as stronger than AUTHOR_CANDIDATE.',
    'AUTHOR_CANDIDATE values are active production constraints for this candidate, but are not silently promoted to user-confirmed canon.',
    'Do not invent any missing piercing, tattoo, scar, mole, freckles, jewelry, gem, gold trim, belt, harness, makeup, nail art, skin exposure, or body modification.',
    'Do not replace established clothing construction with generic fantasy/gacha clothing.',
    'If a required life-preference field is genuinely unresolved, stop rather than filling it with a model default.',
    JSON.stringify(profile, null, 2),
  ].join('\n');
}

function resolveEntry(entry: CharacterReferenceGenerationHandoffItem): ResolvedCharacterReferenceGenerationHandoffItem {
  const { profile, sourceStatus } = loadLivingVisualProfile(entry);
  const prompt = entry.mode === 'generate' && entry.prompt
    ? [entry.prompt, '', livingVisualPromptBlock(entry, profile)].join('\n')
    : entry.prompt;

  return {
    ...entry,
    prompt,
    livingVisualProfile: profile,
    livingVisualProfileSourceStatus: sourceStatus,
  };
}

function markdownForEntry(entry: ResolvedCharacterReferenceGenerationHandoffItem): string {
  const lines = [
    `## ${entry.priority} — ${entry.displayName} (${entry.characterId})`,
    '',
    `- Mode: \`${entry.mode}\``,
    `- Output: \`${entry.outputPath}\``,
    `- Approval after generation: \`${entry.approvalStateAfterGeneration}\``,
    `- Reason: ${entry.reason}`,
    `- Downstream: ${entry.downstreamRule}`,
    `- Living Visual Profile: \`${entry.livingVisualProfilePath}\``,
    `- Living Visual Profile required: \`${entry.livingVisualProfileRequired}\``,
    `- Image model may invent unknown life preferences: \`${entry.unknownLifePreferenceMayBeInventedByImageModel}\``,
  ];

  if (entry.existingMasterPath) {
    lines.push(`- Existing master: \`${entry.existingMasterPath}\``);
  }
  if (entry.sizeSpec) {
    lines.push(`- Size: ${entry.sizeSpec}`);
  }

  lines.push('', '### Visual authority read order', '');
  for (const authorityPath of entry.visualAuthorityPaths) lines.push(`1. \`${authorityPath}\``);

  lines.push(
    '',
    '### Resolved Living Visual Profile',
    '',
    '> このprofileはexport時に対象character IDで解決済み。外部画像生成セッションでファイル参照だけにせず、この内容そのものを読む。',
    '',
    '```json',
    JSON.stringify(entry.livingVisualProfile, null, 2),
    '```',
  );

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

function renderMarkdown(entries: ResolvedCharacterReferenceGenerationHandoffItem[], priority: PriorityArg): string {
  return [
    '# ヨルノシルベ Character Reference Generation Handoff',
    '',
    `Priority: **${priority}**`,
    '',
    '> このhandoffはCurrent production data + 対象人物のLiving Visual Profileから都度生成する。',
    '> 画像生成後はcandidate review requiredであり、runtime/final approvalではない。',
    '>',
    '> 未設定のpiercing / tattoo / exposure / ornament / clothing vocabularyをAIの「それっぽさ」で補完しない。',
    '> 特にハナ / カナメはplus-size hard lockを維持し、細身化・若返り・bodybuilder化・体型ギャグを禁止する。',
    '',
    `Items: ${entries.length}`,
    '',
    ...entries.flatMap((entry) => [markdownForEntry(entry), '', '---', '']),
  ].join('\n').trimEnd() + '\n';
}

function renderJson(entries: ResolvedCharacterReferenceGenerationHandoffItem[], priority: PriorityArg): string {
  return `${JSON.stringify({
    schemaVersion: 2,
    generatedBy: 'tools/asset-factory/scripts/export-character-reference-handoff.ts',
    priority,
    policy: CHARACTER_REFERENCE_HANDOFF_POLICY,
    livingVisualProfilesResolvedAtExport: true,
    itemCount: entries.length,
    items: entries,
  }, null, 2)}\n`;
}

const options = parseArgs(process.argv.slice(2));
const selectedEntries = selectEntries(options.priority);
if (selectedEntries.length === 0) throw new Error(`No character reference handoff entries for ${options.priority}`);

const entries = selectedEntries.map(resolveEntry);
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
