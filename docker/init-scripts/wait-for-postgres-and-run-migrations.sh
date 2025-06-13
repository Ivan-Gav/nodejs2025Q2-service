#!/bin/sh
set -e

# Wait for PostgreSQL to be ready (using netcat)
until nc -z postgres 5432; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

# Run migrations
npx typeorm-ts-node-commonjs migration:run -d /app/dist/data-source.js

echo "Migrations completed!"