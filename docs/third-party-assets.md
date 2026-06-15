# Third Party Assets

この文書は Vamp Pon に取り込む外部素材の台帳。

現時点では、外部素材はまだ採用していない。
この文書と `data/asset-licenses.json` を更新せずに、外部素材をrepoへ追加しないこと。

---

## Policy

Default: **CC0 only**.

CC0以外の素材は、明示承認がある場合のみ使う。

- CC0: allowed
- Public domain equivalent: allowed if source page clearly states it
- CC-BY: not allowed by default
- CC-BY-SA: not allowed by default
- GPL / LGPL: not allowed by default for art assets
- Custom license: not allowed by default
- Non-commercial: not allowed
- No-derivatives: not allowed
- Unknown license: not allowed

---

## Asset table

| asset_id | source | author | license | source_url | vendor_path | derived_files | used_for | status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| _none yet_ |  |  |  |  |  |  |  |  |

---

## Required fields

Every third-party asset must record:

- asset_id
- source_name
- source_url
- author
- license
- downloaded_at
- original_files
- vendor_path
- derived_files
- used_for
- notes

---

## Status values

| status | meaning |
| --- | --- |
| `raw` | downloaded but not adapted |
| `derived` | recolored or edited for Vamp Pon |
| `temporary` | usable for mock only |
| `candidate` | may become final after review |
| `final-candidate` | passed Aseprite hand-finish and quality gate |
| `rejected` | not used |

---

## Notes

CC0素材でも、source URL と license 記録は必須。
あとで公開・差し替え・削除判断をしやすくするため。
