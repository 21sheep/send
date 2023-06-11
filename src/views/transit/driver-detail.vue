<!-- 司机详情 -->
<template>
  <div class="dashboard-container driver-detail">
    <div class="yemian">
      <template>
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="基本信息"
            name="first"
          >

            <el-form
              :label-position="labelPosition"
              label-width="100px"
              :model="formLabelAlign"
              size="mini"
              :inline="true"
            >
              <el-form-item
                label="员工编号："
                style="width:30%"
              >
                <el-input
                  v-model="formLabelAlign.userId"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="司机名称："
                style="width:30%"
              >
                <el-input
                  v-model="formLabelAlign.name"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="所属机构："
                style="width:30%"
              >
                <el-input
                  v-model="formLabelAlign.agency.name"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="电话："
                style="width:30%"
              >
                <el-input
                  v-model="formLabelAlign.mobile"
                  :disabled="true"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="年龄："
                style="width:30%"
              >
                <el-input
                  v-model="formLabelAlign.age"
                  :disabled="isedit"
                ></el-input>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane
            label="驾驶证信息"
            name="second"
          >
            <el-form
              :label-position="labelPosition"
              label-width="120px"
              :model="jiashiData"
              size="mini"
              :inline="true"
            >
              <el-form-item
                label="驾驶证号："
                style="width:30%"
              >
                <el-input
                  v-model="jiashiData.licenseNumber"
                  :disabled="isedit"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="准驾车型： "
                style="width:30%"
              >
                <el-input
                  v-model="jiashiData.allowableType"
                  :disabled="isedit"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="初次领证日期："
                style="width:30%"
              >

                <el-date-picker
                  v-model="jiashiData.initialCertificateDate"
                  :disabled="isedit"
                  type="date"
                  :class="isedit ? 'el-input__ion':''"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item
                label="驾驶证有效期限"
                style="width:30%"
              >
                <el-input
                  v-model="jiashiData.validPeriod"
                  :disabled="isedit"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="驾龄："
                style="width:30%"
              >
                <el-input
                  v-model="jiashiData.driverAge"
                  :disabled="isedit"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="驾驶证类型："
                style="width:30%"
              >
                <el-input
                  v-model="jiashiData.licenseType"
                  :disabled="isedit"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="从业资格证："
                style="width:30%"
              >
                <el-input
                  v-model="jiashiData.qualificationCertificate"
                  :disabled="isedit"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="入场证信息："
                style="width:30%"
              >
                <el-input
                  v-model="jiashiData.passCertificate"
                  :disabled="isedit"
                ></el-input>
              </el-form-item>
              <br>
              <el-form-item label="图片信息：">
                <template v-for="(item,index) in jiashiData.picture">
                  <div
                    v-if="jiashiData.picture"
                    :key="index"
                    class="read-example-box"
                  >
                    <img
                      :src="item"
                      style="width:150px;height:150px;margin-right:10px"
                      @mouseover="showIcons = true"
                      @mouseleave="showIcons = false"
                    />
                    <div
                      v-if="!isedit && showIcons"
                      class="icon-box"
                    >
                      <i
                        class="el-icon-zoom-in"
                        @click="handlePreview(item)"
                      ></i>
                      <i
                        class="el-icon-delete"
                        @click="handleRemove(item)"
                      ></i>
                    </div>
                    <i
                      v-if="isedit && showIcons"
                      class="el-icon-zoom-in"
                      @click="handlePreview(item)"
                    ></i>
                  </div>
                </template>
                <el-upload
                  v-if="!isedit"
                  multiple
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-upload"></i>
                </el-upload>
              </el-form-item>

            </el-form>
          </el-tab-pane>
        </el-tabs>
      </template>

    </div>
    <div class="edit">
      <el-button
        v-if="isedit"
        type="warning"
        @click="handleEdit"
      >编辑</el-button>
      <div v-else>
        <el-button
          type="warning"
          @click="handleSave"
        >保存</el-button>
        <el-button
          type="danger"
          @click="isedit = true"
        >取消</el-button>
      </div>
    </div>

  </div>
</template>
<script>
import { driverDetail, driverDetailUpdate, driverLicenseDetail } from '@/api/transit'
export default {
  data() {
    return {
      activeName: 'first',
      labelPosition: 'right',
      isjiben: true,
      isedit: true,
      jiashiData: {},
      dialogImageUrl: '',
      dialogVisible: false,
      formLabelAlign: {
        name: '',
        region: '',
        type: '',
        agency: ''
      }
    }
  },
  mounted() {
    this.getdata()
  },
  methods: {
    async  handleSave() {
      if (this.isjiben) {
        const res = await driverDetailUpdate(this.$route.query.id, this.formLabelAlign)
        if (res.code === 200) {
          this.$message.success('保存成功')
          this.isedit = true
        }
      } else {
        console.log(this.jiashiData)
        console.log('驾驶员')
      }
    },
    handleEdit() {
      this.isedit = false
      if (this.isjiben === true) {
        console.log(this.formLabelAlign)
      } else {
        console.log('驾驶员')
      }
    },
    async  handleClick(tab, event) {
      if (!tab.name || tab.name === 'first') {
        this.isjiben = true
      } else {
        this.isjiben = false
        const row = this.$route.query.id
        const res = await driverLicenseDetail(row)
        this.jiashiData = res.data
        const data = res.data.picture
        this.jiashiData.picture = data.split(',')
      }
    },
    async  getdata() {
      const row = this.$route.query.id
      const { data } = await driverDetail(row)
      this.formLabelAlign = data
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep  el-icon-date
{
  display: none;
}
::v-deep .el-form-item__content{
  display: inline-flex;
}
.edit{
  text-align: center;
  background-color: white;
  margin: 2px 20px;
  height: 10vh;
  line-height: 10vh;
}
::v-deep .el-input.is-disabled .el-input__inner{
  width: 200px;
}
::v-deep .el-tabs__active-bar{
  transition: transform 0s cubic-bezier(.645,.045,.355,1);
  background-color: #ff643d;

}
::v-deep .el-tabs__item.is-active{
  font-size: 17px;
  color: black;
  font-weight: 700;

}

.content{
  width: 100%;
  padding: 50px;
  height: 500px;
  font-size: 14px;

  background-color: white;
}
::v-deep .el-menu.el-menu--horizontal{
  padding-left: 50px;
}
::v-deep .el-menu-item{

  font-size: 17px;
  font-weight: 700;
}
.yemian{
  margin:  20px 20px 0px 20px;
  height: 75vh;
  padding: 20px 40px 0px 40px;
  background-color: white;
}
.active {
  color: #ff643d;
}
</style>

<style lang="scss" scoped>
label{
  font-weight: 400 !important;
}
.driver-detail {
    /deep/ .el-container{
    flex-direction: column;
    margin-left: 0px;

  }
  .in{
    height: calc(100vh - 205px);
  }
  .aside-box {
    background: #ffffff;
    border-radius: 4px;
    padding: 24px 37px 24px 37px;
    box-sizing: border-box;
    /deep/ .el-aside {
      padding-bottom: 14px;
      width: 100%!important;
      display: flex;
      background-color: #ffffff;
      border-bottom:1px solid #E5E7EC ;
      text-align: left;
      font-size: 14px;
      .aside-item {
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
