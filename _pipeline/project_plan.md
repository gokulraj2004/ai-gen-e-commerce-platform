

# E-Commerce Platform — Detailed Project Plan

---

## 1. File Tree

```
e-commerce-platform/
├── README.md                                    # Comprehensive project documentation
├── .env.example                                 # All environment variables with descriptions
├── docker-compose.yml                           # Multi-service orchestration (frontend, backend, db)
├── .github/
│   └── workflows/
│       └── ci-cd.yml                            # GitHub Actions CI/CD pipeline
│
├── frontend/
│   ├── Dockerfile                               # Multi-stage build: Node build + nginx serve
│   ├── .dockerignore                            # Ignore node_modules, dist, .env, etc.
│   ├── nginx.conf                               # Custom nginx config for SPA routing
│   ├── package.json                             # Frontend dependencies and scripts
│   ├── tsconfig.json                            # Strict TypeScript configuration
│   ├── tsconfig.node.json                       # TypeScript config for Vite/Node context
│   ├── vite.config.ts                           # Vite build tool configuration with proxy
│   ├── tailwind.config.js                       # TailwindCSS configuration
│   ├── postcss.config.js                        # PostCSS with TailwindCSS and autoprefixer
│   ├── index.html                               # Vite HTML entry point
│   └── src/
│       ├── main.tsx                             # React DOM root mount
│       ├── App.tsx                              # Root component with router setup
│       ├── vite-env.d.ts                        # Vite client type declarations
│       ├── index.css                            # TailwindCSS directives (@tailwind base, etc.)
│       ├── types/
│       │   ├── index.ts                         # Re-export barrel file
│       │   ├── auth.ts                          # Auth-related interfaces (User, LoginRequest, etc.)
│       │   ├── product.ts                       # Domain entity interfaces
│       │   ├── cart.ts                          # Cart and CartItem interfaces
│       │   ├── order.ts                         # Order and OrderItem interfaces
│       │   └── api.ts                           # Generic API response types, pagination
│       ├── api/
│       │   ├── client.ts                        # Axios instance with interceptors (JWT attach, refresh)
│       │   ├── auth.ts                          # Auth API calls (login, register, refresh, me)
│       │   ├── products.ts                      # Product API calls (list, detail, search)
│       │   ├── cart.ts                          # Cart API calls (get, add, update, remove)
│       │   └── orders.ts                        # Order API calls (create, list, detail)
│       ├── context/
│       │   └── AuthContext.tsx                   # Auth context provider with JWT state management
│       ├── hooks/
│       │   ├── useAuth.ts                       # Hook to consume AuthContext
│       │   ├── useProducts.ts                   # Hook for product fetching with pagination
│       │   ├── useCart.ts                       # Hook for cart operations
│       │   └── useOrders.ts                     # Hook for order operations
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.tsx                   # Top navigation bar with auth state
│       │   │   ├── Footer.tsx                   # Site footer
│       │   │   ├── Layout.tsx                   # Wraps Header + Outlet + Footer
│       │   │   └── Sidebar.tsx                  # Category sidebar / mobile nav
│       │   ├── auth/
│       │   │   ├── LoginForm.tsx                # Login form component
│       │   │   ├── RegisterForm.tsx             # Registration form component
│       │   │   └── ProtectedRoute.tsx           # Route guard redirecting unauthenticated users
│       │   ├── products/
│       │   │   ├── ProductCard.tsx              # Single product card (grid item)
│       │   │   ├── ProductGrid.tsx              # Grid of ProductCards with pagination
│       │   │   ├── ProductDetail.tsx            # Full product detail view
│       │   │   ├── ProductSearch.tsx            # Search bar with debounced input
│       │   │   └── CategoryFilter.tsx           # Category filter sidebar/dropdown
│       │   ├── cart/
│       │   │   ├── CartIcon.tsx                 # Header cart icon with item count badge
│       │   │   ├── CartDrawer.tsx               # Slide-out cart drawer
│       │   │   ├── CartItem.tsx                 # Single cart line item with qty controls
│       │   │   └── CartSummary.tsx              # Subtotal, tax, total summary
│       │   ├── orders/
│       │   │   ├── OrderList.tsx                # List of user's past orders
│       │   │   ├── OrderDetail.tsx              # Single order detail view
│       │   │   └── CheckoutForm.tsx             # Shipping address + place order form
│       │   └── ui/
│       │       ├── Button.tsx                   # Reusable button component
│       │       ├── Input.tsx                    # Reusable input component
│       │       ├── Modal.tsx                    # Reusable modal/dialog
│       │       ├── Spinner.tsx                  # Loading spinner
│       │       ├── Toast.tsx                    # Toast notification component
│       │       └── Pagination.tsx               # Pagination controls
│       ├── pages/
│       │   ├── HomePage.tsx                     # Landing page with featured products
│       │   ├── LoginPage.tsx                    # Login page
│       │   ├── RegisterPage.tsx                 # Registration page
│       │   ├── ProductsPage.tsx                 # Product listing with search/filter
│       │   ├── ProductDetailPage.tsx            # Single product page
│       │   ├── CartPage.tsx                     # Full cart page
│       │   ├── CheckoutPage.tsx                 # Checkout page (protected)
│       │   ├── OrdersPage.tsx                   # Order history (protected)
│       │   ├── OrderDetailPage.tsx              # Single order detail (protected)
│       │   ├── ProfilePage.tsx                  # User profile (protected)
│       │   └── NotFoundPage.tsx                 # 404 page
│       ├── router/
│       │   └── index.tsx                        # React Router v6 route definitions
│       └── utils/
│           ├── formatCurrency.ts                # Currency formatting helper
│           ├── formatDate.ts                    # Date formatting helper
│           └── validators.ts                    # Form validation helpers
│
├── backend/
│   ├── Dockerfile                               # Slim Python image, non-root user, layer caching
│   ├── .dockerignore                            # Ignore __pycache__, .venv, .env, etc.
│   ├── requirements.txt                         # Pinned Python dependencies
│   ├── requirements-dev.txt                     # Dev/test dependencies (pytest, ruff, mypy)
│   ├── alembic.ini                              # Alembic configuration file
│   ├── alembic/
│   │   ├── env.py                               # Alembic environment with async engine
│   │   ├── script.py.mako                       # Migration template
│   │   └── versions/
│   │       └── .gitkeep                         # Placeholder for migration files
│   ├── app/
│   │   ├── __init__.py                          # Package init
│   │   ├── main.py                              # Application factory: create_app()
│   │   ├── config.py                            # Pydantic Settings for env var loading
│   │   ├── database.py                          # Async SQLAlchemy engine, session factory, get_db
│   │   ├── models/
│   │   │   ├── __init__.py                      # Import all models for Alembic discovery
│   │   │   ├── base.py                          # Declarative base with common columns (id, timestamps)
│   │   │   ├── user.py                          # User model
│   │   │   ├── product.py                       # Product model
│   │   │   ├── category.py                      # Category model
│   │   │   ├── cart.py                          # Cart and CartItem models
│   │   │   ├── order.py                         # Order and OrderItem models
│   │   │   └── token_blocklist.py               # Revoked/blocklisted refresh tokens
│   │   ├── schemas/
│   │   │   ├── __init__.py                      # Re-exports
│   │   │   ├── auth.py                          # LoginRequest, RegisterRequest, TokenResponse, UserResponse
│   │   │   ├── product.py                       # ProductCreate, ProductUpdate, ProductResponse, ProductList
│   │   │   ├── category.py                      # CategoryCreate, CategoryResponse
│   │   │   ├── cart.py                          # CartResponse, CartItemAdd, CartItemUpdate
│   │   │   ├── order.py                         # OrderCreate, OrderResponse, OrderItemResponse
│   │   │   └── common.py                        # PaginatedResponse, MessageResponse, ErrorResponse
│   │   ├── api/
│   │   │   ├── __init__.py                      # Package init
│   │   │   ├── router.py                        # Main APIRouter aggregating all sub-routers
│   │   │   ├── deps.py                          # Dependency injection: get_current_user, get_db_session
│   │   │   └── v1/
│   │   │       ├── __init__.py                  # Package init
│   │   │       ├── auth.py                      # Auth endpoints (login, register, refresh, me)
│   │   │       ├── products.py                  # Product CRUD endpoints
│   │   │       ├── categories.py                # Category endpoints
│   │   │       ├── cart.py                      # Cart endpoints
│   │   │       └── orders.py                    # Order endpoints
│   │   ├── services/
│   │   │   ├── __init__.py                      # Package init
│   │   │   ├── auth_service.py                  # Business logic: register, authenticate, refresh
│   │   │   ├── product_service.py               # Product CRUD logic
│   │   │   ├── category_service.py              # Category CRUD logic
│   │   │   ├── cart_service.py                  # Cart manipulation logic
│   │   │   └── order_service.py                 # Order creation, status management
│   │   ├── core/
│   │   │   ├── __init__.py                      # Package init
│   │   │   ├── security.py                      # JWT encode/decode, password hashing (bcrypt)
│   │   │   └── exceptions.py                    # Custom HTTP exceptions, exception handlers
│   │   └── middleware/
│   │       ├── __init__.py                      # Package init
│   │       └── cors.py                          # CORS middleware configuration
│   └── tests/
│       ├── __init__.py                          # Package init
│       ├── conftest.py                          # Pytest fixtures: async client, test DB, auth headers
│       ├── test_auth.py                         # Auth endpoint tests
│       ├── test_products.py                     # Product endpoint tests
│       ├── test_cart.py                         # Cart endpoint tests
│       └── test_orders.py                       # Order endpoint tests
```

