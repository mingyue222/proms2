<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-input placeholder="请输入内容" v-model="query.query" clearable @clear='clearInput'>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="primary" plain @click="addGoods">添加</el-button>
      <!-- // 表格区 -->
      <el-table :data="goodsList"  stripe border style="width: 100%">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）" > </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" > </el-table-column>
        <el-table-column prop="add_time" label="发布时间" >
          <template slot-scope="scope">
            {{scope.row.add_time | time}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="success" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="warning" size="mini" icon="el-icon-delete" @click="deletGoods(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.pagenum"
      :page-sizes="[5, 15, 20, 30]"
      :page-size="query.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      query: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.query })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.goodsList = res.data.goods
      this.total = res.data.total
      console.log(this.goodsList)
    },
    handleSizeChange (value) {
      this.query.pagesize = value
      this.getGoodsList()
    },
    handleCurrentChange (value) {
      this.query.pagenum = value
      this.getGoodsList()
    },
    // 点击x号产生的clear事件
    clearInput () {
      this.query.query = ''
      this.getGoodsList()
    },
    // 点击删除数据
    async deletGoods (goodsId) {
      const confirmRef = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRef !== 'confirm') return this.$message.error('取消了删除')
      const { data: res } = await this.$http.delete(`goods/${goodsId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },
    addGoods () {
      this.$router.push('/goods/addGoods')
    }
  }
}
</script>

<style lang="less" scoped>
.el-input{
  width: 500px;
}
.el-pagination{
  text-align: center;
}
</style>
