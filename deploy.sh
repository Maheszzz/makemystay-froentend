#!/bin/bash
set -euo pipefail

# ===== CONFIG =====
EC2_USER="ubuntu"
# Must match makemystay instance public DNS (changes after stop/start unless Elastic IP)
EC2_HOST="ec2-3-109-47-194.ap-south-1.compute.amazonaws.com"
PEM_KEY="/Users/maheswaranm/Downloads/makemystayrealty.pem"

APP_NAME="react-app"
REMOTE_DIR="/var/www/$APP_NAME"

# ===== BUILD REACT (PRODUCTION) =====
echo "🔨 Building React app with .env.production..."

if [ ! -f ".env.production" ]; then
  echo "❌ .env.production not found!"
  exit 1
fi

npm ci --legacy-peer-deps
npm run build -- --mode production

# ===== DETECT BUILD DIR =====
if [ -d "dist" ]; then
  BUILD_DIR="dist"     # Vite
elif [ -d "build" ]; then
  BUILD_DIR="build"    # CRA
else
  echo "❌ Build folder not found"
  exit 1
fi

echo "📦 Using build folder: $BUILD_DIR"

# Local sanity: entry script + logo must exist (avoids shipping a broken dist)
ENT=$(grep -oE '/assets/[^"<> ]+\.js' "$BUILD_DIR/index.html" | head -1)
if [ -z "$ENT" ] || [ ! -f "$BUILD_DIR$ENT" ]; then
  echo "❌ dist/index.html entry chunk missing locally (broken build?)"
  exit 1
fi
JS_N=$(find "$BUILD_DIR/assets" -maxdepth 1 -name '*.js' 2>/dev/null | wc -l | tr -d ' ')
if [ "${JS_N:-0}" -lt 5 ]; then
  echo "❌ dist/assets has too few .js files ($JS_N) — incomplete build?"
  exit 1
fi

# Staging dir on server (avoid emptying live dir — prevents white screen during deploy)
STAGING="/tmp/${APP_NAME}-build-$$"

# ===== PREPARE EC2 =====
echo "🧹 Preparing EC2 staging..."
ssh -T -o ConnectTimeout=20 -o StrictHostKeyChecking=no -i "$PEM_KEY" $EC2_USER@$EC2_HOST "mkdir -p $STAGING && rm -rf $STAGING/*"

# ===== UPLOAD BUILD (rsync: reliable for many hashed chunks; scp * can skip files) =====
RSYNC_RSH="ssh -o ConnectTimeout=60 -o StrictHostKeyChecking=no -i $PEM_KEY"
echo "🚀 Uploading build to EC2 (rsync)..."
rsync -az --delete --stats \
  -e "$RSYNC_RSH" \
  "$BUILD_DIR/" "$EC2_USER@$EC2_HOST:$STAGING/"

ssh -T -o ConnectTimeout=30 -o StrictHostKeyChecking=no -i "$PEM_KEY" $EC2_USER@$EC2_HOST << EOF
set -e
sudo mkdir -p $REMOTE_DIR
sudo rsync -a --delete $STAGING/ $REMOTE_DIR/
sudo chown -R www-data:www-data $REMOTE_DIR
IDX="$REMOTE_DIR/index.html"
ASSETS="$REMOTE_DIR/assets"
test -f "\$IDX" || { echo "❌ Missing index.html after sync"; exit 1; }
test -d "\$ASSETS" || { echo "❌ Missing assets/ after sync"; exit 1; }
ENT_REMOTE=\$(grep -oE '/assets/[^"<> ]+\\.js' "\$IDX" | head -1)
test -n "\$ENT_REMOTE" && test -f "$REMOTE_DIR\$ENT_REMOTE" || { echo "❌ Entry chunk missing on server — disk full or rsync failed?"; exit 1; }
JS_REMOTE=\$(find "\$ASSETS" -maxdepth 1 -name '*.js' 2>/dev/null | wc -l | tr -d ' ')
test "\${JS_REMOTE:-0}" -ge 5 || { echo "❌ Too few JS files in assets/ (\$JS_REMOTE). Free disk space on EC2."; exit 1; }
rm -rf $STAGING
sudo nginx -t
sudo systemctl reload nginx
EOF

echo "✅ React production deploy complete!"
