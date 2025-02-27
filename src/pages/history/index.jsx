import React, { useEffect, useState } from "react"
import { List, Card, Typography, message, Skeleton, Divider } from "antd"
import { chatAPI } from "@/services/api"
import "./style.css"
import InfiniteScroll from "react-infinite-scroll-component"
const { Title } = Typography

const History = () => {
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(5000000)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true)
      const res = await chatAPI.getHistory({
        userId: localStorage.getItem("userId"),
        page,
      })
      setChats((val) => {
        return [...val, ...res.data.chats]
      })
      setTotal(res.data.pagination.total)
      setPage((val) => {
        return val + 1
      })
    } catch (error) {
      console.log("Fetch history error:", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (title) => {
    try {
      await navigator.clipboard.writeText(title)
      message.success("已复制到剪贴板")
    } catch (err) {
      // 降级处理：如果 clipboard API 不可用
      const textArea = document.createElement("textarea")
      textArea.value = title
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        message.success("已复制到剪贴板")
      } catch (err) {
        message.error("复制失败")
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <Card className="history-card">
      <Title level={4} className="history-title">
        对话历史
      </Title>
      <div
        id="scrollableDiv"
        style={{
          height: 700,
          overflow: "auto",
          padding: "0 16px",
        }}
      >
        <InfiniteScroll dataLength={chats.length} next={fetchHistory} hasMore={chats.length < total} loader={loading&&<Skeleton paragraph={{ rows: 1 }} active />} endMessage={<Divider plain>没有更多了！</Divider>} scrollableTarget="scrollableDiv">
          <List
            className="history-list"
            dataSource={chats}
            locale={{ emptyText: "暂无数据" }}
            renderItem={(chat) => (
              <List.Item className="history-item" onClick={() => handleCopy(chat.title)}>
                <div className="history-item-content">{chat.title}</div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </Card>
  )
}

export default History
