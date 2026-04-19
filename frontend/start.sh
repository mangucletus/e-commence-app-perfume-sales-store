#!/bin/sh
set -e

# Strip whitespace — copy-pasting Railway URLs often leaves trailing spaces
export PORT="$(printf '%s' "${PORT:-80}" | tr -d '[:space:]')"
export BACKEND_URL="$(printf '%s' "${BACKEND_URL:-http://backend:8080}" | tr -d '[:space:]')"

echo "[nginx] PORT=$PORT  BACKEND_URL=$BACKEND_URL"

envsubst '${PORT} ${BACKEND_URL}' \
  < /etc/nginx/nginx.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
