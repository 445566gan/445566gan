<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item :to="{ path: '/rights' }">商品管理</el-breadcrumb-item>

      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->

    <el-card>
      <el-row>
        <el-alert
          title="成功提示的文案"
          type="info"
          :closable="false"
          show-icon
        >
        </el-alert>
      </el-row>

      <el-row class="cat_opt">
        <el-col>
          <span>请选择要查询的分类:</span>

          <el-cascader v-model="goodsIDkeys"
            :options="goodsList"
            :props="goodsProps"
            @change="goodsID"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs页签 -->

      <el-row>
        <el-col :span="24">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 动态参数 -->

            <el-tab-pane label="动态参数" name="many">
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="AddParams = true"
                >添加</el-button
              >

              <el-table :data="manyParamsData" border stripe>
                <el-table-column type="expand">
                <template slot-scope='scope'>
                // 遍历数组生成每个标签
              <el-tabs v-for='(item,i) in scope.row.attr_vals' :key='i' closable @close='closeTabs(i,scope.row)'>
              {{item}}
              </el-tabs>
                <el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
                </el-table-column>

                <el-table-column type="index"></el-table-column>

                <el-table-column
                  prop="attr_name"
                  label="参数名称"
                ></el-table-column>

                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      @click="EditGoodsParams(scope.row.attr_id)"
                      size="mini"
                      >编辑</el-button
                    >

                    <el-button
                      type="danger"
                      @click="RemoveGoodsParams(scope.row.attr_id)"
                      size="mini"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 静态参数 -->
            <el-tab-pane label="静态参数" name="only">
              <el-button
                type="primary"
                size="mini"
                :disabled="isBtnDisabled"
                @click="AddParams = true"
                >添加参数</el-button
              >
              <el-table :data="onlyParamsData" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <!-- 展开列 -->
                <el-table-column type="expand">
                  <template slot-scope='scope'>
              <el-tabs v-for='(item,i) in scope.row.attr_vals' :key='i' closable @close='closeTabs(i,scope.row)'>
              {{item}}
              </el-tabs>
                <el-input v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
                </el-table-column>
                <el-table-column
                  prop="attr_name"
                  label="属性参数"
                ></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      @click="EditGoodsParams(scope.row.attr_id)"
                      size="mini"
                      >编辑</el-button
                    >

                    <el-button
                      type="danger"
                      @click="RemoveGoodsParams(scope.row.attr_id)"
                      size="mini"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col></el-row
      >
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + TitleText"
      :visible.sync="AddParams"
      width="50%"
      @close="closeParams()"
    >
      <el-form
        :rules="ParamsRules"
        ref="ruleForm"
        label-width="100px"
        :model="addForm"
      >
        <el-form-item :label="TitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddParams = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="'修改'+TitleText"
      :rules="ParamsRules"
      :visible.sync="ShowEditParams"
      width="50%"
      label-width="100px"
      @close='close()'
      ><el-form  ref="EditFormRef">
        <el-form-item :label="TitleText" prop="attr_name">
          <el-input v-model="EditForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ShowEditParams = false">取 消</el-button>
        <el-button type="primary" @click="EditParams()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsList: [],
      goodsProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 参数ID值
      goodsIDkeys: [1, 2, 44],
      activeName: 'many',
      // 动态数据
      manyParamsData: [],
      // 静态数据
      onlyParamsData: [],
      AddParams: false,
      ShowEditParams: false,
      // 添加表单
      addForm: {
        attr_name: ''
      },
      // 修改表单
      EditForm: {
        attr_name: ''
      },
      // 添加规矩
      ParamsRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
    if (res.meta.status !== 200) { return this.$http.message.error('获取数据失败') }
      this.goodsList = res.data
    },
    // 选择值发生变化时
    goodsID() {
    if (this.goodsIDkeys.length !== 3) {
      this.goodsIDkeys = []
    this.manyParamsData = []
    this.onlyParamsData = []
    }
      this.getParamsData()
    },
    // tag变化时
    handleClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 获取不同tab下的数据
    async getParamsData() {
      if (this.goodsIDkeys.length !== 3) {
        this.goodsIDkeys = []
        return false
      }
      const { data: res } = await this.$http.get(`categories/${this.cateID}`, {
        parmas: { sel: this.activeName }
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      res.data.forEach(item => {
       item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
       item.inputVisible = false
       item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyParamsData = res.data
      } else {
        this.onlyParamsData = res.data
      }
    },
    // 关闭清空
    closeParams() {
      this.$refs.ruleForm.resetFields()
    },
    close(){
      this.$refs.EditFormRef.resetFields()
      this.EditForm = {}
    },
    // 添加确定提交
    add() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(
          `categories/${this.cateID}`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.message.error('添加失败')
        }
        this.message.success('添加成功')
        this.AddParams = false
        this.getParamsData()
      })
    },
    // 展示修改对话框
    async EditGoodsParams(id) {
      const {
        data: res
      } = await this.$http.get(`categories/${this.cateID}/${id}`, {
        params: { attr_sel: this.activeName }
      })
      if (res.meta.status !== 201) return this.$message.error('获取数据失败')
      this.EditForm = res.data
      this.ShowEditParams = true
    },
    // 确定修改
    EditParams() {
      this.$refs.EditFormRef.validate(async itemid => {
        if (!itemid) return false
        const { data: res } = await this.$http.put(
        `categories/${this.cateID}/${this.EditForm.attr_id}`, {
          attr_name: this.EditForm.attr_name,
          attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) { return this.$message.erro('修改失败') }
        this.getParamsData()
        this.ShowEditParams = false
      })
    },
    // 删除
   async RemoveGoodsParams(id) {
      const confirmRef = this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      if (confirmRef !== 'confirm'){
        this.$message.info('已取消删除')
      } else {
        const { data: res } = await this.$http.delete(`categories/${this.cateID}/${id}`)
        if (res.meta.status !== 200) { return this.$message.error('删除失败') }
        this.$message.success('删除成功')
        this.getParamsData()
      }
    },
    // 新增标签确定
   async handleInputConfirm(row){
      if (row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发送请求
    this.SaveTabs(row)
    },
    // 封装标签提交
   async SaveTabs(row){
    const { data: res } = await this.$http.put(`categories/${this.cateID}/attributer/${row.attr_id}`,
   {
    attr_name: row.attr_name,
    attr_sel: this.activeName,
    // 后台数据需要字符串形式返回
    attr_vals: row.attr_vals.join(' ')
  })
      if (res.meta.status !== 200) return this.$message.error('提交失败')
      this.$message.success('提交成功')
    },
    // 关闭标签
    closeTabs(index, row){
      row.attr_vals.splice(index, 1)
      this.SaveTabs(row)
    },
    showInput(row){
      row.inputVisible = true
       this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
    }
  },
  computed: {
    isBtnDisabled() {
      if (this.goodsIDkeys.length !== 3) {
        return true
      }
      return false
    },
    // 记录第三级ID值
    cateID() {
      if (this.goodsIDkeys.length === 3) {
        return this.goodsIDkeys[2]
      }
      return null
    },
    TitleText() {
      if (this.activeName === 'only') {
        return '静态参数'
      } else {
        return '动态参数'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt {
  margin-top: 20px;
  height: 30px;
  line-height: 30px;
}
</style>
