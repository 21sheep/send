<!-- 排班设置页 -->
<template>
  <div class="dashboard-container waybill-list customer-list-box">
    <el-card class="box-card">
      <!-- 添加按钮 -->
      <template>
        <div
          style="margin-bottom: 20px"
          class="steeings"
        >
          <el-button
            type="warning"
            @click="handleClick"
          >添加工作模式</el-button>
        </div>
      </template>

      <!-- 表格数据 -->
      <template>
        <el-table
          :data="historyList"
          stripe
          style="width: 100%"
        >
          <el-table-column
            fixed
            prop="id"
            label="工作模式编号"
            style="margin-left:20px;margin-right:10px"
            width="214"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            style="margin:0 10px"
            label="工作模式"
            width="212"
          >
          </el-table-column>
          <el-table-column
            prop="workPatternTypeDesc"
            style="margin:0 10px"
            label="类型"
            width="212"
          >
          </el-table-column>
          <el-table-column
            prop="workDate"
            style="margin:0 10px"
            label="工作日期"
            width="212"
          >
          </el-table-column>
          <el-table-column
            prop="workEndMinute1"
            style="margin:0 10px"
            label="工作时间"
            width="242"
          >
            <template v-slot="{row}">{{ row.workEndMinute1 | workTime(row.workStartMinute1) }}</template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="165"
          >
            <template v-slot="{row}">
              <el-link
                type="primary"
                :underline="false"
                size="small"
                @click="handleClick(row)"
              >编辑</el-link>

              <el-divider direction="vertical"></el-divider>
              <el-link
                slot="reference"
                type="danger"
                :underline="false"
                size="small"
                @click="open(row)"
              >删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 分页器 -->
      <div class="pagination">
        <el-pagination
          :current-page="pageList.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageList.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog
      :title="`${title}工作模式`"
      :visible.sync="dialogVisible"
      width="700px"
      :before-close="handleClose"
    >
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-if="paneShow1"
          label="礼拜制"
          name="1"
        >
          <el-form
            v-if="paneShow1"
            ref="form1"
            :model="form1"
            :rules="rules1"
            label-width="130px"
          >
            <el-form-item
              label="工作模式名称"
              prop="name"
              style="margin-bottom:0"
            >
              <el-input
                v-model="form1.name"
                style="padding: 0 15px;heigth:30px"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="连续工作天数"
              prop="weekType"
              style="margin-bottom:0"
            >
              <el-checkbox-group v-model="form1.weekType">
                <el-checkbox
                  label="monday"
                  name="type"
                >周一</el-checkbox>
                <el-checkbox
                  label="tuesday"
                  name="type"
                >周二</el-checkbox>
                <el-checkbox
                  label="wednesday"
                  name="type"
                >周三</el-checkbox>
                <el-checkbox
                  label="thursday"
                  name="type"
                >周四</el-checkbox>
                <el-checkbox
                  label="friday"
                  name="type"
                >周五</el-checkbox>
                <el-checkbox
                  label="saturday"
                  name="type"
                >周六</el-checkbox>
                <el-checkbox
                  label="sunday"
                  name="type"
                >周日</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <div class="tips">
              选中为工作时间，未选中为休息时间
            </div>

            <el-form-item
              label="工作时间"
              prop="time"
            >
              <el-time-picker
                v-model="form1.time"
                is-range
                format="HH:mm"
                value-format="HH:mm"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              >
              </el-time-picker>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          v-if="paneShow2"
          label="连续制"
          name="2"
        >
          <el-form
            v-if="paneShow2"
            ref="form2"
            :model="form2"
            :rules="rules2"
            label-width="130px"
          >
            <el-form-item
              label="工作模式名称"
              prop="name"
            >
              <el-input
                v-model="form2.name"
                style="padding: 0 15px;heigth:30px"
              ></el-input>
            </el-form-item>

            <el-form-item
              label="连续工作天数"
              prop="workDayNum"
            >
              <div class="demo-input-suffix">
                上
                <el-input
                  v-model="form2.workDayNum"
                  placeholder="请输入"
                  style="width: 110px; margin-left: 10px; margin-right: 21px;"
                >
                  <span
                    slot="suffix"
                    style="color: rgb(32, 35, 42); font-weight: 400; font-size: 14px; margin-right: 14px;"
                  >天</span>
                </el-input>

                休
                <el-input
                  v-model="form2.restDayNum"
                  placeholder="请输入"
                  style="width: 110px; margin-left: 10px;"
                >
                  <span
                    slot="suffix"
                    style="color: rgb(32, 35, 42); font-weight: 400; font-size: 14px; margin-right: 14px;"
                  >天</span>
                </el-input>
              </div>
            </el-form-item>

            <el-form-item
              label="工作时间"
              prop="time"
            >
              <el-time-picker
                v-model="form2.time"
                is-range
                format="HH:mm"
                value-format="HH:mm"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              >
              </el-time-picker>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="warning"
          @click="handleAdd"
        >确 定</el-button>
        <el-button
          class="is-plain"
          @click="handleClose"
        >取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { workHistoryList, addWorkHistory, updateWorkHistory, deleteWorkHistory } from '@/api/transit'
