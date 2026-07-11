using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.Runtime.Visuals;

namespace VampPon.UnitySpike.UI
{
    public sealed class U46ResultUiAssetSet
    {
        public Sprite MemoryPage { get; set; }
        public Sprite RankSeal { get; set; }
        public Sprite StatChip { get; set; }
        public Sprite RewardCard { get; set; }
        public Sprite NewRecordRow { get; set; }
        public Sprite Divider { get; set; }
        public Sprite PrimaryButton { get; set; }
        public Sprite SecondaryButton { get; set; }
    }

    public sealed class U46CollectionUiAssetSet
    {
        public Sprite Page { get; set; }
        public Sprite TabActive { get; set; }
        public Sprite TabInactive { get; set; }
        public Sprite EntryCard { get; set; }
        public Sprite EntryLocked { get; set; }
        public Sprite PaperClip { get; set; }
        public Sprite ProgressTrack { get; set; }
        public Sprite ProgressFill { get; set; }
        public Sprite NewBadge { get; set; }
        public Sprite BottomNav { get; set; }
    }

    public sealed class U46CommonUiAssetSet
    {
        public Sprite PaperShadow { get; set; }
        public Sprite WarmLanternAccent { get; set; }
        public Sprite InkCorner { get; set; }
        public Sprite PageEdge { get; set; }
    }

    public sealed class U46UiAssetCatalog
    {
        private const string Root = "U46Candidates/UI/";

        public AssetApprovalLevel ApprovalLevel => AssetApprovalLevel.Candidate;
        public bool ApprovedAsFinal => false;
        public bool RuntimeApproved => false;
        public U46ResultUiAssetSet Result { get; }
        public U46CollectionUiAssetSet Collection { get; }
        public U46CommonUiAssetSet Common { get; }

        public U46UiAssetCatalog()
        {
            Result = new U46ResultUiAssetSet
            {
                MemoryPage = Load("Result/u46-result-memory-page"), RankSeal = Load("Result/u46-result-rank-seal"),
                StatChip = Load("Result/u46-result-stat-chip"), RewardCard = Load("Result/u46-result-reward-card"),
                NewRecordRow = Load("Result/u46-result-new-record-row"), Divider = Load("Result/u46-result-divider"),
                PrimaryButton = Load("Result/u46-result-primary-button"), SecondaryButton = Load("Result/u46-result-secondary-button"),
            };
            Collection = new U46CollectionUiAssetSet
            {
                Page = Load("Collection/u46-collection-page"), TabActive = Load("Collection/u46-collection-tab-active"),
                TabInactive = Load("Collection/u46-collection-tab-inactive"), EntryCard = Load("Collection/u46-collection-entry-card"),
                EntryLocked = Load("Collection/u46-collection-entry-locked"), PaperClip = Load("Collection/u46-collection-paper-clip"),
                ProgressTrack = Load("Collection/u46-collection-progress-track"), ProgressFill = Load("Collection/u46-collection-progress-fill"),
                NewBadge = Load("Collection/u46-collection-new-badge"), BottomNav = Load("Collection/u46-collection-bottom-nav"),
            };
            Common = new U46CommonUiAssetSet
            {
                PaperShadow = Load("Common/u46-paper-shadow"), WarmLanternAccent = Load("Common/u46-warm-lantern-accent"),
                InkCorner = Load("Common/u46-ink-corner"), PageEdge = Load("Common/u46-page-edge"),
            };
        }

        private static Sprite Load(string path) => Resources.Load<Sprite>(Root + path);
    }
}
