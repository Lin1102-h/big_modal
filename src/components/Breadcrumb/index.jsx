import React from 'react'
import { Breadcrumb } from 'antd'
import { useLocation, Link } from 'react-router-dom'

const breadcrumbNameMap = {
  '/chat': '新对话',
  '/history': '历史记录',
  '/settings': '设置'
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
    {
      title: <Link to="/">首页</Link>,
      key: 'home'
    }
  ].concat(extraBreadcrumbItems)

  return <Breadcrumb items={breadcrumbItems} />
}

export default AppBreadcrumb 