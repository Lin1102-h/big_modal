import React, { Suspense, lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import BasicLayout from '../layouts/BasicLayout'
import AuthGuard from '../components/AuthGuard'
import { Spin } from 'antd'
import Login from '../pages/login'


// 懒加载组件
const Home = lazy(() => import('../pages/Home'))
const History = lazy(() => import('../pages/history'))
const BalanceInfo = lazy(() => import('../pages/BalanceInfo'))
const NotFound = lazy(() => import('../pages/404'))
const Video = lazy(() => import('../pages/video'))
const VideoTaskList = lazy(() => import('../pages/video/task-list'))
const Game = lazy(() => import('../pages/game'))
// 加载提示组件
const LoadingComponent = () => (
  <div style={{ padding: 24, textAlign: 'center' }}>
    <Spin size="large" />
  </div>
)

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    redirect: '/login',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/ai',
    element: (
      <AuthGuard>
        <BasicLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/ai/chat" replace />
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
      },
      {
        path: 'video',
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <Video />
          </Suspense>
        )
      },
      {
        path: 'tasks',
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <VideoTaskList />
          </Suspense>
        ),
      },
      {
        path: 'game',
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <Game />
          </Suspense>
        )
      },
      {
        path: 'insufficient',
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <BalanceInfo />
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