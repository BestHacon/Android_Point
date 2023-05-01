<template>
  <div id="home-container" @mousemove="checkMouseMove()">
    <!-- <h1>home页面</h1> -->
    <div id="background">
      <div id="backgroundCanvas" :class="search ? 'search' : ''">
        <backgroundCanvas></backgroundCanvas>
      </div>
    </div>
    <div id="cover" style="opacity: 1;"></div>
    <div id="time">
      <div id="textTime">
        <loginGlowButton :text="time.hour + ':' + time.minute"></loginGlowButton>
        <!-- {{ time.hour + ':' + time.minute }} -->
      </div>
    </div>
    <div id="searchBar" :class="search ? 'search' : ''">
      <input v-model="aimStu.student_name_id" type="text" id="inputSearch" name="word" size="30"
        :placeholder="search ? '' : '请输入学号或姓名'" autocomplete="off" @focus="search = true" @blur="inputBlur()"
        @input="filterStuInfo($event)"
        @keyup.down="(nowIndex = nowIndex < optionStuData.length ? nowIndex + 1 : nowIndex), searchDivMouseEnter(nowIndex)"
        @keyup.up="(nowIndex = nowIndex > 0 ? nowIndex - 1 : nowIndex), searchDivMouseEnter(nowIndex)"
        @keyup.enter="searchEnter()">
      <div :class="'searchBarBtn ' + (search ? 'search' : '')" id="btnSearchEng" @mousedown="preventBlur($event)">
        {{ aimStu.student_name }}
      </div>
      <div :class="'searchBarBtn ' + (search ? ' search' : '')" id="btnSearch" @mousedown="preventBlur($event)"
        @click="searchOneStudentLog(aimStu.student_name_id)">
        <img src="@/assets/search.svg" alt="搜索">
      </div>
    </div>
    <div id="searchSuggestionContainer">
      <div v-for="(item, index) in optionStuData" :key="item.student_id" :class="(nowIndex === index) ? 'hover' : ''"
        @mouseenter="searchDivMouseEnter(index)" @click="searchDivClick()" @mousedown="preventBlur($event)">
        {{ item.student_name + ' | ' + item.student_id }}
      </div>
    </div>
    <div id="searchResult" style="max-width: 80%;" :class="showResult ? 'showResult' : ''"
      @mousedown="preventBlur($event)">
      <el-table id="searchResultTable" :data="logs" show-summary empty-text="暂无你的问答记录，请继续加油！(～￣▽￣)～" max-height="330px">
        <el-table-column type="index" width="100px" height="40px" />
        <el-table-column prop="date" sortable label="时间" width="150px" height="40px" />
        <el-table-column prop="content" label="内容" width="250px" height="40px" />
        <el-table-column prop="label" label="标签" width="100px" height="40px" />
        <el-table-column prop="point" label="分数" width="100px" height="40px" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { onMounted, inject, reactive } from 'vue'
import apiConfig from '@/api/apiConfig.js'
import qs from 'qs' // 引入查询参数序列化和解析库
import backgroundCanvas from '@/components/BackgroundCanvas.vue' // 背景
import loginGlowButton from '@/components/loginGlowButton.vue' // 时间按钮
import { ElMessage } from 'element-plus'

