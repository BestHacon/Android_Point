<template>
  <div id="login-container">
    <div class="login-box">
      <div :class="'owl ' + (enterPassword ? 'password' : '')" id="owl">
        <div class="hand"></div>
        <div class="hand hand-r"></div>
        <div class="arms">
          <div class="arm"></div>
          <div class="arm arm-r"></div>
        </div>
      </div>
      <div class="input-box">
        <!-- <form ref="userForm" class="input-box" @submit.prevent="submitForm($event)"> -->
        <input ref="accountInput" v-model="account" type="text" placeholder="账号">
        <input v-model="password" type="password" placeholder="密码" id="password" @focus="enterPassword = true"
          @blur="enterPassword = false" @keyup.enter="loginButton()">
        <button @click="loginButton()">登录</button>
        <!-- <input type="submit" ref="loginSubmit" style="display: none" /> -->
        <!-- </form> -->
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'
import apiConfig from '@/api/apiConfig.js'
import qs from 'qs' // 引入查询参数序列化和解析库
import { ElMessage, ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  data() {
    return {
      enterPassword: false, // 是否输入密码
      account: null, // 账号
      password: null // 密码
    }
  },
  mounted() {
    this.proxy = inject('$http') // 获取全局挂载属性
    this.router = useRouter()
    this.$refs.accountInput.focus()
  },
  methods: {
    // 登录事件
    loginButton() { // 登录按钮
      if (!this.account) { // 如果账号为空
        ElMessage({
          showClose: true,
          message: '请输入账号',
          type: 'warning'
        })
      } else if (!this.password) { // 如果密码为空
        ElMessage({
          showClose: true,
          message: '请输入密码',
          type: 'warning'
        })
      } else {
        const userData = qs.stringify({ account: this.account, password: this.password })
        this.proxy({
          method: 'POST',
          url: apiConfig.userLogin,
          data: userData
        }).then(result => {
          const data = result.data
          if (data.resCode === 200) {
            ElNotification({
              title: '成功',
              message: '登录成功，即将跳转到后台管理页面',
              type: 'success'
            })
            // 登录功能，保存token
            const oldToken = localStorage.getItem('token') // 清除旧 token
            if (oldToken) {
              localStorage.removeItem('token')
            }
            localStorage.setItem('token', data.token)
            setTimeout(() => {
              this.router.push('adminn')
            }, 1000)
          } else {
            this.password = ''
            ElMessage({
              showClose: true,
              message: data.message,
              type: 'error'
            })
          }
        }, err => {
          ElMessage({
            showClose: true,
            message: err,
            type: 'error'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
* {
  /* 初始化 */
  margin: 0;
  padding: 0;
}

#login-container {
  /* 100%窗口高度 */
  height: 100vh;
  /* 弹性布局 居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  /* 渐变背景 */
  background: linear-gradient(200deg, #72afd3, #96fbc4);
}

.login-box {
  /* 相对定位 */
  position: relative;
  width: 320px;
}

.input-box {
  /* 弹性布局 垂直排列 */
  display: flex;
  flex-direction: column;
}

.input-box input {
  height: 40px;
  border-radius: 3px;
  /* 缩进15像素 */
  text-indent: 15px;
  outline: none;
  border: none;
  margin-bottom: 15px;
}

.input-box input:focus {
  outline: 1px solid lightseagreen;
}

.input-box button {
  border: none;
  height: 45px;
  background-color: lightseagreen;
  color: #fff;
  border-radius: 3px;
  cursor: pointer;
}

/* 接下来是猫头鹰的样式 */
.owl {
  width: 211px;
  height: 108px;
  /* 背景图片 */
  background: url("@/assets/owl-login.png") no-repeat;
  /* 绝对定位 */
  position: absolute;
  top: -100px;
  /* 水平居中 */
  left: 50%;
  transform: translateX(-50%);
}

.owl .hand {
  width: 34px;
  height: 34px;
  border-radius: 40px;
  background-color: #472d20;
  /* 绝对定位 */
  position: absolute;
  left: 12px;
  bottom: -8px;
  /* 沿Y轴缩放0.6倍（压扁） */
  transform: scaleY(0.6);
  /* 动画过渡 */
  transition: 0.3s ease-out;
}

.owl .hand.hand-r {
  left: 170px;
}

.owl.password .hand {
  transform: translateX(42px) translateY(-15px) scale(0.7);
}

.owl.password .hand.hand-r {
  transform: translateX(-42px) translateY(-15px) scale(0.7);
}

.owl .arms {
  position: absolute;
  top: 58px;
  width: 100%;
  height: 41px;
  overflow: hidden;
}

.owl .arms .arm {
  width: 40px;
  height: 65px;
  position: absolute;
  left: 20px;
  top: 40px;
  background: url("@/assets/owl-login-arm.png") no-repeat;
  transform: rotate(-20deg);
  transition: 0.3s ease-out;
}

.owl .arms .arm.arm-r {
  transform: rotate(20deg) scaleX(-1);
  left: 158px;
}

.owl.password .arms .arm {
  transform: translateY(-40px) translateX(40px);
}

.owl.password .arms .arm.arm-r {
  transform: translateY(-40px) translateX(-40px) scaleX(-1);
}
</style>
