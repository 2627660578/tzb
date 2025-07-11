
import type { RouteRecordRaw } from 'vue-router'
const loginRoutes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../../views/login.vue'),
        meta: {
            title: '登录/注册'
        }
    }
]

export default loginRoutes