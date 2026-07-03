namespace VampPon.UnitySpike.U40.FinalAssetReplacement
{
    public sealed class U40FinalAssetReplacementRegistry
    {
        public U40FinalAssetReadinessReport BuildReport()
        {
            var report = new U40FinalAssetReadinessReport
            {
                AssetReplacementReady = true,
                ProductionApproved = false,
                RcReady = false,
                MobileMetricsReady = false,
                SpriteAtlasPackingReady = true,
                FinalSeReady = true,
                AudioMixerReady = false,
            };

            Add(report, "player_sprites", U40FinalAssetCategory.Player, "Assets/_Project/Resources/U5Candidates/Battle/u5-yui-battle-candidate.png", "Assets/_Project/Art/Characters/Stage1/", U40FinalAssetStatus.FinalCandidate, true, "fallback to U5 readable character candidate", "Stage1 critical candidate; final approval later");
            Add(report, "enemy_sprites", U40FinalAssetCategory.Enemy, "Assets/_Project/Resources/U5Candidates/Battle/u5-ombu-battle-candidate.png", "Assets/_Project/Art/Enemies/Stage1/", U40FinalAssetStatus.FinalCandidate, true, "fallback to U5 readable enemy candidate", "Stage1 critical candidate; final approval later");
            Add(report, "weapon_projectile_sprites", U40FinalAssetCategory.WeaponProjectile, "Assets/_Project/Resources/U5Candidates/VFX/u5-lantern-spark.png", "Assets/_Project/Art/Projectiles/Stage1/", U40FinalAssetStatus.RuntimeApprovedDraft, true, "skip optional projectile flash", "readable draft remains safe");
            Add(report, "item_passive_icons", U40FinalAssetCategory.ItemIcon, "Assets/_Project/Resources/U5Candidates/UI/u5-icon-frame.png", "Assets/_Project/Art/Icons/Stage1/", U40FinalAssetStatus.RuntimeApprovedDraft, true, "fallback to readable icon frame", "economy approval later");
            Add(report, "pickup_sprites", U40FinalAssetCategory.Pickup, "Assets/_Project/Resources/U5Candidates/VFX/u5-exp-fragment.png", "Assets/_Project/Art/Pickups/Stage1/", U40FinalAssetStatus.FinalCandidate, true, "fallback to XP fragment", "safe final candidate");
            Add(report, "ui_paper_parts", U40FinalAssetCategory.UiPaper, "Assets/_Project/Resources/U8Refined/UI/result_new_badge_refined.png", "Assets/_Project/Art/UI/Paper/", U40FinalAssetStatus.FinalCandidate, true, "fallback to procedural paper UI", "paper/ink/lantern style retained");
            Add(report, "hud_parts", U40FinalAssetCategory.Hud, "Unity UI generated from runtime presenters", "Assets/_Project/Art/UI/HUD/", U40FinalAssetStatus.RuntimeApprovedDraft, true, "fallback to readable generated HUD", "device readability review remains");
            Add(report, "levelup_cards", U40FinalAssetCategory.LevelUp, "Unity UI generated from U23/U25 presenters", "Assets/_Project/Art/UI/LevelUp/", U40FinalAssetStatus.RuntimeApprovedDraft, true, "fallback to readable card UI", "card art final approval later");
            Add(report, "result_ledger_stamp_seal", U40FinalAssetCategory.Result, "Assets/_Project/Resources/U8Candidates/UI/result_rank_wax_seal.png", "Assets/_Project/Art/UI/Result/", U40FinalAssetStatus.FinalCandidate, true, "fallback to result proof UI", "reward economy approval later");
            Add(report, "stageselect_map_route_lantern", U40FinalAssetCategory.StageSelect, "Assets/_Project/Resources/U8Candidates/UI/stageselect_start_marker_lantern.png", "Assets/_Project/Art/UI/StageSelect/", U40FinalAssetStatus.FinalCandidate, true, "fallback to route proof UI", "Stage2 remains placeholder");
            Add(report, "kokuyou_rare_evolution_effects", U40FinalAssetCategory.ClimaxEffect, "Assets/_Project/Resources/U10Candidates/VFX/levelup_rare_memory_tear_burst.png", "Assets/_Project/Art/Effects/Climax/", U40FinalAssetStatus.FinalCandidate, true, "fallback to readable climax proof effect", "device performance review remains");
            Add(report, "sprite_atlas_u36", U40FinalAssetCategory.SpriteAtlas, "Assets/_Project/SpriteAtlases/U36/", "Assets/_Project/SpriteAtlases/U36/", U40FinalAssetStatus.ProductionCandidate, true, "fallback to direct sprites if atlas unavailable", "draw calls/batches mobile measurement later");
            Add(report, "u39_final_candidate_se", U40FinalAssetCategory.Audio, "Assets/_Project/Audio/U39FinalCandidateSe/", "Assets/_Project/Audio/ProductionSe/", U40FinalAssetStatus.FinalCandidate, true, "skip missing optional SE and continue gameplay", "final SE approval later");
            Add(report, "generated_screenshots", U40FinalAssetCategory.GeneratedEvidence, "generated QA evidence root", "none", U40FinalAssetStatus.BlockedFromRuntime, false, "never load", "blocked from runtime");
            Add(report, "public_prototypes", U40FinalAssetCategory.PrototypeReference, "public/assets/prototypes/", "none", U40FinalAssetStatus.GeneratedReferenceOnly, false, "never promote as final without finishing", "reference only");

            report.RemainingNeedsReview.Add("mobile device visual readability");
            report.RemainingNeedsReview.Add("U39 finalCandidate SE final approval");
            report.RemainingNeedsReview.Add("AudioMixer final asset");
            report.RemainingNeedsReview.Add("production balance and reward economy");
            report.RemainingBlockedFromRuntime.Add("generated QA evidence root");
            report.RemainingBlockedFromRuntime.Add("screenshots");
            report.RemainingBlockedFromRuntime.Add("public prototypes as final production source");
            return report;
        }

        private static void Add(U40FinalAssetReadinessReport report, string key, U40FinalAssetCategory category, string current, string future, U40FinalAssetStatus status, bool ready, string fallback, string notes)
        {
            report.Entries.Add(new U40FinalAssetReplacementEntry
            {
                AssetKey = key,
                Category = category,
                CurrentPath = current,
                FutureFinalPath = future,
                CurrentStatus = status,
                ReplacementReady = ready,
                FallbackPath = current,
                MissingAssetFallback = fallback,
                BlockedFromRuntime = status == U40FinalAssetStatus.BlockedFromRuntime || status == U40FinalAssetStatus.GeneratedReferenceOnly || status == U40FinalAssetStatus.DocsGeneratedOnly,
                GeneratedAssetForbidden = status == U40FinalAssetStatus.BlockedFromRuntime || status == U40FinalAssetStatus.GeneratedReferenceOnly,
                DocsGeneratedForbidden = current.Contains("generated QA evidence root"),
                FinalApprovalRequired = true,
                Notes = notes,
            });
        }
    }
}
