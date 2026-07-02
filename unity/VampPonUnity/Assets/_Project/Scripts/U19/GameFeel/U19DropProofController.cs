namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19DropProofController
    {
        public U19DropProofItem ExpFragment { get; } = new(U19DropProofType.ExpFragment, true);
        public U19DropProofItem HealingHeart { get; } = new(U19DropProofType.Heart, false);
        public U19DropProofItem MemoryShard { get; } = new(U19DropProofType.MemoryShard, true);
        public U19DropProofItem RareSpark { get; } = new(U19DropProofType.RareSpark, true);

        public bool IsMagnetTarget(U19DropProofItem item)
        {
            return item.MagnetTarget;
        }
    }
}
