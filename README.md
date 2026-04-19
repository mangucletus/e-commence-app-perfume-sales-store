# Perfume Sales Store

A production-ready full-stack e-commerce application for browsing and purchasing perfumes.

---

## Quick Start

### Run Locally

**Requires:** Docker Desktop (or Docker Engine + Compose)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd e-commence-app-perfume-sales-store

# 2. Copy environment file
cp .env.example .env          # edit if you want custom passwords

# 3. Start the core application (postgres + redis + backend + frontend)
docker compose up --build
```

| URL | Service |
|---|---|
| http://localhost:3000 | Frontend |
| http://localhost:8080 | Backend API |

To also start the full observability stack (Prometheus, Grafana, Loki):

```bash
docker compose --profile observability up --build
```

| URL | Service |
|---|---|
| http://localhost:3000 | Frontend |
| http://localhost:8080 | Backend API |
| http://localhost:3001 | Grafana (admin / admin) |
| http://localhost:9090 | Prometheus |

---

### Deploy to Render (easiest — one click)

1. Push this repo to GitHub
2. Render Dashboard → **New → Blueprint** → select the repo
3. Render reads `render.yaml` and provisions everything automatically (PostgreSQL, Redis, backend, frontend)
4. After deploy, copy your frontend URL (e.g. `https://perfume-store-frontend.onrender.com`), go to the backend service → **Environment** → set `APP_CORS_ALLOWED_ORIGINS` to that URL → **Manual Deploy**

> **Free tier note:** Render suspends services after 15 min of inactivity. Spring Boot takes ~25 s to cold-start. Upgrade to Starter ($7/mo) for always-on.

---

### Deploy to Railway

