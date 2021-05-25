<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      reportList: [],
      option: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        series: [
          {
            name: '衬衫',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '羊毛衫',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '雪纺衫',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '裤子',
            type: 'line',
            stack: '总量',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '高跟鞋',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          },
          {
            name: '袜子',
            type: 'line',
            stack: '总量',
            data: [1104, 771, 1105, 774, 1172, 1100, 805]
          }
        ]
      }
    }
  },
  methods: {
    async getReportList() {
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) {
        return this.$message.error('获取折线图数据失败')
      }
      this.reportList = res.data
    }
  },
  created() {},
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    var option = {
      tooltip: {},
      legend: {},
      xAxis: {
        type: 'category',
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: { type: 'value' }
    }
    const newOption = _.merge(option, this.option)
    myChart.setOption(newOption)
  },
  computed: {}
}
</script>
<style lang="less" scoped>
#main {
  width: 500px;
  height: 500px;
}
</style>
