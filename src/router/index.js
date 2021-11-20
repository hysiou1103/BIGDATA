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
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes
})

export default router
