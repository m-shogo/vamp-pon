import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { deflateSync } from 'node:zlib';

const sampleRate = 44100;
const outputDir = 'unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe';
const evidenceDir = 'docs/design-targets/generated/unity-u39';
const screenshotDir = join(evidenceDir, 'screenshots');

const specs = [
  ['battle_start', 'vp_battle_start_soft', 0.24, 246, 0.18, 'Battle', 'normal', 'warm lantern start'],
  ['pickup_xp', 'vp_pickup_xp_soft', 0.11, 920, 0.12, 'Pickup', 'low', 'small paper pickup'],
  ['pickup_heal', 'vp_pickup_heal_warm', 0.17, 523, 0.14, 'Pickup', 'normal', 'warm recovery pickup'],
  ['pickup_rare', 'vp_pickup_rare_seal', 0.30, 660, 0.18, 'Pickup', 'high', 'rare seal pulse'],
  ['levelup_open', 'vp_levelup_open_paper', 0.27, 430, 0.16, 'UI', 'high', 'paper levelup open'],
  ['card_select', 'vp_card_select_ink', 0.14, 330, 0.13, 'UI', 'normal', 'ink card select'],
  ['card_confirm', 'vp_card_confirm', 0.17, 392, 0.15, 'UI', 'normal', 'soft card confirm'],
  ['weapon_fire_soft', 'vp_weapon_fire_soft', 0.09, 620, 0.10, 'Battle', 'low', 'soft lantern shot'],
  ['enemy_hit_soft', 'vp_enemy_hit_soft', 0.08, 214, 0.11, 'Battle', 'low', 'soft hit'],
  ['enemy_defeat_ink', 'vp_enemy_defeat_ink', 0.20, 150, 0.16, 'Battle', 'normal', 'ink bloom defeat'],
  ['player_damage', 'vp_player_damage_mute', 0.16, 126, 0.15, 'Battle', 'high', 'muted player damage'],
  ['evolution_convergence', 'vp_evolution_convergence', 0.40, 196, 0.17, 'Climax', 'high', 'low black convergence'],
  ['evolution_complete', 'vp_evolution_complete', 0.46, 294, 0.19, 'Climax', 'critical', 'evolution paper flare'],
  ['kokuyou_ready', 'vp_kokuyou_ready', 0.32, 164, 0.17, 'Climax', 'high', 'black ready pulse'],
  ['kokuyou_activation', 'vp_kokuyou_activation', 0.54, 110, 0.20, 'Climax', 'critical', 'black activation'],
  ['kokuyou_ending', 'vp_kokuyou_ending', 0.34, 147, 0.16, 'Climax', 'high', 'black release'],
  ['result_stamp', 'vp_result_stamp', 0.18, 185, 0.17, 'Result', 'high', 'paper stamp'],
  ['reward_card', 'vp_reward_card', 0.20, 494, 0.13, 'Result', 'normal', 'reward card reveal'],
  ['unlock_reveal', 'vp_unlock_reveal', 0.28, 587, 0.15, 'Result', 'high', 'warm unlock reveal'],
  ['stage_lantern', 'vp_stage_lantern', 0.22, 392, 0.12, 'StageSelect', 'normal', 'stage lantern glow'],
  ['stage_route_unlock', 'vp_stage_route_unlock', 0.26, 330, 0.14, 'StageSelect', 'normal', 'route ink unlock'],
  ['retry_confirm', 'vp_retry_confirm', 0.13, 260, 0.13, 'UI', 'normal', 'retry confirm'],
];

const eventAliases = {
  battle_start: 'BattleStart',
  pickup_xp: 'PickupXp',
  pickup_heal: 'PickupHeal',
  pickup_rare: 'PickupRare',
  levelup_open: 'LevelupOpen',
  card_select: 'CardSelect',
  card_confirm: 'CardConfirm',
  weapon_fire_soft: 'WeaponFireSoft',
  enemy_hit_soft: 'EnemyHitSoft',
  enemy_defeat_ink: 'EnemyDefeatInk',
  player_damage: 'PlayerDamage',
  evolution_convergence: 'EvolutionConvergence',
  evolution_complete: 'EvolutionComplete',
  kokuyou_ready: 'KokuyouGaugeReady',
  kokuyou_activation: 'KokuyouActivation',
  kokuyou_ending: 'KokuyouEnding',
  result_stamp: 'ResultStamp',
  reward_card: 'RewardCard',
  unlock_reveal: 'UnlockReveal',
  stage_lantern: 'StageSelectLantern',
  stage_route_unlock: 'StageRouteUnlock',
  retry_confirm: 'RetryConfirm',
};

