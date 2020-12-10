<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-alert title="注意：只允许第三级分类设置相关的参数" type="warning">
          </el-alert>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <span>商品分类：</span>
          <el-cascader
            v-model="selecedCateKeys"
            :options="paramsList"
            :props="paramsProps"
            @change="paramsChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">

        <!-- 用户动态面板 -->
        <el-tab-pane label="动态管理" name="many">
          <el-button type="primary" size="small" :disabled='isBtnDisabled' @click="addDialogVisible = true">添加参数</el-button>
                  <!-- 动态参数需要渲染的表格 -->
          <el-table :data="manyTabData"  stripe border >
            <el-table-column  type="expand" >
              <template slot-scope="scope">
                <!-- 循环渲染tag标签部分 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close='deleteHandleParams(i, scope.row)'>{{item}}</el-tag>
                <!-- 文本框输入部分 -->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                </el-input>
                <!-- 点击输入文本框的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column  type="index" > </el-table-column>
            <el-table-column  prop="attr_name" label="参数名称" > </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" size="small" icon="el-icon-edit" @click="showEidtForm(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteParams (scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

          <!-- 用户静态管理面板 -->
        <el-tab-pane label="静态管理" name="only">
          <el-button type="primary" size="small" :disabled='isBtnDisabled' @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态属性需要渲染的表格 -->
          <el-table :data="onlyTabData"  stripe border>
            <el-table-column  type="expand" >
                          <template slot-scope="scope">
                <!-- 循环渲染tag标签部分 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close='deleteHandleParams(i, scope.row)'>{{item}}</el-tag>
                <!-- 文本框输入部分 -->
                <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                </el-input>
                <!-- 点击输入文本框的按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>

            </el-table-column>
            <el-table-column  type="index" > </el-table-column>
            <el-table-column  prop="attr_name" label="属性名称" > </el-table-column>
            <el-table-column label="操作" >
              <template>
                <el-button type="primary" size="small" icon="el-icon-edit" @click="showEidtForm(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteParams (scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 点击添加时弹出的对话框 -->
    <el-dialog :title="'添加' + addTitle " :visible.sync="addDialogVisible"
  width="50%" @close='addDialogClose'>
  <!-- 对话框中的form表单 -->
  <el-form :model="addForm" :rules="addRules" ref="addRefForm" label-width="100px" class="demo-ruleForm">
    <el-form-item :label="addTitle" prop="attr_name">
      <el-input v-model="addForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addFormData">确 定</el-button>
  </span>
</el-dialog>

<!-- 点击编辑时弹出的对话框 -->
    <!-- 点击添加时弹出的对话框 -->
    <el-dialog :title="'添加' + addTitle " :visible.sync="editDialogVisible"
  width="50%" @close='editDialogClose'>
  <!-- 对话框中的form表单 -->
  <el-form :model="editForm" :rules="editRules" ref="editRefForm" label-width="100px" class="demo-ruleForm">
    <el-form-item :label="addTitle" prop="attr_name">
      <el-input v-model="editForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editFormData">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      paramsList: [],
      selecedCateKeys: [],
      paramsProps: {
        expandTrigger: 'hover',
        children: 'children',
        label: 'cat_name',
        value: 'cat_id'
      },
      activeName: 'many',
      // 动态参数的数据
      manyTabData: [],
      // 静态属性的数据
      onlyTabData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addRules: {
        attr_name: [
          { required: true, message: '请输入添加名称', trigger: 'blur' }
        ]
      },

      // 点击编辑时对话框的展示与隐藏
      editDialogVisible: false,
      // 点击编辑时表单数据
      editForm: {
        attr_name: ''
      },
      // 点击编辑时验证规则
      editRules: {
        attr_name: [
          { required: true, message: '请输入添加名称', trigger: 'blur' }
        ]
      }
      // // 判断input文本输入框的打开与否
      // inputVisible: false,
      // // 文本框双向绑定的数据
      // inputValue: ''

    }
  },
  created () {
    this.getParamsList()
  },
  methods: {
    async getParamsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.paramsList = res.data
    },
    // 级联框发生改变时监听事件
    paramsChange () {
      if (this.selecedCateKeys.length !== 3) {
        this.selecedCateKeys = []
        this.manyTabData = []
        this.onlyTabData = []
        return
      }
      // console.log(this.selecedCateKeys)
      // 当级联框选在选到三级分类式对应的动态属性和静态的数据渲染
      this.tabsParams()
    },
    // tabs标签页点击事件
    handleTabsClick () {
      // console.log(this.activeName)
      this.tabsParams()
    },
    // 定义一个函数当tabs切换时候不管是静态还是动态都能获取到数据从而渲染
    async tabsParams () {
      const { data: res } = await this.$http.get(`categories/${this.paramsId}/attributes`,
        { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 解决input框的联动问题
        // 判断input文本输入框的打开与否
        item.inputVisible = false
        // 文本框双向绑定的数据
        item.inputValue = ''
      })
      // console.log(res.data)

      // 判断tabs标签页选中的是动态管理还是静态管理从而对其进行对应渲染数据
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },

    // 当我们点击添加弹出对话框后 取消或者确定对话框都需要清空重置对话框的表单
    addDialogClose () {
      this.$refs.addRefForm.resetFields()
    },
    // 当我们点击弹出对话框中的确定按钮时 即向服务器发起请添加数据的请求
    addFormData () {
      // 首先对表单进行预验证
      this.$refs.addRefForm.validate(async valid => {
        if (!valid) return this.$message.error('表单验证不通过')
        const { data: res } = await this.$http.post(`categories/${this.paramsId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addDialogVisible = false
        this.tabsParams()
      })
    },
    // 当点击修改按钮时弹出对话框 并发起获取数据的对话框
    async showEidtForm (paramsInfo) {
      const { data: res } = await this.$http.get(`categories/${this.paramsId}/attributes/${paramsInfo.attr_id}`,
        { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 当我们点击添加弹出对话框后 取消或者确定对话框都需要清空重置对话框的表单
    editDialogClose () {
      this.$refs.editRefForm.resetFields()
    },
    editFormData () {
      // 首先对表单进行预验证
      this.$refs.editRefForm.validate(async valid => {
        if (!valid) return this.$message.error('表单验证不通过')
        const { data: res } = await this.$http.put(`categories/${this.paramsId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.tabsParams()
      })
    },
    // 删除属性
    async deleteParams (paramsId) {
      const confimRes = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)

      if (confimRes !== 'confirm') {
        return this.$message.error('您取消了删除')
      }

      const { data: res } = await this.$http.delete(
        `categories/${this.paramsId}/attributes/${paramsId.attr_id}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.$message.success(res.meta.msg)
      this.tabsParams()
    },
    // 点击tag中+ New Tag的按钮事件(按钮变成输入框)
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 当键盘按下enter键或者鼠标失去焦点时input框变成按钮
    async handleInputConfirm (row) {
      // 如果input输入框中添加了许多的空格，那么失去焦点时候就要清空这些空格
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 需要发起请求，保存这次的操作
      this.saveAttr_vals(row)
    },
    // 将对 attr_vals的操作保存的数据中
    async saveAttr_vals (row) {
      // 需要发起请求，保存这次的操作
      const { data: res } = await this.$http.put(`categories/${this.paramsId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.$message.success(res.meta.msg)
    },
    // 点击x时删除对应的参数
    deleteHandleParams (i, row) {
      row.attr_vals.splice(i, 1)
      // 需要发起请求，保存这次的操作
      this.saveAttr_vals(row)
    }

  },
  computed: {
    // 判断动态或者静态属性是否被打开的计算属性
    isBtnDisabled () {
      if (this.selecedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 在计算属性中判断 当前选中的三级分类id、
    paramsId () {
      if (this.selecedCateKeys.length === 3) {
        return this.selecedCateKeys[2]
      }
      return null
    },
    addTitle () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 18px;
}
.el_tag {
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>
