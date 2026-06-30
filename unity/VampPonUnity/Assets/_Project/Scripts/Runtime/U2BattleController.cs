using System.Collections.Generic;
using TMPro;
using UnityEngine;
using VampPon.UnitySpike.Data;
using VampPon.UnitySpike.Player;

namespace VampPon.UnitySpike.Runtime
{
    public sealed class U2BattleController : MonoBehaviour
    {
        private readonly List<U2EnemyActor> enemies = new(32);
        private readonly List<U2ProjectileActor> projectiles = new(48);
        private readonly List<U2ExpFragmentActor> expFragments = new(64);
        private readonly List<U2VfxActor> vfxActors = new(48);
        private readonly List<U2EnemyActor> activeEnemies = new(64);

        private GameFeelConfig config;
        private Transform player;
        private Transform enemyRoot;
        private Transform projectileRoot;
        private Transform pickupRoot;
        private Transform overlayRoot;
        private TextMeshProUGUI topHudLabel;
        private Sprite enemySprite;
        private Sprite projectileSprite;
        private Sprite expSprite;
        private Sprite hitSprite;
        private Sprite inkSprite;
        private Sprite trailSprite;
        private Sprite collectSprite;
        private U3HitStopController hitStop;
        private U3CameraImpulseController cameraImpulse;
        private U3LanternPulseController lanternPulse;
        private Rect spawnBounds;
        private Rect playerBounds;
        private float spawnTimer;
        private float projectileTimer;
        private float elapsedSeconds;
        private int expCollected;
        private float hudPulseSeconds;
        private Vector3 hudBaseScale = Vector3.one;

        public int SpawnedEnemyCount { get; private set; }
        public int DefeatedEnemyCount { get; private set; }
        public int FiredProjectileCount { get; private set; }
        public int DroppedExpCount { get; private set; }
        public int CollectedExpCount => expCollected;
        public int ActiveEnemyCount => CountActive(enemies);
        public int ActiveProjectileCount => CountActive(projectiles);
        public int ActiveExpCount => CountActive(expFragments);
        public int ActiveVfxCount => CountActive(vfxActors);
        public int PeakActiveVfxCount { get; private set; }
        public int PlayedVfxCount { get; private set; }
        public int DroppedVfxCount { get; private set; }
        public int MaxActiveVfxCap => config != null ? config.maxActiveVfx : 0;
        public int HitStopCount => hitStop != null ? hitStop.TriggerCount : 0;
        public int CameraImpulseCount => cameraImpulse != null ? cameraImpulse.TriggerCount : 0;
        public int LanternPulseCount => lanternPulse != null ? lanternPulse.TriggerCount : 0;
        public int CollectTrailCount { get; private set; }
        public int DeathBurstCount { get; private set; }

        public void Initialize(
            GameFeelConfig gameFeelConfig,
            Transform playerTransform,
            Transform enemyParent,
            Transform projectileParent,
            Transform pickupParent,
            Transform overlayParent,
            TextMeshProUGUI hudLabel,
            Rect movementBounds,
            Rect enemySpawnBounds)
        {
            config = gameFeelConfig;
            player = playerTransform;
            enemyRoot = enemyParent;
            projectileRoot = projectileParent;
            pickupRoot = pickupParent;
            overlayRoot = overlayParent;
            topHudLabel = hudLabel;
            playerBounds = movementBounds;
            spawnBounds = enemySpawnBounds;

            enemySprite = ProceduralSpriteFactory.CreateBlobSprite(88, new Color(0.36f, 0.23f, 0.36f), new Color(1f, 0.68f, 0.25f));
            projectileSprite = ProceduralSpriteFactory.CreateRadialSprite(56, new Color(1f, 0.72f, 0.28f, 0.88f));
            expSprite = ProceduralSpriteFactory.CreateDiamondSprite(42, new Color(0.38f, 0.94f, 0.92f));
            hitSprite = ProceduralSpriteFactory.CreateRadialSprite(64, new Color(1f, 0.52f, 0.18f, 0.8f));
            inkSprite = ProceduralSpriteFactory.CreateRadialSprite(72, new Color(0.04f, 0.025f, 0.035f, 0.88f));
            trailSprite = ProceduralSpriteFactory.CreateRadialSprite(48, new Color(0.45f, 1f, 0.9f, 0.48f));
            collectSprite = ProceduralSpriteFactory.CreateRadialSprite(80, new Color(0.5f, 1f, 0.9f, 0.68f));
            hudBaseScale = topHudLabel != null ? topHudLabel.rectTransform.localScale : Vector3.one;

            PrewarmPools();
            CreateFeelHelpers();
            UpdateHud();
        }