---

## 2. API Specification

**Base URL:** `/api/v1`

All responses follow a consistent envelope where applicable. Dates are ISO 8601. All `id` fields are UUIDs.

### Authentication — JWT

**Strategy:** Stateless JWT with access + refresh token pair.

- **Access Token:** Short-lived (30 min), sent in `Authorization: Bearer <token>` header
- **Refresh Token:** Long-lived (7 days), used to obtain new access tokens
- **Password Hashing:** bcrypt with salt rounds = 12
- **Token Blocklist:** Revoked refresh tokens stored in `token_blocklist` table

**Auth Endpoints:**

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register a new user | No |
| POST | `/api/v1/auth/login` | Login, receive access + refresh tokens | No |
| POST | `/api/v1/auth/refresh` | Refresh access token | Refresh Token |
| POST | `/api/v1/auth/logout` | Blocklist refresh token | Access Token |
| GET | `/api/v1/auth/me` | Get current user profile | Access Token |
| PUT | `/api/v1/auth/me` | Update current user profile | Access Token |

#### POST `/api/v1/auth/register`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongP@ss1",
  "first_name": "John",
  "last_name": "Doe"
}
```
**Response (201):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### POST `/api/v1/auth/login`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongP@ss1"
}
```
**Response (200):**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### POST `/api/v1/auth/refresh`
**Request Body:**
```json
{
  "refresh_token": "eyJ..."
}
```
**Response (200):** Same as login response.

