<template>
    <el-header class="header">
        <div class="header-content">
            <h1>我的密码箱</h1>
            <div class="actions">
                <router-link to="/manage" v-if="$route.path === '/'">
                    <el-button :icon="Setting">管理项目</el-button>
                </router-link>
                <router-link to="/" v-if="$route.path === '/manage'">
                    <el-button :icon="HomeFilled">返回主页</el-button>
                </router-link>

                <el-input v-model="searchQuery" placeholder="搜索密码标题..." :prefix-icon="Search" clearable
                    class="search-input" />
                <el-button type="primary" :icon="Plus" @click="openAddDialog">
                    新增项目
                </el-button>

                <el-button type="danger" :icon="SwitchButton" @click="handleLogout">
                    退出登录
                </el-button>
            </div>
        </div>
    </el-header>
</template>

<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router'; // [新增] 导入 useRouter 用于路由跳转
import { Search, Plus, Setting, HomeFilled, SwitchButton } from '@element-plus/icons-vue'; // [新增] 导入 SwitchButton 图标
import { logout } from '../services/authService'; // [新增] 导入 logout 方法

// 从顶层 App.vue 注入状态和方法
const searchQuery = inject('searchQuery');
const openAddDialog = inject('openAddDialog');

// [新增] 获取 router 实例
const router = useRouter();

/**
 * [新增] 处理退出登录的函数
 */
const handleLogout = () => {
    // 调用认证服务中的 logout 方法，清除本地 token
    logout();
    // 跳转回登录页面
    router.push('/login');
};
</script>

<style scoped>
/* 样式保持不变 */
.header {
    padding: 0;
    background-color: #ffffff;
    border-bottom: 1px solid var(--el-border-color-light);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 64px;
    z-index: 10;
    flex-shrink: 0;
}

.header-content {
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

h1 {
    font-size: 20px;
    color: #303133;
    margin: 0;
    white-space: nowrap;
}

.actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.search-input {
    width: 220px;
}

@media (max-width: 768px) {
    .header {
        height: auto;
    }

    .header-content {
        flex-direction: column;
        align-items: stretch;
        padding: 12px;
        gap: 12px;
    }

    .actions {
        flex-direction: column;
        align-items: stretch;
        width: 100%;
        gap: 10px;
    }

    .search-input {
        width: 100%;
    }

    .actions .el-button {
        width: 100%;
        margin-left: 0 !important;
    }

    .actions a {
        width: 100%;
    }
}
</style>