/// <reference types="node" />

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CHARACTER_ERA_FORESHADOW_DIALOGUE } from '../../src/game/data/characterEraForeshadowDialogueReservoir.ts';
import { CHARACTER_ERA_FINGERPRINTS } from '../../src/game/data/characterEraFingerprintRegistry.ts';
import { CHARACTER_ERA_SCENE_SEEDS } from '../../src/game/data/characterEraSceneSeedRegistry.ts';

const OUTPUT_PATH = 'public/lorebook/data/era-dialogue-atlas.v1.json';

export function buildEraDialogueAtlasProjection() {
  const fingerprintsById = new Map(CHARACTER_ERA_FINGERPRINTS.map((entry) => [entry.id, entry]));
  const scenesById = new Map(CHARACTER_ERA_SCENE_SEEDS.map((entry) => [entry.id, entry]));

  const entries = CHARACTER_ERA_FORESHADOW_DIALOGUE.map((era) => {
    const fingerprint = fingerprintsById.get(era.id);
    const scene = scenesById.get(era.id);
    if (!fingerprint || !scene) throw new Error(`[era-dialogue-atlas] unresolved source row: ${era.id}`);
    if (fingerprint.lane !== era.lane || fingerprint.assignmentStatus !== era.assignmentStatus) {
      throw new Error(`[era-dialogue-atlas] fingerprint drift: ${era.id}`);
    }
    return {
      id: era.id,
      name: era.name,
      rosterLayer: era.pool,
      lane: era.lane,
      assignmentStatus: era.assignmentStatus,
      personalAnchors: [...fingerprint.personalAnchors],
      fingerprints: fingerprint.fingerprints,
      ordinaryMismatch: scene.ordinaryMismatch,
      plausibleMisread: scene.plausibleMisread,
      materialOrRecordEvidence: scene.materialOrRecordEvidence,
      reinterpretation: scene.reinterpretation,
      dialogueA: scene.dialogueA,
      dialogueB: scene.dialogueB,
      objectOrTrace: scene.objectOrTrace,
      forbiddenShortcut: scene.forbiddenShortcut,
    };
  });

  const laneCounts = Object.fromEntries(
    [...new Set(entries.map((entry) => entry.lane))].map((lane) => [lane, entries.filter((entry) => entry.lane === lane).length]),
  );
  const statusCounts = Object.fromEntries(
    [...new Set(entries.map((entry) => entry.assignmentStatus))].map((status) => [status, entries.filter((entry) => entry.assignmentStatus === status).length]),
  );

  return {
    schemaVersion: 1,
    status: 'AUTHOR_READ_MODEL_GENERATED_NON_CANON',
    authority: [
      'src/game/data/characterEraForeshadowDialogueReservoir.ts',
      'src/game/data/characterEraFingerprintRegistry.ts',
      'src/game/data/characterEraSceneSeedRegistry.ts',
    ],
    generationPolicy: 'GENERATED_FROM_TYPESCRIPT_DO_NOT_HAND_EDIT',
    characterCount: entries.length,
    current21Count: entries.filter((entry) => entry.rosterLayer === 'CURRENT21').length,
    future15Count: entries.filter((entry) => entry.rosterLayer === 'FUTURE15').length,
    exactYearIncluded: false,
    exactAgeIncluded: false,
    laneCounts,
    statusCounts,
    entries,
  };
}

export function writeEraDialogueAtlasProjection(outputPath = OUTPUT_PATH) {
  const absolutePath = path.resolve(process.cwd(), outputPath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, `${JSON.stringify(buildEraDialogueAtlasProjection(), null, 2)}\n`, 'utf8');
  return absolutePath;
}

const directRun = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (directRun) {
  const written = writeEraDialogueAtlasProjection();
  console.log(`[era-dialogue-atlas] generated ${fileURLToPath(pathToFileURL(written))}`);
}