#### POST `/api/v1/auth/logout`
**Request Body:**
```json
{
  "refresh_token": "eyJ..."
}
```
**Response (200):**
```json
{
  "message": "Successfully logged out"
}
```

#### GET `/api/v1/auth/me`
**Response (200):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```


**Base URL:** `/api/v1`

All responses follow a consistent envelope where applicable. Dates are ISO 8601. All `id` fields are UUIDs.

#### Products

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/products` | List products (paginated, filterable) | No |
| GET | `/api/v1/products/{product_id}` | Get single product | No |
| POST | `/api/v1/products` | Create product | Admin |
| PUT | `/api/v1/products/{product_id}` | Update product | Admin |
| DELETE | `/api/v1/products/{product_id}` | Soft-delete product | Admin |

##### GET `/api/v1/products`
**Query Parameters:**
- `page` (int, default 1)
- `page_size` (int, default 20, max 100)
- `category_id` (uuid, optional)
- `search` (string, optional — searches name and description)
- `min_price` (decimal, optional)
- `max_price` (decimal, optional)
- `sort_by` (enum: `price_asc`, `price_desc`, `name_asc`, `name_desc`, `created_at_desc`, default `created_at_desc`)

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-name",
      "description": "Full description",
      "price": "29.99",
      "compare_at_price": "39.99",
      "sku": "SKU-001",
      "stock_quantity": 150,
      "image_url": "https://...",
      "category": {
        "id": "uuid",
        "name": "Electronics",
        "slug": "electronics"
      },
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20,
  "total_pages": 5
}
```

##### POST `/api/v1/products`
**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Full description",
  "price": "29.99",
  "compare_at_price": "39.99",
  "sku": "SKU-001",
  "stock_quantity": 150,
  "image_url": "https://...",
  "category_id": "uuid"
}
```
**Response (201):** Single product object.

