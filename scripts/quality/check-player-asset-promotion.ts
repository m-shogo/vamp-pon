/**
 * check-player-asset-promotion.ts
 *
 * Player sprite を production へ「昇格」させるときの品質ゲート。
 *
 * 背景: c10e6c0 は temporary candidate / GUI未実施 / charm低 のまま production
 * source と production PNG を更新した失敗コミット (279bbfa で revert)。
 * プロンプトだけでは再発するため、機械的に検出する。
 *
 * 検出する不正:
 *   1) production player asset を更新しているのに、promotion manifest 上で昇格不可
 *      (status が temporary/draft/rejected、必須 quality gate < 4、review/before-after/
 *       source/export 証跡が欠落)。
 *   2) commit message / 変更された docs に矛盾するワーディングがある
 *      (例: "temporary candidate" なのに production touched、
 *       "hand-final" なのに "GUI未実施" など)。
 *   3) production PNG だけ変わって source .aseprite が変わっていない (= public PNG 直編集)。
 *
 * 使い方:
 *   pnpm assets:check-player-promotion
 *   node --experimental-strip-types scripts/quality/check-player-asset-promotion.ts [--base=<ref>]
 *
 * 終了コード: 0 = pass, 1 = fail。
 *
 * NOTE: この script は sprite を生成しない。production を変更しない。検査のみ。
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

// ─── types ────────────────────────────────────────────────────────────────
interface QualityGate {
  oneXReadability: number;
  referenceMatch: number;
  charmAppeal: number;
  mascotSilhouette: number;
  merchandisePotential: number;
  gameplayVisibility: number;
  backgroundSeparation: number;
  styleConsistency: number;
  finalConfidence: number;
}

interface PromotionAsset {
  id: string;
  status: string;
  source: string;
  productionPng: string;
  reviewDoc: string;
  beforeAfterImage: string;
  exportCommand: string;
  qualityGate: Partial<QualityGate>;
  notes?: string;
}

interface PromotionManifest {
  schemaVersion: number;
  requiredQualityGateKeys: (keyof QualityGate)[];
  minRequiredScore: number;
  promotableStatuses: string[];
  blockedStatuses: string[];
  assets: PromotionAsset[];
}

const MANIFEST_PATH = 'data/player-asset-promotion.json';

// production player asset の既定リスト (manifest が空でも最低限ここで守る)。
const DEFAULT_PRODUCTION_PATHS = [
  'public/assets/sprites/player/yui_idle_42.png',
  'assets/source/aseprite/player/yui_idle.aseprite',
];

// ─── helpers ──────────────────────────────────────────────────────────────
const problems: string[] = [];
const warnings: string[] = [];

function fail(msg: string): void {
  problems.push(msg);
}
function warn(msg: string): void {
  warnings.push(msg);
}

function git(args: string[]): string | null {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function revExists(ref: string): boolean {
  return git(['rev-parse', '--verify', '--quiet', ref]) !== null;
}

/** base ref を解決する: --base=… > origin/main > main > 最初のcommit。 */
function resolveBase(argBase: string | undefined): string | null {
  const candidates = [argBase, 'origin/main', 'main'].filter(Boolean) as string[];
  for (const c of candidates) {
    if (revExists(c)) return c;
  }
  const root = git(['rev-list', '--max-parents=0', 'HEAD']);
  return root ? root.split('\n')[0] : null;
}

/** base..HEAD で変更されたファイル + working tree の変更を集める。 */
function collectChangedFiles(base: string | null): Set<string> {
  const files = new Set<string>();
  if (base) {
    const mergeBase = git(['merge-base', base, 'HEAD']) ?? base;
    const committed = git(['diff', '--name-only', `${mergeBase}`, 'HEAD']);
    if (committed) committed.split('\n').forEach((f) => f && files.add(f));
  }
  // working tree (staged + unstaged + untracked)
  const status = git(['status', '--porcelain']);
  if (status) {
    for (const line of status.split('\n')) {
      if (!line) continue;
      // format: "XY <path>" or "XY <old> -> <new>"
      const path = line.slice(3).split(' -> ').pop();
      if (path) files.add(path.trim());
    }
  }
  return files;
}

/** base..HEAD の commit message 群。 */
function collectCommitMessages(base: string | null): string {
  if (!base) return '';
  const mergeBase = git(['merge-base', base, 'HEAD']) ?? base;
  const log = git(['log', `${mergeBase}..HEAD`, '--format=%B']);
  return log ?? '';
}

function readJson<T>(path: string): T | null {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T;
  } catch {
    return null;
  }
}

