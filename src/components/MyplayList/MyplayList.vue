<!-- 迷你播放器 播放列表 组件 -->

<template>
  <transition name="list-fade">
    <div class="my-playlist" v-show="showFlag" @click="hide">
      <!-- @click.stop 组织冒泡 -->
      <div class="list-wrapper" @click.stop>
        <!-- 头部操作 -->
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <!-- 中部列表 -->
        <MyScroll ref="scrollRef" class="list-content" :data="sequenceList">
          <transition-group name="list" tag="ul">
            <li class="item" ref="listRef" v-for="(item, index) in sequenceList" @click="selectItem(item, index)" :key="item.id">
              <i class="current" :class="getCurrentIcon(item)"></i>

              <span class="text">{{ item.name }}</span>

              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>

              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </MyScroll>
        <!-- 播放队列 -->
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <!-- 关闭按钮 -->
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>

      <!-- 清空弹窗 -->
      <MyConfirm ref="confirmRef" @confirm="confirm" @cancel="cancel"></MyConfirm>
      <!-- <my-add-song ref="addSongRef"></my-add-song> -->
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import MyScroll from 'base/MyScroll/MyScroll'
import {playMode} from 'common/js/config'
//MyConfirm 弹框组件
import MyConfirm from 'base/MyConfirm/MyConfirm'
//
import { shuffle } from '@/common/js/util.js'
export default{
	components:{
    MyScroll,
    MyConfirm
  },
  data(){
    return{
      showFlag: false
    }
  },
  props: {},
  watch:{
    // 切歌后滚动至第一个
    currentSong(newVal, oldVal) {
      // console.log(newVal,oldVal)
      if (!newVal.id || !oldVal.id) {
        return
      }

      if (!this.showFlag || newVal.id === oldVal.id) {
        return
      }

      this.scrollToCurrent(newVal)
    }
  },
  methods:{
    show(){
      this.showFlag = true
      // 延迟计算 better-scroll,避免不滚动
      setTimeout(() => {
        this.$refs.scrollRef.refresh()
        //当前播放歌曲滚到第一位
        this.scrollToCurrent(this.currentSong)
      }, 20)
      //
      // this.scrollToCurrent(this.currentSong)
    },
    hide(){
      this.showFlag = false
    },
    // 当前播放歌曲前面的图标
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return 'icon-play'
      }
      return ''
    },
    //切歌
    selectItem(item, index){
      // 随机播放
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      //播放当前歌曲
      this.setCurrentIndex(index)

      // 如果是暂停，切歌后自动播放
      this.setPlayingState(true)
    },
    // 切歌后当前播放歌曲滚动至第一个
    scrollToCurrent(current) {
      let index = this.sequenceList.findIndex((song) => {
        return song.id === current.id
      })
      this.$refs.scrollRef.scrollToElement(this.$refs.listRef[index], 300)
    },
    //
    deleteOne(item){
      // console.log(item)
      this.deleteSong(item)
      //没有歌曲隐藏
      if (!this.playlist.length) {
        this.showFlag = false
      }
    },
    //清空对话框 显示
    showConfirm() {
      this.$refs.confirmRef.show()
    },
    // confirm 清空对话框
    confirm() {
      this.deleteSongList()
    },
    cancel() {
      return
    },
    
    // 改变播放模式，实质是修改 playlist
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setMode(mode)

      let newList = null
      if (mode === playMode.random) {
        // 随机播放
        newList = shuffle(this.sequenceList)
      } else {
        // 顺序播放、单曲循环
        newList = this.sequenceList
      }

      // 调整当前歌曲的索引
      let index = newList.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
      this.setPlayList(newList)
    },
    ...mapMutations({
      setMode: 'SET_PLAY_MODE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions(['deleteSong','deleteSongList']),
  },
  filters:{},
  computed:{
    ...mapGetters(['sequenceList','currentSong','mode','playlist']),
    // 播放模式文案
    modeText() {
      // let mode = ''
      // if (this.mode === playMode.sequence) {
      //   mode = '顺序播放'
      // } else if (this.mode === playMode.loop) {
      //   mode = '单曲循环'
      // } else if (this.mode === playMode.random) {
      //   mode = '随机播放'
      // } else {
      //   mode = ''
      // }
      // return mode
      return this.mode === playMode.sequence?'顺序播放':this.mode === playMode.loop?'单曲循环':'随机播放'
    },
    // 播放模式对应图标字体
    iconMode () {
      // let cls = ''
      // if (this.mode === playMode.sequence) {
      //   cls = 'icon-sequence'
      // } else if (this.mode === playMode.loop) {
      //   cls = 'icon-loop'
      // } else if (this.mode === playMode.random) {
      //   cls = 'icon-random'
      // } else {
      //   cls = ''
      // }
      // return cls
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
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

.my-playlist {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        //<transition-group name="list" tag="ul"> list对应的动画
        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }
        &.list-enter, &.list-leave-to {
          height: 0;
        }
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .like {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }
    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
