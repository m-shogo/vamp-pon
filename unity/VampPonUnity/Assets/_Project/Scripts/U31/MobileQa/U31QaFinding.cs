namespace VampPon.UnitySpike.U31.MobileQa
{
    public sealed class U31QaFinding
    {
        public U31QaFinding(string id, U31QaFindingSeverity severity, string area, string description)
        {
            Id = id;
            Severity = severity;
            Area = area;
            Description = description;
        }

        public string Id { get; }
        public U31QaFindingSeverity Severity { get; }
        public string Area { get; }
        public string Description { get; }
    }
}
