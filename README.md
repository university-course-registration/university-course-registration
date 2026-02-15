<div align="center">

  <h1>
    <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&pause=1000&color=2E86C1&center=true&vCenter=true&width=640&lines=University+Course+Registration+System;Full+Stack+Application;Built+with+MERN+Stack" alt="Typing SVG" />
  </h1>

  <p>
    <b>A streamlined platform for managing university course registration.</b>
  </p>

  <p>
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License" />
    <img src="https://github.com/your-username/university-course-registration/workflows/CI/badge.svg" alt="CI Status" />
  </p>

  <br />

  <!-- Placeholder for App Demo/Screenshot -->
  <img src="/Screenshot 2026-02-03 162925.png" alt="App Screenshot" width="800" />

  <br />
</div>

<br />

## Project Overview

**University Course Registration System** is a full-stack solution for managing student registration, course catalogs, and administrative oversight. It provides a clean experience for students to browse courses by level, register within credit limits, and view their registered courses, while giving admins tools to manage courses and monitor activity.

---

## Key Features

| Feature | Description |
| :--- | :--- |
| **Role-Based Access** | Secure authentication for Students and Admins using JWT. |
| **Course Catalog** | Browse courses by level, with optional carry-over inclusion. |
| **Registration Workflow** | Register courses with validation and a 36-unit max limit. |
| **Registered Courses View** | Clear summary tables for enrolled courses. |
| **Admin Dashboard** | Overview stats and management tools for courses and users. |
| **Modern UI/UX** | Responsive interface built with Tailwind CSS. |

---

## Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

### Backend
![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?style=flat&logo=node.js&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)

</div>

---

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

*   **Node.js** (v18 or higher)
*   **npm** or **yarn**
*   **MongoDB** (Local instance or Atlas URI)
*   **Git** (for version control)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/university-course-reg.git
cd university-course-reg
```

#### 2. Install Dependencies (Root, Server, and Client)
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

#### 3. Environment Configuration

**Server Configuration:**
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/course_reg_db
JWT_SECRET=your_super_secure_jwt_secret
```

