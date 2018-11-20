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
export function CreatSong(musicData,vkey){
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
    	// url:`http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=0&guid=126548448`//播放地址
      url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`
	})
}

// http://dl.stream.qqmusic.qq.com/C1L0001ApDs72gYqUk.m4a?vkey=F33047F1591194F61A2B27094B6CB1CBBD4C504FDB466A9975ADE22861FE0845D36C70AA0E23FF9000B2D5DEE71EB63E904224A849A7C59F&guid=8715282750&uin=2703401268&fromtag=66  //1

//http://ws.stream.qqmusic.qq.com/C100001Qu4I30eVFYb.m4a?fromtag=0&guid=126548448  //1

//http://dl.stream.qqmusic.qq.com/C400003OUlho2HcRHC.m4a?guid=5563104585&vkey=D9A4C04AF87ED79ABAFEA9F1CF7D736BF3F1EFEEC349D2E01B7112E1BA6874D058D51801FCFE556E12B012655694A91EAEC7EFDEFB044A36&uin=0&fromtag=38  //1

//http://ws.stream.qqmusic.qq.com/C100001Qu4I30eVFYb.m4a?fromtag=0&guid=126548448


//http://dl.stream.qqmusic.qq.com/C400003aAYrm3GE0Ac.m4a?guid=5563104585&vkey=A1DB4A10A2B8B2339722FC52DC41859F14E250AACD921139B317D929E6340DC7A2B447AC9801C594375DED53875AB562D478668CF1F51FAA&uin=0&fromtag=38

//http://dl.stream.qqmusic.qq.com/C400001Qu4I30eVFYb.m4a?guid=5563104585&vkey=3EF375CCFF37FD08681D906E94D8B3B9FA70E9B72FE99E79809B25CBB45B5407C4F1F7EABAD86367522EB0B6B2B796A91F45B91DADAB9FF7&uin=0&fromtag=38


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