import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../shared/components/Layout'
// import ProtectedRoute from '../shared/components/ProtectedRoute'
import LandingPage from '../features/landing/components/LandingPage'
import { LoginForm } from '../features/auth/components/Login'
import { SignUp } from '../features/auth/components/SignUp'
import DocumentsPage from '../features/documents/components/DocumentPage'
import DashboardPage from '../features/dashboard/components/DashboardPage'
import CaseList from '../features/cases/components/CaseList'
import DepartmentsPage from '../features/departments/pages/DepartmentsPage'
import PetitionersPage from '../features/petitioners/components/PetitionersPage'
export const router = createBrowserRouter([
    // public routes
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginForm /> },
    { path: '/register', element: <SignUp /> },

     // protected routes
    {
        path: '/app',
        // element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    { index: true,              element: <DashboardPage /> },
                    { path: 'dashboard',        element: <DashboardPage /> },
                    { path: 'cases',            element: <CaseList /> },
                    { path: 'cases/new',        element: <CaseList /> },
                    { path: 'departments',      element: <DepartmentsPage /> },
                    { path: 'documents',        element: <DocumentsPage /> },
                    { path: 'documents/:caseId',element: <DocumentsPage /> },
                    // { path: 'courts',        element: <CourtsPage /> },
                    { path: 'petitioners',   element: <PetitionersPage /> },
                    // { path: 'followup',      element: <FollowupPage /> },
                    // { path: 'alerts',        element: <AlertsPage /> },
                    // { path: 'reports',       element: <ReportsPage /> },
                    // { path: 'bench',         element: <BenchPage /> },
                ]
            }
        ]
    },

    // catch all
    { path: '*', element: <Navigate to='/login' replace /> }
])
