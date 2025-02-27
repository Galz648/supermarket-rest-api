# Israeli Supermarket Data Query API

![Supermarket API](https://img.shields.io/badge/API-Supermarket%20Data-blue)
![NestJS](https://img.shields.io/badge/framework-NestJS-red)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![Version](https://img.shields.io/badge/version-0.1.0-orange)

A modern API for querying Israeli supermarket data, built with NestJS and MongoDB.

## 📋 Project Status

**Current Stage**: Early Development

This project is currently in the initial development phase. The basic architecture is in place, but many features are still being implemented.

## 🏗️ Architecture

The project follows a modular architecture using NestJS:

```
backend/
├── prisma/                  # Database schema and migrations
├── src/
│   ├── app.controller.ts    # Main app controller
│   ├── app.module.ts        # Main app module
│   ├── app.service.ts       # Main app service
│   ├── main.ts              # Application entry point
│   ├── items/               # Items module
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── items.controller.ts
│   │   ├── items.module.ts
│   │   └── items.service.ts
│   ├── chains/        # Chains module
│   └── prisma/              # Prisma service
└── test/                    # E2E tests
```


## 💾 Data Model (Roughly)

```
┌─────────┐       ┌───────┐       ┌───────┐
│  Chain  │       │ Store │       │ Item  │
├─────────┤       ├───────┤       ├───────┤
│ id      │       │ id    │       │ id    │
│ name    │◄──────┤chainId│       │ name  │
└─────────┘       │ name  │       │ unit  │
                  │location│      │category│
                  └───┬───┘       │ brand │
                      │           └───┬───┘
                      │               │
                      └─────┐   ┌─────┘
                            ▼   ▼
                         ┌──────────┐
                         │  Price   │
                         ├──────────┤
                         │ id       │
                         │ itemId   │
                         │ storeId  │
                         │ price    │
                         │ currency │
                         │ timestamp│
                         └──────────┘
```


## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/supermarket-query-api.git
cd supermarket-query-api
```


2. Install dependencies
```bash
npm install
```


3. Set up environment variables
```bash
# Create a .env file in the root directory with:
DATABASE_URL="mongodb://localhost:27017/supermarket-query"
PORT=3000
```


4. Generate Prisma client
```bash
npx prisma generate
```


5. Start the development server
```bash
npm run start:dev
```


6. Access the Swagger documentation
```
http://localhost:3000/api/docs
```


## 📝 API Endpoints

### Base
- `GET /` - API information and status

### Items
- `GET /items` - List items with pagination
- `GET /items/:id` - Get item details
- `GET /items/search` - Search for items
- `POST /items` - Create a new item
- `PATCH /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item

### Supermarkets (Planned)
- `GET /supermarkets` - List all supermarkets
- `GET /supermarkets/:id` - Get supermarket details
- `GET /supermarkets/nearby` - Find nearby supermarkets
- `POST /supermarkets` - Create a new supermarket
- `PATCH /supermarkets/:id` - Update a supermarket
- `DELETE /supermarkets/:id` - Delete a supermarket

## 📋 TODO List

### High Priority
- [ ] Implement Chain controller and service
- [ ] Implement Store controller and service
- [ ] Implement Price controller and service
- [ ] Create database seeding scripts
- [ ] Write unit tests for existing services
- [ ] Write e2e tests for API endpoints

### Medium Priority
- [ ] Add authentication system
- [ ] Implement CSV import functionality
- [ ] Add price history tracking
- [ ] Implement geospatial queries for store locations
- [ ] Add caching layer

### Low Priority
- [ ] Create admin dashboard
- [ ] Implement rate limiting
- [ ] Add analytics endpoints
- [ ] Set up CI/CD pipeline
- [ ] Create Docker configuration

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```


## 📚 Documentation

API documentation is available via Swagger at `/api/docs` when the server is running.

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

Built with ❤️ using NestJS, Prisma, and MongoDB
