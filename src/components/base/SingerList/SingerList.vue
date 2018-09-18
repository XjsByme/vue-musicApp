<!-- 歌手列表组件 -->
<template>
  <!-- probeType设置了才能触发scroll方法 -->
  <MyScroll ref="scrollRef"
             :data="data"
             :probeType="probeType"
             :listen-scroll="listenScroll"
             @scrollFun="scroll"
             class="listview" @scrollToEnd="scrollToEnd" :pullup="pullup">
    <!-- 左侧歌手列表 -->
    <ul>
      <li ref="leftRef" v-for="group in dataList" class="list-group">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <!-- @click="selectItem" 跳转详情页 -->
          <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
      <!-- 是否底部 -->
      <div class="bottomTitle" v-show="bottomShow">{{bottomTitle}}</div>
    </ul>
    <!-- 右侧字母列表 -->
    <div @touchstart.stop.prevent="onShortcutTouchstart"
         @touchmove.stop.prevent="onShortcutTouchmove"
         class="list-shortcut">
      <ul>
        <li
          v-for="(item, index) in shortcut"
          :data-index="index"
          :class="{ 'current': currentIndex === index }"
          class="item">{{ item }}</li>
      </ul>
    </div>
    <!-- 滚动固定标题实现 -->
    <div ref="fixedTitleRef" v-show="fixedTitle" class="list-fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
    <!-- loading 组件 -->
    <div v-show="!dataList.length" class="loading-container">
      <Myloading></Myloading>
    </div>
  </MyScroll>
</template>
<script type="text/ecmascript-6">
import MyScroll from 'base/MyScroll/MyScroll'
import Myloading from 'base/Myloading/Myloading'
import {getData} from 'common/js/dom'

const RIGHT_ONEWORD_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  components: {
    MyScroll,
    Myloading
  },
  data () {
    return {
      dataList:'',
      scrollY: -1,
      currentIndex: 0,
      // 标题上推y值（热门标题 - A 标题）
      diff: -1,
      pullup:true,
      bottomTitle:'已经到底啦',
      bottomShow:false
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  watch: {
    //方法,
    data() {
      setTimeout(() => {
        this._caclHeight()
      }, 600)
    },
    //值， 监听 scrollY 落在 leftListHeight 的哪个区间，实现高亮联动
    scrollY(newY) {
      // console.log('newY',newY)
      const leftListHeight = this.leftListHeight
      // 当滚动到顶部，newY > 0
      if (newY > 0) {
        //当前位置为0
        this.currentIndex = 0
        return
      }

      // 在中间部分滚动
      for (let i = 0; i < leftListHeight.length - 1; i++) {
        let height1 = leftListHeight[i]
        let height2 = leftListHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          //到底几个
          this.currentIndex = i
          //中间值的时候等于 上限 + newY
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = leftListHeight.length - 2
    },
    //值，fixed title优化体验
    //diff 改变值 newVal
    diff(newVal) {
      // console.log('newVal',newVal)
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0

      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      //修改元素 定义样式，改变偏移量
      this.$refs.fixedTitleRef.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  methods: {
    //歌手列表
    getListDate(){
      this.dataList = this.data
    },
    // 对父亲提供的刷新 better-scroll 方法
    refresh() {
      this.$refs.scrollRef.refresh()
    },
    
    // 点击右侧，左侧联动
    onShortcutTouchstart(e) {
     
      // console.log(e.target)
      // console.log(e.touches)

      let nowTouch = e.touches[0]
      this.touch.y1 = nowTouch.pageY

      let nowIndex = getData(e.target, 'index')
      this.touch.nowIndex = nowIndex

      this._scrollTo(nowIndex)
    },
    // 滑动右侧，左侧联动，与左侧共享 touch 对象
    onShortcutTouchmove(e) {
      let nowTouch = e.touches[0]
      this.touch.y2 = nowTouch.pageY

      // 两次 touch y轴偏移
      let offset = Math.floor((this.touch.y2 - this.touch.y1) / RIGHT_ONEWORD_HEIGHT)
      let nowIndex = Number(this.touch.nowIndex) + offset

      this._scrollTo(nowIndex)
    },
    // better-scroll 滚动事件
    scroll(pos) {
      //pos 是scroll 组件传递过来的
      //更新设置scrollY
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      //index 所在位置
      // 超出范围不能点击和拖动
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.leftListHeight.length - 2) {
        index = this.leftListHeight.length - 2
      }

      this.currentIndex = Number(index)
      //scrollToElement 是 scroll组件中的方法
      this.$refs.scrollRef.scrollToElement(this.$refs.leftRef[index], 0)
    },
    // 计算 leftListHeight 的高度
    _caclHeight() {
      // console.log(9797989)
      // 初始化
      let height = 0
      this.leftListHeight = []
      this.leftListHeight.push(height)
      //leftRef li的数量
      let list = this.$refs.leftRef
      for (let i = 0; i < list.length; i++) {
        //高度累加
        height += list[i].clientHeight
        this.leftListHeight.push(height)
      }
      // console.log(this.leftListHeight) // (24) [0, 760, 1030, 1370, 1780, 1910, 2110, 2450, 2720, 3060, 3190, 3950, 4430, 4700, 4900, 5100, 5370, 5570, 5980, 6460, 7010, 7560, 7900, 9010]
    },
    //滚动到底部了
    scrollToEnd(){
      this.bottomShow = true
    },
    //跳转详情页-事件派发给父级
    selectItem(item){
      //告诉它我点击了什么
      this.$emit('select',item)
    },
    refresh(){
      this.$refs.scrollRef.refresh()
    }
  },
  //计算属性 -方法 返回return
  computed: {
    // 快速入口排列数组
    shortcut() {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    //计算出来fixedTitle
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      //this.data[this.currentIndex] 为当前的数据
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  created () {
    //歌手列表加载
    setTimeout(()=>{
      this.getListDate()
      // console.log('this.data',this.data[this.currentIndex])
    },600)
    //在created 中定义这些初始值，不在data中
    this.touch = {}
    this.listenScroll = true
    this.leftListHeight = []
    this.probeType = 3 // better-scroll 滚动组件 不截留
  },
  mounted () {},
  //销毁
  destroyed () {}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/common"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>