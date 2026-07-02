using System.Collections.Generic;

namespace VampPon.UnitySpike.U32.AssetReplacement
{
    public sealed class U32RuntimeAssetReplacementRegistry
    {
        public U32RuntimeAssetBoundaryReport BuildReport()
        {
            return new U32RuntimeAssetBoundaryReport
            {
                ProductionApproved = false,
                AssetReplacementReady = false,
                BoundaryStatus = U32AssetBoundaryStatus.Caution,
                SpriteAtlasProductionPackingComplete = false,
                Inventory = BuildInventory(),
                ReplacementEntries = BuildReplacementEntries(),
            };
        }

        public IReadOnlyList<U32AssetInventoryEntry> BuildInventory()
        {
            return new[]
            {
                Entry(U32RuntimeAssetKey.PlayerSprites, "public/assets/prototypes/sprite-sheets/core5-original-frames/", "reference baseline for player sprites", false, U32RuntimeAssetStatus.RuntimePrototype, "prototype quality and web-origin source", "replace with Unity-finished production sprites"),
                Entry(U32RuntimeAssetKey.EnemySprites, "public/assets/prototypes/sprite-sheets/enemies-original/", "reference baseline for enemies", false, U32RuntimeAssetStatus.RuntimePrototype, "readability needs Unity QA", "replace or finish for Unity runtime"),
                Entry(U32RuntimeAssetKey.WeaponProjectileSprites, "public/assets/prototypes/sprite-sheets/weapon/", "reference icons/projectile candidates", false, U32RuntimeAssetStatus.ProductionCandidate, "needs import and scale review", "register through replacement hook"),
                Entry(U32RuntimeAssetKey.ItemPassiveIcons, "public/assets/prototypes/sprite-sheets/passive/; public/assets/prototypes/sprite-sheets/rare/", "reference icons", false, U32RuntimeAssetStatus.ProductionCandidate, "icon consistency not final", "review with UI cards"),
                Entry(U32RuntimeAssetKey.PickupSprites, "Unity procedural/draft proof sprites", "runtime proof visuals", true, U32RuntimeAssetStatus.RuntimeApprovedDraft, "not final art", "replace through key while keeping fallback"),
                Entry(U32RuntimeAssetKey.UiPaperParts, "unity/VampPonUnity/Assets/_Project/Resources/U8Refined/UI/", "paper UI candidates", true, U32RuntimeAssetStatus.NeedsReview, "candidate resources still need final review", "atlas only after review"),
                Entry(U32RuntimeAssetKey.HudParts, "Unity UI generated from runtime presenters", "runtime HUD shapes/text", true, U32RuntimeAssetStatus.RuntimeApprovedDraft, "visual proof not final art", "keep readable and replace parts gradually"),
                Entry(U32RuntimeAssetKey.LevelUpCards, "Unity UI generated from U23/U25 presenters", "LevelUp proof UI", true, U32RuntimeAssetStatus.RuntimeApprovedDraft, "card art and icons not final", "replace card assets by key"),
                Entry(U32RuntimeAssetKey.ResultLedgerStampSeal, "Unity UI generated from U23/U27 presenters", "result ledger/reward proof", true, U32RuntimeAssetStatus.RuntimeApprovedDraft, "economy and stamp polish not final", "review after U33 balance"),
                Entry(U32RuntimeAssetKey.StageSelectMapRouteLantern, "Unity UI generated from U23/U27 presenters", "StageSelect progress proof", true, U32RuntimeAssetStatus.RuntimeApprovedDraft, "map art not final", "replace route/lantern art by key"),
                Entry(U32RuntimeAssetKey.KokuyouRareEvolutionEffects, "Unity proof effects and U24/U25 screenshots", "climax proof only", true, U32RuntimeAssetStatus.NeedsReplacement, "final cut-in/effect art pending", "replace with Unity-finished effects"),
                Entry(U32RuntimeAssetKey.DraftSe, "unity/VampPonUnity/Assets/_Project/Audio/U28DraftSe/", "draft SE routing", true, U32RuntimeAssetStatus.NeedsReview, "draft-placeholder-not-final", "replace with final SE later"),
                Entry(U32RuntimeAssetKey.HapticDefinitions, "unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/", "haptic routing definitions", true, U32RuntimeAssetStatus.RuntimeApprovedDraft, "device behavior not measured", "verify on device"),
                Entry(U32RuntimeAssetKey.GeneratedDocsEvidence, "generated QA evidence root", "QA evidence only", false, U32RuntimeAssetStatus.BlockedFromRuntime, "must never be runtime referenced", "keep checker blocking runtime references"),
            };
        }

        public IReadOnlyList<U32RuntimeAssetReplacementEntry> BuildReplacementEntries()
        {
            return new[]
            {
                Replacement(U32RuntimeAssetKey.PlayerSprites, "prototype/core5-original-frames", "Assets/_Project/Art/Characters/Stage1/", U32RuntimeAssetStatus.NeedsReplacement, "keep current draft proof until production sprites exist"),
                Replacement(U32RuntimeAssetKey.EnemySprites, "prototype/enemies-original", "Assets/_Project/Art/Enemies/Stage1/", U32RuntimeAssetStatus.NeedsReplacement, "fallback to draft proof enemies"),
                Replacement(U32RuntimeAssetKey.ItemPassiveIcons, "prototype/weapon-passive-rare", "Assets/_Project/Art/Icons/Stage1/", U32RuntimeAssetStatus.NeedsReview, "fallback to readable draft icon"),
                Replacement(U32RuntimeAssetKey.UiPaperParts, "Resources/U8Refined/UI", "Assets/_Project/Art/UI/Paper/", U32RuntimeAssetStatus.NeedsReview, "fallback to procedural paper UI"),
                Replacement(U32RuntimeAssetKey.KokuyouRareEvolutionEffects, "U24/U25 proof effects", "Assets/_Project/Art/Effects/Climax/", U32RuntimeAssetStatus.NeedsReplacement, "fallback to readable climax proof effect"),
                Replacement(U32RuntimeAssetKey.DraftSe, "Assets/_Project/Audio/U28DraftSe", "Assets/_Project/Audio/ProductionSe/", U32RuntimeAssetStatus.FinalApprovedLater, "skip missing SE and keep gameplay running"),
            };
        }

        private static U32AssetInventoryEntry Entry(U32RuntimeAssetKey key, string path, string usage, bool runtimeReferenced, U32RuntimeAssetStatus status, string risk, string nextAction)
        {
            return new U32AssetInventoryEntry(key, path, usage, runtimeReferenced, status, risk, nextAction);
        }

        private static U32RuntimeAssetReplacementEntry Replacement(U32RuntimeAssetKey key, string current, string future, U32RuntimeAssetStatus status, string fallback)
        {
            return new U32RuntimeAssetReplacementEntry(key, current, future, status, fallback, true, "production approval remains false until mobile metrics and final assets are verified");
        }
    }
}
