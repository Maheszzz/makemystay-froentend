#!/bin/bash
set -euo pipefail

# ===== CONFIG =====
EC2_USER="ubuntu"
EC2_HOST="ec2-35-154-207-200.ap-south-1.compute.amazonaws.com"
PEM_KEY="/Users/maheswaranm/Downloads/makemystayrealty.pem"

APP_NAME="react-app"
REMOTE_DIR="/var/www/$APP_NAME"

# ===== BUILD REACT (PRODUCTION) =====
echo "🔨 Building React app with .env.production..."

if [ ! -f ".env.production" ]; then
  echo "❌ .env.production not found!"
  exit 1
fi

npm ci
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
ssh -T -i "$PEM_KEY" $EC2_USER@$EC2_HOST << EOF
sudo apt update -y
sudo apt install -y nginx
sudo mkdir -p $REMOTE_DIR
sudo rm -rf $REMOTE_DIR/*
EOF

# ===== UPLOAD BUILD =====
echo "🚀 Uploading build to EC2..."
scp -i "$PEM_KEY" -r $BUILD_DIR/* $EC2_USER@$EC2_HOST:/tmp/$APP_NAME/

ssh -T -i "$PEM_KEY" $EC2_USER@$EC2_HOST << EOF
sudo cp -r /tmp/$APP_NAME/* $REMOTE_DIR/
sudo chown -R www-data:www-data $REMOTE_DIR
sudo rm -rf /tmp/$APP_NAME
sudo systemctl restart nginx
EOF

echo "✅ React production deploy complete!"
