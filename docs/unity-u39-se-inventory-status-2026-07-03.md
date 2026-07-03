# Unity U39 SE Inventory Status

U28で追加したdraft SEを、U39ではrepo内生成のoriginal final-candidate SEとして再生成した。すべて `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/` 配下のwavで、外部素材、著作権素材、Web downloadは使っていない。

Status定義: `draft`はU28由来、`finalCandidate`はU39生成候補、`needsReplacement`は差し替え必須、`needsMixReview`はmix確認必須、`blockedFromFinal`は最終承認不可、`mobileCheckRequired`は実機確認待ち。

| event id | path | usage | duration | peak estimate | category | priority | loop | status | risk | next action |
|---|---|---|---:|---:|---|---|---|---|---|---|
| battle_start | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_battle_start_soft.wav` | Stage1 start | 0.24 | 0.1999 | Battle | normal | no | finalCandidate | low | device speaker review |
| pickup_xp | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_pickup_xp_soft.wav` | XP pickup | 0.11 | 0.1302 | Pickup | low | no | finalCandidate | low | spam review |
| pickup_heal | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_pickup_heal_warm.wav` | Heal pickup | 0.17 | 0.1536 | Pickup | normal | no | finalCandidate | low | device speaker review |
| pickup_rare | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_pickup_rare_seal.wav` | Rare pickup | 0.30 | 0.2033 | Pickup | high | no | finalCandidate | medium | mix review |
| levelup_open | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_levelup_open_paper.wav` | LevelUp open | 0.27 | 0.1811 | UI | high | no | finalCandidate | low | UX timing review |
| card_select | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_card_select_ink.wav` | Card select | 0.14 | 0.1488 | UI | normal | no | finalCandidate | low | repeated tap review |
| card_confirm | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_card_confirm.wav` | Card confirm | 0.17 | 0.1635 | UI | normal | no | finalCandidate | low | mix review |
| weapon_fire_soft | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_weapon_fire_soft.wav` | Weapon fire | 0.09 | 0.1056 | Battle | low | no | finalCandidate | low | voice cap review |
| enemy_hit_soft | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_enemy_hit_soft.wav` | Enemy hit | 0.08 | 0.1026 | Battle | low | no | finalCandidate | low | voice cap review |
| enemy_defeat_ink | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_enemy_defeat_ink.wav` | Enemy defeat | 0.20 | 0.1791 | Battle | normal | no | finalCandidate | low | dense wave review |
| player_damage | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_player_damage_mute.wav` | Player damage | 0.16 | 0.1548 | Battle | high | no | finalCandidate | low | haptic pair review |
| evolution_convergence | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_evolution_convergence.wav` | Evolution buildup | 0.40 | 0.1852 | Climax | high | no | finalCandidate | low | climax mix review |
| evolution_complete | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_evolution_complete.wav` | Evolution complete | 0.46 | 0.2183 | Climax | critical | no | finalCandidate | medium | speaker clipping review |
| kokuyou_ready | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_kokuyou_ready.wav` | 黒耀化 ready | 0.32 | 0.1833 | Climax | high | no | finalCandidate | low | haptic pair review |
| kokuyou_activation | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_kokuyou_activation.wav` | 黒耀化 activation | 0.54 | 0.2191 | Climax | critical | no | finalCandidate | medium | speaker clipping review |
| kokuyou_ending | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_kokuyou_ending.wav` | 黒耀化 ending | 0.34 | 0.1759 | Climax | high | no | finalCandidate | low | climax mix review |
| result_stamp | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_result_stamp.wav` | Result stamp | 0.18 | 0.1800 | Result | high | no | finalCandidate | low | repeated reward review |
| reward_card | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_reward_card.wav` | Reward card | 0.20 | 0.1443 | Result | normal | no | finalCandidate | low | reward mix review |
| unlock_reveal | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_unlock_reveal.wav` | Unlock reveal | 0.28 | 0.1686 | Result | high | no | finalCandidate | low | repeat suppression review |
| stage_lantern | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_stage_lantern.wav` | StageSelect lantern | 0.22 | 0.1334 | StageSelect | normal | no | finalCandidate | low | quiet screen review |
| stage_route_unlock | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_stage_route_unlock.wav` | Stage route unlock | 0.26 | 0.1549 | StageSelect | normal | no | finalCandidate | low | route unlock review |
| retry_confirm | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/vp_retry_confirm.wav` | Retry confirm | 0.13 | 0.1329 | UI | normal | no | finalCandidate | low | repeated tap review |

`PlayerHit`、`LevelupReady`、`CardHover`、`RareSealPulse`、`KokuyouActiveLoop`、`ResultOpen`はU28 alias / optional routingとして扱い、U39 final-candidate主対象からは外す。Kokuyou loopは本番loop素材ではないためfinal approvedにしない。
