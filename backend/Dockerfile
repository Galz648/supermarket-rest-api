FROM oven/bun:latest
WORKDIR /app

# Copy package.json first for better layer caching
COPY package.json ./
RUN bun install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client with the specified binary targets
# Using bun directly to run prisma
RUN bun prisma generate

# Copy the rest of the application
COPY . .

CMD ["bun", "run", "start"]
