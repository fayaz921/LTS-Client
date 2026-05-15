import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../shared/components/Layout'
import LandingPage from '../features/landing/components/LandingPage'
import { LoginForm } from '../features/auth/components/Login'
import { SignUp } from '../features/auth/components/SignUp'
import DocumentsPage from '../features/documents/components/DocumentPage'
import DashboardPage from '../features/dashboard/components/DashboardPage'
import CaseList from '../features/cases/components/CaseList'
import DepartmentsPage from '../features/departments/components/DepartmentsPage'
import { ProtectedRoute } from './ProtectedRoute'
import PetitionersPage from '../features/petitioners/components/PetitionersPage'
import BenchPage from '../features/Benches/components/BenchPage'
import ReportsPage from '../features/reports/components/ReportsPage'
import { ProfilePage } from '../features/UserProfile/components/ProfilePage'
import { SuperAdminDashboard } from '../features/superAdmin/components/SuperAdminDashboard'
import AlertsPage from '../features/alerts/components/AlertsPage'
import CourtsPage from '../features/courts/components/CourtsPage'
import FollowupPage from '../features/followup/components/FollowupPage'

export const router = createBrowserRouter([
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginForm /> },
    { path: '/register', element: <SignUp /> },
    {
        path: '/super-admin',
        element: <ProtectedRoute requiredRole="SuperAdmin" />,
        children: [
            { index: true, element: <SuperAdminDashboard /> }
        ]
    },


    {
        path: '/app',
        element: <ProtectedRoute />,
        children: [
            {
                element: <Layout />,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: 'dashboard', element: <DashboardPage /> },
                    { path: 'cases', element: <CaseList /> },
                    { path: 'cases/new', element: <CaseList /> },
                    { path: 'departments', element: <DepartmentsPage /> },
                    { path: 'documents', element: <DocumentsPage /> },
                    { path: 'documents/:caseId', element: <DocumentsPage /> },
                    { path: 'petitioners', element: <PetitionersPage /> },
                    { path: 'courts',         element: <CourtsPage /> },
                    { path: 'followup',       element: <FollowupPage /> },
                    { path: 'followup/:caseId', element: <FollowupPage /> },
                     { path: 'alerts',         element: <AlertsPage /> },
                    {path: 'profile', element: <ProfilePage />},
                    { path: 'Benches', element: <BenchPage /> },
                    { path: 'reports', element: <ReportsPage /> },
                ]
            }
        ]
    },

    { path: '*', element: <Navigate to='/login' replace /> }
])
