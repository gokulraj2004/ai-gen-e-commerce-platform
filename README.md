# E-Commerce Platform

A full-stack web application built with React (TypeScript) + FastAPI (Python) + PostgreSQL 15. This project provides a production-ready scaffold with authentication, example CRUD entities, and complete DevOps configuration.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, TailwindCSS        |
| Backend    | FastAPI, SQLAlchemy 2.0 (async), Pydantic v2   |
| Database   | PostgreSQL 15                                   |
| Auth       | JWT (access + refresh tokens), bcrypt           |
| DevOps     | Docker, Docker Compose, GitHub Actions CI/CD    |
| Testing    | Pytest (backend), Vitest (frontend)             |

---

## Prerequisites

- **Docker** >= 24.0 and **Docker Compose** >= 2.20
- **Node.js** >= 20 (for local frontend development)
- **Python** >= 3.11 (for local backend development)
- **PostgreSQL** 15 (if running without Docker)

---

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd e-commerce-platform
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env and set secure values for SECRET_KEY, JWT_SECRET_KEY, DB_PASSWORD
```

### 3. Start all services with Docker

```bash
docker-compose up --build
```

This starts:
- **Frontend** at [http://localhost:3000](http://localhost:3000)
- **Backend API** at [http://localhost:8000](http://localhost:8000)
- **API Docs (Swagger)** at [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL** on port 5432

### 4. Run database migrations

```bash
docker-compose exec backend alembic upgrade head
```

---

## Environment Variables

All configuration is managed through environment variables. See [`.env.example`](.env.example) for a complete list with descriptions.

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Application secret key | `change-me-to-a-random-secret-key` |
| `JWT_SECRET_KEY` | JWT signing secret | `change-me-to-a-random-jwt-secret` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@db:5432/e_commerce_platform` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `http://localhost:3000,http://localhost:5173` |
| `VITE_API_BASE_URL` | Frontend API base URL | `http://localhost:8000/api/v1` |

---

## API Documentation

Once the backend is running, interactive API documentation is available at:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| `POST` | `/api/v1/auth/register` | Register a new user | No |
| `POST` | `/api/v1/auth/login` | Login, receive tokens | No |
| `POST` | `/api/v1/auth/refresh` | Refresh access token | Refresh Token |
| `POST` | `/api/v1/auth/logout` | Revoke refresh token | Access Token |
| `GET`  | `/api/v1/auth/me` | Get current user | Access Token |
| `PUT`  | `/api/v1/auth/me` | Update current user | Access Token |
| `GET`  | `/api/v1/items` | List items (paginated) | Access Token |
| `POST` | `/api/v1/items` | Create item | Access Token |
| `GET`  | `/api/v1/items/{id}` | Get item detail | Access Token |
| `PUT`  | `/api/v1/items/{id}` | Update item (owner) | Access Token |
| `DELETE` | `/api/v1/items/{id}` | Delete item (owner) | Access Token |
| `GET`  | `/api/v1/tags` | List all tags | No |
| `POST` | `/api/v1/tags` | Create tag | Access Token |
| `GET`  | `/api/health` | Health check | No |

---

## Project Structure

```
e-commerce-platform/
├── frontend/          # React SPA (TypeScript, Vite, TailwindCSS)
│   ├── src/
│   │   ├── api/       # Axios client and API call functions
│   │   ├── components/# Reusable UI and feature components
│   │   ├── context/   # React context providers (Auth)
│   │   ├── hooks/     # Custom React hooks
│   │   ├── pages/     # Page-level components
│   │   ├── router/    # React Router configuration
│   │   ├── types/     # TypeScript interfaces
│   │   └── utils/     # Helper functions
│   └── Dockerfile
├── backend/           # FastAPI application (Python, async SQLAlchemy)
│   ├── app/
│   │   ├── api/       # Route handlers (v1 endpoints)
│   │   ├── core/      # Security, exceptions, pagination
│   │   ├── middleware/ # CORS configuration
│   │   ├── models/    # SQLAlchemy ORM models
│   │   ├── schemas/   # Pydantic request/response schemas
│   │   └── services/  # Business logic layer
│   ├── alembic/       # Database migrations
│   ├── tests/         # Pytest test suite
│   └── Dockerfile
├── docker-compose.yml # Multi-service orchestration
├── .env.example       # Environment variable template
└── .github/workflows/ # CI/CD pipeline
```

---

## Development (Without Docker)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt -r requirements-dev.txt

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm ci

# Start development server
npm run dev
```

The Vite dev server runs at [http://localhost:5173](http://localhost:5173) and proxies API requests to the backend.

---

## Testing

### Backend Tests

```bash
cd backend
source .venv/bin/activate

# Run all tests
pytest tests/ -v

# Run with coverage
coverage run -m pytest tests/ -v
coverage report -m
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npx vitest run

# Run in watch mode
npx vitest
```

### Linting

```bash
# Backend
cd backend
ruff check .
mypy app/ --ignore-missing-imports

# Frontend
cd frontend
npx eslint src/ --ext .ts,.tsx
npx tsc --noEmit
```

---

## Deployment

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on every push to `main`/`develop` and on pull requests to `main`:

1. **Lint & Test Backend** — Ruff, Mypy, Pytest
2. **Lint & Test Frontend** — ESLint, TypeScript check, Vitest
3. **Build & Push** — Docker images to GitHub Container Registry (on `main` only)

### Production Deployment

1. Set all environment variables with production values (strong secrets, `DEBUG=false`)
2. Use a managed PostgreSQL instance
3. Configure HTTPS via a reverse proxy (e.g., Traefik, Caddy, or cloud load balancer)
4. Set `CORS_ORIGINS` to your production domain

---

## Customization

The project includes **example entities** (`Item`, `Tag`) to demonstrate patterns. To build your own application:

### Backend
1. Delete `app/models/examples.py`, `app/schemas/examples.py`, `app/services/example_service.py`, `app/api/v1/examples.py`
2. Remove example imports from `app/models/__init__.py` and `app/api/router.py`
3. Create your own models, schemas, services, and routes following the same patterns

### Frontend
1. Delete `src/components/examples/`, `src/types/examples.ts`, `src/api/items.ts`, `src/hooks/useItems.ts`
2. Delete `src/pages/ItemsPage.tsx` and `src/pages/ItemDetailPage.tsx`
3. Update `src/router/index.tsx` to remove example routes
4. Create your own components, pages, and API calls following the same patterns

---

## License

This project is provided as a scaffold. Add your own license as appropriate.