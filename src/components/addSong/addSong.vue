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
        <MySearchBox ref="searchBoxRef" placeholder="搜索歌曲" @query="onQueryChange"></MySearchBox>
      </div>
      <!-- 切换及其内容 -->
      <div class="shortcut" v-show="!query">
        <!-- 切换 -->
        <MySwitches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></MySwitches>
        <div class="list-wrapper">
          <!-- 最近播放 -->
          <MyScroll ref="songListRef" v-if="currentIndex === 0" class="list-scroll" :data="playListHistory">
            <div class="list-inner">
              <MySongList :songs="playListHistory" @select="selectSong"></MySongList>
            </div>
          </MyScroll>
          <!-- 搜索历史 -->
          <MyScroll class="list-scroll" ref="searchListRef" v-if="currentIndex === 1" :data="searchHistory" :refreshDelay="refreshDelay">
            <div class="list-inner">
              <MySearchList @delete="delHistory" @select="addQuery" :searches="searchHistory"></MySearchList>
            </div>
          </MyScroll>
        </div>
      </div>

      <div class="search-result" v-show="query">
      	<!-- 搜索列表组件 -->
        <suggest :query="query" :showSinger="showSinger" @select="addSelectSong" @beforeScroll="blurInput"></suggest>
      </div>
      <MyTopTip ref="topTipRef">
        <!-- 插槽内容 -->
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </MyTopTip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import MySearchBox from 'base/MySearchBox/MySearchBox'
import MySwitches from 'base/MySwitches/MySwitches'
import suggest from 'components/suggest/suggest'
import MyScroll from 'base/MyScroll/MyScroll'
import MySongList from 'base/MySongList/MySongList'
import MySearchList from 'base/MySearchList/MySearchList'
import MyTopTip from '@/components/base/MyTopTip/MyTopTip'
import {searchMixIn} from 'common/js/mixin'
import { mapActions, mapGetters } from 'vuex'
//引入 song 类
import Song from '@/common/js/songClass.js'
export default {
  mixins:[searchMixIn],
  components: {
    MySearchBox,
    suggest,
    MySwitches,
    MyScroll,
    MySongList,
    MySearchList,
    MyTopTip
  },
  data () {
    return {
      showFlag: false,
      // 搜索词
      query: '',
      // 不搜索歌手
      showSinger: false,
      // 切换开关文案
      switches: [
        {name: '最近播放'},
        {name: '搜索历史'}
      ],
      // 当前切换开关
      currentIndex: 0,
      refreshDelay: 100
    }
  },
  props: {},
  watch: {},
  methods: {
    show(){
    	this.showFlag = true
      //解决切换进入滚动失效
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songListRef.refresh()
        } else {
          this.$refs.searchListRef.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    // 当检索值改变时
    onQueryChange(query) {
      this.query = query
    },
    //添加搜索选中歌曲
    addSelectSong(){
    	// saveSearchHistory 是mixin中的公共方法
    	this.saveSearchHistory(this.query),
      //topTip组件显示
      this.$refs.topTipRef.show()
    },
    // 切换选择
    switchItem(index) {
      this.currentIndex = index
    },
    selectSong(item, index) {
      if (index !== 0) {
        this.insertSong(new Song(item))
      }
      //topTip组件显示
      this.$refs.topTipRef.show()
    },
    delHistory(item) {
      this.delHistory(item)
    },
    addQuery(k) {
      this.$refs.searchBoxRef.setQuery(k)
    },
    ...mapActions(['saveHistory', 'delHistory', 'insertSong'])
  },
  // 过滤器设计目的就是用于简单的文本转换
  filters: {},
  // 若要实现更复杂的数据变换，你应该使用计算属性
  computed: {
    ...mapGetters(['playListHistory','searchHistory'])
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