export default {
  name: 'HomeView',
  data() {
    return {
      search: false,
      showResult: false, // 展示结果
      aimStu: {
        student_name_first_word: '',
        student_name_id: '',
        student_id: '',
        student_name: ''
      },
      nowIndex: 0,
      // blurClear: true, // 所搜框失去焦点是否清空
      stuData: [], // 可选的学号序列
      optionStuData: [], // 可选的学号序列
      stuLoading: false, // 是否正在获取选项数据
      proxy: null, // 网络请求接口
      logs: [], // 答题记录
      mouseIsMoving: false, // 鼠标是否在移动
      mouseIsMovingTimer: null // 鼠标移动的计时器
    }
  },
  components: {
    backgroundCanvas
  },
  mounted() {
    // this.$refs.input.focus()

    // 获取页面数据
    // stuLoading.value = true
    document.getElementsByTagName('html')[0].className = 'dark' // 动态给html添加dark属性
    this.proxy = inject('$http') // 获取全局挂载属性
    this.proxy({
      method: 'GET',
      url: apiConfig.getAll
    }).then(result => {
      // stuLoading.value = false
      if (result.data.resCode === 200) {
        const data = result.data.message
        // console.log(data)
        this.stuData = data
      } else {
        ElMessage({
          showClose: true,
          message: '数据获取失败！',
          type: 'warning'
        })
        this.stuData = []
      }
      // stuLoading.value = false
    }, err => {
      ElMessage({
        showClose: true,
        message: err,
        type: 'warning'
      })
      ElMessage({
        showClose: true,
        message: '数据获取失败！',
        type: 'warning'
      })
    })
  },
  unmounted() {
    document.getElementsByTagName('html')[0].className = '' // 动态给html取消dark属性
  },
  methods: {
    // 点击选项框不失去焦点
    preventBlur(e) {
      e.preventDefault()
    },
    // 输入框失去焦点
    inputBlur() {
      this.showResult = false // 不展示结果
      this.search = false
      this.aimStu.student_name_id = ''
      this.aimStu.student_name = ''
      this.aimStu.student_id = ''
      this.aimStu.student_name_first_word = ''
      this.optionStuData = []
    },
    // 鼠标移进筛选区
    searchDivMouseEnter(index) {
      if (this.mouseIsMoving) {
        this.nowIndex = index
        this.aimStu.student_name = this.optionStuData[index].student_name
        this.aimStu.student_name_first_word = this.optionStuData[index].student_name[0]
        this.aimStu.student_name_id = this.optionStuData[index].student_id
      }
    },
    // 筛选目标学生信息
    filterStuInfo(e) {
      if (e.data !== null) { // 当不是在输入时
        const val = this.aimStu.student_name_id
        if (val) {
          // stuLoading.value = true
          this.optionStuData = this.stuData.filter((item) => {
            return String(item.student_id).includes(val) || String(item.student_name).includes(val)
          })
        } else {
          this.optionStuData = []
        }
        // 设置过滤后第一个学生的姓
        if (this.optionStuData.length) {
          this.aimStu.student_name = this.optionStuData[0].student_name
          this.aimStu.student_name_first_word = this.optionStuData[0].student_name[0]
        } else { // 没有搜索到
          this.aimStu.student_name_first_word = ''
          this.aimStu.student_name = ''
        }
      } else {
        this.nowIndex = 0
        this.showResult = false // 注意删除输入框内容时，也不用展示数据
      }
      // stuLoading.value = false
      // console.log(this.optionStuData)
    },
    // 搜索框回车事件
    searchEnter() {
      if (this.optionStuData.length > 0) {
        this.aimStu.student_id = this.optionStuData[this.nowIndex].student_id
        this.aimStu.student_name_id = this.aimStu.student_id
        this.aimStu.student_name = this.optionStuData[this.nowIndex].student_name
        this.aimStu.student_name_first_word = this.aimStu.student_name[0]
        this.nowIndex = 0
        this.optionStuData = []
      }
      // 进行搜索
      this.searchOneStudentLog(this.aimStu.student_name_id)
    },
    // 选项点击事件
    searchDivClick() {
      this.searchEnter()
    },
    // 搜索
    searchOneStudentLog(stuID) {
      this.proxy({
        method: 'POST',
        url: apiConfig.getLogs,
        data: qs.stringify({ student_id: stuID })
      }).then(result => {
        // stuLoading.value = false
        if (result.data.resCode === 200) {
          const data = result.data.message
          this.logs = data
          // console.log(data)
        } else {
          this.logs = []
        }
        this.showResult = true
      })
    },
    // 检测鼠标是否移动
    checkMouseMove() {
      this.mouseIsMoving = true
      if (this.mouseIsMovingTimer) {
        clearTimeout(this.mouseIsMovingTimer)
      }
      // console.log(this.mouseIsMoving)
      this.mouseIsMovingTimer = setTimeout(() => {
        this.mouseIsMoving = false
        // console.log(this.mouseIsMoving)
      }, 200)
    }
  }
}
</script>

 <!-- setup 语法糖 -->
