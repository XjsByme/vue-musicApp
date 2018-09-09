<template>
  <div id="app">
    <my-header></my-header>
    <my-tab></my-tab>
    <!-- 缓存 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 应用播放器-切换路由也不影响它的播放 -->
    <Myplayer></Myplayer>
  </div>
</template>

<script>
//驼峰大写，引用时拆分小写
// import MyHeader from '@/components/MyHeader/MyHeader'
import MyHeader from './components/MyHeader/MyHeader'
import MyTab from '@/components/MyTab/MyTab'
//Myplayer 引用
import Myplayer from '@/components/Myplayer/Myplayer'
export default {
  components: {
    MyHeader,
    MyTab,
    Myplayer
  }
}
</script>

<style lang="scss" scoped>
</style>
