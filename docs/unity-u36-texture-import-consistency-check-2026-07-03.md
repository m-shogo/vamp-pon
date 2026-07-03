# Unity U36 Texture / Import Consistency Check

## Result

No broad import setting changes were applied. U36 created Sprite Atlas assets and atlas packing settings only, avoiding mass texture importer churn.

## Group Policy

- character / enemy sprites: Sprite texture, alpha preserved, no mipmaps, filter policy remains reviewed per asset.
- UI paper parts: alpha preserved, no mipmaps, readable flag off in atlas texture settings.
- icons: no mipmaps, alpha preserved, check at LevelUp / reward sizes.
- effect sprites: no mipmaps, alpha preserved, keep separate from UI paper atlas.
- max texture size: atlas default target 2048; platform compression not finalized.
- readable flag: atlas texture setting readable=false.
- compression: automatic/default, not final platform compression.

## 390x844

U36 evidence screenshots remain Editor evidence. They do not prove mobile performance or final visual quality. No runtime UI was changed, so current 390x844 layout should not shift.

## Caution

本番platform compression確定扱いにしない。大量import変更は行っていない。
