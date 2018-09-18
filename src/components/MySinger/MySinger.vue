<template>
  <div class="singer" ref="singer">
  	<!-- 歌手列表组件引入 -->
    <SingerList :data="singers" ref="list" @select="selectSinger"></SingerList>
    <!-- 子路由-歌手详情 -->
    <router-view></router-view>
  </div>
</template>
<script type="text/ecmascript-6">
//getRecommend 数据接口方法
import {getSingerList} from 'api/getDateServer'
//公共变量
import {ERR_OK} from 'api/config'
//Singer 类引用
import Singer from 'common/js/SingerClass'
//歌手列表组件 SingerList
import SingerList from 'base/SingerList/SingerList'
// ...mapMutations （相当于this.$store.commit('xxx')）
import { mapMutations } from 'vuex'
//playlistMixin引入
import { playlistMixin } from '@/common/js/mixin.js'
const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  mixins: [playlistMixin],
  //注册组件
  components: {
	  SingerList
  },
  data () {
    return {
    	singers: []
    }
  },
  created(){
  	this._getSingerList()
  },
  methods:{
    handlePlaylist(playlist){
      let bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    //拿到选择的歌手
    selectSinger(singer){
      //跳转到详情页
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      //vuex 中的
      this.setSinger(singer)
    },
  	//歌手列表
  	_getSingerList() {
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
          	this.singers = res.data.list
            this.singers = this._normalizeSinger(this.singers)
            // console.log('this.singers',this.singers)
          }
        })
    },
    //数据处理分类-数据重组
    _normalizeSinger(list){
    	// console.log('list',list)
    	let map = {
    		hot:{
    			title:HOT_NAME,
    			items:[]
    		}
    	}
    	// console.log('map',map)
    	//循环遍历list
    	list.forEach((item,index)=>{
    		// console.log(item,index)
    		//如果小于10.hot item 加入数据 (数组对象 name,id)
    		//map 数据组合处理 --------第一步
    		if(index < HOT_SINGER_LEN){
    			// map.hot.item.push({
    			// 	name:item.Fsinger_name,
    			// 	id:item.Fsinger_mid,
    			// 	avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
    			// })
    			//---优化抽象一个类 
    			map.hot.items.push(new Singer({
    				name: item.Fsinger_name,
        		id: item.Fsinger_mid
    			}))
    		}
    		// console.log('map1',map)
    		//聚类-按字母  - a-z的数据
    		const key = item.Findex //字母
    		//map 没有 key 就创建加入
    		if(!map[key]){
    			map[key] = {
    				title:key,
    				items:[]
    			}
    		}
    		//将首字母一样的放进items中
		    //map[key].items.push({
    		//name:item.Fsinger_name,
				// id:item.Fsinger_mid,
				// avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
    		//})
    		//优化抽象一个类 
    		map[key].items.push(new Singer({
    			name:item.Fsinger_name,
				id:item.Fsinger_mid,
				avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
    		}))
    		// console.log('map',map) 
    	})
    	// console.log('map',map)

    	//-----------为了得到有序列表，需要处理map，进行分类 第二步
		let hot = []
		let ret = []
		//循环map
		for (let key in map){
			let val = map[key]
			//字母
			if(val.title.match(/[a-zA-Z]/)){
				ret.push(val)
			}else if(val.title === HOT_NAME){ //热门数据
				hot.push(val)
			}
		}
		//按字母排序
		// 排序函数 (a,b)=> A-Z升序
		ret.sort((a,b)=>{
			return a.title.charCodeAt(0) - b.title.charCodeAt(0)
		})
		//concat() 方法用于连接两个或多个数组。
		// console.log('hot',hot,'ret',ret)
		return hot.concat(ret)
    },
    // 做一层映射vuex ...是拓展运算符 
    ...mapMutations({
      //setSinger 是方法名 , SET_SINGER 是 multations 里面的常量
      'setSinger': 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
