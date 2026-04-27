# E-Commerce Platform

A full-stack web application built with React (TypeScript) + FastAPI (Python) + PostgreSQL 15. This project provides a production-ready scaffold with authentication, example CRUD entities, and complete DevOps infrastructure.

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

- **Docker** >= 24.0 and **Docker Compose** >= 2.20 (for containerized setup)
- **Node.js** >= 20.x and **npm** >= 10.x (for local frontend development)
- **Python** >= 3.11 (for local backend development)
- **PostgreSQL** >= 15 (for local development without Docker)

---

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone <repository-url>
cd e-commerce-platform

# 2. Copy environment variables
cp .env.example .env

# 3. Edit .env with your secrets (at minimum change SECRET_KEY and JWT_SECRET_KEY)
# nano .env

# 4. Build and start all services
docker-compose up --build

# 5. Run database migrations
docker-compose exec backend alembic upgrade head
```

**Services will be available at:**

| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:3000         |
| Backend   | http://localhost:8000         |
| API Docs  | http://localhost:8000/docs    |
| ReDoc     | http://localhost:8000/redoc   |
| Database  | localhost:5432               |

---

## Environment Variables

All configuration is managed through environment variables. See [`.env.example`](.env.example) for a complete list with descriptions.

**Critical variables to change in production:**

- `SECRET_KEY` — Application secret key
- `JWT_SECRET_KEY` — JWT signing key
- `DB_PASSWORD` — Database password
- `CORS_ORIGINS` — Allowed frontend origins
- `APP_ENV` — Set to `production`
- `DEBUG` — Set to `false`

---

## API Documentation

Once the backend is running, interactive API documentation is available at:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

### Key Endpoints

| Method | Path                    | Description                  | Auth     |
|--------|------------------------|------------------------------|----------|
| POST   | `/api/v1/auth/register` | Register a new user          | No       |
| POST   | `/api/v1/auth/login`    | Login, receive JWT tokens    | No       |
| POST   | `/api/v1/auth/refresh`  | Refresh access token         | Refresh  |
| POST   | `/api/v1/auth/logout`   | Blocklist refresh token      | Access   |
| GET    | `/api/v1/auth/me`       | Get current user profile     | Access   |
| PUT    | `/api/v1/auth/me`       | Update current user profile  | Access   |
| GET    | `/api/v1/items`         | List items (paginated)       | Access   |
| POST   | `/api/v1/items`         | Create item                  | Access   |
| GET    | `/api/v1/items/{id}`    | Get single item              | Access   |
| PUT    | `/api/v1/items/{id}`    | Update item (owner only)     | Access   |
| DELETE | `/api/v1/items/{id}`    | Delete item (owner only)     | Access   |
| GET    | `/api/v1/tags`          | List all tags                | No       |
| POST   | `/api/v1/tags`          | Create tag                   | Access   |

---

## Project Structure

```
e-commerce-platform/
├── .env.example              # Environment variable template
├── docker-compose.yml        # Multi-service orchestration
├── .github/workflows/        # CI/CD pipeline
│
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/              # Axios API client and calls
│   │   ├── components/       # Reusable UI and feature components
│   │   ├── context/          # React context providers (Auth)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Route page components
│   │   ├── router/           # React Router configuration
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Helper functions
│   └── Dockerfile
│
├── backend/                  # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── api/              # Route handlers (v1)
│   │   ├── core/             # Security, exceptions, pagination
│   │   ├── middleware/        # CORS configuration
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   └── services/         # Business logic layer
│   ├── alembic/              # Database migrations
│   ├── tests/                # Pytest test suite
│   └── Dockerfile
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

# Ensure PostgreSQL is running and .env is configured
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

# Start development server (with hot reload)
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies API requests to `http://localhost:8000`.

---

## Testing

### Backend Tests

```bash
cd backend
source .venv/bin/activate

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=html

# Linting
ruff check .

# Type checking
mypy app/ --ignore-missing-imports
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npx vitest run

# Run in watch mode
npx vitest

# Linting
npx eslint src/ --ext .ts,.tsx

# Type checking
npx tsc --noEmit
```

---

## Database Migrations

```bash
# Create a new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Apply all pending migrations
docker-compose exec backend alembic upgrade head

# Rollback one migration
docker-compose exec backend alembic downgrade -1

# View migration history
docker-compose exec backend alembic history
```

---

## Deployment

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs on:

- **Push** to `main` or `develop` branches
- **Pull requests** to `main`

**Pipeline stages:**

1. **Lint & Test Backend** — Ruff, Mypy, Pytest
2. **Lint & Test Frontend** — ESLint, TypeScript check, Vitest
3. **Build & Push** — Docker images to GitHub Container Registry (on `main` only)

### Production Checklist

- [ ] Change all secrets in `.env` (`SECRET_KEY`, `JWT_SECRET_KEY`, `DB_PASSWORD`)
- [ ] Set `APP_ENV=production` and `DEBUG=false`
- [ ] Configure `CORS_ORIGINS` to your production domain
- [ ] Set up HTTPS (TLS termination via reverse proxy or load balancer)
- [ ] Configure proper database backups
- [ ] Set up monitoring and logging
- [ ] Review and tighten CORS, rate limiting, and security headers

---

## Customization

This scaffold includes **example entities** (Item, Tag) to demonstrate patterns. To build your own application:

1. **Delete example files** — Look for files and directories marked with "EXAMPLE" or "DELETE & replace"
2. **Create your domain models** in `backend/app/models/`
3. **Create your schemas** in `backend/app/schemas/`
4. **Create your services** in `backend/app/services/`
5. **Create your API routes** in `backend/app/api/v1/`
6. **Create your frontend components** in `frontend/src/components/`
7. **Update the router** in `frontend/src/router/index.tsx`
8. **Generate a migration** — `alembic revision --autogenerate -m "add my models"`

The authentication system (User model, JWT, login/register) is **production-ready and meant to be kept**.

---

## License

This project is provided as a scaffold. Add your own license as appropriate.