<template>
  <!-- 模板部分保持不变 -->
  <router-view />

  <DetailsDialog v-model:visible="detailsDialogVisible" :item="selectedItem" />

  <AddEditDialog v-model:visible="addDialogVisible" :item-to-edit="itemToEdit" @save-item="handleSaveItem" />
</template>

<script setup>
import { ref, onMounted, computed, provide, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
// [核心修改] 引入真实的 API 服务
import { getItems, createItem, updateItem, deleteItem as apiDeleteItem } from './services/itemService.js';
import DetailsDialog from './components/DetailsDialog.vue';
import AddEditDialog from './components/AddEditDialog.vue';

const route = useRoute();

// --- 状态管理 ---
const allData = ref([]);
const searchQuery = ref('');
const selectedItem = ref(null);
const itemToEdit = ref(null);
const detailsDialogVisible = ref(false);
const addDialogVisible = ref(false);

// --- [核心修改] 数据操作 ---
// 封装一个获取数据的函数
const fetchData = async () => {
  try {
    // 只有在登录后才获取数据
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      const items = await getItems();
      allData.value = items;
    }
  } catch (error) {
    ElMessage.error(error.message || '获取数据失败');
  }
};

// 监听路由变化，当用户从登录页跳转过来时，获取数据
watch(() => route.name, (newName) => {
  if (newName === 'Home') {
    fetchData();
  }
}, { immediate: true }); // immediate: true 确保组件加载时立即执行一次

const filteredData = computed(() => {
  if (!searchQuery.value) return allData.value;
  return allData.value.filter(item =>
    item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// [核心修改] 保存（新增或更新）项目
const handleSaveItem = async (itemData) => {
  try {
    if (itemData.id) { // 编辑模式
      await updateItem(itemData.id, itemData);
      ElMessage.success('更新成功！');
    } else { // 新增模式
      await createItem(itemData);
      ElMessage.success('新增成功！');
    }
    fetchData(); // 操作成功后，重新获取最新数据列表
  } catch (error) {
    ElMessage.error(error.message || '操作失败');
  }
};

// [核心修改] 删除项目
const handleDeleteItem = async (itemId) => {
  try {
    await apiDeleteItem(itemId);
    ElMessage.success('删除成功！');
    fetchData(); // 操作成功后，重新获取最新数据列表
  } catch (error) {
    ElMessage.error(error.message || '删除失败');
  }
};

// --- 对话框控制 ---
const openAddDialog = () => {
  itemToEdit.value = null;
  addDialogVisible.value = true;
};

const openEditDialog = (item) => {
  itemToEdit.value = item;
  addDialogVisible.value = true;
};

const showDetailsDialog = (item) => {
  selectedItem.value = item;
  detailsDialogVisible.value = true;
};

// --- 使用 provide 将状态和方法传递给所有子孙组件 ---
provide('searchQuery', searchQuery);
provide('filteredData', filteredData);
provide('openAddDialog', openAddDialog);
provide('showDetailsDialog', showDetailsDialog);
provide('openEditDialog', openEditDialog);
provide('deleteItem', handleDeleteItem); // [核心修改] 提供新的删除函数
</script>