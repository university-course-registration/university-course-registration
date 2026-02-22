# Sample GitHub Issues

This document contains sample GitHub Issues that demonstrate proper issue tracking for the University Course Registration System. These can be used as templates when creating actual issues in the GitHub repository.

---

## Issue #1: Bug Report - Course Registration Fails with Special Characters

**Labels:** `bug`, `priority: high`, `server`

**Title:** [BUG] Course registration fails when course code contains special characters

**Description:**

When attempting to register for a course with a course code containing special characters (e.g., "CS-101" or "MATH/201"), the registration fails with a 500 Internal Server Error.

**Steps to Reproduce:**

1. Log in as a student
2. Navigate to the course catalog
3. Attempt to register for a course with code "CS-101"
4. Click "Register"
5. Observe error message

**Expected Behavior:**

The system should successfully register the student for the course, or provide a clear validation error if special characters are not allowed in course codes.

**Actual Behavior:**

The system returns a 500 Internal Server Error with message "Internal Server Error" and the registration fails.

**Environment:**

- OS: Windows 10
- Browser: Chrome 120.0.6099.109
- Node.js Version: 18.17.0
- npm Version: 9.6.7

**Additional Context:**

Error from server logs:
```
Error: Invalid course code format
    at validateCourseCode (controllers/courseController.js:45)
```

**Possible Solution:**

Add input sanitization for course codes in the validation middleware, or update the Course model schema to explicitly define allowed characters in course codes.

---

## Issue #2: Feature Request - Add Course Search Functionality

**Labels:** `enhancement`, `feature`, `client`, `good first issue`

**Title:** [FEATURE] Add search functionality to course catalog

**Description:**

Students should be able to search for courses by course code or course name instead of browsing through all courses.

**Motivation:**

Currently, students must scroll through the entire course catalog to find specific courses. With hundreds of courses available, this becomes time-consuming and frustrating. A search feature would significantly improve the user experience.

**Proposed Solution:**

Add a search bar at the top of the course catalog page that allows students to:
- Search by course code (e.g., "CS101")
- Search by course name (e.g., "Introduction to Computer Science")
- Use case-insensitive matching
- Show real-time results as the user types (debounced)

**User Interface Changes:**
- Add search input field above the course list
- Display "No courses found" message when search returns no results
- Add a "Clear search" button to reset the filter

**API Changes:**
- Update `GET /api/courses/all` endpoint to accept a `search` query parameter
- Implement case-insensitive regex search on both courseCode and courseName fields

**Alternative Solutions:**

1. Add advanced filters (by semester, credit units, instructor)
2. Implement autocomplete suggestions
3. Add recently viewed courses section

**Implementation Considerations:**

**Technical Approach:**
- Frontend: Add search input with debouncing (300ms delay)
- Backend: Use MongoDB regex queries for case-insensitive search
- Consider indexing courseCode and courseName fields for better performance

**Potential Challenges:**
- Performance with large course catalogs (consider pagination)
- Handling special characters in search queries
- Maintaining search state when navigating between pages

**Acceptance Criteria:**

- [ ] Search input is visible on course catalog page
- [ ] Search works for course codes (case-insensitive)
- [ ] Search works for course names (case-insensitive)
- [ ] Results update in real-time with debouncing
- [ ] "No courses found" message displays when appropriate
- [ ] Clear button resets search and shows all courses
- [ ] Search functionality is tested (unit and integration tests)
- [ ] API endpoint documentation is updated

---

## Issue #3: Documentation - Update API Documentation

**Labels:** `documentation`, `good first issue`

**Title:** [DOCS] Create comprehensive API documentation

**Description:**

The project needs comprehensive API documentation that describes all available endpoints, request/response formats, authentication requirements, and error codes.

**Motivation:**

New contributors and frontend developers need clear documentation to understand how to interact with the API. Currently, they must read through the code to understand endpoint behavior.

**Proposed Changes:**

1. Create `docs/API.md` file with:
   - Base URL and environment configuration
   - Authentication flow and token usage
   - All endpoints organized by category (Auth, Courses, Admin)
   - Request/response examples for each endpoint
   - Error codes and their meanings
   - Rate limiting information (if applicable)

2. Add OpenAPI/Swagger specification (optional but recommended)

3. Update README.md to link to API documentation

**Example Structure:**

