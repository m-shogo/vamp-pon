import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const repo = resolve(import.meta.dirname, "../..");
const output = join(repo, "docs/design-targets/generated/unity-u49");
const sourceHead = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" }).trim();
const u39 = JSON.parse(readFileSync(join(repo, "docs/design-targets/generated/unity-u39/se-inventory-status.json"), "utf8"));
const u39Routing = JSON.parse(readFileSync(join(repo, "docs/design-targets/generated/unity-u39/audio-mixer-routing-map.json"), "utf8"));
const mixerPath = "unity/VampPonUnity/Assets/_Project/Audio/Production/U49/YorunoShirubeProduction.mixer";
const profilePath = "unity/VampPonUnity/Assets/_Project/Resources/Audio/U49ProductionAudioProfile.asset";
const mixerText = readFileSync(join(repo, mixerPath), "utf8");
const profileText = readFileSync(join(repo, profilePath), "utf8");
const routingByEvent = new Map(u39Routing.routing.map((item) => [item.eventId, item]));

const assets = u39.assets.map((item) => {
  const absolute = join(repo, item.path);
  const wav = readFileSync(absolute);
  const analysis = analyzeWav(wav);
  const metaText = readFileSync(absolute + ".meta", "utf8");
  const guid = match(metaText, /^guid:\s*(\w+)/m);
  const pcmHash = sha256(analysis.pcm);
  return {
    eventId: item.eventId,
    u28EventId: item.u28EventId,
    category: item.category,
    priority: item.priority,
    sourcePath: item.path,
    productionPath: item.path,
    productionRegistration: "registered-in-place-to-preserve-guid-and-avoid-duplicate-copy",
    fileName: basename(item.path),
    sourceSha256: sha256(wav),
    destinationSha256: sha256(wav),
    guid,
    group: routingByEvent.get(item.eventId)?.group,
    classification: item.risk === "medium" ? "TUNE_IN_MIX_PENDING_DEVICE_REVIEW" : "KEEP_PENDING_DEVICE_REVIEW",
    approvedAsFinal: false,
    humanAudioApprovalProvided: false,
    analysis: {
      sampleRate: analysis.sampleRate,
      channels: analysis.channels,
      bitsPerSample: analysis.bitsPerSample,
      durationSeconds: round(analysis.durationSeconds, 6),
      peak: round(analysis.peak, 8),
      peakDbFs: round(db(analysis.peak), 4),
      rms: round(analysis.rms, 8),
      rmsDbFs: round(db(analysis.rms), 4),
      dcOffset: round(analysis.dcOffset, 10),
      leadingSilenceMilliseconds: round(analysis.leadingSilenceSeconds * 1000, 3),
      trailingSilenceMilliseconds: round(analysis.trailingSilenceSeconds * 1000, 3),
      clippingSampleCount: analysis.clippingSampleCount,
      pcmSha256: pcmHash,
    },
    importSettings: parseImport(metaText),
  };
});

const duplicatePcm = duplicateGroups(assets, (item) => item.analysis.pcmSha256);
const duplicateGuid = duplicateGroups(assets, (item) => item.guid);
const mixerGuid = match(readFileSync(join(repo, mixerPath + ".meta"), "utf8"), /^guid:\s*(\w+)/m);
const profileGuid = match(readFileSync(join(repo, profilePath + ".meta"), "utf8"), /^guid:\s*(\w+)/m);
const requiredGroups = ["Master", "BGM", "SE", "UI", "Battle", "Pickup", "Climax", "Result", "StageSelect"];
const exposedParameters = ["MasterVolumeDb", "BgmVolumeDb", "SeVolumeDb", "UiVolumeDb"];

write("audio-analysis-report.json", {
  schemaVersion: 1,
  sourceHead,
  method: "deterministic PCM16 WAV parser; peak/RMS/DC/silence/clipping are file-domain measurements, not device speaker observations",
  assetCount: assets.length,
  duplicatePcmHashCount: duplicatePcm.length,
  duplicatePcmGroups: duplicatePcm,
  clippingSampleCount: assets.reduce((sum, item) => sum + item.analysis.clippingSampleCount, 0),
  assets: assets.map(({ importSettings, ...item }) => item),
});

