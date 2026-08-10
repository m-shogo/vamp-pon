import { characterSilhouetteAnchorById } from './characterSilhouetteCanon';
import { current21SilhouetteMatrix } from './current21SilhouetteMatrix';
import { characterThemeColorById } from './characterThemeColors';

export type CharacterVisualGenerationBrief = {
  characterId: string;
  displayName: string;
  themeHex: string;
  accentHex: string;
  starBeast: string;
  constellation: string;
  silhouette: string;
  posture: string;
  clothingShape: string;
  objectAnchor: string;
  motionSignature: string;
  ensemblePosition: string;
  hardVisualDirection: string | null;
  prohibitedShortcuts: string[];
  promptFragment: string;
};

const GLOBAL_GENERATION_GUARDS = [
  'preserve the named character silhouette rather than using a generic slim anime body',
  'keep face, posture, clothing mass and object placement distinct from the rest of the cast',
  'do not turn body shape, age, disability or presentation into a comedy shorthand',
  'do not change hitbox or gameplay-stat implications from visual body shape',
] as const;

const PLUS_SIZE_GENERATION_GUARD =
  'PLUS-SIZE HARD LOCK: preserve the established plus-size body in portrait, sprite, cut-in, ensemble, seasonal and merchandise art; do not slim, bodybuilder-normalize, fetishize or use weight comedy.';

export const characterVisualGenerationBriefs: CharacterVisualGenerationBrief[] = current21SilhouetteMatrix.map((matrix) => {
  const theme = characterThemeColorById.get(matrix.characterId);
  if (!theme) {
    throw new Error(`Missing theme color for silhouette matrix character: ${matrix.characterId}`);
  }

  const hardAnchor = characterSilhouetteAnchorById.get(matrix.characterId);
  const isPlusSizeHardLock = matrix.characterId === 'hana' || matrix.characterId === 'kage1';
  const prohibitedShortcuts = [
    matrix.generationGuard,
    ...(hardAnchor?.prohibitedShortcuts ?? []),
    ...GLOBAL_GENERATION_GUARDS,
    ...(isPlusSizeHardLock ? [PLUS_SIZE_GENERATION_GUARD] : []),
  ];

  const hardVisualDirection = hardAnchor?.bodyDirection ?? null;
  const promptParts = [
    `${matrix.displayName} (${matrix.visualLane})`,
    `primary character color ${theme.themeColor.hex} ${theme.themeColor.japaneseName}`,
    `accent color ${theme.accentColor.hex} ${theme.accentColor.japaneseName}`,
    `favorite constellation ${theme.starBeastTheme.favoriteConstellation}`,
    `star beast ${theme.starBeastTheme.starBeast}`,
    `silhouette: ${matrix.silhouetteRead}`,
    `posture: ${matrix.posture}`,
    `clothing shape: ${matrix.clothingShape}`,
    `named-object anchor: ${matrix.objectAnchor}`,
    `motion signature: ${matrix.motionSignature}`,
    `ensemble placement: ${matrix.ensemblePosition}`,
    ...(hardVisualDirection ? [`hard visual direction: ${hardVisualDirection}`] : []),
    `avoid: ${prohibitedShortcuts.join('; ')}`,
  ];

  return {
    characterId: matrix.characterId,
    displayName: matrix.displayName,
    themeHex: theme.themeColor.hex,
    accentHex: theme.accentColor.hex,
    starBeast: theme.starBeastTheme.starBeast,
    constellation: theme.starBeastTheme.favoriteConstellation,
    silhouette: matrix.silhouetteRead,
    posture: matrix.posture,
    clothingShape: matrix.clothingShape,
    objectAnchor: matrix.objectAnchor,
    motionSignature: matrix.motionSignature,
    ensemblePosition: matrix.ensemblePosition,
    hardVisualDirection,
    prohibitedShortcuts,
    promptFragment: promptParts.join('. '),
  };
});

export const characterVisualGenerationBriefById = new Map(
  characterVisualGenerationBriefs.map((entry) => [entry.characterId, entry]),
);

export const CURRENT21_VISUAL_GENERATION_POLICY = {
  sourceOfTruth: [
    'characterThemeColors.ts',
    'current21SilhouetteMatrix.ts',
    'characterSilhouetteCanon.ts',
  ],
  expectedCount: 21,
  plusSizeHardLockIds: ['hana', 'kage1'],
  rule: 'Generated art must consume these derived briefs instead of recreating character shape from memory or a generic prompt.',
} as const;
