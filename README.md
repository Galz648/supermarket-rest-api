

# Israeli Supermarket Data Query Project

![Supermarket API](https://img.shields.io/badge/API-Supermarket%20Data-blue)
![NestJS](https://img.shields.io/badge/backend-NestJS-red)
![React](https://img.shields.io/badge/frontend-React-61dafb)
![MongoDB](https://img.shields.io/badge/database-MongoDB-green)
![Version](https://img.shields.io/badge/version-0.1.0-orange)

A full-stack application for querying and comparing prices across Israeli supermarkets.

## 📋 Project Overview

This project provides a platform for consumers to:
- Find supermarkets by location
- Search for products and compare prices across stores
- View price history and trends
- Create shopping lists and find the best deals

The application consists of a NestJS backend API with MongoDB database and a React frontend interface.

## 🏗️ Project Structure

```
supermarket-query/
├── backend/                 # NestJS API
│   ├── prisma/              # Database schema and migrations
│   ├── src/                 # API source code
│   └── test/                # API tests
└── README.md                # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

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
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Generate Prisma client
npx prisma generate

# Start the backend server
npm run start:dev
```
4. Access the application
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs

## 🔄 Development Workflow

### Running Both Services

You can run both the frontend and backend concurrently using:

```bash
# From the project root
npm run dev
```

### Testing

```bash
# Backend tests
cd backend
npm test


## 📱 Features

### Current Features
- Basic supermarket and product data model
- API endpoints for CRUD operations

## 🧪 Technology Stack

### Backend
- NestJS framework
- MongoDB with Prisma ORM
- TypeScript
- Swagger for API documentation

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
