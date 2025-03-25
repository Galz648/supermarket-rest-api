FROM oven/bun:latest

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy source files
COPY *.ts ./
COPY .env* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Set environment variables
ENV NODE_ENV=production

# Run the application
CMD ["bun", "index.ts"] 
