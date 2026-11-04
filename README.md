# 🚀 OnboardingChecklist
> **Smart Employee Onboarding & Workforce Readiness Management Platform**  
> *Project ID: 2102508675 | Student: SURAM MUKTHESWAR REDDY*

---

## 📌 1. Project Introduction
**OnboardingChecklist** is an intelligent, enterprise-grade employee onboarding command center and workforce readiness platform. Built with **React.js, Node.js, Express.js, and MongoDB (MERN)**, it unifies HR operations, IT provisioning, department mentors, and new hires into a single cohesive cockpit.

Rather than relying on basic static checklists or fragmented spreadsheets, OnboardingChecklist implements automated template assignment, dynamic readiness scoring, real-time blocker intelligence, timeline tracking, and strict role-based access controls (RBAC).

---

## 💡 2. Problem Statement
Cross-functional teams often fail to synchronize during employee onboarding:
1. **IT accounts, laptops, and VPN credentials** are delayed due to missing tickets.
2. **HR documentation and legal compliance forms** remain unsigned without clear escalation paths.
3. **Blockers and dependencies** get buried in email threads without clear accountability.
4. **Department managers** lack real-time visibility into an employee's true operational readiness.

---

## 🎯 3. Core Objectives
- **Centralized Command Center**: Track total, active, delayed, and completed onboardings across departments.
- **Automated Checklist Generation**: Automatically instantiate role- and department-specific checklists from templates upon employee profile creation.
- **Composite Readiness Scoring**: Dynamically compute workforce readiness percentages based on completed, in-progress, blocked, and overdue tasks.
- **Blocker Intelligence Center**: Identify impeded tasks, mandate blocker reasons, track duration blocked, and provide automated recommended next actions.
- **Visual Milestones & Timelines**: Chart Day 1, Week 1, Month 1, and 30-day success metrics for every employee.
- **Audit & Activity History**: Track all state transitions, reassignments, and updates with immutable actor attribution.

---

## ✨ 4. Key Differentiating Features
1. **Smart Role-Based Checklist Generator**: Generates 10+ tailored onboarding tasks covering IT Setup, HR Formalities, Team Integration, and Training.
2. **Dynamic Workforce Readiness Score (0-100%)**: Circular gauge and progress metrics reflecting real-time task health.
3. **Blocker Intelligence Center**: Dedicated view highlighting bottlenecks, reason logs, duration in blocked state, and AI-suggested resolutions.
4. **Deadline Risk & Overdue Detection**: Automated detection of overdue milestones past due dates.
5. **Interactive Recharts Analytics**: Visualizations for department completion velocity, role-wise incomplete tasks, blocker distribution, and ramp-up trends.
6. **Exportable CSV Reports**: One-click download of full company-wide onboarding audit logs and task progress.
7. **Premium Enterprise UI/UX**: Dual theme support (Deep Navy Dark Mode & Crisp Clean Light Mode), skeleton loaders, empty states, and debounced global search.

---

## 🛠️ 5. Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite 5
- **Routing**: React Router v6
- **State Management**: React Context API (`AuthContext`, `ThemeContext`, `NotificationContext`)
- **HTTP Client**: Axios with automatic JWT interceptors and 401 redirect handling
- **Visualizations**: Recharts (BarChart, LineChart, PieChart, ResponsiveContainer)
- **Date Utilities**: `date-fns`
- **Design System**: Responsive CSS3 with custom variables, smooth transitions, and high-contrast typography

