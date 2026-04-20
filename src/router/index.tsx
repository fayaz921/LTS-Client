import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "../features/auth/components/LoginPage";
import Layout from "../shared/components/Layout";
import LandingPage from "../features/landing/components/LandingPage";

export const router = createBrowserRouter([
  // default redirect
  {
    path: "/",
    element: <LandingPage />,
  },

  // public routes
  {
    path: "/login",
    element: <LoginPage />,
  },

  // protected routes — all inside Layout
  {
    path: "/app",
    element: <Layout />,
    children: [
      // team uncomments and adds their routes here
      // { path: 'dashboard',   element: <DashboardPage /> },
      // { path: 'cases',       element: <CasesPage /> },
      // { path: 'hearings',    element: <HearingsPage /> },
      // { path: 'petitioners', element: <PetitionersPage /> },
      // { path: 'courts',      element: <CourtsPage /> },
      // { path: 'departments', element: <DepartmentsPage /> },
      // { path: 'documents',   element: <DocumentsPage /> },
      // { path: 'alerts',      element: <AlertsPage /> },
      // { path: 'reports',     element: <ReportsPage /> },
    ],
  },

  // catch all — redirect to login
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
