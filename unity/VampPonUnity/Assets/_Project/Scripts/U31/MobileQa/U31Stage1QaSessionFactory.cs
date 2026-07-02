using System.Collections.Generic;

namespace VampPon.UnitySpike.U31.MobileQa
{
    public sealed class U31Stage1QaSessionFactory
    {
        public U31QaSessionModel CreateEditorSession()
        {
            return new U31QaSessionModel
            {
                ProductionApproved = false,
                QaScenarioResults = CreateScenarios(),
                Findings = CreateFindings(),
                TuningActions = CreateTuningActions(),
            };
        }

        public IReadOnlyList<U31QaScenarioResult> CreateScenarios()
        {
            return new[]
            {
                Scenario("stage-start", "StageSelectからStage1開始", U31QaVerdict.Pass, "01-stageselect-before-run-qa.png", "Editor flow evidence only."),
                Scenario("first-30", "first 30 seconds", U31QaVerdict.Caution, "03-first-30-seconds-qa.png", "Opening density lightly tuned; mobile feel unmeasured."),
                Scenario("first-levelup", "first LevelUp", U31QaVerdict.Pass, "04-first-levelup-qa.png", "U26 first LevelUp target remains 30 seconds."),
                Scenario("weapon-passive", "weapon / passive選択", U31QaVerdict.Pass, "04-first-levelup-qa.png", "Choice count remains 3."),
                Scenario("xp-pickup", "XP pickup feel", U31QaVerdict.Caution, "03-first-30-seconds-qa.png", "Pickup radius lightly widened; device touch feel unmeasured."),
                Scenario("heal-pickup", "heal pickup feel", U31QaVerdict.Caution, "03-first-30-seconds-qa.png", "Recovery drop remains draft."),
                Scenario("enemy-hit-defeat", "enemy hit / defeat feel", U31QaVerdict.Caution, "05-mid-wave-qa.png", "Basic weapon cooldown lightly reduced."),
                Scenario("player-damage", "player damage", U31QaVerdict.Caution, "05-mid-wave-qa.png", "Opening safety unchanged."),
                Scenario("rare", "rare pickup or rare candidate", U31QaVerdict.Caution, "06-rare-qa.png", "Rare remains draft candidate proof."),
                Scenario("evolution", "evolution condition /演出", U31QaVerdict.Caution, "07-evolution-qa.png", "Evolution reachability proof, final art pending."),
                Scenario("kokuyou", "Kokuyou ready / active / ending", U31QaVerdict.Caution, "08-kokuyou-qa.png", "Timing unchanged; device feel unmeasured."),
                Scenario("clear-flow", "clear flow", U31QaVerdict.Pass, "09-result-clear-qa.png", "Result transition proof exists."),
                Scenario("defeat-flow", "defeat flow", U31QaVerdict.Caution, "09-result-clear-qa.png", "Participation reward remains draft."),
                Scenario("reward-unlock", "Result reward / unlock", U31QaVerdict.Caution, "10-result-reward-unlock-qa.png", "Economy not final."),
                Scenario("stage-progress", "StageSelect progress reflection", U31QaVerdict.Pass, "11-stageselect-after-clear-qa.png", "Progress reflection proof exists."),
                Scenario("retry", "Retry", U31QaVerdict.Pass, "12-retry-qa.png", "Retry proof exists."),
                Scenario("save-persistence", "save persistence after restart", U31QaVerdict.NotMeasured, "stage1-qa-session-editor.json", "Restart persistence requires device or PlayMode session follow-up."),
                Scenario("audio-repeat", "audio連打確認", U31QaVerdict.Caution, "stage1-measurement-summary.json", "Cooldown and cap proof only; final clips not approved."),
                Scenario("haptic-event", "haptic event確認", U31QaVerdict.NotMeasured, "stage1-not-measured-list.json", "Editor haptic is no-op; device vibration not measured."),
                Scenario("readability", "390x844 readability", U31QaVerdict.Pass, "screenshots", "Editor 390x844 screenshots generated."),
            };
        }

        public IReadOnlyList<U31QaFinding> CreateFindings()
        {
            return new[]
            {
                new U31QaFinding("u31-finding-mobile-metrics", U31QaFindingSeverity.NotMeasured, "performance", "Mobile FPS, memory, thermal, GC, and draw calls are not measured."),
                new U31QaFinding("u31-finding-haptic-device", U31QaFindingSeverity.NotMeasured, "haptic", "Device haptic intensity and fallback behavior are not measured."),
                new U31QaFinding("u31-finding-save-restart", U31QaFindingSeverity.NotMeasured, "save", "Restart persistence is not measured in Editor batchmode."),
                new U31QaFinding("u31-finding-sprite-atlas", U31QaFindingSeverity.Blocker, "assets", "Production Sprite Atlas packing evidence remains incomplete."),
                new U31QaFinding("u31-finding-economy", U31QaFindingSeverity.Caution, "reward", "Reward and unlock economy remains draft."),
                new U31QaFinding("u31-finding-final-se", U31QaFindingSeverity.Caution, "audio", "SE routing is QA proof only; final SE is not approved."),
            };
        }

        public IReadOnlyList<U31QaTuningAction> CreateTuningActions()
        {
            return new[]
            {
                new U31QaTuningAction("u31-tune-pickup-radius", "pickup", "PickupRadius 1.65", "PickupRadius 1.75", "Make opening pickup route easier to read at 390x844."),
                new U31QaTuningAction("u31-tune-basic-cooldown", "weapon", "BasicWeaponCooldownMs 950", "BasicWeaponCooldownMs 900", "Make early hit feedback less sparse without changing damage."),
                new U31QaTuningAction("u31-tune-opening-wave", "enemy wave", "opening interval 2.8 / max 6", "opening interval 2.6 / max 7", "Reduce empty opening moments while keeping safety."),
                new U31QaTuningAction("u31-tune-first-pressure", "enemy wave", "first pressure interval 2.2 / max 11", "first pressure interval 2.1 / max 12", "Make first LevelUp approach feel more active."),
            };
        }

        private static U31QaScenarioResult Scenario(string id, string label, U31QaVerdict verdict, string evidence, string note)
        {
            return new U31QaScenarioResult(id, label, verdict, evidence, note);
        }
    }
}
