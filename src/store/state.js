/**
* vuex 状态 单一状态树
* vuex 操作顺序：state.js -> mutations-type.js -> mutations.js -> getters.js
*/
//播放模式设置
import {playMode} from 'common/js/config'

const state = {
	singer:{},//歌手信息列表
	playing: false,//是否播放
    fullScreen: false,//是否显示隐藏播放界面
    playlist: [],//播放列表
    sequenceList: [],//顺序列表
    mode: playMode.sequence,//播放模式
    currentIndex: -1,//当前播放模式
}
export default state

