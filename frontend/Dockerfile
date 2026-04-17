# ═══════════════════════════════════════════════════════════════
# Frontend Dockerfile — React + Vite (multi-stage build)
# Stage 1: Build the application with Node.js
# Stage 2: Serve static files with nginx
# ═══════════════════════════════════════════════════════════════

# ── Stage 1: Build ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --ignore-scripts=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add non-root user for nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]