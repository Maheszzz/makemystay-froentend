#!/usr/bin/env bash
# Push Next.js nginx config to all hosts in .deploy.env
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
IFS=',' read -ra HOSTS <<< "${DEPLOY_HOST:?Set DEPLOY_HOST in .deploy.env}"
CONF="$ROOT/deploy/nginx-makemystay-all.conf"

for HOST in "${HOSTS[@]}"; do
  HOST=$(echo "$HOST" | xargs)
  echo "📡 $HOST"
  scp -o StrictHostKeyChecking=no -i "$PEM_KEY" "$CONF" "ubuntu@$HOST:/tmp/makemystay_all.conf"
  ssh -o StrictHostKeyChecking=no -i "$PEM_KEY" "ubuntu@$HOST" \
    'sudo cp /tmp/makemystay_all.conf /etc/nginx/sites-available/makemystay_all && \
     sudo ln -sf /etc/nginx/sites-available/makemystay_all /etc/nginx/sites-enabled/makemystay_all && \
     sudo nginx -t && sudo systemctl reload nginx'
done
echo "✅ nginx → proxy_pass :3000 on all hosts"
