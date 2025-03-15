#!/usr/bin/env sh

echo "🔄 Generating OpenAPI specification and types..."

# Check if backend is running by making a request to the API docs endpoint
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/docs-json | grep -q "200"; then
  echo "✅ Backend is running, generating types..."
  bun run generate-types
  
  # Add the generated types to the commit if they exist and have changed
  if [ -f "shared/types/api.d.ts" ]; then
    git add shared/types/api.d.ts
    echo "✅ OpenAPI types generated and added to commit."
  else
    echo "⚠️ OpenAPI types file not found after generation."
  fi
else
  echo "⚠️ Backend is not running. OpenAPI types cannot be generated."
  echo "⚠️ Please start the backend with 'bun run backend:dev' to generate types."
  echo "⚠️ Continuing without generating OpenAPI types..."
fi 
