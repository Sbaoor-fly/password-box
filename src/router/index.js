import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import ManageView from '../views/ManageView.vue';
import MainLayout from '../layouts/MainLayout.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/',
        component: MainLayout, // 使用包含顶部导航的共享布局
        meta: { requiresAuth: true }, // 这个路由及其子路由需要认证
        children: [
            {
                path: '', // 默认子路由，即访问'/'时显示
                name: 'Home',
                component: HomeView,
            },
            {
                path: 'manage', // 访问'/manage'时显示
                name: 'Manage',
                component: ManageView,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 全局前置守卫，用于登录验证
router.beforeEach((to, from, next) => {
    // 检查路由是否需要认证
    if (to.meta.requiresAuth) {
        // 检查用户是否已登录（在真实应用中，这里会验证token的有效性）
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            next(); // 已登录，放行
        } else {
            // 未登录，重定向到登录页
            next({ name: 'Login' });
        }
    } else {
        next(); // 不需要认证的页面，直接放行
    }
});

export default router;