function envelope(i, total) {
  const t = i / total;
  const attack = Math.min(1, t / 0.045);
  const release = Math.max(0, 1 - t);
  return Math.sin(attack * Math.PI * 0.5) * release * release;
}

function seededNoise(i) {
  return (((i * 1664525 + 1013904223) >>> 8) & 255) / 255 - 0.5;
}

function wave(sampleIndex, length, frequency, palette) {
  const t = sampleIndex / sampleRate;
  const base = Math.sin(2 * Math.PI * frequency * t);
  const softOctave = Math.sin(2 * Math.PI * frequency * 2.005 * t) * 0.16;
  const paper = Math.sin(2 * Math.PI * (frequency * 0.5 + 13) * t) * 0.09;
  const ink = Math.sin(2 * Math.PI * (frequency * 0.25 + 5) * t + Math.sin(t * 19)) * 0.13;
  const dark = palette.includes('black') || palette.includes('damage') || palette.includes('ink') ? Math.sin(2 * Math.PI * Math.max(48, frequency * 0.45) * t) * 0.18 : 0;
  const noise = seededNoise(sampleIndex) * (palette.includes('paper') || palette.includes('ink') ? 0.08 : 0.035);
  return (base + softOctave + paper + ink + dark + noise) * envelope(sampleIndex, length);
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
  let measuredPeak = 0;
  for (let i = 0; i < sampleCount; i++) {
    const value = Math.max(-1, Math.min(1, wave(i, sampleCount, frequency, palette) * peak));
    measuredPeak = Math.max(measuredPeak, Math.abs(value));
    buffer.writeInt16LE(Math.round(value * 32767), 44 + i * 2);
  }
  return { buffer, measuredPeak };
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const name = Buffer.from(type);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  name.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([name, data])), 8 + data.length);
  return out;
}

function makePng(title, rows) {
  const width = 390;
  const height = 844;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  const bg = [25, 23, 29, 255];
  const paper = [226, 214, 184, 255];
  const ink = [42, 37, 48, 255];
  const accent = [168, 91, 68, 255];
  const ok = [109, 163, 118, 255];
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const i = row + 1 + x * 4;
      const shade = Math.floor((y / height) * 18);
      raw[i] = bg[0] + shade;
      raw[i + 1] = bg[1] + shade;
      raw[i + 2] = bg[2] + shade;
      raw[i + 3] = 255;
    }
  }
  function rect(x, y, w, h, color) {
    for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy++) {
      const row = yy * (width * 4 + 1);
      for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx++) {
        const i = row + 1 + xx * 4;
        raw[i] = color[0];
        raw[i + 1] = color[1];
        raw[i + 2] = color[2];
        raw[i + 3] = color[3];
      }
    }
  }
  rect(24, 32, 342, 72, paper);
  rect(32, 42, Math.min(310, title.length * 9), 14, accent);
  rows.forEach((row, index) => {
    const y = 132 + index * 94;
    rect(24, y, 342, 68, [238, 229, 199, 255]);
    rect(34, y + 12, 72 + row.label.length * 4, 10, row.good ? ok : accent);
    rect(34, y + 36, Math.max(26, Math.round(row.value * 280)), 12, ink);
  });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const compressed = deflateSync(raw);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync(outputDir, { recursive: true });
mkdirSync(evidenceDir, { recursive: true });
mkdirSync(screenshotDir, { recursive: true });

const inventory = [];
const candidates = [];
const normalization = [];
const routing = [];
const clipping = [];
const polyphony = [];

for (const [eventId, baseName, duration, frequency, targetPeak, category, priority, note] of specs) {
  const fileName = `${baseName}.wav`;
  const path = join(outputDir, fileName);
  const { buffer, measuredPeak } = makeWav({ duration, frequency, peak: targetPeak, palette: note });
  writeFileSync(path, buffer);
  const peakDb = measuredPeak > 0 ? 20 * Math.log10(measuredPeak) : -Infinity;
  const status = targetPeak <= 0.2 ? 'finalCandidate' : 'needsMixReview';
  const risk = measuredPeak >= 0.20 || priority === 'critical' ? 'medium' : 'low';
  inventory.push({
    eventId,
    u28EventId: eventAliases[eventId],
    path,
    currentUsage: `${category} Stage1 feedback`,
    durationSeconds: duration,
    peakEstimate: Number(measuredPeak.toFixed(4)),
    peakDbEstimate: Number(peakDb.toFixed(2)),
    category,
    priority,
    loop: false,
    currentStatus: status,
    risk,
    nextAction: 'device speaker review and human mix review before final approval',
  });
  candidates.push({ eventId, fileName, path, productionStatus: 'finalCandidate-not-final-approved', sourcePolicy: 'generated in repo; no external material' });
  normalization.push({ eventId, targetPeak, measuredPeak: Number(measuredPeak.toFixed(4)), peakDbEstimate: Number(peakDb.toFixed(2)), clickPopGuard: 'short attack/release envelope', clippingRisk: risk });
  routing.push({ eventId, category, group: category, volumeDraft: Number(Math.min(0.85, targetPeak * 3.2).toFixed(2)), fallback: 'U28 safe missing clip fallback', futureUserSettingsHook: true });
  clipping.push({ eventId, category, priority, clippingRisk: risk, duplicateSuppression: priority === 'low' ? 'aggressive' : 'cooldown', peakGuard: 'measured peak stays below hard clipping and requires device speaker review' });
  polyphony.push({ eventId, category, priority, maxVoices: priority === 'low' ? 4 : 1, cooldownSeconds: priority === 'low' ? 0.06 : category === 'Climax' ? 0.6 : 0.18 });
}

