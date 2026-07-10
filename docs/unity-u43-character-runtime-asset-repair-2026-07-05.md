# Unity U43 Character Runtime Asset Repair

> Correction 2026-07-10: この文書の修正はPoint Filterとruntime参照の可視化までであり、ドットキャラクター完成・sprite sheet化・animation完成を意味しない。Point Filterだけではドット絵完成を意味しない。現在の正式判定は `docs/unity-runtime-visual-readiness-gate-v1.md` と `docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json` を優先する。

## 症状

実機でキャラがドットではない。

## 原因

Stage1 runtimeは `U5ProofAssetProvider` 経由で `Resources/U5Candidates/Battle/u5-yui-battle-candidate.png` を使うが、runtime上でPoint filterを強制しておらず、import設定もBilinearだった。さらにobject名がplaceholderのままで、runtime接続状態が分かりにくかった。

## 修正内容

- Player object名を `YuiRuntimeDotCharacter` に変更。
- `U5Candidates/Battle` のYui / Ombu候補spriteをruntimeでPoint filterへ設定。
- import metaの `filterMode` をPointへ変更。
- generated final画像や `docs/design-targets/generated` はruntime参照していない。

## この修正で完了していないこと

- production asset providerへの切替
- Sprite Mode Multiple
- sprite sheet slice
- idle / walk / hurt / attack animation
- 左右反転のvisual確認
- Golden Identity Reference
- Generation Lineage
- final/runtime承認
- gameplay-sizeでのドット粒・輪郭確認

## 未確認

実機スクショは未提供。Editor evidenceは作るが、実機で「ドット風に見える」ことは再確認が必要。

現在の分類は `proof-static-single-sprite` であり、以下はfalseを維持する。

```txt
characterDotRuntimeReady=false
characterAnimationReady=false
enemyDotRuntimeReady=false
enemyAnimationReady=false
productionCharacterAssetReady=false
productionEnemyAssetReady=false
runtimeVisualReady=false
```
