# Litigation Tracking System — Client (LTS-Client)

A multi-tenant SaaS dashboard built for Pakistani law firms and legal departments. The frontend is a fully integrated React application that connects to the LTS-API backend, providing complete case management, hearing tracking, document storage, and more.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [How a Feature Works](#how-a-feature-works)
- [State Management](#state-management)
- [Routing](#routing)
- [API Integration](#api-integration)
- [Forms & Validation](#forms--validation)
- [Contributing](#contributing)

---

## Overview

LTS-Client is the authenticated dashboard for LTS. It is a separate application from the public landing page and communicates entirely with the LTS-API backend via REST API calls using JWT authentication.

```
www.lts.com        → Landing Page (Next.js — separate repo)
app.lts.com        → This repo (React dashboard)
api.lts.com        → LTS-API (ASP.NET 10)
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Data Fetching | TanStack Query (React Query) |
| HTTP Client | Axios |
| Global State | Zustand |
| Forms | React Hook Form + Zod |
| Styling | Bootstrap + Custom CSS |
| Animations | Framer Motion |
| Routing | React Router DOM v6 |
| Validation Schema | Zod + @hookform/resolvers |

---

## Architecture

LTS-Client follows a **Feature-Based Architecture** — code is organized by feature, not by type. This mirrors the backend's Vertical Slice architecture.

### Core Principle

Every feature is self-contained. It owns its own API calls, hooks, components, and types. No feature reaches into another feature's folder.

### Data Flow

```
Component
    ↓
useQuery / useMutation hook  (React Query)
    ↓
API function  (Axios)
    ↓
LTS-API Backend
    ↓
Response cached by React Query
    ↓
Component re-renders with data
```

### CQRS Mirror — React Query maps exactly to backend CQRS

| Backend | Frontend |
|---------|---------|
| Query Handler (read) | `useQuery` hook |
| Command Handler (write) | `useMutation` hook |
| MediatR dispatcher | React Query's `queryClient` |
| `IMemoryCache` | React Query cache (5 min stale time) |

---

## Project Structure

```
src/
├── features/
│   ├── cases/
│   │   ├── api/
│   │   │   └── casesApi.ts          # All Axios calls for Cases
│   │   ├── hooks/
│   │   │   ├── useCases.ts          # useQuery — fetch cases list
│   │   │   ├── useCaseById.ts       # useQuery — fetch single case
│   │   │   └── useCreateCase.ts     # useMutation — create case
│   │   ├── components/
│   │   │   ├── CasesPage.tsx        # Main page component
│   │   │   └── CaseForm.tsx         # Create/Edit form
│   │   └── types/
│   │       └── case.types.ts        # TypeScript interfaces
│   ├── courts/
│   ├── departments/
│   ├── petitioners/
│   ├── followup/
│   ├── documents/
│   ├── bench/
│   ├── auth/
│   ├── reports/
│   └── superAdmin/
│
├── shared/
│   ├── components/
│   │   ├── Layout.tsx               # Sidebar + Navbar wrapper
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   └── ui/
│       └── (reusable UI components)
│
├── lib/
│   ├── axiosInstance.ts             # Axios setup + JWT interceptor
│   └── queryClient.ts              # React Query global config
│
├── store/
│   └── authStore.ts                 # Zustand auth state
│
├── router/
│   └── index.tsx                    # All app routes
│
├── styles/
│   └── (global CSS files)
│
├── App.tsx
└── main.tsx
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Auth** | Login, logout, OTP verification, JWT token management |
| **Cases** | Full CRUD, search, status management, case details |
| **Courts** | Court listing and management |
| **Departments** | Department listing and management |
| **Petitioners** | Petitioner profiles linked to cases |
| **Followup / Hearings** | Hearing dates, interim orders, decisions |
| **Documents** | File upload and download per case |
| **Bench** | Judge assignment per case |
| **Reports** | Department-wise and court-wise case reports |
| **Dashboard** | Stats overview, upcoming hearings, recent cases |
| **SuperAdmin** | Organization management, plan assignment, payment verification |

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- LTS-API running locally or accessible via URL

### Clone the Repository

```bash
git clone https://github.com/fayaz921/LTS-Client.git
cd LTS-Client
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_API_BASE_URL=http://localhost:5245/api
```

### Run the Development Server

```bash
npm run dev
```

App will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL of the LTS-API backend | `http://localhost:5245/api` |

> All Vite environment variables must start with `VITE_` prefix to be accessible in the app via `import.meta.env.VITE_*`

> **Never commit your `.env` file.** It is already in `.gitignore`.

---

## How a Feature Works

Every feature follows the same 4-folder pattern. Here is the complete flow for the Cases feature:

### 1. API Layer — `features/cases/api/casesApi.ts`
All Axios HTTP calls for this feature. No business logic here.

```typescript
import api from '../../lib/axiosInstance'
import { CreateCaseDto, CaseDto } from '../types/case.types'

export const getAllCases = async (): Promise<CaseDto[]> => {
  const { data } = await api.get('/Cases/GetAllCases')
  return data.data
}

export const createCase = async (dto: CreateCaseDto): Promise<string> => {
  const { data } = await api.post('/Cases/CreateCase', dto)
  return data.data
}
```

### 2. Hooks Layer — `features/cases/hooks/useCases.ts`
React Query hooks that wrap the API calls. Handles caching, loading, and error states automatically.

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllCases, createCase } from '../api/casesApi'

// GET — useQuery
export const useCases = () => {
  return useQuery({
    queryKey: ['cases'],
    queryFn: getAllCases,
  })
}

// POST — useMutation
export const useCreateCase = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] })
    },
  })
}
```

### 3. Component Layer — `features/cases/components/CasesPage.tsx`
Consumes the hook. No direct API calls ever inside components.

```typescript
const CasesPage = () => {
  const { data: cases, isLoading, isError } = useCases()

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Something went wrong</div>

  return (
    <div>
      {cases?.map(c => <div key={c.id}>{c.title}</div>)}
    </div>
  )
}
```

### 4. Types Layer — `features/cases/types/case.types.ts`
TypeScript interfaces that match the backend DTOs exactly.

```typescript
export interface CaseDto {
  id: string
  caseNo: string
  title: string
  subject: string
  status: CaseStatus
  dateInstitution: string
}

