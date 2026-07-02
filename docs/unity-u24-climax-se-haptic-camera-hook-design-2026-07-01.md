# Unity U24 Climax SE / Haptic / Camera Hook Design

## Scope

U24ではSEファイル実装とhaptic実機確認は行わない。hook名、camera impulse強度、haptic強度、SE event名をproofとして定義する。

## Event Names

- `kokuyou_ready_pulse`
- `kokuyou_activate_cutin`
- `kokuyou_active_hit`
- `kokuyou_ending_release`
- `rare_card_reveal`
- `rare_seal_pulse`
- `evolution_material_converge`
- `evolution_complete`

## Camera Impulse

- Ready: weak, 0.04s
- Activation: strong, 0.18s
- Active hit: medium, 0.08s
- Ending: medium, 0.12s
- Rare reveal: weak, 0.06s
- Evolution converge: medium, 0.12s
- Evolution complete: medium, 0.16s

U24ではlightweight camera impulse proofに留める。Cinemachineは導入しない。

## Haptic

- Ready: light
- Activation: medium
- Active hit: light
- Ending: light
- Rare reveal: light
- Evolution complete: medium

haptic実機確認はnot executed。

## SE

SEファイルは未実装。event名だけ定義し、U25以降で音源、音量、pitch、ducking、platform差分を検討する。
