<template>
  <div id="checkLogs-container">
    <!-- <h1>查询</h1> -->
    <div id="allLogs">
      <div id="allLogsContainer">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2 ref="stuTable" :columns="columns" :data="allStuLogs" :width="width" :height="height" fixed
              v-model:sort-state="sortState" @column-sort="onSort" />
          </template>
        </el-auto-resizer>
      </div>
    </div>
    <div id="export">

      <!-- <download-excel  :data="allStuLogs" :fields="originColumns" :header="tittle" name="AndroidPoint.xls"> -->
      <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
      <!-- <el-button type="primary">数据导出</el-button> -->
      <!-- </download-excel> -->
      <el-button type="primary" @click="dataExport()">汇总数据导出</el-button>
      <el-button type="warning" @click="queryAllStuLogs()" :loading="updateLoading">刷新</el-button>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'
// import { toRaw } from '@vue/reactivity'
import * as xlsx from 'xlsx'
import qs from 'qs' // 引入查询参数序列化和解析库
import apiConfig from '@/api/apiConfig.js'
import { TableV2SortOrder, ElNotification } from 'element-plus'

export default {
  data() {
    return {
      tittle: '学生问答记录表',
      updateLoading: false, // 更新数据加载
      allStuLogs: [], // 所有学生的回答记录
      originDataColumns: ['log_id', 'student_id', 'student_name', 'date', 'content', 'label', 'point'], // 展示的顺序
      originDataheaderDisplay: { // 展示的名称
        log_id: 'ID',
        student_id: '学号',
        student_name: '姓名',
        date: '日期',
        content: '内容',
        label: '标签',
        point: '分数'
      },
      classDataColumns: ['grade_class', 'student_id', 'student_name', 'point', 'valid_point'], // 展示的顺序
      classDataheaderDisplay: { // 展示的名称
        grade_class: '班级',
        student_id: '学号',
        student_name: '姓名',
        point: '总分',
        valid_point: '有效分数'
      },
      columns: [ // 表格的表头
        {
          key: 'log_id',
          dataKey: 'log_id',
          title: 'ID',
          width: 50,
          sortable: true
        },
        {
          key: 'student_id',
          dataKey: 'student_id',
          title: '学号',
          width: 150,
          sortable: true
        },
        {
          key: 'student_name',
          dataKey: 'student_name',
          title: '姓名',
          width: 80
        },
        {
          key: 'date',
          dataKey: 'date',
          title: '日期',
          width: 150,
          sortable: true
        },
        {
          key: 'content',
          dataKey: 'content',
          title: '内容',
          width: 150
        },
        {
          key: 'label',
          dataKey: 'label',
          title: '标签',
          width: 80,
          sortable: true
        },
        {
          key: 'point',
          dataKey: 'point',
          title: '分数',
          width: 80,
          sortable: true
        }
      ],
      // 当前排序的状态
      sortState: {
        log_id: TableV2SortOrder.ASC,
        student_id: TableV2SortOrder.ASC,
        date: TableV2SortOrder.ASC,
        label: TableV2SortOrder.ASC,
        point: TableV2SortOrder.ASC
      },
      grade: 2021, // 取2021级的所有学生的数据
      classes: [], // 班级数据数据
      allStudentinClass: [] // 所有班级每位同学的数据
    }
  },
  mounted() {
    this.proxy = inject('$http') // 获取全局挂载属性
    // 检测是否登录且身份验证有效，没登陆则由全局代理自动跳到login
    this.proxy({
      method: 'GET',
      url: apiConfig.isLogin
    })
    this.queryAllStuLogs()
    // const columns = this.generateColumns(10)
    // console.log(columns)
    // const data = this.generateData(columns, 1000)
    // console.log(data)
  },
  // component: {
  //   DownloadExcel: JsonExcel
  // },
  methods: {
    queryAllStuLogs() { // 获取所有学生的回答记录
      const t = setTimeout(() => { // 延时开启加载图标，防止抖动
        this.updateLoading = true
      }, 500)
      this.proxy({
        method: 'GET',
        url: apiConfig.allStuLogs
      }).then(result => {
        if (result.data.resCode === 200) {
          const data = result.data.message
          // console.log(data)
          this.allStuLogs = data
          // ElMessage({
          //   showClose: true,
          //   message: '数据获取成功！',
          //   type: 'success'
          // })
          ElNotification({
            title: '成功',
            message: '获取数据成功！',
            type: 'success'
          })
        } else {
          // console.log(result.data)
          ElNotification({
            title: '服务器错误',
            message: '数据获取失败！' + result.data.message,
            type: 'error'
          })
          this.allStuLogs = []
        }
        // 关闭加载图标
        this.updateLoading = false
        clearTimeout(t)
      }, err => {
        ElNotification({
          title: '出错了！',
          message: '数据获取失败！' + err,
          type: 'error'
        })
        this.allStuLogs = []
        // 关闭加载图标
        this.updateLoading = false
        clearTimeout(t)
      })
    },
    // 构造表头数据
    generateColumns(length = 10, prefix = 'column-', props) {
      return Array.from({ length }).map((_, columnIndex) => ({
        ...props,
        key: `${prefix}${columnIndex}`,
        dataKey: `${prefix}${columnIndex}`,
        title: `Column ${columnIndex}`,
        width: 150
      }))
    },
    // 构造主体数据
    generateData(columns, length = 200, prefix = 'row-') {
      return Array.from({ length }).map((_, rowIndex) => {
        return columns.reduce(
          (rowData, column, columnIndex) => {
            rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
            return rowData
          },
          {
            id: `${prefix}${rowIndex}`,
            parentId: null
          }
        )
      })
    },
    // 多列排序函数
    onSort({ key, order }) {
      // console.log(key, order)
      this.sortState[key] = order
      if (this.sortState[key] === 'asc') {
        this.allStuLogs.sort((a, b) => {
          if (isNaN(a[key])) { // 如果为字符串类型
            return a[key].localeCompare(b[key])
          } else { // 如果为数字类型
            return a[key] - b[key]
          }
        })
      } else {
        this.allStuLogs.sort((a, b) => {
          if (isNaN(a[key])) { // 如果为字符串类型
            return b[key].localeCompare(a[key])
          } else { // 如果为数字类型
            return b[key] - a[key]
          }
        })
      }
      // this.allStuLogs = this.allStuLogs.reverse()
    },
    // 获取班级数据
    async getGradeAllClasses(grade) {
      await this.proxy({
        method: 'POST',
        url: apiConfig.getGradeAllClasses,
        data: qs.stringify({ grade: grade })
      }).then(result => {
        if (result.data.resCode === 200) {
          const data = result.data.message
          this.classes = data
          this.getClassAllStudent(grade)
          // console.log(data)
        } else {
          ElNotification({
            title: '服务器错误',
            message: '班级数据获取失败！' + result.data.message,
            type: 'error'
          })
          this.classes = []
        }
      }, err => {
        ElNotification({
          title: '出错了',
          message: '班级数据获取失败！' + err,
          type: 'error'
        })
        this.classes = []
      })
    },
    // 获取每个班级每位学生的数据
    async getClassAllStudent(grade) {
      if (this.classes) {
        const _this = this
        await this.classes.forEach(element => {
          // console.log(element)
          _this.proxy({
            method: 'POST',
            url: apiConfig.getClassAllStudent,
            data: qs.stringify({ class: element.classroom_id, grade: grade, classroom_num: element.classroom_num })
          }).then(result => {
            if (result.data.resCode === 200) {
              _this.allStudentinClass.push(result.data.message)
              // console.log(_this.allStudentinClass)
              if (element === this.classes[this.classes.length - 1]) {
                this.exportExcelFile()
              }
            } else {
              ElNotification({
                title: '服务器错误',
                message: '学生数据获取失败！' + result.data.message,
                type: 'error'
              })
              _this.allStudentinClass.push([])
            }
          }, err => {
            ElNotification({
              title: '出错了',
              message: '学生数据获取失败！' + err,
              type: 'error'
            })
            _this.allStudentinClass.push([])
          })
        })
      }
    },
    // 数据导出入口函数
    dataExport() {
      this.allStudentinClass = []
      const grade = this.grade
      this.getGradeAllClasses(grade)
    },
    // 导出excel文件
    exportExcelFile(fileName = '2021级移动互联网问答计分.xlsx') {
      const originData = this.allStuLogs
      const newOriginData = [this.originDataheaderDisplay, ...originData]
      const originJsonWorkSheet = xlsx.utils.json_to_sheet(newOriginData, { header: this.originDataColumns, skipHeader: true })

      const workBook = xlsx.utils.book_new()
      for (const index in this.classes) {
        const classData = this.allStudentinClass[index]
        const newClassData = [this.classDataheaderDisplay, ...classData]
        const classJsonWorkSheet = xlsx.utils.json_to_sheet(newClassData, { header: this.classDataColumns, skipHeader: true })
        xlsx.utils.book_append_sheet(workBook, classJsonWorkSheet, '' + this.classes[index].classroom_num + '班')
      }
      xlsx.utils.book_append_sheet(workBook, originJsonWorkSheet, '原始数据')
      // const workBook = {
      //   SheetNames: [...classSheetNames, '原始数据'],
      //   Sheets: {
      //     classSheet,
      //     原始数据: originJsonWorkSheet
      //   }
      // }

      return xlsx.writeFile(workBook, fileName)
    }
  }
}
</script>

<style lang="scss" scoped>
#checkLogs-container {
  height: 100%;

  // display: flex;
  // justify-content: center;
  // align-items: center;
  #allLogs {
    max-width: 800px;
    width: 90%;
    padding: 10px 30px 20px 30px;
    margin: 0px auto;
    margin-top: 10px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, .2) 0 0 10px;

    #allLogsContainer {
      height: 500px;
      // height: calc(80% - 0px);
      // border: 1px solid gray;
      // border-radius: 15px;
      // overflow: hidden;
    }
  }

  #export {
    margin-top: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
