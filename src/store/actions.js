// 根级别的 action
// 封装复杂的 mutations

import * as types from './multations-type.js'
import { playMode } from 'common/js/config'
import { shuffle } from '@/common/js/util.js'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

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

//suggest相关
export const insertSong = function({commit, state},song){
	let playlist = state.playlist.slice() //返回playlist
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	// 记录当前歌曲
  	let currentSong = playlist[currentIndex]
  	// 查找当前列表中是否有待插入的歌曲并返回其索引
  	let fpIndex = findIndexFun(playlist, song)
  	// 因为是插入歌曲，所以索引+1
	currentIndex++
	// 插入这首歌到当前索引位置
	playlist.splice(currentIndex, 0, song)
	// 插入这首歌到当前索引位置
  	playlist.splice(currentIndex, 0, song)
	  // 如果已经包含了这首歌
	  if (fpIndex > -1) {
	    // 如果当前插入的序号大于列表中的序号
	    if (currentIndex > fpIndex) {
	      playlist.splice(fpIndex, 1)
	      currentIndex--
	    } else {
	      playlist.splice(fpIndex + 1, 1)
	    }
    }
    let currentSIndex = findIndexFun(sequenceList, currentSong) + 1

    let fsIndex = findIndexFun(sequenceList, song)

    sequenceList.splice(currentSIndex, 0, song)

	if (fsIndex > -1) {
		if (currentSIndex > fsIndex) {
		  sequenceList.splice(fsIndex, 1)
		} else {
		  sequenceList.splice(fsIndex + 1, 1)
		}
	}

	commit(types.SET_PLAYLIST, playlist)
	commit(types.SET_SEQUENCE_LIST, sequenceList)
	commit(types.SET_CURRENT_INDEX, currentIndex)
	commit(types.SET_FULL_SCREEN, true)
	commit(types.SET_PLAYING_STATE, true)
}

/**
 * 保存搜索历史
 * @param  {[type]} query          搜索关键词
 */
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

/**
 * 删除单个搜索历史
 * @param  {[type]} query          搜索关键词
 */
export const delHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

/**
 * 删除全部搜索历史
 * @param  {[type]} query          搜索关键词
 */
export const clearHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}