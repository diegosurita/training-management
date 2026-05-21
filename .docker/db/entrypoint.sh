#!/bin/sh

set -eu

/usr/local/bin/docker-entrypoint.sh "$@" &
postgres_pid=$!

trap 'kill "$postgres_pid" 2>/dev/null || true' EXIT INT TERM

until pg_isready -h 127.0.0.1 -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-app}"; do
  sleep 1
done

psql -h 127.0.0.1 -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-app}" -v ON_ERROR_STOP=1 \
  -c "CREATE SCHEMA IF NOT EXISTS auth;" \
  -c "CREATE SCHEMA IF NOT EXISTS extensions;" \
  -c "CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;"

wait "$postgres_pid"