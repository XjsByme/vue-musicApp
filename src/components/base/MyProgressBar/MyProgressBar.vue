<!-- 进度条组件 -->
<template>
  <!-- progressClick 点击事件 -->
  <div ref="barRef" class="my-progress-bar" @click.stop="progressClick">
    <div class="bar-inner">
      <!-- 已播放的进度 -->
      <div ref="progressRef" class="progress"></div>
       <!-- 小球 -->
       <!-- progress-btn-wrapper 决定 小球进度宽度 -->
      <div ref="btnRef" class="progress-btn-wrapper" @touchstart.prevent="progressTouchstart" @touchmove.prevent="progressTouchmove" @touchend="progressTouchend">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'
const transform = prefixStyle('transform')
const webkitTransform = prefixStyle('webkitTransform')
const BTN_WIDTH = 16
export default {
  components: {},
  data () {
    return {}
  },
  props: {
    // 当前播放进度 [0, 1]
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    // 播放进度
    percent(newPercent){
      //!this.touch.init 避免小球跳动
      if(newPercent >= 0 && !this.touch.init){
        //this.$refs.barRef.clientWidth 为整个进度条的宽度，BTN_WIDTH 是按钮小球的宽度
        const barWidth = this.$refs.barRef.clientWidth - BTN_WIDTH
        //播放进度比例
        let offsetWidth = newPercent * barWidth
        //设置进度宽度
        this.$refs.progressRef.style.width = `${offsetWidth}px`
        //小球前进
        this._move(offsetWidth)
      }
    }
  },
  methods: {
    _move(offsetWidth){
      this.$refs.progressRef.style.width = `${offsetWidth}px`
      this.$refs.btnRef.style[webkitTransform] = `translate3d(${offsetWidth}px, 0, 0)`
      this.$refs.btnRef.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    },
    //滚动条事件
    // 拖动小球改变播放进度，小球滑动开始位置
    progressTouchstart(e){
      this.touch.init = true //初始状态
      // 开始滑动的位置
      this.touch.startX = e.touches[0].pageX
      // 当前偏移
      this.touch.left = this.$refs.progressRef.clientWidth
    },
    //拖动小球改变播放进度，小球滑动过程中
    progressTouchmove(e){
      if(! this.touch.init){
        return
      }
      // 滑动的差值
      let deltaX = e.touches[0].pageX - this.touch.startX
      // console.log('deltaX',deltaX)
      // 进度条的差值，大于0，小于总长度
      let offsetWidth = Math.min(this.$refs.barRef.clientWidth - BTN_WIDTH, Math.max(0, this.touch.left + deltaX))
      //设置小球偏移-(左偏移位置)
      this._move(offsetWidth)
    },
    // 拖动小球改变播放进度，小球滑动结束
    progressTouchend(e){
      this.touch.init = false
      this._percentChange()
    },
    //小球保留拖动位置
    _percentChange(){
      let barWidth = this.$refs.barRef.clientWidth - BTN_WIDTH
      //宽度比例
      let newPercent = this.$refs.progressRef.clientWidth / barWidth
      //派发事件
      this.$emit('percentChange', newPercent)
    },
    //点击进度条设置进度
    progressClick(e){
      // 返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
      let rectLeft = this.$refs.barRef.getBoundingClientRect().left
      let offsetWidth = e.pageX - rectLeft
      this._move(offsetWidth)
      this._percentChange()
    }
  },
  computed: {},
  created () {
    //空对象，为了之后维护新增修改等属性
    this.touch = {}
  },
  mounted () {},
  destroyed () {}
}
</script>

<style lang="scss" scoped>
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

.my-progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
