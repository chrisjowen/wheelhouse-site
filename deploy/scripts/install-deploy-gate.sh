#!/usr/bin/env bash
# Prepare the k3s node for wheelhouse-site deploys, from a machine whose SSH key the node's root
# already accepts. Rerun it whenever deploy/node/wheelhouse-site-deploy or
# deploy/node/deploy-key.pub changes; it is idempotent.
#
# It installs deploy/node/wheelhouse-site-deploy as /usr/local/bin/wheelhouse-site-deploy and
# authorizes deploy/node/deploy-key.pub (the public half of the NODE_SSH_KEY secret of the
# production environment on GitHub) for root as
#
#   restrict,command="/usr/local/bin/wheelhouse-site-deploy" ssh-ed25519 ... wheelhouse-site-deploy
#
# restrict turns off forwarding and the pty; command= pins the key to the gate's verbs.
#
#   NODE_SSH  ssh target of the k3s node (default root@72.62.255.106)
set -euo pipefail

repo=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
node_ssh=${NODE_SSH:-root@72.62.255.106}

[[ -f $repo/deploy/node/deploy-key.pub ]] || {
  echo "install-deploy-gate: deploy/node/deploy-key.pub is missing; see the README's Deploy section" >&2
  exit 1
}
pubkey=$(cat "$repo/deploy/node/deploy-key.pub")
[[ $pubkey =~ ^ssh-ed25519\ [A-Za-z0-9+/=]+\ wheelhouse-site-deploy$ ]] || {
  echo "install-deploy-gate: deploy/node/deploy-key.pub is not an ed25519 key commented wheelhouse-site-deploy" >&2
  exit 1
}

echo "install-deploy-gate: /usr/local/bin/wheelhouse-site-deploy on $node_ssh"
ssh "$node_ssh" 'cat >/usr/local/bin/wheelhouse-site-deploy.new &&
  chmod 0755 /usr/local/bin/wheelhouse-site-deploy.new &&
  mv -f /usr/local/bin/wheelhouse-site-deploy.new /usr/local/bin/wheelhouse-site-deploy' <"$repo/deploy/node/wheelhouse-site-deploy"

echo "install-deploy-gate: authorizing the deploy key for root on $node_ssh"
# Replaces only the line commented wheelhouse-site-deploy; every other key stays.
entry=$(printf '%q' "restrict,command=\"/usr/local/bin/wheelhouse-site-deploy\" $pubkey")
# shellcheck disable=SC2016,SC2029 # the entry is quoted for, and the script expanded on, the node
ssh "$node_ssh" "bash -s -- $entry" <<'REMOTE'
set -euo pipefail
keys=/root/.ssh/authorized_keys
install -d -m 0700 /root/.ssh
touch "$keys"
{ grep -v ' wheelhouse-site-deploy$' "$keys" || true; printf '%s\n' "$1"; } >"$keys.new"
chmod 0600 "$keys.new"
mv -f "$keys.new" "$keys"
REMOTE

echo "install-deploy-gate: done; wheelhouse-site-deploy $(ssh "$node_ssh" wheelhouse-site-deploy version)"