        public void SpawnEnemyForVerification(Vector3 position)
        {
            SpawnEnemy(position);
        }

        private void Update()
        {
            if (config == null || player == null)
            {
                return;
            }

            elapsedSeconds += Time.deltaTime;
            spawnTimer -= Time.deltaTime;
            projectileTimer -= Time.deltaTime;

            if (spawnTimer <= 0f)
            {
                SpawnEnemy(RandomSpawnPosition());
                spawnTimer = config.enemySpawnInterval;
            }

            TickEnemies();
            TickProjectiles();
            TickExpFragments();
            TickVfx();
            TickHudPulse();

            if (projectileTimer <= 0f)
            {
                TryFireAtNearestEnemy();
                projectileTimer = config.projectileCooldown;
            }

            UpdateHud();
        }

        private void PrewarmPools()
        {
            CreateEnemies(Mathf.Max(1, config.enemyPoolSize));
            CreateProjectiles(Mathf.Max(1, config.projectilePoolSize));
            CreateExpFragments(Mathf.Max(1, config.expPoolSize));
            CreateVfx(Mathf.Max(1, config.vfxPoolSize));
        }

        private void CreateEnemies(int count)
        {
            for (var i = 0; i < count; i++)
            {
                var actor = U2EnemyActor.Create($"OmbuPooled_{i:00}", enemyRoot, enemySprite);
                actor.gameObject.SetActive(false);
                enemies.Add(actor);
            }
        }

        private void CreateProjectiles(int count)
        {
            for (var i = 0; i < count; i++)
            {
                var actor = U2ProjectileActor.Create($"LanternShotPooled_{i:00}", projectileRoot, projectileSprite);
                actor.gameObject.SetActive(false);
                projectiles.Add(actor);
            }
        }

        private void CreateExpFragments(int count)
        {
            for (var i = 0; i < count; i++)
            {
                var actor = U2ExpFragmentActor.Create($"MemoryFragmentPooled_{i:00}", pickupRoot, expSprite);
                actor.gameObject.SetActive(false);
                expFragments.Add(actor);
            }
        }

        private void CreateVfx(int count)
        {
            for (var i = 0; i < count; i++)
            {
                var actor = U2VfxActor.Create($"U2VfxPooled_{i:00}", overlayRoot);
                actor.gameObject.SetActive(false);
                vfxActors.Add(actor);
            }
        }

        private void TickEnemies()
        {
            for (var i = 0; i < enemies.Count; i++)
            {
                var enemy = enemies[i];
                if (!enemy.IsActive)
                {
                    continue;
                }

                enemy.Tick(player.position, config.enemyMoveSpeed, Time.deltaTime);
            }
        }

        private void TickProjectiles()
        {
            for (var i = 0; i < projectiles.Count; i++)
            {
                var projectile = projectiles[i];
                if (!projectile.IsActive)
                {
                    continue;
                }

                projectile.Tick(Time.deltaTime);
                if (projectile.Target != null && projectile.Target.IsActive &&
                    Vector2.Distance(projectile.transform.position, projectile.Target.transform.position) <= 0.28f)
                {
                    var hitPosition = projectile.transform.position;
                    projectile.Deactivate();
                    projectile.Target.TakeDamage(config.projectileDamage, config.damageFlashSeconds);
                    hitStop?.Request();
                    PlayVfx(hitPosition, hitSprite, 0.34f, 0.11f, Color.white, Vector2.zero, U2VfxShape.Radial);

                    if (!projectile.Target.IsActive)
                    {
                        DefeatedEnemyCount++;
                        cameraImpulse?.Request(projectile.Target.transform.position - player.position);
                        PlayDeathBurst(hitPosition);
                        DropExp(hitPosition);
                    }
                }
                else if (!spawnBounds.Contains(projectile.transform.position))
                {
                    projectile.Deactivate();
                }
            }
        }

