# Unity U1 Agent Prompt

Unity U1開始時にそのまま渡す作業指示。

---

```txt
対象repo: m-shogo/vamp-pon
対象path: /Users/m-shogo/Developer/personal/vamp-pon

目的:
Unity U1を開始する。
全移植ではなく、unity/VampPonUnity/ にUnity 6 LTS 2D URPの最小technical spikeを作る。

最初に読むdocs:
- docs/unity-current-doc-index-2026-06-30.md
- docs/unity-u1-current-handoff-2026-06-30.md
- docs/unity-pre-migration-hardening-checklist.md
- docs/unity-u1-implementation-brief.md
- docs/unity-repo-layout-and-lfs.md
- docs/unity-u0-project-setup-plan.md
- docs/final-screen-comparison-review-2026-06-29.md
- docs/unity-asset-import-map.md
- docs/unity-data-schema-map.md

作業前に確認すること:
- Unity Hubで利用可能なUnity 6 LTS patch
- unity/VampPonUnity/ 配置
- .gitignore / .gitattributes 方針
- U1ではLFSを新規有効化しない
- public/assets/sprites/ を使わない
- U1では全移植しない

作業範囲:
- unity/VampPonUnity/ を作る
- Boot.unity / Stage1.unity を作る
- Assets/_Project/ の最小フォルダを作る
- 390x844縦画面を前提にする
- SafeAreaCanvasを作る
- Yui placeholder、Ombu placeholder、dark paper background、lantern glow、EXP pickup curve placeholderを作る

守ること:
- Web/Phaser側srcはU1では原則変更しない
- public/assets/sprites/ はretiredなのでコピーしない
- Unity生成物の Library / Logs / UserSettings / .sln / .csproj をcommitしない
- 20キャラ、48敵、全ステージ、全UI、Save、Collection、AchievementはU1で作らない
- 生成参照画像をruntime UIにそのまま貼らない
- 文字入り画像をUI素材にしない
- Addressables、CI、store build、課金/広告はU1で入れない

U1完了条件:
- Unity Editorで再生できる
- Boot -> Stage1へ遷移できる
- Game View 390x844相当で破綻しない
- SafeAreaCanvasがある
- Yui placeholderが表示される
- Ombu placeholderが表示される
- lantern glowが表示される
- EXP fragmentがプレイヤーへ吸い込まれる
- git status --short に不要なUnity生成物が出ない

最後に報告すること:
1. 作成/変更ファイル
2. Unity Editor version
3. 再生確認結果
4. git status --short
5. U1未実装
6. 次のU2でやること
7. 移行前チェックリストで未解決の項目
```
