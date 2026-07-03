using System.IO;
using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U39.AudioReadiness
{
    public sealed class U39FinalCandidateClipLibrary
    {
        public const string FinalCandidateRoot = "Assets/_Project/Audio/U39FinalCandidateSe";
        private readonly string projectRoot;

        public U39FinalCandidateClipLibrary(string projectRoot)
        {
            this.projectRoot = projectRoot;
        }

        public string GetClipPath(U28AudioEventDefinition definition)
        {
            return $"unity/VampPonUnity/{FinalCandidateRoot}/{definition.ClipFileName}";
        }

        public bool Exists(U28AudioEventDefinition definition)
        {
            return File.Exists(Path.Combine(projectRoot, GetClipPath(definition)));
        }
    }
}
