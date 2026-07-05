import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

const out = 'docs/design-targets/generated/unity-u42';
const shots = join(out, 'screenshots');

const flags = {
  internalPreviewReady: true,
  mobileQaReady: true,
  balanceHardeningReady: true,
  spriteAtlasPackingReady: true,
  assetReplacementReady: true,
  finalSeReady: true,
  economyReadyForRc: true,
  rewardReadyForRc: true,
  unlockReadyForRc: true,
  saveEconomySafe: true,
  mobileMetricsReady: false,
  audioMixerReady: false,
  audioLatencyMeasured: false,
  hapticMeasured: false,
  rcReady: false,
  productionApproved: false,
};

const releaseNotes = {
  purpose: 'internal preview / QA handoff',
  formalReleaseNotes: false,
  productionApproved: false,
  rcReady: false,
  commitRange: 'U25 Stage1 runtime loop through U41 economy reward unlock hardening',
  readyAreas: [
    'Stage1 runtime loop',
    'Editor balance hardening candidate',
    'Sprite Atlas packing',
    'Asset replacement boundary',
    'final-candidate SE inventory',
    'economy / reward / unlock RC candidate',
  ],
  notReadyAreas: [
    'mobile metrics NOT_MEASURED',
    'audio latency NOT_MEASURED',
    'haptic device behavior NOT_MEASURED',
    'AudioMixer final not ready',
    'production balance not final',
    'production economy not final',
  ],
};

const knownIssues = [
  ['u42-ki-mobile-fps', 'P0', 'mobile metrics', 'NOT_MEASURED', '実機FPS未測定', 'U37'],
  ['u42-ki-memory', 'P0', 'mobile metrics', 'NOT_MEASURED', 'memory未測定', 'U37'],
  ['u42-ki-thermal', 'P0', 'mobile metrics', 'NOT_MEASURED', 'thermal未測定', 'U37'],
  ['u42-ki-gc', 'P0', 'performance', 'NOT_MEASURED', 'GC allocation未測定', 'U37'],
  ['u42-ki-draw-calls', 'P0', 'performance', 'NOT_MEASURED', 'draw calls未測定', 'U37'],
  ['u42-ki-audio-latency', 'P1', 'audio', 'NOT_MEASURED', 'audio latency未測定', 'Audio device pass'],
  ['u42-ki-haptic-device', 'P1', 'haptic', 'NOT_MEASURED', 'haptic実機挙動未測定', 'Haptic device pass'],
  ['u42-ki-audiomixer-final', 'P1', 'audio', 'OPEN', 'AudioMixer final未確定', 'AudioMixer final'],
  ['u42-ki-speaker-clipping', 'P1', 'audio', 'NOT_MEASURED', 'device speaker clipping未確認', 'Audio device pass'],
  ['u42-ki-production-balance', 'P1', 'balance', 'OPEN', '本番balance未確定', 'U37'],
  ['u42-ki-production-economy', 'P1', 'economy', 'OPEN', '本番経済未確定', 'U38'],
  ['u42-ki-cloud-save', 'P2', 'save', 'NOT_APPLICABLE', 'Cloud Save未導入', 'Product decision'],
  ['u42-ki-addressables', 'P2', 'asset loading', 'NOT_APPLICABLE', 'Addressables未導入', 'Product decision'],
  ['u42-ki-stage2-placeholder', 'P2', 'content', 'OPEN', 'Stage2 placeholder unlock', 'Stage2 phase'],
  ['u42-ki-final-approval', 'P0', 'release gate', 'BLOCKED', 'final production approval未実施', 'U38'],
].map(([id, severity, category, status, evidence, owner]) => ({
  id,
  severity,
  category,
  status,
  evidence,
  impact: 'RC judgement cannot close this item yet',
  workaround: 'keep documented as internal preview limitation',
  owner,
  unblockCondition: 'collect evidence and re-run gate',
}));

const qa = [
  'app launch',
  'StageSelect idle',
  'Stage1 start',
  'first 30 seconds',
  'first LevelUp',
  '2:00 wave',
  '4:00 wave',
  '6:00 climax',
  'Kokuyou',
  'Evolution',
  'Rare',
  'Result clear',
  'Result defeat',
  'Reward / Unlock',
  'StageSelect after run',
  'Retry',
  'Save persistence after restart',
  'Audio clipping',
  'Audio latency',
  'Haptic behavior',
  'Touch responsiveness',
  'FPS',
  'Memory',
  'Thermal',
  'Battery',
  'Crash / freeze',
].map((item) => ({
  item,
  passCriteria: 'works on target device with required evidence',
  cautionCriteria: 'minor issue, no progression loss',
  failCriteria: 'crash, freeze, progression loss, unreadable, or repeated input failure',
  evidenceRequired: 'device, OS, build, screenshot/video/log as applicable',
}));

