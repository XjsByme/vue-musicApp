<template>
  <div class="music-list">
    <!-- 返回按钮 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <!-- 标题 -->
    <h1 class="title" v-html="title"></h1>
    <!-- 背景 -->
    <!-- :style="bgStyle" 是设置背景图片 -->
    <div class="bg-image" ref="bgImage" :style="bgStyle">
      <!-- 播放图片 -->
      <div class="play-wrapper" @click="random">
        <div ref="playBtn" class="play" v-show="songs.length>0">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 背景透明浮层 -->
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 歌曲列表背景，相对定位 ,方便操作MyScroll 往上漂-->
    <div class="bg-layer" ref="layer"></div>
    <!-- 滚动歌曲列表 -->
    <!-- 歌手歌曲列表 -->
    <!-- :listenScroll="listenScroll" :probeType="probeType" 传给 scroll组件 -->
    <MyScroll class="list" :data="songs" ref="list" :listenScroll="listenScroll" :probeType="probeType" @scrollFun="scroll">
      <div class="song-list-wrapper">
        <!-- selectItem 事件派发 -->
        <MySongList :songs="songs" @select="selectItem"></MySongList>
      </div>
      <!-- loding -->
      <div v-show="!songs.length" class="loading-container">
        <Myloading></Myloading>
      </div>
    </MyScroll>
  </div>
</template>
<script type="text/ecmascript-6">
import MyScroll from 'base/MyScroll/MyScroll'
import Myloading from 'base/Myloading/Myloading'
import MySongList from 'base/MySongList/MySongList'
//prefixStyle 浏览器css 兼容写法封装
import {prefixStyle} from 'common/js/dom'
const RESERVED_HEIGHT = 40 //title高度40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
//mapActions引入
import {mapActions} from 'vuex'
//playlistMixin引入
import { playlistMixin } from '@/common/js/mixin.js'

export default{
  mixins: [playlistMixin],
  components:{
    MyScroll,
    MySongList,
    Myloading
  },
  props:{
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data(){
    return{
      scrollY:0
    }
  },
  computed:{
    //返回背景图片样式
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  created(){
    //设置滚动组件的属性
    this.probeType = 3
    this.listenScroll = true
  },
  mounted(){
    // console.log(this.title)
    //设置歌手歌曲列表距离顶部的高度
    //拿到背景图片clientHeight，保存变量
    this.imageHeight = this.$refs.bgImage.clientHeight //224
    //minTransalteY最小滚动
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
    //设置歌手歌曲列表top,图片高度(224),$el 为 DOM 元素
    // this.$refs.list.$el.style.top = `${this.imageHeight}px`
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`

    // console.log(this.songs)
  },
  methods:{
    // 当有迷你播放器时，调整滚动底部距离
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    back() {
      //返回
      this.$router.back()
    },
    //滚动方法-是scroll组件中的
    scroll(pos) {
      //设置scrollY
      // console.log('pos',pos)
      this.scrollY = pos.y
    },
    ...mapActions([
      'selectPlay',//引用actions中的selectPlay方法
      'randomPlay'
    ]),
    selectItem(item,index){
      //selectPlay 是 mapActions（store中actions中的方法）,把songs 和 index 传过去
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    //随机播放
    random(){
      this.randomPlay({
        list: this.songs
      })
    }
  },
  //监听变化
  watch:{
    scrollY(newVal){
      //newVal = pos.y
      // console.log('newVal',newVal)
      //设置最大滚动量
      let translateY = Math.max(this.minTransalteY, newVal)
      // console.log('translateY',translateY)
      //设置layer transform,使layer跟随滚动（这样会有问题，中间有一段空白）
      // this.$refs.layer.style['transform'] = `translate3d(0,${newVal}px,0)`
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      //控制图片不被掩盖
      let zIndex = 0
      if(newVal < this.minTransalteY){
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      }else{
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      //scale设置
      let scale = 1
      const percent = Math.abs(newVal / this.imageHeight)
      if(newVal>0){ //往下拉的时候
        scale = 1 + percent
        zIndex = 10
      }else{
        blur = Math.min(20*percent,20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      //blur 设置 高斯模糊
      let blur = 0
      //scale
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      //设置zIndex
      this.$refs.bgImage.style.zIndex = zIndex
    }
  },
  //良好的编程习惯，销毁
  destroyed () {}
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      // overflow:hidden
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>