**Client Configuration:**
Create a `.env` file in the `client/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### 4. Database Setup (Optional)
Seed the database with sample courses and test users:
```bash
cd server
npm run seed        # Seed courses
npm run seed:users  # Create test users
cd ..
```

#### 5. Running the Application

**Option A: Run Both Client and Server (from root directory)**
```bash
npm run dev
```
This will start both the backend server (port 5000) and frontend dev server (port 5173) concurrently.

**Option B: Run Separately**

Terminal 1 (Server):
```bash
cd server
npm run dev
```

Terminal 2 (Client):
```bash
cd client
npm run dev
```

**The app should now be running at:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

---

## Git Workflow & Collaboration

This project follows standard open-source development practices using Git and GitHub.

### Branching Strategy

- **`main`** - Production-ready code (protected branch)
- **`feature/*`** - New features (e.g., `feature/course-search`)
- **`bugfix/*`** - Bug fixes (e.g., `bugfix/login-error`)
- **`hotfix/*`** - Urgent production fixes

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "feat: add course search functionality"
   ```

3. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request:**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Request reviews from team members

5. **Code Review:**
   - At least one reviewer must approve
   - Address any requested changes
   - Ensure all CI checks pass

6. **Merging:**
   - **Only the course tutor can merge PRs to main**
   - Direct commits to main are not allowed

### Commit Message Conventions

Follow conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(auth): add JWT token refresh"
git commit -m "fix(courses): resolve registration limit bug"
git commit -m "docs(readme): update installation instructions"
```

---

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment.

### Automated Checks

Every push and pull request triggers:

1. **Linting** - ESLint checks for code quality
2. **Testing** - Jest (server) and Vitest (client) test suites
3. **Build Verification** - Ensures production builds succeed
4. **Coverage Reports** - Generates and displays test coverage

### Workflow File

The CI/CD pipeline is defined in `.github/workflows/ci.yml`

### Coverage Requirements

- **Server**: Minimum 60% coverage
- **Client**: Minimum 50% coverage

### Status Badge

![CI Status](https://github.com/your-username/university-course-registration/workflows/CI/badge.svg)

---

## Project Structure

```bash
/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI Components
│   │   ├── hooks/       # Client data and state hooks
│   │   ├── pages/       # Application Routes/Views
│   │   └── ...
├── server/              # Node.js Backend
│   ├── controllers/     # Route Logic
│   ├── models/          # Mongoose Schemas
│   ├── routes/          # API Endpoints
│   └── ...
├── package.json         # Root dependencies
└── README.md            # You are here
```

---

## API Overview

Base URL: `http://localhost:5000/api` (configurable via `VITE_API_BASE_URL`)

### Auth

- `POST /auth/signup`
- `POST /auth/login`

### Courses

- `GET /courses/all?level=100&includeLevels=200,300`
- `POST /courses/register`
- `GET /courses/registered`

### Admin

- `GET /admin/stats`
- `GET /admin/students`
- `GET /admin/courses`
- `POST /admin/courses`

---

## Team Roles & Governance

This project follows an open-source collaborative development model as per the course assignment requirements. Team members are organized according to the following governance structure:

### Team Structure

| Role | Responsibility | Selection Method |
|------|---------------|------------------|
| **Project Lead** | Overall coordination, project direction, and major decisions | Meritocratic Governance Model |
| **Repository Manager** | Repository setup, permissions, branch protection rules | Consensus-based selection |
| **Maintainers** | Issue triage, code quality oversight, release management | Appointed by team |
| **Code Reviewers** | Review pull requests, ensure code quality and standards | All team members |
| **Contributors** | Write code, documentation, and submit improvements | All team members |

### Team Members

> **Note**: Update this section with actual team member names and their assigned roles

| Name | Registration Number | Role(s) | GitHub Username |
|------|-------------------|---------|-----------------|
| [Name] | UG15/CS/XXXX | Project Lead, Contributor | @username |
| [Name] | UG15/CS/XXXX | Repository Manager, Code Reviewer | @username |
| [Name] | UG15/CS/XXXX | Maintainer, Code Reviewer | @username |
| [Name] | UG15/CS/XXXX | Code Reviewer, Contributor | @username |
| [Name] | UG15/CS/XXXX | Contributor | @username |

### Important Notes

- **Code reviewers must be group members**
- **Only the course tutor is permitted to merge pull requests into the main branch**
- All team members are expected to follow the [Code of Conduct](CONTRIBUTING.md#code-of-conduct)
- Balanced participation from all members is mandatory

---

## Issue Tracking

We use GitHub Issues to track bugs, feature requests, and tasks. Each group must create a minimum of 5 issues.

### Creating Issues

When creating an issue, please:

1. Use the appropriate issue template (Bug Report or Feature Request)
2. Provide a clear and descriptive title
3. Include all relevant information
4. Add appropriate labels
5. Assign to team members when applicable

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `testing` - Related to testing

### Example Issues

See [SAMPLE_ISSUES.md](SAMPLE_ISSUES.md) for examples of well-written issues.

---

## Testing

### Running Tests Locally

**Server Tests:**
```bash
cd server
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

**Client Tests:**
```bash
cd client
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Test Coverage

The project maintains the following coverage thresholds:
- Server: 60% coverage (lines, functions, branches, statements)
- Client: 50% coverage (lines, functions, branches, statements)

Coverage reports are generated in the `coverage/` directory after running tests with the `--coverage` flag.

---

## Scripts

From `server/package.json`:

- Seed courses:
  ```bash
  cd server
  npm run seed
  ```
  Uses `server/scripts/seedDatabase.js`.

- Seed test users:
  ```bash
  cd server
  npm run seed:users
  ```
  Uses `server/scripts/seedUsers.js`.

- Admin API smoke tests:
  ```bash
  cd server
  npm run test:admin
  npm run test:smoke
  ```
  Uses `server/scripts/testAdminEndpoints.js` and `server/scripts/testSmokeEndpoints.js`.
  Requires `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optional `ADMIN_TEST_BASE_URL` in `server/.env.test`.

---

## Notes

- Course registration enforces a 36-unit maximum on the server.
- Client session data is stored in `sessionStorage` using keys from `client/src/constants/storageKeys.js`.

---

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) to get started.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and add tests
4. Run tests and linting locally
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:
- Development setup
- Coding standards
- Testing requirements
- Pull request process
- Code review expectations

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## Contact

For questions, issues, or suggestions, please:
- Open an issue on GitHub
- Check existing issues and discussions
- Follow our contribution guidelines

---

<div align="center">
  <p>Made with care by the University Course Registration System team</p>
  <p>
    <a href="CONTRIBUTING.md">Contributing</a> •
    <a href="LICENSE.md">License</a>
  </p>
</div>

