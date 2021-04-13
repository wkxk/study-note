// 模块的作用
import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

// 1.导入模块
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'
// 2.设置模块
const patch = init([
  styleModule, 
  eventListenersModule
])
// 3.使用h() 函数的第一个参数传入模块中使用的数据(对象)
let vnode = h('div', [
  h('h1', {
    style: {
      backgroundColor: 'red'
    }
  }, 'Hello World'),
  h('p', { 
    on: { 
      click: eventHandler 
    } 
  }, 'Hello P')
])

function eventHandler () {
  console.log('eventHandler');
}

let app = document.querySelector("#app")
let oldVnode = patch(app, vnode)
