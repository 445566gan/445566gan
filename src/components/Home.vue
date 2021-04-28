<template>
<div class="home">
   <el-button @click='unameOut' type="info">退出</el-button>
</div>
</template>
<script>
export default {
    data() {
        return {}
    },
    methods: {
        unameOut() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }

}
</script>
<style lang="less" scoped>

</style>
