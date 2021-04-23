## vue-router的实现原理

### 路由规则中的props属性，可以设置动态路由的入参

**路由规则中设置如下：**

```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  ...
  {
    path: '/c/:id',
    // 动态路由通过设置props属性，可以在子组件中通过props属性获取
    props: true,
    name: 'IndexC',
    component: () => import('../pages/c.vue')
  },
]

const router = new VueRouter({
  routes
})
export default router
```

**子组件中获取动态路由的id：**

```vue
<template>
  <div class="wrapper">c</div>
</template>

<script>
export default {
  components: {},
  // 获取动态路由的id
  props: ['id'],
  data() {
    return {
    };
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {},
};
</script>
```

> 推荐使用此方法传递动态路由的id，可以避免去依赖$route。
>

### 嵌套路由的使用

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../pages/a.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    // children属性设置嵌套路由
    children: [
      {
        path: '',
        name: 'IndexB',
        component: () => import('../pages/b.vue')
      },
      {
        path: 'c/:id',
        // 动态路由通过设置props属性，可以在子组件中通过props属性获取
        props: true,
        name: 'IndexC',
        component: () => import('../pages/c.vue')
      },
    ]
  }
  ...
]

const router = new VueRouter({
  routes
})
export default router
```

### 编程式导航

```js
this.$router.push('/')
this.$router.replace('/')
this.$router.go(-1)
this.$router.back()
...
```

### hash模式和history模式的区别

- hash模式是基于锚点，以及onhashchange事件 
- history模式是基于HTML5中的History API
  - history.pushState() IE 10 以后的才支持
  - history.replaceState()
- history模式的使用：
  - 需要服务端配置，否则刷新时出现404

## **Vue Router** **模拟实现**

**实现思路**

- 创建 VueRouter 插件，静态方法 install
  - 判断插件是否已经被加载
  - 当 Vue 加载的时候把传入的 router 对象挂载到 Vue 实例上（注意：只执行一次）

- 创建 VueRouter 类
  - 初始化，options、routeMap、app(简化操作，创建 Vue 实例作为响应式数据记录当前路径)
  - initRouteMap() 遍历所有路由信息，把组件和路由的映射记录到 routeMap 对象中
  - 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径
  - 创建 router-link 和 router-view 组件
  - 当路径改变的时候通过当前路径在 routerMap 对象中找到对应的组件，渲染 router-view

### History 模式

```js
let _Vue = null;
class VueRouter {
  static install(Vue) {
    //1 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    //2 把Vue的构造函数记录在全局
    _Vue = Vue;
    //3 把创建Vue的实例传入的router对象注入到Vue实例
    // _Vue.prototype.$router = this.$options.router
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
        }
      },
    });
  }
  constructor(options) {
    this.options = options;
    this.routeMap = {};
    // observable
    this.data = _Vue.observable({
      current: "/",
    });
    this.init();
  }
  init() {
    this.createRouteMap();
    this.initComponent(_Vue);
    this.initEvent();
  }
  createRouteMap() {
    //遍历所有的路由规则 吧路由规则解析成键值对的形式存储到routeMap中
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component;
    });
  }
  initComponent(Vue) {
    Vue.component("router-link", {
      props: {
        to: String,
      },
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: this.to,
            },
            on: {
              click: this.clickhander,
            },
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickhander(e) {
          history.pushState({}, "", this.to);
          this.$router.data.current = this.to;
          e.preventDefault();
        },
      },
      // template:"<a :href='to'><slot></slot><>"
    });
    const self = this;
    Vue.component("router-view", {
      render(h) {
        // self.data.current
        const cm = self.routeMap[self.data.current];
        return h(cm);
      },
    });
  }
  initEvent() {
    //
    window.addEventListener("popstate", () => {
      this.data.current = window.location.pathname;
    });
  }
}
```

### hash 模式

```js
import Vue from 'vue'
console.dir(Vue)
let _Vue = null
export default class VueRouter {
  // 实现 vue 的插件机制
  static install(Vue) {
    //1 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true
    //2 把Vue的构造函数记录在全局
    _Vue = Vue
    //3 把创建Vue的实例传入的router对象注入到Vue实例
    // _Vue.prototype.$router = this.$options.router
    // 混入
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router

        }
      }
    })
  }

  // 初始化属性
  constructor(options) {
    this.options = options // options 记录构造函数传入的对象
    this.routeMap = {} // routeMap 路由地址和组件的对应关系
    // observable     data 是一个响应式对象
    this.data = _Vue.observable({
      current: "/" // 当前路由地址
    })
    this.init()
  }

  // 调用 createRouteMap, initComponent, initEvent 三个方法
  init() {
    this.createRouteMap()
    this.initComponent(_Vue)
    this.initEvent()
  }

  // 用来初始化 routeMap 属性，路由规则转换为键值对
  createRouteMap() {
    //遍历所有的路由规则 把路由规则解析成键值对的形式存储到routeMap中
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    });
  }

  // 用来创建 router-link 和 router-view 组件
  initComponent(Vue) {
    // router-link 组件
    Vue.component('router-link', {
      props: {
        to: String
      },
      // render --- 可在 vue 运行时版直接使用
      render(h) {
        // h(选择器（标签的名字）， 属性，生成的某个标签的内容)
        return h('a', {
          attrs: {
            href: '#' + this.to,
          },
          // 注册事件
        //   on: {
        //     click: this.clickHandler // 点击事件
        //   },
        }, [this.$slots.default]) // this.$slot.default 默认插槽
      },
    });
    // router-view 组件
    const self = this; //这里的 this 指向 vueRouter 实例
    Vue.component('router-view', {
      render(h) {
        // 根据 routerMap 中的对应关系，拿到当前路由地址所对应的组件
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
    
  }

  // 用来注册 hashchange 事件
  initEvent () {
     window.addEventListener('hashchange', () => {
      this.data.current = this.getHash();
    });
    window.addEventListener('load', () => {
      if (!window.location.hash) {
        window.location.hash = '#/';
      }
    });
  }

  getHash() {
    return window.location.hash.slice(1) || '/';
  }
  
}
```