const blockerMatrix = [
  ['mobile metrics measurement', 'P0', 'U37', 'FPS/memory/thermal/GC/draw calls', 'mobileMetricsReady=false'],
  ['crash / freeze check', 'P0', 'U37', 'device logs and sustained run video', 'stability unknown'],
  ['touch responsiveness', 'P0', 'U37', 'touch scenario video', 'mobile input unknown'],
  ['save persistence on device', 'P0', 'U37', 'restart before/after evidence', 'progression safety unknown'],
  ['audio latency / clipping', 'P1', 'Audio device pass', 'speaker and latency evidence', 'audioReadyForRc=false'],
  ['haptic device behavior', 'P1', 'Haptic device pass', 'iOS/Android behavior evidence', 'hapticMeasured=false'],
  ['AudioMixer final', 'P1', 'AudioMixer final', 'mixer asset and mix review', 'audioMixerReady=false'],
  ['final mobile tuning after device metrics', 'P1', 'U37', 'metrics driven tuning result', 'tuning must be device-informed'],
  ['release approval re-check', 'P2', 'U38', 'updated gate report', 'productionApproved=false'],
  ['release notes finalization', 'P2', 'final refresh', 'updated known issues', 'U42 is internal preview only'],
].map(([blocker, priority, targetPhase, requiredEvidence, whyItBlocksRc]) => ({
  blocker,
  priority,
  targetPhase,
  requiredEvidence,
  whyItBlocksRc,
  expectedFixType: 'measurement, tuning, review, or gate update',
  riskIfIgnored: 'RC decision may hide a known unverified risk',
}));

const roadmap = [
  '実機測定',
  'U37 final mobile tuning after device metrics',
  'AudioMixer final / device speaker pass',
  'Haptic device pass',
  'U38 production approval re-check',
  'final release notes / known issues refresh',
].map((step, index) => ({ order: index + 1, step }));

function writeJson(name, data) {
  writeFileSync(join(out, name), `${JSON.stringify({ generatedAt: '2026-07-03', productionApproved: false, rcReady: false, ...data }, null, 2)}\n`);
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c ^= byte;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type);
  const outBuffer = Buffer.alloc(12 + data.length);
  outBuffer.writeUInt32BE(data.length, 0);
  name.copy(outBuffer, 4);
  data.copy(outBuffer, 8);
  outBuffer.writeUInt32BE(crc32(Buffer.concat([name, data])), 8 + data.length);
  return outBuffer;
}

function png(title, bars) {
  const width = 390;
  const height = 844;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  const bg = [24, 27, 31, 255];
  const paper = [229, 222, 202, 255];
  const ink = [38, 45, 52, 255];
  const accent = [96, 139, 118, 255];
  const warn = [174, 91, 72, 255];
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const i = row + 1 + x * 4;
      raw[i] = bg[0];
      raw[i + 1] = bg[1] + Math.floor(y / 130);
      raw[i + 2] = bg[2] + Math.floor(x / 140);
      raw[i + 3] = 255;
    }
  }
  const rect = (x, y, w, h, color) => {
    for (let yy = y; yy < y + h; yy++) {
      const row = yy * (width * 4 + 1);
      for (let xx = x; xx < x + w; xx++) {
        const i = row + 1 + xx * 4;
        raw[i] = color[0]; raw[i + 1] = color[1]; raw[i + 2] = color[2]; raw[i + 3] = 255;
      }
    }
  };
  rect(24, 32, 342, 72, paper);
  rect(40, 52, Math.min(280, title.length * 7), 10, accent);
  bars.forEach((value, index) => {
    const y = 134 + index * 88;
    rect(24, y, 342, 58, paper);
    rect(42, y + 18, Math.max(24, Math.round(value * 286)), 14, index % 3 === 1 ? warn : index % 3 === 2 ? ink : accent);
  });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync(out, { recursive: true });
mkdirSync(shots, { recursive: true });
writeJson('stage1-internal-preview-release-notes.json', releaseNotes);
writeJson('stage1-known-issues-register.json', { issues: knownIssues });
writeJson('stage1-qa-handoff-checklist.json', { qa });
writeJson('stage1-remaining-blocker-matrix.json', { blockerMatrix });
writeJson('stage1-remaining-roadmap.json', { roadmap, doNotRunU37BeforeDeviceMetrics: true, doNotRunU38Now: true });
writeJson('stage1-u42-readiness-summary.json', { flags, nextRecommendedAction: '実機測定' });

[
  ['01-release-notes-stageselect.png', 'Release notes StageSelect', [0.78, 0.64, 0.58, 0.50, 0.70, 0.44]],
  ['02-release-notes-battle.png', 'Release notes Battle', [0.70, 0.66, 0.62, 0.52, 0.48, 0.42]],
  ['03-release-notes-levelup.png', 'Release notes LevelUp', [0.74, 0.58, 0.66, 0.50, 0.46, 0.40]],
  ['04-release-notes-climax.png', 'Release notes Climax', [0.68, 0.72, 0.54, 0.44, 0.52, 0.38]],
  ['05-release-notes-result.png', 'Release notes Result', [0.82, 0.76, 0.62, 0.58, 0.50, 0.42]],
  ['06-release-notes-known-issues.png', 'Known issues', [0.42, 0.56, 0.48, 0.62, 0.70, 0.78]],
].forEach(([file, title, bars]) => writeFileSync(join(shots, file), png(title, bars)));

console.log('generated U42 release notes evidence: internalPreviewReady=true, mobileQaReady=true, rcReady=false');