        private void TickExpFragments()
        {
            for (var i = 0; i < expFragments.Count; i++)
            {
                var fragment = expFragments[i];
                if (!fragment.IsActive)
                {
                    continue;
                }

                var previousPosition = fragment.transform.position;
                var emittedTrail = fragment.Tick(player.position, config.expAttractRadius, config.expAttractSpeed, config.expFinalSnapRadius, Time.deltaTime);
                if (emittedTrail)
                {
                    PlayTrail(previousPosition, fragment.transform.position);
                    CollectTrailCount++;
                }

                if (Vector2.Distance(fragment.transform.position, player.position) <= 0.2f)
                {
                    var collectPosition = fragment.transform.position;
                    if (!emittedTrail)
                    {
                        PlayTrail(previousPosition, player.position);
                        CollectTrailCount++;
                    }

                    fragment.Deactivate();
                    expCollected++;
                    hudPulseSeconds = 0.16f;
                    lanternPulse?.Request();
                    PlayVfx(collectPosition, collectSprite, 0.55f, 0.18f, Color.white, Vector2.zero, U2VfxShape.Radial);
                }
            }
        }

        private void TickVfx()
        {
            for (var i = 0; i < vfxActors.Count; i++)
            {
                if (vfxActors[i].IsActive)
                {
                    vfxActors[i].Tick(Time.deltaTime);
                }
            }
        }

        private void TryFireAtNearestEnemy()
        {
            var target = FindNearestEnemy();
            if (target == null)
            {
                return;
            }

            var projectile = FirstInactive(projectiles);
            if (projectile == null)
            {
                return;
            }

            projectile.Activate(player.position, target, config.projectileSpeed);
            lanternPulse?.Request();
            FiredProjectileCount++;
        }

        private U2EnemyActor FindNearestEnemy()
        {
            U2EnemyActor nearest = null;
            var nearestDistance = float.MaxValue;
            var playerPosition = player.position;
            for (var i = 0; i < enemies.Count; i++)
            {
                var enemy = enemies[i];
                if (!enemy.IsActive)
                {
                    continue;
                }

                var distance = ((Vector2)(enemy.transform.position - playerPosition)).sqrMagnitude;
                if (distance < nearestDistance)
                {
                    nearestDistance = distance;
                    nearest = enemy;
                }
            }

            return nearest;
        }

        private void SpawnEnemy(Vector3 position)
        {
            var enemy = FirstInactive(enemies);
            if (enemy == null)
            {
                return;
            }

            enemy.Activate(position, config.enemyHp);
            SpawnedEnemyCount++;
        }

        private Vector3 RandomSpawnPosition()
        {
            var side = UnityEngine.Random.Range(0, 4);
            return side switch
            {
                0 => new Vector3(spawnBounds.xMin, UnityEngine.Random.Range(spawnBounds.yMin, spawnBounds.yMax), 0f),
                1 => new Vector3(spawnBounds.xMax, UnityEngine.Random.Range(spawnBounds.yMin, spawnBounds.yMax), 0f),
                2 => new Vector3(UnityEngine.Random.Range(spawnBounds.xMin, spawnBounds.xMax), spawnBounds.yMin, 0f),
                _ => new Vector3(UnityEngine.Random.Range(spawnBounds.xMin, spawnBounds.xMax), spawnBounds.yMax, 0f),
            };
        }

        private void DropExp(Vector3 position)
        {
            var fragment = FirstInactive(expFragments);
            if (fragment == null)
            {
                return;
            }

            var pop = new Vector2(UnityEngine.Random.Range(-0.3f, 0.3f), UnityEngine.Random.Range(0.16f, 0.42f)).normalized * config.expPopSpeed;
            fragment.Activate(position, pop, config.expPopSeconds);
            DroppedExpCount++;
        }

