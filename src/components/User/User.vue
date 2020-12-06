<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <div>
        <el-row :gutter="20">
          <el-col :span="10">
            <!-- 输入框区域 -->
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="info" @click="dialogVisible = true"
              >添加用户</el-button
            >
          </el-col>
        </el-row>
        <el-table :data="userList" style="width: 100%" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column
            align="center"
            label="姓名"
            prop="username"
          ></el-table-column>
          <el-table-column
            align="center"
            label="邮箱"
            prop="email"
          ></el-table-column>
          <el-table-column
            align="center"
            label="电话"
            prop="mobile"
          ></el-table-column>
          <el-table-column
            align="center"
            label="角色"
            prop="role_name"
          ></el-table-column>
          <el-table-column align="center" label="状态" prop="mg_state">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStateChanged(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <!-- 编辑按钮 -->
              <el-button
                size="small"
                icon="el-icon-edit"
                type="primary"
                plain
                @click="editButton(scope.row.id)"
              ></el-button>
              <el-button
                size="small"
                icon="el-icon-delete"
                type="warning"
                @click="deletForm(scope.row.id)"
                plain
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配权限"
                placement="top"
                :enterable="false"
              >
                <el-button
                  size="small"
                  icon="el-icon-s-tools"
                  type="warning"
                  plain
                  @click="getEaidtRightsDio(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>

        <!-- 点击添加 消息弹出的对话框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="dialogVisible"
          width="30%"
          @close="restAddForm"
        >
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addruleForm"
            label-width="100px"
          >
            <el-form-item label="用户" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 点击编辑的弹出框 -->
        <el-dialog
          title="修改"
          :visible.sync="dialogAdit"
          width="50%"
          @click="editRestForm"
        >
          <el-form
            :model="editForm"
            :rules="editRules"
            ref="editRuleForm"
            label-width="100px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogAdit = false">取 消</el-button>
            <el-button type="primary" @click="toEdit()">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 点击分配权限时的弹窗 -->
        <el-dialog
          title="用户权限"
          :visible.sync="getDialogVisible"
          width="50%">
          <div>
            <p>当前的用户：{{ userInfo.username }}</p>
            <p>当前的角色：{{ userInfo.role_name }}</p>
            <p>配置角色：
               <el-select v-model="selectRoleId" placeholder="请选择">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id">
                </el-option>
              </el-select>
            </p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="getDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="savaRoleInfo"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法的邮箱'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      userList: [],
      total: 0,
      dialogVisible: false,
      // 新增表单进行数据绑定
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输密码', trigger: 'blur' },
          {
            min: 6,
            max: 19,
            message: '长度在 6 到 19 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 用来获取表单的数据
      addruleForm: {},
      dialogAdit: false,
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editRules: {
        username: [
          { required: true, message: '请输用户名', trigger: 'blur' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入正确的手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      getDialogVisible: false,
      userInfo: {},
      roleList: [],
      selectRoleId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取列表数据
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize 改变的事件
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 监听pagenum 页码值 改变的事件
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },

    // 添加表单中点击取消，清空表单
    restAddForm () {
      this.$refs.addruleForm.resetFields()
    },
    // 点击确定时进行表单预验证
    addUser () {
      this.$refs.addruleForm.validate(async (valid) => {
        if (!valid) return
        // 发起添加数据的请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 点击编辑小按钮时的操作
    async editButton (id) {
      this.dialogAdit = true
      // console.log(id)
      // 根据id查询用户
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.editForm = res.data
      this.dialogAdit = true
    },
    // 监听编辑按钮中取消或者点击其他位置时重置表单
    editRestForm () {
      this.$refs.editRuleForm.resetFields()
    },
    // 修改用户信息并修改
    toEdit () {
      // 对表单进行预校验
      this.$refs.editRuleForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          this.editForm
        )
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.dialogAdit = false
        this.getUserList()
      })
    },

    // 根据id删除用户表单
    async deletForm (id) {
      console.log(id)
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
      console.log(confirmRes)
      if (confirmRes !== 'confirm') return
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
    },
    // 点击分配按钮时获得获得权限数据
    async getEaidtRightsDio (userInfo) {
      this.userInfo = userInfo
      this.getDialogVisible = true
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.roleList = res.data
    },
    // 点击按钮分配角色
    async savaRoleInfo () {
      if (!this.selectRoleId) return this.$message.error('请选择要分配的角色')
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getUserList()
      this.getDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
}
</style>
