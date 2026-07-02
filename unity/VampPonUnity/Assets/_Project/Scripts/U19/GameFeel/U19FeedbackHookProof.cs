using System.Collections.Generic;
using UnityEngine;

namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19FeedbackHookProof
    {
        private readonly List<string> events = new();

        public IReadOnlyList<string> Events => events;

        public void Log(string eventName)
        {
            if (string.IsNullOrWhiteSpace(eventName)) return;
            events.Add(eventName);
            Debug.Log($"U19 feedback hook: {eventName}");
        }

        public void OnExpCollect() => Log("OnExpCollect");
        public void OnLevelUpOpen() => Log("OnLevelUpOpen");
        public void OnLevelUpSelect() => Log("OnLevelUpSelect");
        public void OnRareAppear() => Log("OnRareAppear");
        public void OnEvolutionReady() => Log("OnEvolutionReady");
        public void OnEvolutionTrigger() => Log("OnEvolutionTrigger");
        public void OnKokuyouReady() => Log("OnKokuyouReady");
        public void OnKokuyouActivate() => Log("OnKokuyouActivate");
        public void OnKokuyouEnd() => Log("OnKokuyouEnd");
        public void OnHealingDropCollect() => Log("OnHealingDropCollect");
    }
}
