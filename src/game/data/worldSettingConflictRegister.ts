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
  { id: 'CF-001', label: 'Current21 era mismatch', status: 'GUARDED', guard: 'Reality era and Night co-presence remain separate facts.', humanDecisionRequired: false },
  { id: 'CF-002', label: 'Final identity of Night', status: 'OPEN_HUMAN', guard: 'Unknown Mechanism remains isolated from lived-world sources.', humanDecisionRequired: true },
  { id: 'CF-003', label: 'Game Over versus death', status: 'GUARDED', guard: 'Game Over is not Reality death and Retry is not resurrection.', humanDecisionRequired: false },
  { id: 'CF-004', label: 'Whether dead people can appear in Night', status: 'OPEN_HUMAN', guard: 'Family and incident sources may not decide this metaphysical rule.', humanDecisionRequired: true },
  { id: 'CF-005', label: 'Yatsukage versus Sakumei identity', status: 'GUARDED', guard: 'Yatsukage is an early observer label; Sakumei is a revealed pact candidate.', humanDecisionRequired: false },
  { id: 'CF-006', label: 'Shadow5 versus Sakumei faction identity', status: 'GUARDED', guard: 'Shadow5 remains ideological Current rivals; Sakumei remains a separate enemy pact candidate.', humanDecisionRequired: false },
  { id: 'CF-007', label: 'Sakumei founder or absolute leader', status: 'OPEN_HUMAN', guard: 'Pair Mission Rule keeps the pact operational without a locked absolute leader.', humanDecisionRequired: true },
  { id: 'CF-008', label: 'Stage20 geography', status: 'GUARDED', guard: 'Gameplay order does not imply Reality adjacency; Night Atlas remains separate.', humanDecisionRequired: false },
  { id: 'CF-009', label: 'Historical incidents over-connecting the cast', status: 'GUARDED', guard: 'Direct witness counts stay sparse and family casualties remain unfrozen.', humanDecisionRequired: false },
  { id: 'CF-010', label: 'Gameplay economy versus Reality economy', status: 'GUARDED', guard: 'Run/meta resources do not become Reality money.', humanDecisionRequired: false },
  { id: 'CF-011', label: 'Belief versus metaphysical truth', status: 'GUARDED', guard: 'Religion, rumor and custom are in-world beliefs, not proof of Star Beast or Night cosmology.', humanDecisionRequired: false },
  { id: 'CF-012', label: 'Major Current family facts', status: 'OPEN_HUMAN', guard: 'Household texture may deepen while parents, spouses, children and major family deaths remain open.', humanDecisionRequired: true },
  { id: 'CF-013', label: 'Exact height age and era', status: 'OPEN_HUMAN', guard: 'Relative production bands may be used; exact values are not Canon before human review.', humanDecisionRequired: true },
  { id: 'CF-014', label: 'Black Youka versus illness or possession', status: 'GUARDED', guard: 'Black Youka remains an overextension of the person’s own strength, wish or protection style.', humanDecisionRequired: false },
  { id: 'CF-015', label: 'Named Object lineage', status: 'CANDIDATE_DEPENDENT', guard: 'Similarity does not imply sameObject; stable IDs and evidence control lineage.', humanDecisionRequired: false },
  { id: 'CF-016', label: 'Future15 promotion', status: 'GUARDED', guard: 'World-building usage does not promote Future15 into Current21.', humanDecisionRequired: false },
  { id: 'CF-017', label: 'Visual candidate versus Character Canon', status: 'GUARDED', guard: 'Generated-image accidents may not flow upstream into Character identity.', humanDecisionRequired: false },
  { id: 'CF-018', label: 'P2 expression versus runtime implementation', status: 'GUARDED', guard: 'World-setting and production-expression sources never auto-promote runtime readiness.', humanDecisionRequired: false },
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
