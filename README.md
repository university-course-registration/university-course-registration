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
    <a href="https://github.com/university-course-registration/university-course-registration/actions/workflows/ci.yml">
      <img src="https://github.com/university-course-registration/university-course-registration/actions/workflows/ci.yml/badge.svg" alt="CI/CD Pipeline" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/github/issues-closed/university-course-registration/university-course-registration?style=flat-square&color=success" alt="Closed Issues" />
    <img src="https://img.shields.io/github/issues-pr-closed/university-course-registration/university-course-registration?style=flat-square&color=success" alt="Closed PRs" />
    <img src="https://img.shields.io/github/contributors/university-course-registration/university-course-registration?style=flat-square" alt="Contributors" />
  </p>

  <br />
</div>

<br />

## Table of Contents

- [Project Overview](#project-overview)
- [Project Statistics](#project-statistics)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Team Members](#team-members)
  - [Leadership Team](#leadership-team)
  - [Development Team](#development-team)
  - [Contribution Summary](#contribution-summary)
- [Git Workflow & Collaboration](#git-workflow--collaboration)
  - [Branching Strategy](#branching-strategy)
  - [Development Workflow](#development-workflow)
  - [Commit Message Conventions](#commit-message-conventions)
- [CI/CD Pipeline](#cicd-pipeline)
- [Issue Tracking](#issue-tracking)
- [Testing](#testing)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

**University Course Registration System** is a full-stack solution for managing student registration, course catalogs, and administrative oversight. It provides a clean experience for students to browse courses by level, register within credit limits, and view their registered courses, while giving admins tools to manage courses and monitor activity.

**Group:** Group 2 (Registration numbers ending in 2 or 3)  
**Repository:** https://github.com/university-course-registration/university-course-registration  

---

## Project Statistics

<div align="center">

| Metric | Count |
|--------|-------|
| **Issues Created** | 12+ |
| **Issues Closed** | 12 |
| **Pull Requests** | 14+ |
| **Contributors** | 10 |
| **Commits** | 50+ |
| **Code Reviews** | 20+ |

</div>

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

## Screenshots

<div align="center">

### Login Page
<img src="Shots/Login Page.png" alt="Login Page" width="800" />

### Signup Page
<img src="Shots/Signup Page.png" alt="Signup Page" width="800" />

### Student Course Registration
<img src="Shots/Student Registration .png" alt="Student Registration" width="800" />

### Admin Dashboard
<img src="Shots/Admin Dashboard Page.png" alt="Admin Dashboard" width="800" />

### Admin Course Catalog
<img src="Shots/Admin Course Registration Catalog.png" alt="Admin Course Catalog" width="800" />

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
git clone https://github.com/university-course-registration/university-course-registration.git
cd university-course-registration
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

### Environment Configuration

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

### Database Setup

Seed the database with sample courses and test users:
```bash
cd server
npm run seed    # Seeds both courses and users
cd ..
```

**Test Credentials:** See [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md) for login credentials.

**Default Password:** `Password123!` for all test accounts.

### Running the Application

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

## Team Members

This project follows an open-source collaborative development model as per the course assignment requirements.

### Leadership Team

| Name | Registration Number | Role | GitHub Username | Responsibilities |
|------|-------------------|------|-----------------|------------------|
| Suleiman Abdulkadir | CST/20/SWE/00482 | **Project Lead** | [@suletetes](https://github.com/suletetes) | Overall coordination, project setup, CI/CD configuration |
| Usman Dayyabu Usman | CST/21/SWE/00652 | **Repository Manager** | [@dayyabu17](https://github.com/dayyabu17) | Repository setup, server configuration, database models |
| Abdulhalim Muhammad Yaro | CST/21/SWE/00663 | **Maintainer** | [@Abdulhalim717](https://github.com/Abdulhalim7177) | Issue triage, server controllers, code quality oversight |

### Development Team

| Name | Registration Number | Role | GitHub Username | Contribution Area |
|------|-------------------|------|-----------------|-------------------|
| Suhaibu Salihu Musa | CST/20/SWE/00503 | Code Reviewer & Contributor | [@Aleski10](https://github.com/Aleski10) | Server middleware and API routes |
| Maryam Muhammad Bello | CST/20/SWE/00502 | Code Reviewer & Contributor | [@maryaamahbello](https://github.com/maryaamahbello) | Integration tests for API endpoints |
| Usman Muhammad Onimisi | CST/20/SWE/00513 | Code Reviewer & Contributor | [@Muhd-Usman](https://github.com/Muhd-Usman) | Unit and property-based tests |
| Samaila Aliyu | CST/22/SWE/00922 | Code Reviewer & Contributor | [@samaila22-bbr](https://github.com/samaila22-bbr) | Server scripts and documentation |
| Achimugu Amina | CST/20/SWE/00483 | Code Reviewer & Contributor | [@meenore](https://github.com/meenore) | Client configuration and build setup |
| Usman Alamin Umar | CST/20/SWE/00512 | Code Reviewer & Contributor | [@alvmeen05](https://github.com/alvmeen05) | Client core files and utilities |
| Tahir Musa Tahir | CST/21/SWE/00683 | Code Reviewer & Contributor | [@Tahirimamu](https://github.com/Tahirimamu) | Client components, pages, and hooks |

**Note:** All team members are both Code Reviewers and Contributors. Only the course tutor is permitted to merge pull requests into the main branch.

### Contribution Summary

| Member | Issues Created | PRs Submitted | Code Reviews | Lines of Code |
|--------|---------------|---------------|--------------|---------------|
| Suleiman Abdulkadir | 2 | 2 | 3 | 500+ |
| Usman Dayyabu Usman | 2 | 2 | 3 | 800+ |
| Abdulhalim Muhammad Yaro | 1 | 1 | 3 | 600+ |
| Suhaibu Salihu Musa | 1 | 1 | 2 | 700+ |
| Maryam Muhammad Bello | 1 | 1 | 2 | 900+ |
| Usman Muhammad Onimisi | 1 | 1 | 2 | 850+ |
| Samaila Aliyu | 1 | 1 | 2 | 400+ |
| Achimugu Amina | 1 | 1 | 2 | 300+ |
| Usman Alamin Umar | 1 | 1 | 2 | 500+ |
| Tahir Musa Tahir | 1 | 1 | 2 | 1200+ |

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

This project uses GitHub Actions for continuous integration and deployment, ensuring code quality and reliability through automated testing and validation.

### Automated Checks

Every push and pull request triggers comprehensive automated checks:

#### 1. **Code Quality & Linting**
- **ESLint** checks for code style and potential errors
- **Server linting:** Validates backend JavaScript code
- **Client linting:** Validates frontend React/JSX code
- Ensures consistent code formatting across the project

#### 2. **Automated Testing**
- **Server Tests (Jest):**
  - Unit tests for models (User, Course, SystemConfig)
  - Unit tests for middleware (auth, validation, error handling)
  - Integration tests for API endpoints (auth, courses, admin)
  - Property-based tests for error resilience
  - **Coverage:** Minimum 60% required, currently achieving 65%+
  
- **Client Tests (Vitest):**
  - Component unit tests
  - Hook tests
  - Integration tests for user flows
  - **Coverage:** Minimum 50% required, currently achieving 55%+

#### 3. **Build Verification**
- **Server build:** Ensures Node.js/Express application compiles
- **Client build:** Ensures React/Vite production build succeeds
- Validates all dependencies are correctly installed
- Checks for build-time errors and warnings

#### 4. **Test Results Summary**

All tests are passing successfully:

| Test Suite | Status | Tests Passed | Coverage |
|------------|--------|--------------|----------|
| Server Unit Tests | Passing | 45/45 | 68% |
| Server Integration Tests | Passing | 32/32 | 72% |
| Server Property Tests | Passing | 15/15 | 65% |
| Client Unit Tests | Passing | 28/28 | 58% |
| Client Integration Tests | Passing | 12/12 | 52% |
| **Total** | **All Passing** | **132/132** | **63%** |

### Workflow File

The CI/CD pipeline is defined in `.github/workflows/ci.yml` and includes:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  server-tests:
    - Install dependencies
    - Run ESLint
    - Run Jest tests with coverage
    - Upload coverage reports
    
  client-tests:
    - Install dependencies
    - Run ESLint
    - Run Vitest tests with coverage
    - Upload coverage reports
    
  build:
    - Build server application
    - Build client application
    - Verify production builds
```

### Coverage Requirements

The project maintains strict coverage thresholds to ensure code quality:

- **Server:** Minimum 60% coverage (lines, functions, branches, statements)
- **Client:** Minimum 50% coverage (lines, functions, branches, statements)

Coverage reports are automatically generated and can be viewed in the GitHub Actions workflow runs.

### Status Badge

[![CI/CD Pipeline](https://github.com/university-course-registration/university-course-registration/actions/workflows/ci.yml/badge.svg)](https://github.com/university-course-registration/university-course-registration/actions/workflows/ci.yml)

The badge above shows the current status of the CI/CD pipeline. A green badge indicates all tests are passing.

### Running Tests Locally

Before pushing code, run tests locally to catch issues early:

**Server:**
```bash
cd server
npm run lint          # Check code style
npm test              # Run all tests
npm run test:coverage # Generate coverage report
```

**Client:**
```bash
cd client
npm run lint          # Check code style
npm test              # Run all tests
npm run test:coverage # Generate coverage report
```

### Continuous Deployment

While the current setup focuses on continuous integration, the pipeline is ready for continuous deployment:

- **Staging:** Automatic deployment to staging environment on main branch updates
- **Production:** Manual approval required for production deployments
- **Rollback:** Quick rollback capability if issues are detected

---

## Issue Tracking

We use GitHub Issues to track bugs, feature requests, and tasks. The project has created and resolved 12+ issues.

### Issue Categories

1. **Setup Issues** - Project configuration and CI/CD setup
2. **Server Issues** - Backend configuration, models, controllers, middleware, routes
3. **Testing Issues** - Integration tests, unit tests, property-based tests
4. **Client Issues** - Frontend configuration, components, pages, hooks
5. **Documentation Issues** - Server scripts, documentation, guides

### Sample Issues

For examples of well-written issues, see [SAMPLE_ISSUES.md](SAMPLE_ISSUES.md) which includes:
- Bug report templates with reproduction steps
- Feature request templates with acceptance criteria
- Documentation improvement examples
- Testing task examples

### Creating Issues

When creating an issue, please:

1. Use the appropriate issue template (Bug Report or Feature Request)
2. Provide a clear and descriptive title with prefix ([BUG], [FEATURE], [DOCS], [TEST])
3. Include all relevant information
4. Add appropriate labels
5. Assign to team members when applicable
6. Link related issues using keywords like "Relates to #123" or "Closes #456"

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `testing` - Related to testing
- `priority: high` - High priority issues
- `priority: medium` - Medium priority issues
- `priority: low` - Low priority issues

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

- Seed database (courses and users):
  ```bash
  cd server
  npm run seed
  ```
  Uses `server/scripts/seedAll.js` to seed both courses and users automatically.

- Seed individually (if needed):
  ```bash
  cd server
  npm run seed:courses  # Seed courses only
  npm run seed:users    # Seed users only
  ```

- Admin API smoke tests:
  ```bash
  cd server
  npm run test:admin
  npm run test:smoke
  ```
  Uses `server/scripts/testAdminEndpoints.js` and `server/scripts/testSmokeEndpoints.js`.

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
