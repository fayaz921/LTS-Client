// import { RouterProvider } from "react-router-dom";
// import { router } from "./router"; // apna correct path
// const App: React.FC = () => {
//   return <RouterProvider router={router} />;
// };
// import { RouterProvider } from "react-router-dom";
// import { router } from "./router/router"; // apna correct path

// const App: React.FC = () => {
//   return <RouterProvider router={router} />;
// };

// export default App;


import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { Loader } from './shared/components/Loader'

const App = () => {
    const isFetching = useIsFetching()
    const isMutating = useIsMutating()

    const isLoading = isFetching > 0 || isMutating > 0

    return (
        <>
            {isLoading && <Loader />}
        </>
    )
}

export default App

// Add this 

import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { refreshToken } from "./features/auth/api/auth.api";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  nameid: string;
  unique_name: string;
  email: string;
  role: string;
}

const App = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    // Page refresh pe cookie se naya accessToken lo
    const initAuth = async () => {
      try {
        const response = await refreshToken();
        if (response.isSuccess && response.data) {
          const token = response.data;
          const decoded = jwtDecode<JwtPayload>(token);

          setAuth({
            id: decoded.nameid,
            name: decoded.unique_name,
            email: decoded.email,
            role: decoded.role,
            organizationId: '',
            organizationName: '',
            organizationPlan: '',
            isActive: true,
          }, token);
        }
      } catch {
        // Cookie nahi hai — login pe jayega ProtectedRoute ki wajah se
      }
    };

    initAuth();
  }, []);

  return <RouterProvider router={router} />;
};

export default App;