#### Categories

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/categories` | List all categories | No |
| POST | `/api/v1/categories` | Create category | Admin |

#### Cart

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/v1/cart` | Get current user's cart | Access Token |
| POST | `/api/v1/cart/items` | Add item to cart | Access Token |
| PUT | `/api/v1/cart/items/{item_id}` | Update cart item quantity | Access Token |
| DELETE | `/api/v1/cart/items/{item_id}` | Remove item from cart | Access Token |
| DELETE | `/api/v1/cart` | Clear entire cart | Access Token |

##### GET `/api/v1/cart`
**Response (200):**
```json
{
  "id": "uuid",
  "items": [
    {
      "id": "uuid",
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "price": "29.99",
        "image_url": "https://...",
        "stock_quantity": 150
      },
      "quantity": 2,
      "line_total": "59.98"
    }
  ],
  "item_count": 2,
  "subtotal": "59.98",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Orders

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/api/v1/orders` | Create order from cart | Access Token |
| GET | `/api/v1/orders` | List user's orders (paginated) | Access Token |
| GET | `/api/v1/orders/{order_id}` | Get single order detail | Access Token |
| PUT | `/api/v1/orders/{order_id}/status` | Update order status | Admin |

##### POST `/api/v1/orders`
**Request Body:**
```json
{
  "shipping_address_line1": "123 Main St",
  "shipping_address_line2": "Apt 4B",
  "shipping_city": "New York",
  "shipping_state": "NY",
  "shipping_zip": "10001",
  "shipping_country": "US"
}
```
**Response (201):**
```json
{
  "id": "uuid",
  "order_number": "ORD-20240101-ABCD",
  "status": "pending",
  "items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "product_name": "Product Name",
      "quantity": 2,
      "unit_price": "29.99",
      "line_total": "59.98"
    }
  ],
  "subtotal": "59.98",
  "tax": "5.40",
  "total": "65.38",
  "shipping_address_line1": "123 Main St",
  "shipping_city": "New York",
  "shipping_state": "NY",
  "shipping_zip": "10001",
  "shipping_country": "US",
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Order status enum:** `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`

#### Health Check

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/api/health` | Health check (DB connectivity) | No |

**Response (200):**
```json
{
  "status": "healthy",
  "database": "connected",
  "version": "1.0.0"
}
```

---

## 3. Database Schema

All tables use UUID primary keys (generated server-side via `uuid4`). All tables include `created_at` and `updated_at` timestamp columns with timezone.

