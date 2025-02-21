import React from 'react'
import { Breadcrumb } from 'antd'
import { useLocation, Link } from 'react-router-dom'

const breadcrumbNameMap = {
  '/ai': '首页',
  '/ai/chat': '新对话',
  '/ai/history': '历史记录',
  '/ai/settings': '设置',
  '/ai/insufficient': '余额查询',
  '/ai/video': '视频对话',
  '/ai/tasks': '任务列表'
}

const AppBreadcrumb = () => {
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter(i => i)
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    return {
      key: url,
      title: <Link to={url}>{breadcrumbNameMap[url]}</Link>
    }
  })

  const breadcrumbItems = [
  ].concat(extraBreadcrumbItems)
  return <Breadcrumb items={breadcrumbItems} />
}

export default AppBreadcrumb 