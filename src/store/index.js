/**
* vuex 入口文件
* 组装模块并导出 store 的地方
*/

import Vue from 'vue'
import Vuex from 'vuex'

//引入相关js
import state from './state.js'
import mutations from './multations.js'

// import * as 语法
import * as actions from './actions.js'
import * as getters from './getters.js'

//vuex 插件 开发模式使用-上线关闭
import createLogger from 'vuex/dist/logger' // Vuex 自带一个日志插件用于一般的调试

//应用 vuex
Vue.use(Vuex)

//自带的调试工具
const debug = process.env.NODE_ENV !== 'production'

//用export default -> new Vuex.Store,封装代码，让外部可以引用。
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  strict: debug, //严格模式 开发模式使用-上线关闭
  plugins: debug ? [createLogger()] : []
})