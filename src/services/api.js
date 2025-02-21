import { request } from '../utils/request'
import { message as Message } from 'antd'
const info = () => {
  message.info('余额不足');
};
// 通用GET请求
export const get = (url, params, options = {}) => {
  return request({
    url,
    method: 'get',
    params
  }, { useCache: true, ...options })
}

// 通用POST请求
export const post = (url, data, options = {}, reqOptions = {}) => {
  return request({
    url,
    method: 'post',
    data,
    ...reqOptions
  }, { retry: true, ...options })
}

// AI聊天相关API
export const chatAPI = {
  // 发送消息
  sendMessage: async ({message, id, newChat}) => {
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({ message, id, newChat })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return { data: response };  // 直接返回原始 response 对象
  },

  // 发送视频消息
  sendVideoMessage: async ({message, id}) => {
    return post('/api/chat/viodeSend', {message, id})
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
  },

  // 查询余额
  searchBalance: () => {
    return get('/api/chat/balance', null, {
      useCache: true,
      cacheTime: 30000 // 30秒缓存
    })
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
  },

  // 注册
  register: (data) => {
    return post('/api/user/register', data, {
      retry: true,
      retries: 3
    })
  }
} 