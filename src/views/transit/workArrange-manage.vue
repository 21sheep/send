<!-- 排班管理 -->
<template>
  <div class="dashboard-container transport-task customer-list-box">
    <!-- 搜索栏 -->
    <el-card class="box-card serch">
      <el-form
        ref="searchFrom"
        label-width="80px"
        :model="searchList"
        class="demo-form-inline"
      >
        <el-row>
          <!-- 员工账号 -->
          <el-col
            :span="8"
            style="padding: 0 30px; white-space: nowrap"
          >
            <el-form-item
              label="员工账号:"
              prop="employeeNumber"
            >
              <el-input
                v-model="searchList.employeeNumber"
                placeholder="员工账号"
              />
            </el-form-item>
          </el-col>
          <!-- 员工姓名 -->
          <el-col
            :span="8"
            style="padding: 0 30px; white-space: nowrap"
          >
            <el-form-item
              label="员工姓名:"
              prop="name"
            >
              <el-input
                v-model="searchList.name"
                placeholder="员工姓名"
              />
            </el-form-item>
          </el-col>
          <!-- 工作模式 -->
          <el-col
            :span="8"
            style="padding: 0 30px; white-space: nowrap"
          >
            <el-form-item
              label="工作模式:"
              prop="workPatternId"
            >
              <el-select
                v-model="searchList.workPatternId"
                placeholder="请选择工作模式"
              >
                <el-option
                  v-for="(item,index) in options"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 月份 -->
          <el-col
            :span="8"
            style="padding: 0 30px; white-space: nowrap"
          >
            <el-form-item
              label="月份:"
              prop="month"
            >
              <el-date-picker
                v-model="searchList.month"
                type="month"
                placeholder="选择月"
              />
            </el-form-item>
          </el-col>
          <!-- 所属机构 -->
          <el-col
            :span="8"
            style="padding: 0 30px; white-space: nowrap"
          >
            <el-form-item
              label="所属机构:"
              prop="agencyId"
            >
              <treeselect
                v-model="searchList.agencyId"
                placeholder="请选择所属机构"
                :normalizer="normalizer"
                :options="depts"
                :searchable="true"
              />
            </el-form-item>
          </el-col>
          <!-- 按钮 -->
          <el-col
            :span="8"
            style="padding: 0 30px; white-space: nowrap"
          >
            <el-button
              class="true"
              type="warning"
              @click="submitForm"
            >提交</el-button>
            <el-button
              class="is-plain"
              @click="resetForm"
            >重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 数据页面 -->
    <el-card class="box-card">
      <!-- 设置按钮 -->
      <template>
        <div
          style="margin-bottom: 20px"
          class="steeings"
        >
          <el-button
            class="true"
            type="warning"
            @click="handleroute"
          >排班设置</el-button>
          <el-button
            type="warning"
            class="is-plain"
            @click="changeSchedule"
          >绑定排班</el-button>
        </div>
      </template>
      <!-- 表单页面 -->
      <el-table
        ref="table"
        v-loading="loading"
        :data="workList.items"
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          fixed
          prop="employeeNumber"
          label="员工账号"
          width="100"
        />
        <el-table-column
          fixed
          prop="name"
          label="员工姓名"
          width="120"
        />
        <el-table-column
          fixed
          prop="phone"
          label="员工电话"
          width="120"
        />
        <el-table-column
          fixed
          prop=""
          label="员工角色"
          width="100"
        >
          <template v-slot="{ row }">{{
            row.userType === 1 ? '员工' : row.userType === 2 ? '快递员' : '司机'
          }}</template>
        </el-table-column>
        <el-table-column
          fixed
          min-width="110"
          prop="workPatternName"
          label="当前工作模式"
        />
        <template>
          <el-table-column
            v-for="(item,index) in workSchedules.length"
            :key="index"
            :label="String(item)"
            width="80"
          >
            <template
              v-slot="{ row }"
            ><span
              :class="{ work: row.workSchedules[item-1],rest:!row.workSchedules[item-1]}"
            >{{
              row.workSchedules[item-1]?'上':'休'
            }}</span></template>
          </el-table-column>
        </template>
      </el-table>

      <!-- 分页器 -->
      <div class="pagination">
        <el-pagination
          :current-page="searchList.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="searchList.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 弹出框 -->
    <el-dialog
      title="人工调整"
      close-on-press-escape
      :before-close="resetdialogForm"
      :visible.sync="dialogVisible"
      width="566px"
    >
      <el-form
        ref="dialogForm"
        :model="dialogForm"
      >
        <el-form-item label-width="40px">
          <el-radio
            v-model="radio"
            class="is-checked"
            label="1"
          >礼拜制</el-radio>
          <el-radio
            v-model="radio"
            class="is-checked"
            label="2"
          >连续制</el-radio>
        </el-form-item>

        <el-form-item
          label="模式名称:"
          label-width="120px"
          prop="workPatternId"
        >
          <el-select
            v-model="dialogForm.workPatternId"
            style="width:100%"
            placeholder="请选择"
            width="100%"
          >
            <el-option
              v-for="(item,index) in file"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="warning"
          @click="handlePeople"
        >确 定</el-button>
        <el-button
          class="is-plain"
          @click="resetdialogForm"
        >取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { workManage, selectWorkHistoryList, getTree, peopleSet } from '@/api/transit'
