<!-- 添加歌曲到队列 组件 -->

<template>
  <transition name="slide">
    <div class="my-add-song" v-show="showFlag" @click.stop >
      <!-- 头部 -->
      <div class="header">
        <h1 class="title">添加歌曲到队列</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <!-- <my-search-box ref="searchBoxRef" @query="onQueryChange" placeholder="搜索歌曲"></my-search-box> -->
      </div>
      <!-- 切换及其内容 -->
      <div class="shortcut">
       <!--  <my-switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></my-switches> -->
        <div class="list-wrapper">
          <!-- 最近播放 -->
          <div ref="songListRef">
            <div class="list-inner">
              <!-- <my-song-list :songs="playHistory" @select="selectSong"></my-song-list> -->
            </div>
          </div>

          <!-- 搜索历史 -->
          <div class="list-scroll" ref="searchListRef">
            <div class="list-inner">
              <!-- <my-search-list @delete="delHistory" @select="addQuery" :searches="searchHistory"></my-search-list> -->
            </div>
          </div>
        </div>
      </div>

      <div class="search-result">
        <!-- <my-suggest-list :query="query" :zhida="zhida" @select="savaHis" @beforeScroll="blurInput"></my-suggest-list> -->
      </div>

     <!--  <my-top-tip ref="topTipRef">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </my-top-tip> -->
    </div>
  </transition>
</template>

<script>
export default {
  components: {
    // MySearchBox,
    // MySuggestList,
    // MySearchList,
    // MyScroll,
    // MySwitches,
    // MySongList,
    // MyTopTip
  },
  data () {
    return {
      showFlag: false,
      // // 搜索词
      // query: '',
      // // 不搜索歌手
      // zhida: false,
      // // 切换开关文案
      // switches: [
      //   {name: '最近播放'},
      //   {name: '搜索历史'}
      // ],
      // // 当前切换开关
      // currentIndex: 0,
      // refreshDelay: 100
    }
  },
  props: {},
  watch: {},
  methods: {
    show(){
    	this.showFlag = true
    },
    hide() {
      this.showFlag = false
    },
  },
  // 过滤器设计目的就是用于简单的文本转换
  filters: {},
  // 若要实现更复杂的数据变换，你应该使用计算属性
  computed: {
  },
  created () {},
  mounted () {},
  destroyed () {}
}
</script>

<style lang="scss" scoped>
@import '~@/common/scss/const.scss';
@import '~@/common/scss/mymixin.scss';

.my-add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;
  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }
  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-box-wrapper {
    margin: 20px;
  }
  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}
</style>
