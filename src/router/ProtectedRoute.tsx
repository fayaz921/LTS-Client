import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { refreshToken } from '../features/auth/api/auth.api'
import { jwtDecode } from 'jwt-decode'
import { Loader } from '../shared/components/Loader'

interface JwtPayload {
  nameid: string;
  unique_name: string;
  email: string;
  role: string;
  [key: string]: string;
}

export const ProtectedRoute = () => {
    const { accessToken, setAuth, clearAuth } = useAuthStore()
    const [isChecking, setIsChecking] = useState(true)
    const hasChecked = useRef(false)

    useEffect(() => {
          if (hasChecked.current) return 
          hasChecked.current = true
        if (accessToken) {
           Promise.resolve().then(() => setIsChecking(false))
            return
        }

        // Token nahi — refresh try karo
        const tryRefresh = async () => {
            try {
                const response = await refreshToken()
                if (response.isSuccess && response.data) {
                    const decoded = jwtDecode<JwtPayload>(response.data)
                    setAuth({
                        id: decoded.nameid,
                        name: decoded.unique_name,
                        email: decoded.email,
                        role: decoded.role,
                        organizationId: '',
                        organizationName: '',
                        organizationPlan: '',
                        isActive: true,
                    }, response.data)
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
    }, [accessToken, setAuth, clearAuth])

    if (isChecking) return <Loader /> // ya apna loader lagao

    return accessToken ? <Outlet /> : <Navigate to='/login' replace />
}