export interface CreateCaseDto {
  caseNo: string
  title: string
  subject: string
  detail: string
  courtId: string
  departmentId: string
}

export enum CaseStatus {
  Pending = 0,
  Finalized = 1,
}
```

---

## State Management

**Zustand** manages global authentication state. No prop drilling needed.

```typescript
// store/authStore.ts
import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
```

```typescript
// After successful login
const { setAuth } = useAuthStore()
setAuth(response.data.user, response.data.token)

// In any component — read current user
const { user, isAuthenticated } = useAuthStore()

// Logout
const { logout } = useAuthStore()
```

---

## Routing

All routes are defined in `router/index.tsx`. Protected routes live under `/app` and require authentication.

```typescript
export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/app',
    element: <Layout />,           // Sidebar + Navbar wrapper
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'cases', element: <CasesPage /> },
      { path: 'courts', element: <CourtsPage /> },
      { path: 'departments', element: <DepartmentsPage /> },
      { path: 'followup', element: <FollowupPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'bench', element: <BenchPage /> },
      { path: 'reports', element: <ReportsPage /> },
    ],
  },
])
```

---

## API Integration

### Axios Instance — `lib/axiosInstance.ts`

Automatically attaches JWT token to every request and handles 401 expiry redirects.

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 — redirect to login on token expiry
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## Forms & Validation

**React Hook Form** + **Zod** handle all form state and validation — mirroring FluentValidation on the backend.

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  caseNo: z.string().min(1, 'Case number is required').max(50),
  title: z.string().min(1, 'Title is required').max(200),
  subject: z.string().min(1, 'Subject is required'),
})

type FormData = z.infer<typeof schema>

const CaseForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    // call mutation here
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('caseNo')} />
      {errors.caseNo && <span>{errors.caseNo.message}</span>}
    </form>
  )
}
```

---

## Contributing

This is a private team project. Branch and PR rules:

- **Never push directly to `main`**
- Create a feature branch: `Feature/YourFeatureName`
- Open a Pull Request — CI must pass before merge
- PR must be reviewed and approved by the Tech Lead before merging

### Branch Naming Convention

```
Feature/CasesPage
Feature/FollowupModule
Feature/SuperAdminDashboard
```

### Golden Rules

| Rule | Description |
|------|-------------|
| Feature Rule | Every feature owns its own `api/`, `hooks/`, `components/`, `types/` folders. Never reach into another feature's folder |
| API Rule | All Axios calls go in that feature's `api/` folder only. Never call Axios directly inside a component |
| Hook Rule | Use `useQuery` for GET requests. Use `useMutation` for POST/PUT/DELETE. Never use `useEffect` for API calls |
| Type Rule | Every API response must have a TypeScript interface in `types/`. Never use `any` type |
| Route Rule | All protected routes go inside `/app` children. Public routes go at root level |
| Auth Rule | After login call `setAuth()`. To get current user call `useAuthStore()`. Never store token manually |
| Component Rule | Keep components focused. If a component exceeds 150 lines, split it into smaller ones |
| Naming Rule | PascalCase for components (`CasesPage.tsx`), camelCase for hooks (`useCases.ts`) and API files (`casesApi.ts`) |
| CSS Rule | All dashboard styles use Bootstrap classes first. Custom CSS only when Bootstrap cannot do it |

---

## Related Repositories

| Repo | Description |
|------|-------------|
| [LTS-API](https://github.com/fayaz921/LTS-API) | ASP.NET 10 Web API backend |
| LTS-Landing | Next.js public landing page (coming soon) |

---

*Litigation Tracking System — Built for Pakistani Law Firms*
