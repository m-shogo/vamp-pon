# Unity U28 SE / Haptic / Feel Integration Review

## 変更概要

U28では、Stage1 playable vertical sliceへdraft SE、audio event routing、haptic routing、audio + haptic pairing、feel verificationを追加した。productionApproved=0のまま。

## audio event taxonomy

Battle、Pickup、UI、Climax、Result、StageSelectのcategoryに分け、event id、priority、volume draft、cooldown、polyphony limit、haptic pairing、future production noteを`U28AudioEventRegistry`に定義した。

対象eventはbattle_start、player_hit、player_damage、enemy_hit_soft、enemy_defeat_ink、pickup_xp、pickup_heal、pickup_rare、weapon_fire_soft、levelup_ready、levelup_open、card_hover、card_select、card_confirm、rare_seal_pulse、evolution_convergence、evolution_complete、kokuyou_gauge_ready、kokuyou_activation、kokuyou_active_loop、kokuyou_ending、result_open、result_stamp、reward_card、unlock_reveal、stage_select_lantern、stage_route_unlock、retry_confirm。

## draft SE asset一覧

`unity/VampPonUnity/Assets/_Project/Audio/U28DraftSe/`にrepo内script生成のoriginal placeholder / draft SEを追加した。

- `vp_battle_start_soft.wav`
- `vp_pickup_xp_soft.wav`
- `vp_pickup_heal_warm.wav`
- `vp_pickup_rare_seal.wav`
- `vp_levelup_open_paper.wav`
- `vp_card_select_ink.wav`
- `vp_card_confirm.wav`
- `vp_weapon_fire_soft.wav`
- `vp_enemy_hit_soft.wav`
- `vp_enemy_defeat_ink.wav`
- `vp_player_damage_mute.wav`
- `vp_evolution_convergence.wav`
- `vp_evolution_complete.wav`
- `vp_kokuyou_ready.wav`
- `vp_kokuyou_activation.wav`
- `vp_kokuyou_ending.wav`
- `vp_result_stamp.wav`
- `vp_reward_card.wav`
- `vp_unlock_reveal.wav`
- `vp_stage_lantern.wav`
- `vp_stage_route_unlock.wav`
- `vp_retry_confirm.wav`

生成元は`scripts/audio/generate-u28-draft-se.mjs`。外部素材は使っていない。本番SE確定ではない。

## audio routing設計

`U28AudioRouter`がPlay、PlayAt、category volume、mute / unmute、debounce、polyphony limit、priority definition、safe missing clip fallbackを持つ。AudioMixer本番設計ではなく、draft routing proof。

## runtime接続箇所

`U28Stage1FeelRuntimeConnector`がU25 feedback event名、U24 climax hook名、U27 Result / StageSelect / Retry modelを受け、音と振動を接続する。Battle start、enemy hit、enemy defeat、player damage、XP / heal / rare pickup、levelup open、card select、rare、evolution、Kokuyou、result open / stamp、reward card、unlock reveal、stage select lantern、stage route unlock、retry confirmを通す。

## haptic event taxonomy

`U28HapticRegistry`にlight_tap、soft_pickup、card_select、damage、rare_pulse、evolution_complete、kokuyou_ready、kokuyou_activation、result_stamp、unlock_revealを定義した。intensity draft、duration draft、cooldown、platform support note、future user setting noteを持つ。

## haptic routing設計

`U28HapticRouter`はEditor no-op adapterを通す。`U28MobileHapticPlaceholderAdapter`はiOS / Android差し替え前提のplaceholder。実機確認は未確認。

## audio + haptic pairing

pickup_xpは小さいSEのみ、pickup_healはsoft pickup、card_selectはcard select、player_damageはdamage、rare_sealはrare pulse、evolution_completeはmedium相当、kokuyou_readyはlight warning、kokuyou_activationは強めのdark activation、result_stampはstamp、unlock_revealはwarm revealとしてpairingした。

## user settings future hook

`U28FeelSettingsDraft`、`IU28FeelSettingsRepository`、`U28InMemoryFeelSettingsRepository`を追加した。master volume、SE volume、haptic enabled、accessibility reduce intense effects future noteを持つ。設定UIは未実装。

## 390x844確認結果

`docs/design-targets/generated/unity-u28/screenshots/`にpickup、levelup、rare、evolution、Kokuyou、result stamp、StageSelect lanternの確認画像を生成した。`audio-event-map.json`、`haptic-event-map.json`、`se-asset-list.json`も生成した。

## productionApproved=0の理由

本番SE、AudioMixer、platform haptic、実機確認、performance / mobile FPS、production approval gateが未完了のため。

## generated final画像 / Addressables / 本番SE

generated final画像や参照PNGをruntimeへ貼っていない。Addressablesは未導入。本番SEは未確定。

## haptic実機確認

Editorではsafe no-opで確認した。haptic実機確認は未確認。iOS / Android実機haptic確認も未確認。

## 実行したcheck一覧

- Unity U28 screenshot capture
- Unity U28 verification
- 既存Unity verification一式
- `pnpm unity:u28-se-haptic-feel:check`
- `pnpm unity:u27-save-reward-unlock:check`
- `pnpm unity:u26-stage1-first-playable-balance:check`
- `pnpm unity:u25-stage1-production-battle-loop:check`
- `pnpm unity:u24-climax-polish:check`
- `pnpm unity:u23-ui-visual-polish:check`
- `pnpm unity:u22-battle-visual-polish:check`
- `pnpm unity:meta:check`
- `git diff --check`

## 残リスク

スマホ実機スピーカーでの聞こえ方、clip compression、latency、連打時の最終mix、haptic intensity、accessibility設定、AudioMixer本番設計は未確認。

## 次に残る作業

- U29 Sprite Atlas / performance / mobile実機FPS。
- U30 production approval gate / Stage1 vertical slice判定。
- U31 Stage1実機QA / tuning pass。
