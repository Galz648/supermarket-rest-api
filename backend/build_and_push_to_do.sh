#!/bin/bash

set -e

IMAGE_NAME="backend-api"
IMAGE_TAG="v1.0.3"
REGISTRY="registry.digitalocean.com/israeli-supermarkets-container-registry"
FULL_IMAGE="$REGISTRY/$IMAGE_NAME:$IMAGE_TAG"

# Create and use builder if not exists
if ! docker buildx inspect xbuilder &>/dev/null; then
  docker buildx create --name xbuilder --use
else
  docker buildx use xbuilder
fi

docker buildx inspect --bootstrap

echo "🛠️ Building x86 (amd64) image..."
docker buildx build \
  --platform linux/amd64 \
  -t "$FULL_IMAGE" \
  . \
  --push

echo "🔍 Verifying image architecture..."
docker buildx imagetools inspect "$FULL_IMAGE" | grep -q "linux/amd64" \
  && echo "✅ Image is amd64!" \
  || (echo "❌ Image is NOT amd64!" && exit 1)
