import { describe, expect, it } from 'vitest';
import { eliteDefeatLabelPosition } from '../eliteDefeatBeat';

describe('eliteDefeatLabelPosition', () => {
  it('keeps the label inside the mobile viewport', () => {
    expect(eliteDefeatLabelPosition(-100, -100)).toEqual({ x: 86, y: 92 });
    expect(eliteDefeatLabelPosition(1000, 1000)).toEqual({ x: 304, y: 688 });
  });

  it('keeps ordinary world positions unchanged apart from the vertical offset', () => {
    expect(eliteDefeatLabelPosition(195, 420)).toEqual({ x: 195, y: 372 });
  });
});
