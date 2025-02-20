import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const AuthGuard = ({ children }) => {
  const location = useLocation()
  const isAuthenticated = localStorage.getItem('token')
  
  // 如果需要登录但未登录，重定向到登录页
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default AuthGuard 