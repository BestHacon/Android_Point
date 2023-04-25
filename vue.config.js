const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({ // defineConfig 为帮手函数
  transpileDependencies: true,
  productionSourceMap: false, // 生成环境不需要 map
  // 支持本地 file 协议打开
  publicPath: './'
})
