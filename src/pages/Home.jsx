import React, { useState, useEffect } from 'react'
import { Card, message } from 'antd'
import ChatBox from './ChatBox'
import { chatAPI } from '../services/api'
import './style.css'

const Home = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', content: '你好！我是AI助手，有什么可以帮你的吗？' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  // 自动滚动到底部
  useEffect(() => {
    debugger
    const messagesList = document.querySelector('.messages-list .ant-list-items')
    if (messagesList) {
      messagesList.scrollTop = messagesList.scrollHeight
    }
  }, [messages]) // 当消息列表更新时触发滚动

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return
    
    const userMessage = { type: 'user', content: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const response = await chatAPI.sendMessage(inputValue.trim())
      setMessages(prev => [...prev, {
        type: 'bot',
        content: response.data
      }])
    } catch (error) {
      message.error('发送消息失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card 
      className="chat-card"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '12px'
      }}
    >
      <ChatBox 
        messages={messages}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSend={handleSend}
        loading={loading}
      />
    </Card>
  )
}

export default Home 