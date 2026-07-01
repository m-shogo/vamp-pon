# Unity U18 Kokuyou Runtime Prototype Plan

作成日: 2026-07-01

1. U18は本番完成ではなく黒耀化runtime prototypeである。
2. 黒耀化は、ダメージや危うさを力へ変えるコア演出の入口として扱う。
3. ゲージ蓄積はproof ruleとして被ダメージ入力ごとに+25、最大100、100でReady。
4. 発動hookはReady状態からのみ許可し、Pause中は発動しない。
5. full-screen overlayは `kokuyou_fullscreen_final_candidate_b` を主軸候補、cut-in bandは `cutin_black_ink_band_final_candidate` を候補として扱う。
6. BattleTimeScaleService経由で短いhit stop / slow proofを扱い、`Time.timeScale` を直接雑に触らない。
7. Active中は5秒程度のbuff proof表示に留め、本番攻撃力や速度balanceには接続しない。
8. 終了後は短いrecoil proofとCooldownを経てIdleへ戻る。
9. U17 Stage1 Loopにはproof上の状態表示として接続し、Result報酬やsaveには反映しない。
10. save / reward / unlockをまだ確定処理しない。
11. productionApproved=0を維持する。
12. U19以降へ、本番balance、SE、haptic、camera shake、専用cut-in完成を残す。
