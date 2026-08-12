import fs from 'node:fs';
import { CHARACTER_PROFILE_BOOK_SECTIONS, characterProfileBookReadModelSummary } from '../../src/game/data/characterProfileBookReadModel.ts';

const nav = JSON.parse(fs.readFileSync('public/lorebook/data/profile-book-navigation.v1.json', 'utf8'));
const profiles = JSON.parse(fs.readFileSync('public/lorebook/data/personal-profiles.v1.json', 'utf8'));
const js = fs.readFileSync('public/lorebook/profile-enhancement.js', 'utf8');
const css = fs.readFileSync('public/lorebook/profile.css', 'utf8');
const fail = (message: string): never => { throw new Error(`[lorebook-profile-book-navigation] ${message}`); };

if (nav.schemaVersion !== 1) fail('schema version drift');
if (nav.characterCount !== characterProfileBookReadModelSummary.characterCount) fail('character count drift');
if (nav.current21Count !== characterProfileBookReadModelSummary.current21Count) fail('Current21 drift');
if (nav.future15Count !== characterProfileBookReadModelSummary.future15Count) fail('Future15 drift');
if (nav.dimensionCount !== characterProfileBookReadModelSummary.assignedDimensionCount) fail('dimension drift');
if (nav.sectionCount !== characterProfileBookReadModelSummary.sectionCount) fail('section drift');
if (nav.fullyCoveredCharacterCount !== characterProfileBookReadModelSummary.fullyCoveredCharacterCount) fail('coverage drift');

const sourceSections = CHARACTER_PROFILE_BOOK_SECTIONS.map((section) => ({ id: section.id, dimensions: [...section.dimensions] }));
const navSections = nav.sections.map((section: { id: string; dimensions: string[] }) => ({ id: section.id, dimensions: section.dimensions }));
if (JSON.stringify(navSections) !== JSON.stringify(sourceSections)) fail('section assignment drift');
const assigned = nav.sections.flatMap((section: { dimensions: string[] }) => section.dimensions);
if (assigned.length !== 21 || new Set(assigned).size !== 21) fail('21 dimensions must be unique and complete');
if (!Array.isArray(nav.sourceLegend) || nav.sourceLegend.length < 6) fail('source legend incomplete');

// Personal File is a Current21 projection; the 36-character Profile Book navigation is the broader read-model.
// Do not fake Future15 Personal Files merely to make a UI count equal 36.
if (!Array.isArray(profiles.profiles) || profiles.profiles.length !== characterProfileBookReadModelSummary.current21Count) {
  fail(`Personal File coverage must match Current21 (${characterProfileBookReadModelSummary.current21Count}), got ${profiles.profiles?.length}`);
}

if (!js.includes('PROFILE BOOK / SOURCE MAP') || !js.includes('READ MODEL')) fail('Profile Book JS contract missing');
for (const token of ['.profile-book-guide','.profile-book-nav-grid','.profile-source-legend','.profile-book-read-strip']) if (!css.includes(token)) fail(`CSS contract missing ${token}`);
if (nav.runtimeAutoPromotionAllowed !== false) fail('runtime auto-promotion must remain false');
if (nav.publicSpoilerProjectionDefined !== false) fail('public spoiler projection must remain undefined');
if (nav.routePolicy?.routeSlug !== 'authorId' || nav.routePolicy?.stableProfileAliasIsPrimaryRoute !== false) fail('route policy drift');

console.log(`[lorebook-profile-book-navigation] OK nav=${nav.characterCount}/dimensions=${nav.dimensionCount}/sections=${nav.sectionCount}/personalFiles=${profiles.profiles.length}`);
