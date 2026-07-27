import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";

const repo = resolve(import.meta.dirname, "../..");
const output = join(repo, "docs/design-targets/generated/unity-u49");
const unity = join(repo, "unity/VampPonUnity");
const sourceHead = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" }).trim();
const u39 = JSON.parse(readFileSync(join(repo, "docs/design-targets/generated/unity-u39/se-inventory-status.json"), "utf8"));
const u39Routing = JSON.parse(readFileSync(join(repo, "docs/design-targets/generated/unity-u39/audio-mixer-routing-map.json"), "utf8"));
const u28Haptics = JSON.parse(readFileSync(join(repo, "docs/design-targets/generated/unity-u28/haptic-event-map.json"), "utf8"));
const u48 = JSON.parse(readFileSync(join(repo, "docs/design-targets/generated/unity-u48/readiness.json"), "utf8"));
const u48Production = JSON.parse(readFileSync(join(repo, "docs/design-targets/generated/unity-u48/approved-production-set.json"), "utf8"));

mkdirSync(output, { recursive: true });

const runtimeRequests = {
  battle_start: ["U1Stage1SceneBootstrap.StartStage", "U43RuntimeFeedbackBridge.PlayBattleStart"],
  pickup_xp: ["U2BattleController pickup collection", "U43RuntimeFeedbackBridge.PlayPickup"],
  pickup_heal: ["U28Stage1FeelRuntimeConnector.OnHealPickup (request-only legacy route)"],
  pickup_rare: ["U4LevelUpDemoController rare choice", "U43RuntimeFeedbackBridge.PlayRare"],
  levelup_open: ["U4LevelUpDemoController.Open", "U43RuntimeFeedbackBridge.PlayLevelUp"],
  card_select: ["U28Stage1FeelRuntimeConnector card_select (request-only legacy route)"],
  card_confirm: ["PaperButton/PaperCard", "U43RuntimeFeedbackBridge.PlayButtonTapIfAvailable"],
  weapon_fire_soft: ["U2BattleController projectile fire", "U43RuntimeFeedbackBridge.PlayWeaponFire"],
  enemy_hit_soft: ["U2BattleController hit", "U43RuntimeFeedbackBridge.PlayEnemyHit"],
  enemy_defeat_ink: ["U2BattleController defeat", "U43RuntimeFeedbackBridge.PlayEnemyDefeat"],
  player_damage: ["U28Stage1FeelRuntimeConnector.OnPlayerDamage (request-only legacy route)"],
  evolution_convergence: ["U28Stage1FeelRuntimeConnector climax hook (request-only legacy route)"],
  evolution_complete: ["U4LevelUpDemoController evolution", "U43RuntimeFeedbackBridge.PlayEvolution"],
  kokuyou_ready: ["U28Stage1FeelRuntimeConnector climax hook (request-only legacy route)"],
  kokuyou_activation: ["U43RuntimeFeedbackBridge.PlayKokuyou public route; gameplay caller missing at phase start"],
  kokuyou_ending: ["U28Stage1FeelRuntimeConnector climax hook (request-only legacy route)"],
  result_stamp: ["U43RuntimeFeedbackBridge.PlayResult public route; result caller missing at phase start"],
  reward_card: ["U28Stage1FeelRuntimeConnector result route (request-only legacy route)"],
  unlock_reveal: ["U28Stage1FeelRuntimeConnector result route (request-only legacy route)"],
  stage_lantern: ["U1Stage1SceneBootstrap StageSelect", "U43RuntimeFeedbackBridge.PlayStageSelect"],
  stage_route_unlock: ["U28Stage1FeelRuntimeConnector StageSelect route (request-only legacy route)"],
  retry_confirm: ["U1Stage1SceneBootstrap Retry", "U43RuntimeFeedbackBridge.PlayRetry"],
};

const audioEvents = u39.assets.map((item) => ({
  ...item,
  clipFileName: basename(item.path),
  runtimeRequestSites: runtimeRequests[item.eventId] ?? [],
  phaseStartPlayback: "runtime-generated-tone",
  phaseStartMixerRouting: "bypass-no-mixer",
  productionDecision: item.risk === "medium" ? "TUNE" : "KEEP_PENDING_DEVICE_REVIEW",
  humanApprovalProvided: false,
}));