<script setup>

const time = reactive({
  hour: '',
  minute: ''
})
// 钩子函数，当页面元素已创建
onMounted(() => {
  // 每秒更新时间
  setInterval(() => {
    const date = new Date()// 这个now是定义在回调函数内部，作用域只有回调函数内
    time.hour = date.getHours()
    if (time.hour < 10) {
      time.hour = '0' + time.hour
    }
    time.minute = date.getMinutes()
    if (time.minute < 10) {
      time.minute = '0' + time.minute
    }
  }, 1000)
})
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  // outline: 0;
  box-sizing: border-box;
}

#home-container {
  --body-top: 0px;
  --txt-b-pure: black;
}

#home-container {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hiden;

  #background {
    z-index: 15;
    width: 100%;
    height: 100%;
    overflow: hidden;

    #backgroundCanvas {
      transition: opacity 1s, transform .25s, filter .25s;

      &.search {
        // 点击搜索框
        transform: scale(1.1);
        filter: blur(8px); // 模糊效果
      }
    }
  }

  // 遮罩层
  #cover {
    z-index: 19;
    opacity: 0;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, .5) 100%), radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, .3) 166%);
    transition: .25s;
  }

  // 时间
  #time {
    position: absolute;
    top: calc(var(--body-top) + 105px);
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: .25s;
    z-index: 20; // background的z-index最高是15

    &:hover {
      transform: translateX(-50%) scale(1.05)
    }

    #textTime {
      max-width: 300px;
      color: #fff;
      font-weight: 400;
      font-size: 42px;
      text-shadow: 0 0 20px rgba(0, 0, 0, .35);
      white-space: nowrap;
      text-overflow: ellipsis;
      animation: delayedFadeIn 2s;
      // transition: .25s;

    }
  }

  // 搜索栏
  #searchBar {
    animation: delayedFadeIn 1s;
    z-index: 20;
    position: absolute;
    top: 200px;
    left: 50%;
    transform: translateX(-50%);
    width: 230px;
    max-width: 80%;
    height: 43px;
    border-radius: 30px;
    color: #fff;
    background-color: rgba(255, 255, 255, .25);
    box-shadow: rgba(0, 0, 0, .2) 0 0 10px;
    backdrop-filter: blur(10px) saturate(1.5);
    overflow: hidden;
    transition: color .25s, background-color .25s, box-shadow .25s, left .25s, opacity .25s, top .25s, width .25s;

    &:hover {
      color: var(--txt-b-pure);
      background-color: rgba(255, 255, 255, .6);
      box-shadow: rgba(0, 0, 0, .3) 0 0 10px;
      width: 530px;
    }

    &.search {
      color: #000;
      background-color: rgba(255, 255, 255, .9);
      box-shadow: rgba(0, 0, 0, .2) 0 0 10px;
      width: 530px;
    }

    #inputSearch {
      outline: 0;
      border: none;
      width: 100%;
      height: 100%;
      padding: 0 20px;
      color: #000;
      background-color: transparent;
      font-size: 14px;
      text-align: center;

      &::placeholder {
        color: #fff;
      }

      &:hover::placeholder {
        color: #000;
      }

    }

    // 搜索框左右图标通用样式
    .searchBarBtn {
      opacity: 0;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: start;
      position: absolute;
      top: 5px;
      width: 33px;
      height: 33px;
      border-radius: 16.5px;
      cursor: pointer;
      transition: .15s;
      white-space: nowrap;
      overflow: hidden;
      padding: 0px 11px;
      letter-spacing: 5px;

      &.search {
        opacity: 1;
        pointer-events: unset;
      }
    }

    // 左图标样式
    #btnSearchEng {
      font-family: 'Times New Roman', Times, serif;
      left: 5px;
      color: rgba(0, 0, 0, .9);

      &:hover {
        letter-spacing: 0px;
        width: unset;
        min-width: 33px;
        background-color: #fff;
      }
    }

    // 右图标样式
    #btnSearch {
      right: 5px;
      display: flex;
      justify-content: center;
      align-content: center;

      // color: #70C000;
      img {
        height: 18px;
        width: 18px;
        transition: 0.25s;
      }

      &:hover {
        background-color: #fff;
        border-radius: 50%;

        & img {
          transform: scale(1.1);
        }
      }
    }
  }

  // 搜索内容
  #searchSuggestionContainer {
    display: block;
    z-index: 25;
    position: absolute;
    top: 255px;
    left: 50%;
    transform: translateX(-50%);
    width: 530px;
    // max-width: 80%;
    height: auto;
    max-height: 330px;
    font-size: small;
    overflow-x: hidden;
    border-radius: 15px;
    transition: .25s;
    max-width: 80%;
    -webkit-backdrop-filter: blur(30px) saturate(1.25);
    backdrop-filter: blur(30px) saturate(1.25);

    div {
      // display: -webkit-box;
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      clear: both;
      height: 30px;
      padding-right: 10px;
      text-indent: 20px;
      line-height: 30px;
      cursor: pointer;
      background: rgba(125, 125, 125, 0.5);
      color: rgba(255, 255, 255, .85);
      transition: .25s cubic-bezier(0.65, 0.05, 0.1, 1);

      &.hover {
        background: rgba(125, 125, 125, 0.8);
        color: rgba(255, 255, 255);
        padding-left: 10px;
      }
    }

    // 滚动条样式
    &::-webkit-scrollbar {
      // background: rgba(0, 0, 0, .3);
      // width: 10px;
      // display: unset;
      display: none;
    }

    // 滚动条角落样式
    &::-webkit-scrollbar-corner {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: gray;
      border-radius: 5px;
    }
  }

  // 搜索结果框
  #searchResult {
    display: none;
    z-index: 25;
    position: absolute;
    top: 255px;
    left: 50%;
    transform: translateX(-50%);
    // width: 530px;
    // height: auto;
    // max-height: 330px;
    backdrop-filter: blur(30px) saturate(1.25);
    -webkit-backdrop-filter: blur(30px) saturate(1.25);
    background: rgba(125, 125, 125, 0.3);
    // background-color: #70C000;

    &.showResult {
      display: flex;
    }

    #searchResultTable {
      --el-table-header-bg-color: rgba(79, 79, 79, 0.7);
      --el-table-row-hover-bg-color: rgba(125, 125, 125, 0.5);
      --el-table-header-text-color: #fff;
      --el-text-color-secondary: #fff;
      --el-table-text-color: #fff;
      cursor: default;
    }
  }
}

@media screen and (max-width: 600px) {
  #home-container {

    #time {
      top: calc(var(--body-top) + 80px);
    }

    #searchBar {
      top: 175px;

    }

    #searchSuggestionContainer {
      top: 230px;
    }
  }
}

@keyframes delayedFadeIn {
  0% {
    opacity: 0
  }

  50% {
    opacity: 0
  }

  100% {
    opacity: 1
  }
}

// 大小的反复弹跳，用于时间
@keyframes rebound {
  0% {
    transform: translateX(-50%) scale(.8)
  }

  20% {
    transform: translateX(-50%) scale(1.2)
  }

  40% {
    transform: translateX(-50%) scale(.9)
  }

  60% {
    transform: translateX(-50%) scale(1.1)
  }

  80% {
    transform: translateX(-50%) scale(.95)
  }
}
</style>
