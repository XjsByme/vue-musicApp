/*
* vuex multations
*/
//引入 multations-type.js
/* * as types  是拿到常量的便捷方式*/
import * as types from './multations-type.js'

//multations 下挂载很多方法 [types.SET_SINGER]--方法名
const multations = {
	//SET_SINGER 方法名 state 是state.js 里面的 ,SET_SINGER 是state里面的常量
	[types.SET_SINGER](state,singer){ //参数  state即当前状态树state，singer 是提交时传递的参数
		//修改状态,(state 是state.js 里面的 state.singer),后面singer 是传过来的
		state.singer = singer
	}
}
//暴露出来
export default multations