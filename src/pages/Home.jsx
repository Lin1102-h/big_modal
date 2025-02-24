import React, { useState } from 'react'
import { Card } from 'antd'
import ChatBox from './ChatBox'
import { chatAPI } from '../services/api'
import './style.css'
import {marked} from 'marked'
import hljs from "highlight.js"; // 引入 highlight.js
import "highlight.js/styles/monokai-sublime.css";
marked.setOptions({
  highlight: function (code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(validLanguage, code).value;
  },
  langPrefix: 'hljs', // 高亮代码块的类名前缀
}); 
const Home = () => {
  const [messages, setMessages] = useState([
    { type: 'bot', content: '你好！我是deepseek，有什么可以帮你的吗？',flag:true }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [newChat, setNewChat] = useState(true)
  const [useMessages, setUseMessages] = useState([])

  // 添加消息到对话列表
  const appendMessage = (type, content) => {
    setMessages(prev => [...prev, { type, content }])
  }

  // 更新最后一条消息的内容
  const updateLastMessage = (content) => {
    setMessages(prev => {
      const newMessages = [...prev]
      const lastMessage = newMessages[newMessages.length - 1]
      lastMessage.content = content
      lastMessage.flag = true
      return newMessages
    })
  }

  // 处理流式响应数据
  const handleStreamResponse = async (response) => {
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let accumulatedContent = '' // 用于累积内容

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content === '[DONE]') return

              // 累积新的内容
              accumulatedContent += data.content
              
              // 更新消息，使用累积的内容而不是追加
              setMessages(prev => {
                const newMessages = [...prev]
                newMessages[newMessages.length - 1].content = marked(accumulatedContent)
                return newMessages
              })
              
            } catch (e) {
              console.log('Parse error:', e)
            }
          }
        }
        hljs.highlightAll();
      }
      return accumulatedContent
    } finally {
      reader.releaseLock()
    }
  }

  // 处理错误情况
  const handleError = (error) => {
    console.log('Error:', error)
    const errorMessage = error.status === 402 
      ? '抱歉，余额不足' 
      : '抱歉，发生错误了'
    updateLastMessage(errorMessage)
  }

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || loading) return

    try {
      setLoading(true)
      // 添加用户消息
      appendMessage('user', inputValue.trim())
      // 添加机器人消息占位
      appendMessage('bot', '')
      setInputValue('')
      const { data } = await chatAPI.sendMessage({ 
        message: [...useMessages, { role: "user", content: inputValue.trim() }],
        id: localStorage.getItem('userId'),
        newChat
      })
      
      const content = await handleStreamResponse(data)
      setUseMessages(prev => [...prev,{ type: 'user', content: inputValue.trim() }, { type: 'assistant', content }])
      setNewChat(false)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    setNewChat(true)
    setMessages([
      { type: 'bot', content: '你好！我是deepseek，有什么可以帮你的吗？' }
    ])
    setUseMessages([])
    setInputValue('')
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
        onNewChat={handleNewChat}
      />
    </Card>
  )
}

export default Home 