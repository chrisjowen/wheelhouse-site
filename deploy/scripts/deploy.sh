#!/usr/bin/env bash
# Builds the site's image, imports it into the k3s node's containerd over SSH and applies
# deploy/k8s/site.yaml with it, all through the node's wheelhouse-site-deploy gate, so the
# Kubernetes API is never reached from here. Then checks the live site. The Build workflow runs
# this on every push to main; it also runs from a laptop with SSH to the node.
#
#   NODE_SSH       ssh target of the k3s node (default root@72.62.255.106)
#   ALLOW_DIRTY=1  deploy a working tree with uncommitted changes
set -euo pipefail

repo=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
node_ssh=${NODE_SSH:-root@72.62.255.106}
host=wheelhouse.chrisjowen.net

if [[ -n $(git -C "$repo" status --porcelain) && ${ALLOW_DIRTY:-} != 1 ]]; then
  echo "deploy: the working tree has uncommitted changes (set ALLOW_DIRTY=1 to deploy anyway)" >&2
  exit 1
fi
tag=$(git -C "$repo" rev-parse --short=12 HEAD)
[[ -z $(git -C "$repo" status --porcelain) ]] || tag="$tag-dirty"
image="wheelhouse-site:$tag"

want=$( (sha256sum 2>/dev/null || shasum -a 256) <"$repo/deploy/node/wheelhouse-site-deploy" | cut -d' ' -f1)
have=$(ssh "$node_ssh" wheelhouse-site-deploy version)
[[ $have == "$want" ]] || {
  echo "deploy: wheelhouse-site-deploy on $node_ssh differs from deploy/node/wheelhouse-site-deploy; run deploy/scripts/install-deploy-gate.sh" >&2
  exit 1
}

echo "deploy: building $image (linux/amd64)"
docker buildx build --platform linux/amd64 -f "$repo/deploy/Dockerfile" -t "$image" --load "$repo"

echo "deploy: importing $image into $node_ssh"
docker save "$image" | ssh "$node_ssh" wheelhouse-site-deploy import

echo "deploy: applying on $node_ssh"
# shellcheck disable=SC2029 # the tag is meant for the node
ssh "$node_ssh" wheelhouse-site-deploy apply "$tag" <"$repo/deploy/k8s/site.yaml"

echo "deploy: checking https://$host/"
for i in $(seq 1 30); do
  if curl -fsS --max-time 10 -o /dev/null "https://$host/healthz"; then break; fi
  [[ $i != 30 ]] || { echo "deploy: https://$host/ is not answering over a valid certificate" >&2; exit 1; }
  sleep 10
done
# The site has moved to Fleetyard: the ingress answers every path with a 301 there.
to=$(curl -fsS --max-time 10 -o /dev/null -w '%{http_code} %{redirect_url}' "https://$host/tour/")
[[ $to == "301 https://fleetyard.io/tour" ]] || { echo "deploy: https://$host/tour/ does not redirect to https://fleetyard.io/tour ($to)" >&2; exit 1; }
to=$(curl -fsS --max-time 10 -o /dev/null -w '%{http_code} %{redirect_url}' "https://$host/")
[[ $to == "301 https://fleetyard.io/" ]] || { echo "deploy: https://$host/ does not redirect to https://fleetyard.io/ ($to)" >&2; exit 1; }
echo "deploy: $image is live; https://$host/ redirects to https://fleetyard.io/"
