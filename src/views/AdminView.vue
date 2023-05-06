<template>
  <div id="admin-container">
    <!-- <h1>管理员界面</h1> -->
    <el-menu :default-active="activeIndex" id="el-menu-logs" mode="horizontal" :ellipsis="false" @select="handleSelect">
      <el-menu-item index="0">
        <template #title>
          <div class="logo">
            <img src="@/assets/search_logo.svg" @click="toHome()" />
            <router-link to="/" id="logoWord">Android Point</router-link>
          </div>
        </template>
      </el-menu-item>
      <div class="flex-grow" id="flex-grow1"></div>
      <el-menu-item index="1" @click="toAddLogs()">
        <template #title>
          <div id="addLogs">
            <router-link to="/adminn/addlogs">添加</router-link>
          </div>
        </template>
      </el-menu-item>
      <el-menu-item index="2" @click="toCheckLogs()">
        <template #title>
          <div id="checkLogs">
            <router-link to="/adminn/checklogs">查询</router-link>
          </div>
        </template>
      </el-menu-item>
      <div class="flex-grow"></div>
      <el-menu-item index="3" style="opacity: 0;" id="opecity"> <!-- 用于对齐 -->
        <template #title>
          <div class="logo">
            <router-link to="/">Android Point</router-link>
          </div>
        </template>
      </el-menu-item>
    </el-menu>
    <div id="main-container">
      <router-view></router-view> <!--子路由会默认在router-view中显示 -->
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'
// import { ElMessage } from 'element-plus'
import apiConfig from '@/api/apiConfig.js'
// import qs from 'qs' // 引入查询参数序列化和解析库
export default {
  data() {
    return {
      proxy: null, // 全局挂载axios
      activeIndex: '1' //  页面加载时默认激活菜单的 index
    }
  },
  created() {
    const path = this.$route.path // 获取当前路径，注意是route不是router
    if (path === '/adminn/addlogs') {
      this.activeIndex = '1'
    } else {
      this.activeIndex = '2'
    }
  },
  mounted() {
    this.proxy = inject('$http') // 获取全局挂载属性
    // 检测是否登录且身份验证有效，没登陆则由全局代理自动跳到login
    this.proxy({
      method: 'GET',
      url: apiConfig.isLogin
    })
    // console.log(this.$route.path) // 获取当前路径，注意是route不是router
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
    },
    // 回到主页
    toHome() {
      this.$router.push('/home')
    },
    // 跳转到分数添加页面
    toAddLogs() {
      this.$router.push('/adminn/addlogs')
    },
    // 跳转到分数查看页面
    toCheckLogs() {
      this.$router.push('/adminn/checklogs')
    }
  }
}
</script>

<style lang="scss" scoped>
$logoImgWidth: 40px;

#admin-container {
  box-sizing: border-box;
  font-family: 'Open Sans', sans-serif;
  height: 100vh;
  // background-image: url(@/assets/home-bg4.jpg);
  background-repeat: no-repeat;
  background-size: cover;

  #main-container {
    height: calc(100vh - 70px);
  }
}

li {
  list-style: none;
}

a {
  text-decoration: none;
  // color: #fff;

}

#el-menu-logs {
  background-color: transparent;
    backdrop-filter: blur(200px) saturate(1.5);
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      padding: 0px 10px 0px 0px;
      // height: 30px;
      width: $logoImgWidth;
      height: 56px;
    }
  }

  .flex-grow {
    flex-grow: 1;
  }

  #opecity {
    cursor: default;
    margin-right: $logoImgWidth;

    &.logo {
      cursor: default;
    }

    a {
      cursor: default;
    }
  }

  @media screen and (max-width: 450px) {
    #opecity {
      display: none;
    }
  }

  @media screen and (max-width: 320px) {
    #flex-grow1 {
      display: none;
    }

    #logo {
      height: 100%;
    }

    #logoWord {
      display: none;
    }
  }
}
</style>
