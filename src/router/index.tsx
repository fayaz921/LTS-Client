import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../shared/components/Layout'
import LandingPage from '../features/landing/components/LandingPage'
import { RegisterForm } from '../features/auth/components/RegisterForm'
import { LoginForm } from '../features/auth/components/Login'
import DocumentsPage from '../features/documents/components/DocumentPage'
import CaseList from '../features/cases/components/CaseList'

export const router = createBrowserRouter([
    // public routes
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginForm /> },
    { path: '/register', element: <RegisterForm /> },

    // protected routes — inside Layout
    {
        path: '/app',
        element: <Layout />,
        children: [
            { path: 'cases', element: <CaseList /> },
            { path: 'cases/new', element: <CaseList /> },
            // { path: 'courts',        element: <CourtsPage /> },
            // { path: 'departments',   element: <DepartmentsPage /> },
            // { path: 'petitioners',   element: <PetitionersPage /> },
            // { path: 'followup',      element: <FollowupPage /> },
            { path: 'documents', element: <DocumentsPage /> },
            { path: 'documents/:caseId', element: <DocumentsPage /> },
            // { path: 'alerts',        element: <AlertsPage /> },
            // { path: 'reports',       element: <ReportsPage /> },
            // { path: 'bench',         element: <BenchPage /> },
        ]
    },

    // catch all
    { path: '*', element: <Navigate to='/login' replace /> }
])