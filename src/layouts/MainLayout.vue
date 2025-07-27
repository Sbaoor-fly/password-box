<template>
    <div class="app-layout">
        <AppHeader />
        <!-- 路由的子页面（HomeView 或 ManageView）将会被渲染到这里 -->
        <router-view />
    </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';
</script>

<style scoped>
.app-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    background-color: #f0f2f5;
}
</style>