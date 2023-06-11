<!-- 车型管理 -->
<template>
  <div class="all">
    <div class="top">
      <span class="one">
        车型编号:
        <el-input
          v-model="typeObj.id"
          placeholder="请输入车型编号"
        ></el-input>
      </span>
      <span class="one">
        应载重量:
        <el-select
          v-model="typeObj.allowableLoad"
          placeholder="请选择应载重量"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </span>
      <span class="one">
        应载体积:
        <el-select
          v-model="typeObj.allowableVolume"
          placeholder="请选择应载体积"
        >
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </span>
      <span class="one">
        车辆类型:
        <el-input
          v-model="typeObj.name"
          placeholder="请输入车辆类型"
        ></el-input>
      </span>
      <el-button
        type="danger"
        class="two"
        @click="handleSearch"
      >搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>
    <div class="bottom">
      <el-button
        type="danger"
        class="three"
        @click="handleAdd('add')"
      >新增车型</el-button>

      <el-table
        v-loading="loading"
        element-loading-text="加载中"
        :data="tableData"
        border
        style="width: 98%"
      >
        <el-table-column
          label="序号"
          width="80"
        >
          <template slot-scope="scope">
            {{ currentIndex + scope.$index }}
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="车型编号"
          width="190"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="车辆类型"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="num"
          label="车型数量"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="allowableLoad"
          label="应载重量(吨)"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="allowableVolume"
          label="应载体积(立方米)"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="measureLong"
          label="长(米)"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="measureWidth"
          label="宽(米)"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="measureHigh"
          label="高(米)"
          width="120"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template v-slot="{row}">
            <el-button
              type="text"
              size="small"
              @click="handleEdit(row.id)"
            >编辑</el-button>  &nbsp;&nbsp;|
            <el-button
              type="text"
              size="small"
              class="four"
              @click="handleDel(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row
        type="flex"
        style="height:60px"
        align="middle"
        justify="center"
      >
        <el-pagination
          :current-page="typeObj.page"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="typeObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </el-row>
      <div class="five"></div>
    </div>

    <el-dialog
      :title="`${type === 'add' ? '新增' : '编辑'}车型`"
      :visible.sync="dialogFormVisible"
      width="500px"
      @close="handleCancel"
    >
      <el-form
        ref="CarDetailsData"
        :model="CarDetailsData"
        :rules="rules"
        size="small"
      >
        <el-form-item
          label="车辆类型"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="CarDetailsData.name"
            placeholder="请输入车辆类型"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="应载重量"
          :label-width="formLabelWidth"
          prop="allowableLoad"
        >
          <el-input
            v-model="CarDetailsData.allowableLoad"
            placeholder="请输入车型载重"
            autocomplete="off"
          ><span
            slot="suffix"
            class="six"
          >吨</span></el-input>
        </el-form-item>
        <el-form-item
          label="应载体积"
          :label-width="formLabelWidth"
          prop="allowableVolume"
        >
          <el-input
            v-model="CarDetailsData.allowableVolume"
            placeholder="请输入车型体积"
            autocomplete="off"
          ><span
            slot="suffix"
            class="six"
          >立方</span></el-input>
        </el-form-item>
        <el-form-item
          label="长"
          :label-width="formLabelWidth"
          prop="measureLong"
        >
          <el-input
            v-model="CarDetailsData.measureLong"
            autocomplete="off"
          ><span
            slot="suffix"
            class="six"
          >米</span></el-input>
        </el-form-item>
        <el-form-item
          label="宽"
          :label-width="formLabelWidth"
          prop="measureWidth"
        >
          <el-input
            v-model="CarDetailsData.measureWidth"
            autocomplete="off"
          ><span
            slot="suffix"
            class="six"
          >米</span></el-input>
        </el-form-item>
        <el-form-item
          label="高"
          :label-width="formLabelWidth"
          prop="measureHigh"
        >
          <el-input
            v-model="CarDetailsData.measureHigh"
            autocomplete="off"
          ><span
            slot="suffix"
            class="six"
          >米</span></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="danger"
          @click="handleConfirm"
        >确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="删除确认"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>确定要删除车型吗?</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="danger"
          @click="handleConfirmDel"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { list, add, update, detail, del } from '@/api/transit'
