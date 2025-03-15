#!/usr/bin/env sh

echo "🔄 Generating Prisma client..."

# Navigate to the backend directory
cd backend

# Run the Prisma generate command
bun run prisma:generate

# Check if the command was successful
if [ $? -eq 0 ]; then
  echo "✅ Prisma client generated successfully!"
  cd ..
  exit 0
else
  echo "❌ Failed to generate Prisma client"
  cd ..
  exit 1
fi 
