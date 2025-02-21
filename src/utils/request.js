import axios from 'axios'
import { message } from 'antd'

// 创建axios实例
const request = axios.create({
  timeout: 1000 * 60 * 60 * 24, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    if(config.headers['accept'] === 'text/event-stream') {
      config.responseType = 'stream'
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    
    const res = response.data
    
    const { responseType, transformResponse } = response.config
    if (responseType === 'stream') {
      return transformResponse ? transformResponse(response) : response
    }
    
    
    if (res.code !== 200) {
      message.log(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    return res
  },
  error => Promise.reject(error)
)


export { request } 