<template>
  <div id="app">
    <router-view v-if="isShow"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
      return {
        // 控制router-view的隐藏与展示
        isShow: true
      }
    },
    
    // 提供可注入子组件属性
    provide () {
      return {
        reload: this.reload
      }
    },

    // 定义reload方法
    methods: {
      reload () {
        // 先隐藏
        this.isShow = false
        
        // $nextTick() 将回调延迟到下次 DOM 更新循环之后执行
        this.$nextTick(() => {
          this.isShow = true
        })
      }
    }
}
</script>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
