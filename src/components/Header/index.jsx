import React from 'react'
import { Layout } from 'antd'

const { Header } = Layout

const ChatHeader = ({ title }) => {
  return (
    <Header className="main-header">
      <h3 className="header-title">{title}</h3>
    </Header>
  )
}

export default ChatHeader 