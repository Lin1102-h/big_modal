import React from 'react'
import { Layout, Button, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  MessageOutlined,
  HistoryOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlaySquareOutlined
} from '@ant-design/icons'
import './style.css'

const { Sider } = Layout

const ChatSider = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      key: '/chat',
      icon: <MessageOutlined />,
      label: '新对话',
      onClick: () => navigate('/ai/chat')
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: '历史记录',
      onClick: () => navigate('/ai/history')
    },
    // {
    //   key: '/insufficient',
    //   icon: <HistoryOutlined />,
    //   label: '余额查询',
    //   onClick: () => navigate('/ai/insufficient')
    // },
    {
      key: '/video',
      icon: <PlaySquareOutlined />,
      label: '视频对话',
      onClick: () => navigate('/ai/video')
    },
    {
      key: '/tasks',
      icon: <HistoryOutlined />,
      label: '任务列表',
      onClick: () => navigate('/ai/tasks')
    },
    // {
    //   key: '/game',
    //   icon: <HistoryOutlined />,
    //   label: '游戏',
    //   onClick: () => navigate('/ai/game')
    // },
    // {
    //   key: '/settings',
    //   icon: <SettingOutlined />,
    //   label: '设置',
    //   onClick: () => navigate('/ai/settings')
    // }
  ]

  return (
    <Sider 
      className="sider"
      collapsible 
      collapsed={collapsed} 
      onCollapse={setCollapsed}
      trigger={null}
      theme="light"
    >
      <div className="sider-header">
        {!collapsed && <h2 className="sider-title">AI Chat</h2>}
        <Button 
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>
      <Menu
        className="menu-container"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Sider>
  )
}

export default ChatSider 