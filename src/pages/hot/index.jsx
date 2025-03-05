import React, { useEffect, useState } from "react"
import { Table, Card, Spin, Tag, Tooltip,Image } from "antd"
import { FireOutlined, RiseOutlined, NumberOutlined } from "@ant-design/icons"
import { hotAPI } from "../../services/api"
import { useNavigate } from 'react-router-dom'


import "./style.css"

const HotSearch = () => {
  const [loading, setLoading] = useState(true)
  const [hotData, setHotData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchHotData()
  }, [])

  const fetchHotData = async () => {
    try {
      // 这里替换为你的实际接口
      const {data} = await hotAPI.getHotData()
      setHotData(data.data.realtime)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch hot search data:", error)
      setLoading(false)
    }
  }


  const handleWordClick = async (word) => {
    const content = `请根据最新微博热点【${word}】，及其讨论内容，生成一个微信公众号文章，并附有图片，能够引起读者讨论。图片为HTML格式。`
    navigate('/ai/chat', { state: { keyWord: content } })
  }

  const columns = [
    {
      title: "排名",
      dataIndex: "rank",
      key: "rank",
      width: 80,
      render: (rank,record,index) => (
        <div className="rank-cell">
          {rank < 3 ? (
            <Tag color={rank === 0 ? "red" : rank === 1 ? "orange" : "yellow"} className="rank-tag">
              {index + 1}
            </Tag>
          ) : (
            <Tag className="rank-tag">{index + 1}</Tag>
          )}
        </div>
      ),
    },
    {
      title: "热搜内容",
      dataIndex: "word",
      key: "word",
      render: (text, record) => (
        <div className="title-cell" onClick={() => handleWordClick(text)}>
          <a  >
            {text}
          </a>
          {record.isHot && (
            <Tooltip title="热门">
              <FireOutlined className="hot-icon" />
            </Tooltip>
          )}
          {record.isNew && (
            <Tag color="green" className="new-tag">
              新
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "热度",
      dataIndex: "num",
      key: "num",
      width: 150,
      render: (num) => (
        <div className="hot-cell">
          <RiseOutlined className="hot-trend-icon" />
          <span>{num}</span>
        </div>
      ),
    },
    {
      title: "话题分类",
      dataIndex: "icon_desc",
      key: "icon_desc",
      width: 120,
      render: (text,record) => (
        <Image
              width={30}
              src={record.icon}
              preview={false}
            />
        // <Tag color="blue" className="category-tag">
        //   {icon_desc}
        // </Tag>
      ),
    },
  ]

  return (
    <div className="hot-search-container">
      <Card
        title={
          <div className="card-title">
            <FireOutlined className="title-icon" />
            <span>微博热搜榜</span>
          </div>
        }
        extra={
          <Tooltip title="实时更新">
            <NumberOutlined className="refresh-icon" onClick={fetchHotData} />
          </Tooltip>
        }
        className="hot-search-card"
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={hotData}
            rowKey={(record) => record.word}
            pagination={false}
            scroll={{ y: window.innerHeight - 350 }}
            className="hot-search-table"
          />
        </Spin>
      </Card>
    </div>
  )
}

export default HotSearch