### `users`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid4 |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEX |
| hashed_password | VARCHAR(255) | NOT NULL |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| is_active | BOOLEAN | NOT NULL, default TRUE |
| is_admin | BOOLEAN | NOT NULL, default FALSE |
| created_at | TIMESTAMPTZ | NOT NULL, default now() |
| updated_at | TIMESTAMPTZ | NOT NULL, default now(), on update now() |

**Indexes:** `ix_users_email` (unique)

---

### `categories`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid4 |
| name | VARCHAR(100) | NOT NULL, UNIQUE |
| slug | VARCHAR(120) | NOT NULL, UNIQUE, INDEX |
| description | TEXT | NULLABLE |
| image_url | VARCHAR(500) | NULLABLE |
| created_at | TIMESTAMPTZ | NOT NULL, default now() |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() |

**Indexes:** `ix_categories_slug` (unique)

---

### `products`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid4 |
| name | VARCHAR(255) | NOT NULL, INDEX |
| slug | VARCHAR(280) | NOT NULL, UNIQUE, INDEX |
| description | TEXT | NULLABLE |
| price | NUMERIC(10,2) | NOT NULL, CHECK >= 0 |
| compare_at_price | NUMERIC(10,2) | NULLABLE, CHECK >= 0 |
| sku | VARCHAR(100) | UNIQUE, NULLABLE, INDEX |
| stock_quantity | INTEGER | NOT NULL, default 0, CHECK >= 0 |
| image_url | VARCHAR(500) | NULLABLE |
| category_id | UUID | FK → categories.id, NULLABLE, INDEX |
| is_active | BOOLEAN | NOT NULL, default TRUE |
| created_at | TIMESTAMPTZ | NOT NULL, default now() |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() |

**Indexes:** `ix_products_slug` (unique), `ix_products_sku` (unique), `ix_products_category_id`, `ix_products_name`, `ix_products_price`

**Relationships:** `category_id` → `categories.id` (ON DELETE SET NULL)

---

### `carts`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid4 |
| user_id | UUID | FK → users.id, UNIQUE, NOT NULL, INDEX |
| created_at | TIMESTAMPTZ | NOT NULL, default now() |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() |

**Relationships:** `user_id` → `users.id` (ON DELETE CASCADE). One cart per user.

---

### `cart_items`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid4 |
| cart_id | UUID | FK → carts.id, NOT NULL, INDEX |
| product_id | UUID | FK → products.id, NOT NULL, INDEX |
| quantity | INTEGER | NOT NULL, CHECK > 0 |
| created_at | TIMESTAMPTZ | NOT NULL, default now() |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() |

**Constraints:** UNIQUE(cart_id, product_id)

**Relationships:**
- `cart_id` → `carts.id` (ON DELETE CASCADE)
- `product_id` → `products.id` (ON DELETE CASCADE)

---

### `orders`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid4 |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL, INDEX |
| user_id | UUID | FK → users.id, NOT NULL, INDEX |
| status | VARCHAR(20) | NOT NULL, default 'pending', INDEX |
| subtotal | NUMERIC(12,2) | NOT NULL |
| tax | NUMERIC(12,2) | NOT NULL, default 0 |
| total | NUMERIC(12,2) | NOT NULL |
| shipping_address_line1 | VARCHAR(255) | NOT NULL |
| shipping_address_line2 | VARCHAR(255) | NULLABLE |
| shipping_city | VARCHAR(100) | NOT NULL |
| shipping_state | VARCHAR(100) | NOT NULL |
| shipping_zip | VARCHAR(20) | NOT NULL |
| shipping_country | VARCHAR(2) | NOT NULL, default 'US' |
| created_at | TIMESTAMPTZ | NOT NULL, default now() |
| updated_at | TIMESTAMPTZ | NOT NULL, default now() |

**Relationships:** `user_id` → `users.id` (ON DELETE RESTRICT)

**Indexes:** `ix_orders_order_number` (unique), `ix_orders_user_id`, `ix_orders_status`

---

