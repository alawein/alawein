# Meta-Orchestration Master API Server
# Multi-stage build for minimal production image
"# Meta-Orchestration Master API Server
# Multi-stage build for production

# ============================================================================
# Stage 1: Build
# ============================================================================
FROM node:20-alpine AS builder
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++
# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install all dependencies (including devDependencies for build)
RUN npm ci
# Environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Copy source files
COPY tools/ ./tools/
COPY .ai/ ./.ai/
COPY .metaHub/ ./.metaHub/
# Build the application
RUN npm run build

# Build TypeScript (if needed)
RUN npm run type-check || true

# ============================================================================
# Stage 2: Production
# ============================================================================
FROM node:20-alpine AS production

LABEL maintainer="Meta-Orchestration Master"
LABEL description="AI Governance REST API Server"
LABEL version="1.0.0"

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy package files
COPY package*.json ./
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install production dependencies only
RUN npm ci --omit=dev && \
    npm cache clean --force
COPY --from=builder /app/public ./public

# Copy built application
COPY --from=builder /app/tools/ ./tools/
COPY --from=builder /app/.ai/ ./.ai/
COPY --from=builder /app/.metaHub/ ./.metaHub/
# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Create necessary directories
RUN mkdir -p .ai/cache .ai/config .ai/reports && \
    chown -R nodejs:nodejs /app
# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./ 
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nodejs
USER nextjs

# Environment variables
ENV NODE_ENV=production
ENV AI_API_PORT=3200
ENV RATE_LIMIT_MAX=100
ENV API_AUTH_REQUIRED=true
EXPOSE 3000

# Expose API port
EXPOSE 3200
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3200/health || exit 1

# Start the API server
CMD ["npx", "tsx", "tools/ai/api/server.ts"]

CMD ["node", "server.js"]
