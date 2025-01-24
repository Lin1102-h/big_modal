import { request } from '../utils/request'

// 通用GET请求
export const get = (url, params, options = {}) => {
  return request({
    url,
    method: 'get',
    params
  }, { useCache: true, ...options })
}

// 通用POST请求
export const post = (url, data, options = {}) => {
  return request({
    url,
    method: 'post',
    data
  }, { retry: true, ...options })
}

// AI聊天相关API
export const chatAPI = {
  // 发送消息（使用队列和重试）
  sendMessage: (message) => {
    return post('/api/chat/send', { message }, {
      useQueue: true,
      retry: true,
      retries: 2
    })
  },
  
  // 获取历史记录（使用缓存）
  getHistory: (params) => {
    return get('/api/chat/history', params, {
      useCache: true,
      cacheTime: 30000 // 30秒缓存
    })
  },
  
  // 创建新对话（使用重试）
  createChat: () => {
    return post('/api/chat/create', null, {
      retry: true
    })
  },

  // 清除历史记录缓存
  clearHistoryCache: () => {
    const cacheKey = '/api/chat/history'
    cache.delete(cacheKey)
  }
}

// 用户相关API
export const userAPI = {
  // 登录（使用重试）
  login: (data) => {
    return post('/api/user/login', data, {
      retry: true,
      retries: 3
    })
  },
  
  // 获取用户信息（使用缓存）
  getUserInfo: () => {
    return get('/api/user/info', null, {
      useCache: true,
      cacheTime: 5 * 60 * 1000 // 5分钟缓存
    })
  }
} 