<template>
  <div class="login-content">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="uname-icon"></div>
      <!-- 登录表单区域 -->
      <div class="login-form">
        <el-form
          label-width="0px"
          :model="loginform"
          :rules="Loginrules"
          ref="LoginFormRef"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user"
              v-model.lazy="loginform.username"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              v-model.lazy="loginform.password"
              type="password"
            >
            </el-input>
          </el-form-item>
          <el-row class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-row>
        </el-form>
      </div>
      <!-- 登录区域END -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginform: {
        username: '',
        password: ''
      },
      Loginrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.LoginFormRef.resetFields()
      this.$message.success('重置成功')
    },
    login() {
      window.sessionStorage.setItem('token', {
        name: 11,
        password: 44
      })
      this.$refs.LoginFormRef.validate(async val => {
        if (!val) return false
        const { data: res } = await this.$http.post('login', this.loginform)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        //  token信息保存在客户端的sessionStorage中
        // 使用window.sessionStorage.setItem()记录token
        // sessionStorage的数据在网站打开时才有效
        window.sessionStorage.setItem('token', res.data.token)
        // router跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.btns {
  display: flex;
  justify-content: flex-end;
}
.login-content {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-box {
    position: relative;
    width: 450px;
    height: 300px;
    background-color: white;
    border-radius: 3px;
    .uname-icon {
      width: 150px;
      height: 150px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background-color: yellow;
      box-shadow: 0 0 0 10px #ddd;
      padding: 10px;
    }
    .login-form {
      box-sizing: border-box;
      width: 100%;
      padding: 0 30px;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
