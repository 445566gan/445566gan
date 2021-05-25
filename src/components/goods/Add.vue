<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goodslist' }"
        >商品管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤 -->
      <el-steps :active="activeIndex - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签 -->
      <el-form
        :model="addForm"
        ref="addFormRef"
        :rules="GoodsRules"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTabs"
          @tab-click="TabClick()"
        >
          <el-tab-pane label="基本信息" name="1">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="godds_weight">
              <el-input v-model="addForm.godds_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="addFormOptions"
                :props="addFormProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  size="medium"
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <!-- action上传地址 -->
            <!--headers自定义一个请求头 -->
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
              :headers="headersObj"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5"
            ><quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)"
            />
            <el-button type="primary" class="addBTN" @click="addGoodsList"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 对话框 -->
    <el-dialog title="外层 Dialog" :visible.sync="ShowPhoto">
      <el-dialog
        width="50%"
        title="图片浏览"
        :visible.sync="ShowPhoto"
        append-to-body
      >
        <img :src="imgURL" class="GoodsImg" />
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '1',
      GoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        godds_weight: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 添加商品参数表数据对像
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        godds_weight: 0,
        // 级联Id数组总和
        goods_cat: [],
        // 图片暂存地址数组
        pics: [],
        // 商品详情
        goods_introduce: '',
        // 参数数据
        attrs: []
      },
      // 商品分类列表
      addFormOptions: [
        {
          goods_id: 157,
          goods_name: '台标',
          children: [
            {
              goods_id: 157,
              goods_name: 'ⅰ',
              children: [{ goods_id: 888, goods_name: '氏大' }]
            }
          ]
        },
        {
          goods_id: 111,
          goods_name: '砂虹',
          children: [
            {
              goods_id: 157,
              goods_name: '台宋祖英',
              children: [
                { goods_id: 123, goods_name: '来咯' },
                { goods_id: 211111, goods_name: '宋祖英比' }
              ]
            }
          ]
        }
      ],
      // 商品分类配置
      addFormProps: {
        value: 'goods_id',
        label: 'goods_name',
        children: 'children'
      },
      // 动态获取标签数据
      manyTableData: [
        {
          attr_name: '葱葱郁郁',
          attr_id: 44,
          attr_vals: ['弎', '基本原理', '欠妥', '暗示的车', '大工']
        },
        {
          attr_name: '双工',
          attr_id: 555,
          attr_vals: ['花草树木', '钦', '钦', '碕', '蓐']
        }
      ],
      onlyTableData: [
        {
          attr_name: '电脑',
          attr_id: 55,
          attr_vals: '技嘉'
        },
        {
          attr_name: '手机',
          attr_id: 44,
          attr_vals: '技嘉'
        },
        {
          attr_name: '性能',
          attr_id: 21,
          attr_vals: '技嘉'
        },
        {
          attr_name: '电话',
          attr_id: 435,
          attr_vals: '技嘉'
        },
        {
          attr_name: '移动',
          attr_id: 234,
          attr_vals: '技嘉'
        },
        {
          attr_name: '冷冻库',
          attr_id: 441,
          attr_vals: '技嘉'
        }
      ],
      // 图片上传请求头
      headersObj: { Authorization: window.sessionStorage.getItem('token') },
      ShowPhoto: false,
      imgURL: '',
      // 副文本配置
      editorOption: {}
    }
    //
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.addFormOptions = res.data
    },
    // 级联发生变化时
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
        console.log(this.addForm.goods_cat)
      }
      console.log(this.addForm.goods_cat)
    },
    // active切换
    beforeTabs(activeName, oldActiveName) {
      if (oldActiveName === '1' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 标签读取
    async TabClick() {
      if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories${this.btnID}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态数据失败')
        }
        res.data = res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
      } else if (this.activeIndex === '3') {
        const { data: res } = await this.$http.get(
          `categories${this.btnID}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态数据失败')
        }
        this.onlyTableData = res.data
      }
    },
    // 图片上传
    // file为图片数据信息
    // 点击上传图片的效果
    handlePreview(file) {
      this.imgURL = file.data.response.url
      this.ShowPhoto = true
    },
    // 处理图片删除的效果
    handleRemove(file) {
      // file点击的当前文件数据
      const picPath = file.response.data.tmp_path
      // findIndex 查找数组中对应的值
      const picFind = this.addForm.pics.findIndex(item => item.pic === picPath)
      // 删除对应的暂存地址
      this.addForm.pics.splice(picFind, 1)
    },
    // 处理图片上传成功时的效果
    handleSuccess(response) {
      // response为服务器返回的数据
      const pci = { pic: response.data.tmp_path }
      // 读取暂存的地址再推入提交表单的数据中
      this.addForm.pics.push(pci)
    },
    // 副文本方式
    onEditorBlur() {},
    onEditorFocus() {},
    onEditorReady() {},
    // 确定添加商品
    addGoodsList() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error('请重新填入必填项')
        }
        // 两个数据类型会冲突而出错 需要深拷贝再转换格式
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const NewInfo = {
            attr_id: item.attr_id,
            attr_vals: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(NewInfo)
        })
        // 处理静态参数
        this.onlyTableData.forEach(item => {
          const NewInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
          this.addForm.attrs.push(NewInfo)
        })
        // 深拷贝
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)
        // 发起请求添加商品
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error('上传商品失败')
        this.$message.success('上传商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    btnID() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin-top: 20px;
  font-size: 10px;
}
.el-tabs {
  width: 100%;
  height: 100%;
  margin-top: 20px;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.GoodsImg {
  width: 100%;
  height: 100%;
}
.addBTN {
  margin-top: 10px;
}
</style>
