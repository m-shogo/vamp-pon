namespace VampPon.UnitySpike.U34.ReleaseCandidate
{
    public sealed class U34ReleaseCandidateReadinessFactory
    {
        public U34ReleaseCandidateReadiness Create()
        {
            var model = new U34ReleaseCandidateReadiness
            {
                RcReady = false,
                ProductionApproved = false,
                InternalPreviewReady = true,
                MobileQaReady = true,
                MobileMetricsReady = false,
                AssetReplacementReady = false,
                BalanceHardeningReady = true,
                SpriteAtlasPackingReady = true,
                Verdict = U34RcVerdict.NotReady,
            };

            AddItem(model, "runtime-loop", "Runtime loop", U34RcStatus.Pass, "U25 runtime loop evidence", "U25");
            AddItem(model, "battle-feel", "Battle feel", U34RcStatus.Caution, "Editor proof only", "U37");
            AddItem(model, "first-30", "First 30 seconds", U34RcStatus.Caution, "U33 hardening", "U37");
            AddItem(model, "timeline", "8min timeline", U34RcStatus.Caution, "U33 timeline", "U37");
            AddItem(model, "xp-levelup", "XP / LevelUp cadence", U34RcStatus.Caution, "U33 cadence", "U37");
            AddItem(model, "enemy-wave", "Enemy wave / damage", U34RcStatus.Caution, "U33 wave review", "U37");
            AddItem(model, "drop-pickup-heal", "Drop / pickup / heal", U34RcStatus.Caution, "U33 pickup review", "U37");
            AddItem(model, "weapon-passive-evolution", "Weapon / passive / evolution", U34RcStatus.Caution, "U33 evolution review", "U40");
            AddItem(model, "kokuyou-rare", "Kokuyou / Rare", U34RcStatus.Caution, "U33 reachability", "U37");
            AddItem(model, "result-reward-unlock", "Result / Reward / Unlock", U34RcStatus.Blocked, "Reward economy draft", "U41");
            AddItem(model, "stageselect-retry", "StageSelect / Retry", U34RcStatus.Caution, "U27/U31 evidence", "U37");
            AddItem(model, "save-safety", "Save safety", U34RcStatus.NotMeasured, "Restart persistence device check missing", "U37");
            AddItem(model, "audio-haptic", "Audio / haptic", U34RcStatus.Blocked, "final SE and device haptic missing", "U39");
            AddItem(model, "sprite-atlas-texture", "Sprite Atlas / texture", U34RcStatus.Pass, "U36 atlas packing complete", "U38");
            AddItem(model, "runtime-asset-boundary", "Runtime asset boundary", U34RcStatus.Pass, "U32/U36 boundary checks", "U38");
            AddItem(model, "readability-390x844", "390x844 readability", U34RcStatus.Caution, "Editor evidence only", "U37");
            AddItem(model, "mobile-metrics", "Mobile metrics", U34RcStatus.NotMeasured, "U35 mobileMetricsReady=false", "U37");
            AddItem(model, "performance-budget", "Performance budget", U34RcStatus.NotMeasured, "Device FPS/memory not measured", "U37");
            AddItem(model, "production-assets", "Production asset replacement", U34RcStatus.Blocked, "assetReplacementReady=false", "U40");
            AddItem(model, "regression", "Regression verification", U34RcStatus.Pass, "U22-U36 checkers", "U38");
            AddItem(model, "release-notes", "Release notes / known issues", U34RcStatus.Blocked, "known issues pass pending", "U42");

            model.Blockers.Add(new U34RcBlocker { Id = "rc-block-mobile-metrics", Reason = "mobile FPS / memory / thermal / GC / draw call are NOT_MEASURED", Evidence = "U35 verdict", UnblockCondition = "device metrics collected", TargetPhase = "U37", RiskIfIgnored = "RC may fail on device" });
            model.Blockers.Add(new U34RcBlocker { Id = "rc-block-asset-replacement", Reason = "assetReplacementReady=false", Evidence = "U36 re-evaluation", UnblockCondition = "final production assets approved", TargetPhase = "U40", RiskIfIgnored = "candidate art ships as final" });
            model.Blockers.Add(new U34RcBlocker { Id = "rc-block-final-se", Reason = "final SE / AudioMixer未確定", Evidence = "U28 draft SE", UnblockCondition = "final audio pass complete", TargetPhase = "U39", RiskIfIgnored = "audio feel and clipping risk" });
            model.Blockers.Add(new U34RcBlocker { Id = "rc-block-balance", Reason = "本番balance未確定", Evidence = "U33 hardening only", UnblockCondition = "device-informed final tuning", TargetPhase = "U37", RiskIfIgnored = "clear rate and pacing risk" });
            model.Blockers.Add(new U34RcBlocker { Id = "rc-block-economy", Reason = "reward economy / unlock economy draft", Evidence = "U27/U33", UnblockCondition = "economy hardening", TargetPhase = "U41", RiskIfIgnored = "progression reward risk" });

            model.Cautions.Add(new U34RcCaution { Id = "rc-caution-atlas", Risk = "Sprite Atlas packed but device performance unconfirmed", CurrentMitigation = "U36 atlas evidence", NextAction = "measure draw calls / batches", TargetPhase = "U37" });
            model.Cautions.Add(new U34RcCaution { Id = "rc-caution-cloud-save", Risk = "Cloud Save未導入", CurrentMitigation = "local save proof", NextAction = "decide product requirement", TargetPhase = "U38" });
            model.Cautions.Add(new U34RcCaution { Id = "rc-caution-stage2", Risk = "Stage2 placeholder unlock", CurrentMitigation = "placeholder clearly documented", NextAction = "known issues pass", TargetPhase = "U42" });

            model.NextActions.Add(new U34RcNextAction { ActionId = "u37", Title = "final mobile tuning after device metrics", TargetPhase = "U37", Reason = "mobileMetricsReady=false", AddressedItem = "mobile metrics", ExpectedOutcome = "device-informed tuning", Risk = "device availability", Priority = "P0" });
            model.NextActions.Add(new U34RcNextAction { ActionId = "u38", Title = "production approval re-check", TargetPhase = "U38", Reason = "productionApproved=false", AddressedItem = "approval gate", ExpectedOutcome = "updated gate result", Risk = "blockers remain", Priority = "P0" });
            model.NextActions.Add(new U34RcNextAction { ActionId = "u39", Title = "final SE / AudioMixer pass", TargetPhase = "U39", Reason = "final SE未確定", AddressedItem = "audio", ExpectedOutcome = "audio approval candidate", Risk = "latency/clipping", Priority = "P0" });
            model.NextActions.Add(new U34RcNextAction { ActionId = "u40", Title = "final production asset replacement pass", TargetPhase = "U40", Reason = "assetReplacementReady=false", AddressedItem = "assets", ExpectedOutcome = "assetReplacementReady re-check", Risk = "visual regressions", Priority = "P0" });
            model.NextActions.Add(new U34RcNextAction { ActionId = "u41", Title = "economy / reward hardening", TargetPhase = "U41", Reason = "economy draft", AddressedItem = "reward economy", ExpectedOutcome = "economy approval candidate", Risk = "progression imbalance", Priority = "P1" });
            return model;
        }

        private static void AddItem(U34ReleaseCandidateReadiness model, string id, string title, U34RcStatus status, string evidence, string phase)
        {
            model.ChecklistItems.Add(new U34RcChecklistItem
            {
                Id = id,
                Title = title,
                PassCriteria = "RC criteria satisfied without unresolved blocker",
                CurrentStatus = status.ToString(),
                Evidence = evidence,
                Status = status,
                OwnerFuturePhase = phase,
                NextAction = status == U34RcStatus.Pass ? "monitor regression" : $"continue in {phase}",
            });
        }
    }
}
