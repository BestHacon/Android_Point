<template>
  <div id="home-container">
    <!-- <h1>home页面</h1> -->
    <div id="select">
      <el-select v-model="aimStu.student_name_id" clearable remote filterable placeholder="请输入姓名或学号" :remote-method="remoteMethod"
        :loading="stuLoading" @change="getOneStuInfo($event)">
        <template v-slot:prefix>
          <span class='prefixSlot'>{{ aimStu.student_name }}</span>
        </template>
        <!-- <template v-slot:empty >
          <span class = 'emptySlot'>无数据</span>
        </template> -->
        <div class="optionHeader">
          <span style="float: left">姓名</span>
          <span style="float: left;">学号</span>
        </div>
        <el-option v-for="item in optionStuData" :key="item.student_id" :label="item.student_id"
          :value="item.student_name + ' ' + item.student_id">
          <div id="elSpan">
            <span style="float: left">{{ item.student_name }}</span>
            <span style="float: left">{{ item.student_id }}</span>
          </div>
        </el-option>
      </el-select>

    </div>
  </div>
</template>stuData

<script>
import { onMounted, getCurrentInstance, ref, reactive } from 'vue'
import apiConfig from '@/api/apiConfig.js'
// import qs from 'qs' // 引入查询参数序列化和解析库
export default {
  name: 'HomeView'
}
</script>

 <!-- setup 语法糖 -->
<script setup>
const { proxy } = getCurrentInstance() // 获取全局挂载属性
// console.log(axios)
const aimStu = reactive({
  student_name_id: '',
  student_id: '',
  student_name: ''
})
const stuData = ref([]) // 可选的学号序列
const optionStuData = ref([]) // 可选的学号序列
const stuLoading = ref(false) // 是否正在获取选项数据

onMounted(() => {
  stuLoading.value = true
  proxy.$http({
    method: 'GET',
    url: apiConfig.getAll
  }).then(result => {
    stuLoading.value = false
    if (result.data.resCode === 200) {
      const data = result.data.message
      // console.log(data)
      stuData.value = data
    } else {
      stuData.value = []
    }
    stuLoading.value = false
  })
})
const getOneStuInfo = (val) => {
  console.log(val)
  val = val.split(' ')
  aimStu.student_name = val[0]
  aimStu.student_id = val[1]
}

const remoteMethod = (val) => {
  if (val) {
    stuLoading.value = true
    optionStuData.value = stuData.value.filter((item) => {
      return String(item.student_id).includes(val) || String(item.student_name).includes(val)
    })
  } else {
    optionStuData.value = []
  }
  stuLoading.value = false
}

// // 处理表单选择变化事件
// const handlerChangeStuID = (val) => {
//   for (const i in querystuData.value) {
//     if (querystuData.value[i].student_id === aimStu.student_id) {
//       aimStu.student_name = querystuData.value[i].student_name
//     }
//   }
// }

// const handlerChangeStuName = (val) => {

// }
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-container {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

.el-select-dropdown__item #elSpan {
  display: flex;
  justify-content: space-around;
}

.optionHeader {
  display: flex;
  padding: 0 32px 0 20px;

  span {
    color: #599ef9;
    font-size: 14px;
    font-weight: 900;
    width: 100px;
    height: 34px;
    text-align: center;
    line-height: 34px;
    cursor: default;
  }
}
</style>
