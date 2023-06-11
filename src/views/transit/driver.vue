<template>
  <div class="dashboard-container driver customer-list-box">
    <div
      class="head"
      style=" min-width: 1500px;"
    >
      <el-form
        ref="form"
        :model="formData"
      >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item
              label="司机账号："
              label-width="100px"
              prop="account"
            >
              <el-input
                v-model="formData.account"
                placeholder="请输入司机账号"
                style="width: 300px"
                clearable
              ></el-input></el-form-item></el-col>
          <el-col :span="8">
            <el-form-item
              label="司机姓名："
              label-width="100px"
              clearable
              prop="name"
            >
              <el-input
                v-model="formData.name"
                placeholder="请输入司机姓名"
                style="width: 300px"
                clearable
              ></el-input></el-form-item></el-col>
          <el-col :span="8">
            <el-form-item
              prop="mobile"
              label="司机手机号："
              label-width="100px"
            >
              <el-input
                v-model="formData.mobile"
                placeholder="请输入司机手机号"
                style="width: 300px"
                clearable
              ></el-input></el-form-item></el-col>
          <el-col :span="8">
            <el-form-item
              label="所属机构："
              label-width="100px"
              style="width: 400px"
            >
              <el-select
                ref="selectTree"
                v-model="form.id"
                placeholder="请选择所属机构"
              >
                <el-option
                  :key="form.id"
                  hidden
                  :label="form.value"
                  :value="form.id"
                >
                </el-option>
                <el-tree
                  :data="treeList"
                  :props="defaultProps"
                  node-key="id"
                  accordion
                  @node-click="handleNodeClick"
                >

                </el-tree>
              </el-select> </el-form-item></el-col>
          <el-col :span="8">
            <el-button
              type="danger"
              style="width: 90px; height: 40px"
              @click="search"
            >搜索</el-button>
            <el-button
              style="width: 90px; height: 40px"
              @click="reset"
            >重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="footer">
      <el-table
        v-loading="loading"
        :data="list"
        stripe
        empty-text="没有你找到的内容哟"
      >
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column
          label="司机账号"
          prop="account"
        ></el-table-column>
        <el-table-column
          label="司机姓名"
          prop="name"
        ></el-table-column>
        <el-table-column
          label="司机电话"
          prop="mobile"
        ></el-table-column>
        <el-table-column
          label="关联车辆"
          prop="truck.licensePlate"
        ></el-table-column>
        <el-table-column
          label="所属机构"
          prop="agency.name"
        > </el-table-column>
        <el-table-column label="工作状态">
          <template v-slot="{ row }">
            <span
              v-if="row.workStatus === 0"
            ><i class="zhuangtai1"></i> 休息</span>
            <span v-else><i class="zhuangtai"></i> 上班</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
        >
          <template v-slot="{row}">
            <el-button
              type="text"
              size="mini"
              @click="$router.push(`/transit/driver-detail?id=${row.userId}&&formUrlName=司机管理`)"
            >查看</el-button><span style="color: #dcdfe6">丨</span> <el-button
              type="text"
              size="mini"
              @click="peizhi(row)"
            >配置车辆</el-button>
          </template>

        </el-table-column>
        <div slot="empty">
          <img
            src="static/img/icon-empty.3abd3b9a.png"
            alt=""
            style="width:336px;height:270px"
          >
          <span>当前没有数据哟</span>
        </div>
      </el-table>
      <div
        v-if="list"
        class="fenye"
      >
        <el-pagination
          :current-page="pagems.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagems.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="+counts"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 配置车辆弹窗 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="500px"
      title="车辆配置"
    >
      <div class="n1">配置车辆需满足一下条件</div>
      <span style="margin-right:100px">①:司机信息已完善</span>
      <span>②:司机已设置排班</span>
      <div class="n2">③:司机绑定车辆未在启用状态</div>
      <el-button
        style="margin-left:220px"
        @click="dialogVisible=false"
      >取消</el-button>
      <el-button
        type="danger"
        @click="queding"
      >确定</el-button>
    </el-dialog>
    <!-- 配置车辆2 -->
    <el-dialog
      :visible.sync="dialogVisible2"
      width="600px"
      title="车辆配置"
    >
      <div class="n4"> <el-row style="margin-top:-10px;margin-bottom:10px">
                         <el-col :span="14">司机编号：{{ peizhiList.userId||'' }}</el-col>
                         <el-col :span="10">司机名称：{{ peizhiList.name }}</el-col>
                       </el-row>
        <el-row>
          <el-col :span="14">司机电话：{{ peizhiList.mobile }}</el-col>
          <el-col :span="10">所属机构：{{ peizhiList.agency?peizhiList.agency.name:'' }}</el-col>
        </el-row>
      </div>
      <div class="n5">配置车辆：<el-select
        v-model="chepaiValue"
        style="width:238px"
        @change="selectChange(chepaiValue)"
      ><el-option
        v-for="item in chepai"
        :key="item.id"
        :label="item.licensePlate"
        :value="item.id"
      ></el-option></el-select></div>
      <div class="n7">
        <span>车牌号</span>
        <span>车辆状态</span>
        <span>操作</span>
      </div>
      <div
        v-if="chepaiValue"
        class="n6"
      >
        <span>{{ peizhiList.truck? peizhiList.truck.licensePlate:'' }}</span>
        <span
          v-if="shiyongValue === '停用'"
        ><i class="zhuangtai1"></i> 停用</span>
        <span v-else><i class="zhuangtai"></i> 可用</span>
        <span> <template>
          <el-button
            type="text"
            @click="$router.push(`/transit/vehicle-detail?id=${cheliangID}&&formUrlName=司机管理`)"
          >查看</el-button>
          <span>丨</span>
          <el-button
            type="text"
            @click="delList"
          >删除</el-button>

        </template></span>
      </div>
      <div v-else>
        <img
          src="static/img/pic-kong.742d3899.png"
          alt=""
          style="margin-left:190px"
        >
        <div style="margin-left:190px;margin-top:10px">这里空空如也</div>
      </div>

      <el-button
        style="margin-left:160px;margin-top:20px;height:40px;width:90px"
        size="medium"
        type="danger"
        @click="queren"
      >确认</el-button>
      <el-button

        style="height:40px;width:90px"
        @click="dialogVisible2=false"
      >取消</el-button></el-dialog>
  </div>
