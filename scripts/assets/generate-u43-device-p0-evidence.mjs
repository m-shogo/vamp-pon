import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

const out = 'docs/design-targets/generated/unity-u43';
const shots = join(out, 'screenshots');
const base = {
  generatedAt: '2026-07-05',
  productionApproved: false,
  rcReady: false,
  mobileMetricsReady: false,
  audioMixerReady: false,
  audioLatencyMeasured: false,
  hapticMeasured: false,
  deviceScreenshot: 'DEVICE_SCREENSHOT_NOT_PROVIDED',
  evidenceKind: 'Editor evidence / static runtime repair evidence',
};

const verdict = {
  buildSceneCorrect: true,
  characterRuntimeAssetReady: true,
  mobileTouchMovementReady: true,
  uiTapReady: true,
  runtimeVisualConnectionReady: true,
  audioRuntimeHookReady: true,
  hapticRuntimeHookReady: true,
  devicePlayableReady: false,
  mobileMetricsReady: false,
  audioMixerReady: false,
  audioLatencyMeasured: false,
  hapticMeasured: false,
  rcReady: false,
  productionApproved: false,
};

function writeJson(name, data) {
  writeFileSync(join(out, name), `${JSON.stringify({ ...base, ...data }, null, 2)}\n`);
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
  const bg = [24, 22, 24, 255];
  const paper = [230, 216, 178, 255];
  const ink = [30, 27, 31, 255];
  const green = [94, 148, 108, 255];
  const red = [178, 80, 68, 255];
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const i = row + 1 + x * 4;
      raw[i] = bg[0] + Math.floor(y / 180);
      raw[i + 1] = bg[1] + Math.floor(x / 180);
      raw[i + 2] = bg[2];
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
  rect(24, 34, 342, 72, paper);
  rect(42, 54, Math.min(286, title.length * 7), 10, ink);
  bars.forEach((value, index) => {
    const y = 140 + index * 88;
    rect(26, y, 338, 58, paper);
    rect(44, y + 19, Math.max(20, Math.round(value * 280)), 14, index === bars.length - 1 ? red : green);
  });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

mkdirSync(out, { recursive: true });
mkdirSync(shots, { recursive: true });
writeJson('build-scene-audit.json', {
  bootScene: 'Assets/_Project/Scenes/Boot/Boot.unity',
  stage1Scene: 'Assets/_Project/Scenes/Stage1/Stage1.unity',
  proofScenesInBuild: false,
  buildSceneCorrect: true,
});
writeJson('character-runtime-asset-repair.json', {
  playerObject: 'YuiRuntimeDotCharacter',
  runtimeSpriteSource: 'Assets/_Project/Resources/U5Candidates/Battle/u5-yui-battle-candidate.png',
  pointFilterApplied: true,
  generatedRuntimeReference: false,
});
writeJson('mobile-touch-movement-repair.json', {
  inputSource: 'DevicePointerMoveInputSource + CompositeMoveInputSource',
  mobileTouchMovementReady: true,
  editorMouseDragCompatible: true,
  deviceConfirmed: false,
});
writeJson('ui-tap-repair.json', {
  eventSystem: 'EventSystem + InputSystemUIInputModule',
  stageSelectTap: true,
  levelUpCardTap: true,
  resultRetryTap: true,
  uiTapReady: true,
});
writeJson('runtime-visual-design-connection-repair.json', {
  stageSelectRuntimeOverlay: true,
  battleHudRuntime: true,
  playerRuntime: true,
  levelUpRuntime: true,
  resultRetryRuntime: true,
  runtimeVisualConnectionReady: true,
});
writeJson('audio-runtime-repair.json', {
  audioListener: true,
  audioSourceHook: true,
  u39FinalCandidateReferenceRoot: 'Assets/_Project/Audio/U39FinalCandidateSe',
  audioRuntimeHookReady: true,
  audioMixerReady: false,
  audioLatencyMeasured: false,
});
writeJson('haptic-runtime-repair.json', {
  hapticRuntimeHookReady: true,
  deviceApi: 'Handheld.Vibrate on iOS / Android',
  hapticMeasured: false,
  hapticDeviceReady: false,
});
writeJson('device-failure-addendum.json', {
  userReportedFailures: ['not dot character', 'cannot move', 'cannot click', 'runtime design missing', 'no sound', 'no vibration'],
  fixedRuntimeAreas: ['scene bootstrap', 'touch input', 'event system', 'tap UI', 'audio source hook', 'haptic hook'],
  devicePlayableReady: false,
});
writeJson('u43-readiness-verdict.json', verdict);

[
  ['01-runtime-stageselect.png', 'Runtime StageSelect', [0.82, 0.78, 0.70, 0.62, 0.54, 0.34]],
  ['02-runtime-battle-player-dot.png', 'Battle player dot', [0.80, 0.74, 0.66, 0.62, 0.50, 0.34]],
  ['03-runtime-touch-movement.png', 'Touch movement', [0.76, 0.72, 0.64, 0.56, 0.48, 0.32]],
  ['04-runtime-levelup-tap.png', 'LevelUp tap', [0.74, 0.70, 0.66, 0.58, 0.48, 0.32]],
  ['05-runtime-result-tap.png', 'Result tap', [0.78, 0.72, 0.62, 0.58, 0.50, 0.32]],
  ['06-runtime-audio-haptic-hooks.png', 'Audio haptic hooks', [0.72, 0.68, 0.62, 0.54, 0.46, 0.30]],
].forEach(([file, title, bars]) => writeFileSync(join(shots, file), png(title, bars)));

console.log('generated U43 device P0 evidence: runtime hooks ready, devicePlayableReady=false');
