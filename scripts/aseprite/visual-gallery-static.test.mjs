import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const sceneSource = readFileSync('src/game/scenes/VisualGalleryScene.ts', 'utf8');

describe('VisualGallery static routes', () => {
  it('keeps yui-gallery and existing gallery scene routes', () => {
    expect(sceneSource).toContain("scene === 'yui-gallery'");
    expect(sceneSource).toContain("'visual-gallery'");
    expect(sceneSource).toContain("'combat-mock'");
    expect(sceneSource).toContain("'asset-status'");
  });

  it('keeps combat mock density presets', () => {
    expect(sceneSource).toContain("get('density') ?? 'mid'");
    expect(sceneSource).toContain("density === 'late'");
    expect(sceneSource).toContain("density === 'mid'");
    expect(sceneSource).toContain("density !== 'early'");
  });
});
