import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const manifestPath = join(
  root,
  'docs/design-targets/generated/loading-seasonal-v1/manifest.json',
);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
  assets: Array<{
    id: string;
    sourcePath: string;
    resourceFile: string;
  }>;
};

const result = manifest.assets.map((asset) => {
  const data = readFileSync(join(root, asset.sourcePath));
  return {
    id: asset.id,
    sourcePath: asset.sourcePath,
    resourceFile: asset.resourceFile,
    bytes: data.length,
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    sha256: createHash('sha256').update(data).digest('hex'),
  };
});

console.log('BEGIN_LOADING_SOURCE_PROVENANCE');
console.log(JSON.stringify(result, null, 2));
console.log('END_LOADING_SOURCE_PROVENANCE');
