import { existsSync, readFileSync } from 'node:fs';

const DATA_PATH = 'docs/story-map/vamp-pon-story-map-data.json';

type Character = {
  id: string;
  name: string;
  season: 's1' | 'future';
  status: 'design-now' | 'trace-only' | 'future-seed' | 'locked';
  lineage: string[];
  vessel: string;
  role: string;
  first: string;
  yui: string;
  other: string;
  items: string[];
  blank: string;
  happy: string;
  next: string;
  reviewDoc?: string;
  previewPath?: string;
  pos?: { x: number; y: number };
};

type StoryMapData = {
  characters: Character[];
  items: string[][];
  readings: string[][];
  edges: string[][];
  backlog: string[][];
};

const allowedLineages = new Set(['fire', 'water', 'light', 'dark', 'neutral', 'lightning', 'multi']);
const allowedSeasons = new Set(['s1', 'future']);
const allowedStatuses = new Set(['design-now', 'trace-only', 'future-seed', 'locked']);

function fail(message: string): never {
  console.error(`[story-map] ${message}`);
  process.exit(1);
}

function warn(message: string): void {
  console.warn(`[story-map:warn] ${message}`);
}

function assertString(value: unknown, label: string): void {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(`${label} must be a non-empty string`);
  }
}

if (!existsSync(DATA_PATH)) {
  fail(`${DATA_PATH} does not exist`);
}

let parsed: StoryMapData;
try {
  parsed = JSON.parse(readFileSync(DATA_PATH, 'utf8')) as StoryMapData;
} catch (error) {
  fail(`failed to parse ${DATA_PATH}: ${String(error)}`);
}

if (!Array.isArray(parsed.characters) || parsed.characters.length === 0) {
  fail('characters must be a non-empty array');
}
if (!Array.isArray(parsed.items)) fail('items must be an array');
if (!Array.isArray(parsed.readings)) fail('readings must be an array');
if (!Array.isArray(parsed.edges)) fail('edges must be an array');
if (!Array.isArray(parsed.backlog)) fail('backlog must be an array');

const ids = new Set<string>();
const vessels = new Map<string, string>();
let designNowCount = 0;
let yuiSeen = false;

for (const character of parsed.characters) {
  assertString(character.id, 'character.id');
  assertString(character.name, `${character.id}.name`);
  assertString(character.vessel, `${character.id}.vessel`);
  assertString(character.role, `${character.id}.role`);
  assertString(character.first, `${character.id}.first`);
  assertString(character.yui, `${character.id}.yui`);
  assertString(character.other, `${character.id}.other`);
  assertString(character.blank, `${character.id}.blank`);
  assertString(character.happy, `${character.id}.happy`);
  assertString(character.next, `${character.id}.next`);

  if (ids.has(character.id)) fail(`duplicate character id: ${character.id}`);
  ids.add(character.id);

  if (!allowedSeasons.has(character.season)) fail(`${character.id}.season is invalid: ${character.season}`);
  if (!allowedStatuses.has(character.status)) fail(`${character.id}.status is invalid: ${character.status}`);
  if (!Array.isArray(character.lineage) || character.lineage.length === 0) fail(`${character.id}.lineage must be non-empty`);
  for (const lineage of character.lineage) {
    if (!allowedLineages.has(lineage)) fail(`${character.id}.lineage has invalid value: ${lineage}`);
  }
  if (!Array.isArray(character.items) || character.items.length === 0) fail(`${character.id}.items must be non-empty`);

  if (character.id === 'yui') {
    yuiSeen = true;
    if (character.vessel !== 'lantern') fail('Yui vessel must remain lantern');
    if (!character.lineage.includes('fire')) fail('Yui lineage must include fire');
  }

  if (character.status === 'design-now') designNowCount += 1;

  const existing = vessels.get(character.vessel);
  if (existing) {
    warn(`vessel is shared by ${existing} and ${character.id}: ${character.vessel}. This must be intentional.`);
  } else {
    vessels.set(character.vessel, character.id);
  }

  if (character.pos) {
    if (typeof character.pos.x !== 'number' || typeof character.pos.y !== 'number') {
      fail(`${character.id}.pos must use numeric x/y`);
    }
  }
}

if (!yuiSeen) fail('Yui node is missing');
if (designNowCount !== 1) fail(`exactly one design-now node expected, got ${designNowCount}`);

for (const [index, edge] of parsed.edges.entries()) {
  if (!Array.isArray(edge) || edge.length !== 3) fail(`edges[${index}] must be [from,to,relation]`);
  const [from, to, relation] = edge;
  if (!ids.has(from)) fail(`edges[${index}] unknown from id: ${from}`);
  if (!ids.has(to)) fail(`edges[${index}] unknown to id: ${to}`);
  assertString(relation, `edges[${index}].relation`);
}

for (const [index, row] of parsed.items.entries()) {
  if (!Array.isArray(row) || row.length !== 3) fail(`items[${index}] must be [item,owner,meaning]`);
  row.forEach((value, column) => assertString(value, `items[${index}][${column}]`));
}

for (const [index, row] of parsed.readings.entries()) {
  if (!Array.isArray(row) || row.length !== 3) fail(`readings[${index}] must be [type,wrongReading,releasedClue]`);
  row.forEach((value, column) => assertString(value, `readings[${index}][${column}]`));
}

for (const [index, row] of parsed.backlog.entries()) {
  if (!Array.isArray(row) || row.length !== 3) fail(`backlog[${index}] must be [priority,target,nextAction]`);
  const [priority, target, action] = row;
  if (!['high', 'mid', 'low'].includes(priority)) fail(`backlog[${index}] invalid priority: ${priority}`);
  assertString(target, `backlog[${index}].target`);
  assertString(action, `backlog[${index}].action`);
}

console.log(`[story-map] ok: ${parsed.characters.length} characters, ${parsed.edges.length} edges, ${parsed.items.length} item rows`);
