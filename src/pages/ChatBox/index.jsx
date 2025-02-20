import React, { useRef, useEffect } from 'react'
import { Input, Button, Space, Avatar, List, Card, Tooltip } from 'antd'
import { SendOutlined, PlusCircleOutlined } from '@ant-design/icons'
import './style.css'
import Robot from '@/assets/deepseek.svg'
import User from '@/assets/user.svg'
import {marked} from 'marked'

const { TextArea } = Input

  const ChatBox = ({ messages, inputValue, setInputValue, handleSend, loading, onNewChat }) => {

  const listRef = useRef(null)

  const scrollToBottom = () => {
    // 使用 RAF 确保在DOM更新后执行滚动
    requestAnimationFrame(() => {
      if (listRef.current) {
        const scrollHeight = listRef.current.scrollHeight
        const height = listRef.current.clientHeight
        const maxScrollTop = scrollHeight - height
        
        listRef.current.scrollTo({
          top: maxScrollTop,
          behavior: 'smooth'
        })
      }
    })
  }

  // 监听消息变化自动滚动
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Card className="chat-card">
      <div className="new-chat-button">
        <Tooltip title="新建对话">
          <Button 
            type="primary"
            shape="circle"
            icon={<PlusCircleOutlined />}
            onClick={onNewChat}
          />
        </Tooltip>
      </div>
      <List
        ref={listRef}
        className="messages-list"
        itemLayout="horizontal"
        dataSource={messages}
        renderItem={(message, index) => (
          <List.Item
            key={index}
            className={`message-item ${message.type === 'user' ? 'message-item-user' : 'message-item-bot'}`}
          >
            <Space align="start" className="message-space">
              {message.type === 'bot' && (
                <Avatar src={Robot} />
              )}
              <div
                className={`message-content ${message.type === 'user' ? 'message-content-user' : 'message-content-bot'}`}
                dangerouslySetInnerHTML={{ __html: marked(message.content) }}
              />
              {message.type === 'user' && (
                <Avatar src={User}  />
              )}
            </Space>
          </List.Item>
        )}
      />
      <div className="input-container">
        <div className="input-wrapper">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="请输入消息... (Shift + Enter 换行，Enter 发送)"
            disabled={loading}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={loading}
            className="send-button"
          >
            发送
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ChatBox 