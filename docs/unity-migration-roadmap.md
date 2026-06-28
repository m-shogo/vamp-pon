# Unity移行ロードマップ

作成日: 2026-06-28
対象: Web版 Vamp Pon → Unity 2D版 Stage1 Vertical Slice

---

## 1. 移行目的

- モバイル実機 (iOS / Android) でネイティブ品質のゲームを届ける
- タッチ入力・パフォーマンス・ストア配信をWebでは解決しにくいため
- Web版はプロトタイプ・仕様固めの役割として完了させる
- Unity版 Stage1 Vertical Sliceで「遊べる最小版」を作り、品質を積み上げる

---

## 2. 移行しないもの

- Phaserレンダリング固有の実装詳細
- VisualGallery / SpriteInspectorScene
- debug snapshot のJS実装
- localStorage保存の実装コード
- Web固有のビルド設定 (Vite / tsc)
- `public/assets/sprites/` (retired)

---

## 3. Unity版 Stage1 Vertical Slice の完成条件

1. 390x844縦画面 (または相当の縦比率) でプレイできる
2. プレイヤーが移動できる (バーチャルスティック)
3. 敵が湧いて近づいてくる
4. 武器が自動発射され敵を倒せる
5. XP (記憶片) が拾える
6. レベルアップカードが3枚表示されて選べる
7. HP0で敗北しリザルトへ行ける
8. dawn_ticket QAで1回復帰できる
9. HUDが読める (HP/XP/タイマー/kills)
10. 低HP警告がある
11. 数分通しで破綻しない

---

## 4. フェーズ分け

### Phase U0: Unity移行前準備 (Web側作業)

- Unity version候補の決定 (Unity 6 LTS推奨)
- 2D URP or Built-in の判断
- Git管理方針 (別repo or monorepo)
- Web assetsの持ち込み方針 (PNG/JSON)
- ScriptableObject設計方針の確認
- docs/web-to-unity-system-map.md, docs/unity-asset-import-map.md, docs/unity-data-schema-map.md の整備

### Phase U1: Unity空プロジェクト / 縦画面基盤

- Unityプロジェクト作成
- 390x844相当のCanvas / Camera設定
- Safe Area対応 (iPhone notch等)
- Input System導入 (バーチャルスティック)
- Scene bootstrap (BootScene → StageScene)
- 縦画面固定設定
- 実機またはシミュレータで解像度確認

**成果物**: 空のプレイシーンで縦画面が立ち上がる

### Phase U2: Stage1最低戦闘

- プレイヤー移動 (PlayerController)
- 敵スポーン (EnemySpawner)
- 敵の追尾 AI (EnemyController)
- 敵との接触判定 (PlayerDamage)
- HP・GAMEOVER
- ゲームタイマー (8分)
- リザルト遷移 (最小)

**成果物**: 敵に当たって死ねる

### Phase U3: 武器 / XP / LvUp

- 武器自動発射 (WeaponSystem)
- 敵HPと撃破
- XP断片スポーン (PickupSystem)
- XP磁石吸引 (MagnetRange)
- LvUpトリガー (XPカーブ)
- LvUpカードUI (3択)
- インベントリ (武器/パッシブ/レア)

**成果物**: XPを拾ってレベルアップできる

### Phase U4: HUD / カード / リザルト

- HUD (HP/XP/タイマー/kills/frags)
- LvUpカードデザイン (Normal/Good/Rare)
- リザルト画面 (生存時間/撃破数/獲得記憶片)
- StageSelect / Growth 最低導線

**成果物**: HUDが読めてリザルトまで行ける

### Phase U5: 演出 / SE / 素材

- 敵撃破演出 (インク破裂/記憶片)
- XP吸収演出 (暖色リング)
- LvUp到達演出
- 低HP警告 (画面端パルス)
- dawn_ticket QA復帰演出
- inventory iconのUI表示
- 最低限のSE

**成果物**: 演出が成立している

### Phase U6: 実機確認

