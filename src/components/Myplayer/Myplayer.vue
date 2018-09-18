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
        <div class="middle" @touchstart.prevent="middleTouchstart" @touchmove.prevent="middleTouchmove" @touchend="middleTouchend">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <!-- <div class="cd" :class="playing ? 'play' : 'play pause'"> -->
              <div class="cd" :class="playingRotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <!-- cd页小段歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 歌词 -->
          <MyScroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text" v-for="(item,index) in currentLyric.lines" :class="{ 'current':currentLyricLine === index }">{{item.txt}}</p>
              </div>
            </div>
          </MyScroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentDot === 'cd'}"></span>
            <span class="dot" :class="{'active':currentDot === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <!-- <span class="time time-l">{{format(currentTime)}}</span> -->
            <!-- 时间戳形式 -->
            <span class="time time-l">{{currentTime | currentTimeformat}}</span>
            <!-- 进度条组件 -->
            <div class="progress-bar-wrapper">
              <!-- <MyProgressBar :percent="percent" @percentChange="onProgressBarChange"></MyProgressBar> -->
              <!-- @percentChange是组件派发出来的 -->
              <MyProgressBar :percent="percent" @percentChange="onpercentChange"></MyProgressBar>
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
          <!-- 圆形进度条组件 -->
          <MyProgressCircle :radius="radius" :percent="percent">
            <!-- class="icon-mini"  定义位置 togglePlaying 开始暂停播放 -->
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </MyProgressCircle>
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
    <audio :src="currentSong.url" ref="audio" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters,mapMutations } from 'vuex'
//引用create-keyframe-animation 库，方便js中写动画函数
import animations from 'create-keyframe-animation'
//css3兼容写法各个浏览器
import {prefixStyle} from 'common/js/dom'
//进度条组件
import MyProgressBar from 'base/MyProgressBar/MyProgressBar'
//圆形进度条组件
import MyProgressCircle from 'base/MyProgressCircle/MyProgressCircle'
//播放模式
import {playMode} from 'common/js/config'
//洗牌函数
import {shuffle} from 'common/js/util'
//歌词处理
import Lyric from 'lyric-parser'
//滚动组件
//scroll 引入
import MyScroll from 'base/MyScroll/MyScroll'

const transform = prefixStyle('transform')

