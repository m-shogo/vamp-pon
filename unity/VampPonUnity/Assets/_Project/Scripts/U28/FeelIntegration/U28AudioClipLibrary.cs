using System.IO;

namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28AudioClipLibrary
    {
        private readonly string projectRoot;

        public U28AudioClipLibrary(string projectRoot)
        {
            this.projectRoot = projectRoot;
        }

        public string GetClipPath(U28AudioEventDefinition definition)
        {
            return $"unity/VampPonUnity/{U28AudioEventRegistry.DraftSeRoot}/{definition.ClipFileName}";
        }

        public bool Exists(U28AudioEventDefinition definition)
        {
            return File.Exists(Path.Combine(projectRoot, GetClipPath(definition)));
        }
    }
}
