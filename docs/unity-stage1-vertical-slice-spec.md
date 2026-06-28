# Unity版 Stage1 Vertical Slice 仕様

作成日: 2026-06-28
目的: Unity版で最初に再現するStage1の完成条件を明確にする。これが揃えばUnity Vertical Sliceとして成立する。

---

## 1. 画面

- 縦画面固定 (390x844相当、またはPortrait固定)
- Safe Area対応 (iPhone notch、Android system bar)
- UIはuGUI (Canvas + TextMeshPro)

---

## 2. 操作

- バーチャルスティック (New Input System)
- 左下エリアに配置
- 8方向移動 (またはアナログ)
- 武器は自動発射 (プレイヤー操作なし)

---

## 3. 戦闘ループ

```
スポーン → 追尾 → 衝突 → プレイヤーダメージ → HP0 → 敗北 or dawn_ticket復帰
                            ↓
                    敵撃破 → XP発生 → 吸引 → 回収 → XPカーブ → LvUp
```

- ゲーム時間: 8分 (480秒)
- クリア: 8分生存
- 敗北: HP0 かつ dawn_ticket未所持 or 消費済み

---

## 4. 敵

| 項目 | 仕様 |
|---|---|
| スポーン位置 | 画面外オフセット (40〜80px) |
| 最小プレイヤー距離 | 145px相当 |
| 密度カーブ | 0〜60s: ×1.5, 60〜180s: ×2.0, 180〜420s: ×2.5, 420s〜: ×3.0 |
| ソフトキャップ | 約118体 |
| ハードキャップ | 140体 |
| 種別 | small / medium / elite (Vertical Sliceでは最低2〜3種) |
| contactDamage | 種別ごとに定義 |
| XPドロップ | enemy.xpDrop から最大5個の記憶片に分割 |

---

## 5. 武器

| 項目 | 仕様 |
|---|---|
| スロット数 | 5 |
| 初期武器 | 夜の鉛筆 (night_pencil) Lv1 |
| 自動発射 | 最近傍の敵へ向けて発射 |
| レベルアップ | LvUpカード選択で強化 (最大Lv) |
| Vertical Slice対象 | 夜の鉛筆 + 最低2〜3種の武器 |

---

## 6. XP

| 項目 | 仕様 |
|---|---|
| 磁石範囲 | 95px × magnetMultiplier |
| 磁石速度 | 280px/s |
| 近距離加速 | 磁石範囲内側55%で1.18倍 |
| 回収半径 | 22px |
| 視覚 | 暖色の小さな星形 |
| 密集時表示抑制 | active>70: far XPをalpha0.76/scale0.66, active>120: alpha0.64/scale0.62 |

---

## 7. LvUp

| 項目 | 仕様 |
|---|---|
| 選択肢数 | 3枚 |
| Rarity | Normal (94%) / Good (18%) / Rare (6%) ※ロール確率 |
| 種別 | weapon_new / weapon_upgrade / passive_new / passive_upgrade / rare_new / heal |
| レアアイテム候補 | role === 'awakening_material' のみ (dawn_ticketは除外) |
| 入替 | リロール3回/run |

---

## 8. レア / 覚醒素材

| ID | role | 用途 |
|---|---|---|
| name_tag | awakening_material | 夜の鉛筆Lv5覚醒 |
| cracked_lens | awakening_material | ビー玉Lv5覚醒 |
| sealed_letter | awakening_material | 絵はがきカッターLv5覚醒 |
| wind_mark | awakening_material | 紙ひこうきLv5覚醒 |
| dawn_ticket | survival_revival | dawn_ticket QA復帰のみ (通常runに出さない) |

---

## 9. dawn_ticket QA復帰

| 項目 | 仕様 |
|---|---|
| 起動方法 | `/?qa=dawn-ticket-revival` 相当のデバッグ起動 |
| 発動条件 | HP0時に dawn_ticket を所持していれば自動発動 |
| 復帰HP | maxHp × 0.3 |
| 無敵時間 | 1.25秒 |
| 消費 | 1回消費、同一run中再発動なし |
| 演出 | 朝色リング + 小さな通知 (操作を止めない) |

---

## 10. HUD

| 要素 | 内容 |
|---|---|
| HPバー | 現在HP / maxHp、低HP警告付き |
| XPバー | 現在XP / xpToNext |
| タイマー | 残り時間 (8:00 → 0:00) |
| killsカウント | 撃破数 |
| 記憶片カウント | 取得済み記憶片数 |
| レベル表示 | LV1〜 |
| 武器スロット | 5枠 (空欄はグレー) |

---

## 11. 演出 (最低限)

| 演出 | 内容 |
|---|---|
| 敵撃破 | インク破裂 + 記憶片こぼれ |
| XP発生 | 小さな星形の飛び出し |
| XP吸収 | 暖色リングがプレイヤーへ収束 |
| LvUp到達 | XP吸収より一段明るい二段リング + 上向き光 |
| 低HP警告 | 画面端の薄いパルス (HP < maxHp×0.35) |
| dawn_ticket復帰 | 朝色リング + HP回復表示 |

---

## 12. リザルト

| 要素 | 内容 |
|---|---|
| 成功/失敗 | 生存 or 「夜に飲まれた」 |
| 生存時間 | MM:SS |
| 灯度 (Lv) | 到達レベル |
| 撃破数 | ほどいた影 |
| 取得記憶片 | 記憶のかけら |
| 黒曜片 | 獲得数 |
| 成長へ / もう一度 / ステージ選択 | ボタン |

---

## 13. セーブ

- runStats (黒曜片・記憶片の累計) をPlayerPrefsまたはJSONで保存
- 恒久強化 (Growth) の反映
- Vertical Sliceでは最低限。クラウド同期は後続。

---

## 14. デバッグ

- Debug Build時にオーバーレイ表示 (経過時間 / FPS / XP数 / kills)
- dawn_ticket QA起動フラグ (Editor or URLパラメータ相当)
- ログ出力 (XP数 / rareItems / pendingChoices)

---

## 15. 完成条件チェックリスト

- [ ] 390x844縦画面で起動する
- [ ] バーチャルスティックでプレイヤーが移動する
- [ ] 敵が湧いて追尾する
- [ ] 武器が自動発射されて敵に当たる
- [ ] 敵を倒せる
- [ ] XP (記憶片) が落ちて吸引・回収できる
- [ ] レベルアップカードが3枚出て選べる
- [ ] 武器 / パッシブを選べる
- [ ] HP0で敗北してリザルトへ行ける
- [ ] dawn_ticket QAでHP復帰できる
- [ ] リザルトからStageSelectへ戻れる
- [ ] HUDが読める
- [ ] 低HP警告がある
- [ ] 敵撃破・XP吸収・LvUp演出が最低限ある
- [ ] 3〜5分通しで破綻しない (FPS30以上)

---

## 16. やらないこと (Vertical Slice対象外)

- 全ステージ (Stage2以降)
- 全キャラ (ユイ以外)
- 全敵48体 (最低3〜5種で開始)
- 全武器 (最低3〜5種で開始)
- 課金 / 広告 / ストア連携
- 3D / 2.5D表現
- dawn_ticket通常出現 (QAのみ)
- Magnet系アイテム本格実装
- XP merge / fade / 遠距離自動回収
- 本格BGM / フルSE
- クラウド保存
- ストア申請準備
