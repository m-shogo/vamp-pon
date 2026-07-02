import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const sampleRate = 44100;
const outputDir = 'unity/VampPonUnity/Assets/_Project/Audio/U28DraftSe';
const manifestPath = 'docs/design-targets/generated/unity-u28/se-asset-list.json';

const specs = [
  ['vp_battle_start_soft.wav', 0.24, 246, 0.18, 'warm lantern start'],
  ['vp_pickup_xp_soft.wav', 0.12, 880, 0.14, 'small paper sparkle'],
  ['vp_pickup_heal_warm.wav', 0.18, 523, 0.16, 'warm recovery chime'],
  ['vp_pickup_rare_seal.wav', 0.32, 660, 0.2, 'rare seal pulse'],
  ['vp_levelup_open_paper.wav', 0.28, 440, 0.18, 'paper fan open'],
  ['vp_card_select_ink.wav', 0.16, 330, 0.16, 'ink card tap'],
  ['vp_card_confirm.wav', 0.18, 392, 0.17, 'soft card confirm'],
  ['vp_weapon_fire_soft.wav', 0.10, 620, 0.12, 'soft lantern shot'],
  ['vp_enemy_hit_soft.wav', 0.09, 210, 0.14, 'soft hit'],
  ['vp_enemy_defeat_ink.wav', 0.22, 140, 0.2, 'ink bloom defeat'],
  ['vp_player_damage_mute.wav', 0.18, 120, 0.18, 'muted damage'],
  ['vp_evolution_convergence.wav', 0.42, 196, 0.2, 'material convergence'],
  ['vp_evolution_complete.wav', 0.48, 294, 0.22, 'evolution complete'],
  ['vp_kokuyou_ready.wav', 0.34, 164, 0.2, 'dark ready'],
  ['vp_kokuyou_activation.wav', 0.56, 110, 0.24, 'dark activation'],
  ['vp_kokuyou_ending.wav', 0.36, 147, 0.18, 'dark release'],
  ['vp_result_stamp.wav', 0.20, 185, 0.2, 'paper stamp'],
  ['vp_reward_card.wav', 0.22, 494, 0.15, 'reward card reveal'],
  ['vp_unlock_reveal.wav', 0.30, 587, 0.17, 'warm unlock reveal'],
  ['vp_stage_lantern.wav', 0.24, 392, 0.14, 'stage lantern glow'],
  ['vp_stage_route_unlock.wav', 0.28, 330, 0.16, 'route line unlock'],
  ['vp_retry_confirm.wav', 0.14, 260, 0.15, 'retry confirm'],
];

function envelope(i, total) {
  const t = i / total;
  const attack = Math.min(1, t / 0.08);
  const release = Math.max(0, 1 - t);
  return Math.sin(Math.min(1, attack) * Math.PI * 0.5) * release * release;
}

function wave(sampleIndex, length, frequency, palette) {
  const t = sampleIndex / sampleRate;
  const base = Math.sin(2 * Math.PI * frequency * t);
  const octave = Math.sin(2 * Math.PI * frequency * 2.01 * t) * 0.22;
  const paper = Math.sin(2 * Math.PI * (frequency * 0.5 + 11) * t) * 0.11;
  const ink = Math.sin(2 * Math.PI * (frequency * 0.25 + 7) * t + Math.sin(t * 27)) * 0.16;
  const noise = (((sampleIndex * 1103515245 + 12345) >>> 8) & 255) / 255 - 0.5;
  const noisy = palette.includes('ink') || palette.includes('damage') || palette.includes('dark') ? noise * 0.16 : noise * 0.05;
  return (base + octave + paper + ink + noisy) * envelope(sampleIndex, length);
}

function makeWav({ duration, frequency, peak, palette }) {
  const sampleCount = Math.floor(duration * sampleRate);
  const dataSize = sampleCount * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < sampleCount; i++) {
    const value = Math.max(-1, Math.min(1, wave(i, sampleCount, frequency, palette) * peak));
    buffer.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
  }
  return buffer;
}

mkdirSync(outputDir, { recursive: true });
mkdirSync(dirname(manifestPath), { recursive: true });
const manifest = {
  generatedBy: 'scripts/audio/generate-u28-draft-se.mjs',
  sourcePolicy: 'original placeholder / draft SE generated in-repo; no external material',
  productionStatus: 'draft-placeholder-not-final',
  sampleRate,
  assets: [],
};

for (const [fileName, duration, frequency, peak, note] of specs) {
  const path = join(outputDir, fileName);
  writeFileSync(path, makeWav({ duration, frequency, peak, palette: note }));
  manifest.assets.push({ fileName, path, durationSeconds: duration, peakDraft: peak, note, productionStatus: 'draft-placeholder-not-final' });
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`generated ${specs.length} U28 draft SE wav files`);
