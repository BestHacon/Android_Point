import axios from 'axios'
import router from '@/router/index.js'

// 配置 axios
// 在axios的请求拦截器中携带tooken进行请求
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  } else {
    config.headers.Authorization = null
  }
  return config
})
// 设置token的回复拦截器，对回执码错误的进行操作处理
axios.interceptors.response.use(res => {
  // debugger
  // console.log('11', res)
  if (res.data.resCode === 401) {
    router.replace('/login')
    localStorage.removeItem('token')
  }
  return res
})

export default axios
