import React, { useEffect, useState } from 'react'
import { List, Card, Typography, message } from 'antd'
import { chatAPI } from '@/services/api'
import './style.css'

const { Title } = Typography

const History = () => {
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await chatAPI.getHistory({
        userId: localStorage.getItem('userId')
      })
      setChats(res.data.chats)
    } catch (error) {
      console.error('Fetch history error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (title) => {
    try {
      await navigator.clipboard.writeText(title)
      message.success('已复制到剪贴板')
    } catch (err) {
      // 降级处理：如果 clipboard API 不可用
      const textArea = document.createElement('textarea')
      textArea.value = title
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        message.success('已复制到剪贴板')
      } catch (err) {
        message.error('复制失败')
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <Card className="history-card">
      <Title level={4} className="history-title">对话历史</Title>
      <List
        className="history-list"
        loading={loading}
        dataSource={chats}
        renderItem={(chat) => (
          <List.Item 
            className="history-item"
            onClick={() => handleCopy(chat.title)}
          >
            <div className="history-item-content">
              {chat.title}
            </div>
          </List.Item>
        )}
      />
    </Card>
  )
}

export default History
