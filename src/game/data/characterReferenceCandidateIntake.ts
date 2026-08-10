export type CharacterReferenceCandidateDecision = 'pending' | 'approved_reference' | 'needs_regeneration' | 'rejected';

export type CharacterReferenceManualReview = {
  identityMatchesCurrentCanon: boolean | null;
  silhouetteMatchesCurrentCanon: boolean | null;
  postureMatchesCurrentCanon: boolean | null;
  clothingMassMatchesCurrentCanon: boolean | null;
  namedObjectReadable: boolean | null;
  mobileReadability390x844: boolean | null;
  noBakedTextOrUi: boolean | null;
  noBackgroundOrFringeIssue: boolean | null;
  bodyRepresentationGuardPassed: boolean | null;
  notes: string;
};

export type CharacterReferenceCandidateRecord = {
  schemaVersion: 1;
  characterId: string;
  displayName: string;
  sourceFile: string;
  sourceSha256: string;
  sourceWidth: number;
  sourceHeight: number;
  sourceBitDepth: number;
  sourcePngColorType: number;
  expectedOutputPath: string;
  promptHashAlgorithm: 'sha256';
  promptHash: string;
  promptSource: 'current-character-reference-handoff';
  intakeCommit: string;
  registeredAt: string;
  decision: CharacterReferenceCandidateDecision;
  approvedForReference: boolean;
  approvedForRuntime: false;
  approvedAsFinal: false;
  manualReview: CharacterReferenceManualReview;
};

export const CHARACTER_REFERENCE_CANDIDATE_POLICY = {
  schemaVersion: 1,
  expectedWidth: 1024,
  expectedHeight: 1024,
  expectedBitDepth: 8,
  expectedPngColorType: 6,
  initialDecision: 'pending',
  initialApprovedForReference: false,
  approvedForRuntime: false,
  approvedAsFinal: false,
  requiredManualReviewFields: [
    'identityMatchesCurrentCanon',
    'silhouetteMatchesCurrentCanon',
    'postureMatchesCurrentCanon',
    'clothingMassMatchesCurrentCanon',
    'namedObjectReadable',
    'mobileReadability390x844',
    'noBakedTextOrUi',
    'noBackgroundOrFringeIssue',
    'bodyRepresentationGuardPassed',
  ],
  rule: 'A generated file becomes a candidate record first. Reference approval requires explicit human review; runtime/final approval is outside this intake contract.',
} as const;

export const EMPTY_CHARACTER_REFERENCE_MANUAL_REVIEW: CharacterReferenceManualReview = {
  identityMatchesCurrentCanon: null,
  silhouetteMatchesCurrentCanon: null,
  postureMatchesCurrentCanon: null,
  clothingMassMatchesCurrentCanon: null,
  namedObjectReadable: null,
  mobileReadability390x844: null,
  noBakedTextOrUi: null,
  noBackgroundOrFringeIssue: null,
  bodyRepresentationGuardPassed: null,
  notes: '',
};
