// 导出 API 相关接口

const userServe = 'https://api.tuanwei.hacon.top'

// 服务器的地址
// 使用线上的地址
// const userServe = 'http://218.192.110.172:7030'

export default {
  // 检查用户名
  userCheckName: userServe + '/api/username',
  // 注册用户
  userRegister: userServe + '/api/reguser',
  // 登录接口
  userLogin: userServe + '/api/login',
  // 获取用户数据接口
  getUserInfo: userServe + '/user/userinfo'
}
