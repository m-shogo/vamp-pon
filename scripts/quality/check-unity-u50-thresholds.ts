import { readFileSync } from 'node:fs';

const path = 'docs/design-targets/generated/unity-u50/thresholds.json';
const source = readFileSync(path, 'utf8');
const keys = [...source.matchAll(/^\s*"([^"]+)"\s*:/gm)].map((match) => match[1]);
const duplicates = [...new Set(keys.filter((key, index) => keys.indexOf(key) !== index))];
if (duplicates.length > 0) throw new Error(`U50 threshold check failed: duplicate key(s): ${duplicates.join(', ')}`);

const thresholds = JSON.parse(source) as Record<string, unknown>;
const requiredKeys = [
  'schemaVersion',
  'phase',
  'status',
  'u50ThresholdsDefined',
  'calibrationRequired',
  'targetDeviceModelOrClass',
  'minimumSustainedRunMinutes',
  'warmUpExclusionSeconds',
  'p95FrameTimeMilliseconds',
  'p99FrameTimeMilliseconds',
  'framesOver33_33MillisecondsAllowedRatio',
  'maximumAllowedLongFrameMilliseconds',
  'retryLoopCount',
  'memoryGrowthAfterRetryLoopsMiB',
  'normalBattleGcAllocationBytesPerFrame',
  'gcCollectionCountMaximum',
  'gcCollectionDurationMaximumMilliseconds',
  'touchResponseMeasurementMethod',
  'touchResponseP95Milliseconds',
  'touchLossCountMaximum',
  'ghostInputCountMaximum',
  'stuckInputCountMaximum',
  'thermalHoldCondition',
  'backgroundForegroundRepetitionCount',
  'mobileMetricsReady',
  'reason',
] as const;
const unknown = Object.keys(thresholds).filter((key) => !requiredKeys.includes(key as (typeof requiredKeys)[number]));
const missing = requiredKeys.filter((key) => !(key in thresholds));
if (unknown.length > 0 || missing.length > 0) {
  throw new Error(`U50 threshold check failed: unknown=[${unknown.join(', ')}] missing=[${missing.join(', ')}]`);
}

if (thresholds.u50ThresholdsDefined === false) {
  if (thresholds.status !== 'BLOCKED_THRESHOLD_CALIBRATION' || thresholds.calibrationRequired !== true) {
    throw new Error('U50 threshold check failed: unresolved thresholds must remain calibration-blocked');
  }
  for (const key of requiredKeys.slice(5, 24)) {
    if (thresholds[key] !== null) throw new Error(`U50 threshold check failed: unresolved ${key} must be null`);
  }
  if (thresholds.mobileMetricsReady !== false) {
    throw new Error('U50 threshold check failed: unresolved thresholds require mobileMetricsReady=false');
  }
} else {
  throw new Error('U50 threshold check failed: threshold promotion requires a future calibrated schema/checker update');
}

console.log('U50 threshold check passed: thresholds are explicitly unresolved, calibration is required, mobileMetricsReady=false.');
