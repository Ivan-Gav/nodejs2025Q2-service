FROM postgres:15-alpine

# Copy initialization scripts (if any)
COPY ./docker/init-scripts/ /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/*.sh


# Expose PostgreSQL port
EXPOSE ${POSTGRES_PORT:-5432}

# Health check using environment variables
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-postgres}