import { findChildren } from '@/utils'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      // 搜索页面
      searchList: {
        employeeNumber: '',
        name: '',
        workPatternId: '',
        month: '',
        agencyId: null,
        page: 1,
        pageSize: 10
      },
      // 人员排班信息
      workList: [],
      workSchedules: [],
      multipleSelection: [],
      // 所属机构
      depts: [],
      // 树形搜索框
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      // 工作模式
      options: [],
      total: 0,
      // 弹出框
      dialogVisible: false,
      radio: '1',
      dialogForm: {
        userIdList: [],
        userType: '',
        workPatternId: '',
        workPatternType: ''
      },
      liturgy: [],
      continuous: []
    }
  },
  computed: {
    file() {
      return this.radio === '1' ? this.liturgy : this.continuous
    }
  },
  mounted() {
    this.loading = true
  },
  // 渲染数据
  created() {
    this.initData()
  },
  methods: {
    // 渲染数据
    async initData() {
      this.loading = true
      const res = await workManage(this.searchList)
      this.workList = res.data
      this.total = +res.data.counts
      this.workSchedules = res.data.items[0].workSchedules
      this.loading = false
      // 获取工作模式列表
      const { data } = await selectWorkHistoryList()
      // 将其push进options数组
      this.options.push(...data[1], ...data[2], { name: '暂无排班', id: 0 })
      this.liturgy = data[1]
      this.continuous = data[2]
      // 获取网点列表
      const res2 = await getTree()
      this.depts = findChildren(JSON.parse(res2.data))
    },
    // 树形过滤
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 搜索点击事件
    submitForm() {
      this.loading = true
      this.initData()
    },
    // 重置按钮
    resetForm() {
      this.$refs.searchFrom.resetFields()
      this.dialogForm = {
        userIdList: [],
        userType: '',
        workPatternId: '',
        workPatternType: ''
      }
      this.initData()
    },
    handleShows() {
      this.isShow = false
    },
    // 绑定排班
    changeSchedule() {
      if (this.multipleSelection.length !== 0) {
        this.dialogVisible = true
      } else {
        this.$message.error('请选择调整人员')
      }
    },
    async handlePeople() {
      this.multipleSelection.forEach(item => {
        this.dialogForm.userIdList.push(item.id)
        this.dialogForm.userType = item.userType
      })
      this.dialogForm.workPatternType = this.radio
      await peopleSet(this.dialogForm)
      this.dialogVisible = false
      this.resetdialogForm()
      this.initData()
    },
    // 分页器
    handleSizeChange(pageSize) {
      this.searchList.pageSize = pageSize
      this.initData()
    },
    handleCurrentChange(page) {
      this.searchList.page = page
      this.initData()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 重置数据
    resetdialogForm() {
      this.dialogForm = {
        userIdList: [],
        userType: '',
        workPatternId: '',
        workPatternType: ''
      }
      this.dialogVisible = false
    },
    // 跳转页面
    handleroute() {
      this.$router.push({ name: 'workArrange-setting' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-button {
  width: 90px;
  height: 40px;
}
/deep/ .el-button:active {
  width: 90px;
  height: 40px;
}
/deep/.el-form-item__label {
  width: 80px;
  font-weight: 400;
}
.sectetree {
  position: relative;
}
/deep/ .sectetree .el-input__inner:focus {
  border-color: #d8dde3;
}
.el-tree {
  position: absolute;
  top: 39px;
  left: 0;
  right: 0;
  margin-top: -1px;
  border: 1px solid #d8dde3;
  z-index: 9999;
}
.box-card {
  margin: 20px 20px;
  box-shadow: none;
}
.steeings .el-button {
  width: 100px;
  height: 40px;
}

/deep/ th.date {
  .cell {
    padding-left: 17px !important;
  }
}
.work {
  display: block;
  width: 24px;
  height: 24px;
  background: #ffeeeb;
  border: 1px solid #e15536;
  border-radius: 50%;
  text-align: center;
  color: #e15536;
  font-size: 13px;
}
.dialog-footer{
  display: flex;
  justify-content: center;
}
/deep/.el-dialog__body {
    padding: 30px 50px 10px 50px !important;
}
/deep/.el-radio__label{
  font-weight: 700;
  color: black;
}
/deep/.el-radio__input.is-checked + .el-radio__label {
  font-weight: 700 !important;
  color: black !important;
}

/deep/.el-dialog .el-form-item__label{
  font-weight: 700;
}

.work-type {
  /deep/ .el-form-item__content {
    margin-left: 80px !important;
  }
  /deep/ .el-radio:first-child {
    margin-right: 80px !important;
  }
  /deep/.el-radio__label {
    font-weight: bold;
    color: #333333;
  }
}

.rest {
  display: block;
  width: 24px;
  height: 24px;
  background: #eff3f8;
  border: 1px solid #d8dde3;
  border-radius: 50%;
  text-align: center;
  color: #20232a;
  font-size: 13px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.transport-task /deep/ .el-table td,
.el-table th {
  padding: 12px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
  overflow: hidden;
}

/*定义滚动条轨道 内阴影+圆角*/
/deep/ .el-table--scrollable-x .el-table__body-wrapper {
  padding-bottom: 5px;
  margin-bottom: 5px;
  &::-webkit-scrollbar {
    height: 10px;
  }

  /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(144, 147, 153, 0.3);
  }

  &::-webkit-scrollbar-track-piece {
    margin-right: 3px;
    margin-left: 3px;
  }
}
/deep/ .el-card {
  overflow: initial;
}
</style>

<style></style>
