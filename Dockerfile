# ===================================================
# SkillBridge Production Multi-Stage Dockerfile
# ===================================================

# Stage 1: Build Frontend Static Assets
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Stage 2: Production Backend Runner
FROM node:20-alpine AS production
WORKDIR /app

# Install production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source & database migrations
COPY backend ./backend

# Copy built frontend static bundle into backend public directory
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Security: Non-root user
USER node

# Expose API Port
EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "backend/server.js"]
