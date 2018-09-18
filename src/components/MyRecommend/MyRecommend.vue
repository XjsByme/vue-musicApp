<template>
  <div class="recommend" ref="recommend">
    <!-- :data="discList" 给组件传入数据 -->
    <MyScroll ref="scroll" class="recommend-content" :data="discList" @scrollToEnd="scrollToEnd" :pullup="pullup">
      <!-- 插槽内容 -->
      <div>
        <!-- 轮播图 -->
        <!-- recommends有，才渲染slider 防止子元素没有 -->
        <div v-if="recommends.length" class="slider-wrapper">
          <!-- slider -->
          <MySlider>
            <!-- 插槽 -->
            <div class="swiper-wrapper">
              <div v-for="item in recommends" class="swiper-slide">
                <a :href="item.linkUrl">
                    <!-- @load="loadImage" 事件 needsclick 避免点击冲突-->
                    <img class="needsclick" :src="item.picUrl" @load="loadImage">
                </a>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </MySlider>
        </div>
        <!-- 热门歌单 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon">
                <!-- v-lazy 图片懒加载 -->
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <!-- v-html 转义字符 -->
                <p class="name" v-html="item.creator.name"></p>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
          <div class="bottomTitle" v-show="bottomShow">{{bottomTitle}}</div>
        </div>
      </div>
      <!-- loading -->
      <div class="loading-container" v-show="!discList.length">
        <Myloading :title="loading_title"></Myloading>
      </div>
    </MyScroll>
  </div>
</template>
<script type="text/ecmascript-6">
  //getRecommend 数据接口方法
  import {getRecommend,getDiscList} from 'api/getDateServer'
  //公共变量
  import {ERR_OK} from 'api/config'
  //轮播图组件引入
  import MySlider from 'base/MySlider/MySlider'
  //scroll 引入
  import MyScroll from 'base/MyScroll/MyScroll'
  //loading 引入
  import Myloading from 'base/Myloading/Myloading'
  //playlistMixin引入
  import { playlistMixin } from '@/common/js/mixin.js'
  export default{
    mixins: [playlistMixin],
    //数据对象-默认值
    data() {
      return {
        recommends: [],
        discList: [],
        loading_title:'正在加载...', //loading传值
        pullup:true,
        bottomTitle:'已经到底啦',
        bottomShow:false
      }
    },
    components: {
      MySlider,
      MyScroll,
      Myloading
    },
    //created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
    //mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作
    created(){
      this._getRecommend() //调用触发 轮播图
      //模拟慢网速状态-玩命加载显示延迟
      setTimeout(() =>{
        this._getDiscList() // 歌单
      },600)
    },
    //定义方法
    methods:{
      handlePlaylist(playlist){
        let bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      //轮播图数据
      _getRecommend(){
        //getRecommend() 是请求接口方法
        getRecommend().then((res) => { //请求接口，返回数据
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
            // console.log('this.recommends',this.recommends)
          }
        })
      },
      //推荐歌单列表数据
      _getDiscList(){
        getDiscList().then((res) =>{
          if(res.code === ERR_OK){
            this.discList = res.data.list
            // console.log('res',this.discList)
          }
        })
      },
      //重新计算-监听-避免滚动歌单高度缺失滚动不到底部
      loadImage(){
        //设置标位 确保逻辑执行一次
        if(!this.checkloaded){
          this.$refs.scroll.refresh()
          this.checkloaded = true
        }
      },
      //滚动到底部了
      scrollToEnd(){
        this.bottomShow = true
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/common"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
        //歌单
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        li.item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      //正在加载-居中定位
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>