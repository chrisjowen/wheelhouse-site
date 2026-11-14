# wheelhouse-site

Source for https://wheelhouse.chrisjowen.net, the Wheelhouse product site: the pitch, the video tour and clips, every feature, every plugin, getting started and the releases.

**Moved:** the product site is now [Fleetyard](https://fleetyard.io). wheelhouse.chrisjowen.net answers every request with a 301 there (`/tour/` to https://fleetyard.io/tour, everything else to the homepage), through Traefik middlewares on the ingress in `deploy/k8s/site.yaml`; the nginx pods still run behind it.

It is a static home page and a dedicated `/tour/` tutorial page, rendered at build time from `src/content.mjs`, with a little JavaScript for the theme switch, chapters, feature index, plugin filters and screenshot lightbox. Without JavaScript everything still reads.

## Build and preview

Needs Node.js 22 or newer.

```bash
npm install
npm run check          # builds dist/ and checks it
npm run serve          # http://127.0.0.1:4960/, serving dist/
```

The build (`scripts/build.mjs`) turns every screenshot into WebP at 720 and 1440 pixels wide, self-hosts the fonts from `@fontsource-variable`, makes the 1200×630 share card (`og.jpg`) from the banner, and names every asset by its content hash under `/assets/` so it can be cached for good. `scripts/check.mjs` fails if the page names a file that was not built, loads anything from another origin, lacks its Open Graph tags or grows past its first-view budget.

## Content

| What | Where it comes from |
| --- | --- |
| Words, features, plugins, releases | `src/content.mjs` |
| Screenshots | each repository's README images, in `assets/screenshots/<repo>/<path>` |
| Wheelhouse stills | dark-mode screenshots of the demo crew from the guide's `stills` pass (`npm run guide -- stills` in the Wheelhouse repo), in `assets/screenshots/guide/` |
| Banner | the Wheelhouse README's banner, `assets/banner.png` |
| Tutorial, captions and poster | narrated Docket feature walkthrough captured from an isolated fake fleet; see [production record and music licence](docs/tutorial-production.md), `assets/video/tour.*` and `tour-poster.jpg` |
| Short clips | earlier dark-mode guide recordings on a demo crew, `assets/video/clip-*` |

To refresh the screenshots and banner from GitHub, run `npm run screenshots`, look at the diff and commit it; it leaves the stills alone. A new screenshot or plugin goes in `src/content.mjs` first.

## Deploy

The site runs on the k3s cluster as namespace `wheelhouse-site`: nginx (`deploy/Dockerfile`, `deploy/nginx.conf`) behind Traefik, with a Let's Encrypt certificate from cert-manager's `letsencrypt` ClusterIssuer (`deploy/k8s/site.yaml`). Two replicas run with a PodDisruptionBudget (at least one always available), and a rolling update starts a new pod and waits for it to be ready before stopping an old one (`maxUnavailable: 0`), so a deploy never takes the site down.

The Build workflow builds and checks the site, and builds and smoke-tests the image, on every pull request and every push to `main`. On a push to `main`, once both pass, its `deploy` job runs `deploy/scripts/deploy.sh`, which builds the image for linux/amd64, streams it to the node over SSH, applies the manifest through the node's `wheelhouse-site-deploy` gate (`deploy/node/wheelhouse-site-deploy`), waits for the rollout and checks that https://wheelhouse.chrisjowen.net redirects to https://fleetyard.io. The CI key can only run that gate's `version`, `import` and `apply` verbs, and `apply` refuses anything outside the `wheelhouse-site` namespace, so the Kubernetes API stays closed to the internet. A commit that is no longer the tip of `main` is skipped. The same script deploys from a laptop with root SSH to the node (`NODE_SSH`, default `root@72.62.255.106`).

### Turning on deploys from CI

Nothing deploys from CI until these are set on the GitHub repository:

| Name | Kind | What it is |
| --- | --- | --- |
| `NODE_SSH_KEY` | secret of the `production` environment | the private half of the deploy key |
| `DEPLOY_HOST_KNOWN_HOSTS` | repository variable | the node's known_hosts line (`ssh-keyscan -t ed25519 72.62.255.106`), which pins its host key |
| `DEPLOY_ENABLED` | repository variable | `true` to deploy on every push to `main` |

1. On a trusted machine, `ssh-keygen -t ed25519 -N '' -C wheelhouse-site-deploy -f wheelhouse-site-deploy-key`. Commit `wheelhouse-site-deploy-key.pub` as `deploy/node/deploy-key.pub`, put the private half in the `production` environment (allow only `main`, no required reviewers, so merges deploy on their own) as `NODE_SSH_KEY`, then delete the local private key.
2. Store the `ssh-keyscan` line as `DEPLOY_HOST_KNOWN_HOSTS`.
3. Run `deploy/scripts/install-deploy-gate.sh` (needs root SSH to the node). It installs the gate as `/usr/local/bin/wheelhouse-site-deploy` and pins the deploy key to it with `restrict,command=...`. Rerun it whenever the gate or the key changes; `deploy.sh` refuses to deploy while the node's gate differs from the repository's.
4. Set `DEPLOY_ENABLED` to `true`.

To roll back, run `deploy/scripts/deploy.sh` from an earlier commit (the node keeps the last few images), or `kubectl -n wheelhouse-site rollout undo deploy/web`.

## License

MIT
