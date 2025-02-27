import React, { useState, useRef } from "react"
import { Card } from "antd"
import ChatBox from "./ChatBox"
import { chatAPI } from "../services/api"
import "./style.css"
import { marked } from "marked"

const Home = () => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)
  const [newChat, setNewChat] = useState(true)
  const [useMessages, setUseMessages] = useState([])
  const streamRef = useRef({ content: "", reasoning: "" })

  // 添加消息到对话列表
  const appendMessage = (type, content) => {
    setMessages((prev) => [...prev, { type, content, [type === "bot" && "reasoning"]: "" }])
    if (type === "bot") {
      streamRef.current = { content: "", reasoning: "" }
    }
  }

  // 更新最后一条消息的内容
  const updateLastMessage = (content) => {
    setMessages((prev) => {
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
    let accumulatedReasoning = ""
    let accumulatedContent = ""

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = line.slice(6) === "[DONE]" ? null : JSON.parse(line.slice(6))
              if (!data) {
                setUseMessages((prev) => {
                  const newMessages = [...prev, { role: "user", content: inputValue.trim() }, { role: "assistant", content: accumulatedContent }]
                  return newMessages
                })
                return
              }

              // 立即更新消息
              if (data.reasoning) {
                accumulatedReasoning += data.reasoning
                setMessages((prev) => {
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  lastMessage.reasoning = marked(accumulatedReasoning)
                  return newMessages
                })
              }
              if (data.content) {
                accumulatedContent += data.content
                setMessages((prev) => {
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  lastMessage.content = marked(accumulatedContent)
                  return newMessages
                })
              }
            } catch (e) {
              console.error("Parse error:", e)
              const errorMessage = "服务器繁忙，请稍后再试。"
              updateLastMessage(errorMessage)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }

  // 处理错误情况
  const handleError = (error) => {
    console.log("Error:", error)
    const errorMessage = error.status === 402 ? "抱歉，余额不足" : "抱歉，发生错误了"
    updateLastMessage(errorMessage)
  }

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || loading) return

    try {
      setLoading(true)
      // 添加用户消息
      appendMessage("user", inputValue.trim())
      // 添加机器人消息占位
      appendMessage("bot", "")
      setInputValue("")
      const { data } = await chatAPI.sendMessage({
        message: [...useMessages, { role: "user", content: inputValue.trim() }],
        id: localStorage.getItem("userId"),
        newChat,
      })
      setLoading(false)
      await handleStreamResponse(data)
      setNewChat(false)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    setLoading(false)
    setNewChat(true)
    setMessages([])
    setUseMessages([])
    setInputValue("")
  }
  return (
    <Card
      className="chat-card"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "12px",
      }}
    >
      <ChatBox messages={messages} inputValue={inputValue} setInputValue={setInputValue} handleSend={handleSend} loading={loading} onNewChat={handleNewChat} />
    </Card>
  )
}

export default Home
