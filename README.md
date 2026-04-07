# E-Commerce Platform

A full-stack e-commerce platform built with React (TypeScript), FastAPI (Python), and PostgreSQL.

## Tech Stack

- **Frontend:** React 18 + TypeScript + TailwindCSS + Vite
- **Backend:** FastAPI + SQLAlchemy 2.0 (async) + Pydantic v2
- **Database:** PostgreSQL 15
- **Auth:** JWT (access + refresh tokens) with bcrypt password hashing
- **Containerization:** Docker + Docker Compose

## Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.11+ (for local backend development)

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd e-commerce-platform

# Copy environment variables
cp .env.example .env

# Start all services
docker-compose up --build
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **API Docs (ReDoc):** http://localhost:8000/redoc

## Environment Variables

See `.env.example` for all available configuration options.

## Project Structure

```
e-commerce-platform/
├── frontend/          # React TypeScript SPA
│   ├── src/
│   │   ├── api/       # API client and endpoint functions
│   │   ├── components/# Reusable UI components
│   │   ├── context/   # React context providers
│   │   ├── hooks/     # Custom React hooks
│   │   ├── pages/     # Page components
│   │   ├── router/    # Route definitions
│   │   ├── types/     # TypeScript interfaces
│   │   └── utils/     # Utility functions
│   └── ...
├── backend/           # FastAPI Python API
│   ├── app/
│   │   ├── api/       # API routes and dependencies
│   │   ├── core/      # Security, exceptions
│   │   ├── middleware/ # CORS configuration
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   └── services/  # Business logic
│   ├── alembic/       # Database migrations
│   └── tests/         # Pytest test suite
└── docker-compose.yml
```

## Development (without Docker)

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt

# Run migrations
alembic upgrade head

# Start dev server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
npx vitest run
```

## Database Migrations

```bash
cd backend

# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

The project includes a GitHub Actions CI/CD pipeline (`.github/workflows/ci-cd.yml`) that:

1. Lints and tests the backend (ruff, mypy, pytest)
2. Lints and tests the frontend (eslint, tsc, vitest)
3. Builds and pushes Docker images to GitHub Container Registry
4. Can be extended with a deploy step

## License

MIT