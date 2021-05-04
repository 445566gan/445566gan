<template>
  <div>
    <!-- 标题 -->

    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item><a href="/home">用户管理</a></el-breadcrumb-item>

      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->

    <el-card>
      <!-- 搜索与添加 -->

      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            :gutter="20"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
              clearable
            ></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">
            添加信息</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->

      <el-table :data="UserList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="username" label="姓名"> </el-table-column>

        <el-table-column prop="email" label="邮箱"> </el-table-column>

        <el-table-column prop="mobile" label="电话"> </el-table-column>

        <el-table-column prop="role_name" label="角色"> </el-table-column>

        <el-table-column label="状态">
          <!-- 接收数据 接收整个UserList-->

          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="usertateChange(scope.row)"
            ></el-switch>
          </template>
          <!--  -->
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改信息 -->

            <el-tooltip
              effect="dark"
              content="修改信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 删除信息 -->

            <el-tooltip
              effect="dark"
              content="删除信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-share"
                circle
                size="mini"
                @click="RemoveUserbyID(scope.row.id)"
              ></el-button>
            </el-tooltip>

            <!-- 分配角色 -->

            <el-tooltips
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-setting"
                circle
                size="mini"
              ></el-button>
            </el-tooltips>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      @close="Close()"
      width="80%"
    >
      <el-form
        :rules="Userrules"
        :model="loginform"
        ref="FormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="model">
          <el-input v-model="loginform.model"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      title="修改用户"
      :visible.sync="EditVisible"
      @close="EditClose()"
    >
      <el-form
        :rules="EditFormRules"
        :model="EditForm"
        ref="EditFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="EditForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="EditForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="model">
          <el-input v-model="EditForm.model"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户 -->
  </div>
</template>
<script>
export default {
  data() {
    // 验证邮箱
    var checkEamli = (rule, value, cb) => {
      const regEmlia = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
      if (regEmlia.test(value)) {
        return cb()
      }
      cb(new Error('此邮箱错误'))
    }
    // 验证手机
    var checkModel = (rule, value, cb) => {
      const regModel = /^1[3|5|7|8]\d{9}/
      if (regModel.test(value)) {
        return cb()
      }
      cb(new Error('此手机号错误'))
    }
    return {
      // 获取用户列表
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 1
      },
      UserList: [],
      // 多少条数据
      total: 10,
      dialogVisible: false,
      EditVisible: false,
      Userrules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在 3~10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '长度在6 ~ 15 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          { validator: checkEamli, trigger: 'blur' }
        ],
        model: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          { validator: checkModel, trigger: 'blur' }
        ]
      },
      // 新增用户
      loginform: {
        username: '',
        password: '',
        email: '',
        model: ''
      },
      // 查询用户
      EditForm: {},
      EditFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          { validator: checkEamli, trigger: 'blur' }
        ],
        model: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          { validator: checkModel, trigger: 'blur' }
        ]
      }
    }
  },
  // 页面组件挂载前加载
  created() {
    this.getUserList()
  },
  methods: {
    // 获取数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$massage.error('获取失败')
      this.UserList = res.data.users
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // switch数据更改
    async usertateChange(userinfo) {
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.status !== 200) {
        userinfo.mg_state = !userinfo.ma_state
        return this.$massage.error('修改失败')
      }
      this.$massage.success('更新用户信息成功')
    },
    // 监听添加用户对话框关闭
    Close() {
      this.$refs.FormRef.resetFields()
    },
    // 监听修改用户对话框关闭
    EditClose() {
      this.$refs.EditFormRef.resetFields()
    },
    // 点击按扭添加新用户
    addUser() {
      this.$refs.FormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('users', this.loginform)
        if (res.meta.status !== 201) return this.$massage.error('添加用户失败!')
        this.$massage.success('添加用户成功!')
        this.getUserList()
        this.dialogVisible = false
      })
    },
    // 展示修改用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$massage.error('用户信息获取失败')
      }
      this.EditForm = res.data
      this.EditVisible = true
    },
    // 修改用户信息并提交
    editUserInfo() {
      // 表单预验证
      this.$refs.EditFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put('user' + this.EditForm.id, {
          email: this.EditForm.email,
          model: this.EditForm.model
        })
        if (res.meta.status !== 200) return this.$massage.error('更新提交失败')
        // 关闭对话框
        this.EditVisible = false
        // 刷新列表
        this.getUserList()
        // 提示成功
        this.$massage.success('修改成功')
      })
    },
    // 根据ID删除用户信息
    async RemoveUser(id) {
      const confirmRef = this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      if (confirmRef !== confirm) return this.$massage.info('已取消删除')
      const { data: res } = await this.$http.delete('user' + id)
      if (res.meta.status !== 200) return this.$massage.error('删除失败')
      this.getUserList()
      this.$$massage.success('删除成功')
    }
  }
}
</script>
<style lang="less" scoped></style>
