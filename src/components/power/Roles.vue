<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="info">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <el-table :data="rolesList" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['border-b', index1 === 0 ? 'border-t ' : '', 'vcenter']"
              v-for="(item, index1) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightsById(scope.row, item.id)" closable>{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0 ? '' : 'border-b', 'vcenter']"
                  v-for="(item1, index2) in item.children"
                  :key="item1.id"
                >
                  <el-col :span="5">
                    <el-tag type="success" @close="removeRightsById(scope.row, item1.id)" closable>{{ item1.authName }}
                      <i class="el-icon-caret-right"></i>
                    </el-tag>
                  </el-col>
                  <el-col :span="19"
                    ><el-tag
                      type="danger"
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    ></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="主管"> </el-table-column>
        <el-table-column prop="roleDesc" label="技术负责人"> </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="">
            <el-button size="mini" type="primary" icon="el-icon-edit" plain
              >编辑</el-button
            >
            <el-button size="mini" type="warning" icon="el-icon-delete" plain
              >删除</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-setting" plain
              >权限管理</el-button
            >
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
      rolesList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取roles列表的函数
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.rolesList = res.data
    },
    async removeRightsById (role, rightId) {
      const confirmRes = await this.$confirm(
        '检测到表单的内容，是否永久删除？',
        '确认信息',
        {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '放弃删除',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmRes !== 'confirm') return this.$message.error('删除失败')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }

      this.$message.success('删除成功！')
      // this.getRolesList()
      // 如果直接调用上面的方法，会造成页面的重绘，页面会刷新，这不符合需求
      // 我们需要的是：删除以后，展开行不闭合
      // 因为 role 和 scope.row 在同一个内存空间，role 改变以后， scope.row 也会改变
      // 因此我们将后台返回的最新的权限数据赋值给 role.children 即可
      role.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 7px;
}
.border-b {
  border-bottom: 1px solid #eee;
}
.border-t {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
