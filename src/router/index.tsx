import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../shared/components/Layout";
import LandingPage from "../features/landing/components/LandingPage";
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
      //  default child route (/app)
      { index: true, element: <LandingPage /> },

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