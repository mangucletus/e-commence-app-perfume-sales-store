FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
ENV BACKEND_URL=http://backend:8080
# Translate Railway's PORT into NGINX_PORT before envsubst runs on the template
RUN printf '#!/bin/sh\nexport NGINX_PORT="${PORT:-80}"\n' \
      > /docker-entrypoint.d/00-set-port.envsh \
    && chmod +x /docker-entrypoint.d/00-set-port.envsh
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
