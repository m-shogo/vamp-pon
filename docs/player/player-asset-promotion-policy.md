# Player Asset Promotion Policy

player sprite（ユイ）を **production へ昇格（promotion）** させるときのルールと、
それを機械的に検査する仕組み。

目的: c10e6c0 のような「未完成素材の production 反映」を、プロンプトだけに頼らず
自動で止める。

関連:
- [yui-next-production-readiness-plan.md](../reviews/yui-next-production-readiness-plan.md)（昇格条件のスコア定義）
- [bad-examples/c10e6c0-yui-idle-failed-promotion.md](../reviews/bad-examples/c10e6c0-yui-idle-failed-promotion.md)（失敗例）
- manifest: `data/player-asset-promotion.json`
- check script: `scripts/quality/check-player-asset-promotion.ts`

---

## 1. 用語

- **promotion（昇格）**: prototype/draft の player asset を、production の source/PNG に反映すること。
- **production player asset**:
  - `public/assets/sprites/player/yui_idle_42.png`
  - `assets/source/aseprite/player/yui_idle.aseprite`
  - 将来追加（例: `yui_master_52.png`）も manifest に登録して同じゲートに乗せる。

---

## 2. manifest: `data/player-asset-promotion.json`

各 production player asset の昇格状態を記録する。

主なフィールド:

| field | 意味 |
| --- | --- |
| `status` | `draft` / `temporary` / `rejected` / `production-candidate` / `final-candidate` |
| `source` | Aseprite source path |
| `productionPng` | production PNG path |
| `reviewDoc` | before/after・採点を含む review md path |
| `beforeAfterImage` | before/after 比較画像 path |
| `exportCommand` | source → export に使ったコマンド |
| `qualityGate` | 9項目の5段階スコア |

- `promotableStatuses`: 昇格を許可する status（既定 `production-candidate` / `final-candidate`）。
- `blockedStatuses`: 昇格を禁止する status（`temporary` / `draft` / `rejected` / `bootstrap` / `temporary candidate`）。
- `requiredQualityGateKeys`: 4以上が必須のスコアキー。
- `minRequiredScore`: 既定 4。

---

## 3. check script: `scripts/quality/check-player-asset-promotion.ts`

実行:

```sh
pnpm assets:check-player-promotion
# または
node --experimental-strip-types scripts/quality/check-player-asset-promotion.ts [--base=<ref>]
```

`--base` 省略時は `origin/main` → `main` → 初回commit の順で base を解決し、
`base..HEAD` の差分 + working tree の変更を検査する。

### 検査内容

1. **production sprite touched check**
   production player asset が変更されている場合、その asset について以下を必須にする。
   - manifest に登録がある
   - `status` が promotable（`temporary`/`draft`/`rejected` ではない）
   - `requiredQualityGateKeys` がすべて `minRequiredScore`(=4) 以上
   - `reviewDoc` が存在する
   - `beforeAfterImage` が存在する
   - `source` が存在する
   - `exportCommand` が記録されている
   - manifest 未登録の production path を変更していない

2. **forbidden wording check**
   commit message / 変更された review md に以下があると fail。
   - `temporary candidate` かつ production touched
   - `GUI未実施` かつ production touched
   - `hand-final` かつ `GUI未実施`
   - `Aseprite手仕上げ` かつ `script生成`
   （policy / bad-examples / PRテンプレ等、ルールを説明する meta docs は対象外。）

3. **public PNG 直編集ガード**
   `productionPng` が変わっているのに `source` が変わっていない場合 fail
   （public PNG の直接編集禁止 = source → export を強制）。

終了コード: 0=pass / 1=fail。

---

## 4. 昇格の正しい手順

1. prototype/draft を Aseprite GUI で手仕上げ（[yui-aseprite-gui-handoff.md](yui-aseprite-gui-handoff.md)）。
2. 1x/4x/暗背景/combat mock 確認、before/after 比較を作る。
3. [merchandise-checklist](yui-merchandise-character-checklist.md) と [quality-gate](../pixel-art-quality-gate.md) で採点。
4. 全必須スコア >= 4 を確認したら、manifest を更新:
   - `status` を `production-candidate`（または `final-candidate`）
   - `reviewDoc` / `beforeAfterImage` / `exportCommand` を記入
   - `qualityGate` の各値を記入
5. source を編集 → `pnpm aseprite:export:yui` で export（PNG 直編集はしない）。
6. `pnpm assets:check-player-promotion` / `pnpm assets:verify` / `pnpm test` / `pnpm build` を通す。
7. PR を出す（[PR テンプレ](../../.github/PULL_REQUEST_TEMPLATE.md) のチェックリストを埋める）。

---

## 5. CI への組み込み（推奨）

このリポジトリには現状 GitHub Actions は無い。
導入する場合は PR で以下を実行することを推奨:

```sh
pnpm assets:check-player-promotion
pnpm assets:verify
pnpm test
pnpm build
```

`assets:verify` への直結は今回はしていない（責務が異なるため別コマンドにした）。
手元では昇格を含む変更の前に必ず `assets:check-player-promotion` を実行すること。
