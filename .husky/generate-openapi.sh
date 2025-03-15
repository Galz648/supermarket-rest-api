#!/usr/bin/env sh

echo "🔄 Generating OpenAPI specification and types..."

# Check if backend is running by making a request to the API docs endpoint
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/docs-json | grep -q "200"; then
  echo "✅ Backend is running, generating types and HTTP client..."
  bun run generate-types
  bun run generate-client
  
  # Add the generated types to the commit if they exist and have changed
  if [ -f "shared/types/api.d.ts" ]; then
    git add shared/types/api.d.ts
    echo "✅ OpenAPI types generated and added to commit."
  else
    echo "⚠️ OpenAPI types file not found after generation."
  fi
  
  # Add the generated client to the commit if it exists and has changed
  if [ -f "redis-queue/api-client/client.ts" ]; then
    git add redis-queue/api-client/client.ts
    git add redis-queue/api-client/index.ts
    echo "✅ HTTP client generated and added to commit."
  else
    echo "⚠️ HTTP client file not found after generation."
  fi
else
  echo "⚠️ Backend is not running. OpenAPI types and HTTP client cannot be generated."
  echo "⚠️ Please start the backend with 'bun run backend:dev' to generate types and client."
  echo "⚠️ Continuing without generating OpenAPI types and HTTP client..."
fi 
