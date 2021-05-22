<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item :to="{ path: '/rights' }"
        >商品管理</el-breadcrumb-item
      >

      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            clearable
            @clear="getGoodsList()"
            @keydown.enter="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoods()">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table border stripe :data="goodslist">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="time">
            {{ time.row.add_time | dataForm }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="EditGoods(scope.row)"
              icon="el-icon-setting"
              size="mini"
              >修改</el-button
            >
            <el-button
              type="danger"
              @click="RemoveGoods(scope.row.attr_id)"
              icon="el-icon-delete"
              size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询参数分页属性
      queryinfo: {
        query: '',
        pagenum: 1,
        pagesize: 1
      },
      totle: 1,
      goodslist: []
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryinfo
      })
      if (res.meta.status !== 200) return this.$massage.error('获取数码失败')
      this.goodslist = res.data
      this.totle = res.data.total
    },
    serchGoods() {
      this.getGoodsList()
    },
    // 分页
    handleSizeChange(newsize) {
      this.queryinfo.queryinfo = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newpage) {
      this.queryinfo.pagenum = newpage
      this.getGoodsList()
    },
    // 删除商品
    async RemoveGoods(id) {
      const config = this.$confirm('是否肯定要删除该商品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (config !== 'confirm') {
        return this.$massage.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) return this.$massage.error('删除失败')
      this.$massage.success('删除成功')
      this.getGoodsList()
    },
    // 跳转
    goAddGoods() {
      this.$router.push('goods/add')
    }
  },
  computed: {}
}
</script>
<style lang="less" scoped></style>
