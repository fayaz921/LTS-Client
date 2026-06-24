// import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { useEffect } from 'react'
// import { Loader } from './shared/components/Loader'
import { router } from './router'
import { useAuthStore } from './store/authStore'
import { getMe, refreshToken } from './features/auth/api/auth.api'
import { Toaster } from 'react-hot-toast'

const App = () => {

    // const isFetching = useIsFetching()
    // const isMutating = useIsMutating()
    const { setAuth, setAccessToken, accessToken } = useAuthStore()

    // const isLoading = isFetching > 0 || isMutating > 0

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Step 1 — agar token already hai store mein — /me call karo fresh data ke liye
                if (accessToken) {
                    const meResponse = await getMe()
                    if (meResponse.isSuccess && meResponse.data) {
                        setAuth({
                            id: meResponse.data.id,
                            name: meResponse.data.name,
                            email: meResponse.data.email,
                            role: meResponse.data.role,
                            profileImage: meResponse.data.profileImage,
                            organizationId: meResponse.data.organizationId,
                            organizationName: meResponse.data.organizationName,
                            organizationPlan: meResponse.data.organizationPlan,
                            isActive: true,
                        }, accessToken)
                    }
                    return
                }

                // Step 2 — token nahi — cookie se refresh try karo
                const response = await refreshToken()
                if (response.isSuccess && response.data) {
                    const token = response.data

                    // token store karo pehle
                    setAccessToken(token)

                    // /me call karo fresh data ke liye
                    const meResponse = await getMe()
                    if (meResponse.isSuccess && meResponse.data) {
                        setAuth({
                            id: meResponse.data.id,
                            name: meResponse.data.name,
                            email: meResponse.data.email,
                            role: meResponse.data.role,
                            profileImage: meResponse.data.profileImage,
                            organizationId: meResponse.data.organizationId,
                            organizationName: meResponse.data.organizationName,
                            organizationPlan: meResponse.data.organizationPlan,
                            isActive: true,
                        }, token)
                    }
                }
            } catch {
                // cookie nahi — ProtectedRoute login pe redirect karega
            }
        }

        initAuth()
    }, []) // ← empty array — sirf ek baar app start pe

    return (
        <>
            <Toaster position="top-right" />
            {/* {isLoading && <Loader />} */}
            <RouterProvider router={router} />
        </>
    )
}

export default App