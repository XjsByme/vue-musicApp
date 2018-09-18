import { getLyric } from 'api/getDateServer'
import { Base64 } from 'js-base64'

/*
*歌手详情歌单封装
*/
export default class Song {
  constructor({id,mid,singer,name,album,duration,image,url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  //获取歌词数据
  getLyric(){
  	if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === 0) {
          this.lyric = Base64.decode(res.lyric)
          // console.log('this.lyric',this.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}
//拓展song类工厂方法-在这里new Song, 避免在组件中写很多
export function CreatSong(musicData){
	return new Song({
		id: musicData.songid,
		mid: musicData.songmid,
		singer: filterSinger(musicData.singer),//filterSinger 中处理一遍
		name: musicData.songname,
	    album: musicData.albumname,
	    duration: musicData.interval,
	    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    	//url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    	// url:'//ws.stream.qqmusic.qq.com/C100000QCwge3B6Ad1.m4a?fromtag=0&guid=126548448'
    	//http://ws.stream.qqmusic.qq.com/C100'+songmid+'.m4a?fromtag=0&guid=126548448
    	url:`http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`//播放地址
	})
}

//Singer 处理 -数组转
function filterSinger(singer){
	let ret = []
	if(!singer){
		return ''
	}
	//将名称拿出来 组成数组
	singer.forEach((item) => {
    	ret.push(item.name)
 	})
 	//将数组用“/”分割字符串
 	return ret.join('/')
}