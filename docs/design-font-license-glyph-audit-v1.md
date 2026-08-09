# ヨルノシルベ Font License / Glyph Coverage Audit v1

Date: 2026-07-28
Status: **LICENSE PASS / RUNTIME COVERAGE NOT YET PROVEN / DETERMINISTIC PREBUILD STRATEGY REQUIRED**
Repository: `m-shogo/vamp-pon`

## 1. 対象

```txt
Font: Zen Maru Gothic Medium
TTF: unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium.ttf
TMP: unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset
Baker: unity/VampPonUnity/Assets/_Project/Scripts/Editor/ZenMaruGothicSDFBaker.cs
License: unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/LICENSE.txt
```

## 2. License result

Repository内license記録:

```txt
Designer=Yoshimichi Ohira
Source=Google Fonts
License=SIL Open Font License 1.1
Commercial use=Yes
App bundling=Yes
```

判定:

```txt
fontLicensePresent=true
commercialUseAllowed=true
appBundlingAllowed=true
licenseStatus=PASS
```

Release時にはlicense noticeをthird-party noticesへ含める。

## 3. Historical U9.2 result

U9.2時点のproof set:

```txt
Atlas=1024x1024
SamplingPointSize=48
Padding=5
Proof character count=210
Missing glyphs in proof set=0
```

`ZenMaruGothicSDFBaker.cs`は、当時の画面文言候補・ASCII・一部日本語を`ProofCharacters`へ列挙し、`TryAddCharacters`した。

この結果は当時のproof setに対してのみ有効であり、現在の全product文言を保証しない。

## 4. Current TMP asset実体

現在の`ZenMaruGothic-Medium SDF.asset`は次の状態である。

```txt
m_AtlasPopulationMode=1
m_SourceFontFile=ZenMaruGothic-Medium.ttf
m_GlyphTable=[]
m_CharacterTable=[]
m_IsMultiAtlasTexturesEnabled=1
m_ClearDynamicDataOnBuild=1
Atlas=1024x1024
Padding=5
```

重要な意味:

- 現在assetはdynamic population前提である。
- Serialized character tableからavailable codepointsを証明できない。
- U9.2の210文字実績と、現在assetに静的保存されたglyph setは同一ではない。
- Source TTFが参照されていても、iOS buildで全必要文字が正常に追加・保持・表示されることは別途実証が必要。
- Multi-atlasが有効なため、全product文字を無制限にdynamic追加するとmemory／atlas増加リスクがある。

したがって、次の推論を禁止する。

```txt
U9.2 missing=0
→ current serialized font has 210 glyphs
→ whole product glyph coverage complete
```

## 5. 現在のrisk

追加・変更された可能性がある領域:

- U47/U48 production item names and descriptions
- Result／Collection text
- U49 audio/haptic labels
- Stage2以降の固有名詞
- accessibility labels
- error／fallback messages
- punctuation and symbols
- future localization

Runtime risk:

- Tofu／blank text。
- Build後だけ欠ける文字。
- Dynamic atlasの予期しない追加。
- Multi-atlasによるmemory増加。
- 初表示時のglyph追加cost。
- Source font stripping／参照不整合。
- Candidate画面では見えず、Rare／error／Collection detailで初めて発生する欠字。

## 6. Production strategy

### Default: controlled static product set【推奨】

Typography LOCK前に、現在productで表示する全文字を抽出し、controlled static atlasを生成する。

```txt
1. Runtime表示文字をsource／data／accessibility labelから抽出
2. Unicode codepoint setを生成
3. Source TTFのcmap supportを確認
4. Static TMP atlasへ全required codepointを追加
5. missing=0を確認
6. Atlas枚数／memoryを記録
7. 13画面＋fallback routeでcapture確認
```

利点:

- iOS buildで決定的。
- 初表示時のdynamic追加を避けられる。
- Missing glyphをbuild前にfail-closedできる。
- Memory予算を事前計測できる。

### Conditional fallback: controlled dynamic

Static atlasへ収まらない、または将来文言をruntime追加する必要がある場合のみ採用する。

必須条件:

