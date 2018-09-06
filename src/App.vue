<template>
  <div id="app">
    <my-header></my-header>
    <my-tab></my-tab>
    <!-- 缓存 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
//驼峰大写，引用时拆分小写
// import MyHeader from '@/components/MyHeader/MyHeader'
import MyHeader from './components/MyHeader/MyHeader'
import MyTab from '@/components/MyTab/MyTab'
export default {
  components: {
    MyHeader,
    MyTab
  }
}
</script>

<style lang="scss" scoped>
</style>
