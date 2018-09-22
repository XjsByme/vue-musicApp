<template>
  <div class="suggest" ref="suggest">
    <ul class="suggest-list">
      <li>
        3r3r3
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
import { getSearch } from 'api/getDateServer'
import {ERR_OK} from 'api/config'
//公共变量
const perpage = 20

export default{
  data(){
    return{
      page: 1,
      pullup: true,
      beforeScroll: true,
      hasMore: true,
      result: []
    }
  },
  props:{
    //搜索关键词
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
        // this.search(newQuery)
        // console.log('newQuery',newQuery)
        getSearch(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            // this.result = this._genResult(res.data)
            // this._checkMore(res.data)
            console.log('res',res)
          }
        })
      }
  },
  method:{
    // search(){
    //   getSearch(this.query, this.page, this.showSinger, perpage).then((res) => {
    //     if (res.code === ERR_OK) {
    //       // this.result = this._genResult(res.data)
    //       // this._checkMore(res.data)
    //       console.log('res',res)
    //     }
    //   })
    // },
    // _genResult(){
    //   let ret = []
    //     if (data.zhida && data.zhida.singerid) {
    //       ret.push({...data.zhida, ...{type: TYPE_SINGER}})
    //     }
    //     if (data.song) {
    //       ret = ret.concat(this._normalizeSongs(data.song.list))
    //     }
    //   return ret
    // }
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