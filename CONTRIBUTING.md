# Contributing to University Course Registration System

Thank you for your interest in contributing to the University Course Registration System! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We pledge to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

Examples of unacceptable behavior include:

- Harassment, discrimination, or offensive comments
- Trolling, insulting, or derogatory remarks
- Publishing others' private information without permission
- Any conduct that could reasonably be considered inappropriate in a professional setting

### Enforcement

Instances of unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

---

## Getting Started

### Development Setup

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/university-course-registration.git
   cd university-course-registration
   ```

2. **Install Dependencies**
   
   Server:
   ```bash
   cd server
   npm install
   ```
   
   Client:
   ```bash
   cd client
   npm install
   ```

3. **Set Up Environment Variables**
   
   Create `.env` files in both `server/` and `client/` directories:
   
   Server (`.env`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/course_reg_db
   JWT_SECRET=your_development_jwt_secret
   NODE_ENV=development
   ```
   
   Client (`.env`):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start Development Servers**
   
   Server:
   ```bash
   cd server
   npm run dev
   ```
   
   Client (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

---

## Branching Strategy

We follow a feature branch workflow:

### Branch Types

- **`main`**: Production-ready code. Protected branch.
- **`feature/*`**: New features (e.g., `feature/course-prerequisites`)
- **`bugfix/*`**: Bug fixes (e.g., `bugfix/registration-validation`)
- **`hotfix/*`**: Urgent production fixes (e.g., `hotfix/security-patch`)
- **`docs/*`**: Documentation updates (e.g., `docs/api-documentation`)

### Creating a Branch

```bash
# For a new feature
git checkout -b feature/your-feature-name

# For a bug fix
git checkout -b bugfix/issue-description

# For a hotfix
git checkout -b hotfix/critical-issue
```

### Branch Naming Conventions

- Use lowercase with hyphens
- Be descriptive but concise
- Include issue number if applicable: `feature/123-add-search`

---

## Commit Message Conventions

We follow the Conventional Commits specification for clear and consistent commit messages.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, build config, etc.)
- **perf**: Performance improvements

### Examples

```bash
# Feature
git commit -m "feat(courses): add course search functionality"

# Bug fix
git commit -m "fix(auth): resolve token expiration issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Test
git commit -m "test(courses): add unit tests for course validation"

# Breaking change
git commit -m "feat(api): change course registration endpoint

BREAKING CHANGE: The /api/courses/register endpoint now requires courseIds as an array instead of a comma-separated string."
```

### Commit Message Guidelines

- Use the imperative mood ("add" not "added" or "adds")
- Keep the subject line under 50 characters
- Capitalize the subject line
- Do not end the subject line with a period
- Separate subject from body with a blank line
- Wrap the body at 72 characters
- Use the body to explain what and why, not how

---

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   # Server tests
   cd server && npm test
   
   # Client tests
   cd client && npm test
   ```

2. **Run linting**
   ```bash
   # Server
   cd server && npm run lint
   
   # Client
   cd client && npm run lint
   ```

3. **Update documentation** if you've changed APIs or added features

4. **Add tests** for new functionality

### Submitting a Pull Request

1. **Push your branch** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub

3. **Fill out the PR template** completely

4. **Link related issues** using keywords (e.g., "Closes #123")

5. **Request review** from maintainers

### Pull Request Template

When you open a PR, include:

- **Description**: Clear explanation of what the PR does
- **Related Issues**: Link to related issues
- **Type of Change**: Bug fix, feature, documentation, etc.
- **Testing**: How you tested the changes
- **Screenshots**: If applicable (UI changes)
- **Checklist**: Confirm all requirements are met

---

## Code Review Guidelines

### For Contributors

- Be open to feedback and suggestions
- Respond to review comments promptly
- Make requested changes in new commits (don't force push)
- Ask questions if review feedback is unclear

### For Reviewers

- Be respectful and constructive
- Focus on the code, not the person
- Explain the reasoning behind suggestions
- Approve PRs that meet quality standards
- Request changes when necessary

### Review Checklist

- [ ] Code follows project style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No unnecessary code or comments
- [ ] Error handling is appropriate
- [ ] Security considerations are addressed
- [ ] Performance impact is acceptable

---

## Testing Requirements

### Test Coverage

- **Server**: Minimum 60% coverage
- **Client**: Minimum 50% coverage

### Writing Tests

1. **Unit Tests**: Test individual functions and components
   ```javascript
   // Example unit test
   describe('validateEmail', () => {
     it('should return true for valid email', () => {
       expect(validateEmail('test@example.com')).toBe(true);
     });
     
     it('should return false for invalid email', () => {
       expect(validateEmail('invalid-email')).toBe(false);
     });
   });
   ```

2. **Integration Tests**: Test API endpoints and component interactions
   ```javascript
   // Example integration test
   describe('POST /api/auth/signup', () => {
     it('should create a new user', async () => {
       const response = await request(app)
         .post('/api/auth/signup')
         .send({
           name: 'Test User',
           email: 'test@example.com',
           password: 'SecurePass123!'
         });
       
       expect(response.status).toBe(201);
       expect(response.body).toHaveProperty('token');
     });
   });
   ```

3. **Property-Based Tests**: Test universal properties
   ```javascript
   // Example property test
   it('should validate all invalid inputs', () => {
     fc.assert(
       fc.property(
         fc.record({
           email: fc.string(),
           password: fc.string()
         }),
         (invalidData) => {
           const result = validateLoginData(invalidData);
           expect(result.valid).toBe(false);
         }
       )
     );
   });
   ```

### Testing Best Practices

- Write tests before or alongside code (TDD approach)
- Test edge cases and error conditions
- Use descriptive test names
- Keep tests focused and independent
- Mock external dependencies
- Avoid testing implementation details

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- path/to/test.js
```

---

## Resolving Merge Conflicts

### When Conflicts Occur

1. **Update your local main branch**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Rebase your feature branch**
   ```bash
   git checkout feature/your-feature
   git rebase main
   ```

3. **Resolve conflicts**
   - Open conflicted files
   - Look for conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
   - Edit files to resolve conflicts
   - Remove conflict markers

4. **Continue rebase**
   ```bash
   git add .
   git rebase --continue
   ```

5. **Force push** (only to your feature branch)
   ```bash
   git push origin feature/your-feature --force
   ```

### Avoiding Conflicts

- Pull from main frequently
- Keep feature branches short-lived
- Communicate with team about overlapping work
- Break large features into smaller PRs

---

## Branch Protection Rules

The `main` branch is protected with the following rules:

- **Require pull request reviews**: At least 1 approval required
- **Require status checks**: All CI tests must pass
- **Require branches to be up to date**: Must be current with main
- **No force pushes**: Prevents history rewriting
- **No deletions**: Branch cannot be deleted

### Merging to Main

1. Create a pull request from your feature branch
2. Ensure all CI checks pass
3. Request review from maintainers
4. Address review feedback
5. Wait for approval
6. Maintainer will merge the PR

---

## Development Workflow Summary

1. **Create an issue** or pick an existing one
2. **Create a feature branch** from main
3. **Make your changes** with clear commits
4. **Write tests** for new functionality
5. **Run tests and linting** locally
6. **Push your branch** to your fork
7. **Open a pull request** with a clear description
8. **Respond to review feedback**
9. **Wait for approval and merge**

---

## Getting Help

- **Documentation**: Check the README and this guide first
- **Issues**: Search existing issues for similar problems
- **Discussions**: Use GitHub Discussions for questions
- **Contact**: Reach out to maintainers if needed

---

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation

Thank you for contributing to the University Course Registration System!
