# ヨルノシルベ Design Reference Rights Boundary v1

Date: 2026-07-28
Status: **ACTIVE / INTERNAL REFERENCE BOUNDARY CONFIRMED**
Repository: `m-shogo/vamp-pon`

## 1. 目的

画像生成、component制作、商用利用で、権利状態不明の外部画像が混ざることを防ぐ。

## 2. Allowed reference sources

Human reviewなしでbriefへ参照pathとして列挙できるのは次だけである。

- このrepository内のユーザー制作・過去生成・runtime capture。
- U48等の承認chainに含まれるproduction/candidate asset。
- Git履歴でsource commitとhashを追跡できるasset。
- repository内license fileで利用条件を確認できるfont等。
- このChatGPT会話で、ヨルノシルベ用に新規生成し、provenance registryへ登録したoutput。

## 3. Disallowed without separate review

- 検索エンジンから取得した画像。
- SNS、Pinterest、ゲーム画面、映画、漫画、アニメの画像。
- 他社ゲームのUI、character、icon、logoをreference inputとして直接投入すること。
- licenseが分からないtexture、font、brush、icon pack。
- watermark付き素材。
- repository外の「似た画像」を出所不明のままコピーすること。

外部作品は言語化した一般的なdesign principleの研究に限定し、画像inputやasset sourceにしない。

## 4. Current internal reference set

現在のWave 1で使用可能なreferenceは、次の正本に登録されたものに限定する。

```txt
docs/design-targets/generated/design-production/reference-registry.json
docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json
```

このregistryにない画像は、使用前に追加・分類・hash記録を行う。

## 5. Generation reference packet

各生成requestは次だけを渡す。

```txt
approved Art Direction text
approved screen brief
in-repo reference paths
reference hashes
current runtime capture or missing-state evidence
forbidden motifs
technical constraints
```

権利不明の外部画像を追加しない。

## 6. Character reference

Yui、Onbu、enemy等はrepository内の承認済みmasterまたはproduction spriteを参照する。

- Character identityを別作品へ寄せない。
- Character style transferを無断で行わない。
- Whole-screen compositionでcharacterを使う場合も、体型、持ち物、silhouette、lantern位置等のcanonを守る。
- Character imageの採用状態とscreen composition approvalを分離する。

## 7. Font / third-party assets

- Zen Maru Gothicはrepo内license fileを正本とする。
- 新font、icon library、texture pack等を追加する場合、license fileを同commitに含める。
- Commercial useとapp bundlingを確認する。
- Attributionやnoticeが必要な場合、release checklistへ追加する。

## 8. Candidate provenance

生成candidateごとに、次を必須とする。

```txt
referencePaths
referenceHashes
promptSummary
outputPath
outputHash
generationAuthority
humanEdits
commercialUseReviewed
licenseOrTermsNote
sourceCommit
```

Template:

```txt
docs/design-targets/generated/design-production/asset-provenance-registry-template.json
```

## 9. Human approval levels

`DIRECTION_SELECTED`は見た目の方向を選んだだけである。

商用productionへ進むには最低限:

```txt
COMPONENT_APPROVED
COMMERCIAL_USE_REVIEWED
RUNTIME_READY
```

が必要。

## 10. Gate

```txt
internalReferenceRightsBoundaryConfirmed=true
unknownExternalReferenceAllowed=false
currentReferenceRegistryRequired=true
candidateProvenanceRequired=true
commercialUseReviewRequired=true
```

## 11. 現在判定

```txt
InternalReferenceRightsBoundary=CONFIRMED
CurrentReferenceSet=IN_REPOSITORY_ONLY
UnknownReferenceRights=0_FOR_PLANNED_WAVE1
GeneratedCandidates=0
NextAction=DOCUMENT_CONTRADICTION_SCAN
```
