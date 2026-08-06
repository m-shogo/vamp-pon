using System.Linq;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    public static class LoadingTopPreRenderBlankGuard
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Install()
        {
            Canvas.willRenderCanvases -= GuardBeforeCanvasRender;
            Canvas.willRenderCanvases += GuardBeforeCanvasRender;
        }

        private static void GuardBeforeCanvasRender()
        {
            var top = Object.FindFirstObjectByType<TopLivingNightView>();
            if (top == null || !top.gameObject.activeInHierarchy)
                return;

            EnsureInitiallyHidden(top.transform, "TopLivingNightArt");
            EnsureInitiallyHidden(top.transform, "TopLivingNightSafeArea");

            foreach (var image in top.GetComponentsInChildren<RawImage>(true))
            {
                if (image.texture != null)
                    continue;

                var color = image.color;
                color.a = 0f;
                image.color = color;
            }
        }

        private static void EnsureInitiallyHidden(Transform root, string childName)
        {
            var child = root
                .GetComponentsInChildren<Transform>(true)
                .FirstOrDefault(value => value.name == childName);
            if (child == null || child.GetComponent<CanvasGroup>() != null)
                return;

            var group = child.gameObject.AddComponent<CanvasGroup>();
            group.alpha = 0f;
            group.blocksRaycasts = false;
            group.interactable = false;
        }
    }
}
