<template>
    <el-dialog :model-value="visible" @update:model-value="emit('update:visible', $event)" :title="item?.title"
        width="90%" :style="{ maxWidth: '600px' }" destroy-on-close>
        <el-descriptions :column="1" border>
            <el-descriptions-item v-for="kv in item?.items" :key="kv.key" :label="kv.key">
                {{ kv.value }}
            </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">备注</el-divider>
        <div class="notes-content">
            {{ item?.notes || '无' }}
        </div>

        <template #footer>
            <el-button @click="emit('update:visible', false)">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
defineProps({
    visible: Boolean,
    item: Object,
});
const emit = defineEmits(['update:visible']);
</script>

<style scoped>
.notes-content {
    background-color: #f9f9f9;
    padding: 10px 15px;
    border-radius: 4px;
    font-size: 14px;
    color: #606266;
    white-space: pre-wrap;
    min-height: 50px;
}
</style>