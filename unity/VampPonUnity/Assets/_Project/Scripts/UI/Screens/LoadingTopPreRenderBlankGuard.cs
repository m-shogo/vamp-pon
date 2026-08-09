using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    public static class LoadingTopPreRenderBlankGuard
    {
        private static bool installed;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Install()
        {
            if (installed)
                return;

            Canvas.willRenderCanvases -= GuardBeforeCanvasRender;
            Canvas.willRenderCanvases += GuardBeforeCanvasRender;
            Application.quitting -= Uninstall;
            Application.quitting += Uninstall;
            installed = true;
        }

        private static void Uninstall()
        {
            Canvas.willRenderCanvases -= GuardBeforeCanvasRender;
            Application.quitting -= Uninstall;
            installed = false;
        }

        private static void GuardBeforeCanvasRender()
        {
            if (!Application.isPlaying || LoadingTopVisualPolishCoordinator.IsCurrentTopReady)
                return;

            var top = Object.FindFirstObjectByType<TopLivingNightView>();
            if (top == null || !top.gameObject.activeInHierarchy)
                return;

            // Never add/remove components or mutate the hierarchy from
            // Canvas.willRenderCanvases. The coordinator prepares CanvasGroups
            // during Update; this last-moment guard only suppresses null textures.
            foreach (var image in top.GetComponentsInChildren<RawImage>(true))
            {
                if (image.texture != null)
                    continue;

                var color = image.color;
                color.a = 0f;
                image.color = color;
            }
        }
    }
}
