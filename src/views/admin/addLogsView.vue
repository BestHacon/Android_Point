<template>
  <div id="addLogs-container">
    <!-- <h1>添加</h1> -->
    <div id="form">
      <el-form :rules="rules" ref="ruleFormRef" :model="stuForm" label-width="60px">
        <el-form-item prop="student_id" label="学号">
          <el-select v-model="stuForm.student_id" clearable remote default-first-option filterable placeholder="请输入姓名或学号"
            :remote-method="remoteMethod" :loading="stuLoading" id="stuSelect">
            <el-option v-for="item in optionStuData" :key="item.student_id" :label="item.student_id"
              :value="item.student_id">
              <div>
                <span style="float: left">{{ item.student_name }}</span>
                <span style="float: left">&nbsp;|&nbsp;</span>
                <span style="float: left">{{ item.student_id }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="date" label="时间">
          <el-col :span="11">
            <el-date-picker v-model="stuForm.date" type="date" placeholder="选择日期" style="width: 100%" />
          </el-col>
          <el-col :span="2" style="text-align: center;">
            <span>—</span>
          </el-col>
          <el-col :span="11">
            <el-time-picker v-model="stuForm.time" placeholder="选择时间" style="width: 100%" />
          </el-col>
        </el-form-item>
        <el-form-item prop="label" label="类型">
          <el-radio-group v-model="stuForm.label" @change="labelTypeChange()">
            <el-radio-button label="聊天" />
            <el-radio-button label="提问" />
            <el-radio-button label="回答" />
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="point" label="分数" @change="pointChange()">
          <el-input-number v-model="stuForm.point" :precision="1" :step="0.5" :min="0" :max="1" :value-on-clear="0" />
        </el-form-item>
        <el-form-item prop="content" label="内容">
          <el-input v-model="stuForm.content" :autosize="{ minRows: 3, maxRows: 6 }" type="textarea"
            placeholder="请输入发言内容" />
        </el-form-item>
        <el-form-item>
          <!-- 传入表单ref引用的名字 -->
          <el-button type="primary" @click="onSubmit('ruleFormRef')">添加</el-button>
          <el-button @click="resetForm('ruleFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'
// import { ElMessage } from 'element-plus'
import apiConfig from '@/api/apiConfig.js'
import { ElNotification } from 'element-plus'
import qs from 'qs' // 引入查询参数序列化和解析库
export default {
  data() {
    return {
      stuForm: { // 表单数据
        student_id: '',
        date: new Date(),
        time: new Date(),
        label: '回答',
        content: '',
        point: 1
      },
      stuData: [], // 全部学生数据
      optionStuData: [], // 可选的学号序列
      stuLoading: false, // 是否正在获取选项数据
      ruleFormRef: null, // 表单验证
      // 表单填写验证规则
      rules: {
        student_id: [
          { required: true, message: '请输入学号！', trigger: 'blur' }
        ],
        date: [
          {
            type: 'date',
            required: true,
            message: '请输入日期！',
            trigger: 'change'
          }
        ],
        time: [
          {
            type: 'date',
            required: true,
            message: '请输入时间！',
            trigger: 'change'
          }
        ],
        label: [
          {
            required: true,
            message: '请选择发言的类型！',
            trigger: 'change'
          }
        ],
        point: [
          {
            required: true,
            message: '请选择分数！',
            trigger: 'change'
          }
        ],
        content: [
          { required: true, message: '请输入发言的具体内容！', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.proxy = inject('$http') // 获取全局挂载属性
    // 检测是否登录且身份验证有效，没登陆则由全局代理自动跳到login
    this.proxy({
      method: 'GET',
      url: apiConfig.isLogin
    })
    // 获取数据
    this.proxy({
      method: 'GET',
      url: apiConfig.getAll
    }).then(result => {
      // stuLoading.value = false
      if (result.data.resCode === 200) {
        const data = result.data.message
        // console.log(data)
        this.stuData = data
        // ElNotification({
        //   title: '成功',
        //   message: '获取数据成功！',
        //   type: 'success'
        // })
      } else {
        ElNotification({
          title: '服务器错误',
          message: '数据获取失败！' + result.data.message,
          type: 'error'
        })
        this.stuData = []
      }
      // stuLoading.value = false
    }, err => {
      ElNotification({
        title: '出错了',
        message: '数据获取失败！' + err,
        type: 'error'
      })
    })
    // 设置时间为当前时间
    // const newDate = new Date()
    // this.stuForm.date = newDate
    // this.stuForm.time = newDate
  },
  methods: {
    async onSubmit(formEl) { // 表单提交，添加记录
      // console.log(formEl)
      const _this = this
      const stuForm = this.stuForm // 将this储存下来
      if (!formEl) return
      await this.$refs[formEl].validate((valid, fields) => {
        if (valid) {
          const year = stuForm.date.getFullYear()
          const month = stuForm.date.getMonth() + 1
          const day = stuForm.date.getDate()
          const hour = stuForm.time.getHours()
          const minutes = stuForm.time.getMinutes()
          const second = stuForm.time.getSeconds()
          const newDate = '' + year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + second
          // console.log(newDate)
          // 验证成功，提交删数据
          const data = qs.stringify({ student_id: stuForm.student_id, date: newDate, label: stuForm.label, content: stuForm.content, point: stuForm.point })
          // console.log(stuForm.student_id)
          this.proxy({
            method: 'POST',
            url: apiConfig.addLog,
            data: data
          }).then(result => {
            if (result.data.resCode === 200) {
              ElNotification({
                title: '成功',
                message: '成功添加数据！',
                type: 'success'
              })
              _this.cleanStuFrom('ruleFormRef')
            } else {
              ElNotification({
                title: '服务器错误',
                message: '添加数据失败！' + result.data.message,
                type: 'error'
              })
            }
          }, err => {
            ElNotification({
              title: '出错了',
              message: '数据获取失败！' + err,
              type: 'error'
            })
          })
        }
        //  else {
        //   ElNotification({
        //     title: '出错了',
        //     message: '请正确填写数据！',
        //     type: 'error'
        //   })
        // }
      })
    },
    cleanStuFrom() { // 清空按钮
      this.stuForm.student_id = ''
      // this.stuForm.date = '' // 不清空方便继续操作
      // this.stuForm.time = ''
      // this.stuForm.label = '回答'
      this.stuForm.content = ''
      // this.stuForm.point = 1
    },
    remoteMethod(val) { // 学号姓名搜索
      if (val) {
        this.stuLoading = true
        this.optionStuData = this.stuData.filter((item) => {
          return String(item.student_id).includes(val) || String(item.student_name).includes(val)
        })
      } else {
        this.optionStuData = []
      }
      this.stuLoading = false
    },
    labelTypeChange() { // 标签类型改变
      const nowType = this.stuForm.label
      if (nowType === '回答') {
        this.stuForm.point = 1
      } else if (nowType === '提问') {
        this.stuForm.point = 0.5
      } else {
        this.stuForm.point = 0
      }
    },
    pointChange() { // 分数值改变
      const nowPoint = this.stuForm.point
      // console.log(nowPoint)
      if (nowPoint === 1) {
        this.stuForm.label = '回答'
      } else if (nowPoint === 0.5) {
        this.stuForm.label = '提问'
      } else {
        this.stuForm.label = '聊天'
      }
    },
    resetForm(formEl) { // 刷新表单
      if (!formEl) return
      this.$refs[formEl].resetFields()
    }
  },
  watch: { // 监听对象变化
    'stuForm.point'(newVal, oldVal) {
      // console.log(oldVal, oldVal)
      if (newVal !== oldVal) {
        this.pointChange()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#addLogs-container {
  display: flex;
  /* 设置主轴方向 */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

  // 表单
  #form {
    // border: 1px solid gray;
    border-radius: 15px;
    margin-top: 50px;
    padding: 36px 24px 24px 24px;
    max-width: 600px;
    width: 90%;
    backdrop-filter: blur(200px) saturate(1.5);
    box-shadow: rgba(0, 0, 0, .2) 0 0 10px;

    // #stuSelect{
    //   width: 800px;
    // }
    .el-select {
      flex-grow: 1;
    }

    // .el-radio-button{
    //   display: flex;
    //   align-items: stretch;
    //   // span{
    //   //   flex-grow: 1;
    //   // }
    // }

  }
}
</style>
