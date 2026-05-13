import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Loader } from './shared/components/Loader'
import { router } from './router'
import { useAuthStore } from './store/authStore'
import { refreshToken } from './features/auth/api/auth.api'

interface JwtPayload {
    nameid: string
    unique_name: string
    email: string
    role: string
}

const App = () => {
    const isFetching = useIsFetching()
    const isMutating = useIsMutating()
    const setAuth = useAuthStore((state) => state.setAuth)

    const isLoading = isFetching > 0 || isMutating > 0

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await refreshToken()
                if (response.isSuccess && response.data) {
                    const token = response.data
                    const decoded = jwtDecode<JwtPayload>(token)
                    setAuth({
                        id: decoded.nameid,
                        name: decoded.unique_name,
                        email: decoded.email,
                        role: decoded.role,
                        organizationId: '',
                        organizationName: '',
                        organizationPlan: '',
                        isActive: true,
                    }, token)
                }
            } catch {
                // no cookie — ProtectedRoute will redirect to login
            }
        }

        initAuth()
    }, [setAuth])

    return (
        <>
            {isLoading && <Loader />}
            <RouterProvider router={router} />
        </>
    )
}

export default App
