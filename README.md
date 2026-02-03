# HR Portal - Human Resources Management System

A modern, full-featured HR Management Portal built with React, Redux, and Tailwind CSS. This application provides comprehensive employee management, leave request handling, and onboarding capabilities with real-time notifications and advanced filtering.

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Default Login Credentials](#-default-login-credentials)
- [API Endpoints](#-api-endpoints)
- [Key Features Documentation](#-key-features-documentation)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Features

- **Authentication System**
  - Secure login and registration
  - JWT-based authentication
  - Protected routes with role-based access control
  - Session management with automatic timeout

- **Employee Management**
  - View all employees with detailed profiles
  - Search and filter employees by multiple criteria
  - Sort by name, department, role, and more
  - Batch employee actions
  - Employee detail modal with full information

- **Leave Management**
  - Submit leave requests with multiple leave types
  - View leave history and request status
  - Approve/reject leave requests (HR only)
  - Leave balance tracking
  - Leave analytics and reporting

- **Employee Onboarding**
  - Guided onboarding process for new employees
  - Multi-step onboarding forms
  - Document upload capabilities
  - Onboarding status tracking
  - Completion checklist

- **Advanced Filtering & Search**
  - Real-time search across all employee data
  - Multi-criteria filtering (department, status, role, etc.)
  - Filter persistence and history
  - Quick filter presets
  - Export filtered results

- **Notifications System**
  - Real-time in-app notifications
  - Toast notifications for user actions
  - Notification history
  - Multiple notification types (success, error, warning, info)
  - Auto-dismiss with configurable duration

- **Form Validation**
  - Client-side validation for all forms
  - Real-time error messages
  - Custom validation rules
  - Password strength checker
  - Email format validation
  - Phone number format validation

- **UI/UX Features**
  - Responsive design (mobile, tablet, desktop)
  - Dark/Light theme support
  - Accessibility features
  - Loading states and skeletons
  - Error boundaries
  - Smooth animations and transitions

---

## 🛠 Technology Stack

### Frontend
- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.13.0** - Client-side routing
- **Redux Toolkit 2.11.2** - State management
- **React Redux 9.2.0** - React bindings for Redux

### Styling & UI
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **PostCSS 8.5.6** - CSS transformations
- **Autoprefixer 10.4.24** - Vendor prefixes

### Forms & Validation
- **React Hook Form 7.71.1** - Efficient form management
- **Custom validation schemas** - Reusable validation rules

### API & Data
- **Axios 1.13.4** - HTTP client
- **JSON Server 1.0.0-beta.5** - Mock REST API

### Development Tools
- **ESLint 9.39.1** - Code linting
- **Concurrently 8.2.2** - Run multiple scripts
- **npm** - Package manager

### Environment Management
- Environment variables via `.env` files
- Vite environment configuration
- Development, staging, and production configs

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **npm** (comes with Node.js)
  - Verify: `npm --version`

- **Git** (optional, for cloning)
  - Download from [git-scm.com](https://git-scm.com/)

---

## 🚀 Installation

### Step 1: Clone or Download the Project

```bash
# Clone the repository (if using git)
git clone <repository-url>
cd project2-hr-portal

# Or navigate to project directory
cd c:\projects\simplilearn\FSD\foundations\ of\ front-end\ development\project2-hr-portal
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- React and React DOM
- Redux and Redux Toolkit
- React Router
- Axios for API calls
- Tailwind CSS
- Development dependencies (Vite, ESLint, etc.)

### Step 3: Create Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env
```

### Step 4: Verify Installation

```bash
# Check if all packages are installed correctly
npm list

# Run linting to check for any issues
npm run lint
```

---

## ⚡ Getting Started

### Quick Start (Recommended)

The easiest way to start developing is to run both the Vite dev server and JSON Server together:

```bash
npm run dev:full
```

This will:
1. Start Vite dev server on **http://localhost:5173**
2. Start JSON Server API on **http://localhost:3001**
3. Display both outputs in your terminal

Then open your browser and navigate to:
```
http://localhost:5173
```

### Alternative: Run Servers Separately

If you prefer to run servers in separate terminals:

```bash
# Terminal 1: Start Vite dev server
npm run dev
```

```bash
# Terminal 2: Start JSON Server API
npm run server
```

### First Login

After starting the application:

1. Open http://localhost:5173
2. You'll be redirected to the login page
3. Use the default credentials (see [Default Login Credentials](#-default-login-credentials))
4. Select your role and access the appropriate dashboard

---

## 📝 Available Scripts

All npm scripts are configured in `package.json`:

### Development

| Command | Description | Output |
|---------|-------------|--------|
| `npm run dev` | Start Vite development server | http://localhost:5173 |
| `npm run server` | Start JSON Server for API | http://localhost:3001 |
| `npm run dev:full` | **Start both servers together** | Both servers in one terminal |

### Production

| Command | Description | Output |
|---------|-------------|--------|
| `npm run build` | Build for production | `dist/` folder |
| `npm run preview` | Preview production build | http://localhost:4173 |

### Code Quality

| Command | Description | Output |
|---------|-------------|--------|
| `npm run lint` | Run ESLint to check code | Terminal output |
| `npm run lint -- --fix` | Auto-fix linting issues | Auto-corrected files |

### Common Workflows

```bash
# Development workflow
npm run dev:full

# Before committing code
npm run lint
npm run build

# Testing production build
npm run build
npm run preview
```

---

## 📁 Project Structure

```
project2-hr-portal/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Alert.jsx       # Alert/notification component
│   │   ├── Badge.jsx       # Badge component for status
│   │   ├── Button.jsx      # Reusable button component
│   │   ├── Card.jsx        # Card container component
│   │   ├── DataTable.jsx   # Reusable data table
│   │   ├── FilterPanel.jsx # Advanced search & filter UI
│   │   ├── FormField.jsx   # Form field wrapper with validation
│   │   ├── Input.jsx       # Input field component
│   │   ├── Layout.jsx      # Main layout wrapper
│   │   ├── LeaveRequestForm.jsx    # Leave request form
│   │   ├── Login.jsx       # Login page
│   │   ├── Modal.jsx       # Modal dialog component
│   │   ├── Navbar.jsx      # Top navigation bar
│   │   ├── NotificationContainer.jsx  # Toast notifications
│   │   ├── NotificationItem.jsx       # Individual notification
│   │   ├── ProtectedRoute.jsx         # Route protection
│   │   ├── Register.jsx    # Registration page
│   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   └── Spinner.jsx     # Loading spinner
│   │
│   ├── pages/              # Page components (routes)
│   │   ├── Dashboard.jsx              # Admin dashboard
│   │   ├── EmployeeDashboard.jsx      # Employee dashboard
│   │   ├── EmployeeManagement.jsx     # Employee list & management
│   │   ├── EmployeeOnboardingPortal.jsx  # Onboarding page
│   │   ├── EmployeeProfile.jsx        # Employee profile page
│   │   ├── LeaveHistoryPage.jsx       # Leave history
│   │   ├── LeaveRequestsPage.jsx      # Leave requests list
│   │   └── OnboardingDashboard.jsx    # Onboarding status
│   │
│   ├── store/              # Redux state management
│   │   ├── authSlice.js         # Authentication state
│   │   ├── employeeSlice.js     # Employee data state
│   │   ├── leaveSlice.js        # Leave management state
│   │   ├── notificationSlice.js # Notification state
│   │   ├── onboardingSlice.js   # Onboarding state
│   │   ├── hooks.js             # Redux hooks (useAppDispatch, etc.)
│   │   ├── useNotification.js   # Custom notification hook
│   │   └── index.js             # Store configuration
│   │
│   ├── services/           # API services
│   │   └── api.js          # Axios instance & API calls
│   │
│   ├── utils/              # Utility functions
│   │   ├── filterUtils.js       # Search & filter functions
│   │   ├── helpers.js           # Helper functions
│   │   └── validationSchemas.js # Form validation rules
│   │
│   ├── assets/             # Images, fonts, etc.
│   ├── App.jsx             # Main app component
│   ├── App.css             # App styles
│   ├── index.css           # Global styles
│   └── main.jsx            # React entry point
│
├── public/                 # Static files (favicon, etc.)
├── db.json                 # JSON Server database
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.js        # ESLint configuration
├── .env                    # Environment variables (local, git-ignored)
├── .env.example            # Environment template (committed)
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies & scripts
├── package-lock.json       # Locked dependency versions
└── README.md               # This file
```

### Key Directories Explained

**`src/components/`** - Reusable UI components
- Each component is self-contained and reusable
- Examples: Button, Input, Card, Modal

**`src/pages/`** - Full page components that map to routes
- Each page is a complete screen in the application
- Examples: Dashboard, EmployeeManagement, LeaveRequests

**`src/store/`** - Redux state management
- `authSlice.js` - Manages user authentication state
- `employeeSlice.js` - Manages employee data
- `notificationSlice.js` - Manages toast notifications
- Other slices for specific features

**`src/utils/`** - Reusable utility functions
- `validationSchemas.js` - Form validation rules (50+ validators)
- `filterUtils.js` - Search and filter functions (20+ utilities)
- `helpers.js` - General helper functions

**`src/services/`** - API communication
- `api.js` - Axios instance with environment configuration
- Centralized API calls for the entire application

---

## 🔐 Default Login Credentials

Use these credentials to test the application:

### Admin Account
```
Email:    admin@example.com
Password: Admin@123
Role:     HR Admin
```

Permissions:
- ✅ View all employees
- ✅ Manage employees
- ✅ Approve/reject leave requests
- ✅ View all leave history
- ✅ Manage onboarding
- ✅ View reports and analytics

### Employee Account
```
Email:    employee1@example.com
Password: Employee@123
Role:     Employee
```

Permissions:
- ✅ View own profile
- ✅ Submit leave requests
- ✅ View own leave history
- ✅ View company directory
- ✅ Complete onboarding tasks
- ❌ Cannot approve requests
- ❌ Cannot manage other employees

### Manager Account
```
Email:    manager@example.com
Password: Manager@123
Role:     Department Manager
```

Permissions:
- ✅ View team members
- ✅ View leave requests (team)
- ✅ Approve/reject team leave requests
- ✅ View team analytics
- ❌ Cannot manage all employees
- ❌ Cannot approve company-wide requests

### Additional Test Accounts

More test accounts are available in `db.json`:
- `employee2@example.com` - Employee@123
- `employee3@example.com` - Employee@123
- And more...

---

## 🌐 API Endpoints

The application uses a JSON Server mock API running on **http://localhost:3001**

### Base URL
```
http://localhost:3001
```

### Authentication
```
POST   /auth/login        - User login
POST   /auth/register     - User registration
POST   /auth/logout       - User logout
GET    /auth/me           - Get current user
```

### Employees
```
GET    /employees         - Get all employees
GET    /employees/:id     - Get employee details
POST   /employees         - Create new employee
PUT    /employees/:id     - Update employee
DELETE /employees/:id     - Delete employee
```

### Leave Requests
```
GET    /leaves            - Get all leave requests
GET    /leaves/:id        - Get leave details
POST   /leaves            - Submit leave request
PUT    /leaves/:id        - Update leave request
DELETE /leaves/:id        - Delete leave request
```

### Onboarding
```
GET    /onboarding        - Get all onboarding records
GET    /onboarding/:id    - Get onboarding details
POST   /onboarding        - Create onboarding record
PUT    /onboarding/:id    - Update onboarding record
```

**Note:** The API base URL can be configured via the `.env` file:
```
VITE_API_BASE_URL=http://localhost:3001
```

For complete API documentation, see [ENV_VARIABLES.md](ENV_VARIABLES.md)

---

## 📚 Key Features Documentation

### Form Validation

The application includes comprehensive form validation with 50+ validation rules:

**Location:** `src/utils/validationSchemas.js`

Features:
- Email format validation
- Password strength checking (uppercase, lowercase, numbers, special chars)
- Phone number formatting
- Date range validation
- Custom async validators
- Real-time error messages

**See:** [VALIDATION_GUIDE.md](VALIDATION_GUIDE.md) for complete validation reference

### Search & Filter

Advanced search and filtering across all employee data:

**Location:** `src/components/FilterPanel.jsx` and `src/utils/filterUtils.js`

Features:
- Real-time search (20+ searchable fields)
- Multi-criteria filtering
- Filter persistence
- Saved filter presets
- Export filtered results

**See:** [SEARCH_FILTER_GUIDE.md](SEARCH_FILTER_GUIDE.md) for filter examples

### Notifications

Real-time in-app notifications and toast messages:

**Location:** `src/store/notificationSlice.js` and `src/components/NotificationContainer.jsx`

Features:
- Success, error, warning, info notifications
- Auto-dismiss functionality
- Custom duration
- Position control
- Notification history

**See:** [NOTIFICATION_SYSTEM.md](NOTIFICATION_SYSTEM.md) for usage examples

### Theme & Styling

Tailwind CSS-based responsive design:

**Location:** `tailwind.config.js` and `src/index.css`

Features:
- Dark mode support
- Responsive breakpoints
- Custom color palette
- Smooth transitions

**See:** [THEME.md](THEME.md) for color palette and theming options

---

## 🆘 Troubleshooting

### Common Issues & Solutions

#### Port Already in Use

**Problem:** `Error: EADDRINUSE :::5173` or `:::3001`

**Solution:**

```bash
# Kill process on macOS/Linux
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use a different port
PORT=5174 npm run dev
```

#### Module Not Found Errors

**Problem:** `Cannot find module 'react-router-dom'` or similar

**Solution:**
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Vite Dev Server Not Starting

**Problem:** `Error: [ERR_MODULE_NOT_FOUND]`

**Solution:**
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Start again: `npm run dev`

#### JSON Server Not Running

**Problem:** API calls return 404 or connection refused

**Solution:**
```bash
# Make sure JSON Server is running
npm run server

# Or run both servers
npm run dev:full

# Check if port 3001 is accessible
curl http://localhost:3001
```

#### API Connection Issues

**Problem:** `ERR_CONNECTION_REFUSED` or `Network Error`

**Solution:**
1. Check if JSON Server is running: `npm run server`
2. Verify API URL in `.env`: `VITE_API_BASE_URL=http://localhost:3001`
3. Check network tab in browser DevTools
4. Restart both servers: `npm run dev:full`

#### Login Not Working

**Problem:** Always redirected to login page

**Solution:**
1. Check browser console for errors (F12)
2. Verify credentials are correct
3. Check if API is running: `npm run server`
4. Clear browser localStorage: 
   - Open DevTools (F12)
   - Go to Application tab
   - Delete localStorage entries
5. Reload page

#### CSS Not Loading (Tailwind)

**Problem:** Styles not applied, page looks unstyled

**Solution:**
```bash
# Rebuild Tailwind CSS
npm run build

# Or restart dev server
npm run dev:full
```

#### ESLint Errors

**Problem:** `npm run lint` shows many errors

**Solution:**
```bash
# Auto-fix common issues
npm run lint -- --fix

# Then run again
npm run lint
```

---

## 🚀 Future Enhancements

### Planned Features

#### Authentication & Security
- [ ] Two-factor authentication (2FA)
- [ ] Social login integration (Google, Microsoft)
- [ ] Biometric authentication
- [ ] Session management improvements
- [ ] Rate limiting and DDoS protection

#### Employee Management
- [ ] Employee directory with org chart
- [ ] Skills and certifications management
- [ ] Performance reviews module
- [ ] Employee analytics dashboard
- [ ] Batch import/export employees (CSV)

#### Leave Management
- [ ] Leave calendar integration
- [ ] Auto-approval rules engine
- [ ] Leave forecast and analytics
- [ ] Carryover and encashment policies
- [ ] Integration with calendar apps

#### Payroll & Finance
- [ ] Salary management module
- [ ] Expense tracking
- [ ] Reimbursement workflow
- [ ] Payslip generation and distribution
- [ ] Tax documentation

#### Communication
- [ ] In-app messaging system
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Announcement board
- [ ] Team collaboration features

#### Reporting & Analytics
- [ ] Advanced dashboards
- [ ] Custom report builder
- [ ] Data visualization
- [ ] Export to PDF/Excel
- [ ] Scheduled report distribution

#### Integration
- [ ] LDAP/Active Directory integration
- [ ] Slack integration
- [ ] Microsoft Teams integration
- [ ] Salesforce integration
- [ ] Jira integration

#### Mobile
- [ ] Native mobile app (React Native)
- [ ] Progressive Web App (PWA)
- [ ] Mobile-optimized UI
- [ ] Offline capabilities

#### DevOps & Infrastructure
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Database migration to PostgreSQL
- [ ] Kubernetes deployment
- [ ] Monitoring and logging (ELK stack)

### Performance Improvements
- [ ] Code splitting and lazy loading
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Virtual scrolling for large lists
- [ ] Service workers

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Screen reader support
- [ ] Keyboard navigation improvements
- [ ] High contrast mode
- [ ] Accessibility testing automation

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. **Fork the repository**
   ```bash
   git clone <your-fork-url>
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the project structure
   - Add comments for complex logic
   - Test your changes

4. **Run tests and linting**
   ```bash
   npm run lint
   npm run build
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "Add: description of your changes"
   ```

6. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Coding Standards

- Use ES6+ syntax
- Follow Airbnb JavaScript style guide
- Write components as functional components
- Use React Hooks for state management
- Add PropTypes or TypeScript types
- Write meaningful comments
- Keep components small and focused

---

## 📄 License

This project is created for educational purposes as part of Simplilearn's Foundations of Front-End Development course.

---

## 📞 Support

For issues and questions:

1. Check [Troubleshooting](#-troubleshooting) section
2. Review documentation files:
   - [ENV_SETUP.md](ENV_SETUP.md) - Environment setup guide
   - [NPM_SCRIPTS.md](NPM_SCRIPTS.md) - Scripts documentation
   - [VALIDATION_GUIDE.md](VALIDATION_GUIDE.md) - Form validation
   - [SEARCH_FILTER_GUIDE.md](SEARCH_FILTER_GUIDE.md) - Search & filter
   - [NOTIFICATION_SYSTEM.md](NOTIFICATION_SYSTEM.md) - Notifications

3. Check application logs in browser console (F12)

4. Review error messages for specific guidance

---

## 🎯 Quick Reference

### Start Development
```bash
npm run dev:full
```
Opens http://localhost:5173

### Build for Production
```bash
npm run build
npm run preview
```

### Check Code Quality
```bash
npm run lint
npm run lint -- --fix
```

### Login Credentials
- Email: `admin@example.com`
- Password: `Admin@123`

### API Base URL
- http://localhost:3001

### Ports
- Vite Dev: **5173**
- JSON Server: **3001**
- Vite Preview: **4173**

---

## ✅ Project Checklist

- ✅ React setup with Vite
- ✅ Redux state management
- ✅ React Router navigation
- ✅ Form validation system (50+ rules)
- ✅ Search & filter functionality
- ✅ Notification system
- ✅ Authentication with login/register
- ✅ Employee management module
- ✅ Leave management module
- ✅ Onboarding portal
- ✅ Responsive design
- ✅ Environment configuration
- ✅ ESLint code quality
- ✅ NPM scripts for development

---

**Happy coding! 🎉**

Last Updated: February 2, 2026
Version: 0.0.0
