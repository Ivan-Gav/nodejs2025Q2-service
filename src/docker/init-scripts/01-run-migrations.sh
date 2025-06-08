#!/bin/bash
set -e

/docker-entrypoint-initdb.d/wait-for-postgres.sh

docker exec -i your_app_container_name \
  npx typeorm-ts-node-commonjs migration:run -d /app/dist/data-source.js