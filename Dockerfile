# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

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
CMD ["node", "dist/main.js"]