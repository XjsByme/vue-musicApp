<template>
  <MyScroll class="suggest" ref="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore" @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon" >
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <!-- 上啦刷新loading -->
      <Myloading v-show="hasMore" :title="title"></Myloading>
    </ul>
    <!-- 没结果显示 -->
    <!-- <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div> -->
  </MyScroll>
</template>
<script type="text/ecmascript-6">
//getSearch 搜索接口
import { getSearch } from 'api/getDateServer'
//请求状态
import {ERR_OK} from 'api/config'
//
import { CreatSong } from'common/js/songClass'

//滚动组件
import MyScroll from 'base/MyScroll/MyScroll'
import Myloading from 'base/Myloading/Myloading'
//
import Singer from 'common/js/SingerClass'
//
import {mapMutations, mapActions} from 'vuex'
//公共变量
const perpage = 20 //显示条数
const TYPE_SINGER = 'singer'

export default{
  components:{
    MyScroll,
    Myloading
  },
  data(){
    return{
      page: 1, //加载页
      pullup: true,
      beforeScroll: true,
      hasMore: true,
      result: [],
      title:'正在搜索...'
    }
  },
  props:{
    //搜索关键词-组件传递过来
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    //关注query变化(监听props里面的query)
    query(newQuery) {
      this.search(newQuery)
    }
  },
  methods:{
    search(){
      this.page = 1
      this.hasMore = true
      //重新搜索回归到顶部位置
      this.$refs.suggest.scrollTo(0, 0)
      getSearch(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)

        }
      })
    },
    //处理数据
    _genResult(data) {
     let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    //处理数据
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(CreatSong(musicData))
        }
      })
      return ret
    },
    //搜索结果列表显示图标
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    //结果名称显示
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    //上拉刷新
   searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      //在请求一次
      getSearch(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data))
          //是否继续显示更多
          this._checkMore(res.data)
        }
      })
    },
    listScroll() {
      this.$emit('listScroll')
    },
    //显示更多
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    //选中搜索结果跳转
    selectItem(item) {
      if (item.type === TYPE_SINGER) { //歌手
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        //写入
        this.setSinger(singer)
      } else { //歌曲
        this.insertSong(item)
      }
      this.$emit('select', item)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>