# Client - University Course Registration System

Frontend application for the University Course Registration System built with React, Vite, and Tailwind CSS.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Testing**: Vitest with React Testing Library
- **Code Quality**: ESLint

## Project Structure

```
client/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── AddCourseForm.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── CoursesTable.jsx
│   │   ├── EditCourseModal.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── FieldInput.jsx
│   │   ├── PrimaryButton.jsx
│   │   └── ...
│   ├── pages/           # Route-level page components
│   │   ├── AdminCourses.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── Profile.jsx
│   │   ├── RegisteredCourses.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── StudentDashboard.jsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useAdminCoursesList.js
│   │   ├── useAdminStats.js
│   │   ├── useAuthSession.js
│   │   ├── useCourseCatalog.js
│   │   ├── useRegistration.js
│   │   └── ...
│   ├── layouts/         # Layout wrapper components
│   │   └── AdminLayout.jsx
│   ├── lib/             # Utilities
│   │   └── api.js       # Axios instance with interceptors
│   ├── constants/       # Static data and configuration
│   │   ├── adminNavItems.js
│   │   ├── catalog.js
│   │   ├── icons.jsx
│   │   ├── levels.js
│   │   └── storageKeys.js
│   ├── __tests__/       # Test files
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── integration/
│   │   ├── pages/
│   │   └── property/
│   ├── App.jsx          # Root component with routing
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/              # Static assets
│   ├── favicon.svg
│   └── favicon.ico
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── vitest.config.js     # Vitest configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Running backend server (see server/README.md)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the client directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Running the Application

**Development mode** (with hot-reload):
```bash
npm run dev
```

The application will start on `http://localhost:5173`

**Production build**:
```bash
npm run build
```

**Preview production build**:
```bash
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests with Vitest |
| `npm run test:coverage` | Run tests with coverage |

## Features

### Student Features

#### Authentication
- Sign up with registration number, email, and password
- Sign in with email and password
- Secure JWT-based authentication

#### Course Registration
- Browse courses filtered by level (100-500)
- View course details (code, name, semester, credit units, prerequisites, capacity)
- Register for courses with validation:
  - Maximum 36 credit units
  - Prerequisite checking
  - Capacity enforcement
- View registered courses organized by semester
- Update registration (add/remove courses)

#### Profile Management
- View profile information
- Update name and email
- Change password

### Admin Features

#### Dashboard
- View system statistics (total students, courses)
- Monitor student registrations

#### Course Management
- Create new courses
- Edit existing courses
- Archive courses (soft delete)
- Restore archived courses
- View archived courses separately
- Set course capacity and prerequisites

#### User Management
- View all students
- View student registration details
- Export student registration slips

#### System Configuration
- Manage registration periods
- Control when students can register

## Routing

| Route | Component | Access |
|-------|-----------|--------|
| `/` | SignIn | Public |
| `/signup` | SignUp | Public |
| `/dashboard` | StudentDashboard | Student |
| `/registered` | RegisteredCourses | Student |
| `/profile` | Profile | Authenticated |
| `/admin` | AdminDashboard | Admin |
| `/admin/users` | AdminUsers | Admin |
| `/admin/courses` | AdminCourses | Admin |

## State Management

The application uses React hooks for state management:

- **useAuthSession**: Manages authentication state in sessionStorage
- **useRegistration**: Handles course registration data
- **useCourseCatalog**: Fetches and filters course catalog
- **useAdminCoursesList**: Manages admin course list
- **useAdminStats**: Fetches admin dashboard statistics

## API Integration

The application uses Axios with interceptors for API communication:

```javascript
// Automatic JWT token injection
axios.interceptors.request.use((config) => {
  const token = getTokenFromSession();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Styling

### Tailwind CSS

The application uses Tailwind CSS for styling with a custom configuration:

- Custom color palette (accent, ink, slate)
- Custom fonts (Inter for body, Outfit for display)
- Responsive design utilities
- Custom shadows and animations

### Design System

- **Colors**: Consistent color scheme across the app
- **Typography**: Clear hierarchy with custom fonts
- **Spacing**: Consistent padding and margins
- **Components**: Reusable styled components
- **Layouts**: Responsive grid and flexbox layouts

## Testing

**Run all tests**:
```bash
npm test
```

**Run tests with coverage**:
```bash
npm run test:coverage
```

**Run tests in watch mode**:
```bash
npm test -- --watch
```

### Test Structure

- **Component tests**: Test individual components
- **Hook tests**: Test custom hooks
- **Integration tests**: Test user workflows
- **Property tests**: Property-based testing with fast-check

## Code Quality

**Run ESLint**:
```bash
npm run lint
```

**Auto-fix ESLint issues**:
```bash
npm run lint -- --fix
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | http://localhost:5000/api |

## Key Components

### Authentication Components
- **SignIn**: User login form
- **SignUp**: User registration form
- **FieldInput**: Reusable input field with icon

### Student Components
- **StudentDashboard**: Main course registration interface
- **RegisteredCourses**: View registered courses
- **SemesterCourseTable**: Course selection by semester
- **LevelSelectorPanel**: Filter courses by level

### Admin Components
- **AdminDashboard**: Statistics and overview
- **AdminCourses**: Course management interface
- **AdminUsers**: Student management
- **AdminSidebar**: Navigation sidebar
- **AddCourseForm**: Create new courses
- **EditCourseModal**: Edit existing courses
- **CoursesTable**: Display courses with actions

### Shared Components
- **Profile**: User profile management
- **PrimaryButton**: Styled button with loading state
- **ErrorBoundary**: Error handling wrapper
- **TableShell**: Reusable table layout

## Custom Hooks

### useAuthSession
Manages authentication state and session storage.

```javascript
const { user, token, setAuth, clearAuth, updateUser } = useAuthSession();
```

### useCourseCatalog
Fetches and filters course catalog.

```javascript
const { courses, loading, status, selectedLevel, setSelectedLevel } = useCourseCatalog();
```

### useRegistration
Manages course registration state.

```javascript
const { courses, totalUnits, loading, refresh } = useRegistration();
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting with React.lazy
- Memoization with useMemo and useCallback
- Optimized re-renders
- Lazy loading of routes
- Vite's fast HMR (Hot Module Replacement)

## Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader friendly

## Development Tips

1. Use React DevTools for debugging
2. Check Network tab for API calls
3. Use Vite's HMR for fast development
4. Follow component composition patterns
5. Keep components small and focused
6. Use custom hooks for reusable logic

## Troubleshooting

**API connection error**:
- Ensure backend server is running
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS is enabled on backend

**Authentication issues**:
- Clear sessionStorage
- Check JWT token expiration
- Verify credentials

**Build errors**:
- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all imports are correct

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Write tests for new features
4. Maintain consistent styling
5. Use meaningful component names
6. Document complex logic

## License

See LICENSE.md in the root directory.
