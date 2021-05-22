<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="openGoodsDialog()"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="GoodsList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isOK" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 等级 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="miin">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" type="success" size="miin"
            >二级</el-tag
          >
          <el-tag v-if="scope.row.cat_level === 2" type="warning" size="miin"
            >三级</el-tag
          >
        </template>
        <!-- 操作 -->
        <template slot="opting" slot-scope="scope">
          <el-button
            @click="EditGoods(scope.row)"
            type="primary"
            icon="el-icon-setting"
            >修改</el-button
          >
          <el-button
            @click="RemoveGoods(scope.row.id)"
            type="danger"
            icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange()"
          @current-change="handleCurrentChange()"
          :current-page="querInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="querInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="OnAddGoods"
      width="80%"
      @close="Addclose()"
    >
      <el-form
        :model="AddoodsList"
        ref="addGoods"
        :rules="addGoodsRul"
        label-width="100px"
      >
        <el-form-item prop="cat_name" label="分类名称:">
          <el-input v-model="AddoodsList.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- props 数据配置 -->
          <!-- options 获取数据渲染 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="parentWord"
            @change="parentChange()"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="OnAddGoods = false">取 消</el-button>
        <el-button type="primary" @click="addGoods()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询显示条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 1
      },
      // 商品数据获取
      GoodsList: [],
      // 添加分类
      AddoodsList: {
        cat_name: '',
        // 分类ID
        cat_pid: 0,
        // 分类等级
        cat_level: 0
      },
      addGoodsRul: {
        cat_name: [{ required: true, message: '请输入商品名', trigger: 'blur' }]
      },
      // 分类对话框
      OnAddGoods: false,
      // 父类分类数据
      parentCateList: [],
      // 指定配置对像
      parentWord: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 父级选择的ID值
      selectedKeys: [],
      // 总数据
      total: 0,
      // 为table指定列的数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 当前列定义为模板列
          type: 'template',
          // 当前列使用的名称
          template: 'isOK'
        },
        {
          label: '排序',
          // 当前列定义为模板列
          type: 'template',
          // 当前列使用的名称
          template: 'order'
        },
        {
          label: '操作',
          // 当前列定义为模板列
          type: 'template',
          // 当前列使用的名称
          template: 'opting'
        }
      ]
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
    async getGoods() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) this.message.error('商品数据获取失败')
      this.GoodsList = res.data.result
      this.total = res.data.total
    },
    // 打开添加商品对话框
    openGoodsDialog() {
      this.getGoodCateList()
      this.OnAddGoods = true
    },
    async getGoodCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.message.error('获取父类等级失败')
      this.parentCateList = res.data
    },
    Addclose() {
      this.$refs.addGoods.resetFields()
      this.selectedKeys = []
      this.AddoodsList.cat_pid = 0
      this.AddoodsList.cat_level = 0
    },
    // 修改商品
    EditGoods(node) {},
    // 确认修改商品
    ReadyEditGoods() {},
    // 删除商品
    RemoveGoods(id) {
      const confim = this.$confim('是否要删除该商品?', '删除', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      if (confim !== 'confirm') {
        this.$message.info('已取消删除')
      }
      this.$http.delete(id)
    },
    // pageSize改变时
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getGoods()
    },
    // pageNum改变时
    handleCurrentChange(newpage) {
      this.querInfo.pagenum = newpage
      this.getGoods()
    },
    // 选择项发生变化时
    parentChange() {
      // 有选择分类时 数组的索引大于0
      if (this.selectedKeys.length > 0) {
        // 如果大于0时,把最后一位阈值给该添加分类数组
        this.AddoodsList.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 为当前分类的等级赋值
        this.AddoodsList.cat_level = this.selectedKeys.length
      } else {
        this.AddoodsList.cat_pid = 0
        this.AddoodsList.cat_level = 0
      }
    },
    // 点击确认添加按钮
    addGoods() {
      this.$refs.addGoods.validate(async item => {
        if (!item) return false
        const { data: res } = await this.$http.post(
          'categories',
          this.AddoodsList
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.getGoods()
        this.OnAddGoods = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
