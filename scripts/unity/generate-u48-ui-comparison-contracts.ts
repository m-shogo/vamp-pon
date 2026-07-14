import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const output = resolve(root, 'docs/design-targets/generated/unity-u48/approval-pack/ui-comparison-contracts.json');

const components: Record<string, Array<[string, string[]]>> = {
  hud: [
    ['hud-top-status-frame', ['default']],
    ['hud-hp-frame', ['default', 'low-hp']],
    ['hud-timer-frame', ['default']],
    ['hud-inventory-weapon-slot', ['default', 'occupied', 'selected', 'disabled']],
    ['hud-inventory-passive-slot', ['default', 'occupied', 'selected', 'disabled']],
    ['hud-inventory-rare-slot', ['default', 'occupied', 'selected', 'disabled']],
    ['hud-kokuyou-gauge-frame', ['charging', 'ready', 'active', 'recovery']],
  ],
  levelup: [
    ['levelup-card-background', ['default', 'selected', 'disabled']],
    ['levelup-icon-frame', ['default', 'selected', 'disabled']],
    ['levelup-title-area', ['default', 'selected', 'disabled']],
    ['levelup-description-area', ['default', 'selected', 'disabled']],
    ['levelup-selection-feedback', ['default', 'selected', 'disabled']],
    ['levelup-decline-button', ['default', 'pressed', 'disabled']],
  ],
  replacement: [
    ['replacement-modal-background', ['default']],
    ['replacement-incoming-candidate-panel', ['default', 'selected', 'disabled']],
    ['replacement-owned-slot-row', ['default', 'selected', 'disabled']],
    ['replacement-selected-slot-state', ['default', 'selected', 'disabled']],
    ['replacement-confirm-button', ['default', 'pressed', 'disabled']],
    ['replacement-decline-cancel-button', ['default', 'pressed', 'disabled']],
  ],
  result: [
    ['result-main-panel', ['clear', 'failed']],
    ['result-summary-header', ['clear', 'failed']],
    ['result-inventory-row', ['default', 'empty']],
    ['result-evolution-awakening-row', ['default', 'empty']],
    ['result-retry-button', ['default', 'pressed', 'disabled']],
    ['result-return-button', ['default', 'pressed', 'disabled']],
  ],
  stageSelect: [
    ['stage-select-stage-card', ['locked', 'unlocked', 'completed', 'selected']],
    ['stage-select-locked-unlocked-state', ['locked', 'unlocked']],
    ['stage-select-primary-button', ['default', 'pressed', 'disabled']],
    ['stage-select-title-frame', ['default', 'selected']],
    ['stage-select-difficulty-metadata-row', ['default', 'disabled']],
  ],
};

const comparisonGroups = Object.entries(components).flatMap(([owner, entries]) => entries.map(([assetGroup, states]) => ({
  assetGroup,
  owner,
  historyStatus: 'active-comparison-unit',
  comparisonContract: {
    samePurpose: true,
    sameLogicalSize: true,
    sameTextSafeArea: true,
    sameRuntimePosition: true,
    sameRequiredStates: states,
  },
  candidateStatus: 'generation-required',
  approvalReviewReady: false,
})));

const value = {
  schemaVersion: 1,
  sourceHead: '05d20c04007bf7e980c62f98730e7c004b727e51',
  status: 'IN_PROGRESS_BLOCKED',
  deprecatedGroups: [
    { assetGroup: 'ui-hud-inventory-frame', historyStatus: 'split-required', splitInto: comparisonGroups.filter(value => value.owner === 'hud').map(value => value.assetGroup) },
    { assetGroup: 'ui-levelup-card', historyStatus: 'split-required', splitInto: comparisonGroups.filter(value => value.owner === 'levelup').map(value => value.assetGroup) },
    { assetGroup: 'ui-replacement-modal', historyStatus: 'split-required', splitInto: comparisonGroups.filter(value => value.owner === 'replacement').map(value => value.assetGroup) },
    { assetGroup: 'ui-result-kit', historyStatus: 'split-required', splitInto: comparisonGroups.filter(value => value.owner === 'result').map(value => value.assetGroup) },
    { assetGroup: 'ui-stage-select-kit', historyStatus: 'split-required', splitInto: comparisonGroups.filter(value => value.owner === 'stageSelect').map(value => value.assetGroup) },
  ],
  comparisonGroups,
  activeComparisonGroupCount: comparisonGroups.length,
  approvedAsFinal: false,
  runtimeApproved: false,
  humanReviewStatus: 'pending',
};

mkdirSync(resolve(output, '..'), { recursive: true });
writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`);
console.log(`U48 UI comparison contracts written: ${comparisonGroups.length} active units, 5 split-required history groups.`);