### `order_items`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid4 |
| order_id | UUID | FK → orders.id, NOT NULL, INDEX |
| product_id | UUID | FK → products.id, NOT NULL |
| product_name | VARCHAR(255) | NOT NULL (snapshot) |
| quantity | INTEGER | NOT NULL, CHECK > 0 |
| unit_price | NUMERIC(10,2) | NOT NULL |
| line_total | NUMERIC(12,2) | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, default now() |

**Relationships:**
- `order_id` → `orders.id` (ON DELETE CASCADE)
- `product_id` → `products.id` (ON DELETE RESTRICT)

---

### `token_blocklist`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid4 |
| jti | VARCHAR(36) | UNIQUE, NOT NULL, INDEX |
| token_type | VARCHAR(10) | NOT NULL (access/refresh) |
| user_id | UUID | FK → users.id, NOT NULL |
| expires_at | TIMESTAMPTZ | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, default now() |

**Indexes:** `ix_token_blocklist_jti` (unique)

---

### Entity Relationship Diagram (Textual)

```
users 1──1 carts
users 1──* orders
carts 1──* cart_items
cart_items *──1 products
categories 1──* products
orders 1──* order_items
order_items *──1 products
users 1──* token_blocklist
```

---

## 4. Frontend Components

#### Component Hierarchy

```
App
├── AuthContext.Provider
│   └── BrowserRouter
│       └── Routes
│           ├── Layout
│           │   ├── Header
│           │   │   ├── Logo/NavLinks
│           │   │   ├── ProductSearch
│           │   │   ├── CartIcon
│           │   │   └── Auth buttons / User dropdown
│           │   ├── <Outlet /> (page content)
│           │   └── Footer
│           ├── HomePage → ProductGrid, CategoryFilter
│           ├── ProductsPage → ProductSearch, CategoryFilter, ProductGrid
│           ├── ProductDetailPage → ProductDetail
│           ├── CartPage → CartItem[], CartSummary
│           ├── CheckoutPage → CheckoutForm (ProtectedRoute)
│           ├── OrdersPage → OrderList (ProtectedRoute)
│           ├── OrderDetailPage → OrderDetail (ProtectedRoute)
│           ├── LoginPage → LoginForm
│           ├── RegisterPage → RegisterForm
│           ├── ProfilePage (ProtectedRoute)
│           └── NotFoundPage
```

#### Key Component Props

| Component | Props | API Calls |
|-----------|-------|-----------|
| ProductCard | `product: Product` | — |
| ProductGrid | `products: Product[], loading: boolean` | `GET /products` |
| ProductDetail | `productId: string` | `GET /products/{id}` |
| ProductSearch | `onSearch: (query: string) => void` | — |
| CategoryFilter | `categories: Category[], selected: string` | `GET /categories` |
| CartIcon | — | — (reads from cart context) |
| CartDrawer | `isOpen: boolean, onClose: () => void` | — |
| CartItem | `item: CartItem, onUpdate, onRemove` | `PUT /cart/items/{id}`, `DELETE /cart/items/{id}` |
| CartSummary | `subtotal, tax, total` | — |
| LoginForm | `onSuccess: () => void` | `POST /auth/login` |
| RegisterForm | `onSuccess: () => void` | `POST /auth/register` |
| ProtectedRoute | `children: ReactNode` | — (reads auth context) |
| OrderList | `orders: Order[]` | `GET /orders` |
| OrderDetail | `orderId: string` | `GET /orders/{id}` |
| CheckoutForm | `onSubmit: (data) => void` | `POST /orders` |

---

## 5. Dependencies

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "@tanstack/react-query": "^5.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.54.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.3.2",
    "vite": "^5.0.4",
    "vitest": "^1.0.0"
  }
}
```

### Backend Dependencies

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy[asyncio]==2.0.23
asyncpg==0.29.0
alembic==1.13.0
pydantic==2.5.2
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
httpx==0.25.2
python-dotenv==1.0.0
```