- iOS / Android相当での動作確認
- タッチ入力品質
- FPS (目標60fps)
- アセットサイズ
- ビルド設定 (Development Build → Release候補)

**成果物**: 実機でプレイできる

---

## 5. 各フェーズの成果物まとめ

| フェーズ | 主成果物 |
|---|---|
| U0 | Unity移行docs一式、Web仕様凍結 |
| U1 | 縦画面が立ち上がる空プロジェクト |
| U2 | 敵に当たって死ねる |
| U3 | XP拾ってLvUpできる |
| U4 | HUDとリザルトが成立 |
| U5 | 演出・SEが成立 |
| U6 | 実機で動く |

---

## 6. リスク

| リスク | 対処 |
|---|---|
| Unity LTS選定ミス | Unity 6 LTS (6000.x) が現時点で最安定候補。決定前に確認する |
| 2D URP vs Built-in | 2D URP推奨。ライティング/シェーダーで迷わない範囲にとどめる |
| アセット解像度問題 | 180px原本を基準にし、PPUを仮値で固定してから調整 |
| タッチ入力遅延 | New Input Systemのバーチャルスティックを早期に実機確認 |
| 白フリンジ問題 | 透明PNG import時にFilter Mode: Pointを使うか要確認 |
| Addressables過剰実装 | 初期はResources or direct referenceでよい |
| Web版と仕様がずれる | Unityで変えた値はdocsへ都度反映 |

---

## 7. Web版とUnity版の差分

| 項目 | Web版 | Unity版 |
|---|---|---|
| レンダリング | Phaser (Canvas/WebGL) | Unity 2D URP |
| 入力 | ポインタイベント | New Input System |
| 物理 | カスタム数学関数 | 必要なら Physics2D, またはカスタム |
| セーブ | localStorage | PlayerPrefs or クラウド |
| ビルド | Vite + tsc | Unity Build System |
| デバッグ | debug=true URLパラメータ | Unity DebugOverlay |
| アセット配信 | `/public/assets/` | Resources or Addressables |
| データ | TypeScript定数/配列 | ScriptableObject / JSON |

---

## 8. いつWeb作業を止めるか

以下が揃ったらWeb新機能追加を止め、Unity移行を開始する:

- [x] Stage1仕様凍結ライン確定 (docs/web-stage1-freeze-line.md)
- [x] Unity移行docs一式 (system-map / asset-import-map / data-schema-map / vertical-slice-spec)
- [x] 8分通し確認 (または5分以上での破綻なし確認)
- [x] build/test/check 全通過
- [ ] Unity移行判断の最終確認 (チーム合意)

---

## 9. スケジュール目安

| マイルストーン | 最短 | 標準 |
|---|---|---|
| Unity移行準備 (U0) | 3日 | 1週間 |
| Unity Stage1最低再現 (U1〜U3) | 2週間 | 4週間 |
| HUD/演出/素材 (U4〜U5) | 1週間 | 2週間 |
| 実機確認 (U6) | 3日 | 1週間 |
| **Unity Vertical Slice完成** | **3〜4週間** | **6〜8週間** |
| Unity MVP (全機能最低線) | 2〜3か月 | 3〜4か月 |
| ストア提出最低ライン | 4〜6か月 | 6〜9か月 |
| 売れる品質 | 6か月〜 | 12か月〜 |

---

## 10. Claude / Codex / Unity での分担案

| 作業 | 担当 |
|---|---|
| Unity C#実装 (Player/Enemy/Weapon/Pickup) | Claude Code / Codex |
| ScriptableObject定義 | Claude Code |
| Unity UI (HUD/Card/Result) | Claude Code |
| データ移植 (TS → SO/JSON) | Claude Code / Codex |
| アセット import設定 | Claude Code |
| VFX (Particle System / Shader) | 人手 + Claude補助 |
| SE / BGM | 人手 |
| 実機確認・QA | 人手 |
| ストア申請 | 人手 |
