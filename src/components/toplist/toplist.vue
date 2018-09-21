<template>
  <div>
    <MyMusicList :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></MyMusicList>
  </div>
</template>
<script type="text/ecmascript-6">
import {ERR_OK} from 'api/config'
//MyMusicList组件引入
import MyMusicList from 'components/MyMusicList/MyMusicList'
import {mapGetters} from 'vuex'
import { CreatSong } from 'common/js/songClass.js'
//接口请求
import { getMusicList } from 'api/getDateServer'

export default{
  components:{
    MyMusicList
  },
  data() {
    return {
      songs: [],
      rank: true
    }
  },
  created() {
    this._getMusicList()
  },
  methods:{
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (musicData.songid && musicData.albummid) {
          ret.push(CreatSong(musicData))
        }
      })
      return ret
    }
  },
  computed:{
    title() {
        return this.topList.topTitle
      },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  }
} 
</script>