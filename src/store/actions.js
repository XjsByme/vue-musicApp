// 根级别的 action
// 封装复杂的 mutations

import * as types from './multations-type.js'
import { playMode } from 'common/js/config'

// selectPlay 方法.接收的参数，{commit，state}解构 commit方法，state属性;{list,index} list对象值,index 对象值

export const selectPlay = function({commit,state},{list,index}){
	//提交
	commit(types.SET_SEQUENCE_LIST,list)
	commit(types.SET_PLAYLIST, list)
	commit(types.SET_CURRENT_INDEX, index)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}