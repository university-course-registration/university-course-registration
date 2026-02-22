# Test Credentials

Test user credentials for the University Course Registration System.

---

## Default Password

**All test accounts use the same password:** `Password123!`

---

## Student Accounts (Level 400)

| Name | Email | Registration Number |
|------|-------|-------------------|
| Suleiman Abdulkadir | suleiman.abdulkadir@student.edu | CST/20/SWE/00482 |
| Usman Dayyabu Usman | usman.dayyabu@student.edu | CST/21/SWE/00652 |
| Abdulhalim Muhammad Yaro | abdulhalim.yaro@student.edu | CST/21/SWE/00663 |
| Suhaibu Salihu Musa | suhaibu.musa@student.edu | CST/20/SWE/00503 |
| Maryam Muhammad Bello | maryam.bello@student.edu | CST/20/SWE/00502 |
| Usman Muhammad Onimisi | usman.onimisi@student.edu | CST/20/SWE/00513 |
| Samaila Aliyu | samaila.aliyu@student.edu | CST/22/SWE/00922 |
| Achimugu Amina | achimugu.amina@student.edu | CST/20/SWE/00483 |
| Usman Alamin Umar | usman.umar@student.edu | CST/20/SWE/00512 |
| Tahir Musa Tahir | tahir.musa@student.edu | CST/21/SWE/00683 |

---

## Admin Accounts

| Name | Email | Registration Number |
|------|-------|-------------------|
| Admin User | admin@university.edu | ADMIN/001 |
| Dr. Kabir Sani | kabir.sani@university.edu | ADMIN/002 |

---

## Usage

**Seed the database:**
```bash
cd server
npm run seed    # Seeds both courses and users
```

**Login Example:**
```json
{
  "email": "suleiman.abdulkadir@student.edu",
  "password": "Password123!"
}
```
