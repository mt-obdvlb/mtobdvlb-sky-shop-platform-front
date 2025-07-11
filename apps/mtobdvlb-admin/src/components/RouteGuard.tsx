import { useAppSelector } from '@/store/hooks.ts'
import { Navigate } from 'react-router-dom'
import * as React from 'react'

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const token = useAppSelector(state => state.user.token)

  if (!token) {
    return <Navigate to={'/login'} replace />
  }

  return children
}

export default RouteGuard
