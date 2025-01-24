import React from 'react'
import { List, Space, Card, Avatar, Button, Input } from 'antd'
import { 
  RobotOutlined, 
  UserOutlined, 
  SendOutlined 
} from '@ant-design/icons'

const { TextArea } = Input

const ChatBox = ({ messages, inputValue, setInputValue, handleSend }) => {
  return (
    <>
      <div className="message-container">
        <List
          itemLayout="horizontal"
          dataSource={messages}
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
      </div>
      <div className="input-container">
        <div className="textarea-wrapper">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入消息..."
            autoSize={{ minRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button 
            type="primary"
            className="send-button"
            icon={<SendOutlined />}
            onClick={handleSend}
          >
            发送
          </Button>
        </div>
      </div>
    </>
  )
}

export default ChatBox 