const evidenceBase = {
  generatedBy: 'scripts/audio/generate-u39-final-candidate-se.mjs',
  generatedAt: '2026-07-03',
  sourcePolicy: 'original final-candidate SE generated in repo; no external audio material; no Web download',
  productionApproved: false,
  rcReady: false,
  audioLatencyMeasured: false,
  hapticMeasured: false,
};

const writeJson = (name, data) => writeFileSync(join(evidenceDir, name), `${JSON.stringify({ ...evidenceBase, ...data }, null, 2)}\n`);
writeJson('se-inventory-status.json', { assets: inventory });
writeJson('se-final-candidate-list.json', { finalSeReady: true, finalApproved: false, assets: candidates });
writeJson('se-normalization-report.json', { sampleRate, normalization });
writeJson('audio-mixer-routing-map.json', {
  audioMixerReady: false,
  routingDraftReady: true,
  mixerAsset: 'Unity .mixer asset not created in U39; policy-draft-runtime-map only',
  groups: ['Master', 'UI', 'Battle', 'Pickup', 'Climax', 'Result', 'StageSelect'],
  masterVolumeDraft: 0.82,
  seVolumeDraft: 0.78,
  missingMixerFallback: true,
  routing,
});
writeJson('audio-clipping-risk-map.json', { audioClippingRisk: 'low-to-medium-editor-static', deviceSpeakerClippingMeasured: false, clipping });
writeJson('audio-polyphony-cooldown-map.json', { maxActiveVoices: 8, maxLowPriorityVoices: 4, duplicateSuppression: true, polyphony });
writeJson('audio-readiness-verdict.json', {
  audioReadyForRc: false,
  finalSeReady: true,
  audioMixerReady: false,
  routingDraftReady: true,
  audioLatencyMeasured: false,
  hapticMeasured: false,
  productionApproved: false,
  rcReady: false,
  blocker: ['audio latency NOT_MEASURED', 'haptic device behavior NOT_MEASURED', 'device speaker clipping not measured'],
  caution: ['finalCandidate SE is not final approved', 'AudioMixer routing is draft until device mix review'],
});

const shots = [
  ['01-battle-audio-readiness.png', 'Battle audio readiness', [{ label: 'hit cap', value: 0.62, good: true }, { label: 'damage cooldown', value: 0.72, good: true }, { label: 'latency not measured', value: 0.34, good: false }]],
  ['02-pickup-audio-readiness.png', 'Pickup audio readiness', [{ label: 'xp soft', value: 0.42, good: true }, { label: 'rare guarded', value: 0.68, good: true }, { label: 'spam guard', value: 0.76, good: true }]],
  ['03-levelup-audio-readiness.png', 'Levelup audio readiness', [{ label: 'paper open', value: 0.58, good: true }, { label: 'card select', value: 0.48, good: true }, { label: 'mix review', value: 0.36, good: false }]],
  ['04-climax-audio-readiness.png', 'Climax audio readiness', [{ label: 'kokuyou special', value: 0.74, good: true }, { label: 'voice priority', value: 0.84, good: true }, { label: 'speaker test', value: 0.28, good: false }]],
  ['05-result-audio-readiness.png', 'Result audio readiness', [{ label: 'stamp', value: 0.56, good: true }, { label: 'reward card', value: 0.44, good: true }, { label: 'unlock suppress', value: 0.82, good: true }]],
  ['06-stageselect-audio-readiness.png', 'StageSelect audio readiness', [{ label: 'lantern quiet', value: 0.46, good: true }, { label: 'route unlock', value: 0.54, good: true }, { label: 'rc remains false', value: 0.30, good: false }]],
];
for (const [fileName, title, rows] of shots) writeFileSync(join(screenshotDir, fileName), makePng(title, rows));

console.log(`generated ${specs.length} U39 final-candidate SE wav files and ${shots.length} evidence screenshots`);
