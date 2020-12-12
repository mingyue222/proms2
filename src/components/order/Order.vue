<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
      <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border tyle="width: 100%">
        <el-table-column type="index"  width="180"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="180">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === 1">已付款</el-tag>
            <el-tag type="warning" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="180">
          <template slot-scope="scope">
            {{scope.row.is_send}}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180"> </el-table-column>
        <el-table-column  label="操作" width="180">
          <template>
            <el-button type="primary" icon="el-icon-edit" circle @click="showCity"></el-button>
            <el-button type="primary" icon="el-icon-location" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.pagenum"
      :page-sizes="[5, 15, 30, 50]"
      :page-size="query.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 点击编辑按钮的弹窗 -->
    <el-dialog
      title="地区"
      :visible.sync="orderDialogVisible"
      width="50%">
      <el-form ref="form" label-width="80px">
        <el-form-item label="省市/县">
            <el-cascader
            v-model="selecteKeys"
            :options="dayjs"
            @change="handleChange">
            </el-cascader>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import dayjs from './citydata.js'
export default {
  name: 'roders',
  data () {
    return {
      orderList: [],
      query: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderDialogVisible: false,
      selecteKeys: [],
      dayjs: dayjs
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.query })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      console.log(res)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 页面发生改变时
    handleSizeChange (value) {
      this.pagesize = value
      this.getOrderList()
    },
    handleCurrentChange (value) {
      this.pagenum = value
      this.getOrderList()
    },
    showCity () {
      this.orderDialogVisible = true
    },
    handleChange () {
      console.log(this.selecteKeys)
    }
  }

}
</script>

<style lang="less" scoped>
.el-pagination{
  text-align: center;
}
</style>
