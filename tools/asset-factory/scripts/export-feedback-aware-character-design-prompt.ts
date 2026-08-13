import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const BASE_EXPORTER = 'tools/asset-factory/scripts/export-final-character-design-prompt.ts';
const MASTER_DOC = 'docs/visual/character-design-feedback-recurrence-master-v1.md';
const MASTER_JSON = 'data/visual/character-design-feedback-recurrence-master-v1.json';
const LEDGER_JSON = 'data/visual/character-design-feedback-ledger.json';

type Options = { characterId: string; kind: string; output: string | null };

type Directive = {
  id: string;
  scope: 'CHARACTER' | 'GLOBAL';
  characterId: string | null;
  action: 'KEEP' | 'BAN' | 'REPLACE' | 'WARN';
  dimension: string;
  statement: string;
  replacement: string | null;
  authority: 'USER_DECIDED' | 'HUMAN_APPROVED_DESIGN_RULE' | 'CANDIDATE_LEARNING';
  state: 'ACTIVE' | 'PROPOSED' | 'RETIRED';
  sourceCandidateIds: string[];
  evidence: string[];
  createdByGeneratedImageAlone: boolean;
};

function parseArgs(args: string[]): Options {
  let characterId = '';
  let kind = 'character_reference';
  let output: string | null = null;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;
    if (arg === '--character') { characterId = args[++i] ?? ''; continue; }
    if (arg === '--kind') { kind = args[++i] ?? ''; continue; }
    if (arg === '--output') { output = args[++i] ?? null; continue; }
    throw new Error(`Unknown argument: ${arg}`);
  }
  if (!characterId) throw new Error('--character is required');
  if (!kind) throw new Error('--kind is required');
  return { characterId, kind, output };
}

function loadJson(path: string) {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), 'utf8'));
}

function runBaseExporter(characterId: string, kind: string) {
  const stdout = execFileSync(process.execPath, [
    '--experimental-strip-types', resolve(process.cwd(), BASE_EXPORTER),
    '--character', characterId,
    '--kind', kind,
  ], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 28 * 1024 * 1024 });
  return JSON.parse(stdout);
}

function validateMaster(master: any) {
  if (master.status !== 'TOP_LEVEL_POST_REVIEW_GENERATION_GOVERNANCE') throw new Error(`Feedback recurrence Master is not current: ${MASTER_JSON}`);
  if (master.scopeCount !== 36) throw new Error(`Feedback recurrence Master scope must remain 36: ${MASTER_JSON}`);
  if (master.generatedImageCreatesFeedbackRule !== false) throw new Error('Generated image must never create feedback rule');
  if (master.candidateReviewAutomaticallyChangesGeneration !== false) throw new Error('Candidate review must not automatically change generation');
  if (master.assistantDiagnosisAutomaticallyChangesGeneration !== false) throw new Error('Assistant diagnosis must not automatically change generation');
  if (master.singleReactionCreatesGlobalRule !== false) throw new Error('Single reaction must not create global rule');
  if (!Array.isArray(master.allowedActions) || master.allowedActions.length !== 4) throw new Error('Feedback recurrence action policy incomplete');
}