import { handleDate } from '@/utils'
export default {
  filters: {
    workTime(end, start) {
      return ((end - start) / 60).toFixed(2) + '小时'
    }
  },
  data() {
    // 自定义规则
    const validatename = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('工作模式名称不能为空'))
      } else {
        cb()
      }
    }
    const validatecb = (rule, value, cb) => {
      return cb()
    }
    const validateWorkDay = (rule, value, cb) => {
      if (!value) {
        return cb(new Error('请填写连续工作天数'))
      } else {
        cb()
      }
    }
    return {
      title: '添加',
      historyList: [],
      pageList: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false,
      delVisible: false,
      paneShow1: true,
      paneShow2: true,
      activeName: '1',
      // 验证数据
      form1: {
        name: '',
        time: ['08:00', '18:00'],
        weekType: []
      },
      form2: {
        name: '',
        time: ['08:00', '18:00'],
        workDayNum: null,
        restDayNum: null
      },
      // 校验规则
      rules1: {
        name: [
          { required: true, validator: validatename, trigger: 'blur' }
        ],
        weekType: [
          { required: true, validator: validatecb, trigger: 'blur' }
        ],
        time: [
          { required: true, trigger: 'blur' }
        ]
      },
      rules2: {
        name: [
          { required: true, validator: validatename, trigger: 'blur' }
        ],
        workDayNum: [
          { required: true, validator: validateWorkDay, trigger: 'blur' }
        ],
        time: [
          { required: true, trigger: 'blur' }
        ]
      },
      // 请求数据
      addForm: {
        name: '',
        workEndMinute1: '',
        workStartMinute1: '',
        monday: '2',
        tuesday: '2',
        wednesday: '2',
        thursday: '2',
        friday: '2',
        saturday: '2',
        sunday: '2'
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      const res = await workHistoryList(this.pageList)
      this.historyList = res.data.items
      this.total = +res.data.counts
    },
    // 分页器
    handleSizeChange(pageSize) {
      this.pageList.pageSize = pageSize
      this.initData()
    },
    handleCurrentChange(page) {
      this.pageList.page = page
      this.initData()
    },
    // 编辑/添加按钮
    handleClick(row) {
      if (row) {
        this.title = '编辑'
        const startTime = handleDate(row.workStartMinute1)
        const endtTime = handleDate(row.workEndMinute1)
        if (row.workPatternType === 1) {
          this.paneShow2 = false
          this.activeName = '1'
          this.form1.id = row.id
          this.form1.name = row.name
          for (const key in row) {
            if (row[key] === 1) {
              this.form1.weekType.push(key)
            }
          }
          this.form1.time = [startTime, endtTime]
        } else if (row.workPatternType === 2) {
          this.paneShow1 = false
          this.activeName = '2'
          this.form2 = {
            name: row.name,
            id: row.id,
            time: [startTime, endtTime],
            workDayNum: row.workDayNum,
            restDayNum: row.restDayNum
          }
        } else {
          this.title = '添加'
        }
      }
      this.dialogVisible = true
    },
    handleAdd() {
      if (this.activeName === '1') {
        this.$refs.form1.validate(async isOK => {
          if (isOK) {
            if (this.title === '添加') {
              const startTime = +this.form1.time[0].split(':')[0] * 60 + this.form1.time[0].split(':')[1] % 60
              const endTime = +this.form1.time[1].split(':')[0] * 60 + this.form1.time[1].split(':')[1] % 60
              this.addForm.name = this.form1.name
              this.addForm.workEndMinute1 = endTime
              this.addForm.workStartMinute1 = startTime
              this.addForm.workPatternType = +this.activeName
              this.form1.weekType.forEach(item => {
                this.addForm[item] = '1'
              })
              await addWorkHistory(this.addForm)
              this.initData()
              this.$message.success('添加成功')
              this.handleClose()
            } else {
              const startTime = +this.form1.time[0].split(':')[0] * 60 + this.form1.time[0].split(':')[1] % 60
              const endTime = +this.form1.time[1].split(':')[0] * 60 + this.form1.time[1].split(':')[1] % 60
              this.addForm.name = this.form1.name
              this.addForm.id = this.form1.id
              this.addForm.workEndMinute1 = endTime
              this.addForm.workStartMinute1 = startTime
              this.addForm.workPatternType = +this.activeName
              this.form1.weekType.forEach(item => {
                this.addForm[item] = '1'
              })
              updateWorkHistory(this.addForm)
              this.initData()
              this.$message.success('编辑成功')
              this.handleClose()
            }
          }
        })
      } else {
        this.$refs.form2.validate(async isOK => {
          if (isOK) {
            if (this.title === '添加') {
              const startTime = +this.form2.time[0].split(':')[0] * 60 + this.form2.time[0].split(':')[1] % 60
              const endTime = +this.form2.time[1].split(':')[0] * 60 + this.form2.time[1].split(':')[1] % 60
              this.addForm = {
                name: this.form2.name,
                workEndMinute1: endTime,
                workStartMinute1: startTime,
                workDayNum: this.form2.workDayNum,
                restDayNum: this.form2.restDayNum,
                workPatternType: +this.activeName
              }
              await addWorkHistory(this.addForm)
              this.initData()
              this.$message.success('添加成功')
              this.handleClose()
            } else {
              const startTime = +this.form2.time[0].split(':')[0] * 60 + this.form2.time[0].split(':')[1] % 60
              const endTime = +this.form2.time[1].split(':')[0] * 60 + this.form2.time[1].split(':')[1] % 60
              this.addForm = {
                name: this.form2.name,
                workEndMinute1: endTime,
                workStartMinute1: startTime,
                id: this.form2.id,
                workDayNum: this.form2.workDayNum,
                restDayNum: this.form2.restDayNum,
                workPatternType: +this.activeName
              }
              await updateWorkHistory(this.addForm)
              this.initData()
              this.$message.success('添加成功')
              this.handleClose()
            }
          }
        })
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.paneShow1 = true
      this.paneShow2 = true
      this.activeName = '1'
      this.form1 = {
        name: '',
        time: ['08:00', '18:00'],
        weekType: []
      }
      this.form2 = {
        name: '',
        time: ['08:00', '18:00'],
        workDayNum: null,
        restDayNum: null
      }
    },
    // 删除
    open(row) {
      this.$confirm('确定要删除吗?', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await deleteWorkHistory(row.id)
        if (res.msg === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/.steeings .el-button--warning{
  width: 125px;
}
/deep/.steeings .el-button--warning:active{
  width: 125px;
}
/deep/ .el-button {
  width: 90px;
  height: 40px;
}
/deep/ .el-button:active {
  width: 90px;
  height: 40px;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.dialog-footer{
  display: flex;
  justify-content: center;
}
/deep/.el-dialog__body{
  padding:40px 60px 0 ;
}
/deep/ .table-card-box {
  .el-card__body {
    padding-bottom: 0px;
  }
}
/deep/.el-input{
  padding: 0 0 !important;
}
// /deep/ .pagination{
//   padding-bottom: 30px;
// }
// .tab-box {
//   color: #20232a;
  /deep/ .el-tabs__item.is-active {
    color: #20232a;
    font-size: 16px;
    font-weight: bold;
  }
  /deep/ .el-form-item__content {
    height: 40px;
  }
  /deep/ .el-tabs__item {
    font-size: 14px;
  }
  /deep/.el-dialog .el-form-item__label{
  font-weight: 400;
}
  /deep/ .el-tabs__item:hover {
    color: #20232a;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
  }
  /deep/ .el-tabs__active-bar {
    background-color: #e15536;
  }
  /deep/ .tips {
    margin-left: 130px;
    margin-bottom: 14px;
    color: #bac0cd;
  }
  .el-checkbox {
    margin-right: 12px;
  }
  /deep/ .workDay {
    .el-form-item__error {
      position: relative;
    }
  }

/deep/ .el-dialog__body {
  padding-top: 30px !important;
  .el-tabs__header {
    padding-bottom: 25px;
  }
}
/deep/ .el-tabs__nav,
.is-top {
  transform: translateX(30px) !important;
}
</style>
