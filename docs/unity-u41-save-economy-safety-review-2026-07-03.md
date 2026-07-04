# Unity U41 Save / Economy Safety Review

U41はU27 repository境界を守る。Cloud Saveは導入しない。PlayerPrefs直書きも増やさない。

確認結果:

- first clear bonus二重取り防止: beforeProgress.IsClearedでguard。
- attempts加算: U27 repositoryのUpdateAfterRun境界を維持。
- clears加算: clear時のみ加算。
- best値更新: time / level / kill / collectedを保存。
- lastResult保存: U27 modelを維持。
- unlockedRewardIds: duplicate guardで二重表示を抑制。
- unlockedKnowledgeIds: knowledge placeholderもduplicate対象。
- corrupted data fallback: U27 repository fallbackを維持。
- reset debug safety: Editor verification / proof用途に限定。

U41は正式save migration、暗号化、account連携、Cloud Saveを扱わない。経済確定扱いもしない。

Generated JSON: `docs/design-targets/generated/unity-u41/save-economy-safety-report.json`
