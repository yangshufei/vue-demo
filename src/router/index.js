import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('../views/map/index.vue')
  },
  {
    path: '/drag-table',
    name: 'drag-table',
    component: () => import('../views/dragTable/index.vue')
  },
  {
    path: '/svg-table',
    name: 'svg-table',
    component: () => import('../views/svg-table/index.vue')
  },
  {
    path: '/canvas-dragon',
    name: 'canvas-dragon',
    component: () => import('../views/canvas-dragon/index.vue')
  },
  {
    path: '/scroll-table',
    name: 'scroll-table',
    component: () => import('../views/scroll-table/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