function validateLedger(ledger: any) {
  if (ledger.status !== 'DESIGNER_LEARNING_NON_CANON') throw new Error(`Feedback ledger status invalid: ${LEDGER_JSON}`);
  if (ledger.rules?.candidateReviewDoesNotAutomaticallyModifyGeneration !== true) throw new Error('Ledger automatic-generation guard missing');
  if (ledger.rules?.onlyActiveRecurrenceDirectivesMayModifyLaterGeneration !== true) throw new Error('Ledger ACTIVE-only recurrence guard missing');
  if (ledger.rules?.generatedImageNeverCreatesRecurrenceDirective !== true) throw new Error('Ledger generated-image recurrence guard missing');
  if (!Array.isArray(ledger.candidateReviews)) throw new Error('candidateReviews must remain an array');
  if (!Array.isArray(ledger.recurrenceDirectives)) throw new Error('recurrenceDirectives must be an array');
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateActiveDirective(raw: any, master: any): Directive {
  if (!raw || typeof raw !== 'object') throw new Error('ACTIVE recurrence directive must be an object');
  if (!nonEmptyString(raw.id)) throw new Error('ACTIVE recurrence directive id missing');
  if (!['CHARACTER', 'GLOBAL'].includes(raw.scope)) throw new Error(`${raw.id}: invalid scope`);
  if (!master.allowedActions.includes(raw.action)) throw new Error(`${raw.id}: invalid action`);
  if (!master.allowedDimensions.includes(raw.dimension)) throw new Error(`${raw.id}: invalid dimension`);
  if (!nonEmptyString(raw.statement)) throw new Error(`${raw.id}: statement missing`);
  if (!master.allowedAuthorities.includes(raw.authority)) throw new Error(`${raw.id}: invalid authority`);
  if (raw.state !== 'ACTIVE') throw new Error(`${raw.id}: validateActiveDirective called for non-ACTIVE directive`);
  if (raw.createdByGeneratedImageAlone !== false) throw new Error(`${raw.id}: generated-image-created directive forbidden`);
  if (!Array.isArray(raw.evidence) || raw.evidence.length < 1 || raw.evidence.some((x: unknown) => !nonEmptyString(x))) throw new Error(`${raw.id}: evidence required`);
  if (!Array.isArray(raw.sourceCandidateIds)) throw new Error(`${raw.id}: sourceCandidateIds must be an array`);

  if (raw.scope === 'CHARACTER') {
    if (!nonEmptyString(raw.characterId)) throw new Error(`${raw.id}: CHARACTER scope requires characterId`);
    if (!master.characterDirectiveAuthorities.includes(raw.authority)) throw new Error(`${raw.id}: authority not allowed for CHARACTER scope`);
  } else {
    if (raw.characterId !== null) throw new Error(`${raw.id}: GLOBAL scope requires characterId=null`);
    if (!master.globalDirectiveAuthorities.includes(raw.authority)) throw new Error(`${raw.id}: GLOBAL scope requires human-approved or user-decided authority`);
  }

  if (raw.authority === 'CANDIDATE_LEARNING') {
    if (raw.scope !== 'CHARACTER') throw new Error(`${raw.id}: CANDIDATE_LEARNING may not be GLOBAL`);
    if (raw.sourceCandidateIds.length < 1 || raw.sourceCandidateIds.some((x: unknown) => !nonEmptyString(x))) throw new Error(`${raw.id}: CANDIDATE_LEARNING requires sourceCandidateIds`);
  }

  if (raw.action === 'REPLACE' && !nonEmptyString(raw.replacement)) throw new Error(`${raw.id}: REPLACE requires positive replacement`);
  if (raw.action !== 'REPLACE' && raw.replacement !== null && raw.replacement !== undefined && !nonEmptyString(raw.replacement)) throw new Error(`${raw.id}: replacement must be null or non-empty`);

  return raw as Directive;
}

function resolveActiveDirectives(characterId: string, ledger: any, master: any) {
  const activeRaw = ledger.recurrenceDirectives.filter((x: any) => x?.state === 'ACTIVE');
  const seen = new Set<string>();
  const validated = activeRaw.map((raw: any) => {
    const directive = validateActiveDirective(raw, master);
    if (seen.has(directive.id)) throw new Error(`Duplicate ACTIVE recurrence directive id: ${directive.id}`);
    seen.add(directive.id);
    return directive;
  });
  return validated.filter((d: Directive) => d.scope === 'GLOBAL' || d.characterId === characterId);
}

function feedbackPromptBlock(master: any, directives: Directive[]) {
  const directivePayload = directives.length > 0
    ? JSON.stringify(directives, null, 2)
    : 'NONE — no ACTIVE reviewed recurrence directive applies to this character.';
  return [
    'CHARACTER DESIGN FEEDBACK RECURRENCE MASTER — REVIEWED LEARNING, LOWER THAN CANON AUTHORITIES.',
    `Authority: ${MASTER_DOC}.`,
    `Machine policy: ${MASTER_JSON}.`,
    `Feedback ledger: ${LEDGER_JSON}.`,
    'Candidate reviews and assistant diagnoses do not alter generation by themselves. Only validated ACTIVE recurrence directives below are executable.',
    'A BAN prevents recurrence but does not authorize a random alternative. A REPLACE must use its named positive target. KEEP protects only the accepted element already supported by higher authority. WARN increases review attention only.',
    'Feedback recurrence may narrow later candidates but may never override USER_DECIDED, current canon, Living Visual, Appearance, Identity, Embodied, Garment, Night/Light, World Material, or Image Generation Readiness authority.',
    'Generated output never creates a recurrence rule and remains CANDIDATE_REVIEW_REQUIRED.',
    'ACTIVE FEEDBACK RECURRENCE DIRECTIVES FOR THIS CHARACTER:',
    directivePayload,
    `Anti-overlearning: ${JSON.stringify(master.antiOverlearning)}.`,
    `Review taxonomy: ${JSON.stringify(master.reviewTaxonomy)}.`,
  ].join('\n');
}

const options = parseArgs(process.argv.slice(2));
const master = loadJson(MASTER_JSON);
const ledger = loadJson(LEDGER_JSON);
validateMaster(master);
validateLedger(ledger);

const base = runBaseExporter(options.characterId, options.kind);
if (base.finalCharacterDesignProductionEntrypoint !== true) throw new Error(`${options.characterId}: final design exporter missing`);
if (base.characterImageGenerationReadinessRequired !== true) throw new Error(`${options.characterId}: image readiness gate missing`);
if (base.imageGenerationReadinessState !== master.requiredReadinessState) throw new Error(`${options.characterId}: not ready for candidate generation (${base.imageGenerationReadinessState})`);
if (Array.isArray(base.imageGenerationReadinessFailures) && base.imageGenerationReadinessFailures.length > 0) throw new Error(`${options.characterId}: readiness failures present`);

const directives = resolveActiveDirectives(options.characterId, ledger, master);
const feedbackBlock = feedbackPromptBlock(master, directives);
const authorityOrder = Array.isArray(base.authorityOrder) ? [...base.authorityOrder] : [];
authorityOrder.push(MASTER_DOC, MASTER_JSON, LEDGER_JSON);

const result = {
  ...base,
  schemaVersion: Math.max(Number(base.schemaVersion ?? 0), 17),
  generatedBy: 'tools/asset-factory/scripts/export-feedback-aware-character-design-prompt.ts',
  feedbackRecurrenceGenerationEntrypoint: true,
  feedbackRecurrenceRequired: true,
  feedbackRecurrenceMasterPath: MASTER_JSON,
  feedbackRecurrenceAuthorityDocument: MASTER_DOC,
  feedbackLedgerPath: LEDGER_JSON,
  activeFeedbackRecurrenceDirectives: directives,
  activeFeedbackRecurrenceDirectiveCount: directives.length,
  generatedImageCreatesFeedbackRule: false,
  candidateReviewAutomaticallyChangesGeneration: false,
  generatedOutputState: 'CANDIDATE_REVIEW_REQUIRED',
  authorityOrder,
  prompt: `${base.prompt}\n\n${feedbackBlock}`,
  reviewChecklist: [
    'Feedback Ledgerのcandidate reviewとassistant diagnosisを自動ルール化しない',
    'ACTIVE recurrence directiveだけを適用する',
    'GLOBAL directiveはUSER_DECIDEDまたはHUMAN_APPROVED_DESIGN_RULEだけ許可する',
    'CANDIDATE_LEARNINGはmatching characterだけに限定する',
    'BAN後の代替をimage modelに勝手に発明させない',
    'REPLACEは指定されたpositive replacementだけを使う',
    '生成画像そのものから新しいfeedback ruleを作らない',
    ...(Array.isArray(base.reviewChecklist) ? base.reviewChecklist : []),
  ],
};

const serialized = `${JSON.stringify(result, null, 2)}\n`;
if (options.output) {
  mkdirSync(dirname(options.output), { recursive: true });
  writeFileSync(options.output, serialized);
  console.log(`feedback-aware character design prompt exported: ${options.output}`);
} else {
  process.stdout.write(serialized);
}
