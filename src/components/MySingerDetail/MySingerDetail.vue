<template>
  <!-- 动画 -->
  <transition name="slide">
    <!-- MyMusicList 组件 -->
    <MyMusicList :songs="songs" :title="title" :bg-image="bgImage"></MyMusicList>
 </transition>
</template>
<script type="text/ecmascript-6">
//拿到已经设置的 singer 
import { mapGetters } from 'vuex'
//歌手详情数据接口
import { getSingerDetail,getSongVkey } from 'api/getDateServer'
//公共变量
import {ERR_OK} from 'api/config'
//createSong class 类引入
 import { CreatSong } from 'common/js/songClass'
//MyMusicList组件引入
import MyMusicList from 'components/MyMusicList/MyMusicList'

export default{
  data(){
    return {
      songs:[]
    }
  },
  components:{
    MyMusicList
  },
	computed:{
    //歌手列表数据，store中使用引用的
		...mapGetters([
			'singer'
		]),
    // 传入子组件
    title() {
      return this.singer.name
    },
    // 传入子组件
    bgImage() {
      return this.singer.avatar
    }
	},
  methods:{
    _getSingerDetail(){
      // 禁止直接刷新详情页（获取不到歌手 id）
      if (!this.singer.id) {
        //没id 就直接切换到 歌手列表页
        this.$router.push('/singer')
        return
      }
      //调用歌手详情接口获取数据
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._formatSongs(res.data.list)
          // console.log(this.songs)
        }
      })
    },
    //重组 res.data.list 数据,只拿需要的
    _formatSongs(list){
      let result = []
      list.forEach((item)=>{
        // console.log('item',item)
        // 解构赋值-拿到item 下的 musicData 列表数据
        let {musicData} = item
        //-------------
        getSongVkey(musicData.songmid).then((res) => {
          const vkey = res.data.items[0].vkey;
          if (musicData.songid && musicData.albummid) {
            result.push(CreatSong(musicData, vkey))
          }
        })
        //-------------
        // console.log('musicData',musicData)
        // if(musicData.songid && musicData.albummid){
        //   result.push(CreatSong(musicData))
        // }
      })
      return result
    }
  },
  created () {
    // console.log(this.singer)
    this._getSingerDetail()
  },
  mounted () {},
  //销毁，良好的编程习惯
  destroyed () {}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
// .my-singer-detail
//   position: fixed;
//   z-index: 100;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: $color-background;
//
.slide-enter-active, .slide-leave-active
    transition: all 0.3s

.slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
