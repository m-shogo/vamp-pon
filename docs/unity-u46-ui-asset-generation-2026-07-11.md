# U46 UI Asset Generation

Result/灯録専用部品を、完成画面ではなく文字なしcomponent atlasとして同一promptから4候補生成した。Golden ReferenceはResult/Collection final referenceと既存non-battle UI kitである。

Candidate 2は部品分離、locked/unlocked、tab、progress、bottom navigationの一貫性が最も高いため採用した。chroma key greenをalphaへ変換し、`scripts/assets/build-u46-ui-components.py`で22部品へdeterministicに切り出した。

保存先は`Assets/_Project/Resources/U46Candidates/UI/{Result,Collection,Common}`。Texture Type Sprite、mipmap OFF、Clamp、alpha transparency、Compression None、主要panel/card/buttonへ16px Sprite Borderを設定した。

Lineageは`docs/design-targets/generated/unity-u46/ui-generation/lineage.json`。ApprovalLevelはCandidate、`approvedAsFinal=false`、`runtimeApproved=false`。候補部品には文字・ロゴ・透かし・完成画面を含めない。
