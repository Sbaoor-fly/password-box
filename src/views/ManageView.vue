<template>
    <div class="manage-container">
        <el-table :data="filteredData" stripe style="width: 100%" height="100%">
            <el-table-column prop="title" label="标题" width="250" />
            <el-table-column prop="notes" label="备注" show-overflow-tooltip />
            <el-table-column label="操作" width="180" fixed="right">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">
                        编辑
                    </el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup>
import { inject } from 'vue';
import { ElMessageBox } from 'element-plus';

// 从顶层 App.vue 注入状态和方法
const filteredData = inject('filteredData');
const openEditDialog = inject('openEditDialog');
const deleteItem = inject('deleteItem');

const handleEdit = (item) => {
    openEditDialog(item);
};

const handleDelete = (item) => {
    ElMessageBox.confirm(
        `确定要删除项目 "${item.title}" 吗？此操作无法复原。`,
        '警告',
        {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        deleteItem(item.id);
    }).catch(() => {
        // 用户取消操作，无需处理
    });
};
</script>

<style scoped>
.manage-container {
    flex-grow: 1;
    padding: 20px;
    overflow: hidden;
    display: flex;
}
</style>