# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Skip build since we use tsx
# RUN npm run build

# Stage 2: Production
FROM node:20-slim AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev --legacy-peer-deps

# Copy source code (since we run tsx)
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

# Copy uploads folder structure (if needed)
RUN mkdir -p uploads

# Environment variables (passed at runtime)
ENV NODE_ENV=production
ENV PORT=3002

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3002/api/v1/health || exit 1

# Start the server
CMD ["npm", "start"]
