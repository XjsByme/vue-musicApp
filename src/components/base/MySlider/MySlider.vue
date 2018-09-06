<!-- 轮播组件 -->
<template>
  <div class="slider" ref="slider">
    <div class="slider-group swiper-container" ref="sliderGroup">
      <slot>
      </slot>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
//引用addClass方法
// import {addClass} from 'common/js/dom'
// import BScroll from 'better-scroll'
// Swiper 引用 -- 自己写了 以上两种都用不着了
import Swiper from 'swiper'; 
import 'swiper/dist/css/swiper.min.css';
export default{
  //created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
  //mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
  mounted(){
    setTimeout(()=>{
      this._addMyswiper();
    },20)
    //窗口改变事件-初始化 mySwiper - 有坑
    window.addEventListener('resize', () => {
      if (!this.mySwiper) {
        return
      }
      // console.log(123)
      this.mySwiper.init()
    })
  },
  methods:{
    _addMyswiper() {
        this.mySwiper = new Swiper('.swiper-container', {
        loop:true,
        autoplay: true,
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,//修改swiper的父元素时，自动初始化swiper
        pagination: {
          el: '.swiper-pagination' //小圆点
        }
      })
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .swiper-slide
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>