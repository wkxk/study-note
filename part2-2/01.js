// alert('123')

// export const name = 'zs'

// export function start () {
//   console.log('start');
// }

let name = 'zs'
let age = 18
// 如果使用as导出成员变量，引入的时候就要引入对应的name1，start1
export { name, age }

setTimeout(() => {
  name = 'ls'
}, 1000)

// export default name