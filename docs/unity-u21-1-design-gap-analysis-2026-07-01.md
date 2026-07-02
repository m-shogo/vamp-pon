# Unity U21.1 Design Gap Analysis

評価軸: Readability / World Fit / Premium Feel / Touch Clarity / Visual Hierarchy / Game Feel は1〜5。DecisionはAdopt / Fix / Hold / Reject。

| Screen | Readability | World Fit | Premium Feel | Touch Clarity | Visual Hierarchy | Game Feel | Risk | Decision |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| StageSelect entry | 4 | 3 | 2 | 4 | 3 | 2 | Medium | Fix |
| Stage1 playing | 4 | 2 | 1 | 3 | 3 | 1 | High | Fix |
| EXP / Drop / 回復drop | 3 | 2 | 2 | 3 | 3 | 2 | High | Fix |
| LevelUp integrated | 4 | 3 | 2 | 4 | 3 | 2 | High | Fix |
| Rare integrated | 4 | 3 | 2 | 3 | 3 | 2 | Medium | Hold |
| Evolution integrated | 4 | 2 | 2 | 3 | 3 | 2 | Medium | Hold |
| 黒耀化 ready | 4 | 3 | 3 | 4 | 3 | 3 | Medium | Fix |
| 黒耀化 active | 4 | 3 | 3 | 3 | 3 | 3 | High | Fix |
| Clear Result | 4 | 3 | 2 | 4 | 4 | 2 | Medium | Fix |
| Fail Result | 4 | 3 | 2 | 4 | 4 | 2 | Medium | Fix |
| Stage return | 4 | 3 | 2 | 4 | 3 | 2 | Medium | Fix |
| Contact sheet flow | 5 | 2 | 1 | 5 | 4 | 1 | Medium | Hold |
| Contact sheet risk | 5 | 2 | 1 | 5 | 4 | 1 | Medium | Hold |

## StageSelect entry

良い点は、active / locked / start CTAの関係が読みやすいこと。proっぽくない点は、地図というより点とカードの説明に見えること。安っぽさの原因は、紙の厚み、ルート線、封蝋、ランタン光の導線が不足していること。文字は読めるが英語ラベルが混ざると世界観が薄い。余白は広く安全だが、中心が空きすぎる。色は暗さと暖色があるが、locked nodeの明度差が弱い。スマホ操作はStart CTAが押せるが、次へ進みたい気分は弱い。次はU23で地図紙面、ルート線、active node glowを直す。

## Stage1 playing

良い点は、縦スライス要素が一覧で把握できること。proっぽくない点は、ゲームプレイではなく仕様説明リストに見えること。安っぽさの原因は、プレイヤー、敵、弾、EXP、HUDの位置関係が画面に存在しないこと。文字は読めるが説明的すぎる。余白は安全だがゲーム密度がない。色 / 光 / 影は静かすぎ、黒インクとランタン光の相互作用がない。紙UIはカード枠だけ、黒インクはほぼ不在。スマホ操作上は押す対象ではなく、遊ぶ画面として想像しにくい。U22で最優先にBattle HUDとplaying visualをpro化する。

## EXP / Drop / 回復drop

良い点はHeart manual collectの仕様が見えること。proっぽくない点は、pickupが実物ではなく文言として表示されること。安っぽさの原因は、欠片の吸引軌道、ランタンpulse、回復dropの手触りがないこと。文字は説明用で、実プレイ中には多すぎる。余白は問題ないが、pickup同士のscale差が未検証。色はamber / teal / heartの整理が必要。U22でpickup readability、U23で報酬表示、U24でrare sparkを磨く。

## LevelUp integrated

良い点は3枚カードの選択構造とtouch targetが見えること。proっぽくない点はカードが無地で、嬉しさや記憶カードの儀式感が弱いこと。安っぽさの原因は、紙の厚み、角の処理、封蝋、カード固有icon、選択時motionがないこと。文字は読めるがカード名と効果説明の階層が足りない。余白はU21.1で少し広げる。色は紙色があるが光と影が浅い。U23でLevelUp card prefab polishへ送る。

## Rare integrated

良い点はRareだけ少し強い色になっていること。proっぽくない点は、レアの高揚がまだ単色panelに依存していること。原因はflare、seal、pulse、SE hookの見せ方が弱いこと。文字は短くできる。余白は安全。色はgacha金ピカには寄っていないので方向は保留。U24でRare pulseとカードsealを磨く。

## Evolution integrated

良い点はrecipe ready / trigger / returnの流れが読みやすいこと。proっぽくない点は、合体のワクワクより説明が勝っていること。原因は素材シルエット、合体前後の変化、光の収束、カードから武器への変化がないこと。文字は説明的。余白は問題ない。U24でclimax寄り演出へ送る。

## 黒耀化 ready

良い点はReady / gauge / 発動CTAの導線が読めること。proっぽくない点は、ゲームの顔としての不穏さと美しさがまだ弱いこと。原因は黒インクのにじみ、赤黒の層、cut-in予兆がないこと。文字は読める。余白は安全。色は方向が合っている。U24でReady予兆、粒、発動前pauseの見せ方を磨く。

## 黒耀化 active

良い点は画面全体の色が変わり、通常画面との差があること。proっぽくない点は、赤紫の説明画面に見えて、必殺の高揚が足りないこと。原因はfull-screen art / cut-in / ink particle / camera impulse / SE hapticが未完成なこと。文字は説明的。overlay alphaはU21.1で少し落とす。U24で最重要climax polishへ送る。

## Clear Result

良い点はRank Aと報酬が読みやすいこと。proっぽくない点は、もう一度遊びたくなる報酬感が弱いこと。原因はrank seal、手帳に貼る動き、朝焼けの光、New badgeがないこと。文字は読めるがstats行は実機輝度で継続確認。余白は安全。U23でResult polishへ送る。

## Fail Result

良い点はFailとRank Cが明確なこと。proっぽくない点は、悔しさから再挑戦へ向かう導線が弱いこと。原因は改善hint、記録帳の残り香、CTA差分がないこと。文字は読める。U23でClear Resultと同じResult prefab系として磨く。

## Stage return

良い点はlast result labelで戻りが確認できること。proっぽくない点は、StageSelectへ戻った時の前回結果がただのテキストに見えること。原因は地図上の印、紙片、封蝋、次node誘導がないこと。U23でStageSelectとセットで直す。

## Contact sheet flow

良い点は流れの説明が速いこと。proっぽくない点は、ほぼ資料スライドでゲームの手触りがないこと。U21.1ではreview資料としては採用、本番画面とは切り離す。

## Contact sheet risk

良い点はリスクが簡潔なこと。proっぽくない点は、世界観の資料ではなく開発メモに見えること。U21.1ではreview資料として採用し、U22以降の実装画面とは混同しない。
