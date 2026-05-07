import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../shared/components/Layout'
import LandingPage from '../features/landing/components/LandingPage'
import { LoginForm } from '../features/auth/components/Login'
import { SignUp } from '../features/auth/components/SignUp'
import DocumentsPage from '../features/documents/components/DocumentPage'
import DashboardPage from '../features/dashboard/components/DashboardPage'
// import CaseList from '../features/cases/components/CaseList'
import BenchPage from '../features/Benches/components/BenchPage';
import ReportsPage from '../features/reports/components/ReportsPage';

export const router = createBrowserRouter([
    // public routes
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginForm /> },
    { path: '/register', element: <SignUp /> },
    { path: 'Benches', element: <BenchPage /> },
    { path: 'reports', element: <ReportsPage /> },

    // protected routes — inside Layout
    {
        path: '/app',
        element: <Layout />,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: 'dashboard', element: <DashboardPage /> },
            // { path: 'cases',         element: <CasesPage /> },
            // { path: 'cases', element: <CaseList /> },
            // { path: 'cases/new', element: <CaseList /> },
            // { path: 'courts',        element: <CourtsPage /> },
            // { path: 'departments',   element: <DepartmentsPage /> },
            // { path: 'petitioners',   element: <PetitionersPage /> },
            // { path: 'followup',      element: <FollowupPage /> },
            { path: 'documents', element: <DocumentsPage /> },
            { path: 'documents/:caseId', element: <DocumentsPage /> },
            // { path: 'alerts',        element: <AlertsPage /> },
            { path: 'reports',       element: <ReportsPage /> },
            { path: 'Benches',         element: <BenchPage /> },
        ]
    },

    // catch all
    { path: '*', element: <Navigate to='/login' replace /> }
])
