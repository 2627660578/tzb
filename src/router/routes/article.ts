
import type { RouteRecordRaw } from 'vue-router'
const articleRoutes: RouteRecordRaw[] = [
    {
        path: '/article/:id',
        name: 'ShowArticle',
        component: () => import('../../views/ShowArticle.vue'),
        meta: {
            title: '文章管理',
            requiresAuth: true // <-- 添加这个元信息
        }
    }
]

export default articleRoutes