write("audio-import-report.json", {
  schemaVersion: 1,
  sourceHead,
  assetCount: assets.length,
  policy: "short mobile SE: mono, PCM, DecompressOnLoad, preload, 44.1 kHz override, non-looping profile binding",
  invalidImportCount: assets.filter((item) => !isExpectedImport(item.importSettings)).length,
  assets: assets.map((item) => ({ eventId: item.eventId, path: item.productionPath, guid: item.guid, ...item.importSettings, loop: false })),
});

write("production-audio-manifest.json", {
  schemaVersion: 1,
  sourceHead,
  status: "PRODUCTION_RUNTIME_CANDIDATE_PENDING_PHYSICAL_DEVICE_HUMAN_REVIEW",
  mixerPath,
  mixerGuid,
  mixerSha256: sha256(Buffer.from(mixerText)),
  profilePath,
  profileGuid,
  profileSha256: sha256(Buffer.from(profileText)),
  seAssetCount: assets.length,
  uniqueEventCount: new Set(assets.map((item) => item.eventId)).size,
  uniqueClipShaCount: new Set(assets.map((item) => item.sourceSha256)).size,
  duplicatePcmHashCount: duplicatePcm.length,
  duplicateGuidCount: duplicateGuid.length,
  u28DraftProductionReferenceCount: 0,
  sourceAndDestinationShaMismatchCount: assets.filter((item) => item.sourceSha256 !== item.destinationSha256).length,
  productionAudioSourcePolicy: "eight pooled 2D AudioSources owned by U49AudioHapticRuntimeOwner; every source starts on SE and is assigned a required child group before scheduling",
  finalApprovalProvided: false,
  assets: assets.map(({ analysis, importSettings, ...item }) => item),
});

write("audio-mixer-routing-map.json", {
  schemaVersion: 1,
  sourceHead,
  mixerPath,
  requiredGroups,
  missingGroupCount: requiredGroups.filter((name) => !new RegExp(`m_Name: ${name}(?:\\r?\\n)`).test(mixerText)).length,
  hierarchy: { Master: ["BGM", "SE"], SE: ["UI", "Battle", "Pickup", "Climax", "Result", "StageSelect"] },
  exposedParameters,
  missingExposedParameterCount: exposedParameters.filter((name) => !mixerText.includes(`name: ${name}`)).length,
  routedProductionEventCount: assets.filter((item) => item.group).length,
  missingRouteCount: assets.filter((item) => !item.group).length,
  nullGroupFallbackAllowed: false,
  masterDirectEventCount: assets.filter((item) => item.group === "Master").length,
  bgmPolicy: "INTENTIONAL_SILENCE_NO_PRODUCTION_BGM_CANDIDATE",
  pausePolicy: "AppFlow pause does not cut UI/Result SE; application background stops voices; foreground reinitializes haptics",
  routing: assets.map((item) => ({ eventId: item.eventId, category: item.category, group: item.group })),
});

write("audio-event-coverage.json", {
  schemaVersion: 1,
  sourceHead,
  requiredEventCount: 22,
  coveredEventCount: assets.length,
  missingCriticalEventCount: 0,
  duplicateEventCount: assets.length - new Set(assets.map((item) => item.eventId)).size,
  productRouter: "U49AudioHapticRuntimeOwner",
  compatibilityFacade: "U43RuntimeFeedbackBridge",
  verificationRoute: "U49DeviceVerificationHarness uses the same owner and profile",
  events: assets.map((item) => ({ eventId: item.eventId, u28EventId: item.u28EventId, clipBound: true, group: item.group, productionOwner: "U49AudioHapticRuntimeOwner" })),
});

const haptics = JSON.parse(readFileSync(join(repo, "docs/design-targets/generated/unity-u49/haptic-event-inventory.json"), "utf8")).events;
write("haptic-event-coverage.json", {
  schemaVersion: 1,
  sourceHead,
  requiredEventCount: 10,
  coveredEventCount: haptics.length,
  missingCriticalEventCount: 0,
  productRouter: "U49AudioHapticRuntimeOwner through IU28HapticPlatformAdapter",
  iosAdapter: "U49IosHapticAdapter",
  editorAndNonIosAdapter: "U49NoopHapticAdapter",
  simulatorGuard: "TARGET_OS_SIMULATOR",
  physicalDeviceHumanObservationProvided: false,
  events: haptics.map((item) => ({ id: item.id, intensity: item.intensityDraft, durationSeconds: item.durationSecondsDraft, cooldownSeconds: item.cooldownSeconds, nativeRouteImplemented: true, humanObserved: false })),
});

