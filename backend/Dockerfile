# Development stage
FROM oven/bun:latest AS development
WORKDIR /app

# Install Node.js and development tools
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g @nestjs/cli prisma

# Copy package files and install dependencies
COPY package.json ./
RUN bun install

# Copy Prisma schema
COPY prisma ./prisma/
RUN bun prisma generate

# Expose port
EXPOSE 3000

# Production stage
FROM oven/bun:latest AS production
WORKDIR /app

# Create non-root user
RUN groupadd -r node && useradd -r -g node node \
    && chown -R node:node /app

# Copy package.json first for better layer caching
COPY --chown=node:node package.json ./
RUN bun install

# Copy Prisma schema
COPY --chown=node:node prisma ./prisma/

# Generate Prisma client
RUN bun prisma generate

# Copy the rest of the application
COPY --chown=node:node . .

# Switch to non-root user
USER node

CMD ["bun", "run", "start"]
