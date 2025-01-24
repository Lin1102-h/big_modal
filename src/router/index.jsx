import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import BasicLayout from '../layouts/BasicLayout'
import AuthGuard from '../components/AuthGuard'
import { Spin } from 'antd'

// 懒加载组件
const Home = lazy(() => import('../pages/Home'))
const History = lazy(() => import('../pages/history'))
const NotFound = lazy(() => import('../pages/404'))

// 加载提示组件
const LoadingComponent = () => (
  <div style={{ padding: 24, textAlign: 'center' }}>
    <Spin size="large" />
  </div>
)

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <BasicLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/chat" replace />
      },
      {
        path: 'chat',
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <Home />
          </Suspense>
        )
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <History />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingComponent />}>
        <NotFound />
      </Suspense>
    )
  }
])

export default router 