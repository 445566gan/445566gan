<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

      <el-breadcrumb-item :to="{ path: '/rights' }"
        >权限管理</el-breadcrumb-item
      >

      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->

    <el-card>
      <el-table :data="RightsList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>

        <el-table-column prop="authname" label="权限名称"> </el-table-column>

        <el-table-column prop="path" label="路径"> </el-table-column>

        <el-table-column prop="level" label="权限等级">
          <template slot-scope="levle">
            <el-tag v-if="levle.row.level === 0">一级</el-tag>

            <el-tag type="success" v-if="levle.row.level === 1">二级</el-tag>

            <el-tag type="warning" v-if="levle.row.level === 2">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<style lang="less" scoped></style>
<script>
export default {
  data() {
    return {
      RightsList: []
    }
  },
  created() {
    this.getRights()
  },
  methods: {
    async getRights() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.RightsList = res.data
    }
  }
}
</script>
