// import { name, age } from './01.js'
// import * as obj from './01.js'
// console.log(obj);
// import name from './01.js'
// 对应as导出
// console.log(name, age); // zs 18

// name = 'wangwu'

// setTimeout(() => {
//   console.log(name, age); // ls 18
// }, 1500)

import('./01.js').then(res => {
  console.log(res);
})