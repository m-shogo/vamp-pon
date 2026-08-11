export type WorldSettingConflictStatus =
  | 'GUARDED'
  | 'OPEN_HUMAN'
  | 'CANDIDATE_DEPENDENT'
  | 'UNRESOLVED_BLOCKER';

export type WorldSettingConflictEntry = {
  id: string;
  label: string;
  status: WorldSettingConflictStatus;
  guard: string;
  humanDecisionRequired: boolean;
};

export const worldSettingConflictEntries: readonly WorldSettingConflictEntry[] = [
  { id: 'CF-001', label: 'Current21 era mismatch / Core5 distinct-era invariant', status: 'GUARDED', guard: 'Reality era and Dream co-presence remain separate facts; Core5 are 5/5 distinct Reality eras while exact person-to-era mapping stays open; Dream time tags remain weak.', humanDecisionRequired: false },
  { id: 'CF-002', label: 'Dream world versus final mechanism', status: 'OPEN_HUMAN', guard: 'Yoru-no-Shirube being a dream world is DECIDED; only its origin, sharing mechanism and final metaphysics remain open.', humanDecisionRequired: true },
  { id: 'CF-003', label: 'Game Over versus death', status: 'GUARDED', guard: 'Game Over is not Reality death and Retry is not resurrection; waking replaces dawn-return logic.', humanDecisionRequired: false },
  { id: 'CF-004', label: 'Whether dead people can appear in the Dream Layer', status: 'OPEN_HUMAN', guard: 'Historical and family sources may not decide whether a dead person appears as self, past-self or record resonance.', humanDecisionRequired: true },
  { id: 'CF-005', label: 'Yatsukage / Sakumei / Sakuyaza identity migration', status: 'GUARDED', guard: 'Yatsukage remains an early observer label, Sakumei is superseded candidate material, and Sakuyaza is the Current formal name.', humanDecisionRequired: false },
  { id: 'CF-006', label: 'Shadow5 versus Sakuyaza faction identity', status: 'GUARDED', guard: 'Shadow5 remains Current ideological rivals and is not auto-merged into Sakuyaza.', humanDecisionRequired: false },
  { id: 'CF-007', label: 'Sakuyaza founder or absolute leader', status: 'OPEN_HUMAN', guard: 'No absolute founder or leader is required by the Current name; legacy pair-operation assets may remain without locking command hierarchy.', humanDecisionRequired: true },
  { id: 'CF-008', label: 'Stage20 geography', status: 'GUARDED', guard: 'Gameplay order does not imply Reality adjacency; Dream geography may fold places from different eras.', humanDecisionRequired: false },
  { id: 'CF-009', label: 'Historical incidents over-connecting the cast', status: 'GUARDED', guard: 'Do not force all characters into one incident, one tragedy or one hidden cause.', humanDecisionRequired: false },
  { id: 'CF-010', label: 'Gameplay economy versus Reality economy', status: 'GUARDED', guard: 'Run/meta resources do not become Reality money; Dream basic living needs do not require a normal currency economy.', humanDecisionRequired: false },
  { id: 'CF-011', label: 'Belief versus metaphysical truth', status: 'GUARDED', guard: 'Religion, rumor, constellation stories and customs are in-world beliefs, not proof of Star Beast or Dream cosmology.', humanDecisionRequired: false },
  { id: 'CF-012', label: 'Major Current family facts', status: 'OPEN_HUMAN', guard: 'Household texture may deepen while parents, spouses, children and major family deaths remain open.', humanDecisionRequired: true },
  { id: 'CF-013', label: 'Exact height age and era', status: 'OPEN_HUMAN', guard: 'Relative production bands may be used; exact values are not Canon before human review.', humanDecisionRequired: true },
  { id: 'CF-014', label: 'Black Youka versus illness or possession', status: 'GUARDED', guard: 'Black Youka remains an overextension of the person’s own strength, wish or protection style.', humanDecisionRequired: false },
  { id: 'CF-015', label: 'Named Object lineage', status: 'CANDIDATE_DEPENDENT', guard: 'Similarity does not imply sameObject; stable IDs and evidence control lineage.', humanDecisionRequired: false },
  { id: 'CF-016', label: 'Future15 promotion', status: 'GUARDED', guard: 'World-building usage does not promote Future15 into Current21.', humanDecisionRequired: false },
  { id: 'CF-017', label: 'Visual candidate versus Character Canon', status: 'GUARDED', guard: 'Generated-image accidents may not flow upstream into Character identity.', humanDecisionRequired: false },
  { id: 'CF-018', label: 'P2 expression versus runtime implementation', status: 'GUARDED', guard: 'World-setting and production-expression sources never auto-promote runtime readiness.', humanDecisionRequired: false },
  { id: 'CF-019', label: 'Dream provisioning versus direct spawn / wish-solves-plot', status: 'GUARDED', guard: 'Food, drink and basic goods are discovered through pantry/refrigerator/cupboard/kitchen-like storage as if already present; direct hand/open-air food spawn is superseded, and minds, consent, memory truth, unique evidence, Black Youka and Reality incidents cannot be provisioned.', humanDecisionRequired: false },
  { id: 'CF-020', label: 'Same stars versus era-dependent constellations', status: 'GUARDED', guard: 'Stars may be shared while constellation links, names, stories and existence vary by era; final cause remains Mystery.', humanDecisionRequired: false },
  { id: 'CF-021', label: 'Gunjo Zankyoro-ku versus fixed era boss slot', status: 'GUARDED', guard: '群青残響録 is a retrospective label for incident-central person or people; it is not one-boss-per-era, fixed-count, mandatory combat-boss or fixed villain organization.', humanDecisionRequired: false },
  { id: 'CF-022', label: 'Sakuyaza versus Gunjo Zankyoro-ku hierarchy', status: 'GUARDED', guard: 'Neither side is automatically the other’s boss, subordinate, creator or parent faction; relations may vary by era.', humanDecisionRequired: false },
  { id: 'CF-023', label: 'Reality animals versus Star Beasts', status: 'GUARDED', guard: 'Dogs and cats from Reality are a separate category from Star Beasts and are not omniscient metaphysical proof devices.', humanDecisionRequired: false },
  { id: 'CF-024', label: 'Android growth versus becoming human', status: 'GUARDED', guard: 'Android growth is not conversion into humanity; individuality, friendship and divergent experience remain valid while staying Android.', humanDecisionRequired: false },
] as const;

const count = (status: WorldSettingConflictStatus) =>
  worldSettingConflictEntries.filter((entry) => entry.status === status).length;

export const worldSettingConflictSummary = {
  total: worldSettingConflictEntries.length,
  guarded: count('GUARDED'),
  openHuman: count('OPEN_HUMAN'),
  candidateDependent: count('CANDIDATE_DEPENDENT'),
  unresolvedBlocker: count('UNRESOLVED_BLOCKER'),
} as const;