// ─── main ─────────────────────────────────────────────────────────────────
function main(): void {
  const argBase = process.argv.find((a) => a.startsWith('--base='))?.slice('--base='.length);
  const base = resolveBase(argBase);

  const manifest = readJson<PromotionManifest>(MANIFEST_PATH);
  if (!manifest) {
    fail(`promotion manifest を読めません: ${MANIFEST_PATH}`);
    report();
    return;
  }
  if (manifest.schemaVersion !== 1) {
    warn(`schemaVersion=${manifest.schemaVersion} は未知です (期待値 1)`);
  }

  const requiredKeys = manifest.requiredQualityGateKeys ?? [];
  const minScore = manifest.minRequiredScore ?? 4;
  const promotable = new Set(manifest.promotableStatuses ?? []);
  const blocked = new Set(manifest.blockedStatuses ?? []);

  const changed = collectChangedFiles(base);
  const commitMessages = collectCommitMessages(base);

  // production 変更検出に使うパス = manifest の source/productionPng + 既定。
  const manifestProductionPaths = manifest.assets.flatMap((a) => [a.source, a.productionPng]).filter(Boolean);
  const allProductionPaths = new Set([...DEFAULT_PRODUCTION_PATHS, ...manifestProductionPaths]);

  const touchedProductionPaths = [...allProductionPaths].filter((p) => changed.has(p));
  const productionTouched = touchedProductionPaths.length > 0;

  console.log(`[promotion-gate] base=${base ?? '(none)'}  changed files=${changed.size}`);
  if (productionTouched) {
    console.log(`[promotion-gate] production player asset touched:`);
    touchedProductionPaths.forEach((p) => console.log(`    - ${p}`));
  } else {
    console.log('[promotion-gate] production player asset は変更されていません。');
  }

  // ── 1. production touched 時の昇格条件 ────────────────────────────────────
  if (productionTouched) {
    for (const asset of manifest.assets) {
      const assetTouched = changed.has(asset.source) || changed.has(asset.productionPng);
      if (!assetTouched) continue;

      const tag = `[${asset.id}]`;

      // status
      if (blocked.has(asset.status)) {
        fail(`${tag} status="${asset.status}" は production 昇格不可 (blocked)。promotion 前に GUI 手仕上げと採点が必要。`);
      } else if (!promotable.has(asset.status)) {
        fail(`${tag} status="${asset.status}" は promotable ではありません (${[...promotable].join(' / ')} のいずれかが必要)。`);
      }

      // quality gate
      const gate = asset.qualityGate ?? {};
      for (const key of requiredKeys) {
        const score = Number(gate[key] ?? 0);
        if (!(score >= minScore)) {
          fail(`${tag} qualityGate.${String(key)}=${score} は ${minScore} 未満。production 昇格不可。`);
        }
      }

      // 証跡: review doc
      if (!asset.reviewDoc || !existsSync(asset.reviewDoc)) {
        fail(`${tag} reviewDoc が無い/存在しません ("${asset.reviewDoc}")。before/after・採点を含む review md が必要。`);
      }
      // 証跡: before/after image
      if (!asset.beforeAfterImage || !existsSync(asset.beforeAfterImage)) {
        fail(`${tag} beforeAfterImage が無い/存在しません ("${asset.beforeAfterImage}")。`);
      }
      // 証跡: source
      if (!asset.source || !existsSync(asset.source)) {
        fail(`${tag} source が無い/存在しません ("${asset.source}")。source → export の運用が必要。`);
      }
      // 証跡: export command
      if (!asset.exportCommand || asset.exportCommand.trim() === '') {
        fail(`${tag} exportCommand が記録されていません。public PNG は source から export すること。`);
      }
    }

    // manifest に存在しない production path が変更された場合
    for (const p of touchedProductionPaths) {
      const known = manifest.assets.some((a) => a.source === p || a.productionPng === p);
      if (!known) {
        fail(`production path "${p}" が promotion manifest に未登録のまま変更されています。manifest に追加し昇格条件を満たすこと。`);
      }
    }
  }

  // ── 2. 禁止ワーディング (commit messages + 変更された review docs) ──────────
  // 対象は「この変更の commit message」と「変更された review md」。
  // ルールを説明するためにわざと禁止語を引用する meta docs は除外する
  // (これらを対象にすると、ルール解説自体が誤検知になるため)。
  const META_DOC_EXCLUDES = [
    'docs/reviews/bad-examples/',
    'docs/player/player-asset-promotion-policy.md',
    'scripts/quality/',
    'PULL_REQUEST_TEMPLATE',
  ];
  const isMetaDoc = (f: string): boolean => META_DOC_EXCLUDES.some((m) => f.includes(m));

  const docCorpusParts: string[] = [commitMessages];
  for (const f of changed) {
    if (f.endsWith('.md') && !isMetaDoc(f) && existsSync(f)) {
      try {
        docCorpusParts.push(readFileSync(f, 'utf8'));
      } catch {
        /* ignore */
      }
    }
  }
  const corpus = docCorpusParts.join('\n');

  const has = (s: string): boolean => corpus.includes(s);

  if (productionTouched && has('temporary candidate')) {
    fail('禁止ワーディング: production touched かつ "temporary candidate" が記述されています。');
  }
  if (productionTouched && has('GUI未実施')) {
    fail('禁止ワーディング: production touched かつ "GUI未実施" が記述されています。');
  }
  if (has('hand-final') && has('GUI未実施')) {
    fail('禁止ワーディング: "hand-final" と "GUI未実施" が同時に存在します。');
  }
  if (has('Aseprite手仕上げ') && has('script生成')) {
    fail('禁止ワーディング: "Aseprite手仕上げ" と "script生成" が同時に存在します。実態と表記を一致させること。');
  }

  // ── 3. public PNG 直編集ガード ────────────────────────────────────────────
  for (const asset of manifest.assets) {
    const pngChanged = changed.has(asset.productionPng);
    const srcChanged = changed.has(asset.source);
    if (pngChanged && !srcChanged) {
      fail(
        `[${asset.id}] production PNG ("${asset.productionPng}") が変更されていますが source ("${asset.source}") は未変更です。` +
          ' public PNG の直接編集は禁止。source を編集し export すること。',
      );
    }
  }

  report();
}

function report(): void {
  if (warnings.length > 0) {
    console.log('\n[promotion-gate] warnings:');
    warnings.forEach((w) => console.log(`  ! ${w}`));
  }
  if (problems.length > 0) {
    console.error('\n[promotion-gate] FAIL:');
    problems.forEach((p) => console.error(`  ✗ ${p}`));
    console.error(`\n${problems.length} 件の問題で player asset promotion gate を通過できません。`);
    console.error('詳細: docs/player/player-asset-promotion-policy.md');
    process.exit(1);
  }
  console.log('\n[promotion-gate] PASS: player asset promotion gate を通過しました。');
}

main();
