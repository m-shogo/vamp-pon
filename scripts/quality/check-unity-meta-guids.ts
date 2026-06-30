import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

type GuidEntry = {
  guid: string;
  file: string;
};

const ROOT = 'unity/VampPonUnity/Assets';

const forbiddenGuidOwners = new Map<string, string>([
  ['162bc33ae33a44171b4f496cb32f0af1', 'deleted ZenMaruGothic-Medium SDF.asset.meta'],
  ['5ea0edc50c66943bab163d794665266a', 'deleted Resources/ZenMaruGothic-Medium SDF.asset.meta'],
]);

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];

  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      files.push(...walk(path));
      continue;
    }

    if (entry.endsWith('.meta')) {
      files.push(path);
    }
  }

  return files;
}

function extractGuid(file: string): string | null {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^guid:\s*([0-9a-fA-F]{32})$/m);
  return match ? match[1].toLowerCase() : null;
}

const entries: GuidEntry[] = [];
for (const file of walk(ROOT)) {
  const guid = extractGuid(file);
  if (guid != null) {
    entries.push({ guid, file: relative('.', file) });
  }
}

const byGuid = new Map<string, string[]>();
for (const entry of entries) {
  byGuid.set(entry.guid, [...(byGuid.get(entry.guid) ?? []), entry.file]);
}

const failures: string[] = [];
for (const [guid, files] of byGuid.entries()) {
  if (files.length > 1) {
    failures.push(`duplicate guid ${guid}: ${files.join(', ')}`);
  }
}

for (const [guid, owner] of forbiddenGuidOwners.entries()) {
  const files = byGuid.get(guid);
  if (files != null && files.length > 0) {
    failures.push(`forbidden reused guid ${guid} from ${owner}: ${files.join(', ')}`);
  }
}

if (failures.length > 0) {
  console.error('unity meta guid check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`unity meta guid check passed: ${entries.length} meta guid(s), ${byGuid.size} unique guid(s)`);
