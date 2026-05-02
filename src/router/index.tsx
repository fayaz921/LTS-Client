import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../shared/components/Layout'
import LandingPage from '../features/landing/components/LandingPage'
import { LoginForm } from '../features/auth/components/Login'
// import { SignUpForm } from '../features/auth/components/SignUp'
import DocumentsPage from '../features/documents/components/DocumentPage'
import { SignUp } from '../features/auth/components/SignUp'

export const router = createBrowserRouter([
    // public routes
    { path: '/',         element: <LandingPage /> },
    { path: '/login',    element: <LoginForm /> },
    { path: '/SignUp', element: <SignUp /> },

    // protected routes — inside Layout
    {
        path: '/app',
        element: <Layout />,
        children: [
            // { path: 'cases',         element: <CasesPage /> },
            // { path: 'courts',        element: <CourtsPage /> },
            // { path: 'departments',   element: <DepartmentsPage /> },
            // { path: 'petitioners',   element: <PetitionersPage /> },
            // { path: 'followup',      element: <FollowupPage /> },
            { path: 'documents',         element: <DocumentsPage /> },
            { path: 'documents/:caseId', element: <DocumentsPage /> },
            // { path: 'alerts',        element: <AlertsPage /> },
            // { path: 'reports',       element: <ReportsPage /> },
            // { path: 'bench',         element: <BenchPage /> },
        ]
    },

    // catch all
    { path: '*', element: <Navigate to='/login' replace /> }
])