        private void PlayDeathBurst(Vector3 position)
        {
            DeathBurstCount++;
            PlayVfx(position, inkSprite, 0.95f, 0.2f, new Color(0.16f, 0.09f, 0.14f, 0.95f), Vector2.zero, U2VfxShape.Radial);
            PlayVfx(position + new Vector3(0.04f, 0.03f, 0f), hitSprite, 0.5f, 0.15f, new Color(1f, 0.62f, 0.25f, 0.85f), Vector2.zero, U2VfxShape.Radial);
            for (var i = 0; i < 5; i++)
            {
                var angle = i * 72f * Mathf.Deg2Rad;
                var velocity = new Vector2(Mathf.Cos(angle), Mathf.Sin(angle)) * UnityEngine.Random.Range(0.25f, 0.55f);
                PlayVfx(position, inkSprite, UnityEngine.Random.Range(0.2f, 0.34f), 0.28f, new Color(0.05f, 0.03f, 0.045f, 0.82f), velocity, U2VfxShape.Radial);
            }
        }

        private void PlayTrail(Vector3 from, Vector3 to)
        {
            var center = Vector3.Lerp(from, to, 0.5f);
            var distance = Vector2.Distance(from, to);
            var direction = to - from;
            var angle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg;
            PlayVfx(center, trailSprite, Mathf.Clamp(distance * 0.9f, 0.12f, 0.42f), 0.1f, new Color(0.45f, 1f, 0.9f, 0.5f), Vector2.zero, U2VfxShape.Trail, angle);
        }

        private void PlayVfx(Vector3 position, Sprite sprite, float scale, float duration, Color color, Vector2 velocity, U2VfxShape shape, float rotation = 0f)
        {
            if (ActiveVfxCount >= config.maxActiveVfx)
            {
                DroppedVfxCount++;
                return;
            }

            var vfx = FirstInactive(vfxActors);
            if (vfx == null)
            {
                DroppedVfxCount++;
                return;
            }

            vfx.Activate(position, sprite, scale, duration, color, velocity, shape, rotation);
            PlayedVfxCount++;
            PeakActiveVfxCount = Mathf.Max(PeakActiveVfxCount, ActiveVfxCount);
        }

        private void UpdateHud()
        {
            if (topHudLabel == null)
            {
                return;
            }

            var seconds = Mathf.FloorToInt(elapsedSeconds);
            topHudLabel.text = $"Lv 1   {seconds / 60:00}:{seconds % 60:00}   EXP {expCollected}";
        }

        private void CreateFeelHelpers()
        {
            var camera = Camera.main != null ? Camera.main : FindAnyObjectByType<Camera>();
            hitStop = gameObject.AddComponent<U3HitStopController>();
            hitStop.Initialize(config);
            cameraImpulse = gameObject.AddComponent<U3CameraImpulseController>();
            cameraImpulse.Initialize(config, camera);
            lanternPulse = gameObject.AddComponent<U3LanternPulseController>();
            lanternPulse.Initialize(config, player, overlayRoot, hitSprite);
        }

        private void TickHudPulse()
        {
            if (topHudLabel == null)
            {
                return;
            }

            if (hudPulseSeconds <= 0f)
            {
                topHudLabel.rectTransform.localScale = hudBaseScale;
                return;
            }

            hudPulseSeconds -= Time.unscaledDeltaTime;
            var t = Mathf.Clamp01(hudPulseSeconds / 0.16f);
            var pulse = 1f + Mathf.Sin(t * Mathf.PI) * 0.08f;
            topHudLabel.rectTransform.localScale = hudBaseScale * pulse;
        }

        private static T FirstInactive<T>(List<T> actors) where T : U2PooledActor
        {
            for (var i = 0; i < actors.Count; i++)
            {
                if (!actors[i].IsActive)
                {
                    return actors[i];
                }
            }

            return null;
        }

        private static int CountActive<T>(List<T> actors) where T : U2PooledActor
        {
            var count = 0;
            for (var i = 0; i < actors.Count; i++)
            {
                if (actors[i].IsActive)
                {
                    count++;
                }
            }

            return count;
        }
    }

    public abstract class U2PooledActor : MonoBehaviour
    {
        public bool IsActive { get; protected set; }

        public virtual void Deactivate()
        {
            IsActive = false;
            gameObject.SetActive(false);
        }
    }

    public sealed class U2EnemyActor : U2PooledActor
    {
        private SpriteRenderer spriteRenderer;
        private float hp;
        private float flashSeconds;
        private Vector3 baseScale;

