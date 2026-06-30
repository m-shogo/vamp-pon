# Unity U5.2 Term / Visual Lock Cleanup Review 2026-06-30

## Scope

U5.2は新規画像生成なし。Unity実装拡張なし。U6へ進む前に、Unity-facing docsの正式タイトル、正式表記、美術方向ロックの整合性だけを固めた。

対象commit:

- `eedeaec4ae6628cd9137a645b76220b4e16fa214` - `Unity美術方向の固定ルールを追加`
- `7a4a6e57ac7dc412bb68f7932d9b08d7d4a49aee` - `Unity素材承認に美術方向ロックを追加`

## Fixed Terms

修正した旧表記:

- `Vamp Ponの美術方向` -> `ヨルノシルベの美術方向`
- `Vamp Ponの見た目の核` -> `ヨルノシルベの見た目の核`
- `Vamp PonのVisual Core` -> `ヨルノシルベのVisual Core`
- `Vamp Ponらしいか` -> `ヨルノシルベらしいか`
- `黒曜化` -> `黒耀化`

Unity-facing docs / asset approval docs / visual direction docsでは、`Vamp Pon` を作品名として使わない。旧名を説明する必要がある場合のみ、以下の明示的なコードネーム文脈に限定する。

```txt
Code names only: Vamp Pon / vanp pon / ヴァンサバ改
```

## Visual Lock Integrity

`docs/unity-visual-art-direction-lock-2026-06-30.md` で維持した内容:

- Visual Core
- 紙UI / 黒インク / ランタン光
- 色数を増やしすぎないルール
- 生成画像をそのまま混ぜないルール
- Web/prototype素材をproduction approved扱いしないルール
- 2D / 2.5D方向
- UI Prefab方針
- Motion / Feel方針
- `黒耀化` 表記

## Added Checker

追加:

```txt
scripts/quality/check-unity-term-lock.ts
```

package script:

```sh
pnpm unity:term-lock:check
```

checker対象:

- `docs/unity-visual-art-direction-lock-2026-06-30.md`
- `docs/unity-asset-intake-gate-2026-06-30.md`
- `docs/unity-sprite-import-policy-2026-06-30.md`
- `docs/unity-u5-1-quality-gate-review-2026-06-30.md`
- `docs/unity-u6-*.md` が存在する場合は自動対象

最低限failする表現:

- `黒曜化`
- `Vamp Ponの`
- `Vamp Ponらしい`
- `Vamp Ponを`
- `Vamp Ponは`
- `Vamp Pon visual`
- `Vamp Pon Visual`

## Check Results

```txt
pnpm unity:term-lock:check
unity term lock check passed: checked 4 file(s)
```

```txt
pnpm unity:asset-intake:check
unity asset intake check passed: manifestItems=8, runtimeIncluded=8, productionApproved=0
```

```txt
pnpm unity:meta:check
unity meta guid check passed: 127 meta guid(s), 127 unique guid(s)
```

```txt
git diff --check
PASS: no whitespace errors
```

```txt
pnpm design:review:verify
design review verification passed: checked 7 design review docs
```

## Remaining Concerns

- checkerはUnity-facing docs向けの軽いterm lockであり、全repo内の歴史的コードネーム使用までは禁止しない。
- 美術方向そのものの良し悪しは自動判定できないため、U6以降も人間の目視レビューが必要。
- `Vamp Pon` はリポジトリ名や履歴上のコードネームとして残るが、作品名としては使わない。

## U6 Decision

U6へ進んでよい。

ただし、U6の新規docでは正式タイトル `ヨルノシルベ` と `黒耀化` を使い、asset approvalでは `productionStatus` と visual art direction lockを必ず確認する。
