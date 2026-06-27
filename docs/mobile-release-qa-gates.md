# モバイルリリースQAゲート

Vamp Ponをスマホ向けに仕上げるためのQAゲート。
Unity移行前後で共通して使う。コード、素材、runtimeは変更しない。

## 参照元

- Unity Profiler: https://docs.unity3d.com/Manual/Profiler.html
- Unity Sprite Atlas: https://docs.unity3d.com/Manual/SpriteAtlasWorkflow.html
- Unity UI systems: https://docs.unity3d.com/Manual/UI-system-compare.html
- Android target API requirement: https://developer.android.com/google/play/requirements/target-sdk
- Google Play Data safety: https://support.google.com/googleplay/android-developer/answer/10787469
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

## Gate 1: 画面可読性

合格条件:

- 390x844でHUDが読める。
- レベルアップカード3枚が読める。
- 32pxアイコンの意味が分かる。
- 背景と主要キャラが混ざらない。
- 重要操作が押しやすい。

停止条件:

- 見た目は良いが文字が読みにくい。
- 演出でHUDが隠れる。
- 小アイコンが意味不明になる。

## Gate 2: 戦闘体験

合格条件:

- 敵が近づく流れが分かる。
- 攻撃が当たったことが分かる。
- XP回収が気持ちいい。
- レベルアップが報酬に見える。
- 進化、合体、覚醒の特別感がある。

停止条件:

- 序盤が寂しい。
- 倒した感触が弱い。
- レベルアップが作業に見える。

## Gate 3: 性能

合格条件:

- Editorだけでなく実機で確認する。
- 60fps目標、30fps割れはNG。
- 戦闘中のGC allocationを抑える。
- 短命FXはpoolする。
- Profilerで重い箇所を説明できる。

確認項目:

- CPU update
- GPU load
- UI rebuild
- texture memory
- particle count
- draw calls / batches

## Gate 4: 端末差

合格条件:

- iPhone系の縦長画面で破綻しない。
- Androidの縦長画面で破綻しない。
- SafeAreaを考慮している。
- 低め性能端末でも最低限動く。

確認する画面:

- Top
- StageSelect
- Battle
- LevelUp
- Result
- Upgrade
- Collection

## Gate 5: データと保存

合格条件:

- definitionとruntime stateが分かれている。
- saveにはIDだけ保存する。
- asset参照をsaveに入れない。
- versioned save schemaがある。
- migration tableを用意できる。

注意:

- `old_ticket` のような互換IDは、Unity移行時にmappingで整理する。
- Web版では既存IDを安易に変えない。

## Gate 6: SDKと権限

合格条件:

- 不要な権限を要求しない。
- SDK一覧を残す。
- 収集データを説明できる。
- 広告、分析、課金は必要になるまで後回しにする。

初期MVPでは避ける:

- 位置情報
- 連絡先
- カメラ
- マイク
- SNS連携
- アカウント必須化

## Gate 7: ストア提出前

合格条件:

- クラッシュがない。
- placeholder textがない。
- 実機能と説明が一致している。
- privacy policy URLを用意する。
- support URLを用意する。
- target API levelを確認する。
- data safety / privacy detailsと実装が一致している。

## Gate 8: 量産性

合格条件:

- 素材の保存先が分かる。
- test-pack止まりとruntime採用済みが分かる。
- UI部品が再利用できる。
- Stage追加、キャラ追加、敵追加の作業が想像できる。
- Unity移行後も作業が破綻しない。

## 最終判定

以下を満たすまで、商用MVPとは呼ばない。

- 読める。
- 押せる。
- 気持ちいい。
- 重くない。
- 壊れにくい。
- 説明と実装が一致している。
- 次の素材やステージを増やせる。