### Backend
- **Runtime**: Node.js 20 (ES6+)
- **Server**: Express.js 4 (RESTful architecture)
- **Database**: MongoDB with Mongoose 8 ODM
- **In-Memory Fallback**: `mongodb-memory-server` (automatic fallback for zero-config testing if local MongoDB isn't running)
- **Security & Middleware**: `helmet`, `cors`, `express-rate-limit`, `bcryptjs`, `jsonwebtoken`
- **Validation**: `express-validator`

### Testing
- **Backend API & DB Tests**: Jest + Supertest (15 test cases across Auth, Employees, Tasks, Onboarding)
- **Frontend Component Tests**: Vitest + React Testing Library (7 test cases across UI components and hooks)

---

## 🏗️ 6. System Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Client (React 18/Vite)  │
                          │   Port 5173 / Theme Engine│
                          └─────────────┬─────────────┘
                                        │ Axios (JWT Auth)
                                        ▼
                          ┌───────────────────────────┐
                          │  Express.js API Gateway   │
                          │         Port 5000         │
                          ├───────────────────────────┤
                          │ Helmet, CORS, Rate Limit  │
                          │ Auth & Role Middleware    │
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼
         ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
         │ Auth & Users  │      │ Employees &   │      │ Analytics &   │
         │ Controllers   │      │ Task Engine   │      │ Blocker Svc   │
         └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
                 │                      │                      │
                 └──────────────────────┼──────────────────────┘
                                        │ Mongoose ODM
                                        ▼
                          ┌───────────────────────────┐
                          │     MongoDB Database      │
                          │   (Local / Atlas / Mem)   │
                          └───────────────────────────┘
```

---

## 📁 7. Complete Project Structure

```
onboarding-checklist/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Button, Modal, Card, Badge, Table, Skeleton, etc.
│   │   │   ├── layout/           # Sidebar, TopNav
│   │   │   ├── dashboard/        # KPICard, ReadinessGauge, Charts, BlockerAlerts
│   │   │   ├── employees/        # EmployeeCard, EmployeeForm, OnboardingTimeline
│   │   │   ├── tasks/            # TaskTable, TaskCard, TaskStatusUpdater, Comments
│   │   │   └── analytics/        # DepartmentChart, RoleChart, BlockerChart
│   │   ├── context/              # AuthContext, ThemeContext, NotificationContext
│   │   ├── pages/                # Dashboard, Employees, EmployeeDetail, MyTasks, Blockers, etc.
│   │   ├── services/             # Axios API services (auth, employees, tasks, etc.)
│   │   ├── styles/               # globals.css, components.css (Design system & tokens)
│   │   ├── test/                 # Vitest test suites
│   │   ├── App.jsx               # Route tree and layout guards
│   │   └── main.jsx              # React DOM entry
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/database.js    # Resilient Mongoose + in-memory fallback
│   │   ├── models/               # User, Employee, Task, Onboarding, Template, etc.
│   │   ├── controllers/          # Business logic handlers
│   │   ├── routes/               # Express REST routers
│   │   ├── middleware/           # authMiddleware, roleMiddleware, errorMiddleware
│   │   ├── services/             # checklistService, analyticsService, notificationService
│   │   ├── utils/                # apiResponse, jwtUtils, helpers
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # HTTP listener & auto-seeder
│   ├── scripts/
│   │   └── seed.js               # Comprehensive 10-employee, 84-task seed script
│   ├── tests/                    # Jest + Supertest suites
│   ├── .env                      # Active environment configuration
│   └── package.json
├── .gitignore
├── .env.example
├── package.json                  # Root runner scripts (concurrently)
└── README.md
```

---

## 🗄️ 8. Database Design & Schemas

### Models:
1. **User**: Name, unique email, `passwordHash` (bcrypt), `role` (`admin` | `hr_manager` | `dept_manager` | `it_team` | `employee`), department ref, `isActive`.
2. **Department**: Name, description, headCount, timestamps.
3. **Employee**: Unique `employeeId` (`EMP-XXXX`), name, email, `jobTitle`, department ref, `joiningDate`, manager ref, `onboarding` ref, `status` (`active` | `onboarding` | `completed`).
4. **Template**: Name, description, department ref, `jobRole`, `taskDefinitions` array (title, category, priority, dueOffsetDays, assignTo), `estimatedDuration`.
5. **Onboarding**: Employee ref, template ref, `startDate`, `expectedCompletionDate`, `status`, `readinessScore` (0-100), `tasks` refs.
6. **Task**: Title, description, onboarding ref, employee ref, assignedOwner ref, category (`IT` | `HR` | `Training` | `Workplace`), priority (`low` | `medium` | `high` | `critical`), status (`not_started` | `in_progress` | `completed` | `blocked` | `overdue`), `dueDate`, `blockerReason`, `blockedAt`, `blockedBy`, comments array.
7. **Comment**: Task ref, author ref, content, timestamps.
8. **Notification**: Recipient ref, title, message, type, `isRead`, timestamps.
9. **ActivityLog**: Actor ref, action, entityType, entityId, previousValue, newValue, description.

---

## 🔌 9. REST API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new manager/administrator account.
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/me` — Retrieve current authenticated user profile.
- `POST /api/auth/logout` — Invalidate user session.

### Employees
- `GET /api/employees` — List employees with search, department, and status filters.
- `POST /api/employees` — Add an employee and auto-generate role-based onboarding checklist.
- `GET /api/employees/:id` — Retrieve full employee profile with populated onboarding tasks and timeline.
- `PUT /api/employees/:id` — Update employee profile details.
- `DELETE /api/employees/:id` — Soft-delete employee.

### Onboarding & Checklists
- `GET /api/onboarding` — Retrieve all active onboarding pipelines with readiness metrics.
- `POST /api/onboarding` — Manually initialize an onboarding pipeline from a template.
- `GET /api/onboarding/:id` — Get single onboarding pipeline details.
- `PUT /api/onboarding/:id` — Update target completion dates or notes.

### Tasks & Blocker Intelligence
- `GET /api/tasks` — Filter tasks by status (`blocked`, `overdue`, etc.), priority, employee, or department.
- `POST /api/tasks` — Assign a custom milestone task to an employee.
- `GET /api/tasks/:id` — Get task detail with comments and blocker history.
- `PATCH /api/tasks/:id/status` — Update status (`not_started` → `in_progress` → `completed`).
- `PATCH /api/tasks/:id/block` — Flag task as blocked (mandates `blockerReason`).
- `PATCH /api/tasks/:id/unblock` — Clear blocker and restore previous status.
- `PATCH /api/tasks/:id/assign` — Reassign task owner.
- `POST /api/tasks/:id/comments` — Post comment on a task.

### Analytics & Reports
- `GET /api/analytics/overview` — Executive summary KPI metrics.
- `GET /api/analytics/departments` — Completion velocity and headcounts per department.
- `GET /api/analytics/roles` — Incomplete task distribution across job roles.
- `GET /api/analytics/blockers` — Frequency analysis of root-cause blocker reasons.
- `GET /api/reports/onboarding-csv` — Stream downloadable CSV report.

---

## ⚡ 10. Quick Start & Installation

### Step 1: Clone & Install Dependencies
```bash
# Install root, backend, and frontend packages with a single command
npm run install:all
```

### Step 2: Database Setup & Seeding
The backend is equipped with automatic MongoDB detection. If a local or remote MongoDB instance is running, it connects via `MONGODB_URI`. If not, an embedded In-Memory MongoDB automatically initializes.

To manually seed 10 realistic employees, 5 departments, multiple templates, and 84 onboarding tasks:
```bash
cd server
npm run seed
```

### Step 3: Run the Application
Run both backend API (port 5000) and frontend client (port 5173) simultaneously:
```bash
# From repository root:
npm run dev
```

Visit the app in your browser at:  
👉 **http://localhost:5173**

---

## 🔑 11. Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@onboardingchecklist.com` | `Admin@123` |
| **HR Manager** | `sarah.jenkins@onboardingchecklist.com` | `Admin@123` |
| **IT Support Lead** | `marcus.vance@onboardingchecklist.com` | `Admin@123` |
| **Dept Manager (Engineering)** | `david.kim@onboardingchecklist.com` | `Admin@123` |
| **New Employee** | `alex.wright@onboardingchecklist.com` | `Admin@123` |

*(Quick demo buttons are also embedded directly on the Login screen for one-click access.)*

---

## 🧪 12. Automated Test Results

### Run All Tests:
```bash
npm run test
```

### Individual Test Suites:
```bash
# Backend (Jest + Supertest)
cd server && npm test
# Output:
# PASS tests/task.test.js
# PASS tests/onboarding.test.js
# PASS tests/employee.test.js
# PASS tests/auth.test.js
# Test Suites: 4 passed, 4 total | Tests: 15 passed, 15 total

# Frontend (Vitest + RTL)
cd client && npm test -- --run
# Output:
# PASS src/test/components/KPICard.test.jsx
# PASS src/test/hooks/useDebounce.test.js
# PASS src/test/components/Button.test.jsx
# Test Suites: 3 passed, 3 total | Tests: 7 passed, 7 total
```

---

## 🛡️ 13. Security & Validation Practices
- **Password Protection**: Passwords salted and hashed with `bcryptjs`.
- **JWT Authorization**: Cryptographically signed tokens verified via `authMiddleware`.
- **Backend Role Enforcement**: `roleMiddleware` restricts administrative endpoints.
- **Input Sanitization**: `express-validator` schema enforcement prevents malformed payloads and MongoDB injection.
- **HTTP Security**: `helmet` headers, strict CORS policy, and IP-based rate limiting.

---

## 🚀 14. Production Build & Deployment
```bash
# Build React bundle with Vite
npm run build

# The output is generated inside client/dist/ ready for Nginx or Firebase/Vercel hosting.
# The server is production-ready for deployment on Node.js/Docker with PM2.
```

---

## 👤 Author
- **Student Name**: SURAM MUKTHESWAR REDDY
- **Project ID**: 2102508675
- **Coursework / Submission**: Full-Stack SaaS Web Application (MERN)

