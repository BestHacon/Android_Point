const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({ // defineConfig 为帮手函数
  transpileDependencies: true,
  productionSourceMap: false, // 生成环境不需要 map
  // 支持本地 file 协议打开
  publicPath: './',
  // 配置初始网页名
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Android 分数记录'
      return args
    })
  }
})
