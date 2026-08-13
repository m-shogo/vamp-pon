import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const CREATE = resolve(process.cwd(), 'tools/asset-factory/scripts/create-character-fidelity-review-packet.ts');
const EVALUATE = resolve(process.cwd(), 'tools/asset-factory/scripts/evaluate-character-fidelity-review-packet.ts');
const root = mkdtempSync(join(tmpdir(), 'fidelity-review-'));

function runCreate(kind: string, name: string) {
  const output = join(root, `${name}.json`);
  execFileSync(process.execPath, ['--experimental-strip-types', CREATE, '--character', 'yui', '--kind', kind, '--candidate', `candidate/${name}.png`, '--reference', 'reference/yui.png', '--output', output], { cwd: process.cwd(), encoding: 'utf8' });
  return output;
}

function scoreAll(path: string, score: number, overrides: Record<string, number> = {}) {
  const packet = JSON.parse(readFileSync(path, 'utf8'));
  for (const key of Object.keys(packet.axisScores)) packet.axisScores[key] = overrides[key] ?? score;
  writeFileSync(path, `${JSON.stringify(packet, null, 2)}\n`);
}

function evaluate(path: string) {
  const output = `${path}.evaluated.json`;
  execFileSync(process.execPath, ['--experimental-strip-types', EVALUATE, '--input', path, '--output', output], { cwd: process.cwd(), encoding: 'utf8' });
  return JSON.parse(readFileSync(output, 'utf8'));
}

const strongPath = runCreate('character_reference', 'strong');
scoreAll(strongPath, 100);
const strong = evaluate(strongPath);
if (strong.fidelityState !== 'FIDELITY_PASS_STRONG' || strong.weightedScore !== 100) throw new Error('all-100 reference must be strong pass');
if (strong.reviewerVerdict !== null || strong.systemMaySetHumanVerdict !== false) throw new Error('system must not write human verdict');
if (strong.systemRecommendation !== 'ELIGIBLE_FOR_HUMAN_KEEP_REVIEW') throw new Error('strong-pass system recommendation mismatch');

const faceFailPath = runCreate('character_reference', 'face-fail');
scoreAll(faceFailPath, 100, { faceGeometryAgeCoding: 89 });
const faceFail = evaluate(faceFailPath);
if (faceFail.fidelityState !== 'BLOCK_IDENTITY_DRIFT') throw new Error('face 89 reference must hard-block despite high weighted score');
if (!faceFail.hardGateFailures.some((entry: string) => entry.startsWith('faceGeometryAgeCoding:89<90'))) throw new Error('face hard-gate evidence missing');
if (faceFail.promotionBlocked !== true) throw new Error('identity block must block promotion');

const spritePath = runCreate('sprite_sheet_180', 'sprite-85');
scoreAll(spritePath, 85);
const sprite = evaluate(spritePath);
if (sprite.fidelityState !== 'REWORK_SUPPORTING_AXES') throw new Error(`sprite all-85 should pass identity hard gate but require support rework, got ${sprite.fidelityState}`);
if (sprite.hardGateFailures.length !== 0) throw new Error('sprite all-85 must not identity-block');

const spriteFailPath = runCreate('sprite_sheet_180', 'sprite-face-84');
scoreAll(spriteFailPath, 100, { faceGeometryAgeCoding: 84 });
const spriteFail = evaluate(spriteFailPath);
if (spriteFail.fidelityState !== 'BLOCK_IDENTITY_DRIFT') throw new Error('sprite face 84 must hard-block');

const emblemPath = runCreate('emblem_normal', 'emblem');
const emblem = evaluate(emblemPath);
if (emblem.fidelityState !== 'NOT_APPLICABLE' || emblem.systemRecommendation !== 'EMBLEM_CANON_REVIEW_REQUIRED') throw new Error('emblem must route to emblem-canon review');
if (emblem.reviewerVerdict !== null) throw new Error('emblem evaluator must not set human verdict');

console.log('[character-fidelity-review-packet] OK: strong pass, critical hard-block, sprite threshold, emblem separation, human verdict boundary');
