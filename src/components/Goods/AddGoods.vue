<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert title="警告提示的文案" type="warning" center  show-icon></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeName - 0" align-center>
        <el-step title="基本信息" ></el-step>
        <el-step title="商品参数" ></el-step>
        <el-step title="商品属性" ></el-step>
        <el-step title="商品内容" ></el-step>
        <el-step title="完成" ></el-step>
      </el-steps>

      <!-- 给tabs标签包裹一个form表单 -->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsFormRef" label-width="100px" >
        <!-- tabs标签页 -->
        <el-tabs v-model="activeName" tab-position="left" :before-leave='beforeLeave' @tab-click='changeTabsHandle' style="height: 500px;">
          <el-tab-pane label="用户管理" name="0">

            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name" ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" ></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" ></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addGoodsForm.goods_cat"
                :options="AddGoodsList"
                :props="cascaderProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数"  name="1">配置管理
            <el-form-item :label='item.attr_name' v-for="item in manyData " :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label='item1' v-for="(item1, index1) in item.attr_vals " :key="index1" ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性"  name="2">
            <el-form-item :label='item.attr_name' v-for="item in onlyData " :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品图片"  name="3">定时任务补偿
            <el-upload
              action="http://8.131.91.46:7000/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture" :headers='headersObj' :on-success='noSuccess'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容"  name="4">
            <quill-editor v-model="addGoodsForm.goods_introduce" />
            <el-button type="primary" round @click="pushAddGoods">添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片弹框 -->
    <el-dialog
      :visible.sync="pictureDialogVisible"
      width="50%" >
      <img :src="previewPath" alt="">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeName: 0,
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addGoodsRules: {
        goods_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      AddGoodsList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyData: [],
      onlyData: [],
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      pictureDialogVisible: false,
      previewPath: ''

    }
  },
  created () {
    this.getAddGoodsList()
  },
  methods: {
    async getAddGoodsList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.AddGoodsList = res.data
    },
    // d当切换tabs时触发的方法
    beforeLeave (activeName, oldActiveName) {
      if (this.addGoodsForm.goods_cat.length !== 3 && oldActiveName === '0') {
        this.$message.error('请选择分类')
        // retun false 组织跳转到另一个tab
        return false
      }
    },
    // 当级联框发生改变时的事件
    handleChange () {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // 切换tabs 栏事件
    async changeTabsHandle () {
      // 如果访问的是动态参数面板是则activeName等于1 请求数据应携带many数据
      if (this.activeName === '1') {
        const { data: res } = await this.$http.get(`categories/${this.getId}/attributes`,
          { params: { sel: 'many' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })

        this.manyData = res.data
      } else if (this.activeName === '2') {
        const { data: res } = await this.$http.get(`categories/${this.getId}/attributes`,
          { params: { sel: 'only' } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.onlyData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.pictureDialogVisible = true
    },
    // 处理移除图片的效果
    handleRemove (file) {
      // 1 获取将要删除图片的路径
      // console.log(file)
      const filePath = file.response.data.tmp_path
      // 2 查找将要删除图片的索引
      const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)// 这里的x代表的是数组的每一项
      // 3 利用splice 删除对应的图片
      this.addGoodsForm.pics.splice(i, 1)
      // console.log(this.addGoodsForm)
    },
    noSuccess (response) {
      // console.log(response)
      // 拼接得到一个数组对象
      const picsInfo = { pic: response.data.tmp_path }
      // 将数组对象拼接到pics中
      this.addGoodsForm.pics.push(picsInfo)
    },
    // 点击添加时将整个大表单提交
    pushAddGoods () {
      // 提交表单前进行表单预校验
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('表单预验证失败')
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        // console.log(form.goods_cat)
        // 对attr 数据进行梳理
        // 动态参数manyData处理
        this.manyData.forEach(item => {
          const userInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(userInfo)
        })
        // 静态属性onlyData
        this.onlyData.forEach(item => {
          const userInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addGoodsForm.attrs.push(userInfo)
        })
        // 将addGoodsForm.attrs的值深拷贝个form.attrs
        form.pics = JSON.stringify(this.addGoodsForm.pics)
        form.attrs = this.addGoodsForm.attrs
        // 发起axois请求将数据添加
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    getId () {
      const { goods_cat: goodsCat } = this.addGoodsForm
      if (goodsCat.length !== 3) {
        return null
      }
      const length = goodsCat.length
      return goodsCat[length - 1]
    }
  }

}
</script>

<style lang="less" scoped>
.el-card{
  margin-top:16px;

  /deep/ .el-steps{
    font-size: 14px;
  }
}
.el-checkbox{
  margin: 0 5px 0 0;
}
.el-dialog img{
  width: 100%;
  height: 100%;
}
</style>
