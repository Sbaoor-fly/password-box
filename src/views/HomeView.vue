<template>
    <PasswordList :items="filteredData" @select-item="showDetailsDialog" class="main-content-area" />
</template>

<script setup>
import { inject } from 'vue';
import PasswordList from '../components/PasswordList.vue';

// 从顶层 App.vue 注入状态和方法
const filteredData = inject('filteredData');
const showDetailsDialog = inject('showDetailsDialog');
</script>

<style scoped>
.main-content-area {
    flex-grow: 1;
    /* 占据剩余空间 */
    overflow-y: auto;
    /* 内容超出时内部滚动 */
}
</style>