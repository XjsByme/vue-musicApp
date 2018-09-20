<template>
  <transition name="slide">
    <MyMusicList :title="title" :bgImage="bgImage"></MyMusicList>
  </transition>
</template>
<script type="text/ecmascript-6">
//MyMusicList组件引入
import MyMusicList from 'components/MyMusicList/MyMusicList'
import {mapGetters} from 'vuex'
//接口请求
import { getSongList } from 'api/getDateServer'
//公共变量
import {ERR_OK} from 'api/config'
export default{
  data(){
    return {
      
    }
  },
  components:{
    MyMusicList
  },
  computed:{
    title(){
      return this.disc.dissname
    },
    bgImage() {
        return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  methods:{
    _getSongList(){
      // 禁止直接刷新详情页（获取不到歌单 id）
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then((res) =>{
        console.log('res',res)
        // if(res.code === ERR_OK){
        //   // this.discList = res.data.list
        //   console.log('res',res)
        // }
      })
    }
  },
  created () {
    this._getSongList()
  },
  mounted () {},
  //销毁，良好的编程习惯
  destroyed () {}
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>