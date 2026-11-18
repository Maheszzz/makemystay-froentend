#!/usr/bin/env bash
# Install makemystay-next.service on all production hosts from .deploy.env
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DEPLOY_ENV_FILE=".deploy.env"
[[ -f "$DEPLOY_ENV_FILE" ]] || { echo "Missing $DEPLOY_ENV_FILE"; exit 1; }
set -a
# shellcheck source=/dev/null
source "$DEPLOY_ENV_FILE"
set +a

PEM_KEY="${PEM_KEY:?Set PEM_KEY in .deploy.env}"
DEPLOY_HOST="${DEPLOY_HOST:?Set DEPLOY_HOST in .deploy.env}"
DEPLOY_USER="${DEPLOY_USER:-ubuntu}"
APP_DIR="${DEPLOY_PATH:-/var/www/react-app}"

IFS=',' read -ra HOSTS <<< "$DEPLOY_HOST"
for HOST in "${HOSTS[@]}"; do
  HOST=$(echo "$HOST" | xargs)
  echo "📦 Installing systemd on $HOST..."
  ssh -o StrictHostKeyChecking=no -i "$PEM_KEY" "$DEPLOY_USER@$HOST" \
    "sudo APP_DIR='$APP_DIR' bash -s" < "$ROOT/deploy/install-next-on-ec2.sh"
done

echo "✅ Done on all hosts"
