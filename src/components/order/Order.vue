<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList()"
            @keydown.enter="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button> </el-input
        ></el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="socpe">
            <el-tag v-if="socpe.row.pay_status === 1" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="time">
            {{ time.row.create_time | dataForm }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="EditOrder(scope.row.order_id)"
              size="mini"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              @click="ShowProgress(scope.row.order_id)"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改 -->
    <el-dialog
      title="修改地址"
      :visible.sync="Showadd"
      width="50%"
      @close="AddClose"
    >
      <el-form
        label-position="top"
        :rules="addressFormRules"
        ref="addRef"
        :model="addressForm"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            style="width:100%"
            v-model="addressForm.address1"
            :options="addressFormOptions"
            :props="addressProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 显示物流 -->
    <el-dialog title="提示" :visible.sync="ShowProgressDialog" width="50%">
      <div class="radio">
        排序：
        <el-radio-group v-model="reverse">
          <el-radio :label="true">倒序</el-radio>
          <el-radio :label="false">正序</el-radio>
        </el-radio-group>
      </div>
      <el-timeline :reverse="reverse">
        <el-timeline-item
          class="timeline"
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderList: [
        {
          order_id: 6672,
          order_number: 'itcal-445566',
          order_price: 325,
          is_send: '是',
          pay_status: 1,
          create_time: 1508331565
        },
        {
          order_id: 4752,
          order_number: 'itcal-445566',
          order_price: 325,
          is_send: '是',
          pay_status: 2,
          create_time: 999999999999
        },
        {
          order_id: 4411,
          order_number: 'itcal-445566',
          order_price: 325,
          is_send: '是',
          pay_status: 1,
          create_time: 1586432213
        },
        {
          order_id: 663372,
          order_number: 'itcal-445566',
          order_price: 325,
          is_send: '是',
          pay_status: 1,
          create_time: 1586432213
        },
        {
          order_id: 6611372,
          order_number: 'itcal-445566',
          order_price: 325,
          is_send: '是',
          pay_status: 1,
          create_time: 1586432213
        }
      ],
      // 查询对像
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 4,
      // 修改地址规矩
      addressFormRules: {
        address1: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      Showadd: false,
      ShowProgressDialog: false,
      addressForm: {
        address1: '',
        address2: ''
      },
      // 物流信息
      progressInfo: [
        { content: '111116', timestamp: '2021-09-06-00:00:00' },
        { content: '445566', timestamp: '2021-09-06-00:00:00' },
        { content: '445566', timestamp: '2021-09-06-00:00:00' },
        { content: '445566', timestamp: '2021-09-06-00:00:00' },
        { content: '445566', timestamp: '2021-09-06-00:00:00' }
      ],
      addressFormOptions: [],
      addressProps: {
        label: '',
        value: '',
        children: ''
      },
      // 时间线
      reverse: false
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取表单数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      console.log(newSize)
      this.getGoodsList()
    },
    handlePageChange(newPage) {
      this.queryInfo.pagenum = newPage
      console.log(newPage)
      this.getGoodsList()
    },
    EditOrder(id) {
      this.Showadd = true
    },
    async ShowProgress(id) {
      this.ShowProgressDialog = true
      const { data: res } = await this.$http.get(`kuaidi/${id}`)
      if (res.meta.statys !== 200) {
        return this.$message.error('获取物流消息失败')
      }
      this.progressInfo = res.data
    },
    AddClose(id) {
      this.$refs.addRef.resetFields()
    },
    // 联级值变化时
    handleChange() {}
  },
  computed: {}
}
</script>
<style lang="less" scoped>
.timeline {
  margin-top: 20px;
}
</style>
