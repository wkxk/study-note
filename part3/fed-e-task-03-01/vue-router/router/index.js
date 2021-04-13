import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../pages/a.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      {
        path: '/',
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
  },
  {
    path: '/b',
    name: 'IndexB',
    component: () => import('../pages/b.vue')
  },
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