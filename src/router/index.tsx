import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../shared/components/Layout";
import LandingPage from "../features/landing/components/LandingPage";
import DocumentsPage from "../features/documents/components/documentPage";
import { RegisterForm } from "../features/auth/components/RegisterForm";
import { LoginForm } from "../features/auth/components/Login";

export const router = createBrowserRouter([
  // public routes
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },

  // protected (layout based)
  {
    path: "/app",
    element: <Layout />,
    children: [
        {
        path: "documents/:caseId",
        element: <DocumentsPage />,
      },
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
      //  default child route (/app)
      // { index: true, element: <LandingPage /> },

      // correct nested path
      { path: "register", element: <RegisterForm /> },
    {path:"login",element:<LoginForm/>}
    ],
  },

  // catch all
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);