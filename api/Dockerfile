FROM node:20-alpine

WORKDIR /app

# Install OpenSSL and other required libraries for Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

# Copy package files
COPY api/package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy API source code
COPY api/src ./src
COPY api/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Default command (can be overridden)
CMD ["node", "dist/index.js"]

