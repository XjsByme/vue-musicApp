<template>
  <div class="player" v-show="playlist.length > 0">
      <!-- 正常的播放器 v-show="fullScreen" 其实就是一个显隐 -->
    <!-- 动画 transition 以及动画事件-->
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <!-- 背景图 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!-- 顶部 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 唱片 -->
        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <!-- <div class="cd" :class="playing ? 'play' : 'play pause'"> -->
              <div class="cd" :class="playingRotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <!-- <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div>
                <p ref="lyricLine" class="text"></p>
              </div>
            </div>
          </scroll> -->
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <!-- <span class="time time-l">{{format(currentTime)}}</span> -->
            <!-- 时间戳形式 -->
            <span class="time time-l">{{currentTime | currentTimeformat}}</span>
            <div class="progress-bar-wrapper">
              <!-- <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar> -->
            </div>
            <!-- <span class="time time-r">{{format(currentSong.duration)}}</span> -->
            <!-- 时间戳形式 -->
            <span class="time time-r">{{currentSong.duration | currentTimeformat}}</span>
          </div>
          <div class="operators">
            <!-- 播放模式 -->
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <!-- 播放 上一首 停止 下一首 -->
            <!-- :class="disableCls" 是播放歌曲加载失败时不可点击 -->
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prevSong"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <!-- 播放暂停 -->
              <!-- :class="playIcon"样式控制，playIcon是个方法 -->
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <!-- 喜欢 -->
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <!-- 底部迷你播放 v-show="!fullScreen" 控制显隐-->
      <div class="mini-player" @click="open" v-show="!fullScreen">
        <div class="icon">
          <!-- <img width="40" height="40" :src="currentSong.image" :class="playing ? 'play' : 'play pause'"> -->
          <img width="40" height="40" :src="currentSong.image" :class="playingRotate">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <!-- <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle> -->
          <!-- <i @click.stop="togglePlaying" :class="playing ? 'icon-pause-mini' : 'icon-play-mini'"></i> -->
          <!-- @click.stop 阻止冒泡 -->
          <i @click.stop="togglePlaying" :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 播放功能 -->
    <!-- <audio src="http://dl.stream.qqmusic.qq.com/C1L0001ApDs72gYqUk.m4a?vkey=F33047F1591194F61A2B27094B6CB1CBBD4C504FDB466A9975ADE22861FE0845D36C70AA0E23FF9000B2D5DEE71EB63E904224A849A7C59F&guid=8715282750&uin=2703401268&fromtag=66" ref="audio">
    </audio> -->
    <!-- @play="ready" @error="error" 避免点快了 报错 -->
    <audio :src="currentSong.url" ref="audio" @play="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters,mapMutations } from 'vuex'
