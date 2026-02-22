# Test Credentials

This document contains test user credentials for the University Course Registration System. These accounts are created when you run the database seeding scripts.

---

## Default Password

**All test accounts use the same password:**

```
Password123!
```

---

## Student Accounts

All student accounts are at Level 400 with pre-registered courses.

### Team Member Accounts

| Name | Email | Registration Number | Level | Role |
|------|-------|-------------------|-------|------|
| Suleiman Abdulkadir | suleiman.abdulkadir@student.edu | UG15/CS/1001 | 400 | Student |
| Usman Dayyabu Usman | usman.dayyabu@student.edu | UG15/CS/1002 | 400 | Student |
| Abdulhalim Muhammad Yaro | abdulhalim.yaro@student.edu | UG15/CS/1003 | 400 | Student |
| Suhaibu Salihu Musa | suhaibu.musa@student.edu | UG15/CS/1004 | 400 | Student |
| Maryam Muhammad Bello | maryam.bello@student.edu | UG15/CS/1005 | 400 | Student |
| Usman Muhammad Onimisi | usman.onimisi@student.edu | UG15/CS/1006 | 400 | Student |
| Samaila Aliyu | samaila.aliyu@student.edu | UG15/CS/1007 | 400 | Student |
| Achimugu Amina | achimugu.amina@student.edu | UG15/CS/1008 | 400 | Student |
| Usman Alamin Umar | usman.umar@student.edu | UG15/CS/1009 | 400 | Student |
| Tahir Musa Tahir | tahir.musa@student.edu | UG15/CS/1010 | 400 | Student |

---

## Admin Accounts

| Name | Email | Registration Number | Role |
|------|-------|-------------------|------|
| Admin User | admin@university.edu | UG15/CS/ADMIN01 | Admin |
| Dr. Kabir Sani | kabir.sani@university.edu | UG15/CS/ADMIN02 | Admin |

---

## Quick Login Examples

### Student Login
```json
{
  "email": "suleiman.abdulkadir@student.edu",
  "password": "Password123!"
}
```

### Admin Login
```json
{
  "email": "admin@university.edu",
  "password": "Password123!"
}
```

---

## Creating Test Users

To create these test users in your local database:

```bash
# Navigate to server directory
cd server

# Seed courses first (required)
npm run seed

# Seed test users
npm run seed:users
```

**Output:**
```
Connected to MongoDB
Cleared existing users
Created users:
=================================================================================
Password for all users: Password123!
=================================================================================

STUDENTS:
  Suleiman Abdulkadir
    Email: suleiman.abdulkadir@student.edu
    RegNo: UG15/CS/1001
    Level: 400
    Registered Courses: 10

  [... other students ...]

ADMINS:
  Admin User
    Email: admin@university.edu
    RegNo: UG15/CS/ADMIN01

  Dr. Kabir Sani
    Email: kabir.sani@university.edu
    RegNo: UG15/CS/ADMIN02

=================================================================================
Total users created: 12
  - Students: 10
  - Admins: 2
```

---

## Testing Different Scenarios

### Test Student Registration Flow

1. **Login as Student:**
   - Email: `suleiman.abdulkadir@student.edu`
   - Password: `Password123!`

2. **Browse Courses:**
   - Navigate to course catalog
   - Filter by level (100, 200, 300, 400, 500)
   - View course details

3. **Register for Courses:**
   - Select courses (max 36 credit units)
   - Submit registration
   - View registered courses

### Test Admin Features

1. **Login as Admin:**
   - Email: `admin@university.edu`
   - Password: `Password123!`

2. **View Dashboard:**
   - See total students count
   - View total courses
   - Check registration statistics

3. **Manage Courses:**
   - Add new courses
   - Edit existing courses
   - View all registered students

4. **Export Data:**
   - Export student registration data
   - Download reports

---

## Related Documentation

- [README.md](README.md) - Project overview and setup
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [server/README.md](server/README.md) - Server-specific documentation
- [server/scripts/seedUsers.js](server/scripts/seedUsers.js) - User seeding script