```markdown
# API Documentation

## Authentication

### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "regNo": "UG15/CS/1001",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "level": "100"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```
```

**Acceptance Criteria:**

- [ ] API.md file created in docs/ directory
- [ ] All endpoints documented with examples
- [ ] Authentication flow explained
- [ ] Error codes documented
- [ ] README.md updated with link to API docs
- [ ] Documentation reviewed by at least one maintainer

---

## Issue #4: Testing - Increase Test Coverage for Course Controller

**Labels:** `testing`, `server`, `good first issue`

**Title:** [TEST] Add missing unit tests for course controller edge cases

**Description:**

The course controller currently has 87% test coverage, but several edge cases are not covered by tests. We need to add tests for these scenarios to improve reliability.

**Missing Test Cases:**

1. **Course Registration:**
   - Registering for a course that no longer exists (deleted after page load)
   - Registering with exactly 36 credit units (boundary test)
   - Registering when already at 36 credit units
   - Concurrent registration attempts for the same course

2. **Course Listing:**
   - Fetching courses with invalid level parameter
   - Fetching courses with empty database
   - Fetching courses with includeLevels containing invalid values

3. **Error Handling:**
   - Database connection failure during registration
   - Invalid ObjectId format in course IDs
   - Malformed request body

**Motivation:**

These edge cases have been identified through code review and could potentially cause issues in production. Adding tests will:
- Prevent regressions
- Document expected behavior
- Improve code reliability

**Implementation Notes:**

- Add tests to `server/__tests__/unit/controllers/courseController.test.js`
- Use Jest mocking for database operations
- Follow existing test patterns in the codebase
- Ensure all tests are independent and can run in any order

**Acceptance Criteria:**

- [ ] All listed edge cases have corresponding tests
- [ ] Tests follow project testing conventions
- [ ] All new tests pass
- [ ] Coverage for courseController increases to at least 95%
- [ ] Tests are documented with clear descriptions

---

## Issue #5: Bug Report - Admin Dashboard Statistics Incorrect

**Labels:** `bug`, `priority: medium`, `server`, `admin`

**Title:** [BUG] Admin dashboard shows incorrect student count

**Description:**

The admin dashboard displays an incorrect count of total students. The count includes admin users, which should be excluded from the student statistics.

**Steps to Reproduce:**

1. Log in as an admin user
2. Navigate to the admin dashboard (`/admin/dashboard`)
3. Observe the "Total Students" statistic
4. Compare with actual student count in database

**Expected Behavior:**

The "Total Students" count should only include users with `role: "student"` and exclude users with `role: "admin"`.

**Actual Behavior:**

The count includes all users regardless of role, inflating the student count by the number of admin users.

**Environment:**

- OS: macOS 13.0
- Browser: Safari 17.0
- Node.js Version: 20.10.0

**Additional Context:**

From `server/controllers/adminController.js`:
```javascript
const totalStudents = await User.countDocuments();
```

This should be:
```javascript
const totalStudents = await User.countDocuments({ role: 'student' });
```

**Possible Solution:**

Update the `getStats` function in `adminController.js` to filter by role when counting students. Also add a test case to verify this behavior.

**Related Issues:**

This might affect other statistics as well. We should audit all admin statistics queries to ensure they're filtering correctly.

---

## Issue #6: Feature Request - Export Course Registration Data

**Labels:** `enhancement`, `feature`, `admin`, `priority: low`

**Title:** [FEATURE] Allow admins to export student registration data as CSV

**Description:**

Admins should be able to export student registration data to CSV format for reporting and analysis purposes.

**Motivation:**

Admins need to generate reports for university administration, analyze registration patterns, and share data with other departments. Currently, they must manually copy data from the UI or query the database directly.

**Proposed Solution:**

Add an "Export to CSV" button on the admin students page that:
- Generates a CSV file with all student registration data
- Includes columns: Student Name, Registration Number, Email, Level, Registered Courses, Total Credits
- Downloads the file with a timestamp in the filename (e.g., `registrations_2024-01-15.csv`)

**Alternative Solutions:**

1. Export to Excel format (.xlsx)
2. Export to PDF with formatted tables
3. Add scheduled email reports
4. Integrate with external reporting tools

**Implementation Considerations:**

**Technical Approach:**
- Install `json2csv` or similar library for CSV generation
- Create new endpoint: `GET /api/admin/export/registrations`
- Set appropriate headers for file download
- Handle large datasets (consider streaming for performance)

**Acceptance Criteria:**

- [ ] Export button added to admin students page
- [ ] CSV file downloads with correct data
- [ ] Filename includes timestamp
- [ ] All student data is included in export
- [ ] Large datasets (1000+ students) export successfully
- [ ] Error handling for export failures
- [ ] Feature is documented in admin guide

---

## Notes on Using These Sample Issues

When creating actual issues in GitHub:

1. **Use the appropriate template** (bug report or feature request)
2. **Add relevant labels** to help with organization and filtering
3. **Assign to appropriate team members** if known
4. **Link related issues** using keywords like "Relates to #123" or "Closes #456"
5. **Update issues** as work progresses with comments and status updates
6. **Close issues** when resolved with a comment explaining the resolution

These sample issues demonstrate:
- Clear, descriptive titles with prefixes ([BUG], [FEATURE], [DOCS], [TEST])
- Detailed descriptions with context
- Specific steps to reproduce (for bugs)
- Clear acceptance criteria (for features)
- Appropriate labels for categorization
- Consideration of implementation details
- Links to related code or issues
