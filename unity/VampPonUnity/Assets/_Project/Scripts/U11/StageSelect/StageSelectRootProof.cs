using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.StageSelect
{
    public sealed class StageSelectRootProof : MonoBehaviour
    {
        public static StageSelectRootProof Create(Transform parent, StageSelectProofAssets assets, TMP_FontAsset font)
        {
            var root = new GameObject("StageSelectRootProof", typeof(RectTransform), typeof(StageSelectRootProof));
            root.transform.SetParent(parent, false);
            Stretch(root.GetComponent<RectTransform>());

            AddLabel(root.transform, "StageSelectTitle", "今夜の行き先", font, 22f, new Color32(238, 222, 190, 255), new Vector2(0f, 362f), new Vector2(300f, 40f));

            var map = StageMapPanelProof.Create(root.transform, assets.MapPanel);
            SetRect(map.GetComponent<RectTransform>(), new Vector2(0f, 62f), new Vector2(322f, 548f));

            StageRouteLineProof.Create(map.transform, assets.RouteLine, "RouteLineA", new Vector2(-46f, 56f), new Vector2(162f, 32f), -16f);
            StageRouteLineProof.Create(map.transform, assets.RouteLine, "RouteLineB", new Vector2(56f, -26f), new Vector2(160f, 30f), 18f);
            StageRouteLineProof.Create(map.transform, assets.RouteLine, "RouteLineC", new Vector2(-30f, -106f), new Vector2(154f, 28f), -10f);

            var pos = new[] { new Vector2(-112f, 96f), new Vector2(-28f, 34f), new Vector2(72f, -40f), new Vector2(-44f, -154f), new Vector2(104f, -212f) };
            for (var i = 0; i < pos.Length; i++)
            {
                var state = i < 3 ? StageRouteNodeProofState.Active : StageRouteNodeProofState.Locked;
                StageRouteNodeProof.Create(map.transform, assets.ActiveNode, assets.LockedNode, state, pos[i], font);
            }
            StageLanternMarkerProof.Create(map.transform, assets.LanternMarker, pos[0]);

            var info = StageInfoPanelProof.Create(root.transform, font);
            SetRect(info.GetComponent<RectTransform>(), new Vector2(0f, -286f), new Vector2(318f, 104f));
            var button = StageStartButtonProof.Create(info.transform, assets.StartButton, font);
            SetRect(button.GetComponent<RectTransform>(), new Vector2(108f, 0f), new Vector2(112f, 50f));
            return root.GetComponent<StageSelectRootProof>();
        }

        private static void AddLabel(Transform parent, string name, string text, TMP_FontAsset font, float size, Color color, Vector2 pos, Vector2 rectSize)
        {
            var label = PaperLabelProof.Create(parent, name, text, font, size, color);
            SetRect(label.GetComponent<RectTransform>(), pos, rectSize);
        }

        private static void SetRect(RectTransform rect, Vector2 pos, Vector2 size)
        {
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = pos;
            rect.sizeDelta = size;
        }

        private static void Stretch(RectTransform rect)
        {
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }
    }

    public readonly struct StageSelectProofAssets
    {
        public StageSelectProofAssets(Sprite mapPanel, Sprite routeLine, Sprite lanternMarker, Sprite activeNode, Sprite lockedNode, Sprite startButton)
        {
            MapPanel = mapPanel;
            RouteLine = routeLine;
            LanternMarker = lanternMarker;
            ActiveNode = activeNode;
            LockedNode = lockedNode;
            StartButton = startButton;
        }

        public Sprite MapPanel { get; }
        public Sprite RouteLine { get; }
        public Sprite LanternMarker { get; }
        public Sprite ActiveNode { get; }
        public Sprite LockedNode { get; }
        public Sprite StartButton { get; }
    }
}
