# ヨルノシルベ Font License / Glyph Coverage Audit v1

Date: 2026-07-28
Status: **LICENSE PASS / GLYPH COVERAGE VERIFICATION REQUIRED**
Repository: `m-shogo/vamp-pon`

## 1. 対象

```txt
Font: Zen Maru Gothic Medium
TTF: unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium.ttf
TMP: unity/VampPonUnity/Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset
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

Release時にはlicense noticeを配布物またはthird-party noticesへ含める方針を明示する。

## 3. Current TMP asset

既存U9.2 evidence:

```txt
Atlas=1024x1024
SamplingPointSize=48
Padding=5
Glyph count at U9.2=210
Missing glyphs in the U9.2 proof set=0
```

現在の`U4FontSetup.cs`も、基本かな・ASCII・当時の画面文言候補を明示的な文字列として追加する方式である。

## 4. Risk

U9.2 proofでmissing glyph 0でも、現在の全ゲーム文言を保証しない。

追加された可能性がある領域:

- U47/U48 production item names and descriptions
- Result / Collection text
- U49 audio/haptic labels
- Stage2以降の固有名詞
- accessibility labels
- error/fallback messages
- punctuation and symbols
- future localization

したがって、`proof set missing glyph=0`を`whole product glyph coverage=true`として扱わない。

## 5. Required coverage process

実装開始前に次を行う。

```txt
1. Runtime表示対象の日本語・英数字・記号をsourceから抽出
2. 重複を除いてunicode setを生成
3. TMP font assetのcharacter tableと比較
4. missing glyph listをmachine-readable出力
5. missing=0を確認
6. 主要13画面captureでtofu/blankがないことを確認
```

Machine-readable output予約:

```txt
docs/design-targets/generated/design-production/font-glyph-coverage.json
```

必須field:

```txt
sourceCommit
fontAssetPath
licensePath
scannedSourcePaths
requiredCodepoints
availableCodepoints
missingCodepoints
missingCharacters
result
```

## 6. Font composition policy

- Zen Maru Gothic MediumをBody/Button/Card baselineとして維持。
- Display/Screen Titleの別font追加は、視覚比較とlicense確認後。
- 数字用補助font追加も同様。
- 新fontを追加する場合、license file、commercial use、app bundling、attributionを同じauditへ追加する。
- Font fileを共有成果物として外部提供しない。

## 7. Typography QA

- 390x844、360x800、430x932。
- Body、Button、Card Title、Numeric Emphasis、Lore。
- Japanese punctuation、長音、括弧、記号。
- Dynamic number、level表記、percent。
- Error/fallback text。
- Reduced motionとfontは独立だが、motionなし状態でもlayoutを確認。

## 8. Gate

```txt
fontLicenseAuditComplete=true
fontCommercialUsePass=true
fontAppBundlingPass=true
fullProductGlyphCoverageComplete=false
fontLicenseAndGlyphAuditComplete=false
```

`fullProductGlyphCoverageComplete=true`かつmissing=0になるまで、最終Typography LOCKとRC approvalへ進めない。

## 9. 現在判定

```txt
License=PASS
CurrentProofGlyphSet=PASS
WholeProductGlyphCoverage=NOT_YET_PROVEN
FontBaselineMayBeUsedForDesignReferences=true
UnityThemeTypographyMutation=false
NextAction=ADD_GLYPH_COVERAGE_CHECK_BEFORE_IMPLEMENTATION
```
