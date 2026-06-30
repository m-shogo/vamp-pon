using UnityEngine;

namespace VampPon.UnitySpike.Runtime
{
    public static class ProceduralSpriteFactory
    {
        public static Sprite CreatePaperSprite(int width, int height)
        {
            var texture = new Texture2D(width, height, TextureFormat.RGBA32, false)
            {
                filterMode = FilterMode.Bilinear,
                wrapMode = TextureWrapMode.Clamp
            };

            for (var y = 0; y < height; y++)
            {
                for (var x = 0; x < width; x++)
                {
                    var v = Mathf.PerlinNoise(x * 0.04f, y * 0.04f);
                    var edge = Mathf.Min(Mathf.Min(x, width - 1 - x), Mathf.Min(y, height - 1 - y)) / 32f;
                    var vignette = Mathf.Clamp01(edge);
                    var tone = 0.055f + v * 0.035f;
                    texture.SetPixel(x, y, new Color(tone * 0.72f, tone * 0.64f, tone * 0.58f, Mathf.Lerp(0.92f, 1f, vignette)));
                }
            }

            texture.Apply();
            return Sprite.Create(texture, new Rect(0f, 0f, width, height), new Vector2(0.5f, 0.5f), 64f, 0, SpriteMeshType.FullRect, new Vector4(18f, 18f, 18f, 18f));
        }

        public static Sprite CreateRadialSprite(int size, Color color)
        {
            var texture = TransparentTexture(size, FilterMode.Bilinear);
            var center = (size - 1) * 0.5f;
            var maxDistance = center;

            for (var y = 0; y < size; y++)
            {
                for (var x = 0; x < size; x++)
                {
                    var distance = Vector2.Distance(new Vector2(x, y), new Vector2(center, center));
                    var alpha = Mathf.Pow(Mathf.Clamp01(1f - distance / maxDistance), 2.2f) * color.a;
                    texture.SetPixel(x, y, new Color(color.r, color.g, color.b, alpha));
                }
            }

            texture.Apply();
            return Sprite.Create(texture, new Rect(0f, 0f, size, size), new Vector2(0.5f, 0.5f), 100f);
        }

        public static Sprite CreateCharacterSprite(int size, Color face, Color cloak)
        {
            var texture = TransparentTexture(size, FilterMode.Point);
            var center = new Vector2(size * 0.5f, size * 0.5f);

            DrawEllipse(texture, center + new Vector2(0f, -16f), size * 0.28f, size * 0.33f, cloak);
            DrawEllipse(texture, center + new Vector2(0f, 10f), size * 0.22f, size * 0.2f, face);
            DrawEllipse(texture, center + new Vector2(-16f, -3f), size * 0.08f, size * 0.18f, cloak);
            DrawEllipse(texture, center + new Vector2(16f, -3f), size * 0.08f, size * 0.18f, cloak);
            DrawCircle(texture, center + new Vector2(-7f, 13f), 2.5f, new Color(0.08f, 0.04f, 0.05f));
            DrawCircle(texture, center + new Vector2(7f, 13f), 2.5f, new Color(0.08f, 0.04f, 0.05f));
            texture.Apply();
            return Sprite.Create(texture, new Rect(0f, 0f, size, size), new Vector2(0.5f, 0.5f), 100f);
        }

        public static Sprite CreateBlobSprite(int size, Color body, Color eye)
        {
            var texture = TransparentTexture(size, FilterMode.Point);
            var center = new Vector2(size * 0.5f, size * 0.5f);
            DrawEllipse(texture, center + new Vector2(0f, -3f), size * 0.36f, size * 0.29f, body);
            DrawEllipse(texture, center + new Vector2(-13f, 19f), size * 0.08f, size * 0.16f, body);
            DrawEllipse(texture, center + new Vector2(13f, 19f), size * 0.08f, size * 0.16f, body);
            DrawCircle(texture, center + new Vector2(-9f, 5f), 3.5f, eye);
            DrawCircle(texture, center + new Vector2(9f, 5f), 3.5f, eye);
            texture.Apply();
            return Sprite.Create(texture, new Rect(0f, 0f, size, size), new Vector2(0.5f, 0.5f), 100f);
        }

        public static Sprite CreateDiamondSprite(int size, Color color)
        {
            var texture = TransparentTexture(size, FilterMode.Point);
            var center = (size - 1) * 0.5f;
            for (var y = 0; y < size; y++)
            {
                for (var x = 0; x < size; x++)
                {
                    var distance = Mathf.Abs(x - center) + Mathf.Abs(y - center);
                    if (distance <= center * 0.8f)
                    {
                        var alpha = Mathf.Lerp(1f, 0.35f, distance / (center * 0.8f));
                        texture.SetPixel(x, y, new Color(color.r, color.g, color.b, alpha));
                    }
                }
            }

            texture.Apply();
            return Sprite.Create(texture, new Rect(0f, 0f, size, size), new Vector2(0.5f, 0.5f), 100f);
        }

        private static Texture2D TransparentTexture(int size, FilterMode filterMode)
        {
            var texture = new Texture2D(size, size, TextureFormat.RGBA32, false)
            {
                filterMode = filterMode,
                wrapMode = TextureWrapMode.Clamp
            };
            var clear = new Color(0f, 0f, 0f, 0f);
            for (var y = 0; y < size; y++)
            {
                for (var x = 0; x < size; x++)
                {
                    texture.SetPixel(x, y, clear);
                }
            }

            return texture;
        }

        private static void DrawCircle(Texture2D texture, Vector2 center, float radius, Color color)
        {
            var radiusSquared = radius * radius;
            for (var y = 0; y < texture.height; y++)
            {
                for (var x = 0; x < texture.width; x++)
                {
                    if ((new Vector2(x, y) - center).sqrMagnitude <= radiusSquared)
                    {
                        texture.SetPixel(x, y, color);
                    }
                }
            }
        }

        private static void DrawEllipse(Texture2D texture, Vector2 center, float radiusX, float radiusY, Color color)
        {
            for (var y = 0; y < texture.height; y++)
            {
                for (var x = 0; x < texture.width; x++)
                {
                    var normalizedX = (x - center.x) / radiusX;
                    var normalizedY = (y - center.y) / radiusY;
                    if (normalizedX * normalizedX + normalizedY * normalizedY <= 1f)
                    {
                        texture.SetPixel(x, y, color);
                    }
                }
            }
        }
    }
}
