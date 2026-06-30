using System.Collections;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using VampPon.UnitySpike.UI;

namespace VampPon.UnitySpike.Core
{
    public sealed class U1BootSceneBootstrap : MonoBehaviour
    {
        [SerializeField] private float transitionDelaySeconds = 0.35f;

        private IEnumerator Start()
        {
            Application.targetFrameRate = 60;
            CreateBootCamera();
            CreateBootCanvas();
            yield return new WaitForSeconds(transitionDelaySeconds);
            SceneManager.LoadScene("Stage1");
        }

        private static void CreateBootCamera()
        {
            var cameraObject = new GameObject("MainCamera");
            var camera = cameraObject.AddComponent<Camera>();
            camera.orthographic = true;
            camera.orthographicSize = 5f;
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.035f, 0.029f, 0.026f);
            cameraObject.tag = "MainCamera";
        }

        private static void CreateBootCanvas()
        {
            var canvasObject = new GameObject("SafeAreaCanvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster), typeof(SafeAreaFitter));
            var canvas = canvasObject.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;

            var scaler = canvasObject.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(390f, 844f);
            scaler.matchWidthOrHeight = 0.5f;

            var labelObject = new GameObject("BootLabel", typeof(TextMeshProUGUI));
            labelObject.transform.SetParent(canvasObject.transform, false);
            var labelTransform = labelObject.GetComponent<RectTransform>();
            labelTransform.anchorMin = new Vector2(0f, 0.45f);
            labelTransform.anchorMax = new Vector2(1f, 0.55f);
            labelTransform.offsetMin = new Vector2(24f, 0f);
            labelTransform.offsetMax = new Vector2(-24f, 0f);

            var label = labelObject.GetComponent<TextMeshProUGUI>();
            label.text = "Vamp Pon U1";
            label.alignment = TextAlignmentOptions.Center;
            label.fontSize = 26f;
            label.color = new Color(0.96f, 0.83f, 0.55f);
        }
    }
}
