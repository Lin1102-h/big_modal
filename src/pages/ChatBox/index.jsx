import React from 'react'
import { Input, Button, Space, Avatar, List, Card } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
import './style.css'

const { TextArea } = Input

const ChatBox = ({ messages, inputValue, setInputValue, handleSend, loading }) => {
  return (
    <Card className="chat-card">
      <List
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
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
              )}
              <div
                className={`message-content ${message.type === 'user' ? 'message-content-user' : 'message-content-bot'}`}
                dangerouslySetInnerHTML={{ __html: message.content }}
              >
              </div>
              {message.type === 'user' && (
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
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