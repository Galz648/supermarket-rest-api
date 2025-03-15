# Shared API Types

This directory contains TypeScript type definitions automatically generated from the NestJS OpenAPI schema.

## How it works

1. The types are generated from the NestJS backend's OpenAPI/Swagger schema
2. The generation happens automatically on pre-commit using Husky
3. These types can be imported by both the backend and message-queue-consumer

## Manual generation

If you need to manually generate the types, you can run:

```bash
# Make sure the backend is running first
bun run backend:dev

# In another terminal
bun run generate-types
```

## Usage in code

```typescript
// Import types in your code
import type { components } from '../../shared/types/api';

// Use the generated types
const item: components['schemas']['Item'] = {
  // ...
};
``` 
