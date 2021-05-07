<template>
  <el-container class="home-container">
    <!-- 头部区域 -->

    <el-header>
      <div class="tit"><span>11223344</span></div>

      <el-button type="info" @click="unameOut">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->

    <el-container>
      <!-- 侧边栏 -->

      <el-aside :width="isToogle ? '64px' : '200px'">
        <div class="toogle-button" @click="toogle_menu">|||</div>

        <!-- 菜单 -->

        <el-menu
          background-color="#333744"
          text-color="#FFF"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isToogle"
          :collapse-transition="false"
          :default-active="actPath"
          router
        >
          <!-- 一级 -->

          <el-submenu
            :index="item.id + ''"
            v-for="item in MenuList"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>

              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级 -->
            <el-menu-item
              :index="'/' + Subitem.path"
              v-for="Subitem in item.children"
              :key="Subitem.id"
              @click="ChangePath('/' + Subitem.path)"
            >
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>{{ Subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 菜单 -->
      </el-aside>
      <!-- 右侧内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      MenuList: [],
      isToogle: false,
      actPath: ''
    }
  },
  // VUE生命周期 组件挂载前渲染
  created() {
    this.getMenuList()
    this.actPath = window.sessionStorage.getItem('path')
  },
  methods: {
    unameOut() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取全部菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.message.error(res.meta.msg)
      // 获取的数据阈值内置数据
      this.MenuList = res.data
    },
    toogle_menu() {
      this.isToogle = !this.isToogle
    },
    // 保存链接激活
    ChangePath(path) {
      window.sessionStorage.setItem('path', path)
    }
  }
}
</script>
<style lang="less" scoped>
.toogle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.3em;
  cursor: pointer;
}

.el-menu {
  border-right: none;
}

.home-container {
  height: 100%;
}

.el-header {
  color: #fff;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #373d41;

  .tit {
    display: flex;
    align-items: center;
    margin: 15px;
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}
</style>
