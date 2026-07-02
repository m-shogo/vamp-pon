namespace VampPon.UnitySpike.U31.MobileQa
{
    public sealed class U31QaScenarioResult
    {
        public U31QaScenarioResult(string id, string label, U31QaVerdict verdict, string evidence, string note)
        {
            Id = id;
            Label = label;
            Verdict = verdict;
            Evidence = evidence;
            Note = note;
        }

        public string Id { get; }
        public string Label { get; }
        public U31QaVerdict Verdict { get; }
        public string Evidence { get; }
        public string Note { get; }
    }
}
