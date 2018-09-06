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
    	url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
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