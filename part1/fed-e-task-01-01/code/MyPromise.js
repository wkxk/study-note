/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/

/**
 * 1.Promise实例化时会立即执行，并接受一个函数，函数接收两个参数，resolve和reject
 * resolve代表成功时的回调，reject代表失败时的回调
 * 2.Promise有三种状态，pending，resolved，rejected，且状态只能由
 *  pending——————>resolved
 *  pending——————>rejected
 * 状态一旦更改就无法改变
 * 3.可以链式调用.then().then(),值向下传递
 * 4.then()方法中不能返回自身，否则报TypeError错误
 */

// 全局定义三种状态
const PENDING = 'pending' // 等待状态
const RESOLVED = 'resolved' // 成功状态
const REJECTED = 'rejected' // 失败状态
class MyPromise {
  constructor (fn) {
    // 捕获异常
    try {
      // 实例化时立即执行，并接受一个函数，函数接收两个参数，resolve和reject
      // resolve代表成功时的回调，reject代表失败时的回调
      fn(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }
  // 定义一个值来存储状态
  status = PENDING
  // 定义一个值来存储成功后的值
  value = undefined
  // 定义一个值来存储失败后的值
  reason = undefined
  // 成功回调,由于是链式调用会存在多个成功回调，所以数组来存储
  successCallBack = []
  // 失败回调,由于是链式调用会存在多个失败回调，所以数组来存储
  failCallBack = []
  // 成功时的回调,箭头函数防止this指向改变
  resolve = value => {
    // 如果状态不为PENDING，就说明状态已经改变过了，阻止后面的程序执行
    if (this.status !== PENDING) return
    // 将等待状态改为成功状态
    this.status = RESOLVED
    // 存储成功后的值
    this.value = value
    // 自动执行成功回调,取出数组中的第一个执行，直至全部取出执行完毕
    while (this.successCallBack.length) this.successCallBack.shift()()
  }
  // 失败时的回调
  reject = reason => {
    // 如果状态不为PENDING，就说明状态已经改变过了，阻止后面的程序执行
    if (this.status !== PENDING) return
    // 将等待状态改为失败状态
    this.status = REJECTED
    // 存储失败的原因
    this.reason = reason
    // 自动执行失败回调,取出数组中的第一个执行，直至全部取出执行完毕
    while (this.failCallBack.length) this.failCallBack.shift()()
  }
  // 提供一个then方法返回Promise对象继续链式调用
  then (successCallBack, failCallBack) {
    // 如果successCallBack为空 p1.then(123, 123).then(123).then()这种情形,
    successCallBack = successCallBack instanceof Function ? successCallBack : value => value
    failCallBack = failCallBack instanceof Function ? failCallBack : reason => { throw reason }
    // 返回一个promise，从而可以链式调用
    const p = new MyPromise((resolve, reject) => {
      if (this.status === RESOLVED) {
        setTimeout(() => {
          try {
            // 成功状态
            // 这个值可能是普通值，也可能是Promise对象，所以就得做判断处理
            const a = successCallBack(this.value)
            // 由于p属于异步任务，这里获取不到p，所以采用setTimeout来异步获取
            resolveMyPromise(p, a, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            // 失败状态
            const b = failCallBack(this.reason)
            // 由于p属于异步任务，这里获取不到p，所以采用setTimeout来异步获取
            resolveMyPromise(p, b, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      } else {
        // 等待状态,存储成功和失败的回调，待后续调用
        this.successCallBack.push(() => {
          setTimeout(() => {
            try {
              // 成功状态
              const a = successCallBack(this.value)
              // 由于p属于异步任务，这里获取不到p，所以采用setTimeout来异步获取
              resolveMyPromise(p, a, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        this.failCallBack.push(() => {
          setTimeout(() => {
            try {
              // 失败状态
              const b = failCallBack(this.reason)
              // 由于p属于异步任务，这里获取不到p，所以采用setTimeout来异步获取
              resolveMyPromise(p, b, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })
    return p
  }
  // finally方法
  finally (callBack) {
    return this.then(value => {
      return MyPromise.resolve(callBack()).then(() => value)
    }, reason => {
      return MyPromise.resolve(callBack()).then(() => { throw reason })
    })
  }
  // 异常捕获
  catch (failCallBack) {
    // 直接调用then方法
    return this.then(undefined, failCallBack)
  }
  // 静态all方法
  static all (array) {
    return new MyPromise((resolve, reject) => {
      // 定义一个数组用来存储返回的结果
      let result = []
      // 定义一个变量用来记录result数组长度
      let index = 0
      // 用来添加数据的函数
      function addData (key, data) {
        // 向数组指定下标添加数据
        result[key] = data
        // 每加一个数据，index累加
        index++
        // 知道index的值和数组长度的值相等了，就说明异步任务也执行完毕了，最后把结果返回
        if (index === result.length) resolve(result)
      }
      for (let i = 0; i < array.length; i++) {
        // 当前元素
        const cerrent = array[i]
        // 如果当前元素是一个promise对象
        if (cerrent instanceof MyPromise) {
          // 调用then方法获取结果，并存值
          cerrent.then(res => addData(i, res), reason => reject(reason))
        } else {
          // 如果只是普通值，直接像数组中存储数据
          addData(i, array[i])
        }
      }
    })
  }
  // 静态resolve
  static resolve (value) {
    // 如果是Promise对象，直接返回
    if (value instanceof MyPromise) return value
    // 如果不是，返回一个Promise,返回该值
    return new MyPromise(resolve => resolve(value))
  }
}

/**
 * 用来处理返回结果
 * @param {*} p 当前返回的Mypromise对象
 * @param {*} a 返回结果
 * @param {*} resolve 成功回调
 * @param {*} reject 失败回调
 * @returns
 */
function resolveMyPromise(p, a, resolve, reject) {
  // 如果resolve返回了当前MyPromise，就会报类型错误
  if (p === a) {
    return reject(new TypeError('MyPromise TypeError'))
  }
  // 如果a是一个MyPromise对象,调用then方法将值向下传递
  if (a instanceof MyPromise) {
    a.then(resolve, reject)
  } else {
    // 如果a是一个普通值，直接返回
    resolve(a)
  }
}










// MyPromise.resolve(1).then(res => console.log(res))
// const p1 = new MyPromise((resolve, reject) => {
//   // setTimeout(() => {
//   //   resolve('success')
//   // }, 1000)
//   resolve('p1')
//   // reject('fail')
//  })
//  const p2 = new MyPromise((resolve, reject) => {
//   // setTimeout(() => {
//   //   resolve('success')
//   // }, 1000)
//   resolve('p2')
//   // reject('fail')
//  })
//  MyPromise.all([p1, p2]).then(res => console.log(res))
//  p1.then(() => p2).then(res => console.log(res), res => console.log(res))
// Promise.finally(1).then(res => console.log(res))

function p1 () {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      console.log('p1');
    }, 1000)
  })
}

function p2 () {
  return new MyPromise((resolve, reject) => {
    reject('p2')
  })
}

p2().catch(res => {
  console.log(res);
})