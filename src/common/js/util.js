/**
 * 随机数
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
/**
 * 洗牌函数
 * @param  {Array} arr 原数组
 * @param  {boolean} flag 是否改变原数组，默认不改变
 * @return {Array}     新数组
 */
// export function shuffle(arr, flag = false) {
//  // console.log('arr',arr)
//     let newArr = []
//     flag ? (newArr = arr) : (newArr = this.cloneArr(arr))

//     for (let i = 0; i < newArr.length; i++) {
//         let j = getRandom(0, i)
//         let temp = newArr[i]
//         newArr[i] = newArr[j]
//         newArr[j] = temp
//     }
//     return newArr
// }
// export function shuffle(arr) {
//  // console.log('arr',arr)
//     // let newArr = []
//     // flag ? (newArr = arr) : (newArr = this.cloneArr(arr))
//     let _arr = arr.slice()
//     for (let i = 0; i < _arr.length; i++) {
//         let j = getRandom(0, i)
//         let temp = _arr[i]
//         _arr[i] = _arr[j]
//         _arr[j] = temp
//     }
//     return _arr
// }

/**
 * 克隆数组
 * @param  {array} arr 原数组
 * @return {array}     新数组
 */
function cloneArr(arr) {
    // 从第一个字符就开始 copy
    // slice(start,end) 方法可从已有的数组中返回选定的元素。
    return arr.slice(0)
}
//洗牌函数
export function shuffle(arr, flag = false) {
    // console.log('arr',arr)
    let newArr = []
    flag ? (newArr = arr) : (newArr = cloneArr(arr))

    for (let i = 0; i < newArr.length; i++) {
        let j = getRandom(0, i)
        let temp = newArr[i]
        newArr[i] = newArr[j]
        newArr[j] = temp
    }
    // console.log('arr',arr,newArr)

    return newArr
}


/*
*节流函数
*/
export function debounce(func, delay) {
  let timer
  //返回一个函数，并拿到参数
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}