const transitionduration = prefixStyle('transitionDuration')
export default {
	components:{
    //进度条组件
    MyProgressBar,
    //圆形进度条
    MyProgressCircle,
    //滚动
    MyScroll
	},
	data(){
		return{
      songReady: false,//避免不能快速点击报错
      currentTime: 0,
      radius:32,//半径,
      currentLyric:null,
      currentLyricLine:0, //当前的歌词
      currentDot: 'cd',// 当前在哪个分页(默认cd)
      playingLyric: '无歌词数据'
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
      'mode',//播放模式
      'sequenceList'
  	]),
    /* 以下样式控制 在html 中直接判断也可以 */
    //播放暂停，开始
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    //播放模式
    iconMode () {
      // let cls = ''
      // if (this.mode === 0) {
      //   cls = 'icon-sequence'
      // } else if (this.mode === 1) {
      //   cls = 'icon-loop'
      // } else if (this.mode === 2) {
      //   cls = 'icon-random'
      // } else {
      //   cls = ''
      // }
      // return cls

      return this.mode === playMode.sequence?'icon-sequence':this.mode===playMode.loop?'icon-loop':'icon-random'
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
    },
    //播放进度
    percent(){
      //当前播放所占比例
      return this.currentTime/this.currentSong.duration
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
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode:'SET_PLAY_MODE',
        setPlayList:'SET_PLAYLIST'
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
       if(this.currentLyric){
        this.currentLyric.togglePlay()
       }
    },
    //播放模式改变
    changeMode(){
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      console.log(mode,playMode.random)
      if(mode === playMode.random){ //随机播放
        list = shuffle(this.sequenceList)
      }else{
        list = this.sequenceList
      }
      // 调整当前歌曲的索引
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      //
      this.setCurrentIndex(index)
      this.setPlayList(list)
    },
    //歌曲切换-上一首、下一首
    prevSong(){

      //避免不能快速点击，报错
      if (!this.songReady) {
        return
      }
      if(this.playlist.length === 1){
        this.loopSong()
      }else{
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
      }
      this.songReady = false
    },
    nextSong(){
      //避免不能快速点击，报错
      if (!this.songReady) {
        return
      }
      //如果只有一首歌
      if(this.playlist.length === 1){
        this.loopSong()
      }else{
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
    },
    // 进度条组件-组件派发来的事件
    onpercentChange(percent) {
      //播放时间比例*宽度比例 = 播放时间进度
      const currentTime = this.currentSong.duration * percent
      this.$refs.audio.currentTime = currentTime
      //保持拖动后继续播放
      if (!this.playing) {
        this.togglePlaying()
      }

      //拖动更新歌词
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    //到最后播完了切换到下一首
    end(){
      if(this.mode === playMode.loop){ //如果是单曲循环播放
        this.loopSong()
      }else{
        this.nextSong()
      }
    },
    //循环播放
    loopSong() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      // this.setPlayingState(true)
      // 单曲循环时，歌词也单曲循环,重新开始
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    //获取歌词
    getLyric(){
      // this.currentSong.getLyric().then((lyric)=>{
      //   this.currentLyric = new Lyric(lyric,this.handleLyric)
      //   if(this.playing){
      //     this.currentLyric.play()
      //   }
      //   console.log('this.currentLyric',this.currentLyric)
      // })
      this.currentSong.getLyric().then((lyric) => {
        if (this.currentSong.lyric !== lyric) {
          return
        }
        //歌词插件
        //this.handleLyric 回调插件
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      }).catch(() => {
        // 获取歌词失败时
        this.currentLyric = null
        this.playingLyric = '无歌词数据'
        this.currentLyricLine = 0
      })
    },
    //歌词每一行发生改变
    handleLyric({lineNum,txt}){
      this.currentLyricLine = lineNum
      if(lineNum > 5){
        let lineEl = this.$refs.lyricLine[lineNum-5]
        this.$refs.lyricList.scrollToElement(lineEl,1000)
      }else{
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      // 当前歌词
      this.playingLyric = txt
    },
    //
     // 滑动翻页
    middleTouchstart (e) {
      this.touch.init = true
      // 开始滑动的位置
      this.touch.startX = e.touches[0].pageX
      this.touch.startY = e.touches[0].pageY
    },
    middleTouchmove (e) {
      if (!this.touch.init) {
        return
      }
      // 滑动的差值
      let deltaX = e.touches[0].pageX - this.touch.startX
      let deltaY = e.touches[0].pageY - this.touch.startY

      // 纵向滚动 return
      if (Math.abs(deltaX) < Math.abs(deltaY)) {
        return
      }

      let left = this.currentDot === 'cd' ? 0 : -window.innerWidth
      // 左滑的距离
      let offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      // console.log(this.touch.percent)

      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      // 过渡效果坚持 0ms
      this.$refs.lyricList.$el.style[transitionduration] = 0
      // 背景模糊
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionduration] = 0
    },
    middleTouchend () {
      let offsetWidth = null
      let opacity = null

      if (this.currentDot === 'cd') {
        // 左滑
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          this.currentDot = 'lyric'
          opacity = 0
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        // 右滑
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentDot = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }

      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      // 过渡效果坚持 300ms
      this.$refs.lyricList.$el.style[transitionduration] = '300ms'
      // 背景模糊
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionduration] = '300ms'
    }
  },
  created(){
    this.touch = {}
  },
  //实时监听
  watch:{
    //当前歌曲
    currentSong(newVal, oldVal){ //currentSong 变化的时候，就调用audio的方法
      // 播放列表没有歌曲就退出
      if (!newVal.id) {
        return
      }

      if (newVal.id === oldVal.id) {
        return
      }
      //避免切换歌词出现bug,如果有，停止
      if(this.currentLyric){
        this.currentLyric.stop()
      }
      // this.$nextTick(() => { //加一个延时
      //   this.$refs.audio.play()
      //   //歌词数据
      //   this.getLyric()
      // })
      //实现从手机上从后台切换到前台播放
      setTimeout(()=>{
        this.$refs.audio.play()
        //歌词数据
        this.getLyric()
      },100)
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