        public static U2EnemyActor Create(string objectName, Transform parent, Sprite sprite)
        {
            var instance = new GameObject(objectName, typeof(SpriteRenderer), typeof(U2EnemyActor));
            instance.transform.SetParent(parent, false);
            var actor = instance.GetComponent<U2EnemyActor>();
            actor.spriteRenderer = instance.GetComponent<SpriteRenderer>();
            actor.spriteRenderer.sprite = sprite;
            actor.spriteRenderer.sortingOrder = 15;
            actor.baseScale = Vector3.one * 1.05f;
            instance.transform.localScale = actor.baseScale;
            return actor;
        }

        public void Activate(Vector3 position, float maxHp)
        {
            hp = maxHp;
            flashSeconds = 0f;
            transform.position = position;
            transform.localScale = baseScale;
            spriteRenderer.color = Color.white;
            IsActive = true;
            gameObject.SetActive(true);
        }

        public void Tick(Vector3 playerPosition, float speed, float deltaTime)
        {
            var toPlayer = playerPosition - transform.position;
            if (toPlayer.sqrMagnitude > 0.0001f)
            {
                transform.position += toPlayer.normalized * speed * deltaTime;
            }

            var wobble = Mathf.Sin(Time.time * 5.2f + transform.position.x) * 0.04f;
            transform.localScale = baseScale * (1f + wobble);

            if (flashSeconds > 0f)
            {
                flashSeconds -= deltaTime;
                spriteRenderer.color = flashSeconds > 0f ? new Color(1f, 0.74f, 0.42f) : Color.white;
            }
        }

        public void TakeDamage(float damage, float damageFlashSeconds)
        {
            hp -= damage;
            flashSeconds = damageFlashSeconds;
            spriteRenderer.color = new Color(1f, 0.68f, 0.36f);
            transform.localScale = baseScale * 1.12f;
            if (hp <= 0f)
            {
                Deactivate();
            }
        }
    }

    public sealed class U2ProjectileActor : U2PooledActor
    {
        private SpriteRenderer spriteRenderer;
        private Vector3 direction;
        private float speed;
        private float lifeSeconds;

        public U2EnemyActor Target { get; private set; }

        public static U2ProjectileActor Create(string objectName, Transform parent, Sprite sprite)
        {
            var instance = new GameObject(objectName, typeof(SpriteRenderer), typeof(U2ProjectileActor));
            instance.transform.SetParent(parent, false);
            var actor = instance.GetComponent<U2ProjectileActor>();
            actor.spriteRenderer = instance.GetComponent<SpriteRenderer>();
            actor.spriteRenderer.sprite = sprite;
            actor.spriteRenderer.sortingOrder = 28;
            instance.transform.localScale = Vector3.one * 0.42f;
            return actor;
        }

        public void Activate(Vector3 origin, U2EnemyActor target, float projectileSpeed)
        {
            Target = target;
            speed = projectileSpeed;
            lifeSeconds = 1.8f;
            transform.position = origin;
            var targetPosition = target != null ? target.transform.position : origin + Vector3.up;
            direction = (targetPosition - origin).sqrMagnitude > 0.0001f ? (targetPosition - origin).normalized : Vector3.up;
            IsActive = true;
            gameObject.SetActive(true);
        }

        public void Tick(float deltaTime)
        {
            if (Target != null && Target.IsActive)
            {
                var desired = (Target.transform.position - transform.position);
                if (desired.sqrMagnitude > 0.0001f)
                {
                    direction = Vector3.Lerp(direction, desired.normalized, 12f * deltaTime).normalized;
                }
            }

            transform.position += direction * speed * deltaTime;
            transform.Rotate(0f, 0f, 360f * deltaTime);
            lifeSeconds -= deltaTime;
            if (lifeSeconds <= 0f)
            {
                Deactivate();
            }
        }
    }

    public sealed class U2ExpFragmentActor : U2PooledActor
    {
        private SpriteRenderer spriteRenderer;
        private Vector3 driftVelocity;
        private float popSeconds;
        private float trailTimer;

