# ヨルノシルベ Runtime Font Source Coverage Result

Date: 2026-07-28
Result: **PASS FOR SOURCE TTF COVERAGE / STATIC TMP ATLAS AND DEVICE BUILD STILL PENDING**

## 対象

```txt
Checker: scripts/quality/check-design-font-source-coverage.ts
Contract: docs/design-targets/generated/design-production/font-glyph-coverage-contract.json
Source font: unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium.ttf
TMP asset: unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset
```

## 自動検査

Stage1 Qualityで次を実行した。

```txt
Workflow=Stage1 Quality
Run number=1002
Head=5e8851e72ef54263b00cb4805f9f5bacd18be822
Step=Verify runtime font source coverage
Conclusion=success
```

Checkerは次を行う。

- Unity runtime C# string literalを抽出。
- Runtime JSON string valueを抽出。
- Editor／Testsを除外。
- Zen Maru Gothic TTFのUnicode cmap format 4／12を解析。
- Runtime抽出文字とsource TTFを比較。
- Missing codepointが1件でもあればfail。
- Current TMP assetのdynamic population、empty serialized tables、source font binding、multi-atlas、clear-on-build設定がcontractと一致するか確認。

## 証明できたこと

```txt
sourceFontRuntimeStringCoverageResult=PASS
missingFromSourceFont=0
currentFontAssetPopulationMode=DYNAMIC
runtimeMutation=false
```

現在抽出できるUnity runtime文字について、source TTF側の欠字は検出されなかった。

## 証明していないこと

```txt
staticAtlasBaked=false
fontAssetAvailableCodepointsRecorded=false
atlasMemoryMeasured=false
deviceBuildVerified=false
fullProductGlyphCoverageComplete=false
```

したがって、今回のPASSだけで次へ進めない。

- Final Typography LOCK。
- `IMPLEMENTATION_READY` transition。
- RC approval。

## 次工程

Wave 1 component承認後、Unity実装開始前に次を実行する。

1. 最終runtime文字setを再抽出。
2. Controlled static TMP atlasを生成。
3. Missing=0を確認。
4. Atlas countとtexture memoryを記録。
5. Compact／Standard／Largeで表示確認。
6. Physical iPhone buildでtofu／blank／初回表示hitchを確認。
7. `font-glyph-coverage.json`をproduction evidenceとして確定。

## 判定

```txt
SourceTtfCoverage=PASS
CurrentDynamicTmpAssetFacts=VERIFIED
StaticAtlasCoverage=NOT_EXECUTED
DeviceGlyphDisplay=NOT_VERIFIED
FullProductGlyphCoverage=FALSE
```
