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

# ===== PREPARE EC2 =====
echo "🧹 Preparing EC2..."
ssh -T -o ConnectTimeout=20 -o StrictHostKeyChecking=no -i "$PEM_KEY" $EC2_USER@$EC2_HOST << EOF
sudo mkdir -p $REMOTE_DIR
sudo rm -rf $REMOTE_DIR/*
mkdir -p /tmp/$APP_NAME
EOF

# ===== UPLOAD BUILD =====
echo "🚀 Uploading build to EC2..."
scp -o ConnectTimeout=20 -o StrictHostKeyChecking=no -i "$PEM_KEY" -r $BUILD_DIR/* $EC2_USER@$EC2_HOST:/tmp/$APP_NAME/

ssh -T -o ConnectTimeout=20 -o StrictHostKeyChecking=no -i "$PEM_KEY" $EC2_USER@$EC2_HOST << EOF
sudo cp -r /tmp/$APP_NAME/* $REMOTE_DIR/
sudo chown -R www-data:www-data $REMOTE_DIR
sudo rm -rf /tmp/$APP_NAME
sudo systemctl restart nginx
EOF

echo "✅ React production deploy complete!"
