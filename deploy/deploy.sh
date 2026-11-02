#!/usr/bin/env bash
# Builds the site's image, imports it into the k3s node's containerd over SSH, applies the
# manifests with that image, waits for the rollout and checks the live site.
#
# Usage: deploy/deploy.sh
# Needs: docker (with linux/amd64 builds), ssh access to the node, kubectl.
#   KUBECONFIG   the cluster's kubeconfig (default ~/.kube/hostinger-k3s.yaml)
#   DEPLOY_SSH   the node, as user@host (default root@72.62.255.106)
set -euo pipefail

cd "$(dirname "$0")/.."
export KUBECONFIG="${KUBECONFIG:-$HOME/.kube/hostinger-k3s.yaml}"
DEPLOY_SSH="${DEPLOY_SSH:-root@72.62.255.106}"
HOST=wheelhouse.chrisjowen.net
NS=wheelhouse-site

tag="$(date -u +%Y%m%d%H%M%S)-$(git rev-parse --short HEAD)"
[ -z "$(git status --porcelain)" ] || tag="$tag-dirty"
image="wheelhouse-site:$tag"

echo "→ building $image"
docker build --platform linux/amd64 -f deploy/Dockerfile -t "$image" .

echo "→ importing it on $DEPLOY_SSH"
docker save "$image" | ssh "$DEPLOY_SSH" k3s ctr images import -

echo "→ applying deploy/k8s/site.yaml"
sed "s|image: wheelhouse-site:latest|image: $image|" deploy/k8s/site.yaml | kubectl apply -f -
kubectl -n "$NS" rollout status deploy/web --timeout=180s

echo "→ checking https://$HOST/"
for i in $(seq 1 30); do
	if curl -fsS -o /dev/null "https://$HOST/healthz"; then break; fi
	[ "$i" = 30 ] && { echo "https://$HOST/ is not answering over a valid certificate" >&2; exit 1; }
	sleep 10
done
curl -fsS "https://$HOST/" | grep -q '<title>Wheelhouse' || { echo "https://$HOST/ does not serve the site" >&2; exit 1; }
echo "✓ https://$HOST/ serves $image"