1. Push this repo to GitHub
2. [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo** → select this repo
3. Inside the project click **+ New** → **Database → Add PostgreSQL**, then **+ New** → **Database → Add Redis**
4. Add the **backend** service: **+ New → GitHub Repo** → Root Directory: `backend` → set variables (see [Environment Variables](#environment-variables) below)
5. Add the **frontend** service: **+ New → GitHub Repo** → Root Directory: `frontend` → set `BACKEND_URL=https://<your-backend>.railway.app`
6. Deploy — Railway builds from the Dockerfiles and assigns public `*.railway.app` URLs

After both services are live, update `APP_CORS_ALLOWED_ORIGINS` on the backend to your frontend URL and redeploy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, TailwindCSS, Zustand |
| Backend | Spring Boot 3.2.5, Java 21 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT (Spring Security 6, stateless) |
| Containerisation | Docker, Docker Compose |
| Observability | Prometheus, Grafana, Loki, Promtail |
| Testing | JUnit 5, Mockito, Vitest, React Testing Library |

## Features

- User registration and login with JWT authentication
- Product catalogue with search and detail views
- Redis-backed shopping cart (persists across sessions)
- Checkout and order management
- Order history per user
- Metrics and log aggregation via a self-hosted Grafana stack

---

## Project Structure

```
.
├── backend/                        # Spring Boot REST API
│   ├── src/main/java/com/perfume/store/
│   │   ├── config/                 # Security, Redis config
│   │   ├── controller/             # REST controllers
│   │   ├── dto/                    # Request / response DTOs
│   │   ├── model/                  # JPA entities
│   │   ├── repository/             # Spring Data repos
│   │   ├── security/               # JWT filter, JwtUtil
│   │   └── service/                # Business logic
│   └── src/test/                   # Unit + integration tests
├── frontend/                       # React + TypeScript SPA
│   ├── src/
│   │   ├── api/                    # Axios API modules
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Route-level page components
│   │   └── store/                  # Zustand auth store
│   ├── Dockerfile                  # Multi-stage Node build → Nginx serve
│   └── nginx.conf                  # SPA routing + /api proxy template
├── observability/
│   ├── prometheus.yml
│   ├── loki.yml
│   ├── promtail.yml
│   └── grafana/provisioning/       # Auto-provisioned datasources + dashboards
├── docker-compose.yml              # Local dev (core + optional observability profile)
├── render.yaml                     # Render Blueprint — one-click cloud deploy
├── backend/railway.toml            # Railway backend service config
├── frontend/railway.toml           # Railway frontend service config
├── .env                            # Local secrets (git-ignored)
├── .env.example                    # Template to copy for new contributors
└── .gitignore
```

---

## Local Development

### Prerequisites

- Docker Desktop (or Docker Engine + Compose plugin)

### Step 1 — Clone and configure

```bash
git clone <your-repo-url>
cd e-commence-app-perfume-sales-store
cp .env.example .env
```

The default `.env` values work out of the box for local development. Edit them if you want different passwords.

### Step 2 — Start the application

**Core app only** (postgres + redis + backend + frontend):

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |

**Core app + full observability** (adds Prometheus, Grafana, Loki, Promtail):

```bash
docker compose --profile observability up --build
```

| Service | URL | Credentials |
|---|---|---|
| Frontend | http://localhost:3000 | — |
| Backend API | http://localhost:8080 | — |
| Grafana | http://localhost:3001 | admin / admin |
| Prometheus | http://localhost:9090 | — |

The **Perfume Store** Grafana dashboard is auto-provisioned — just log in and it's there.

### Step 3 — Stop the application

```bash
docker compose down                          # stop and remove containers
docker compose down -v                       # also remove volumes (wipes DB data)
```

### Run Without Docker (development mode)

If you want hot-reload on code changes without rebuilding Docker images:

**Backend** — requires local PostgreSQL on `localhost:5432` and Redis on `localhost:6379`:

```bash
cd backend
./mvnw spring-boot:run
# API available at http://localhost:8080
```

**Frontend** — Vite dev server with instant hot reload:

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

> When running without Docker, the frontend Vite dev server proxies `/api/` calls to `http://localhost:8080` automatically via the Vite config.

---

## API Reference

All protected endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create a new account |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |
| `GET` | `/api/products` | Public | List all products |
| `GET` | `/api/products/{id}` | Public | Get product by ID |
| `GET` | `/api/cart` | Required | Get current user's cart |
| `POST` | `/api/cart` | Required | Add item to cart |
| `DELETE` | `/api/cart/{productId}` | Required | Remove item from cart |
| `POST` | `/api/orders/checkout` | Required | Place an order |
| `GET` | `/api/orders` | Required | Get order history |
| `GET` | `/api/orders/{id}` | Required | Get order detail |

---

## Environment Variables

### Backend

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | HTTP port — injected automatically by Railway and Render |
| `SPRING_DATASOURCE_URL` | — | PostgreSQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | `postgres` | DB password |
| `SPRING_DATA_REDIS_HOST` | `redis` | Redis hostname |
| `SPRING_DATA_REDIS_PORT` | `6379` | Redis port |
| `APP_JWT_SECRET` | — | 64-char hex JWT signing key (`openssl rand -hex 32`) |
| `APP_JWT_EXPIRATION` | `86400000` | Token TTL in milliseconds (24 h) |
| `APP_CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Frontend origin allowed by CORS |

### Frontend (Nginx)

| Variable | Default | Description |
|---|---|---|
| `BACKEND_URL` | `http://backend:8080` | Backend base URL used by the Nginx `/api/` proxy |
| `NGINX_PORT` | `80` | Port Nginx listens on |

The Nginx container substitutes these variables into `nginx.conf` at startup using `envsubst`, so no image rebuild is needed when changing the backend URL.

---

## Testing

### Backend (JUnit 5 + Mockito + Spring Boot Test)

65 tests covering services, controllers, JWT, and observability.

```bash
cd backend
./mvnw test

# No local JDK required — run via Docker:
docker run --rm -v $(pwd):/app -w /app maven:3.9-eclipse-temurin-21 mvn test
```

| Test class | Type | Coverage |
|---|---|---|
| `AuthServiceTest` | Unit | Register, login, duplicate detection |
| `ProductServiceTest` | Unit | List, find by ID, not-found handling |
| `CartServiceTest` | Unit | Add, remove, get cart; Redis hash ops |
| `OrderServiceTest` | Unit | Checkout, order history, empty cart guard |
| `JwtUtilTest` | Unit | Token generation, validation, expiry |
| `AuthControllerTest` | Controller slice | Register / login HTTP responses |
| `ProductControllerTest` | Controller slice | Public product endpoints |
| `CartControllerTest` | Controller slice | Auth-gated cart endpoints (401 without token) |
| `OrderControllerTest` | Controller slice | Auth-gated order endpoints |
| `ActuatorIntegrationTest` | Full integration | Health + Prometheus endpoints, security rules |

### Frontend (Vitest + React Testing Library)

```bash
cd frontend
npm test            # single run
npm run test:watch  # watch mode
```

Covers: `useAuthStore`, `auth` and `products` API modules, `Navbar`, `ProductCard`, `Login` page, `Home` page.

---

## Observability

### Local Development (Docker Compose)

The full observability stack runs alongside the application in Docker Compose. Start it with `docker compose up --build` — no extra configuration needed.

| Component | Port | Role |
|---|---|---|
| **Prometheus** | 9090 | Scrapes `/actuator/prometheus` every 15 s |
| **Grafana** | 3001 | Dashboards — HTTP requests, JVM memory, log panels |
| **Loki** | 3100 | Stores container log streams (internal only) |
| **Promtail** | — | Reads Docker container logs via Docker socket and ships to Loki |

#### Accessing Grafana locally

1. Open [http://localhost:3001](http://localhost:3001)
2. Log in: `admin` / `admin` (or whatever you set in `.env`)
3. The **Perfume Store** dashboard is pre-loaded — no manual setup needed

The dashboard includes:
- HTTP request rate and error rate (from Spring Boot Micrometer metrics)
- JVM heap memory usage
- Live log stream from Loki (backend + frontend container logs)

#### How the pipeline works

```
Spring Boot  ──/actuator/prometheus──►  Prometheus  ──►  Grafana
Docker logs  ──► Promtail  ──►  Loki  ──────────────────►  Grafana
```

Every Spring Boot metric is tagged with `application="perfume-store"`, which the Grafana dashboard uses to filter queries (e.g. `http_server_requests_seconds_count{application="perfume-store"}`).

The backend exposes two actuator endpoints without authentication so they work out of the box:

| Endpoint | Purpose |
|---|---|
| `GET /actuator/health` | Load balancer / platform health checks |
| `GET /actuator/prometheus` | Prometheus metric scrape |

#### Changing Grafana credentials locally

Edit `.env`:

```
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your_new_password
```

Then restart: `docker compose up grafana`.

---

## Deploying to Railway

The repo includes `backend/railway.toml` and `frontend/railway.toml` — Railway picks these up automatically to configure health checks (`/actuator/health` and `/`) and restart policies. No extra setup needed beyond the steps below.

> The observability stack (Prometheus / Grafana / Loki / Promtail) is **not deployed on Railway**. Use Grafana Cloud for metrics and logs in production — see [Cloud Observability](#cloud-observability-railway--render).

### Steps

**1. Push this repo to GitHub**

**2. Railway → New Project → Deploy from GitHub repo → select this repo**

**3. Add PostgreSQL and Redis plugins**

Inside the project click **+ New** twice:
- **Database → Add PostgreSQL** — Railway provisions a managed database and gives you connection variables
- **Database → Add Redis** — Railway provisions Redis

**4. Add the backend service**

**+ New → GitHub Repo** → same repo → **Settings → Root Directory:** `backend`

Set these environment variables (Railway shows the plugin values in the Variables tab):

```
SPRING_DATASOURCE_URL=jdbc:postgresql://<PGHOST>:<PGPORT>/<PGDATABASE>
SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}
SPRING_DATA_REDIS_HOST=${{Redis.REDISHOST}}
SPRING_DATA_REDIS_PORT=${{Redis.REDISPORT}}
APP_JWT_SECRET=<run locally: openssl rand -hex 32>
APP_JWT_EXPIRATION=86400000
APP_CORS_ALLOWED_ORIGINS=https://<your-frontend>.railway.app
```

> **postgres:// → JDBC:** Railway provides `postgres://user:pass@host:5432/db`. Spring Boot needs `jdbc:postgresql://host:5432/db` — drop `postgres://` and prepend `jdbc:postgresql://`.

Railway injects `PORT` automatically. `${{Postgres.PGUSER}}` syntax links the variable directly from the plugin — no copy-pasting required.

**5. Add the frontend service**

**+ New → GitHub Repo** → same repo → **Settings → Root Directory:** `frontend`

Set one variable:

```
BACKEND_URL=https://<your-backend>.railway.app
```

**6. Deploy**

Click **Deploy** on both services. Railway builds from the Dockerfiles and assigns public `*.railway.app` URLs.

Once live, confirm `APP_CORS_ALLOWED_ORIGINS` on the backend matches your exact frontend URL, then redeploy the backend if you had to update it.

---

## Deploying to Render

The repo includes `render.yaml` — a [Render Blueprint](https://render.com/docs/blueprint-spec) that provisions PostgreSQL, Redis, backend, and frontend in one go. Render reads it automatically when you connect the repository.

> The observability stack is **not deployed on Render**. Use Grafana Cloud for metrics and logs — see [Cloud Observability](#cloud-observability-railway--render).

### Option A — Blueprint (recommended, one click)

**1. Push this repo to GitHub**

**2. Render Dashboard → New → Blueprint → select the repo**

Render reads `render.yaml` and shows a preview of everything it will create: a PostgreSQL database, a Redis instance, the backend web service, and the frontend web service.

**3. Click Apply**

Render provisions all four resources and wires the database and Redis connection details into the backend automatically.

**4. After deploy — set CORS**

Copy your frontend URL (e.g. `https://perfume-store-frontend.onrender.com`), go to the backend service → **Environment** → update `APP_CORS_ALLOWED_ORIGINS` to that URL → click **Manual Deploy**.

That's it. The application is live.

> **Free tier note:** Render suspends services after 15 minutes of inactivity. Spring Boot takes ~25–30 seconds to cold-start on the next request. Upgrade to **Starter ($7/month)** to keep the backend always-on and avoid this.

### Option B — Manual setup (step by step)

Use this if you want full control over each resource.

**1. Create PostgreSQL**
Dashboard → **New → PostgreSQL** → Free plan (90-day trial, then $7/month)
Copy the **Internal Database URL**.

**2. Create Redis**
**New → Redis** → Free plan
Copy the **Internal Redis URL** (host + port).

**3. Deploy the Backend**
**New → Web Service** → this repo → Root Directory: `backend` → Environment: Docker

Environment variables:
```
SPRING_DATASOURCE_URL=jdbc:postgresql://<internal host>:<port>/<db>
SPRING_DATASOURCE_USERNAME=<username>
SPRING_DATASOURCE_PASSWORD=<password>
SPRING_DATA_REDIS_HOST=<internal Redis host>
SPRING_DATA_REDIS_PORT=<Redis port>
APP_JWT_SECRET=<run locally: openssl rand -hex 32>
APP_JWT_EXPIRATION=86400000
APP_CORS_ALLOWED_ORIGINS=https://<your-frontend>.onrender.com
```

**4. Deploy the Frontend**
**New → Web Service** → same repo → Root Directory: `frontend` → Environment: Docker

```
BACKEND_URL=https://<your-backend>.onrender.com
```

**5. Update CORS**
Once both services are live, update `APP_CORS_ALLOWED_ORIGINS` on the backend to your exact frontend URL → redeploy.

---

### Cloud Observability (Railway / Render)

> **Key rule:** The self-hosted Prometheus / Grafana / Loki / Promtail stack in `docker-compose.yml` is **only for local development**. On Railway or Render, use [Grafana Cloud](https://grafana.com/products/cloud/) (the actual SaaS at grafana.com) instead.

The self-hosted stack cannot run on these platforms because:
- Prometheus and Grafana require persistent volume mounts for config files and TSDB data — not available on Railway/Render without workarounds
- Promtail requires the Docker socket (`/var/run/docker.sock`) — never available in managed cloud container environments

#### What to use instead

| Local stack | Cloud replacement | Free tier |
|---|---|---|
| Prometheus + Grafana | **Grafana Cloud** — hosted Grafana UI + managed Prometheus | 10k active metrics, 50 GB logs free |
| Loki log ingestion | **Grafana Cloud** — includes managed Loki | Included in free tier above |
| Promtail | ❌ Not available on cloud — use **Railway / Render built-in log streaming** for basic logs, or [Grafana Alloy](https://grafana.com/docs/alloy/latest/) as a separate scraper service |

#### Setting up Grafana Cloud (free, no credit card)

1. Sign up at [grafana.com](https://grafana.com)
2. Create a free stack — you get a hosted Grafana instance, managed Prometheus, and managed Loki
3. Go to **My Account → Prometheus → Details**, copy:
   - **Remote Write URL** (e.g. `https://prometheus-prod-xx.grafana.net/api/prom/push`)
   - **Username** (numeric ID) and **Password** (API token)

#### Sending metrics to Grafana Cloud

Your backend exposes `/actuator/prometheus` publicly — Grafana Alloy can scrape it and push metrics to your Grafana Cloud stack. Deploy Alloy as a separate service on Railway or Render using the `grafana/alloy` image with this config:

```river
// alloy-config.river
prometheus.scrape "perfume_store" {
  targets = [{"__address__" = "<your-backend>.railway.app", "__metrics_path__" = "/actuator/prometheus", "__scheme__" = "https"}]
  scrape_interval = "15s"
  forward_to = [prometheus.remote_write.grafana_cloud.receiver]
}

prometheus.remote_write "grafana_cloud" {
  endpoint {
    url = "https://prometheus-prod-xx.grafana.net/api/prom/push"
    basic_auth {
      username = "<your Grafana Cloud numeric username>"
      password = "<your Grafana Cloud API token>"
    }
  }
}
```

#### Logs on Railway / Render

Both platforms capture all container stdout/stderr automatically — no configuration needed:

- **Railway** → Project → Service → **Logs** tab (searchable, real-time)
- **Render** → Service → **Logs** tab

For advanced log search, alerting, and long-term retention, configure log forwarding to Grafana Cloud Loki via Grafana Alloy or your platform's log drain feature.

---

## Security Checklist for Production

- [ ] Generate a new JWT secret: `openssl rand -hex 32`
- [ ] Set `APP_CORS_ALLOWED_ORIGINS` to your exact frontend domain
- [ ] Change Grafana admin password from `admin` (local only)
- [ ] Use a strong PostgreSQL password
- [ ] Never commit `.env` — it is git-ignored
- [ ] Restrict `/actuator/**` to internal networks only if exposing the backend publicly without a gateway
