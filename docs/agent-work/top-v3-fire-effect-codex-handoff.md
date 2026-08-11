# TOP Living Night V3 — 炎effect改善 Codex handoff

Claude（実装・統合担当）が用意した、炎effectアセット再生成の低コンテキストhandoff。
Claudeは本環境でCodexを起動できないため、画像生成・アセット再生成はこのドキュメントを元に
Codex側で実行してください。モデルはAuto任せにせず、その時点で利用可能なモデルを確認して明示選択。

作業対象は `m-shogo/vamp-pon` のみ。他repoに触れない。

## 目的

焚き火を「より本物っぽく」「見ていたくなる」方向へ。identity・背景・レイアウトは変えず、
**effect companion packのアセットだけ**を差し替える。

## 再生成対象アセット（4点）と厳守すべき仕様

すべて `docs/design-targets/generated/top-living-night-v3/final/effects/` 配下。
**寸法・グリッド・セル数・透過は現行と同一に保つこと**（runtimeのAtlasCell計算とanchorが固定のため）。

| ファイル | 寸法(px) | グリッド | セル | 用途 |
|---|---|---|---|---|
| `10-fire-flipbook-atlas.png` | **1448 x 1086** | **4列 x 3行 = 12コマ** (各 362 x 362) | flipbook | 焚き火本体。runtime: `AtlasCell(frame, 4, 3)`、frame 0→11 の ping-pong。左上=frame0、右下=frame11。 |
| `11-fire-glow-mask.png` | **430 x 932** | 全画面mask | luminance-additive | 焚き火まわりの暖色glow。**輝度マスク**（明るい所が光る）。画面全体を照らしすぎない。 |
| `12-smoke-atlas.png` | **1536 x 1024** | **3列 x 2行 = 6セル** (各 512 x 512) | 粒種 | 煙。runtime: `AtlasCell(index % 6, 3, 2)`、4粒がcycle。透過必須。 |
| `13-embers-atlas.png` | **256 x 128** | **4列 x 2行 = 8セル** (各 64 x 64) | 粒種 | 火の粉。runtime: `AtlasCell(index % 8, 4, 2)`、10粒がcycle。透過必須、粒径/密度にばらつき。 |

- alpha必須（greenback不可）。checkerboardは透過の証明にならない。
- fire flipbookの12コマは滑らかに繋がり、ping-pong（0→11→0）で不自然な段差が出ないこと。
- 火床（coal/ember bed）を各コマの下部に一貫配置。立ち上がりに自然な差を出す。
- glow maskは焚き火位置（下記anchor）に中心を持つ暖色。過剰に全画面を照らさない。

## runtime alignment（絶対に壊さない）

- 焚き火の配置anchorは `FinalV3FireAnchor = (0.5, 0.3675)`、box `150 x 126`（`TopLivingNightView`）。**変更しない**。
- 各コマの「炎の根元」がセル内で一定の位置に来るようにする（コマ間で根元が跳ねると位置ズレに見える）。
- smoke/embersはруntimeで焚き火位置に追従（`TopLivingNightAmbientMotionDirector`）。atlasの粒は透明背景の中央付近に、周囲へ余白を残す。
- motion（コマ送り速度・粒の寿命・ゆらぎ）は**コード所有**（View/Director）。アセット側で新規モーションを作り込まない。

## Reduced Motion契約（壊さない）

- Reduced Motion時は smoke/embers を非表示、fireは低速コマ送り、glowは微小変動のみ（コード側で処理）。
- よってアセットは「静止1コマでも成立する見た目」であること（Reducedで止まっても破綻しない）。

## 登録（これをやらないとruntimeが新アセットを拒否してfallbackする）

runtimeの `TopLivingNightEffectCompanionPackController.ShouldUseFinalEffectPack` は、各effect PNGの
SHA256を `docs/design-targets/generated/top-living-night-v3/final/effect-companion-pack.json` の記録と
照合し、combined `packSha256` も検証する。アセット差し替え後は必ず:

1. 新アセットを上記effectsパスへ配置（**candidate扱いで開始**、寸法・グリッドは厳守）。
2. effect companion pack登録を再実行してSHAを更新:
   `node --experimental-strip-types scripts/unity/register-top-living-night-effect-companion-pack.ts`
   （既存のintake/registration運用に従う。candidate SHA / Core5 reference set SHAは現行と一致させる。）
3. `node --experimental-strip-types scripts/quality/check-top-living-night-effect-companion-pack.ts` が通ること。
4. その後 `scripts/unity/run-top-v3-runtime-capture-current.sh` で実runtime再撮影し、
   `scripts/quality/build-top-v3-capture-review-pack.py` でreview pack更新。

## やってはいけないこと

- キャラ5人・背景・Core5 identityの変更、sixth human追加
- 焚き火位置（anchor/box）の変更、smoke/embersの位置関係破壊
- TOP candidate全面再生成、loading画面化、過剰演出
- Reduced Motion契約破壊
- `approvedAsFinal` / `runtimeApproved` / review-status booleanの昇格（機械取得可能なruntime evidenceのみ、人間承認はpending維持）
- placementや他gameplay/unrelated変更

## 望ましい見た目

- 炎: 外炎・中炎・芯の温度差、painterly/paper/inkの世界観を保つ（genericな三角炎を避ける）
- 炭: 根元にわずかな赤熱
- 煙: 均一輪郭でなく少し崩れた自然な流れ
- 火の粉: 密度・粒径・速度にばらつき
- glow: campfire周辺に効き、画面全体を照らしすぎない暖色

## 完了時に報告してほしい項目

- updated fire assets / smoke assets / embers assets / glow
- 寸法・グリッド維持: yes/no（各ファイル）
- runtime alignment preserved: yes/no
- reduced motion preserved: yes/no
- effect-companion-pack 再登録済み: yes/no（新packSha256）
- runtime capture refreshed: yes/no
- review preview updated: yes/no
- blockers
