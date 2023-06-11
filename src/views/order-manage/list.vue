<!-- 订单管理 -->
<template>
  <div class="dashboard-container order-list customer-list-box">
    <div class="app-container">
      <div class="head">
        <div class="first">
          <div class="left">
            <span>&nbsp;订单编号：</span>
            <el-input
              v-model="getList.id"
              size="medium"
              width="200"
              placeholder="请输入内容"
              @blur="getList.id=$event.target.value.trim ()"
            ></el-input>
          </div>
          <div class="center">
            <span>&nbsp;订单状态:</span>
            <el-select
              v-model="getList.status"
              placeholder="请选择"
            >
              <el-option
                v-for="item in status"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <div class="right">
            <span>&nbsp;付费状态:</span>
            <el-select
              v-model="getList.paymentStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="item in paymentStatus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="dierge">
          <div class="left">
            <span>发件人姓名：</span>
            <el-input
              v-model="getList.senderName"
              size="medium"
              width="200"
              placeholder="请输入内容"
              @blur="getList.senderName=$event.target.value.trim ()"
            ></el-input>
          </div>
          <div class="center">
            <span>发件人电话:</span>
            <el-input
              v-model="getList.senderPhone"
              size="medium"
              placeholder="请输入内容"
              @blur="getList.senderPhone=$event.target.value.trim ()"
            ></el-input>
          </div>
          <div class="right">
            <div class="fabox">
              <span>发件人地址:</span>
              <el-select
                v-model="getList.senderProvinceId"
                placeholder="请选择"
                @change="spChange"
              >
                <el-option
                  v-for="item in sProvince"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id "
                />
              </el-select>
              <el-select
                v-model="getList.senderCityId"
                placeholder="请选择"
                @change="scChange"
              >
                <el-option
                  v-for="item in sCity"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select
                v-model="getList.senderAddressId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in sAddress"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id "
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="disange">
          <div class="left">
            <span>收件人姓名：</span>
            <el-input
              v-model="getList.receiverName"
              size="medium"
              width="200"
              placeholder="请输入内容"
              @blur="getList.receiverName=$event.target.value.trim ()"
            ></el-input>
          </div>
          <div class="center">
            <span>收件人电话:</span>
            <el-input
              v-model="getList.receiverPhone"
              size="medium"
              placeholder="请输入内容"
              @blur="getList.receiverPhone=$event.target.value.trim ()"
            ></el-input>
          </div>
          <div class="right">
            <div class="shoubox">
              <span>收件人地址:</span>
              <el-select
                v-model="getList.receiverProvinceId"
                placeholder="请选择"
                @change="repChange"
              >
                <el-option
                  v-for="item in reProvince"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id "
                ></el-option>
              </el-select>
              <el-select
                v-model="getList.receiverCityId"
                placeholder="请选择"
                @change="recChange"
              >
                <el-option
                  v-for="item in reCity"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id "
                ></el-option>
              </el-select>
              <el-select
                v-model="getList.receiverAddressId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in reAddress"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id "
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="buttonBox">
          <el-button
            class="seach"
            type="danger"
            @click="submitSearch"
          >搜索</el-button>
          <el-button
            class="reset"
            @click="reset"
          >重置</el-button>
        </div>
      </div>
      <div class="main">
        <template>
          <el-table
            ref="form"
            v-loading="loading"
            :data="lists"
            border
            style="width: 100%"
          >
            <el-table-column
              fixed
              label="序号"
              width="60"
            >
              <template slot-scope="scope">
                {{ currentIndex+scope.$index }}
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="订单编号"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="transportOrder.id"
              label="运单编号"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="下单时间"
              width="150"
            >
            </el-table-column>
            <el-table-column
              label="订单状态"
              width="80"
              prop="status"
            >
              <template v-slot="{row}">
                <span>{{ row.status===23000?'待取件':row.status===23001?'已取件':row.status===23002?'网点自寄':row.status===23003?'网点入库':row.status===23004?'待装车':row.status===23005?'运输中':row.status===23006?'网点入库':row.status===23007?'待派送':row.status===23008?'派送中':row.status===23009?'已签收':row.status===23010?'拒收':row.status===230011?'已取消': '' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="senderName"
              label="发件人姓名"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="senderPhone"
              label="发件人电话"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="sendWhere"
              label="发件人地址"
              width="150"
            >
            </el-table-column>
            <el-table-column
              prop="receiverName"
              label="收件人姓名"
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="receiverPhone"
              label="收件人电话"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="receptWhere"
              label="收件人地址"
              width="150"
            >
            </el-table-column>
            <el-table-column
              label="取件类型"
              width="100"
              prop="pickupType"
            >
              <template v-slot="{row}">
                <span>{{ row.pickupType===1?'网点自寄':'上门取件' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="付费类型"
              width="100"
              prop="paymentMethod"
            >
              <template v-slot="{row}">
                <span>{{ row.paymentMethod===1?'预结':'到付' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="付费状态"
              width="100"
              prop="paymentStatus"
            >
              <template v-slot="{row}">
                <span>{{ row.paymentStatus===1?'未付':'已付' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              fixed="right"
              label="操作"
              width="100"
            >
              <template v-slot="{row}">
                <el-button
                  type="text"
                  size="small"
                  @click="detail(row)"
                >查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="block">
          <el-pagination
            :current-page="getList.page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="getList.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { orderList, getWhere } from '@/api/order'
import list from '@/api/orderstatus.json'
export default {
  data() {
    return {
      currentIndex: 1,
      lists: [],
      total: 0,
      getList: {
        id: null,
        page: 1,
        pageSize: 10,
        senderName: '',
        senderPhone: null,
        receiverName: '',
        receiverPhone: null,
        status: null,
        paymentStatus: null,
        senderProvinceId: null,
        senderCityId: null,
        senderAddressId: null,
        receiverProvinceId: null,
        receiverCityId: null,
        receiverAddressId: null
      },
      parentId: 0,
      status: [],
      paymentStatus: [{ id: 1, name: '未付' }, { id: 2, name: '已付' }],
      sProvince: [],
      sCity: [],
      sAddress: [],
      reProvince: [],
      reCity: [],
      reAddress: [],
      loading: true
    }
  },
  created() {
    this.initList()
  },
  methods: {
    async initList() {
      // 订单状态下拉列表赋值
      this.status = list
      // 发获取请求
      const res = await orderList(this.getList)
      // 拼接地址
      if (res.data.items != null) {
        res.data.items.forEach(item => {
          item.sendWhere = `${item.senderProvince.name} ${item.senderCity.name} ${item.senderCounty.name} ${item.senderAddress}`
          item.receptWhere = `${item.receiverProvince.name} ${item.receiverCity.name} ${item.receiverCounty.name} ${item.receiverAddress}`
        })
      }

      this.lists = res.data.items
      this.total = +res.data.counts
      // 根据parantId=0获取一级的地址
      const res1 = await getWhere({ parentId: this.parentId })
      this.sProvince = res1.data
      this.reProvince = res1.data
      this.loading = false
    },
    // 发件地址
    async spChange() {
      // 一级城市改变时，清空后面的选项
      this.getList.senderCityId = ''
      this.getList.senderAddressId = ''
      // 根据一级城市的id获取二级城市数据
      const res = await getWhere({ parentId: this.getList.senderProvinceId })
      this.sCity = res.data
    },
    async  scChange() {
      // 二级城市改变时，清空最后的选项
      this.getList.senderAddressId = ''
      // 根据二级城市的id获取三级城市数据
      const res = await getWhere({ parentId: this.getList.senderCityId })
      this.sAddress = res.data
    },
    // 收件地址
    async  repChange() {
      // 一级城市改变时，清空后面的选项
      this.getList.receiverCityId = ''
      this.getList.receiverAddressId = ''
      // 根据一级城市的id获取二级城市数据
      const res = await getWhere({ parentId: this.getList.receiverProvinceId })
      this.reCity = res.data
    },
    async  recChange() {
      // 二级城市改变时，清空最后的选项
      this.getList.receiverAddressId = ''
      // 根据二级城市的id获取三级城市数据
      const res = await getWhere({ parentId: this.getList.receiverCityId })
      this.reAddress = res.data
    },

    handleSizeChange(newpageSize) {
      this.getList.pageSize = newpageSize
      this.initList()
    },
    handleCurrentChange(newpage) {
      this.getList.page = newpage
      this.currentIndex = (newpage - 1) * this.getList.pageSize + 1
      this.initList()
    },
    submitSearch() {
      this.loading = true
      this.getList.page = 1
      this.initList()
    },
    reset() {
      this.loading = true
      this.getList.id = null
      this.getList.senderName = ''
      this.getList.senderPhone = null
      this.getList.receiverName = ''
      this.getList.receiverPhone = null
      this.getList.status = null
      this.getList.paymentStatus = null
      this.getList.senderProvinceId = null
      this.getList.senderCityId = null
      this.getList.senderAddressId = null
      this.getList.receiverProvinceId = null
      this.getList.receiverCityId = null
      this.getList.receiverAddressId = null
      this.initList()
    },
    async  detail(row) {
      this.$router.push({
        path: 'edit-order',
        query: { orderId: row.id }
      })
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
.app-container{
  width: 100%;
  .head{
    width: 1231px;
    padding: 20px;
    background-color: #fff;
    .first,
    .dierge,
    .disange{
      height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    span{
      display: inline-block;
    }
    .el-input,
    .el-select {
     width: 250px;
     height: 40px;
    }
    .fabox,
    .shoubox{
      width: 350px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-select{
        width: 70px;
      }
    }
    }
    .buttonBox{
      margin-left: 20px;
      .seach{
        // background-color: #e15536;
        color: white;
        width: 90px;
        height: 40px;
      }
      .reset{
        width: 90px;
        height: 40px;
      }
      .reset:hover{
        color: red;
        border:1px solid red;
        background-color:rgba(255,0,0,0.1);
      }
    }
  }
  .main{
    padding: 28px;
    margin-top: 20px;
    background-color: #fff;
  .el-pagination{
      display: flex;
      justify-content: center;
      padding-top: 20px;
      width: 100%;
      padding-bottom: 40px;
      font-size: 18px;
    ::v-deep .el-pagination__total{
      color: black;
      font-size: 14px;
     }
     }
  }
}
</style>

<style lang="scss" scoped>
.order-list /deep/ .el-table td,
.el-table th {
  padding: 12px 0;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
  overflow: hidden;
}
</style>
