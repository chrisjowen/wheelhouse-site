# wheelhouse-site

Source for https://wheelhouse.chrisjowen.net, the Wheelhouse product site: the pitch, the video tour and clips, every feature, every plugin, getting started and the releases.

It is one static page, rendered at build time from `src/content.mjs`, with a little JavaScript for the theme switch, chapters, feature index, plugin filters and screenshot lightbox. Without JavaScript everything still reads.

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
| Banner | the Wheelhouse README's banner, `assets/banner.png` |
| Tour and clips | recorded with `npm run guide` in the Wheelhouse repo, `assets/video/` |

To refresh the screenshots and banner from GitHub, run `npm run screenshots`, look at the diff and commit it. A new screenshot or plugin goes in `src/content.mjs` first.

## Deploy

The site runs on the k3s cluster as namespace `wheelhouse-site`: nginx (`deploy/Dockerfile`, `deploy/nginx.conf`) behind Traefik, with a Let's Encrypt certificate from cert-manager's `letsencrypt` ClusterIssuer (`deploy/k8s/site.yaml`).

```bash
deploy/deploy.sh
```

builds the image for linux/amd64, imports it into the node's containerd over SSH (`k3s ctr images import`), applies the manifests with that image, waits for the rollout and checks https://wheelhouse.chrisjowen.net. `KUBECONFIG` (default `~/.kube/hostinger-k3s.yaml`) and `DEPLOY_SSH` (default `root@72.62.255.106`) override where it goes.

The Build workflow builds and checks the site, and builds and smoke-tests the image, on every pull request.

## License

MIT
