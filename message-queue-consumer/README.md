# Redis Message Queue Consumer

A TypeScript-based message queue consumer that processes messages from Redis streams and forwards them to the appropriate API endpoints.

## Features

- Uses Redis streams for reliable message queuing
- Built with RxJS for reactive programming
- Supports multiple message topics
- Runs on Bun runtime for high performance
- Automatically reconnects to Redis on connection loss
- Graceful shutdown handling

## Message Topics

The consumer supports the following message topics:

- `product-updates`: Updates product information
- `price-changes`: Updates product prices
- `inventory-updates`: Updates inventory levels

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) runtime
- Redis server

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```

3. Configure the environment variables in `.env` file:

```
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# API Configuration
API_ENDPOINT=http://localhost:3000

# Consumer Configuration
CONSUMER_POLL_INTERVAL=1000  # in milliseconds

# Topics Configuration
TOPICS=product-updates,price-changes,inventory-updates
```

### Running the Consumer

```bash
bun run index.ts
# or
bun start
```

### Testing with the Test Consumer (Publisher)

For testing purposes, a separate test utility called `test-consumer.ts` is provided. Despite its name, this utility actually **publishes** test messages to the Redis streams to test the real consumer:

```bash
bun run test-consumer.ts
# or
bun test-publish
```

This will publish sample messages to all configured topics and then exit. The actual consumer (running with `bun start`) will then process these messages.

## Docker

You can also run the consumer using Docker:

```bash
docker build -t message-queue-consumer .
docker run -d --name message-queue-consumer message-queue-consumer
```

## Message Format

### Product Updates

```json
{
  "id": "product-id",
  "data": {
    "name": "Product Name",
    "description": "Product Description",
    "category": "Category"
  }
}
```

### Price Changes

```json
{
  "id": "product-id",
  "price": 19.99,
  "priceDate": "2023-03-15T12:00:00Z"
}
```

### Inventory Updates

```json
{
  "id": "product-id",
  "quantity": 100,
  "storeId": "store-id"
}
```

## License

MIT
