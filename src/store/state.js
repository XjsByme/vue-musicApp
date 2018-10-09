/**
* vuex 状态 单一状态树
* vuex 操作顺序：state.js -> mutations-type.js -> mutations.js -> getters.js
*/
//播放模式设置
import {playMode} from 'common/js/config'
import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

const state = {
	//-------------------------------------歌手部分
	singer:{},//歌手信息列表
	//-------------------------------------歌曲播放部分
	playing: false,//是否播放
    fullScreen: false,//是否显示隐藏播放界面
    playlist: [],//播放列表
    sequenceList: [],//顺序列表
    mode: playMode.sequence,//播放模式
    currentIndex: -1,//当前播放模式
    //-------------------------------------歌单部分
    disc:{}, //歌单对象
    //-------------------------------------排行榜
    topList: {},
    // searchHistory:[] //搜索历史
    searchHistory: loadSearch()
}
export default state

