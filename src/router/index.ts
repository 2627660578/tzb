import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
// 导入路由模块
import { useMainStore } from '../stores/message'
import articleRoutes from './routes/article'
import loginRoutes from './routes/login'

// 基础路由
const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home', // 给根路径一个名字
    component: () => import('../views/Home.vue') // 指定一个组件来渲染
  },
  {
    path: '/article', // 添加一个对 /article 的重定向，防止用户手动输入
    redirect: '/'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

// 合并所有路由
const routes: RouteRecordRaw[] = [
  ...baseRoutes,
  ...loginRoutes,
  ...articleRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const store = useMainStore();
  const isLoggedIn = store.isLoggedin;

  // 如果用户已登录但想访问登录页，则将他们重定向到首页
  if (to.name === 'login' && isLoggedIn) {
    next({ name: 'Home' });
    return;
  }

  // 检查目标路由是否需要认证
  if (to.meta.requiresAuth && !isLoggedIn) {
    // 如果用户未登录，则重定向到登录页面
    next({ name: 'login' });
  } else {
    // 否则，允许访问
    next();
  }
});



export default router