<template>
  <div>
    <!-- 面包屑导航 -->
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
       <el-table
       :data="rightsList"
       border
    stripe
    style="width: 100%">
     <el-table-column
      type="index"
      label="#"
      width="180">
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径"
      width="180">
    </el-table-column>
    <el-table-column
      prop="level"
      label="权限等级">
      <template slot-scope="scope">
        <el-tag type="success" v-if="scope.row.level === '0'">权限一</el-tag>
        <el-tag type="info" v-else-if="scope.row.level === '1'">权限二</el-tag>
        <el-tag type="warning" v-else>权限三</el-tag>
      </template>
    </el-table-column>
  </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.rightsList = res.data
    }
  }
}
</script>

<style>
.box-card{
  margin-top: 20px;
}
</style>
