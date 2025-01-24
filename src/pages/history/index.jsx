import React, { useState, useEffect } from 'react'
import { List, Card, Space, Avatar, Button, message, Empty, Spin } from 'antd'
import { 
  RobotOutlined, 
  UserOutlined,
  DeleteOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import { chatAPI } from '../../services/api'
import './style.css'

const History = () => {
  const [loading, setLoading] = useState(false)
  const [historyList, setHistoryList] = useState([])

  // 获取历史记录
  const fetchHistory = async () => {
    setLoading(true)
    try {
      const response = await chatAPI.getHistory()
      setHistoryList(response.data || [])
    } catch (error) {
      message.error('获取历史记录失败')
    } finally {
      setLoading(false)
    }
  }

  // 清除历史记录缓存并重新获取
  const handleRefresh = () => {
    chatAPI.clearHistoryCache()
    fetchHistory()
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  // 渲染对话内容
  const renderConversation = (conversation) => {
    return (
      <Card className="history-card">
        <div className="history-card-header">
          <span className="history-time">{conversation.time}</span>
          <Space>
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(conversation.id)}
              className="delete-btn"
            />
          </Space>
        </div>
        <List
          itemLayout="horizontal"
          dataSource={conversation.messages}
          renderItem={(message) => (
            <List.Item
              className={message.type === 'user' ? 'message-item-user' : 'message-item-bot'}
            >
              <Space align="start">
                {message.type === 'bot' && (
                  <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
                )}
                <Card
                  className={`message-card ${message.type === 'user' ? 'message-card-user' : 'message-card-bot'}`}
                  style={message.type === 'user' ? { 
                    padding: '8px 12px',
                    color: '#fff'
                  } : {
                    padding: '8px 12px',
                    color: 'inherit'
                  }}
                >
                  {message.content}
                </Card>
                {message.type === 'user' && (
                  <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
                )}
              </Space>
            </List.Item>
          )}
        />
      </Card>
    )
  }

  return (
    <div className="history-content">
      <div className="history-header">
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          loading={loading}
        >
          刷新
        </Button>
      </div>
      <div className="history-list">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : historyList.length > 0 ? (
          historyList.map(conversation => (
            <div key={conversation.id} className="history-item">
              {renderConversation(conversation)}
            </div>
          ))
        ) : (
          <Empty description="暂无历史记录" />
        )}
      </div>
    </div>
  )
}

export default History
