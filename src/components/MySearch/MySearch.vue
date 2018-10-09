<template>
	<div class="search">
		<div class="search-box-wrapper">
      <!-- query MySearchBox传过来的监听这个事件  -->
			<MySearchBox ref="searchBox" @query="onQueryChange"></MySearchBox>
		</div>
    <!-- 搜索提示 -->
		<div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
			<MyScroll ref="shortcut" class="shortcut" :data="scrollData">
        <!-- 多加个div才是MyScroll的高度，否则不能滚动 -->
        <div>
  				<div class="hot-key">
  					<h1 class="title">热门搜索</h1>
  					<ul>
  						<li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
          			<span>{{item.k}}</span>
        			</li>
  					</ul>
  				</div>
          <!-- 搜索历史 -->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <!-- 搜索历史组件 -->
            <MySearchList :searches="searchHistory" @select="addQuery" @delete="deleteHis"></MySearchList>
          </div>
        </div>
			</MyScroll>
		</div>
    <!-- 搜索结果 -->
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggestRef"></suggest>
    </div>
    <!-- 清空弹窗 -->
    <MyConfirm ref="confirmRef" @confirm="confirm" @cancel="cancel" :text="text" confirmBtnText="好的鸭"></MyConfirm>
    <!-- 路由跳转歌手详情页/歌曲详情页-搜索列表中 -->
    <router-view></router-view>
	</div>
</template>
<script type="text/ecmascript-6">
import MySearchBox from 'base/MySearchBox/MySearchBox'
import { getHotKey } from 'api/getDateServer'
import {ERR_OK} from 'api/config'
//suggest引入
import suggest from 'components/suggest/suggest'
//vuex mapActions, mapGetters
import { mapActions, mapGetters } from 'vuex'
//myserchList
import MySearchList from 'base/MySearchList/MySearchList'
//MyConfirm 弹框组件
import MyConfirm from 'base/MyConfirm/MyConfirm'
//MyScroll组件
import MyScroll from 'base/MyScroll/MyScroll'
import { playlistMixin } from '@/common/js/mixin.js'
 export default{
  mixins: [playlistMixin],
 	components:{
 		MySearchBox,
    suggest,
    MySearchList,
    MyConfirm,
    MyScroll
 	},
 	data(){
 		return{
 			hotKey:[],
      query:'',
      text:'确认清空历史数据吗?'
 		}
 	},
  computed: {
    // shortcut() {
    //   return this.hotKey.concat(this.searchHistory)
    // }
    ...mapGetters(['searchHistory']),
    scrollData() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
 	created() {
      this._getHotKey()
    },
    methods:{
      //搜索热点列表
    	_getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
            // console.log(this.hotKey)
          }
        })
      },
      //搜索
    	addQuery(query){
    		// console.log(data)
    		//MySearchBox中的方法,直接传值过去
    		this.$refs.searchBox.setQuery(query)
    	},
      // 当检索值改变时
      onQueryChange(query){
        this.query = query
        // console.log('this.query',this.query)
      },
      blurInput(){
        //
        this.$refs.searchBox.blur()
      },
      //保存选择的歌曲/歌手
      saveSearch(){
        this.saveSearchHistory(this.query)
      },
      //删除单个历史纪录
      deleteHis(item) {
        this.delHistory(item)
      },
      //所有搜索历史弹框显示
      showConfirm() {
        this.$refs.confirmRef.show()
      },
      //弹框确认清空
      confirm() {
        this.clearHistory()
      },
      //弹框取消
      cancel() {
        return
      },
      ...mapActions([
        'saveSearchHistory','delHistory','clearHistory'
      ]),
      // 当有迷你播放器时，调整滚动底部距离
      handlePlaylist(playlist) {
        let bottom = playlist.length > 0 ? '60px' : ''

        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()

        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggestRef.refresh()
      }
    },
    watch:{
      // 解决添加歌曲后不能滚动的问题
      query(newVal) {
        if (!newVal) {
          setTimeout(() => {
            //MyScroll组件
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    }
 }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>