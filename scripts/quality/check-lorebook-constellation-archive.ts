import fs from 'node:fs';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const archive = JSON.parse(fs.readFileSync('public/lorebook/data/constellation-archive.v1.json', 'utf8'));
const html = fs.readFileSync('public/lorebook/index.html', 'utf8');
const js = fs.readFileSync('public/lorebook/constellation-archive-enhancement.js', 'utf8');

assert(archive.status === 'AUTHOR_READ_MODEL_NON_CANON', 'archive may not become Story authority');
assert(archive.storyClues.length === 8, 'story clue count drift');
assert(archive.storyClues.filter((clue: { tier: string }) => clue.tier === 'S').length === 2, 'S clue count drift');
assert(archive.groupGlossary.some((entry: { term: string; status: string }) => entry.term === '朔夜座' && entry.status === 'CANON_CURRENT'), '朔夜座 Current glossary entry missing');
assert(archive.groupGlossary.some((entry: { term: string; status: string }) => entry.term === '群青残響録' && entry.status === 'CANON_CURRENT'), '群青残響録 Current glossary entry missing');
assert(archive.groupGlossary.some((entry: { term: string; status: string }) => entry.term === '外典星座' && entry.status === 'CANDIDATE'), '外典星座 must remain Candidate');
assert(archive.rules.includes('外典星座 is CANDIDATE and must not replace 朔夜座'), '朔夜座 replacement guard missing');
assert(archive.rules.includes('obsolete constellation != evil'), 'obsolete/evil guard missing');
assert(archive.rules.some((rule: string) => rule.includes('Tomori') && rule.includes('Present Yui')), 'Tomori/Yui false official-list guard missing');
assert(archive.entries.some((entry: { id: string }) => entry.id === 'quadrans-muralis'), 'Quadrans Muralis archive entry missing');
assert(archive.entries.some((entry: { id: string }) => entry.id === 'argo-navis'), 'Argo Navis archive entry missing');

for (const clue of archive.storyClues) {
  assert(clue.status === 'AUTHOR_CANDIDATE_NON_CANON', `clue unexpectedly promoted: ${clue.id}`);
  assert(clue.nextSource.length > 20, `clue nextSource too thin: ${clue.id}`);
}

for (const token of ['id="constellations"','id="constellationArchive"','id="constellationStoryClues"','id="groupGlossary"','constellation-archive-enhancement.js','constellation-archive.css']) {
  assert(html.includes(token), `Lorebook integration missing: ${token}`);
}
assert(js.includes('CONSTELLATION_ARCHIVE_URL'), 'archive renderer data source missing');
assert(js.includes('groupGlossary'), 'group glossary renderer missing');
assert(js.includes('nextSource'), 'next Source display missing');

console.log(JSON.stringify({
  archiveStatus: archive.status,
  storyClues: archive.storyClues.length,
  constellationEntries: archive.entries.length,
  groupGlossary: archive.groupGlossary.length,
  sakuyazaReplacementAllowed: false,
  obsoleteMeansEvil: false,
}, null, 2));
