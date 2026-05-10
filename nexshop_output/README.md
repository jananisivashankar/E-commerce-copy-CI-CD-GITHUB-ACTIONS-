# NexShop Ecommerce Platform

A full-stack ecommerce platform with role-based authentication (Customer, Seller, Admin), built with React (Vite + Tailwind) and Spring Boot (MySQL + MongoDB).

---

## Project Structure

```
final-project/
├── frontend/       # React + Vite + Tailwind CSS
└── backend/        # Spring Boot + MySQL + MongoDB
```

---

## Prerequisites

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+**
- **MySQL 8.0+**
- **MongoDB Atlas** (cloud - credentials in application.properties)

---

## Environment Variables

### Backend (`backend/src/main/resources/application.properties`)

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | Pre-configured |
| `MYSQL_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/ecommerce_db` |
| `MYSQL_USER` | MySQL username | `root` |
| `MYSQL_PASSWORD` | MySQL password | `password` |
| `JWT_SECRET` | JWT signing secret | Pre-configured |
| `RAZORPAY_KEY` | Razorpay API key | `rzp_test_xxxxxxxxx` |
| `RAZORPAY_SECRET` | Razorpay secret | Pre-configured |

---

## Database Setup

### MySQL Setup
```sql
-- Run in MySQL CLI or Workbench
CREATE DATABASE IF NOT EXISTS ecommerce_db;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

**Note:** Spring Boot will auto-create all tables via `spring.jpa.hibernate.ddl-auto=update`

### MongoDB
Already configured with Atlas cloud URI. No local setup needed.

---

## Running the Application

### 1. Start the Backend

```bash
cd final-project/backend

# Update MySQL credentials in application.properties first

# Run with Maven
./mvnw spring-boot:run

# OR run the pre-built JAR
java -jar target/Ecommerce-Platform-0.0.1-SNAPSHOT.jar
```

Backend starts at: `http://localhost:8081`
Swagger API docs: `http://localhost:8081/swagger-ui/index.html`

### 2. Start the Frontend

```bash
cd final-project/frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Frontend starts at: `http://localhost:5173`

---

## Authentication & Role System

During registration, users choose their role:

| Role | Dashboard | Access |
|------|-----------|--------|
| **Customer** | `/customer/dashboard` | Shop, cart, orders, wishlist |
| **Seller** | `/seller/dashboard` | Manage products, view analytics |
| **Admin** | `/admin/dashboard` | Platform overview, user management |

After login, users are automatically redirected to their role-specific dashboard.

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register with name, email, password, role
- `POST /api/auth/login` - Login, returns JWT token

### Products (Public GET, Auth for write)
- `GET /api/products/search` - Search/filter products
- `GET /api/products/{id}` - Get product by ID (userId optional)
- `POST /api/products` - Create product (Seller)
- `PUT /api/products/{id}` - Update product (Seller)
- `DELETE /api/products/{id}` - Delete product (Seller)

### Cart
- `GET /api/cart?userId=...` - Get cart
- `POST /api/cart/add?userId=...` - Add to cart
- `PUT /api/cart/update?userId=...` - Update quantity
- `DELETE /api/cart/remove?userId=...&productId=...` - Remove item
- `DELETE /api/cart/clear?userId=...` - Clear cart

### Orders
- `POST /api/orders/checkout` - Place order from cart
- `GET /api/orders/user?userId=...` - Get user orders
- `PUT /api/orders/{id}/cancel` - Cancel order

### Wishlist
- `GET /api/wishlist?userId=...` - Get wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove` - Remove from wishlist

### Reviews
- `GET /api/reviews/{productId}` - Get reviews
- `POST /api/reviews` - Add review

### Seller Analytics
- `GET /api/seller/analytics?sellerId=...` - Get seller stats

---

## Features

### Customer
- Browse & search products
- Filter by category, sort by price
- Add to cart with quantity management
- Wishlist management
- Checkout with address entry
- Order history & cancellation
- Product reviews & ratings

### Seller
- Add / edit / delete products
- Image upload for products
- Inventory & stock management
- Sales analytics dashboard
- Low stock alerts
- Notification system

### Admin
- Platform overview with stats
- Revenue charts
- User & seller management
- Notification center

---

## Bug Fixes Applied

1. **Role system** - Fixed role normalization (ROLE_ prefix handling in JWT & Spring Security)
2. **Login redirect** - Role-based redirect after login (Customer → home, Seller → seller dashboard, Admin → admin dashboard)
3. **Register** - Added role selection (Customer / Seller / Admin)
4. **Orders page** - Fixed dark theme (now consistent green/white)
5. **ProductDetails** - Fixed crash when userId is null (non-logged-in browsing)
6. **ProductCard** - Wishlist button now actually calls the API
7. **Checkout** - Rebuilt as a complete checkout form with address + payment selection
8. **Dashboard** - Separated into CustomerDashboard, SellerDashboard, AdminDashboard
9. **CORS** - Added all common ports (5173, 3000, 4173)
10. **SecurityConfig** - GET /api/products/** is now fully public

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Axios, React Router |
| Backend | Spring Boot 3.2, Spring Security, JWT |
| SQL DB | MySQL 8 (Users, Orders, Cart via JPA) |
| NoSQL DB | MongoDB Atlas (Products, Reviews, Wishlist) |
| Payment | Razorpay (integration ready) |
| Docs | Swagger / OpenAPI |

---

## Test Credentials

Register accounts directly through the UI. The first admin account can be created by selecting "Admin" role during registration.
