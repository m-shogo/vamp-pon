# Gameplay Data Contract

## 目的

Vamp Pon の武器・敵・パッシブ・ウェーブ・進化をデータ駆動で実装するための契約を定義する。

コード実装時は、この契約に従う。

---

# 1. IDルール

## 基本

```txt
英小文字
snake_case
意味が分かる
日本語名とは分離
```

## 例

```txt
night_pencil
ink_shadow
gold_compass
unfinished_line
```

## 禁止

```txt
日本語ID
スペース
表示名をIDにする
途中で意味が変わるID
```

---

# 2. WeaponDefinition

## 必須フィールド

```ts
export type WeaponDefinition = {
  id: string;
  name: string;
  category: 'weapon';
  maxLevel: number;
  tags: string[];
  description: string;
  lore?: string;
  levels: WeaponLevelDefinition[];
};
```

## level

```ts
export type WeaponLevelDefinition = {
  level: number;
  effect: EffectDefinition;
  label: string;
};
```

## ルール

```txt
levelsは1からmaxLevelまで必ず持つ
labelはカード表示に使える短文
effectは武器処理が読める形にする
```

## effect.type候補

```txt
projectile
bouncing_projectile
orbit
ground_area
radial_random_projectile
evolved_projectile
evolved_area
```

Prototype 1では以下だけ使う。

```txt
projectile
```

---

# 3. PassiveDefinition

```ts
export type PassiveDefinition = {
  id: string;
  name: string;
  category: 'passive';
  maxLevel: number;
  stat: PassiveStat;
  description: string;
  lore?: string;
  levels: PassiveLevelDefinition[];
};
```

## stat候補

```txt
magnetMultiplier
mightMultiplier
xpMultiplier
moveSpeedMultiplier
cooldownMultiplier
```

## ルール

```txt
levelsは1からmaxLevelまで持つ
valueは最終計算に使う値
labelは表示文言
```

---

# 4. EnemyDefinition

```ts
export type EnemyDefinition = {
  id: string;
  name: string;
  hp: number;
  moveSpeed: number;
  contactDamage: number;
  xpDrop: number;
  tags: string[];
  behavior: EnemyBehavior;
  description: string;
  lore?: string;
  drops?: DropDefinition[];
};
```

## behavior候補

```txt
chase
slow_chase
offset_chase
swarm_chase
elite_chase
```

Prototype 1では以下だけ。

```txt
chase
```

## tags候補

```txt
small
medium
fast
tank
swarm
elite
capsule_drop
reward
```

---

# 5. WaveDefinition

```ts
export type WaveDefinition = {
  start: number;
  end: number;
  note: string;
  spawns: WaveSpawnDefinition[];
};
```

```ts
export type WaveSpawnDefinition = {
  enemyId: string;
  spawnRatePerSecond?: number;
  spawnCount?: number;
  maxAlive?: number;
  directionWeights: DirectionWeights;
};
```

## ルール

```txt
start/endは秒
endは含まない
spawnRatePerSecondとspawnCountは同時に使わない
maxAliveで敵数を制御
```

## directionWeights候補

```txt
bottom
top
left
right
around
```

---

# 6. EvolutionDefinition

```ts
export type EvolutionDefinition = {
  id: string;
  name: string;
  fromWeaponId: string;
  requiredWeaponLevel: number;
  requiredPassiveId: string;
  evolvedWeaponId: string;
  title: string;
  lore: string;
};
```

## ルール

```txt
fromWeaponIdは既存武器
requiredPassiveIdは所持していればよい
requiredPassiveのレベル条件はMVPでは不要
進化後は元武器枠を置き換える
```

---

# 7. Runtime Inventory

```ts
export type RuntimeWeapon = {
  id: string;
  level: number;
  cooldownRemaining: number;
};

export type RuntimePassive = {
  id: string;
  level: number;
};

export type InventoryRuntime = {
  weapons: RuntimeWeapon[];
  passives: RuntimePassive[];
  evolvedWeaponIds: string[];
  weaponSlots: number;
  passiveSlots: number;
};
```

## ルール

```txt
武器枠は4
パッシブ枠は4
進化後も武器枠を使う
同じ武器IDは重複所持しない
同じパッシブIDは重複所持しない
```

---

# 8. LevelUpChoice

```ts
export type LevelUpChoice =
  | { type: 'weapon_new'; itemId: string; title: string; description: string; lore?: string }
  | { type: 'weapon_upgrade'; itemId: string; nextLevel: number; title: string; description: string; lore?: string }
  | { type: 'passive_new'; itemId: string; title: string; description: string; lore?: string }
  | { type: 'passive_upgrade'; itemId: string; nextLevel: number; title: string; description: string; lore?: string }
  | { type: 'heal'; amount: number; title: string; description: string; lore?: string };
```

## ルール

```txt
3択では同じitemIdを重複させない
Lv.MAXは出さない
枠満了ならnew系は出さない
回復はHP満タンなら優先度を下げる
```

---

# 9. CapsuleReward

```ts
export type CapsuleReward =
  | { type: 'evolution'; evolutionId: string; evolvedWeaponId: string; title: string; lore: string }
  | { type: 'weapon_upgrade' | 'passive_upgrade'; itemId: string; nextLevel: number; title: string }
  | { type: 'currency'; amount: number; title: string };
```

## 優先順位

```txt
1. evolution
2. weapon_upgrade/passive_upgrade
3. currency
```

---

# 10. SaveData Contract

```ts
export type SaveData = {
  version: number;
  currency: number;
  unlockedCharacters: string[];
  unlockedWeapons: string[];
  unlockedPassives: string[];
  achievements: Record<string, boolean>;
  codex: {
    enemies: Record<string, boolean>;
    items: Record<string, boolean>;
    weapons: Record<string, boolean>;
    passives: Record<string, boolean>;
  };
  settings: GameSettings;
};
```

Prototype 1では保存なしでもよい。

Prototype 3以降で使う。

## version

初期:

```txt
1
```

---

# 11. GameSettings

```ts
export type GameSettings = {
  sound: boolean;
  screenShake: boolean;
  damageNumbers: boolean;
  autoUltimate: boolean;
};
```

初期値:

```txt
sound: true
screenShake: true
damageNumbers: true
autoUltimate: false
```

---

# 12. 禁止実装

```txt
weapon.nameで処理分岐
enemy.nameで処理分岐
表示文言をロジックIDに使う
データなしでハードコード武器追加
```

---

# 13. 最重要

データ契約は、実装を縛るためではなく、追加時に壊れないようにするためのもの。

```txt
新しい武器を追加しても、既存コードを大きく変えずに済む構造にする。
```
