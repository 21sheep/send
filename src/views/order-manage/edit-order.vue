<!-- 订单详情 -->
<template>
  <div class="dashboard-container edit-order">
    <div class="app-container">
      <div class="head">
        <div class="dingdanbianhao">
          <span>订单编号：</span>
          <span class="text">{{ detailList.id }}</span>
        </div>
        <div class="yundan">
          <span>运单编号：</span>
          <span class="text">{{ detailList.newTransportOrder }}</span>
        </div>
        <div class="xiadantime">
          <span>下单时间：</span>
          <span class="text">{{ detailList.createTime }}</span>
        </div>
        <div class="zhuangtai">
          <span>订单状态：</span>
          <span class="text">{{ detailList.status===23000?'待取件':detailList.status===23001?'已取件':detailList.status===23002?'网点自寄'
            :detailList.status===2004?'待装车':detailList.status===23005?'运输中':detailList.status===23006?'网点出库'
              :detailList.status===23007?'待派送':detailList.status===23008?'派送中'
                :detailList.status===23009?'已签收':detailList.status===23010?'拒收':'已取消' }}</span>
        </div>
        <div class="daodatime">
          <span>预计到达时间：</span>
          <span class="text">{{ detailList.estimatedArrivalTime }}</span>
        </div>
      </div>
      <el-collapse v-model="activeName">
        <el-collapse-item
          title="基本信息"
          name="1"
        >
          <div class="jibeninfo">
            <div class="fahuo">
              <div class="fatop"><span
                class="iconfont icon-didian1"
                style="color:blue"
              ></span>发货方</div>
              <div class="famain">
                <div class="namedizhi">
                  <div>发货方姓名：<span class="xuan">{{ detailList.senderName }}</span></div>
                  <div>发货方地址：<span class="xuan">{{ detailList.newSenderWhere }}</span></div>
                </div>
                <div class="dianhuadizhi">
                  <div>发货方电话：<span class="xuan">{{ detailList.senderPhone }}</span></div>
                  <div>详细地址：<span class="xuan">{{ detailList.senderAddress }}</span></div>
                </div>
              </div>
            </div>
            <div class="shouhuo">
              <div class="fatop"><span
                class="iconfont icon-dangqianweizhi_miaozhun_dingwei"
                style="color:red"
              ></span>收货方</div>
              <div class="famain">
                <div class="namedizhi">
                  <div>收货方姓名：<span class="xuan">{{ detailList.receiverName }}</span></div>
                  <div>收货方地址：<span class="xuan">{{ detailList.newReceiverWhere }}</span></div>
                </div>
                <div class="dianhuadizhi">
                  <div>收货方电话：<span class="xuan">{{ detailList.receiverPhone }}</span></div>
                  <div>详细地址：<span class="xuan">{{ detailList.receiverAddress }}</span></div>
                </div>
              </div>
            </div>
            <div class="juli">
              <div class="fatop"><span
                class="iconfont icon-qizi"
                style="color:orange"
              ></span><span>距离：<span>{{ detailList.distance }}km</span></span></div>
              <div
                class="faunder"
                style="margin-top:25px"
              ><span class="beizhu">备注：</span>{{ detailList.mark!=null?detail.mark:'暂无' }}<span></span></div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-collapse
        v-if="detailList.transportOrderPointVOS"
        v-model="activeName"
      >
        <el-collapse-item
          title="订单跟踪"
          name="2"
        >
          <div class="dingdangenzong"> </div>
        </el-collapse-item>
      </el-collapse>

      <el-collapse
        v-if="detailList.transportOrder"
        v-model="activeName"
      >
        <el-collapse-item
          title="订单轨迹"
          name="3"
        >
          <div class="dindanguiji">
            <MapGuide />
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-collapse
        v-if="detailList.taskPickup"
        v-model="activeName"
      >
        <el-collapse-item
          title="取件信息"
          name="4"
        >
          <div class="qujianinfo">
            <div class="dingdanbianhao">
              <span>所在网点：</span>
              <span class="text">{{ detailList.newQujian }}</span>
            </div>
            <div class="yundan">
              <span>取件类型：</span>
              <span class="text">{{ detailList.pickupType===1?'网店自寄':'上门取件' }}</span>
            </div>
            <div class="xiadantime">
              <span>作业状态：</span>
              <span class="text">{{ detailList.newQujianStatus===2?'已完成':'已取消' }}</span>
            </div>
            <div class="zhuangtai">
              <span>取件快递员：</span>
              <span class="text">{{ detailList.newQujianCourier }}</span>
            </div>
            <div class="daodatime">
              <span>快递员电话：</span>
              <span class="text">{{ detailList.newQujianMobile }}</span>
            </div>
            <div class="daodatime">
              <span>预计取件时间：</span>
              <span class="text">{{ detailList.newQujianEstimatedStartTime }}</span>
            </div>
            <div class="daodatime">
              <span>取件完成时间：</span>
              <span class="text">{{ detailList.newQujianActualEndTime }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-collapse
        v-if="detailList.taskDispatch"
        v-model="activeName"
      >
        <el-collapse-item
          title="派送信息"
          name="5"
        >
          <div class="paisonginfo">
            <div class="dingdanbianhao">
              <span>所在网点：</span>
              <span class="text">{{ detailList.newPaijian }}</span>
            </div>
            <div class="yundan">
              <span>作业状态：</span>
              <span class="text">{{ detailList.newPaijianStatus }}</span>
            </div>
            <div class="xiadantime">
              <span>派单快递员：</span>
              <span class="text">{{ detailList.newPaijianCourier }}</span>
            </div>
            <div class="zhuangtai">
              <span>快递员电话：</span>
              <span class="text">{{ detailList.newPaijianMobile }}</span>
            </div>
            <div class="zhuangtai">
              <span>预计派送时间：</span>
              <span class="text">{{ detailList.newPaijianEstimatedStartTime }}</span>
            </div>
            <div class="zhuangtai">
              <span>派件完成时间：</span>
              <span class="text">{{ detailList.newPaijianActualEndTime }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-collapse
        v-model="activeName"
      >
        <el-collapse-item
          title="费用信息"
          name="6"
        >
          <div class="feiyonginfo">
            <div class="yunfei">
              <span>运费：</span>
              <span class="qian">{{ detailList.amount }}</span>
              <span class="yuan">元</span>
            </div>
            <div class="paychose">
              <span>支付方式：</span>
              <span class="yuan">{{ detailList.paymentMethod===1?'预结':'到付' }}</span>
            </div>
            <div class="payinfo">
              <span>付款状态：</span>
              <span class="yuan">{{ detailList.paymentStatus===1?'未付':'已付' }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-collapse
        v-model="activeName"
      >
        <el-collapse-item
          title="货品信息"
          name="7"
        >
          <div class="huopininfo">
            <template>
              <el-table
                :data="detailList.orderCargoDTOS"
                stripe
                style="width: 100%"
                show-summary
              >
                <el-table-column
                  label="序号"
                  width="60"
                  type="index"
                >
                </el-table-column>
                <el-table-column
                  label="货品名称"
                  width="236"
                >
                  <template v-slot="{row}">
                    <span v-if="row.isEdit">{{ row.name }}</span>
                    <el-input
                      v-else
                      v-model="row.name"
                      width="80px"
                    >
                    </el-input></template>
                </el-table-column>
                <el-table-column
                  label="货品类型"
                  width="236"
                >
                  <template v-slot="{row}">
                    <span v-if="row.isEdit">{{ row.goodsTypename }}</span>
                    <el-select
                      v-else
                      v-model="row.goodsTypename"
                      width="80px"
                      @change="changeGoodType(row)"
                    >
                      <el-option
                        v-for="item in goodList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name "
                      ></el-option>
                    </el-select></template>
                </el-table-column>
                <el-table-column
                  label="重量（千克）"
                  width="236"
                  prop="totalWeight"
                >
                  <template v-slot="{row}">
                    <span v-if="row.isEdit">{{ row.totalWeight }}</span>
                    <el-input
                      v-else
                      v-model="row.totalWeight"
                      width="80px"
                    >
                    </el-input></template>
                </el-table-column>
                <el-table-column
                  label="体积（立方）"
                  width="236"
                  prop="totalVolume"
                >
                  <template v-slot="{row}">
                    <span v-if="row.isEdit">{{ row.totalVolume }}</span>
                    <el-input
                      v-else
                      v-model="row.totalVolume"
                      width="80px"
                    >
                    </el-input></template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="操作"
                >
                  <template v-slot="{row}">
                    <el-button
                      type="text"
                      size="small"
                      @click="changeIsedit(row)"
                    >{{ !row.isEdit?'保存':'编辑' }}</el-button>
                    <el-button
                      type="text"
                      size="small"
                      @click="deleteGoods(row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="lastdiv"></div>
    </div>
  </div>
</template>
<script>
import { orderDetail, getGoodsType, updateGoods, delGoods } from '@/api/order'
import MapGuide from '@/views/order-manage/map-guide.vue'
export default {
  components: {
    MapGuide
  },
  data() {
    return {
      activeName: ['1', '2', '3', '4', '5', '6', '7'],
      queryId: null,
      detailList: {},
      goodList: [],
      form: {
        cargoBarcode: '',
        cargoValue: null,
        id: null,
        orderId: null,
        goodsTypeId: null,
        name: '',
        quantity: null,
        remark: '',
        totalVolume: null,
        totalWeight: null,
        unit: '',
        volume: null,
        weight: null

      }
    }
  },
  created() {
    this.queryId = this.$route.query.orderId
    this.initDetail()
  },
  methods: {
    async initDetail() {
      const res = await orderDetail(this.queryId)
      console.log(res)
      const yundan = res.data.transportOrder ? res.data.transportOrder.id : '————'
      const newSenderWhere = `${res.data.senderProvince.name}${res.data.senderCity.name}${res.data.senderCounty.name}`
      const newReceiverWhere = `${res.data.receiverProvince.name}${res.data.receiverCity.name}${res.data.receiverCounty.name}`
      const newPaijian = res.data.taskDispatch !== null ? res.data.taskDispatch.agency.name : ''
      const newPaijianStatus = res.data.taskDispatch !== null ? res.data.taskDispatch.status : ''
      const newPaijianCourier = res.data.taskDispatch !== null ? res.data.taskDispatch.courier.name : ''
      const newPaijianMobile = res.data.taskDispatch !== null ? res.data.taskDispatch.courier.mobile : ''
      const newPaijianEstimatedStartTime = res.data.taskDispatch !== null ? res.data.taskDispatch.estimatedStartTime : ''
      const newPaijianActualEndTime = res.data.taskDispatch !== null ? res.data.taskDispatch.actualEndTime : ''
      const newQujian = res.data.taskPickup !== null ? res.data.taskPickup.agency.name : ''
      const newQujianStatus = res.data.taskPickup !== null ? res.data.taskPickup.status : ''
      const newQujianCourier = res.data.taskPickup !== null ? res.data.taskPickup.courier.name : ''
      const newQujianMobile = res.data.taskPickup !== null ? res.data.taskPickup.courier.mobile : ''
      const newQujianEstimatedStartTime = res.data.taskPickup !== null ? res.data.taskPickup.estimatedStartTime : ''
      const newQujianActualEndTime = res.data.taskPickup !== null ? res.data.taskPickup.actualEndTime : ''
      const newData = { ...res.data, newTransportOrder: yundan, newSenderWhere, newReceiverWhere, newPaijian, newQujian, newPaijianStatus, newQujianStatus, newPaijianCourier, newPaijianEstimatedStartTime,
        newPaijianActualEndTime, newQujianCourier, newPaijianMobile, newQujianMobile,
        newQujianEstimatedStartTime, newQujianActualEndTime }
      newData.orderCargoDTOS.length !== [] ? newData.orderCargoDTOS.forEach(item => {
        item.isEdit = true
        item.goodsTypename = item.goodsType.name
      }) : newData.orderCargoDTOS
      this.detailList = newData
      console.log(this.detailList)
    },
    changeGoodType(row) {
      row.goodsType.name = row.goodsTypename
    },
    async changeIsedit(row) {
      row.isEdit = !row.isEdit
      const res = await getGoodsType()
      this.goodList = res.data
      this.form.orderId = this.detailList.id
      this.form.goodsTypeId = row.goodsType.id
      console.log(this.form.goodsTypeId)
      this.form.totalVolume = row.totalVolume
      this.form.totalWeight = row.totalWeight
      this.form.name = row.name
      if (row.isEdit) {
        await updateGoods(row.id, this.form)
      }
    },
    async deleteGoods(row) {
      await delGoods(row.id)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import './index.scss';
.app-container{
    padding: 20px;
    background-color: #f3f4f7;
    padding-top: 23px;
    .head{
      padding: 15px 44px;
    padding-right: 0;

    }
    .head,
    .qujianinfo,
    .paisonginfo{
      background-color: #fff;
    padding-right: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    .dingdanbianhao,
    .yundan,
    .xiadantime,
    .zhuangtai,
    .daodatime{
      span{
        display: inline-block;
        font-size: 14px;
        font-weight: 100;
      }
      .text{
        color: #818693;
      }
      width: 25%;
      height: 40px;
      line-height: 40px;
    }
    }
    .feiyonginfo{
      background-color: #fff;
      padding-right: 0;
      display: flex;
      justify-content: start;
      align-items: center;
      font-size: 16px;
      .yunfei,
      .paychose,
      .payinfo{
        width: 33%;
        .qian{
          color: #ffb302;
        }
        .yuan{
          color: #818693;
        }
      }
    }
    .huopininfo{
      background-color: #fff;
    }
    .jibeninfo{
       background-color: #fff;
    padding-right: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 16px;
    .fahuo,
    .shouhuo{
      width: 100%;
      height: 110px;
      margin-bottom: 10px;
      .fatop{
        height: 25px;
        line-height: 25px;
        .icon-Dditu{
          margin-right: 15px;
          color: #105bde;
          font-size: 20px;
        }
        .icon-aim{
          color: #cf4141;
          margin-right: 15px;
          font-size: 20px;
        }

      }
      .famain{
        height: 65px;
        display: flex;
        margin-top: 10px;
        .namedizhi,
        .dianhuadizhi{
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin: 0 50px;
          span{
            color: #818693;
          }
        }
      }
      .faunder{
        display: inline-block;
        margin-top: 20px;
      }
    }
    .juli{
      height: 65px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
        .icon-qizhi{
          color: #ffb302;
          margin-right: 15px;
          font-size: 20px;
        }
        .beizhu{
          margin-left: 15px;
        }
    }
    }
    .dingdangenzong{
      width: 100%;
      // height: 20px;
      background-color: #fff;
    }
    .dindanguiji{
      background-color: #fff;
    }
    .lastdiv{
      height: 60px;
    }
   ::v-deep .el-input__inner,
   .el-select__inner {
    height: 28px;
    line-height: 28px !important;
  }
  ::v-deep .el-input__icon{
  line-height: 28px !important;
  }
}
</style>
