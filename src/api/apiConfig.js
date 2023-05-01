// 导出 API 相关接口

// const userServe = 'http://127.0.0.1:40403' // 本地接口
const userServe = 'https://api.android.hacon.top' // 服务器接口

// 服务器的地址
// 使用线上的地址
// const userServe = 'http://218.192.110.172:7030'

export default {
  // stu_id 模糊匹配
  getByStuIDFuzzy: userServe + '/request/getByStuIDFuzzy',
  // stu_name 模糊匹配
  getByStuNameFuzzy: userServe + '/request/getByStuNameFuzzy',
  // 获取全部信息
  getAll: userServe + '/request/getAll',
  // 获取全部信息
  getLogs: userServe + '/request/getLogs',
  // 登录接口
  userLogin: userServe + '/user/login',
  // 注册接口
  userSignUp: userServe + '/user/signup'
}
