import {
  CHARACTER_ERA_FINGERPRINTS,
  ERA_FINGERPRINT_RULES,
  FIVE_BEAT_ERA_REVEAL_PATTERN,
} from '../../src/game/data/characterEraFingerprintRegistry.ts';

const fail = (message: string): never => {
  throw new Error(`[character-era-fingerprints] ${message}`);
};

if (CHARACTER_ERA_FINGERPRINTS.length !== ERA_FINGERPRINT_RULES.characterCountRequired) {
  fail(`expected ${ERA_FINGERPRINT_RULES.characterCountRequired} characters, got ${CHARACTER_ERA_FINGERPRINTS.length}`);
}

const ids = new Set<string>();
for (const entry of CHARACTER_ERA_FINGERPRINTS) {
  if (ids.has(entry.id)) fail(`duplicate character id: ${entry.id}`);
  ids.add(entry.id);

  if (entry.personalAnchors.length < 2) fail(`${entry.id}: needs at least 2 personal anchors`);

  for (const category of ERA_FINGERPRINT_RULES.categories) {
    const values = entry.fingerprints[category];
    if (!values || values.length < 2) fail(`${entry.id}: ${category} needs at least 2 fingerprint cues`);
    for (const value of values) {
      if (/\b(18|19|20|21)\d{2}\b/.test(value)) fail(`${entry.id}: exact year leaked into ${category}`);
    }
  }
}

if (ERA_FINGERPRINT_RULES.categories.length !== ERA_FINGERPRINT_RULES.categoriesRequired) {
  fail('category count does not match categoriesRequired');
}

if (FIVE_BEAT_ERA_REVEAL_PATTERN.length !== 5) {
  fail('five-beat reveal pattern must remain exactly 5 beats');
}

if (ERA_FINGERPRINT_RULES.exactYearAllowed) fail('exact years must stay open');
if (ERA_FINGERPRINT_RULES.exactBirthYearAllowed) fail('exact birth years must stay open');
if (ERA_FINGERPRINT_RULES.eraLabelInDialogueAllowed) fail('dialogue must not directly announce era labels');
if (ERA_FINGERPRINT_RULES.superiorityFramingAllowed) fail('era superiority framing must stay forbidden');
if (ERA_FINGERPRINT_RULES.oneFingerprintMayProveEra) fail('one fingerprint must never prove era alone');
if (ERA_FINGERPRINT_RULES.runtimeAutoPromotionAllowed) fail('runtime auto-promotion must stay forbidden');

console.log(`character era fingerprints OK: ${CHARACTER_ERA_FINGERPRINTS.length} characters x ${ERA_FINGERPRINT_RULES.categories.length} categories`);
