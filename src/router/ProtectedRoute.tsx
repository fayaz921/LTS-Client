import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getMe, refreshToken } from '../features/auth/api/auth.api'
import { Loader } from '../shared/components/Loader'

export const ProtectedRoute = () => {
    const { accessToken, setAuth, setAccessToken, clearAuth } = useAuthStore()
    const [isChecking, setIsChecking] = useState(true)
    const hasChecked = useRef(false)

    useEffect(() => {
        if (hasChecked.current) return
        hasChecked.current = true

        // Token already hai — /me se fresh data lo
        if (accessToken) {
            getMe()
                .then((meResponse) => {
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
                })
                .catch(() => {
                    // /me fail — token expire — clear karo
                    clearAuth()
                })
                .finally(() => setIsChecking(false))
            return
        }

        // Token nahi — cookie se refresh try karo
        const tryRefresh = async () => {
            try {
                const response = await refreshToken()
                if (response.isSuccess && response.data) {
                    const token = response.data

                    // pehle token store karo
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
                } else {
                    clearAuth()
                }
            } catch {
                clearAuth()
            } finally {
                setIsChecking(false)
            }
        }

        tryRefresh()
    }, []) // ← empty — sirf ek baar

    if (isChecking) return <Loader />

    return accessToken ? <Outlet /> : <Navigate to='/login' replace />
}