<template>
    <el-main class="main-content">
        <el-empty v-if="items.length === 0" description="没有找到匹配的条目" />
        <div v-else class="card-list">
            <el-card v-for="item in items" :key="item.id" shadow="hover" class="password-card"
                @click="emit('select-item', item)">
                <div class="card-content">
                    <el-icon :size="24" class="card-icon">
                        <component :is="item.icon" />
                    </el-icon>
                    <span class="card-title">{{ item.title }}</span>
                    <el-icon class="card-arrow">
                        <ArrowRight />
                    </el-icon>
                </div>
            </el-card>
        </div>
    </el-main>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue';
defineProps({
    items: { type: Array, required: true },
});
const emit = defineEmits(['select-item']);
</script>

<style scoped>
.main-content {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 24px;
}

.card-list {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.password-card {
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.password-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--el-box-shadow-light);
}

.card-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.card-icon {
    color: #409eff;
}

.card-title {
    flex-grow: 1;
    font-size: 16px;
    font-weight: 500;
    color: #606266;
}

.card-arrow {
    color: #909399;
}

@media (max-width: 768px) {
    .main-content {
        padding: 16px;
    }

    .card-list {
        gap: 16px;
    }
}
</style>