//引用create-keyframe-animation 库，方便js中写动画函数
import animations from 'create-keyframe-animation'
//css3兼容写法各个浏览器
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')
export default {
	components:{

	},
	data(){
		return{
      songReady: false,//避免不能快速点击报错
      currentTime: 0
		}
	},
	//计算属性
	computed:{
		//getter中的方法(引用)
		...mapGetters([
      'currentIndex',//当前索引
      'fullScreen',//是否显示
      'playlist',//播放列表
      'currentSong',//当前歌曲
      'playing',//播放/暂停
      'mode'//播放模式
  	]),
    /* 以下样式控制 在html 中直接判断也可以 */
    //播放暂停，开始
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    //播放模式
    iconMode () {
      let cls = ''
      if (this.mode === 0) {
        cls = 'icon-sequence'
      } else if (this.mode === 1) {
        cls = 'icon-loop'
      } else if (this.mode === 2) {
        cls = 'icon-random'
      } else {
        cls = ''
      }
      return cls
    },
    //底部迷你播放按钮控制样式
    miniIcon(){
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    //播放旋转效果
    playingRotate(){
      return this.playing ? 'play':'play pause'
    },
    //没有加载/网络问题 不能点击
    disableCls() {
      return this.songReady ? '' : 'disable'
    }
	},
  // format(interval){
  //     interval = Math.floor(interval)
  //     let minute = (Math.floor(interval / 60)).toString().padStart(2, '0')
  //     let second = (interval % 60).toString().padStart(2, '0')
  //     return `${minute}:${second}`
  //   },
  //播放时间时间戳转换过滤器
  filters: {
    currentTimeformat: function(value) {
      if (!value) return ''
      // return this.format(value)
      let interval = Math.floor(value)
      let minute = (Math.floor(interval / 60)).toString().padStart(2, '0')
      let second = (interval % 60).toString().padStart(2, '0')
      return `${minute}:${second}`
    }
  },
  methods:{
    //mapMutations中的方法(引用)
    ...mapMutations(
      {
        setfullScreen: 'SET_FULL_SCREEN', //是否全屏 setfullScreen 是方法名，他是一个对象，对应到SET_FULL_SCREEN 
        setPlayingState: 'SET_PLAYING_STATE',//是否播放
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }
    ),
    // 最小化播放器
    back() {
      this.setfullScreen(false) //这是mapMutations里面的方法
    },
    // 最大化播放器
    open() {
      this.setfullScreen(true)
    },
    //transition normal 相关动画事件 
    enter(el,done){
      //解构赋值
      const {x, y, scale} = this._getPosAndScale()
      // console.log('23',x, y, scale)
      //定义动画
      let animation = {
        0: { //初始值
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      //调用animation相关设置
      animations.registerAnimation({
        name: 'move', //动画名称
        animation, //动画内容
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      //运行动画
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter(){
      //完成后remove
      animations.unregisterAnimation('move') //移除
      this.$refs.cdWrapper.style.animation = '' //置空
    },
    leave(el, done){
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave(){
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    //获取x,y和缩放比例
    _getPosAndScale() {
      const targetWidth = 40 //左下角播放图标icon 的width
      const paddingLeft = 40 //左下角播放图标icon 距离左侧的width
      const paddingBottom = 30 //左下角播放图标icon 距离底部的高度
      const paddingTop = 80 //中间播放图标icon 距离顶部的高度
      const width = window.innerWidth * 0.8 //中间播放图标的宽度（因为这个设置就是设置的80%）
      const scale = targetWidth / width //小图标与大图标的比例
      const x = -(window.innerWidth / 2 - paddingLeft) // 偏移值 x
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom // 偏移值 y
      return {
        x,
        y,
        scale
      }
    },
    //播放按钮-暂停、播放
    togglePlaying(){
      if (!this.songReady) {
        return
      }
      //播放暂停状态
       this.setPlayingState(!this.playing)
    },
    //播放模式改变
    changeMode(){
      let mode = (this.mode + 1) % 3

    },
    //歌曲切换-上一首、下一首
    prevSong(){
      //避免不能快速点击，报错
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      //第一首就最后一首歌
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      //切换后 播放按钮也要跟随变化
      if (!this.playing) {
        this.togglePlaying()
        // this.songCanplay = false
      }
      this.songReady = false
    },
    nextSong(){
      //避免不能快速点击，报错
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      //最后一首的时候 重新开始
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      //切换后 播放按钮也要跟随变化
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    //避免不能快速点击，报错
    ready(){
      this.songReady = true
    },
    //加载失败使用出问题，dom报错避免
    error(){
      this.songReady = true
    },
    // audio API timeupdate  当目前的播放位置已更改时
    // HTML5 Audio/Video 属性 currentTime  设置或返回音频/视频中的当前播放位置（以秒计）
    updateTime(e){
      this.currentTime = e.target.currentTime
      // console.log(this.currentTime)
    },
    //时间戳转换
    // format(interval){
    //   interval = interval | 0 //取整
    //   const minute = this._pad(interval/60) | 0
    //   const second = this._pad(interval%60)
    //   return `${minute}:${second}`
    // },
    // 时间戳转换 es6 语法
    format(interval){
      interval = Math.floor(interval)
      let minute = (Math.floor(interval / 60)).toString().padStart(2, '0')
      let second = (interval % 60).toString().padStart(2, '0')
      return `${minute}:${second}`
    },
    //补零
    _pad(num,n = 2){
      let len = num.toString().length
      while(len < 2){
        num = '0' + num
        len ++
      }
      return num
    }
  },
  created(){
    console.log('currentSong',this.currentSong)
    // console.log('currentTime',this.currentTime)
  },
  //实时监听
  watch:{
    //当前歌曲
    currentSong(){ //currentSong 变化的时候，就调用audio的方法
      this.$nextTick(() => { //加一个延时
        this.$refs.audio.play()
      })
    },
    //当前是否播放
    playing(newPlaying){
      // console.log('newPlaying',newPlaying)
      const audio = this.$refs.audio
      this.$nextTick(() => { //加一个延时,避免报错
        newPlaying?audio.play():audio.pause()
      })
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap() //超出省略
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
            // transition normal 动画
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32) //cubic-bezier 贝塞尔曲线 
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  //旋转动画
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>