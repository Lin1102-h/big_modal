import { request } from '../utils/request'

// 通用GET请求
export const get = (url, params) => {
  return request({
    url,
    method: 'get',
    params
  })
}

// 通用POST请求
export const post = (url, data) => {
  return request({
    url,
    method: 'post',
    data,
  })
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
    return get('/api/chat/history', params)
  },

  // 创建新对话（使用重试）
  createChat: () => {
    return post('/api/chat/create', null)
  },

  // 查询余额
  searchBalance: () => {
    return get('/api/chat/balance', null,)
  }
}

// 用户相关API
export const userAPI = {
  // 登录（使用重试）
  login: (data) => {
    return post('/api/user/login', data)
  },

  // 获取用户信息（使用缓存）
  getUserInfo: () => {
    return get('/api/user/info', null)
  },

  // 注册
  register: (data) => {
    return post('/api/user/register', data)
  }
} 