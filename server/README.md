# Server - University Course Registration System

Backend API for the University Course Registration System built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Testing**: Jest with Supertest
- **Code Quality**: ESLint

## Project Structure

```
server/
├── controllers/         # Route handler logic
│   ├── adminController.js
│   ├── authController.js
│   ├── courseController.js
│   ├── exportController.js
│   └── profileController.js
├── models/              # Mongoose schemas
│   ├── Course.js
│   ├── SystemConfig.js
│   └── User.js
├── routes/              # Express route definitions
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── courseRoutes.js
│   ├── exportRoutes.js
│   └── profileRoutes.js
├── middleware/          # Custom middleware
│   ├── authMiddleware.js
│   ├── checkRegistrationPeriod.js
│   ├── errorHandler.js
│   └── validation.js
├── scripts/             # Database seeding and utilities
│   ├── seedDatabase.js
│   ├── seedUsers.js
│   ├── testAdminEndpoints.js
│   └── testSmokeEndpoints.js
├── __tests__/           # Test files
│   ├── integration/
│   ├── property/
│   └── unit/
└── index.js             # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/course_registration
JWT_SECRET=your_jwt_secret_key_here
```

### Running the Server

**Development mode** (with hot-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## Database Setup

### Seed the Database

**Seed courses** (40 courses with prerequisites and capacity):
```bash
npm run seed
```

**Seed test users** (10 users: 8 students + 2 admins):
```bash
npm run seed:users
```

All test users have the password: `Password123!`

See `TEST_CREDENTIALS.txt` in the root directory for login credentials.

## API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /signin` - Login user

### Courses (`/api/courses`)
- `GET /all` - Get all courses (filtered by level)
- `POST /register` - Register for courses
- `GET /registered` - Get user's registered courses
- `POST /unregister` - Unregister from courses

### Profile (`/api/profile`)
- `GET /` - Get current user profile
- `PUT /` - Update profile (name, email)
- `PUT /password` - Change password

### Admin (`/api/admin`)
- `GET /stats` - Get dashboard statistics
- `GET /students` - Get all students with registrations
- `GET /courses` - Get all courses
- `POST /courses` - Create new course
- `PUT /courses/:id` - Update course
- `PUT /courses/:id/archive` - Archive course
- `PUT /courses/:id/restore` - Restore archived course
- `GET /courses/archived` - Get archived courses
- `GET /registration-period` - Get registration period
- `PUT /registration-period` - Update registration period

### Export (`/api/export`)
- `GET /students/:id/slip` - Export student registration slip

## Testing

**Run all tests**:
```bash
npm test
```

**Run tests with coverage**:
```bash
npm test -- --coverage
```

**Run specific test suite**:
```bash
npm test -- __tests__/integration/auth.test.js
```

**Test admin endpoints** (requires running server):
```bash
npm run test:admin
```

**Smoke test endpoints** (requires running server):
```bash
npm run test:smoke
```

### Test Coverage

The project maintains the following coverage thresholds:
- Branches: 60%
- Functions: 60%
- Lines: 60%
- Statements: 60%

## Code Quality

**Run ESLint**:
```bash
npm run lint
```

**Auto-fix ESLint issues**:
```bash
npm run lint -- --fix
```

## Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Student/Admin)
- Protected routes with middleware
- Password hashing with bcryptjs

### Course Management
- CRUD operations for courses
- Soft delete with archive/restore functionality
- Course capacity tracking
- Prerequisite validation
- Level-based filtering

### Registration System
- 36-unit credit limit validation
- Prerequisite checking
- Capacity enforcement
- Concurrent enrollment tracking
- Registration period management

### Profile Management
- Update user information
- Change password with validation
- Email uniqueness checking

## Data Models

### User
```javascript
{
  name: String,
  regNo: String (unique),
  email: String (unique),
  password: String (hashed),
  level: String (enum: '100', '200', '300', '400', '500'),
  role: String (enum: 'student', 'admin'),
  registeredCourses: [ObjectId]
}
```

### Course
```javascript
{
  courseCode: String (unique),
  courseName: String,
  semester: Number (enum: 1, 2),
  creditUnit: Number (enum: 2, 3),
  level: String (enum: '100', '200', '300', '400', '500'),
  prerequisites: [String],
  capacity: Number (default: 50),
  enrolledCount: Number (default: 0),
  isActive: Boolean (default: true),
  isArchived: Boolean (default: false),
  archivedAt: Date
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `NODE_ENV` | Environment (development/production/test) | development |

## Error Handling

The API uses centralized error handling with consistent error responses:

```javascript
{
  status: 'error',
  error: 'Error Type',
  message: 'Human-readable error message'
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Best Practices

- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- Protected routes require valid JWT
- Admin routes require admin role
- Input validation on all endpoints
- CORS enabled for cross-origin requests

## Development Tips

1. Use `nodemon` for automatic server restart during development
2. Check MongoDB connection before starting development
3. Use the seeding scripts to populate test data
4. Run tests before committing changes
5. Follow ESLint rules for code consistency

## Troubleshooting

**MongoDB connection error**:
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

**JWT authentication error**:
- Check `JWT_SECRET` is set in `.env`
- Verify token is included in Authorization header
- Ensure token hasn't expired

**Test failures**:
- Clear test database between runs
- Check MongoDB is accessible
- Verify all environment variables are set

## Contributing

1. Follow the existing code structure
2. Write tests for new features
3. Maintain code coverage thresholds
4. Run linting before committing
5. Use meaningful commit messages

## License

See LICENSE.md in the root directory.