const hapticEvents = u28Haptics.events.filter((event) => event.id !== "None").map((event) => ({
  ...event,
  phaseStartProductionAdapter: "U43RuntimeFeedbackBridge.Handheld.Vibrate",
  registryAdapter: "U28MobileHapticPlaceholderAdapter",
  physicalDeviceObserved: false,
  humanApprovalProvided: false,
}));

const audioFiles = walk(join(unity, "Assets/_Project/Audio")).filter((path) => /\.(wav|mp3|ogg|aif|aiff)$/i.test(path));
const bgmFiles = audioFiles.filter((path) => /bgm|music|ambient|loop/i.test(path));

write("preflight-audit.json", {
  schemaVersion: 1,
  phase: "U49",
  sourceHead,
  measuredAtUtc: "2026-07-21T05:18:39Z",
  worktreeCleanAtPhaseStart: true,
  u48RuntimeVisualReady: u48.runtimeVisualReady === true,
  u48ProductionAssetCount: u48.runtimeApprovedAssetCount,
  u48ProductionReferenceCount: u48Production.assets?.length ?? u48.runtimeApprovedAssetCount,
  u48PreviewDependencyCount: 0,
  u39FinalCandidateSeCount: audioEvents.length,
  actualAudioMixerAssetExists: false,
  mobileHapticAdapterIsPlaceholder: true,
  physicalDeviceEvidenceExists: false,
  phaseStartRuntimeAudioSourceCount: 1,
  phaseStartRuntimeUsesGeneratedTone: true,
  phaseStartRuntimeUsesU39Clips: false,
  phaseStartAudioListenerPolicy: "one listener created by U1Stage1SceneBootstrap camera",
  phaseStartSaveSettings: ["masterVolume", "hapticEnabled", "locale"],
  blockers: [
    "actual AudioMixer asset missing",
    "U39 clips not connected to production runtime",
    "runtime uses generated tone",
    "production haptic route uses Handheld.Vibrate instead of Core Haptics adapter",
    "physical-device and human audio/haptic evidence missing",
  ],
});

write("audio-event-inventory.json", {
  schemaVersion: 1,
  sourceHead,
  source: "U39 final-candidate inventory plus code-level request-site audit",
  eventCount: audioEvents.length,
  uniqueClipCount: new Set(audioEvents.map((item) => item.clipFileName)).size,
  u28DraftProductionReferenceCount: 0,
  phaseStartU39RuntimeReferenceCount: 0,
  events: audioEvents,
});

write("haptic-event-inventory.json", {
  schemaVersion: 1,
  sourceHead,
  eventCount: hapticEvents.length,
  interface: "IU28HapticPlatformAdapter",
  editorAdapter: "U28EditorNoopHapticAdapter",
  mobilePlaceholderAdapter: "U28MobileHapticPlaceholderAdapter",
  phaseStartProductRoute: "Handheld.Vibrate direct bridge hook",
  settingsSource: "SaveService GameSettingsSave.hapticEnabled",
  events: hapticEvents,
});

write("bgm-inventory.json", {
  schemaVersion: 1,
  sourceHead,
  audioFileCount: audioFiles.length,
  bgmAssetCount: bgmFiles.length,
  bgmAssets: bgmFiles.map((path) => relative(repo, path)),
  bgmRuntimeOwnerExists: false,
  loopPointDefined: false,
  bgmPolicy: "INTENTIONALLY_DISABLED",
  bgmProductionClipCount: 0,
  bgmExpectedAudible: false,
  reason: "No production-approved BGM clip is available in U49",
  missingClipErrorAllowed: false,
  unexpectedPlaybackAllowed: false,
  phaseDecision: "INTENTIONAL_SILENCE",
  rationale: "StageSelect and Stage1 are currently supported by restrained UI, pickup, battle, climax, and result SE. No rights-cleared production BGM candidate exists; U49 will not create a low-quality substitute.",
  blocker: null,
});

function walk(root) {
  const result = [];
  for (const name of readdirSync(root)) {
    const path = join(root, name);
    if (statSync(path).isDirectory()) result.push(...walk(path)); else result.push(path);
  }
  return result;
}

function write(name, value) {
  writeFileSync(join(output, name), JSON.stringify(value, null, 2) + "\n");
}
