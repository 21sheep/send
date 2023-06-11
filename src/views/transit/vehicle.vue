<!-- 车辆列表 -->
<template>
  <div class="dashboard-container vehicle customer-list-box">
    <div class="app-container">
      <!-- 搜索区域 -->
      <el-row
        class="search-row"
      >
        <el-form
          ref="searchForm"
          :model="searchForm"
          :inline="true"
        >
          <el-form-item
            label="车辆类型:"
            label-width="100px"
            prop="truckTypeId"
          >
            <el-select v-model="vehicleParams.truckTypeId">
              <el-option
                v-for="item in CarInfoList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="车牌号码:"
            label-width="130px"
            prop="licensePlate"
          >
            <el-input
              v-model="vehicleParams.licensePlate"
              placeholder="请输入车牌号码"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="btnSearch"
            >搜索</el-button>
            <el-button @click="resetSearchForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!-- 全部、可用、停用 -->
      <el-row class="tabs">
        <el-col :span="2">
          <el-button type="text" @click="handleStatus('all')">全部 {{ allTotal }}</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="text" @click="handleStatus('yes')">可用 {{ yesTotal }}</el-button>
        </el-col>
        <el-col>
          <el-button type="text" @click="handleStatus('no')">停用 {{ noTotal }}</el-button>
        </el-col>
      </el-row>

      <!-- 表格主体区域 -->
      <el-card
        v-loading="isLoading"
      >

        <!-- 新增车辆 -->
        <el-button
          type="primary"
          class="addCar"
          @click="addCar"
        >新增车辆</el-button>

        <!-- 表格主体 -->
        <el-table
          stripe
          :data="vehicleList"
        >
          <el-table-column
            width="100px"
            label="序号"
            type="index"
          >
            <template slot-scope="scope">
              {{ currentIndex + scope.$index }}
            </template>
          </el-table-column>
          <el-table-column
            label="车牌号码"
            width="200px"
            prop="licensePlate"
          />
          <el-table-column
            label="车辆类型"
            width="100px"
            prop="truckTypeName"
          />
          <el-table-column
            label="司机数量"
            width="100px"
            prop="driverNum"
          />
          <el-table-column
            label="车辆状态"
            prop="status"
            width="100px"
          >
            <template v-slot="{ row }">
              <span
                v-if="row.status === 1"
              >可用</span>
              <span
                v-else-if="row.status === 2"
              >停用</span>
            </template>
          </el-table-column>
          <el-table-column
            label="GPS设备ID"
            width="100px"
            prop="deviceGpsId"
          />
          <el-table-column
            label="实载重量 (T)"
            width="110px"
            prop="allowableLoad"
          />
          <el-table-column
            label="实载体积 (方)"
            width="120px"
            prop="allowableVolume"
          />
          <el-table-column
            label="操作"
            align="center"
          >
            <template v-slot="{ row }">
              <el-link
                :underline="false"
                @click="preview(row.id)"
              >查看详情</el-link>
              <el-divider direction="vertical" />
              <el-link
                :underline="false"
                @click="btnStart(row.id)"
              >启用</el-link>
              <el-divider direction="vertical" />
              <el-link
                :underline="false"
                @click="deployCar(row.id)"
              >配置司机</el-link>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-row
          type="flex"
          justify="center"
          style="margin: 30px"
          align="middle"
        >
          <el-pagination
            background
            :current-page="vehicleParams.page"
            :page-sizes="[10,20,30,50]"
            :page-size="vehicleParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @current-change="handleCurrentPage"
            @size-change="handleCurrentSize"
          />
        </el-row>
      </el-card>

    </div>

    <!-- 新增车辆 dialog -->
    <el-dialog
      :visible="isShowAddCarDialog"
      title="新增车辆"
      width="600px"
      @close="btnCancelAddCar"
    >
      <el-form
        ref="carForm"
        label-width="130px"
        :model="carForm"
        :rules="carRules"
      >
        <el-form-item

          label="车辆类型"
          prop="truckTypeId"
        >
          <el-select v-model="carForm.truckTypeId">
            <el-option
              v-for="item in CarInfoList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="车牌号码"
          prop="licensePlate"
        >
          <el-input
            v-model="carForm.licensePlate"
            placeholder="请输入车牌号码"
          />
        </el-form-item>
        <el-form-item
          label="GPS设备ID"
          prop="truckTypeId"
        >
          <el-input
            v-model="carForm.deviceGpsId"
            placeholder="请输入GPS设备ID"
          />
        </el-form-item>
        <el-form>
          <el-row
            type="flex"
            justify="center"
            style="height: 100px"
            align="middle"
          >
            <el-button
              type="primary"
              @click="btnAddCarOk"
            >确认</el-button>
            <el-button @click="btnCancelAddCar">取消</el-button>
          </el-row>
        </el-form>
      </el-form>
    </el-dialog>

    <!-- 配置司机 dialog -->
    <el-dialog
      title="配置司机"
      width="600px"
      :visible="isShowDriverDialog"
      @close="btnCancelDeployCar"
    >
      <!-- 描述列表 -->
      <el-card>
        <el-descriptions
          :column="2"
        >
          <el-descriptions-item label="车牌号">{{ carDetail.licensePlate }}</el-descriptions-item>
          <el-descriptions-item label="车型">{{ carDetail.truckTypeName }}</el-descriptions-item>
          <el-descriptions-item label="车辆状态">
            <el-tag
              v-if="carDetail.status === 1"
              size="mini"
              type="success"
            >可用</el-tag>
            <el-tag
              v-if="carDetail.status === 0"
              size="mini"
              type="error"
            >停用</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="实载重量">{{ carDetail.allowableLoad }}</el-descriptions-item>
          <el-descriptions-item label="实载体积">{{ carDetail.allowableVolume }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
      <!-- 搜索框 -->
      <el-row
        type="flex"
        style="margin: 20px"
      >
        <el-form :inline="true">
          <el-form-item label="配置司机:">
            <el-select style="width: 300px" />
          </el-form-item>
        </el-form>
      </el-row>

      <!-- 表格 -->
      <el-table

        height="200px"
      >
        <template v-slot:empty>
          <div class="no-data">
            <img
              src="@/assets/empty.png"
            >
            <p>这里空空如也</p>
          </div>
        </template>
        <el-table-column label="序号" />
        <el-table-column label="司机名称" />
        <el-table-column label="操作" />
      </el-table>

      <!-- 确定 取消按钮 -->
      <el-row
        style="padding: 30px"
        type="flex"
        justify="center"
      >
        <el-button type="primary">确认</el-button>
        <el-button @click="btnCancelDeployCar">取消</el-button>
      </el-row>

    </el-dialog>
  </div>

</template>
<script>
import {
  getVehiclePage,
  getCarInfoList,
  addCar,
  enableCar,
  getCarDetail,
  getUnWorkingCar,
  getWorkingCar
} from '@/api/vehicle.js'

export default {
  name: 'Vehicle',
  data() {
    return {
      currentStatus: 'all', //  当前是全部、可用还是、停用、默认全部
      allTotal: 0,
      yesTotal: 0,
      noTotal: 0,
      currentIndex: 1, //  每一行序号
      previewList: [], //  查看详情页面传参
      carDetail: [],
      isShowDriverDialog: false, //  是否显示配置司机弹窗
      isLoading: false, //  是否显示加载中
      CarInfoList: [], //  车辆类型列表
      isShowAddCarDialog: false, //  是否显示新增车辆弹窗
      total: 0, //  车辆总数
      vehicleList: [],
      vehicleParams: {
        page: 1,
        pageSize: 10,
        truckTypeId: '', //  车辆类型Id
        licensePlate: '' //  车牌号码
      },
      carForm: {
        licensePlate: '', // 车牌号码
        deviceGpsId: '', //  GPS设备id
        truckTypeId: '' //  车辆类型Id
      },
      queryStatus: {
        page: 1,
        pageSize: 10,
        workStatus: '' //  车辆状态
      },
      carRules: {
        licensePlate: [{ required: true, message: '车牌号码不能为空格', trigger: 'blur' }],
        deviceGpsId: [{ required: true, message: '车辆GPS设备ID不能为空格', trigger: 'blur' }],
        truckTypeId: [{ required: true, message: '车辆类型ID不能为空格', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.handleNo()
    this.handleYes()
    this.initVehiclePage()
  },
  methods: {
    //  初始化页面
    async initVehiclePage() {
      this.isLoading = true
      const { data: { counts, items }} = await getVehiclePage(this.vehicleParams)
      const { data } = await getCarInfoList()
      this.allTotal = counts
      this.CarInfoList = data
      this.vehicleList = items
      this.total = Number(counts)
      this.isLoading = false
    },
    //  操作分页
    handleCurrentPage(newPage) {
      this.vehicleParams.page = newPage
      const startIndex = (newPage - 1) * this.vehicleParams.pageSize + 1
      this.currentIndex = startIndex
      this.initVehiclePage()
    },
    //  操作每页显示个数
    handleCurrentSize(newSize) {
      this.vehicleParams.pageSize = newSize
      this.initVehiclePage()
    },
    //  新增车辆 按钮
    async addCar() {
      this.isShowAddCarDialog = true
    },
    //  确定新增车辆按钮
    btnAddCarOk() {
      this.$refs.carForm.validate(async(isOk) => {
        if (isOk) {
          await addCar(this.carForm)
          this.$message.success('新增车辆成功')
          this.btnCancelAddCar()
        }
      })
    }, //  新增车辆 取消（关闭）按钮
    btnCancelAddCar() {
      this.isShowAddCarDialog = false
      this.$refs.carForm.resetFields()
      this.initVehiclePage()
    },
    //  搜索功能
    btnSearch() {
      this.initVehiclePage()
    },
    //  重置搜索功能
    resetSearchForm() {
      this.vehicleParams.truckTypeId = ''
      this.vehicleParams.licensePlate = ''
      this.initVehiclePage()
    },
    //  启用
    btnStart(id) {
      const h = this.$createElement
      this.$msgbox({
        title: '车辆启用',
        message: h('p', null, [
          h('p', { style: 'margin-bottom: 10px' }, '确定要启用吗？车辆启用需满足以下条件:'),
          h('span', { style: 'width: 16px; height: 16px; background: rgb(250, 252, 255); border: 1px solid rgb(235, 238, 245); border-radius: 50%; display: inline-block; text-align: center; margin-right: 10px; line-height: 14px;' }, 1),
          h('span', null, '车辆信息已完善'),
          h('span', { style: 'width: 16px; height: 16px; background: rgb(250, 252, 255); border: 1px solid rgb(235, 238, 245); border-radius: 50%; display: inline-block; text-align: center; margin-left: 40px; line-height: 14px;' }, 2),
          h('span', null, '绑定司机>=2，且有排班')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: async(action, instance, done) => {
          if (action === 'confirm') {
            /* 在此处发请求 */
            instance.confirmButtonLoading = true
            const result = await enableCar(id)
            this.$message.error(result.msg)
            instance.confirmButtonLoading = false
            done()
          } else {
            this.$message.info('已取消')
            done()
          }
        }
      })
    },
    //  配置司机
    deployCar(id) {
      const h = this.$createElement
      this.$msgbox({
        title: '车辆启用',
        message: h('p', null, [
          h('p', { style: 'margin-bottom: 10px' }, '确定要启用吗？车辆启用需满足以下条件:'),
          h('span', { style: 'width: 16px; height: 16px; background: rgb(250, 252, 255); border: 1px solid rgb(235, 238, 245); border-radius: 50%; display: inline-block; text-align: center; margin-right: 10px; line-height: 14px;' }, 1),
          h('span', null, '车辆信息已完善'),
          h('span', { style: 'width: 16px; height: 16px; background: rgb(250, 252, 255); border: 1px solid rgb(235, 238, 245); border-radius: 50%; display: inline-block; text-align: center; margin-left: 40px; line-height: 14px;' }, 2),
          h('span', null, '车辆无未完成运输任务')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: async(action, instance, done) => {
          if (action === 'confirm') {
            /* 在此处发请求 */
            const result = await getCarDetail(id)
            this.isShowDriverDialog = true
            this.carDetail = result.data
            done()
          } else {
            this.$message.info('已取消')
            done()
          }
        }
      })
    },
    //  取消配置司机，
    btnCancelDeployCar() {
      this.isShowDriverDialog = false
    },
    //  查看详情
    async preview(id) {
      const { data } = await getCarDetail(id)
      this.previewList = data
      this.$router.push({ name: 'vehicle-detail', query: this.previewList })
    },
    //  全部、可用、停用 操作
    handleStatus(type) {
      if (type === 'all') {
        this.initVehiclePage()
      } else if (type === 'yes') {
        this.handleYes()
      } else if (type === 'no') {
        this.handleNo()
      }
    },
    async handleYes() {
      const { data: { counts, items }} = await getVehiclePage({ ...this.queryStatus, workStatus: 1 })
      this.vehicleList = items
      this.yesTotal = counts
    },
    async handleNo() {
      const { data: { counts, items }} = await getVehiclePage({ ...this.queryStatus, workStatus: 0 })
      this.vehicleList = items
      this.noTotal = counts
    }
  }

}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.alert {
  margin: 10px 0px;

}
.pagination {
  margin-top: 10px;
}
.vehicle /deep/ .el-table td,
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

.vehicle {
  /deep/ .el-dialog__title {
    width: 73px;
    height: 25px;
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #20232a;
    line-height: 25px;
    letter-spacing: 0px;
  }
  /deep/ .el-dialog__body {
    text-align: center;
    padding: 20px 20px 0px 20px;
  }
  .warn-img {
    width: 40px;
  }
  p {
    height: 24px;
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #818693;
    line-height: 24px;
  }
}

// 下拉框
/deep/ .el-select {
  width: 100%;
}
</style>

<style scoped lang="scss">
  .startconfirm{
    width: 481px;

    }
    .startconfirm .el-message-box__header{
      padding-bottom: 4px;
    }
    .startconfirm .el-message-box__container{
      margin-bottom: 15px;
    }
    .confirm .el-message-box__status.el-icon-warning{
      left: 70px;
    }
    .confirm.el-message-box__title{
      font-size: 16px;
    }
    .confirm .el-message-box__message p {
      color: #F92D2D;
      margin-top: 5px;
    }
    .confirm .el-message-box__btns{
      text-align: center;
      margin-top: 10px;
    }
    .app-container   {
      padding: 20px;
    }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-card {
    border-radius: 5px;
    background-color: #fff;
  }
  .search-row {
    width: 100%;
    border-radius: 5px;
    padding: 20px 20px 0px 20px;
    background: #fff;
  }
  .el-button  {
    width: 100px;
  }
  .addCar {
    margin-bottom: 20px ;
  }
  .el-link  {
    color: #419eff;
  }
  .no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  img {
    width: 100px;
    height: 80px;
  }
  }
  .tabs {
    display: flex;
    align-items: center;
    background-color: #fff;
    width: 100%;
    height: 60px;
    margin-bottom: 20px;
    padding: 0px
  }
</style>
