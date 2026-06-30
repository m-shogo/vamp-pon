# Unity U1 Agent Prompt

Unity U1 / U1.1開始時にそのまま渡す作業指示。

---

```txt
対象repo: m-shogo/vamp-pon
対象path: /Users/m-shogo/Developer/personal/vamp-pon
Unity project path: /Users/m-shogo/Developer/personal/vamp-pon/unity/VampPonUnity
Unity Editor: 6000.5.1f1
Unity Editor path: /Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app
Architecture: Apple Silicon
Render Pipeline: 2D URP

目的:
Unity U1 / U1.1を進める。
全移植ではなく、unity/VampPonUnity/ にUnity 6.5.1f1 + 2D URPの最小technical spikeを作り、Editorで検証する。

最初に読むdocs:
- docs/unity-current-doc-index-2026-06-30.md
- docs/unity-u1-current-handoff-2026-06-30.md
- docs/unity-editor-version-lock-2026-06-30.md
- docs/unity-pro-preflight-review-2026-06-30.md
- docs/unity-pre-migration-hardening-checklist.md
- docs/unity-responsive-screen-policy.md
- docs/unity-ai-asset-production-rules.md
- docs/unity-roadmap-to-release.md
- docs/unity-u1-implementation-brief.md
- docs/unity-repo-layout-and-lfs.md
- docs/unity-u0-project-setup-plan.md
- docs/final-screen-comparison-review-2026-06-29.md
- docs/unity-asset-import-map.md
- docs/unity-data-schema-map.md

作業前に確認すること:
- /Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app が存在する
- ProjectSettings/ProjectVersion.txt を実Editor version 6000.5.1f1 に合わせる
- unity/VampPonUnity/ 配置
- .gitignore / .gitattributes 方針
- U1ではLFSを新規有効化しない
- public/assets/sprites/ を使わない
- U1では全移植しない
- Built-in Render Pipelineは使わない
- HDRPは使わない
- 390x844固定ではなく、各スマホ画面サイズ・アスペクト比・Safe Areaに合わせる
- 390x844はdesign reference / minimum QA baselineとして扱う
- 本番Unity素材は既存Web素材の使い回し前提にしない
- AI生成素材はcandidate -> QA -> approved -> Unity importで扱う

作業範囲:
- Unity Editor 6000.5.1f1で unity/VampPonUnity/ を開く
- Boot.unity / Stage1.unity をEditorで開いて保存する
- Assets/_Project/ の最小フォルダを維持する
- 2D URP Renderer Asset / 2D Renderer Data / GraphicsSettings / QualitySettings を正式生成・割当する
- 390x844 referenceを基準にしつつ、複数スマホ縦解像度で確認する
- SafeAreaCanvasを確認する
- gameplay backgroundが各端末画面を自然に覆うようにする
- Yui placeholder、Ombu placeholder、dark paper background、lantern glow、EXP pickup curve placeholderを確認する

Render Pipeline方針:
- Vamp Pon Unity版は Unity 6.5.1f1 + 2D URP 固定
- Built-in Render Pipelineは使わない
- HDRPは使わない
- Built-in material / shader前提の設定を増やさない
- 既にBuilt-in寄りの設定が混ざっている場合は、U1.1範囲で最小限だけ2D URPへ寄せる

画面方針:
- Canvas ScalerはScale With Screen Size
- Reference Resolutionは390x844
- ただし実機表示は390x844固定ではない
- 重要UIはSafe Area内に置く
- 背景とgameplay領域は各スマホ画面いっぱいに表示する
- Editor Game ViewではFree Aspectだけで確認しない
- 390x844 referenceに加えて、iPhone/Android想定の複数縦解像度で確認する

素材方針:
- U1〜U2では既存素材をplaceholderとして最小限だけ使ってよい
- U1素材は本番採用扱いにしない
- U3以降でUnity用素材仕様を確定する
- 本番はUnity用に作り直したapproved素材だけを使う
- 必要な素材はCodex / 画像生成AIでcandidateを作ってよい
- 文字入り画像、完成画面スクショ、生成参照画像そのものはruntime UIに使わない

守ること:
- Web/Phaser側srcはU1では原則変更しない
- public/assets/sprites/ はretiredなのでコピーしない
- Unity生成物の Library / Logs / UserSettings / .sln / .csproj をcommitしない
- 20キャラ、48敵、全ステージ、全UI、Save、Collection、AchievementはU1で作らない
- 生成参照画像をruntime UIにそのまま貼らない
- 文字入り画像をUI素材にしない
- Addressables、CI、store build、課金/広告はU1で入れない

U1 / U1.1完了条件:
- Unity Editor 6000.5.1f1で開ける
- ProjectVersion.txt が実Editor version 6000.5.1f1 と一致する
- 2D URPが正式設定されている
- Unity Editorで再生できる
- Boot -> Stage1へ遷移できる
- Game View 390x844 referenceで破綻しない
- 複数スマホ縦解像度で重要UIがSafe Area内に収まる
- gameplay backgroundが各端末画面を自然に覆う
- SafeAreaCanvasがある
- Yui placeholderが表示される
- Ombu placeholderが表示される
- lantern glowが表示される
- EXP fragmentがプレイヤーへ吸い込まれる
- git status --short に不要なUnity生成物が出ない

最後に報告すること:
1. 作成/変更ファイル
2. Unity Editor version
3. ProjectVersion.txt の内容
4. 2D URP設定結果
5. 再生確認結果
6. 確認したGame View解像度
7. git status --short
8. U1未実装
9. 次のU1.2 / U2でやること
10. 移行前チェックリストで未解決の項目
11. U1で仮使用した素材と、本番では作り直す素材
```
