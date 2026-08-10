# ヨルノシルベ — Cloudflare 3-Surface Deployment v1

Date: 2026-08-10  
Status: CURRENT DEPLOYMENT DIRECTION

## Public architecture

```text
yorunoshirube.jp
  = official guide / strategy DB / public lore surface

play.yorunoshirube.jp
  = browser playable demo (Vite / Phaser web surface)

app.yorunoshirube.jp
  = stable Unity main-game entrypoint
```

The three surfaces remain in the single repository `m-shogo/vamp-pon`.
Do not create a second source-of-truth repository just for deployment.

## Today-first URLs

A custom domain is not required for the first public check.
Cloudflare Workers assigns `workers.dev` routes to deployed Workers.

Create exactly these Workers:

- `yorunoshirube-site`
- `yorunoshirube-play`
- `yorunoshirube-app`

They will be reachable in the account's workers.dev namespace after first deploy.
Exact hostname depends on the Cloudflare account subdomain.

## Cloudflare Workers Builds settings

Connect the same GitHub repository to each Worker.
Production branch: `main`.

### 1. yorunoshirube-site

- Worker name: `yorunoshirube-site`
- Build command: none required
- Deploy command:

```sh
npx wrangler deploy --config cloudflare/site/wrangler.jsonc
```

Assets: `public/guide`

This surface is public-safe by design and must not directly publish `public/lorebook`.
The internal Lorebook contains author/candidate/open material and is not the public website authority.

### 2. yorunoshirube-play

- Worker name: `yorunoshirube-play`
- Build command:

```sh
pnpm exec vite build
```

- Deploy command:

```sh
npx wrangler deploy --config cloudflare/play/wrangler.jsonc
```

Assets: `dist`

The SPA fallback is enabled for browser-game routes.

### 3. yorunoshirube-app

- Worker name: `yorunoshirube-app`
- Build command: none required
- Deploy command:

```sh
npx wrangler deploy --config cloudflare/app/wrangler.jsonc
```

Assets: `public/app-entry`

Before App Store release this is a stable coming-soon / routing page.
After release, store and deep-link routing can be added without changing printed QR URLs.

## Custom domains after workers.dev verification

Once the domain is owned and onboarded to Cloudflare:

- `yorunoshirube-site` -> `yorunoshirube.jp`
- `yorunoshirube-play` -> `play.yorunoshirube.jp`
- `yorunoshirube-app` -> `app.yorunoshirube.jp`

Use Cloudflare Custom Domains rather than hardcoding a zone route before the zone exists.

## Public/private boundary

Never expose these simply because they live under `public/` in the repository:

- author-only notes
- candidate-only sequel decisions
- unresolved mystery answers
- unapproved production art
- internal readiness/evidence

`public/lorebook` remains an authoring/reference surface until a separate public-export gate sanitizes it.
The public guide surface is `public/guide`.

## URL permanence rule

Printed/SNS/QR URLs should point at stable first-party URLs:

- `yorunoshirube.jp/...`
- `play.yorunoshirube.jp`
- `app.yorunoshirube.jp`

Do not print direct App Store, TestFlight, Steam, or workers.dev URLs on permanent merchandise.
Those destinations can change while the first-party URL remains stable.

## Unity main-game rule

Unity is the main game authority.
The browser demo is not required to maintain full parity forever.
Differences must be labeled rather than silently presenting demo behavior as current Unity production behavior.
