import React, { useState } from 'react'
import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import ChatSider from '../components/Sider'
import ChatHeader from '../components/Header'
import AppBreadcrumb from '../components/Breadcrumb'
import './style.css'
const { Content } = Layout

const BasicLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  return (
      <Layout className="layout-container">
        <ChatSider collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout className="main-layout">
          <ChatHeader />
          <div className="breadcrumb-container">
            <AppBreadcrumb />
          </div>
          <Content className="main-content">
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={location.key}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                <Outlet />
              </CSSTransition>
            </SwitchTransition>
          </Content>
        </Layout>
      </Layout>
  )
}

export default BasicLayout 