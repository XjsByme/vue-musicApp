/*
* 18/04/10 by zhang
* 获取QQ音乐线上数据接口 请求封装
*/
//jsonp 是common/js/jsonp 中定义的方法,直接拿到函数来用就行了
import jsonp from 'common/js/jsonp'
//{ commonParams, options } 是 @/api/config.js 中定义了的变量(通用参数)
import {commonParams, options} from './config' 
//引入axios
import axios from 'axios'
//利用jsonp抓取数据的方法，传参获取数据
/**
*抓取的是 轮播图部分信息数据
*/
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  //返回的其实是一个promise
  return jsonp(url, data, options)
}
/**
 * axios 抓取推荐页列表数据
 * 接口：https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg
 * 接口提供方使用了 referer:https://y.qq.com/portal/playlist.html
 * axios 结合 node.js 代理后端请求
 */
export function getDiscList() {
  const url = '/api/getDiscList' //在webpack.dev.config启用了代理跨域
  // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    //成功后返回
    return Promise.resolve(res.data)
  })
}

/**
*歌手列表数据
*/
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}

/**
*歌手详情
*/
export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })
  return jsonp(url, data, options)
}

/**
*歌词数据获取
*/
export function getLyric(mid) {
  const url = '/api/getLyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    // console.log('res',res)
    return Promise.resolve(res.data)
  })
}

/**
 * jsonp 抓取推荐页歌单详情数据(歌曲列表)
 * 接口：https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg
 * 提供方：https://y.qq.com/n/yqq/playlist/1471714611.html#
 */
// export function getSongList(disstid) {
//   const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

//   const data = Object.assign({}, commonParams, {
//     disstid,
//     type: 1,
//     json: 1,
//     utf8: 1,
//     onlysong: 0,
//     platform: 'yqq',
//     hostUin: 0,
//     needNewCode: 0
//   })

//   return jsonp(url, data, options)
// }
// export function getSongList(disstid) {
//   const url = '/api/getSongList'
//   const data = Object.assign({}, commonParams, {
//     disstid,
//     type: 1,
//     json: 1,
//     utf8: 1,
//     onlysong: 0,
//     platform: 'yqq',
//     hostUin: 0,
//     needNewCode: 0,
//     g_tk: 67232076
//   })
//   return axios.get(url, {
//     params: data
//   }).then(res => {
//     console.log('res',res)
//     return Promise.resolve(res.data)
//   })
// }

// export function getDiscList() {
//   const url = '/api/getDiscList' //在webpack.dev.config启用了代理跨域
//   // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
//   const data = Object.assign({}, commonParams, {
//     platform: 'yqq',
//     hostUin: 0,
//     sin: 0,
//     ein: 29,
//     sortId: 5,
//     needNewCode: 0,
//     categoryId: 10000000,
//     rnd: Math.random(),
//     format: 'json'
//   })

//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     //成功后返回
//     return Promise.resolve(res.data)
//   })
// }

export function getSongList(disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })

  return jsonp(url, data, {
    param: 'jsonpCallback',
    prefix: 'jp'
  })
}