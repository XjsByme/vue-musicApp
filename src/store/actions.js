// 根级别的 action
// 封装复杂的 mutations

import * as types from './multations-type.js'
import { playMode } from 'common/js/config'
import { shuffle } from '@/common/js/util.js'

function findIndexFun(list,song){
	// console.log(list,song)
	return list.findIndex((item)=>{
		// console.log('item',item,'song',song)
		// console.log('item',item.id,'song',song.id)
		return item.id === song.id
	})
}

// selectPlay 方法.接收的参数，{commit，state}解构 commit方法，state属性;{list,index} list对象值,index 对象值

export const selectPlay = function({commit,state},{list,index}){
	// console.log(state.mode,playMode.random)
	//提交
	commit(types.SET_PLAYING_STATE, true)
  	commit(types.SET_FULL_SCREEN, true)
	//避免和随机播放冲突有bug
	if(state.mode === playMode.random){ //随机播放
		//随机播放，重新洗牌
		let randomList = shuffle(list)
		commit(types.SET_PLAYLIST, randomList)
		//对应歌曲和索引
		index = findIndexFun(randomList,list[index])
		// console.log('index',index)
	}else{ //顺序播放
		//顺序列表
		commit(types.SET_PLAYLIST, list)
	}
	commit(types.SET_SEQUENCE_LIST, list)
  	commit(types.SET_CURRENT_INDEX, index)
}

// 随机播放全部按钮
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random) //随机播放
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, 0)
}