```txt
sourceFontIncludedInBuild=true
dynamicAdditionDeviceVerified=true
multiAtlasMemoryMeasured=true
firstUseHitchMeasured=true
fallbackFontPolicyDefined=true
```

無計画なdynamic運用をproduction defaultにしない。

## 7. Required coverage process

実装開始前、遅くとも`WAVE1_COMPONENTS_APPROVED → IMPLEMENTATION_READY` transition前に実行する。

```txt
1. Runtime表示対象の日本語・英数字・記号を抽出
2. コメント、Editor log、documentation文字列を除外
3. JSON data、C# runtime string、accessibility labelsを含める
4. 重複を除いてUnicode setを生成
5. Source TTF cmapと比較
6. Static TMP assetまたは承認済みdynamic strategyと比較
7. missing glyph listをmachine-readable出力
8. missing=0を確認
9. Atlas count／estimated memoryを記録
10. 主要13画面とerror／fallback routeでtofu／blankがないことを確認
```

Machine-readable output:

```txt
docs/design-targets/generated/design-production/font-glyph-coverage.json
```

必須field:

```txt
schemaVersion
sourceCommit
strategy
fontSourcePath
fontAssetPath
licensePath
scannedSourcePaths
excludedSourcePatterns
requiredCodepoints
requiredCharacters
sourceFontSupportedCodepoints
fontAssetAvailableCodepoints
missingFromSourceFont
missingFromFontAsset
atlasCount
atlasDimensions
estimatedTextureMemoryBytes
deviceBuildVerified
captureRoutes
result
```

## 8. Source extraction boundary

含める:

- Unity runtime C# string literals。
- Runtime data JSON／ScriptableObject由来の表示文字。
- Button、title、description、error、fallback文言。
- VoiceOver labels。
- Item／weapon／passive／rare／stage／character／enemy names。
- 数字・percent・記号・括弧・長音。

除外する:

- `Editor`専用log。
- Tests／checkerの説明文。
- Documentation。
- Comments。
- File paths／GUID／hash。
- Runtimeへ表示されないdebug strings。

抽出漏れを防ぐため、除外はallowlist方式で記録する。

## 9. Font composition policy

- Zen Maru Gothic MediumをBody／Button／Card baselineとして維持。
- Display／Screen Titleの別font追加は、視覚比較とlicense確認後。
- 数字用補助font追加も同様。
- 新fontにはlicense file、commercial use、app bundling、attribution、glyph coverageを要求する。
- Font fileを共有成果物として外部提供しない。
- Baked text imageをmissing glyph回避策にしない。

## 10. Typography QA

対象viewport:

```txt
360x800
375x812
390x844
393x852
412x915
430x932
```

対象role:

- Body
- Button
- Card Title
- Screen Title
- Numeric Emphasis
- Lore
- Error／Fallback
- Accessibility label

確認:

- Japanese punctuation。
- 長音、括弧、記号。
- Dynamic number、level、percent。
- Truncation／line wrapping。
- Safe area。
- Compact density。
- Tofu／blank／fallback font混入。

## 11. Gate

現在:

```txt
fontLicenseAuditComplete=true
fontCommercialUsePass=true
fontAppBundlingPass=true
currentFontAssetPopulationMode=DYNAMIC
serializedCharacterTableEmpty=true
fullProductGlyphCoverageComplete=false
fontLicenseAndGlyphAuditComplete=false
```

`fullProductGlyphCoverageComplete=true`かつmissing=0かつdeviceBuildVerified=trueになるまで、次を禁止する。

- Final Typography LOCK。
- `IMPLEMENTATION_READY`へのtransition。
- RC approval。

## 12. 現在判定

```txt
License=PASS
HistoricalProofGlyphSet=PASS_FOR_U9_2_ONLY
CurrentSerializedGlyphCoverage=NOT_PROVEN
SourceFontBound=true
ProductionStrategy=CONTROLLED_STATIC_PRODUCT_SET_RECOMMENDED
WholeProductGlyphCoverage=NOT_YET_EXECUTED
FontBaselineMayBeUsedForDesignReferences=true
UnityThemeTypographyMutation=false
NextAction=IMPLEMENT_NON_RUNTIME_GLYPH_EXTRACTION_AND_RUN_BEFORE_IMPLEMENTATION_READY
```
