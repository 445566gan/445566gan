<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item :to="{ path: '/rights' }"
        >权限管理</el-breadcrumb-item
      >

      <el-breadcrumb-item>角色权限</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加角色按钮区域 -->

      <el-row>
        <el-col>
          <el-button type="primary" @click="centerDialogVisible = true"
            >添加角色
          </el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->

      <el-table :data="RoulesList" style="width: 100%" border stripe>
        <!-- 展开列 -->

        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item, i) in scope.row.children"
              :key="item.id"
              :class="['bdbottom', i === 0 ? 'bdtop' : '']"
            >
              <!-- 渲染1级 -->

              <el-col :span="5">
                <el-tag closable @close="removeRightByID(scope.row, item.id)">{{
                  item.authname
                }}</el-tag>

                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染2和3级 -->

              <el-col :span="19">
                <el-row
                  v-for="(two, i) in item.children"
                  :key="two.id"
                  :class="['bdbottom', i === 0 ? 'bdtop' : '']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightByID(scope.row, two.id)"
                      >{{ two.authname }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item1 in two.chilren"
                      :key="item1.id"
                      closable
                      @close="removeRightByID(scope.row, item1.id)"
                      >{{ item1.authname }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="roleName" label="角色名字" width="200px">
        </el-table-column>

        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>

        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              class="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >
              编辑</el-button
            >

            <el-button
              size="mini"
              type="danger"
              class="el-icon-delete"
              @click="open(scope.row.id)"
              >删除</el-button
            >

            <el-button
              size="mini"
              type="warning"
              class="el-icon-setting"
              @click="ShowSettingRight(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="centerDialogVisible"
      width="50%"
      @close="Close()"
    >
      <el-form
        ref="roleRef"
        :model="loginList"
        :rules="loginRules"
        label-width="90px"
      >
        <el-form-item label="角色名字" prop="roleName">
          <el-input v-model="loginList.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="loginList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="修改用户信息" :visible.sync="dialogVisible" width="50%">
      <el-form-item label="角色名称" disabled>
        <el-input v-model="EditForm.roleName" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="EditForm.roleDesc"></el-input>
      </el-form-item>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ChangeUsers(EditForm.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 显示用户权限 -->
    <el-dialog title="显示权限" :visible.sync="ShowRight" width="50%">
      <!-- 树型组件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="dekeys"
        @close="CloseTree()"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid black;
}

.bdbottom {
  border-bottom: 1px solid black;
}
</style>

<script>
export default {
  data() {
    return {
      RoulesList: [],
      // 新增数据渲染
      loginList: {},
      // 显示权限数据
      rightsList: [],
      treeProps: {
        // 关键字开始嵌套属性
        children: 'children',
        // 关键字为嵌套标题
        laybel: 'authname'
      },
      dekeys: [],
      // 保存当前ID值
      RolesId: '',
      loginRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 3,
            message: '请输入角色描述',
            max: 10,
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '请输入角色名',
            trigger: 'blur'
          }
        ]
      },
      // 修改数扰渲染
      EditForm: {},
      // 修改
      dialogVisible: false,
      // 新增
      centerDialogVisible: false,
      // 显示
      ShowRight: false
    }
  },
  created() {
    this.getroulesList()
  },
  methods: {
    async getroulesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.RoulesList = res.data
    },
    // 显示修改用户信息
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('用户信息获取失败')
      }
      this.EditForm = res.data
      this.dialogVisible = true
    },
    // 修改用户信息
    async ChangeUsers(id) {
      const { data: res } = await this.$http.post('users' + id, {
        emroleNameail: this.EditForm.roleName,
        roleDesc: this.EditForm.roleDesc
      })
      if (res.meta.status !== 200) {
        return this.$message.error('修改用户信息失败')
      }
      this.dialogVisible = false
      this.getroulesList()
      this.$message.success('修改成功')
    },
    async open(id) {
      const confirmRef = this.$confirm(
        '此操作将永久删除该信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      if (confirmRef !== 'confirm') this.$message.info('已取消删除 ')
      const { data: res } = await this.$http.delete('roles' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.getroulesList()
      this.$message.success('删除成功')
    },
    addRole() {
      this.$refs.roleRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('rloes', this.loginList)
        if (res.meta.status !== 200) this.$message.error('添加失败')
        this.getroulesList()
        this.centerDialogVisible = false
        this.$message.success('添加成功')
      })
    },
    Close() {
      this.$refs.roleRef.resetFields()
    },
    CloseTree() {
      this.dekeys = []
    },
    async removeRightByID(role, rightID) {
      const confirmRef = this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '删除权限',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      if (confirmRef !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/right/${rightID}`
      )
      if (res.meat.status !== 200) {
        this.$message.error('权限删除失败')
      }
      // 删除后不整个刷新页面
      role.children = res.data
      // 重新读取会刷新页面
      // this.getroulesList()
      this.$message.success('删除成功')
    },
    // 角色权限显示
    async ShowSettingRight(role) {
      this.RolesId = role.id
      const { data: res } = await this.$http.get('right/tree')
      if (res.meta.status !== 200) {
        this.$message.error('权限获取失败')
      }
      this.rightsList = res.data
      // 用递归查找全部有的权限ID
      this.getChildrenID(role, this.dekeys)
      this.ShowRight = true
    },
    // 递归查找已有的权限ID值
    getChildrenID(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getChildrenID(item, arr)
      })
    },
    // 权限确定提交
    async allotRights() {
      // 获取选中的和半选中的ID值
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const IDStr = keys.join(',')
      const {
        data: res
      } = await this.$http.post(`roles/${this.RolesID}/rights`, { rids: IDStr })
      if (res.meta.status !== 200) return this.$message.error('提交权限错误')
      this.getroulesList()
      this.$message.success('分配权限成功')
      this.ShowRight = false
    }
  }
}
</script>