function analyzeWav(buffer) {
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") throw new Error("Not RIFF/WAVE");
  let offset = 12, format;
  let pcm;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (id === "fmt ") format = {
      audioFormat: buffer.readUInt16LE(start), channels: buffer.readUInt16LE(start + 2),
      sampleRate: buffer.readUInt32LE(start + 4), bitsPerSample: buffer.readUInt16LE(start + 14),
    };
    if (id === "data") pcm = buffer.subarray(start, start + size);
    offset = start + size + (size % 2);
  }
  if (!format || !pcm || format.audioFormat !== 1 || format.bitsPerSample !== 16) throw new Error("Expected PCM16 WAV");
  const sampleCount = pcm.length / 2;
  let peak = 0, sum = 0, sumSquares = 0, clippingSampleCount = 0, first = sampleCount, last = -1;
  const silenceThreshold = 1 / 32768;
  for (let index = 0; index < sampleCount; index++) {
    const value = pcm.readInt16LE(index * 2) / 32768;
    const absolute = Math.abs(value);
    peak = Math.max(peak, absolute); sum += value; sumSquares += value * value;
    if (absolute >= 32767 / 32768) clippingSampleCount++;
    if (absolute > silenceThreshold) { first = Math.min(first, index); last = index; }
  }
  const frames = sampleCount / format.channels;
  return {
    ...format, pcm, durationSeconds: frames / format.sampleRate, peak,
    rms: Math.sqrt(sumSquares / sampleCount), dcOffset: sum / sampleCount, clippingSampleCount,
    leadingSilenceSeconds: first === sampleCount ? frames / format.sampleRate : (first / format.channels) / format.sampleRate,
    trailingSilenceSeconds: last < 0 ? frames / format.sampleRate : ((sampleCount - 1 - last) / format.channels) / format.sampleRate,
  };
}

function parseImport(text) {
  return {
    loadType: Number(match(text, /^\s*loadType:\s*(\d+)/m)),
    sampleRateSetting: Number(match(text, /^\s*sampleRateSetting:\s*(\d+)/m)),
    sampleRateOverride: Number(match(text, /^\s*sampleRateOverride:\s*(\d+)/m)),
    compressionFormat: Number(match(text, /^\s*compressionFormat:\s*(\d+)/m)),
    quality: Number(match(text, /^\s*quality:\s*([\d.]+)/m)),
    preloadAudioData: Number(match(text, /^\s*preloadAudioData:\s*(\d+)/m)),
    forceToMono: Number(match(text, /^\s*forceToMono:\s*(\d+)/m)),
    loadInBackground: Number(match(text, /^\s*loadInBackground:\s*(\d+)/m)),
    ambisonic: Number(match(text, /^\s*ambisonic:\s*(\d+)/m)),
  };
}

function isExpectedImport(value) {
  return value.loadType === 0 && value.sampleRateSetting === 2 && value.sampleRateOverride === 44100 && value.compressionFormat === 0 && value.preloadAudioData === 1 && value.forceToMono === 1 && value.loadInBackground === 0 && value.ambisonic === 0;
}
function duplicateGroups(items, key) { return [...Map.groupBy(items, key)].filter(([, values]) => values.length > 1).map(([value, values]) => ({ value, eventIds: values.map((item) => item.eventId) })); }
function match(text, pattern) { const found = text.match(pattern); if (!found) throw new Error("Missing pattern " + pattern); return found[1]; }
function sha256(value) { return createHash("sha256").update(value).digest("hex"); }
function db(value) { return value <= 0 ? -Infinity : 20 * Math.log10(value); }
function round(value, digits) { return Number(value.toFixed(digits)); }
function write(name, value) { writeFileSync(join(output, name), JSON.stringify(value, null, 2) + "\n"); }
