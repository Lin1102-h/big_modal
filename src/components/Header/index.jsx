import React from 'react'
import { Layout, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import './style.css'
const { Header } = Layout

const ChatHeader = ({ title, username }) => {
  return (
    <Header className="main-header">
      <h3 className="header-title">Yunxi</h3>
      <div className="header-user">
        <Avatar icon={<UserOutlined />} className="header-avatar" />
        <span className="header-username">{username || '未登录'}</span>
      </div>
    </Header>
  )
}

export default ChatHeader 