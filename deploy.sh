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
PEM_KEY=${PEM_KEY:-"$HOME/.ssh/mmsr_deploy_key.pem"}
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
echo "📤 Syncing files..."

rsync $RSYNC_FLAGS \
  -e "ssh -i $PEM_KEY" \
  --exclude '.git' \
  --exclude 'node_modules' \
  ./ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH"

# -----------------------------
# REMOTE EXECUTION
# -----------------------------
echo "⚙️ Running remote commands..."

ssh -i "$PEM_KEY" "$DEPLOY_USER@$DEPLOY_HOST" << EOF
  set -e

  cd $DEPLOY_PATH

  echo "📦 Installing dependencies..."
  # npm ci --production

  echo "🔁 Restarting app..."
  # pm2 reload app || pm2 start ecosystem.config.js

  echo "✅ Server updated"
EOF

echo "🎉 Deployment SUCCESS"
