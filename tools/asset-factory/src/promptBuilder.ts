import type { AssetManifest } from './types';

const VAMP_PON_STYLE = [
  'Vamp Pon style: dark but warm atmosphere',
  'paper / memory / black ink / small light motifs',
  'readable mobile game asset',
  'transparent PNG',
  'no text, no logo, no border, no checkerboard, no white fringe',
  'keep silhouette simple and readable',
  'game-ready quality',
].join('. ');

export function buildPrompt(manifest: AssetManifest): string {
  switch (manifest.type) {
    case 'enemy': return buildEnemyPrompt(manifest);
    case 'weapon': return buildWeaponPrompt(manifest);
    case 'item': return buildItemPrompt(manifest);
    case 'character': return buildCharacterPrompt(manifest);
    case 'cutin': return buildCutinPrompt(manifest);
    case 'background': return buildBackgroundPrompt(manifest);
  }
}

function buildEnemyPrompt(m: AssetManifest): string {
  const em = m as AssetManifest & { enemyId: string; baseFamily: string; motif: string; behavior: string; sizeTier: string };
  return `Enemy sprite sheet for 2D mobile game "Vamp Pon".

Subject: ${em.displayName || em.enemyId || 'unnamed enemy'}
Motif: ${em.motif || 'forgotten object come alive'}
Family: ${em.baseFamily || 'ombu'}
Size tier: ${em.sizeTier || 'small'}
Behavior hint: ${em.behavior || 'wander'}

Sheet specification:
- Canvas: 1440 x 1080 pixels
- Grid: 8 columns x 6 rows
- Cell size: 180 x 180 pixels each
- Transparent background (true alpha, no checkerboard)
- No grid lines, no cell borders drawn on the image
- Each pose/frame centered within its 180x180 cell
- No opaque pixel may touch a cell edge
- Stable consistent scale across all cells
- Must be readable when displayed at 64px game size
- Same enemy identity (color, shape, features) across ALL cells

Row layout suggestion:
- Row 0: idle front (4 frames) + idle variations
- Row 1: walk/move front (4-8 frames)
- Row 2: idle side / walk side
- Row 3: attack or special action
- Row 4: hit / damage reaction
- Row 5: death / dissolve sequence

${VAMP_PON_STYLE}

${em.notes ? `Additional notes: ${em.notes}` : ''}`.trim();
}

function buildWeaponPrompt(m: AssetManifest): string {
  const wm = m as AssetManifest & { weaponId: string; motif: string; trajectory: string };
  return `Weapon icon for 2D mobile game "Vamp Pon".

Subject: ${wm.displayName || wm.weaponId || 'unnamed weapon'}
Motif: ${wm.motif || 'mysterious weapon'}
Trajectory type: ${wm.trajectory || 'projectile'}

Icon specification:
- Canvas: 1024 x 1024 pixels (master size)
- Transparent background (true alpha)
- Weapon centered in canvas
- Must be readable at 64px and 32px display sizes
- No text baked into the image
- No rarity frame or border baked in (applied by game UI)
- Clean silhouette with identifiable shape

${VAMP_PON_STYLE}

${m.notes ? `Additional notes: ${m.notes}` : ''}`.trim();
}

function buildItemPrompt(m: AssetManifest): string {
  const im = m as AssetManifest & { itemId: string; category: string; effectType: string; rarity: string };
  return `Item icon for 2D mobile game "Vamp Pon".

Subject: ${im.displayName || im.itemId || 'unnamed item'}
Category: ${im.category || 'passive'}
Effect: ${im.effectType || 'unknown'}
Rarity: ${im.rarity || 'common'}

Icon specification:
- Canvas: 1024 x 1024 pixels (master size)
- Transparent background (true alpha)
- Item centered in canvas
- Must be readable at 64px and 32px display sizes
- No text baked into the image
- No rarity frame or border baked in (applied by game UI)
- Clean silhouette with identifiable shape

${VAMP_PON_STYLE}

${m.notes ? `Additional notes: ${m.notes}` : ''}`.trim();
}

function buildCharacterPrompt(m: AssetManifest): string {
  const cm = m as AssetManifest & { characterId: string; bodyType: string; fixedRules: string[]; columns: number; rows: number; cellWidth: number; cellHeight: number };
  const cols = cm.columns || 8;
  const rows = cm.rows || 6;
  const cw = cm.cellWidth || 180;
  const ch = cm.cellHeight || 180;
  return `Character sprite sheet for 2D mobile game "Vamp Pon".

Subject: ${cm.displayName || cm.characterId || 'unnamed character'}
Body type: ${cm.bodyType || 'standard'}

Sheet specification:
- Canvas: ${cols * cw} x ${rows * ch} pixels
- Grid: ${cols} columns x ${rows} rows
- Cell size: ${cw} x ${ch} pixels each
- Transparent background (true alpha)
- No grid lines, no cell borders
- Each pose centered within its cell
- No opaque pixel may touch a cell edge
- Stable consistent scale across all cells
- Must be readable at 64px game size

Row layout (standard character):
- Row 0: idle front (4 frames) + idle back (4 frames)
- Row 1: walk front (4 frames) + walk back (4 frames)
- Row 2: idle right (4 frames) + idle left (4 frames)
- Row 3: walk right (4 frames) + walk left (4 frames)
- Row 4: attack (4 frames) + special (4 frames)
- Row 5: hit (4 frames) + death (4 frames)

${cm.fixedRules?.length ? `Fixed rules:\n${cm.fixedRules.map(r => `- ${r}`).join('\n')}` : ''}

${VAMP_PON_STYLE}

${m.notes ? `Additional notes: ${m.notes}` : ''}`.trim();
}

function buildCutinPrompt(m: AssetManifest): string {
  const cm = m as AssetManifest & { characterId: string; mode: string; targetSize: string; transparentBackground: boolean };
  return `Cut-in illustration for 2D mobile game "Vamp Pon".

Subject: ${cm.displayName || cm.characterId || 'unnamed character'}
Mode: ${cm.mode || 'dramatic close-up'}
Target size: ${cm.targetSize || '1080x1920'}
Transparent background: ${cm.transparentBackground !== false ? 'yes' : 'no'}

Requirements:
- Dynamic, dramatic pose suitable for a cut-in moment
- Upper body focus with expressive face
- Must work as a UI overlay during gameplay
- ${cm.transparentBackground !== false ? 'Transparent background (true alpha)' : 'Dark atmospheric background'}

${VAMP_PON_STYLE}

${m.notes ? `Additional notes: ${m.notes}` : ''}`.trim();
}

function buildBackgroundPrompt(m: AssetManifest): string {
  const bm = m as AssetManifest & { stageId: string; targetSize: string; visibilityNotes: string };
  return `Stage background for 2D mobile game "Vamp Pon".

Stage: ${bm.displayName || bm.stageId || 'unnamed stage'}
Target size: ${bm.targetSize || '1080x1920'}
Orientation: portrait (mobile vertical)

Requirements:
- Full background illustration, no transparency needed
- Must tile or scroll vertically for endless runner gameplay
- Dark nighttime atmosphere with warm small light sources
- Depth and layers for parallax scrolling
- Must not distract from gameplay sprites in the foreground

${bm.visibilityNotes ? `Visibility notes: ${bm.visibilityNotes}` : ''}

${VAMP_PON_STYLE.replace('transparent PNG. ', '')}

${m.notes ? `Additional notes: ${m.notes}` : ''}`.trim();
}
