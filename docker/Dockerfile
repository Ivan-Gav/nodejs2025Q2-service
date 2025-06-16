FROM postgres:15-alpine

# Expose PostgreSQL port
EXPOSE ${POSTGRES_PORT:-5432}

# Health check using environment variables
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-postgres}