# Unity U43 Character Runtime Asset Repair

## 症状

実機でキャラがドットではない。

## 原因

Stage1 runtimeは `U5ProofAssetProvider` 経由で `Resources/U5Candidates/Battle/u5-yui-battle-candidate.png` を使うが、runtime上でPoint filterを強制しておらず、import設定もBilinearだった。さらにobject名がplaceholderのままで、runtime接続状態が分かりにくかった。

## 修正内容

- Player object名を `YuiRuntimeDotCharacter` に変更。
- `U5Candidates/Battle` のYui / Ombu候補spriteをruntimeでPoint filterへ設定。
- import metaの `filterMode` をPointへ変更。
- generated final画像や `docs/design-targets/generated` はruntime参照していない。

## 未確認

実機スクショは未提供。Editor evidenceは作るが、実機で「ドット風に見える」ことは再確認が必要。