</template>
<script>

import { driverList, getTruckListInDriver, driverArrangeCar } from '@/api/transit'
import { agencyList } from '@/api/institutions'
export default {
  name: 'Courses',
  data() {
    return {
      list: [],
      counts: 0,
      pagems: {
        page: 1,
        pageSize: 10
      },
      formData: {
        account: '',
        name: '',
        mobile: '',
        agency: {
          name: ''
        },
        id: null,
        agenld: '',
        phone: null,
        workStatus: null
      },
      depts: [],
      dialogVisible: false,
      dialogVisible2: false,
      userId: null,
      peizhiList: {},
      chepai: [],
      chepaiValue: {},
      getcheliangList: [],
      // 车辆id
      cheliangID: null,
      chePaiHaoId: null,
      shiyongValue: '',
      sijiId: null,
      // 所属机构
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      form: {
        id: '',
        value: ''
      },
      treeList: [],
      curr: true,
      chepaiList: {},
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取数据
    async getList() {
      const res = await driverList(this.pagems)
      this.counts = res.data.counts
      this.list = res.data.items
      const { data } = await agencyList()
      this.treeList = JSON.parse(data)
      const row = await getTruckListInDriver()
      this.chepai = row.data
    },
    // 分页器
    handleSizeChange(val) {
      this.pagems.pageSize = val
      this.getList()
    },
    // 分页器
    handleCurrentChange(val) {
      this.pagems.page = val
      this.getList()
    },
    // 重置
    reset() {
      this.$refs.form.resetFields()
      this.getList()
    },
    // 搜索
    async search() {
      setTimeout(() => {
        this.loading = false
      }, 500)
      const { data } = await driverList({ ...this.formData, ...this.pagems, phone: this.formData.mobile, agentId: this.form.id })
      this.list = data.items
      this.loading = true
    },
    // 配置车辆
    async peizhi(row) {
      this.dialogVisible = !this.dialogVisible

      this.peizhiList = row
      if (!this.peizhiList.truck) {
        this.peizhiList.truck = {
          licensePlate: row.licensePlate
        }
      }
      this.chepaiValue = this.peizhiList.truck.licensePlate
      if (row.workStatus === 0) {
        this.shiyongValue = '停用'
      } else {
        this.shiyongValue = '可用'
      }
      this.sijiId = row.userId
    },
    // 点击确定
    async queding() {
      this.dialogVisible2 = !this.dialogVisible2
      this.dialogVisible = !this.dialogVisible
    },

    async queren() {
      this.dialogVisible2 = false
      const res = await driverArrangeCar({ truckId: this.chePaiHaoId, driverIds: [this.sijiId] })
      this.$message.error(res.msg)
    },
    // 所属机构树形结构
    handleNodeClick(data) {
      this.form = {
        id: data.id,
        value: data.name
      }

      this.$refs.selectTree.blur()
    },
    selectChange(value) {
      this.peizhiList.truck = {
        licensePlate: this.chepaiValue
      }

      this.chepai.forEach(item => {
        if (item.id === value) {
          this.peizhiList.truck.licensePlate = item.licensePlate
          this.chePaiHaoId = item.id
          if (item.workStatus === 0) {
            this.shiyongValue = '停用'
          } else {
            this.shiyongValue = '可用'
          }
          this.cheliangID = item.id
        }
      })
    },
    delList() {
      this.chepaiValue = ''
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.alert {
 margin: 10px 0px;
}
.pagination {
 margin-top: 40px;
}
// 下拉框
/deep/ .el-select {
 width: 100%;
}

/deep/ .el-card{
 overflow: initial;
 }

.head {
  margin: 20px 20px;
  padding: 20px;
  background: white;
}
.footer {
  margin: 25px 20px;
  padding: 20px;
  background: white;
}
.zhuangtai {
  width: 6px;
  height: 6px;
  background: #1dc779;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}
.zhuangtai1 {
  width: 6px;
  height: 6px;
  background: #e15536;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
}
.fenye {
  margin-top: 20px;
  margin-bottom: 80px;
  margin-left: 480px;
}
.el-dialog__header:first-child {
    padding: 15px 30px 15px;
    background-color: #fff;
    border-radius: 8px 8px 0 0;
}
.n2{
  margin-top: 10px;
  margin-bottom: 10px;
}
.n1{
margin-bottom: 10px;
margin-top: -20px;
}
.n3{
  background: #f3f4f7;
  height: 40px;
  width:549px;
  font-size: 16px;
  line-height: 40px;
  margin-top: -60px;
margin-left: -20px;
padding-left: 20px;
margin-bottom: 10px;
border-radius: 3px;
}
.n4{
  background: #f3f4f7;
  height: 80px;
  padding: 30px 40px;
}
.n5{
  margin-top: 20px;
  margin-bottom: 20px;
}
.n7{
   display: flex;
    justify-content: space-around;
    margin-right: 50px;
    border: 1px solid #ebeef5 ;
    height: 45px;
    line-height: 45px;
    background: #f8faff;
}
.n6{
  display: flex;
    justify-content: space-around;
    margin-right: 50px;
    border: 1px solid #ebeef5 ;
    height: 45px;
    line-height: 45px;
    border-top: none;
    transition: all .5s;
}
.n6:hover{
  background: #f5f7fa;
}

</style>

