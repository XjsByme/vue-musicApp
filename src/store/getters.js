// 映射及计算
// const singer = function (state){
	//return state.singer
//}
export const singer = state => { 
	return state.singer
}

// export const playing = state => state.playing  // 播放列表

export const playing = state => {
	return state.playing
}

export const fullScreen = state => state.fullScreen

export const playlist = state => {
	// console.log('playlist',state.playlist)
  return state.playlist
}

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex //当前的
//当前播放的 
export const currentSong = (state) => {
	// console.log(state.singer)
  return state.playlist[state.currentIndex] || {}
}

//歌单详情部分
export const disc = (state) =>{
	return state.disc
}
//排行榜
export const topList = state => state.topList
//搜索历史
export const searchHistory = state => state.searchHistory