        public static U2ExpFragmentActor Create(string objectName, Transform parent, Sprite sprite)
        {
            var instance = new GameObject(objectName, typeof(SpriteRenderer), typeof(U2ExpFragmentActor));
            instance.transform.SetParent(parent, false);
            var actor = instance.GetComponent<U2ExpFragmentActor>();
            actor.spriteRenderer = instance.GetComponent<SpriteRenderer>();
            actor.spriteRenderer.sprite = sprite;
            actor.spriteRenderer.sortingOrder = 30;
            return actor;
        }

        public void Activate(Vector3 position, Vector2 popVelocity, float popDuration)
        {
            transform.position = position;
            transform.localScale = Vector3.one;
            driftVelocity = popVelocity;
            popSeconds = popDuration;
            trailTimer = 0f;
            IsActive = true;
            gameObject.SetActive(true);
        }

        public bool Tick(Vector3 playerPosition, float attractRadius, float attractSpeed, float finalSnapRadius, float deltaTime)
        {
            var distance = Vector2.Distance(transform.position, playerPosition);
            if (popSeconds > 0f)
            {
                popSeconds -= deltaTime;
                driftVelocity = Vector3.Lerp(driftVelocity, Vector3.zero, 4.5f * deltaTime);
                transform.position += driftVelocity * deltaTime;
                return false;
            }

            if (distance <= attractRadius)
            {
                var toPlayer = playerPosition - transform.position;
                var normalizedDistance = Mathf.Clamp01(distance / Mathf.Max(0.01f, attractRadius));
                var speed = attractSpeed * Mathf.Lerp(1.65f, 0.55f, normalizedDistance);
                if (distance <= finalSnapRadius)
                {
                    speed *= 1.7f;
                }

                transform.position += toPlayer.normalized * speed * deltaTime;
                transform.localScale = Vector3.one * Mathf.Lerp(0.65f, 1f, Mathf.Clamp01(distance / attractRadius));
                trailTimer -= deltaTime;
                if (trailTimer <= 0f)
                {
                    trailTimer = 0.045f;
                    return true;
                }
            }
            else
            {
                transform.position += new Vector3(0f, Mathf.Sin(Time.time * 5.5f) * 0.008f, 0f);
            }

            return false;
        }
    }

    public enum U2VfxShape
    {
        Radial,
        Trail,
    }

    public sealed class U2VfxActor : U2PooledActor
    {
        private SpriteRenderer spriteRenderer;
        private float duration;
        private float elapsed;
        private float targetScale;
        private Vector2 velocity;
        private U2VfxShape shape;

        public static U2VfxActor Create(string objectName, Transform parent)
        {
            var instance = new GameObject(objectName, typeof(SpriteRenderer), typeof(U2VfxActor));
            instance.transform.SetParent(parent, false);
            var actor = instance.GetComponent<U2VfxActor>();
            actor.spriteRenderer = instance.GetComponent<SpriteRenderer>();
            actor.spriteRenderer.sortingOrder = 40;
            return actor;
        }

        public void Activate(Vector3 position, Sprite sprite, float scale, float seconds, Color color, Vector2 driftVelocity, U2VfxShape vfxShape, float rotation)
        {
            transform.position = position;
            transform.localScale = Vector3.one * 0.05f;
            transform.rotation = Quaternion.Euler(0f, 0f, rotation);
            spriteRenderer.sprite = sprite;
            spriteRenderer.color = color;
            targetScale = scale;
            velocity = driftVelocity;
            shape = vfxShape;
            duration = Mathf.Max(0.01f, seconds);
            elapsed = 0f;
            IsActive = true;
            gameObject.SetActive(true);
        }

        public void Tick(float deltaTime)
        {
            elapsed += deltaTime;
            var t = Mathf.Clamp01(elapsed / duration);
            transform.position += (Vector3)(velocity * deltaTime);
            var eased = 1f - Mathf.Pow(1f - t, 2f);
            transform.localScale = shape == U2VfxShape.Trail
                ? new Vector3(Mathf.Lerp(0.05f, targetScale, eased), Mathf.Lerp(0.03f, 0.12f, eased), 1f)
                : Vector3.one * Mathf.Lerp(0.05f, targetScale, eased);
            var color = spriteRenderer.color;
            color.a = 1f - t;
            spriteRenderer.color = color;
            if (t >= 1f)
            {
                Deactivate();
            }
        }
    }
}
