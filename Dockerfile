# Build stage
FROM node:22-alpine AS builder

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY docker/init-scripts/wait-for-postgres-and-run-migrations.sh .

ENV CRYPT_SALT=${CRYPT_SALT:-10}
ENV JWT_SECRET_KEY=JWT_SECRET_KEY
ENV JWT_SECRET_REFRESH_KEY=JWT_SECRET_REFRESH_KEY
ENV TOKEN_EXPIRE_TIME=${TOKEN_EXPIRE_TIME:-1h}
ENV TOKEN_REFRESH_EXPIRE_TIME=${TOKEN_REFRESH_EXPIRE_TIME:-24h}
ENV NODE_ENV=production
ENV PORT=${PORT:-4000}

EXPOSE ${PORT:-4000}

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-4000}/health || exit 1

# Start command
CMD ["sh", "-c", "./wait-for-postgres-and-run-migrations.sh && npm run start:prod"]