# Israeli Supermarket Data Query Project

![Supermarket API](https://img.shields.io/badge/API-Supermarket%20Data-blue)
![NestJS](https://img.shields.io/badge/backend-NestJS-red)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![Version](https://img.shields.io/badge/version-0.1.0-orange)

A backend application for querying and comparing prices across Israeli supermarkets.

## 📋 Project Overview

This project provides a platform for consumers to:
- Find supermarkets by location
- Search for products and compare prices across stores
- View price history and trends
- Create shopping lists and find the best deals

The application consists of a NestJS backend API with MongoDB database and a message queue consumer.

## 🏗️ Project Structure

```
supermarket-query/
├── backend/                 # NestJS API
│   ├── prisma/              # Database schema and migrations
│   ├── src/                 # API source code
│   └── test/                # API tests
├── message-queue-consumer/  # Message queue consumer
├── shared/                  # Shared resources
│   └── types/               # Shared TypeScript types
│       ├── api.d.ts         # Generated API types
│       └── index.ts         # Type re-exports for easier imports
└── scripts/                 # Utility scripts
    └── generate-types.ts    # Script to generate types from OpenAPI schema
```

## 🔄 Type Generation

This project provides scripts to generate TypeScript types from the NestJS OpenAPI schema. This ensures that the message queue consumer and other components have access to the latest API types.

### How it works

1. Run `bun run generate-types` to generate the TypeScript types
2. It fetches the OpenAPI schema from the backend (ensure the backend is running)
3. It generates TypeScript types in the `shared/types` directory

### Manual type generation

To manually generate types:

```bash
# Start the backend if it's not running
bun run backend:dev

# In another terminal, run the type generation script
bun run generate-types
```

### Using the generated types

You can import the types in multiple ways:

#### Using dot notation (recommended)

```typescript
// Import specific types directly
import { Item, Chain } from '@shared/types';

// Use the imported types
const item: Item = {
  // ...
};
```

#### Using the components namespace

```typescript
// Import the components namespace
import { components } from '@shared/types';

// Use the types from the namespace
const item: components['schemas']['Item'] = {
  // ...
};
```

To enable the `@shared` path alias, add this to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  }
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Bun runtime

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd supermarket-query
```

2. Set up the backend
```bash
# Navigate to backend directory
cd backend

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Generate Prisma client
bun run prisma:generate

# Start the backend server
bun run start:dev
```

3. Access the application
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs

## 🔄 Development Workflow

### Running Services

You can run both the backend and message queue consumer using:

```bash
# From the project root
bun run backend:dev
bun run consumer:dev
```

### Testing

```bash
# Backend tests
cd backend
bun test
```

## 📱 Features

### Current Features
- Basic supermarket and product data model
- API endpoints for CRUD operations
- Message queue consumer for processing data

## 🧪 Technology Stack

### Backend
- NestJS framework
- MongoDB with Prisma ORM
- TypeScript
- Swagger for API documentation
- Bun runtime

### Message Queue Consumer
- Bun runtime
- Redis for message queue

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ to help Israeli consumers find the best deals
