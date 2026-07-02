namespace VampPon.UnitySpike.U31.MobileQa
{
    public sealed class U31QaTuningAction
    {
        public U31QaTuningAction(string id, string area, string before, string after, string reason)
        {
            Id = id;
            Area = area;
            Before = before;
            After = after;
            Reason = reason;
        }

        public string Id { get; }
        public string Area { get; }
        public string Before { get; }
        public string After { get; }
        public string Reason { get; }
    }
}