```txt
# requirements-dev.txt
pytest==7.4.3
pytest-asyncio==0.23.2
httpx==0.25.2
ruff==0.1.8
mypy==1.7.1
coverage==7.3.3
```

---

## 6. Docker Architecture

### 6.1 Services Overview

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| backend | Custom (Python Python) | 8000:8000 | FastAPI application server |
| frontend | Custom (Node build + nginx) | 3000:80 | React SPA served via nginx |
| db | postgres:15-alpine | 5432:5432 | PostgreSQL database |

### 6.2 `docker-compose.yml`

```yaml
version: "3.8"

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: e-commerce-platform-backend
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./backend:/app
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: e-commerce-platform-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    container_name: e-commerce-platform-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-e_commerce_platform}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### 6.3 Backend Dockerfile

```dockerfile
FROM python:3.11-slim AS base

WORKDIR /app

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 6.4 Frontend Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 6.5 `.dockerignore` (Backend)

```
__pycache__/
*.pyc
.venv/
.env
.git/
*.md
tests/
.pytest_cache/
.mypy_cache/
```

### 6.6 `.dockerignore` (Frontend)

```
node_modules/
dist/
.env
.git/
*.md
```

---

## 7. CI/CD Pipeline — GitHub Actions

### 7.1 Workflow: `.github/workflows/ci-cd.yml`

**Trigger:** Push to `main`, `develop`; Pull requests to `main`

**Jobs:**

| Job | Runner | Steps |
|-----|--------|-------|
| lint-and-test-backend | ubuntu-latest | Checkout → Setup Python 3.11 → Install deps → Ruff lint → Mypy type check → Pytest |
| lint-and-test-frontend | ubuntu-latest | Checkout → Setup Node 20 → npm ci → ESLint → TypeScript check → Vitest |
| build-and-push | ubuntu-latest | Checkout → Docker login → Build backend image → Build frontend image → Push to registry |
| deploy | ubuntu-latest | SSH into server → Pull images → docker-compose up -d |

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_PREFIX: ${{ github.repository }}
jobs:
  lint-and-test-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: pip
      - run: pip install -r requirements.txt -r requirements-dev.txt
      - run: ruff check .
      - run: mypy app/ --ignore-missing-imports
      - run: pytest tests/ -v --tb=short

  lint-and-test-frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npx eslint src/ --ext .ts,.tsx
      - run: npx tsc --noEmit
      - run: npx vitest run

  build-and-push:
    needs: [lint-and-test-backend, lint-and-test-frontend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}          username: ${{ github.actor }}          password: ${{ secrets.GITHUB_TOKEN }}      - uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}/backend:latest
      - uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}/frontend:latest
```

---

### README.md

The `README.md` file should include:

1. **Project Title & Description** — E-Commerce Platform
2. **Tech Stack** — React (TypeScript) + FastAPI (Python) + PostgreSQL 15
3. **Prerequisites** — Docker, Docker Compose, Node.js 20+, Python 3.11+ (or relevant runtime)
4. **Quick Start** — `docker-compose up --build`
5. **Environment Variables** — Reference to `.env.example`
6. **API Documentation** — Link to `/docs` (Swagger/OpenAPI)
7. **Project Structure** — Brief overview of frontend/ and backend/ directories
8. **Development** — How to run locally without Docker
9. **Testing** — How to run tests
10. **Deployment** — CI/CD pipeline overview

### `.env.example`

```env
# ── Application ──
APP_NAME=E-Commerce Platform
APP_ENV=development
DEBUG=true
SECRET_KEY=change-me-to-a-random-secret-key

# ── Backend ──
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
# ── Database ──
DB_HOST=localhost
DB_PORT=5432
DB_NAME=e_commerce_platform
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# ── Authentication ──
JWT_SECRET_KEY=change-me-to-a-random-jwt-secret
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7
JWT_ALGORITHM=HS256
# ── Frontend ──
VITE_API_BASE_URL=http://localhost:8000/api/v1

# ── CORS ──
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

---
