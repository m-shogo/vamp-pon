import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');
const parseJsonc = (p: string) => JSON.parse(read(p));
const fail = (message: string): never => { throw new Error(message); };

const expected = [
  {
    config: 'cloudflare/site/wrangler.jsonc',
    name: 'yorunoshirube-site',
    directory: '../../public/guide',
  },
  {
    config: 'cloudflare/play/wrangler.jsonc',
    name: 'yorunoshirube-play',
    directory: '../../dist',
  },
  {
    config: 'cloudflare/app/wrangler.jsonc',
    name: 'yorunoshirube-app',
    directory: '../../public/app-entry',
  },
] as const;

for (const item of expected) {
  if (!fs.existsSync(path.join(root, item.config))) fail(`Missing ${item.config}`);
  const config = parseJsonc(item.config);
  if (config.name !== item.name) fail(`${item.config}: expected Worker name ${item.name}`);
  if (config.compatibility_date !== '2026-08-10') fail(`${item.config}: compatibility_date drift`);
  if (config.workers_dev !== true) fail(`${item.config}: workers.dev must stay enabled for today-first preview`);
  if (config.preview_urls !== true) fail(`${item.config}: preview URLs must stay enabled`);
  if (config.assets?.directory !== item.directory) fail(`${item.config}: asset directory drift`);
  if (config.routes || config.route) fail(`${item.config}: do not hardcode custom-domain routes before domain onboarding`);
}

const play = parseJsonc('cloudflare/play/wrangler.jsonc');
if (play.assets?.not_found_handling !== 'single-page-application') {
  fail('Web demo must retain SPA fallback');
}

for (const p of ['public/guide/index.html', 'public/app-entry/index.html']) {
  if (!fs.existsSync(path.join(root, p))) fail(`Missing public entry: ${p}`);
}

const guide = read('public/guide/index.html');
const app = read('public/app-entry/index.html');
const docs = read('docs/deployment/cloudflare-three-surface-v1.md');

for (const token of ['author-only', 'spoilerToggle', 'authors-desk', '/lorebook/']) {
  if (guide.includes(token)) fail(`Public guide leaks internal Lorebook hook: ${token}`);
}

for (const host of ['yorunoshirube.jp', 'play.yorunoshirube.jp', 'app.yorunoshirube.jp']) {
  if (!guide.includes(host) && !app.includes(host)) fail(`Public surfaces do not reference stable host: ${host}`);
  if (!docs.includes(host)) fail(`Deployment doc missing stable host: ${host}`);
}

for (const prematureStoreUrl of ['apps.apple.com/', 'play.google.com/store/', 'store.steampowered.com/app/']) {
  if (app.includes(prematureStoreUrl)) fail(`App entry contains unapproved store destination: ${prematureStoreUrl}`);
}

if (!docs.includes('public/lorebook')) fail('Deployment doc must preserve public/internal Lorebook boundary');
if (!docs.includes('Unity is the main game authority')) fail('Deployment doc must preserve Unity main-game authority');

console.log('Cloudflare three-surface deployment contract: OK');
console.log('site -> public/guide');
console.log('play -> dist (Vite SPA)');
console.log('app  -> public/app-entry');
