<template>
    <el-header class="header">
        <div class="header-content">
            <h1>我的密码箱</h1>
            <div class="actions">
                <!-- 根据当前路由显示不同按钮 -->
                <router-link to="/manage" v-if="$route.path === '/'">
                    <el-button :icon="Setting">管理项目</el-button>
                </router-link>
                <router-link to="/" v-if="$route.path === '/manage'">
                    <el-button :icon="HomeFilled">返回主页</el-button>
                </router-link>

                <!-- [核心修复] 直接使用 v-model 绑定注入的 searchQuery -->
                <el-input v-model="searchQuery" placeholder="搜索密码标题..." :prefix-icon="Search" clearable
                    class="search-input" />
                <el-button type="primary" :icon="Plus" @click="openAddDialog">
                    新增项目
                </el-button>
            </div>
        </div>
    </el-header>
</template>

<script setup>
import { inject } from 'vue';
import { Search, Plus, Setting, HomeFilled } from '@element-plus/icons-vue';

// 从顶层 App.vue 注入状态和方法
// searchQuery 本身就是一个 ref，是响应式的
const searchQuery = inject('searchQuery');
const openAddDialog = inject('openAddDialog');

// [核心修复] 不再需要 emit 事件，因为 v-model 会直接修改被注入的 ref
// const emit = defineEmits(['update:searchQuery']);
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