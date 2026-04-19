FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Defaults; override at runtime via -e BACKEND_URL=https://... and NGINX_PORT
ENV BACKEND_URL=http://backend:8080
ENV NGINX_PORT=80
# nginx entrypoint runs envsubst on *.template files automatically
COPY nginx.conf /etc/nginx/templates/default.conf.template
EXPOSE 80
