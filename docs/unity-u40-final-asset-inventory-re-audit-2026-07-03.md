# Unity U40 Final Asset Inventory Re-audit

U40ではStage1 runtime assetを再棚卸しし、U32の`assetReplacementReady=false`をU36 Sprite Atlas packingとU39 finalCandidate SEの後続状態で再評価した。generated evidence、screenshots、public prototypesはruntime final assetとして扱わない。

| assetKey | path | category | runtime usage | status | replacement target | blocker | risk | next action |
|---|---|---|---|---|---|---|---|---|
| player_sprites | `unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/Battle/u5-yui-battle-candidate.png` | player sprites | Stage1 player visual | finalCandidate | `Assets/_Project/Art/Characters/Stage1/` |  | medium | device readability review |
| enemy_sprites | `unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/Battle/u5-ombu-battle-candidate.png` | enemy sprites | Stage1 enemy visual | finalCandidate | `Assets/_Project/Art/Enemies/Stage1/` |  | medium | device readability review |
| weapon_projectile_sprites | `unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/VFX/u5-lantern-spark.png` | weapon / projectile sprites | soft projectile feedback | runtimeApprovedDraft | `Assets/_Project/Art/Projectiles/Stage1/` | needs final visual review | low | keep fallback |
| item_passive_icons | `unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/UI/u5-icon-frame.png` | item / passive icons | LevelUp card icon frame | runtimeApprovedDraft | `Assets/_Project/Art/Icons/Stage1/` | icon set still draft | low | review with economy hardening |
| pickup_sprites | `unity/VampPonUnity/Assets/_Project/Resources/U5Candidates/VFX/u5-exp-fragment.png` | pickup sprites | XP fragment pickup | finalCandidate | `Assets/_Project/Art/Pickups/Stage1/` |  | low | device density review |
| ui_paper_parts | `unity/VampPonUnity/Assets/_Project/Resources/U8Refined/UI/result_new_badge_refined.png` | UI paper parts | paper UI widgets | finalCandidate | `Assets/_Project/Art/UI/Paper/` |  | low | keep U36 atlas packing |
| hud_parts | `Unity UI generated from runtime presenters` | HUD parts | Time HP Lv EXP HUD | runtimeApprovedDraft | `Assets/_Project/Art/UI/HUD/` | procedural readable HUD | low | device readability review |
| levelup_cards | `Unity UI generated from U23/U25 presenters` | LevelUp cards | LevelUp choice UI | runtimeApprovedDraft | `Assets/_Project/Art/UI/LevelUp/` | card art final approval later | low | keep 390x844 readable |
| result_ledger_stamp_seal | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/result_rank_wax_seal.png` | Result ledger / stamp / seal | Result screen feedback | finalCandidate | `Assets/_Project/Art/UI/Result/` |  | low | reward economy review later |
| stageselect_map_route_lantern | `unity/VampPonUnity/Assets/_Project/Resources/U8Candidates/UI/stageselect_start_marker_lantern.png` | StageSelect map / route / lantern | StageSelect route proof | finalCandidate | `Assets/_Project/Art/UI/StageSelect/` |  | low | Stage2 remains placeholder |
| kokuyou_rare_evolution_effects | `unity/VampPonUnity/Assets/_Project/Resources/U10Candidates/VFX/levelup_rare_memory_tear_burst.png` | Kokuyou / Rare / Evolution effects | special moments only | finalCandidate | `Assets/_Project/Art/Effects/Climax/` |  | medium | device performance review |
| sprite_atlas_u36 | `unity/VampPonUnity/Assets/_Project/SpriteAtlases/U36/` | Sprite Atlas U36 assets | candidate atlas packing | productionCandidate | same |  | low | draw calls / batches on device |
| u39_final_candidate_se | `unity/VampPonUnity/Assets/_Project/Audio/U39FinalCandidateSe/` | U39 finalCandidate SE | Stage1 SE candidate | finalCandidate | `Assets/_Project/Audio/ProductionSe/` | final approved SE not complete | medium | human/device audio review |
| generated_screenshots | `docs/design-targets/generated/` | generated screenshots / docs references | QA evidence only | blockedFromRuntime | none | runtime forbidden | high | keep checker blocking |
| public_prototypes | `public/assets/prototypes/` | public prototype references | reference only | generatedReferenceOnly | none | not runtime final | high | do not promote without Unity finishing |

Generated JSON: `docs/design-targets/generated/unity-u40/final-asset-inventory-re-audit.json`
