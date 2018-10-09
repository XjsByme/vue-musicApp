//good-storage引入
import storage from 'good-storage'

//搜索key
const SEARCH_KEY = '__search__'
//最大缓存数据
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200
/*
*数组处理
*/
function insertArray(arr, val, compare, maxLen) {
  //返回位置
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
  	//删除一个
    arr.splice(index, 1)
  }
  //再插入（unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度）
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
  	//pop() 方法用于删除并返回数组的最后一个元素。
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch(query) {
  //获取
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
  	//返回一个值
    return item === query
  }, SEARCH_MAX_LEN)
  //设置
  storage.set(SEARCH_KEY, searches)
  return searches
}
//删除单个搜索历史
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
//删除所有搜索历史
export function clearSearch() {
  //清空
  storage.remove(SEARCH_KEY)
  return []
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

