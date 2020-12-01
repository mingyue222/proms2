<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="login_avatar">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <!-- 输入框 -->
      <el-form
        ref="loginFormRef"
        :model="login_form"
        :rules="rulesForm"
        label-width="0px"
        class="loginForm"
      >
        <el-form-item prop="username">
          <el-input
            v-model="login_form.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="login_form.password"
            prefix-icon="el-icon-unlock"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginForm">登录</el-button>
          <el-button type="info" @click="resatForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 这是登录表单的数据绑定
      login_form: {
        username: 'admin',
        password: '123456'
      },
      rulesForm: {
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
        ]
      }
    }
  },
  methods: {
    resatForm () {
      this.$refs.loginFormRef.resetFields()
    },

    loginForm () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        // 设置表单验证
        const { data: res } = await this.$http.post('login', this.login_form)
        if (res.meta.status !== 200) return res.$message.error.msg
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b8b;
  height: 100%;

  .login_box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .login_avatar {
      height: 130px;
      width: 130px;
      border: 1px solid #ccc;
      border-radius: 50%;
      box-shadow: 0 0 10px #eee;
      background-color: #fff;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}

.loginForm {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
