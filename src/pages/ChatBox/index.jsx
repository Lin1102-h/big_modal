import React, { useRef, useState, useEffect } from "react"
import { Input, Button, Space, Avatar, List, Card, Tooltip, Spin } from "antd"
import { SendOutlined, PlusCircleOutlined } from "@ant-design/icons"
import "./style.css"
import Robot from "@/assets/deepseek.svg"
import User from "@/assets/user.svg"
import "highlight.js/styles/monokai-sublime.css"
import hljs from "highlight.js" // 引入 highlight.js
const { TextArea } = Input

const ChatBox = ({ messages, inputValue, setInputValue, handleSend, loading, onNewChat }) => {
  const listRef = useRef(null)
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false)

  // 添加预处理高亮的函数
  const processMessageContent = (content) => {
    if (!content || typeof content !== 'string') return content;

    // 只处理代码块的高亮，其他内容保持不变
    return content.replace(/<pre><code class="([^"]+)">([\s\S]+?)<\/code><\/pre>/g, (match, language, code) => {
      try {
        // 解码 HTML 实体，因为后端可能已经转义过
        const decodedCode = code.replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");

        const highlighted = hljs.highlight(decodedCode.trim(), { language: language.slice(9) }).value;
        return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
      } catch (e) {
        return match; // 如果高亮失败，返回原始内容
      }
    });
  };

  const scrollToBottom = () => {
    // 使用 RAF 确保在DOM更新后执行滚动
    requestAnimationFrame(() => {
      if (listRef.current) {
        const scrollHeight = listRef.current.scrollHeight
        const height = listRef.current.clientHeight
        const maxScrollTop = scrollHeight - height

        listRef.current.scrollTo({
          top: maxScrollTop,
          behavior: "smooth",
        })
      }
    })
  }

  useEffect(() => {
    listRef.current.addEventListener("scroll", () => {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 10
      if (!isAtBottom) {
        setIsUserScrolledUp(true)
      } else {
        setIsUserScrolledUp(false)
      }
    })
    return () => {
      listRef.current?.removeEventListener("scroll", () => { })
    }
  }, [])

  // 修改 useEffect，移除高亮处理
  useEffect(() => {
    if (!isUserScrolledUp) {
      scrollToBottom()
    }
    console.log(messages)
  }, [messages])

  const emptyText = () => {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 500, color: '#333', marginBottom: 15 }}>
          你好，我是云栖，有什么可以帮你的吗？
        </div>
        <div>我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~</div>
      </>
    )
  }

  return (
    <Card className="chat-card">
      <div className="new-chat-button">
        <Tooltip title="新建对话">
          <Button type="primary" shape="circle" icon={<PlusCircleOutlined />} onClick={onNewChat} />
        </Tooltip>
      </div>
      <div className="messages-container">
        <List
          ref={listRef}
          className="messages-list"
          itemLayout="horizontal"
          dataSource={messages}
          locale={{ emptyText: emptyText() }}
          renderItem={(message, index) => (
            <List.Item key={index} className={`message-item ${message.type === "user" ? "message-item-user" : "message-item-bot"}`}>
              <Space align="start" className="message-space">
                {message.type === "bot" && <Avatar src={Robot} />}
                {message.type === "bot" && index === messages.length - 1 && loading ? (
                  <div>
                    <div>正在思考中。。。</div>
                    <Spin />
                  </div>
                ) : (
                  <div className={`message-content ${message.type === "user" ? "message-content-user" : "message-content-bot"}`}>
                    {message.type === "bot" && message.reasoning && (
                      <div className="message-reasoning">
                        <div className="reasoning-header">
                          <span className="reasoning-icon">🤔</span>
                          <span className="reasoning-title">思考过程</span>
                        </div>
                        <div className="reasoning-content" dangerouslySetInnerHTML={{ __html: message.reasoning }} />
                      </div>
                    )}
                    {message.type === "bot" && message.content && (
                      <div className="message-result">
                        {index !== 0 && (
                          <div className="result-header">
                            <span className="result-icon">💡</span>
                            <span className="result-title">回答</span>
                          </div>
                        )}
                        <div className="result-content" dangerouslySetInnerHTML={{ __html: processMessageContent(message.content) }} />
                      </div>
                    )}
                    {message.type === "user" && (
                      <div dangerouslySetInnerHTML={{ __html: message.content }} />
                    )}
                  </div>
                )}
                {message.type === "user" && <Avatar src={User} />}
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
            <Button size="small" type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading} className="send-button">
              发送
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ChatBox
