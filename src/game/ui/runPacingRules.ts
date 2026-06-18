export const eliteStarts = [150, 300, 420] as const;
export const eliteLead = 2.5;
export const finalWindow = 10;

export function valueForTime(elapsed: number, duration: number): number | null {
  const value = Math.ceil(duration - elapsed);
  if (value <= 0 || value > finalWindow) return null;
  return value;
}
