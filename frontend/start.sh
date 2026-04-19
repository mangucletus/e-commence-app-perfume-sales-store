#!/bin/sh
set -e
PORT=${PORT:-80}
BACKEND_URL=${BACKEND_URL:-http://backend:8080}
envsubst '${PORT} ${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
