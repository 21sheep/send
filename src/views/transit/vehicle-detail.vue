<!-- 车辆详情 -->
<template>
  <div
    class="dashboard-container vehicle-detail"
  >

  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.active {
  color: #ff643d;
}
</style>

<style lang="scss" scoped>
.vehicle-detail {
  /deep/ .el-container{
    flex-direction: column;
    margin-left: 0px;

  }
  .in{
    height: calc(100vh - 205px);
    // height: 100%;
  }
  .aside-box {
    background: #ffffff;
    border-radius: 4px;
    // width: 150px;
    padding: 24px 37px 24px 37px;
    box-sizing: border-box;

    // min-height: calc(100vh - 50px);
    /deep/ .el-aside {
      padding-bottom: 14px;
      width: 100%!important;
      display: flex;
      background-color: #ffffff;
      border-bottom:1px solid #E5E7EC ;
      text-align: left;
      font-size: 14px;
      .aside-item {
        // margin-top: 38px;
        cursor: pointer;
        &:first-child {
          margin-right: 53px;
          padding-left: 25px;

        }
      }
      .aside-item.active{
        font-size: 16px;
        font-weight: bold;
        color: #20232A;
        &:after{
          content: '';
          display: block;
          background-color:#E15536 ;
          height: 3px;
          width: 49px;
          margin: 0 auto;
          position: relative;
          top: 14px;
        }
      }
    }
  }
}
</style>
