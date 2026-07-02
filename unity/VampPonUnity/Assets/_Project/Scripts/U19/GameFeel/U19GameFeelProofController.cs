using UnityEngine;
using VampPon.UnitySpike.U15.Contracts;
using VampPon.UnitySpike.U16.Battle;
using VampPon.UnitySpike.U17.Loop;
using VampPon.UnitySpike.U18.Kokuyou;

namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19GameFeelProofController : MonoBehaviour
    {
        public U19GameFeelProofState State { get; } = new();
        public U19FeedbackHookProof Feedback { get; } = new();
        public U19DropProofController Drop { get; } = new();
        public U19LevelUpProofController LevelUp { get; } = new();
        public U19RarePresentationProof Rare { get; } = new();
        public U19EvolutionProofController Evolution { get; } = new();
        public U19ParticleBudgetProof ParticleBudget { get; } = new();
        public U19HitFlashProof HitFlash { get; } = new();

        public BattleResultSummary LastSummary { get; private set; }
        public string ResultFeelLabel { get; private set; } = "Game Feel proof";

        public void RunStage1FeelProof()
        {
            var loopObj = new GameObject("U19Stage1LoopBridge");
            var loop = loopObj.AddComponent<U17Stage1LoopProofController>();
            loop.StartAndResolveLoop(StageStartRequest.Sample);

            CollectExp(25);
            CollectExp(25);
            CollectExp(25);
            CollectExp(25);
            if (LevelUp.TryOpen(State, Feedback)) LevelUp.SelectCard(0, State, Feedback);

            new U19HealingDropProof().CollectManually(State, Feedback);
            Rare.Show(State, Feedback);
            Rare.Hide();
            if (Evolution.CheckReady(State))
            {
                Feedback.OnEvolutionReady();
                Evolution.Trigger(State, Feedback);
            }

            var kokuyouObj = new GameObject("U19KokuyouBridge");
            var kokuyou = kokuyouObj.AddComponent<KokuyouRuntimePrototypeController>();
            kokuyou.ProofFillGauge();
            Feedback.OnKokuyouReady();
            if (kokuyou.TryActivate())
            {
                State.KokuyouActive = true;
                State.LastFeelEvent = "Kokuyou";
                Feedback.OnKokuyouActivate();
            }
            kokuyou.Tick(5.1f);
            kokuyou.Tick(0.6f);
            State.KokuyouActive = false;
            Feedback.OnKokuyouEnd();

            LastSummary = loop.LastSummary;
            ResultFeelLabel = $"Feel: Lv{State.CurrentLevel} / Combo {State.ComboCount} / {State.LastFeelEvent}";
            DestroyImmediate(loopObj);
            DestroyImmediate(kokuyouObj);
        }

        public void CollectExp(int amount)
        {
            State.AddExp(amount);
            Feedback.OnExpCollect();
        }

        public float KokuyouExpMagnetStrength(float distance)
        {
            return U19ExpMagnetProof.MagnetStrength(distance, State.KokuyouActive);
        }
    }
}
