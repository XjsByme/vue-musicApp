<template>
	<div class="search">
		<div class="search-box-wrapper">
      <!-- query MySearchBox传过来的监听这个事件  -->
			<MySearchBox ref="searchBox" @query="onQueryChange"></MySearchBox>
		</div>
    <!-- 搜索提示 -->
		<div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
			<div ref="shortcut" class="shortcut">
				<div class="hot-key">
					<h1 class="title">热门搜索</h1>
					<ul>
						<li class="item" v-for="item in hotKey" @click="addQuery(item.k)">
          			<span>{{item.k}}</span>
      			</li>
					</ul>
				</div>
			</div>
		</div>
    <!-- 搜索结果 -->
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest :query="query" @listScroll="blurInput"></suggest>
    </div>
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
 export default{
 	components:{
 		MySearchBox,
    suggest
 	},
 	data(){
 		return{
 			hotKey:[],
      query:''
 		}
 	},
 	created() {
      this._getHotKey()
    },
    methods:{
    	_getHotKey() {
	        getHotKey().then((res) => {
	          if (res.code === ERR_OK) {
	            this.hotKey = res.data.hotkey.slice(0, 10)
	            // console.log(this.hotKey)
	          }
	        })
      	},
    	addQuery(query){
    		// console.log(data)
    		//MySearchBox中的方法,直接传值过去
    		this.$refs.searchBox.setQuery(query)
    	},
      onQueryChange(query){
        this.query = query
        // console.log('this.query',this.query)
      },
      blurInput(){
        //
        this.$refs.searchBox.blur()
      }
    },
    watch:{

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