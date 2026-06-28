# Web版 Stage1 仕様凍結ライン

作成日: 2026-06-28
目的: Web版でこれ以上作り込まないものとUnityへ持っていくものを分け、Unity移行判断の基準にする。

---

## 1. Unityへ持っていく仕様

| 仕様 | 現状 | 移行優先度 |
|---|---|---|
| 390x844縦画面基準 | 定数化済み (GAME_WIDTH/HEIGHT) | 必須 |
| Stage1通常run (8分) | 実装済み | 必須 |
| プレイヤー移動 (8方向 + ジョイスティック) | 実装済み | 必須 |
| 敵スポーン (密度カーブ付き) | 実装済み | 必須 |
| 敵撃破 (HP・当たり判定) | 実装済み | 必須 |
| XP発生 (記憶片) | 実装済み | 必須 |
| XP吸収 (磁石範囲・速度) | 実装済み | 必須 |
| LvUpカード選択UI | 実装済み | 必須 |
| 武器スロット5 / パッシブスロット5 / レアスロット2 | 実装済み | 必須 |
| 武器定義 (role: weapon) | weapons.ts | 必須 |
| パッシブ定義 (role: passive) | passives.ts | 必須 |
| レア分類 role: awakening_material | rareItems.ts | 必須 |
| 覚醒素材 role (name_tag / cracked_lens / sealed_letter / wind_mark) | rareItems.ts | 高 |
| survival_revival role | rareItems.ts | 高 |
| dawn_ticket QA復帰仕様 | survivalRevival.ts | 高 |
| 低HP警告 (画面端パルス) | 実装済み | 高 |
| HUD (HP/XP/タイマー/kills/frags) | 実装済み | 必須 |
| リザルト画面 | 実装済み | 必須 |
| StageSelect / Growth / Collection 最低導線 | 実装済み | 中 |
| Asset Manifest / inventory icon 要件 | 28種確認済み | 中 |
| 進化・覚醒 evo定義 | evolutions.ts | 高 |
| カプセル報酬 | capsule.ts | 中 |
| 黒曜化 (berserk) | berserk.ts | 中 |
| XP密集時の表示抑制 (active>70/120) | pickups.ts | 低 |
| 近距離XP吸引速度1.18倍 | pickups.ts | 低 |
| GameFeelConfig 各種チューニング値 | GameFeelConfig.ts | 高 |

---

## 2. Web版ではこれ以上深追いしない仕様

- **XP merge / fade / 遠距離自動回収**: P2扱い。Unity移行後に再設計。
- **Magnet系アイテム本格実装**: gold_compassの体感価値調整も含め保留。
- **画面外XP自動処理**: 実装なし、保留。
- **敵48体フル投入**: VisualGallery/QAでは確認可能。通常runへの全投入は保留。
- **キャラ20体**: 現在はユイのみ。
- **背景バリエーション大量生成**: 現状のStage1背景で凍結。
- **3D / Unity移行前の演出強化**: やらない。
- **dawn_ticket通常出現条件**: 出現重み・再取得可否は未決定のまま凍結。
- **gold_compassの価値本格調整**: Magnet系と一体で後続タスク。
- **長大なストーリー・テキスト実装**: 最小loreのみ。
- **課金 / 広告**: Web版では実装しない。
- **BGM / SE本格実装**: 現状のAudioManager最小構成で凍結。
- **StageSelect / Growth / Collection の深掘り**: 最低導線のみ。
- **VisualGallery拡張**: QA確認専用のまま。

---

## 3. Unity移行後に再設計する仕様

- 拾得導線全体 (XP merge、Magnet導線、遠距離自動回収)
- 演出 (VFX / Particle / SEの本格実装)
- タッチ操作 (iOS/Androidネイティブタッチ対応)
- パフォーマンス最適化 (モバイル実機FPS確認)
- セーブ・ロード (localStorage → PlayerPrefs or クラウド)
- 3D/2.5D表現の検討
- 全キャラ・全敵・全武器の段階投入
- ストア提出用ビルド設定

---

## 4. QA/debug限定仕様 (通常runに出さない)

| 仕様 | 用途 |
|---|---|
| dawn_ticket QA | `/?qa=dawn-ticket-revival&debug=true&playtest=true&play=1` |
| debug snapshot (activeXpPickups等) | `debug=true` または `playtest=true` |
| playtest auto-mover | `playtest=true` |
| Kキー致死入力 | dawn_ticket復帰確認用 |
| VisualGallery確認導線 | `/?scene=visual-gallery` |

---

## 5. 通常runにまだ出さない仕様

- `dawn_ticket` (role: survival_revival): QA/debug限定。通常抽選・通常ドロップ・カプセル報酬に追加しない。
- 黒曜化フル運用: berserkは実装済みだが通常runでの出現頻度・難易度調整は凍結。

---

## 6. 素材 / アセットで持っていくもの

| 素材 | 場所 | 状態 |
|---|---|---|
| core5 キャラスプライトシート (ユイ他) | `public/assets/prototypes/sprite-sheets/core5-original/` | 採用済み |
| core5 sliced frames | `public/assets/prototypes/sprite-sheets/core5-original-frames/` | runtime参照 |
| 敵スプライトシート | `public/assets/prototypes/sprite-sheets/enemies-original/` | 採用済み |
| inventory originals (weapon/passive/rare) | `public/assets/prototypes/sprite-sheets/weapon/`, `passive/`, `rare/` | 28種確認済み |
| 背景 | `public/assets/prototypes/backgrounds/` | Stage1背景採用 |
| dawn_ticket.png | `public/assets/prototypes/sprite-sheets/rare/dawn_ticket.png` | 採用済み (QA限定) |
| character master | `assets/reference/character-master/core5/` | 参照用 |

**retired**: `public/assets/sprites/` は使わない。

---

## 7. Web仮実装として扱うもの

- Phaserベースのレンダリング全般 (Unity移行で置き換え)
- localStorage保存 (PlayerPrefs or クラウドへ移行)
- VisualGallery (Unity移行後は不要)
- debug snapshot (Unity DebugOverlayに相当物を作る)
- autoLvUp/HP維持JShack (playtest専用、Unityでは不要)

---

## 8. Unity移行前に残る最低確認

- [x] Stage1通常run: 開始時 rareItems=[] 確認
- [x] dawn_ticket が通常runの pendingChoices に出ないことの確認
- [x] dawn_ticket QA復帰 (Kキー → HP復帰 → playing継続)
- [x] build/test/check 全通過
- [x] XP debug snapshot 値 (activeXpPickups / attractingXpPickups等) が確認できる
- [ ] 8分通し (または5分以上) での破綻なし確認 → Phase 1で実施
- [ ] Unity移行docs一式 (Phase 3〜7)
