import { assetFactoryPromptCatalog, assetFactoryPromptCatalogByType, getAssetFactoryPrompt } from '../../src/game/data/assetFactoryCatalog.ts';
import type { AssetFactoryContentType } from '../../src/game/data/assetFactoryCatalog.ts';

const args = new Map<string, string | boolean>();
for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (!arg?.startsWith('--')) continue;
  const key = arg.slice(2);
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) {
    args.set(key, true);
  } else {
    args.set(key, next);
    i += 1;
  }
}

function usage(): never {
  console.log(`Asset Factory Prompt CLI\n\nUsage:\n  pnpm asset-factory:prompt:list\n  pnpm asset-factory:prompt:list --type character\n  pnpm asset-factory:prompt --key character:yui:sprite_sheet_180\n  pnpm asset-factory:prompt --type enemy --id ombu_small_ink --kind reference\n\nOptions:\n  --type character|enemy|item|stage\n  --id <sourceId>\n  --kind <promptKind>\n  --key <contentType:sourceId:kind>\n  --json\n`);
  process.exit(1);
}

function isContentType(value: unknown): value is AssetFactoryContentType {
  return value === 'character' || value === 'enemy' || value === 'item' || value === 'stage';
}

function printList(): void {
  const type = args.get('type');
  const records = isContentType(type) ? assetFactoryPromptCatalogByType[type] : assetFactoryPromptCatalog;
  const rows = records.map((record) => ({
    key: record.key,
    title: record.title,
    outputPathHint: record.outputPathHint,
  }));
  if (args.has('json')) {
    console.log(JSON.stringify(rows, null, 2));
    return;
  }
  for (const row of rows) {
    console.log(`${row.key}\n  ${row.title}\n  -> ${row.outputPathHint}`);
  }
}

function printPrompt(): void {
  const key = args.get('key');
  const type = args.get('type');
  const id = args.get('id');
  const kind = args.get('kind');

  const record = typeof key === 'string'
    ? assetFactoryPromptCatalog.find((candidate) => candidate.key === key)
    : isContentType(type) && typeof id === 'string' && typeof kind === 'string'
      ? getAssetFactoryPrompt(type, id, kind as never)
      : undefined;

  if (!record) usage();

  if (args.has('json')) {
    console.log(JSON.stringify(record, null, 2));
    return;
  }

  console.log(`# ${record.title}`);
  console.log(`key: ${record.key}`);
  console.log(`output: ${record.outputPathHint}`);
  console.log(`size: ${record.sizeSpec}`);
  console.log('\n## Prompt\n');
  console.log(record.prompt);
  console.log('\n## Negative Prompt\n');
  console.log(record.negativePrompt);
  console.log('\n## Review Checklist\n');
  for (const item of record.reviewChecklist) console.log(`- ${item}`);
}

if (args.has('help')) usage();
if (args.has('list')) printList();
else printPrompt();
