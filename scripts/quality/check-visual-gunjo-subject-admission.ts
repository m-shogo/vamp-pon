import { existsSync, readFileSync } from 'node:fs';

const PATH = 'data/character-assets/manifests/visual-gunjo-subject-master-admission.v1.json';
const errors: string[] = [];
const fail = (message: string) => errors.push(message);

if (!existsSync(PATH)) fail(`missing ${PATH}`);
let data: any = {};
try {
  data = JSON.parse(readFileSync(PATH, 'utf8'));
} catch (error) {
  fail(`invalid JSON ${PATH}: ${String(error)}`);
}

if (data.schemaVersion !== 1) fail('schemaVersion must be 1');
if (data.fixedSubjectCount !== null) fail('Gunjo subject count must remain OPEN/null');
if (data.automaticSubjectCreationAllowed !== false) fail('Gunjo subjects may not be auto-created');
if (data.automaticImageGenerationAllowed !== false) fail('Gunjo images may not auto-generate from admission records');

const expectedTypes = [
  'CENTRAL_PERSON',
  'CENTRAL_PEOPLE_GROUP',
  'INSTITUTION_OR_SYSTEM',
  'SOCIAL_PRESSURE',
  'SAKUYAZA_ENTANGLEMENT',
];
const types = Array.isArray(data.subjectTypes) ? data.subjectTypes : [];
const ids = types.map((entry: any) => entry?.type);
if (JSON.stringify(ids) !== JSON.stringify(expectedTypes)) fail(`Gunjo subject types drifted: ${JSON.stringify(ids)}`);

const person = types.find((entry: any) => entry?.type === 'CENTRAL_PERSON');
if (person?.duplicateExistingCharacterMaster !== false) fail('Gunjo person subjects must reuse existing Character Master lineage');
const group = types.find((entry: any) => entry?.type === 'CENTRAL_PEOPLE_GROUP');
if (group?.fixedGroupSizeAllowedWithoutAuthority !== false) fail('Gunjo person-group size may not be invented');
const system = types.find((entry: any) => entry?.type === 'INSTITUTION_OR_SYSTEM');
if (system?.automaticHumanoidBossAllowed !== false) fail('Gunjo systems may not become automatic humanoid bosses');
const social = types.find((entry: any) => entry?.type === 'SOCIAL_PRESSURE');
if (social?.automaticSingleVillainAllowed !== false) fail('Gunjo social pressure may not become an automatic single villain');
const sakuyaza = types.find((entry: any) => entry?.type === 'SAKUYAZA_ENTANGLEMENT');
if (sakuyaza?.duplicateSakuyazaMaster !== false) fail('Gunjo/Sakuyaza overlap must reuse Sakuyaza Master instead of duplicating it');

if (!Array.isArray(data.formalAdmissionGate) || data.formalAdmissionGate.length < 10) fail('Gunjo formal admission gate is incomplete');
if (!Array.isArray(data.dedupeRules) || data.dedupeRules.length < 5) fail('Gunjo dedupe rules are incomplete');
const forbidden = Array.isArray(data.forbidden) ? data.forbidden.join('\n') : '';
for (const required of ['fixed five-person', 'common uniform', 'headquarters', 'every Gunjo subject as enemy', 'generated image creating']) {
  if (!forbidden.includes(required)) fail(`Gunjo forbidden boundary missing: ${required}`);
}

if (errors.length) {
  console.error(`Gunjo visual subject admission check FAILED (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Gunjo visual subject admission check PASS — subject types=${types.length}, fixed count=OPEN, generation=blocked`);
