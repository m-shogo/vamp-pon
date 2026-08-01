# Seasonal Loading Key Art 2026-08-01

ヨルノシルベの春・夏・秋・冬Loading Key Art候補。

2026-08-01の明示的人間判断により、`LOADING_KEY_ART`の採用方向として選定された。TOPのprimary backgroundにはしない。原本は構図参照とlayer分解のsourceであり、現時点ではcandidate / runtime未接続である。

```txt
humanSelectedForDirection=true
approvedAsFinal=false
runtimeApproved=false
runtimeConnected=false
```

## Files

- `spring-loading-key-art.png`
- `summer-loading-key-art.png`
- `autumn-loading-key-art.png`
- `winter-loading-key-art.png`
- `manifest.json`
- `motion-layer-breakdown.json`
- `reconstruction-brief.txt`

Direction、motion、safe zone、performance budgetは次を参照する。

```txt
docs/seasonal-loading-key-art-motion-plan-2026-08-01.md
```

検査:

```sh
node --experimental-strip-types scripts/quality/check-seasonal-loading-key-art.ts
```

