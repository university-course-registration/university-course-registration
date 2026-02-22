import { BookIcon, ChartIcon, UsersIcon } from './icons.jsx'

const adminNavItems = [
  {
    label: 'Overview',
    path: '/admin',
    icon: ChartIcon,
  },
  {
    label: 'User management',
    path: '/admin/users',
    icon: UsersIcon,
  },
  {
    label: 'Courses',
    path: '/admin/courses',
    icon: BookIcon,
  },
]

export default adminNavItems
