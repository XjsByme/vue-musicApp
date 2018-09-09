// 映射及计算
// const singer = function (state){
	//return state.singer
//}
export const singer = state => state.singer

export const playing = state => state.playing  // 播放列表

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex //当前的
//当前播放的 
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}