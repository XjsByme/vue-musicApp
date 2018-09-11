<!--
圆形进度条组件
http://www.runoob.com/svg/svg-example.html
 -->

<template>
  <div class="my-progress-circle">
    <!-- viewBox="0 0 100 100"视口宽度和位置 -->
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <!-- cx="50" cy="50" r="50"  表示半径50 x 50 y 50 的圆 -->
      <circle class="progress-background" cx="50" cy="50" r="50" fill="transparent"/>
      <!-- :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset" 描边及描边位置 -->
      <circle class="progress-bar" cx="50" cy="50" r="50" fill="transparent" :stroke-dasharray="dasharray" :stroke-dashoffset="dashoffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      dasharray: Math.PI * 100 //圆的周长
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    },
    radius: {
      type: Number,
      default: 32
    }
  },
  watch: {},
  filters: {},
  methods: {},
  computed: {
    dashoffset() {
      return (1 - this.percent) * this.dasharray //播放进度
    }
  },
  created () {},
  mounted () {},
  destroyed () {}
}
</script>

<style lang="scss" scoped>
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

.my-progress-circle {
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: $color-theme-d;
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }
}
</style>
