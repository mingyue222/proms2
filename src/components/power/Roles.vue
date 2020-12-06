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
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" plain
              >编辑</el-button
            >
            <el-button size="mini" type="warning" icon="el-icon-delete" plain
              >删除</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-setting" plain @click="showRightDialog(scope.row)">权限管理</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%" @close='getRolesDiog'>
  <el-tree ref='treeRef' :data="rightList" :props="rightsListProps" show-checkbox default-expand-all node-key='id' :default-checked-keys='defKeys'></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRghts">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      rightList: [],
      rightsListProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      roleId: ''
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
    },
    //  点击权限管理是获取列表
    async showRightDialog (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.rightList = res.data
      this.roleId = role.id
      this.getLetKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 利用递归找到最底层的元素，即利用判断children属性判断在第几级
    getLetKeys (node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getLetKeys(item, arr))
    },
    // 监听这个数组 清空它
    getRolesDiog () {
      this.defKeys = []
    },
    // 点击添加角色的函数
    async setRghts () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const newKeys = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: newKeys })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.setRightDialogVisible = false
      this.defKeys = res.data
      this.getRolesList()
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