export default {
  data() {
    return {
      tableData: [],
      typeObj: {
        page: 1, // 页码
        pageSize: 10, // 页尺寸
        id: null, // 车型编号
        allowableLoad: '', // 应载重量
        allowableVolume: '', // 应载体积
        name: ''// 车辆类型
      },
      total: 0,
      options: [{
        value: 'RANGE_LEVEL_1',
        name: '<1.8（吨）'
      },
      {
        value: 'RANGE_LEVEL_2',
        name: '1.8-6（吨）'
      },
      {
        value: 'RANGE_LEVEL_3',
        name: '6-14（吨）'
      },
      {
        value: 'RANGE_LEVEL_4',
        name: '14-30（吨）'
      },
      {
        value: 'RANGE_LEVEL_5',
        name: '30-50（吨）'
      },
      {
        value: 'RANGE_LEVEL_6',
        name: '50-100（吨）'
      },
      {
        value: 'RANGE_LEVEL_7',
        name: '100>（吨）'
      }],
      options1: [{
        value: 'RANGE_LEVEL_1',
        name: '<3（m³）'
      },
      {
        value: 'RANGE_LEVEL_2',
        name: '3-5（m³）'
      },
      {
        value: 'RANGE_LEVEL_3',
        name: '5-10（m³）'
      },
      {
        value: 'RANGE_LEVEL_4',
        name: '10-15（m³）'
      },
      {
        value: 'RANGE_LEVEL_5',
        name: '15-30（m³）'
      },
      {
        value: 'RANGE_LEVEL_6',
        name: '30-50（m³）'
      },
      {
        value: 'RANGE_LEVEL_7',
        name: '50-80（m³）'
      },
      {
        value: 'RANGE_LEVEL_8',
        name: '80-150（m³）'
      },
      {
        value: 'RANGE_LEVEL_9',
        name: '150>（m³）'
      }],
      dialogFormVisible: false,
      dialogVisible: false,
      formLabelWidth: '90px',
      rules: {
        name: [{ required: true, message: '车辆类型不能为空', trigger: 'blur' }],
        allowableLoad: [{ required: true, message: '应载重量', trigger: 'blur' }],
        allowableVolume: [{ required: true, message: '应载体积', trigger: 'blur' }]
      },
      type: '',
      id: null,
      CarDetailsData: {
        name: '',
        allowableLoad: '',
        allowableVolume: '',
        measureLong: '0.0',
        measureWidth: '0.0',
        measureHigh: '0.0',
        goodsTypes: []
      },
      currentIndex: 1,
      loading: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      const res = await list(this.typeObj)
      this.tableData = res.data.items
      this.total = +res.data.counts
      this.loading = false
    },
    handleSizeChange(newPageSize) {
      this.typeObj.pageSize = newPageSize
      this.initData()
    },
    handleCurrentChange(newPage) {
      this.typeObj.page = newPage
      this.currentIndex = (newPage - 1) * this.typeObj.pageSize + 1
      this.initData()
    },
    handleAdd(type) {
      this.type = type
      this.dialogFormVisible = true
    },
    handleConfirm() {
      this.$refs.CarDetailsData.validate(async(valid) => {
        if (valid) {
          if (this.type === 'add') {
            const res = await add(this.CarDetailsData)
            console.log(res)
            this.$message.success('添加成功')
            this.handleCancel()
          } else {
            await update(this.id, this.CarDetailsData)
            this.$message.success('编辑成功')
            this.handleCancel()
          }
        }
      })
    },
    handleCancel() {
      this.initData()
      this.$refs.CarDetailsData.resetFields()
      this.dialogFormVisible = false
      this.id = null
      this.CarDetailsData = {
        name: '',
        allowableLoad: '',
        allowableVolume: '',
        measureLong: '0.0',
        measureWidth: '0.0',
        measureHigh: '0.0',
        goodsTypes: []
      }
    },
    async handleEdit(id) {
      this.type = 'edit'
      this.id = id
      const res = await detail(id)
      this.CarDetailsData = res.data
      this.dialogFormVisible = true
    },
    handleDel(id) {
      this.id = id
      this.dialogVisible = true
    },
    async handleConfirmDel() {
      await del(this.id)
      if (this.typeObj.page > 1 && this.tableData.length === 1) {
        this.typeObj.page--
      }
      this.$message.success('删除成功')
      this.dialogVisible = false
      this.initData()
    },
    handleSearch() {
      this.typeObj.name = this.typeObj.name
      this.typeObj.id = this.typeObj.id
      this.typeObj.allowableLoad = this.typeObj.allowableLoad
      this.typeObj.allowableVolume = this.typeObj.allowableVolume
      this.initData()
    },
    handleReset() {
      this.typeObj.name = ''
      this.typeObj.id = null
      this.typeObj.allowableLoad = ''
      this.typeObj.allowableVolume = ''
      this.initData()
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.all {
  width: 1290px;
  .top {
    width: 100%;
    height: 141px;
    background-color: #fff;
    margin: 20px;
    border-radius: 2%;
    .one {
      display: inline-block;
      margin-top: 20px;
      margin-left: 45px;
      margin-right: 45px;
      .el-input {
        width: 250px;
      }
      .el-select {
        width: 250px;
      }
    }
    .two {
      background-color: #e15536;
    }
    .el-button {
      width: 90px;
    }
  }
  .bottom {
    width: 100%;
    // height: 830px;
    background-color: #fff;
    margin: 20px;
    border-radius: 2%;
  }
}
.three {
  background-color: #e15536;
  margin: 30px;
}
.four {
  color: red;
}
.el-table {
  margin-left: 20px;
  margin-right: 20px;
}
.five {
  height: 25px;
}
.six {
  font-weight: 600;
  color: #000;
  margin-right: 10px;
}
.dialog-footer {
  text-align: center;
}
</style>
