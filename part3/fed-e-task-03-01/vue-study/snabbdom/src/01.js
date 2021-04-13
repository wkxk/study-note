import { init } from 'snabbdom/build/package/init'
import { h } from 'snabbdom/build/package/h'

const patch = init([])
// 第一个参数：标签+选择器
// 第二个参数：如果是字符串就是标签中的文本内容
let vnode = h('div#container.cli', 'Hello World')
let app = document.querySelector("#app")
// patch函数第一个参数: 旧的vnode，可以是dom元素
// 第二个参数：新的vnode
// 返回一个新的vnode
let oldVnode = patch(app, vnode)

vnode = h('div#container.xxx', 'Hello Snabbdom')
patch(oldVnode, vnode)