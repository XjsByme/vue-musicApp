<template>
  <div class="my-music-list">
  	<!-- 返回按钮 -->
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <!-- 顶部歌手名字 -->
    <h1 class="title">
      
    </h1>
    <!-- 背景 -->
    <div class="bg-image">
      <!-- 随机播放全部 -->
      <div class="play-wrapper">
        <div class="play">
          <i class="icon-play">
            <span class="text">随机播放全部</span>
          </i>
        </div>
      </div>
      <!-- 蒙层 -->
      <div class="filter"></div>
    </div>
    <!-- 推层 -->
    <div class="bg-layer"></div>
    <!-- scroll 组件 -->
      <!-- 歌手详情歌曲列表 -->
      <div class="song-list-wrapper">
        <MySongList :songs="songs"></MySongList>
      </div>
      <!-- loging -->
      <div v-show="!songs.length" class="loading-container">
          <!-- <my-loading></my-loading> -->
      </div>
</div>
</template>

<script type="text/ecmascript-6">
// MySongList 歌手详情歌曲列表
import MySongList from 'components/base/MySongList/MySongList'
export default{
  components:{
    MySongList
  },
  data(){
    return {

    }
  },
  props: {
    // 背景图
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    // 子组件排行奖杯图片
    rank: {
      type: Boolean,
      default: false
    }
  },
	computed:{
    
	},
  methods:{
   
  },
  created () {
    console.log('title',this.title)
    
  },
  mounted () {
  },
  //销毁，良好的编程习惯
  destroyed () {}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
