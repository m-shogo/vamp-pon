# StageSelect UI Prefab Candidates

U13時点ではformal prefab candidateです。

- 正式StageSelect Scene接続前
- productionApproved=0
- 使用素材はU5 / U8 / U8.1 / U10 candidate
- Addressables未使用
- Stage解放 / difficulty本番計算 / Battle本番遷移は未接続
- node上の小さい状態labelは使わず、active / lockedはsprite差分・明度・芯で読む
- Route Aを通常表示方針とし、Route B glowは将来Animation候補
- U14 Scene Flow proofで使う場合もproof-onlyであり、production approved扱いしない
