# Mini CRM Backend

A production-quality REST API built with NestJS, PostgreSQL, and Prisma featuring JWT authentication, role-based authorization, and comprehensive CRUD operations for user, customer, and task management.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (ADMIN, EMPLOYEE)
  - Secure password hashing with bcrypt

- **User Management**
  - User registration and login
  - Admin-only user management endpoints
  - Role updates

- **Customer Management**
  - Full CRUD operations
  - Pagination support
  - Search functionality
  - Unique email and phone validation

- **Task Management**
  - Create tasks and assign to employees
  - Role-based task visibility
  - Status updates (PENDING, IN_PROGRESS, DONE)
  - Employee can only update their own tasks

- **API Documentation**
  - Interactive Swagger/OpenAPI documentation
  - JWT authentication in Swagger UI
  - Comprehensive request/response examples

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- [Git](https://git-scm.com/)

## 🛠️ Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (Passport)
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger (@nestjs/swagger)
- **Password Hashing:** bcrypt

## 📦 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd CRM_Application
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying the example file:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/mini_crm?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="24h"

# Application Configuration
PORT=3000
NODE_ENV="development"
```

**Important:** Replace the database credentials and JWT secret with your own values.

### 4. Database Setup

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE mini_crm;

# Exit PostgreSQL
\q
```

#### Run Prisma Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations to create database tables
npm run prisma:migrate

# (Optional) Open Prisma Studio to view your database
npm run prisma:studio
```

## 🏃 Running the Application

### Development Mode

```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

## 📚 API Documentation

Once the application is running, access the interactive Swagger documentation at:

```
http://localhost:3000/api
```

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive API testing
- JWT authentication support

### Using JWT Authentication in Swagger

1. Register or login to get an access token
2. Click the "Authorize" button in Swagger UI
3. Enter: `Bearer <your-access-token>`
4. Click "Authorize"
5. Now you can test protected endpoints

## 🔐 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login and get JWT token | Public |

### Users (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| PATCH | `/users/:id` | Update user role | Admin |

### Customers

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/customers` | Create a customer | Admin |
| GET | `/customers` | Get all customers (paginated) | Admin, Employee |
| GET | `/customers/:id` | Get customer by ID | Admin, Employee |
| PATCH | `/customers/:id` | Update customer | Admin |
| DELETE | `/customers/:id` | Delete customer | Admin |

### Tasks

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/tasks` | Create a task | Admin |
| GET | `/tasks` | Get tasks (all for Admin, assigned for Employee) | Admin, Employee |
| PATCH | `/tasks/:id/status` | Update task status | Admin, Employee (own tasks) |

## 📝 Usage Examples

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123",
    "role": "ADMIN"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "ADMIN"
  }
}
```

### 3. Create a Customer (Admin)

```bash
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "name": "Acme Corporation",
    "email": "contact@acme.com",
    "phone": "+1234567890",
    "company": "Acme Inc."
  }'
```

### 4. Get Customers with Pagination

```bash
curl -X GET "http://localhost:3000/customers?page=1&limit=10" \
  -H "Authorization: Bearer <your-token>"
```

### 5. Create a Task (Admin)

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "title": "Follow up with client",
    "description": "Schedule a meeting",
    "assignedTo": "<employee-user-id>",
    "customerId": "<customer-id>",
    "status": "PENDING"
  }'
```

### 6. Update Task Status (Employee)

```bash
curl -X PATCH http://localhost:3000/tasks/<task-id>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

## 🗄️ Database Schema

### User
- id (UUID, Primary Key)
- name (String)
- email (String, Unique)
- password (String, Hashed)
- role (Enum: ADMIN, EMPLOYEE)
- createdAt (DateTime)
- updatedAt (DateTime)

### Customer
- id (UUID, Primary Key)
- name (String)
- email (String, Unique)
- phone (String, Unique)
- company (String, Optional)
- createdAt (DateTime)
- updatedAt (DateTime)

### Task
- id (UUID, Primary Key)
- title (String)
- description (String, Optional)
- status (Enum: PENDING, IN_PROGRESS, DONE)
- assignedTo (UUID, Foreign Key → User)
- customerId (UUID, Foreign Key → Customer)
- createdAt (DateTime)
- updatedAt (DateTime)

## 🧪 Testing

### Run Unit Tests

```bash
npm run test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Test Coverage

```bash
npm run test:cov
```

### Run E2E Tests

```bash
npm run test:e2e
```

## 🐳 Docker Support (Optional)

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: mini_crm_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mini_crm
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    container_name: mini_crm_app
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/mini_crm?schema=public
      JWT_SECRET: your-super-secret-jwt-key
      JWT_EXPIRATION: 24h
      PORT: 3000
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

Run with Docker:

```bash
docker-compose up -d
```

## 📂 Project Structure

```
CRM_Application/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── decorators/        # Custom decorators
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── guards/            # Auth & Role guards
│   │   ├── strategies/        # JWT strategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                 # Users module
│   │   ├── dto/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── customers/             # Customers module
│   │   ├── dto/
│   │   ├── customers.controller.ts
│   │   ├── customers.service.ts
│   │   └── customers.module.ts
│   ├── tasks/                 # Tasks module
│   │   ├── dto/
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── tasks.module.ts
│   ├── prisma/                # Prisma module
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application entry point
├── .env                       # Environment variables
├── .env.example               # Environment template
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── nest-cli.json              # NestJS config
└── README.md                  # Documentation
```

## 🔒 Security Best Practices

- ✅ Passwords are hashed using bcrypt (salt rounds: 10)
- ✅ JWT tokens are used for authentication
- ✅ Role-based authorization guards protect endpoints
- ✅ Input validation using class-validator
- ✅ Environment variables for sensitive data
- ✅ Unique constraints on email and phone
- ✅ Proper HTTP status codes for errors

## 🚨 Error Handling

The API uses standard HTTP status codes:

- **200 OK** - Successful GET/PATCH/DELETE
- **201 Created** - Successful POST
- **400 Bad Request** - Validation errors
- **401 Unauthorized** - Invalid/missing token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate email/phone

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**

- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📞 Support

For support, email your.email@example.com or create an issue in the repository.

---

**Made with ❤️ using NestJS, PostgreSQL, and Prisma**#   C R M - A p p l i c a t i o n  
 