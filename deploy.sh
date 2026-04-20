#!/usr/bin/env bash

set -e

# -----------------------------
# ENVIRONMENT SELECTION
# -----------------------------
ENV=${1:-production}
ENV_FILE=".env.$ENV"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Environment file $ENV_FILE not found"
  exit 1
fi

# Load env file
export $(grep -v '^#' "$ENV_FILE" | xargs)

# -----------------------------
# DEFAULTS
# -----------------------------
DEPLOY_USER=${DEPLOY_USER:-ubuntu}
DEPLOY_GROUP=${DEPLOY_GROUP:-$DEPLOY_USER}
PEM_KEY=${PEM_KEY:-"$HOME/.ssh/mmsr_deploy_key.pem"}
# Sync built static assets only (nginx root). Set DEPLOY_SOURCE=. to rsync the whole repo (legacy).
DEPLOY_SOURCE=${DEPLOY_SOURCE:-dist}
# If true, run sudo mkdir + chown on DEPLOY_PATH before rsync so ubuntu can replace root-owned files.
REMOTE_PREP_OWNERSHIP=${REMOTE_PREP_OWNERSHIP:-true}
DRY_RUN=${DRY_RUN:-false}

# -----------------------------
# VALIDATION
# -----------------------------
if [[ -z "$DEPLOY_HOST" || -z "$DEPLOY_PATH" ]]; then
  echo "❌ Missing required variables (DEPLOY_HOST / DEPLOY_PATH)"
  exit 1
fi

if [[ ! -f "$PEM_KEY" ]]; then
  # It might be an absolute path or relative to home. Let's strictly check.
  # The original script does this so we'll keep it.
  echo "❌ PEM key not found: $PEM_KEY"
  exit 1
fi

# -----------------------------
# FLAGS
# -----------------------------
RSYNC_FLAGS="-avz --delete"
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=60"

if [[ "$DRY_RUN" == true ]]; then
  echo "🧪 DRY RUN MODE"
  RSYNC_FLAGS="$RSYNC_FLAGS --dry-run"
fi

# -----------------------------
# INFO
# -----------------------------
echo "🚀 Deploying to $ENV"
echo "Host: $DEPLOY_HOST"
echo "Path: $DEPLOY_PATH"

# -----------------------------
# BUILD STEP
# -----------------------------
echo "📦 Building..."

# Example (uncomment if needed)
npm ci
npm run build

# -----------------------------
# UPLOAD
# -----------------------------
if [[ "$DEPLOY_SOURCE" != "." && ! -d "$DEPLOY_SOURCE" ]]; then
  echo "❌ Build output not found: $DEPLOY_SOURCE (run npm run build first)"
  exit 1
fi

echo "📤 Syncing files (${DEPLOY_SOURCE}/ → $DEPLOY_PATH)..."

if [[ "$REMOTE_PREP_OWNERSHIP" == true && "$DRY_RUN" != true ]]; then
  echo "🔐 Ensuring deploy user can write $DEPLOY_PATH (sudo on server)..."
  ssh $SSH_OPTS -i "$PEM_KEY" "$DEPLOY_USER@$DEPLOY_HOST" \
    "sudo mkdir -p '$DEPLOY_PATH' && sudo chown -R $DEPLOY_USER:$DEPLOY_GROUP '$DEPLOY_PATH'"
fi

RSYNC_FROM="./"
if [[ "$DEPLOY_SOURCE" != "." ]]; then
  RSYNC_FROM="${DEPLOY_SOURCE}/"
fi

rsync $RSYNC_FLAGS \
  -e "ssh $SSH_OPTS -i $PEM_KEY" \
  --exclude '.git' \
  --exclude 'node_modules' \
  "$RSYNC_FROM" "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH"

# -----------------------------
# REMOTE EXECUTION
# -----------------------------
echo "⚙️ Running remote commands..."

ssh $SSH_OPTS -i "$PEM_KEY" "$DEPLOY_USER@$DEPLOY_HOST" << EOF
  set -e

  cd $DEPLOY_PATH

  echo "📦 Installing dependencies..."
  # npm ci --production

  echo "🔁 Restarting app..."
  # pm2 reload app || pm2 start ecosystem.config.js

  echo "✅ Server updated"
EOF

echo "🎉 Deployment SUCCESS"
