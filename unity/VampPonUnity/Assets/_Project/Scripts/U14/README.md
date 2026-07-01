# U14 Proof Flow Boundary

U14 is a proof-only scene flow layer. These scripts are not production scene transition, save, reward, unlock, difficulty, or Battle result systems.

- `U14ProofSceneRouter` only routes U14 proof scenes and is not a production scene transition service.
- `BattleResultSummaryProof` is fixed proof data and is not a production Battle result.
- `U14FlowState` is temporary in-memory proof state and is not saved state.
- U14 may call U15 contract mappers for contract proof logs, but it must not connect to production data sources.
