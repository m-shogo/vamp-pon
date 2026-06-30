using UnityEngine;

namespace VampPon.UnitySpike.U5
{
    public static class U5VisualAssetLibrary
    {
        private const string Root = "U5Candidates/";

        public static Sprite LoadBattleSprite(string name)
        {
            return LoadSprite("Battle/" + name);
        }

        public static Sprite LoadVfxSprite(string name)
        {
            return LoadSprite("VFX/" + name);
        }

        public static Sprite LoadUiSprite(string name)
        {
            return LoadSprite("UI/" + name);
        }

        private static Sprite LoadSprite(string path)
        {
            return Resources.Load<Sprite>(Root + path);
        }
    }
}
