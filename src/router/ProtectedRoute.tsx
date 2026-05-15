import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getMe, refreshToken } from '../features/auth/api/auth.api'
import { Loader } from '../shared/components/Loader'

interface Props {
  requiredRole?: string
}

export const ProtectedRoute = ({ requiredRole }: Props) => {
  const { accessToken, user, setAuth, setAccessToken, clearAuth } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  const hasChecked = useRef(false)

  useEffect(() => {
    if (hasChecked.current) return
    hasChecked.current = true

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
        .catch(() => clearAuth())
        .finally(() => setIsChecking(false))
      return
    }

    const tryRefresh = async () => {
      try {
        const response = await refreshToken()
        if (response.isSuccess && response.data) {
          const token = response.data
          setAccessToken(token)
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
  }, [])

  if (isChecking) return <Loader />

  if (!accessToken) return <Navigate to="/login" replace />

 
  console.log('user role:', user?.role, 'required:', requiredRole)

  if (requiredRole && user?.role !== requiredRole) {
    return user?.role === 'SuperAdmin'
      ? <Navigate to="/super-admin" replace />
      : <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}