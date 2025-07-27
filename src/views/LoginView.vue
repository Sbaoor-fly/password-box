<template>
    <!-- 模板部分保持不变 -->
    <div class="login-container">
        <el-card class="login-card">
            <template #header>
                <div class="card-header">
                    <span>密码箱登录</span>
                </div>
            </template>
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @keyup.enter="handleLogin">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="用户名" :prefix-icon="User"
                        size="large"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="密码" :prefix-icon="Lock"
                        show-password size="large"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin" class="login-button" :loading="loading" size="large">
                        登 录
                    </el-button>
                </el-form-item>
            </el-form>
            <div class="login-tip">
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { login as performLogin } from '../services/authService.js';

const router = useRouter();
const loginFormRef = ref(null);
const loading = ref(false);
const loginForm = reactive({ username: '', password: '' });
const loginRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const handleLogin = () => {
    loginFormRef.value.validate(async (valid) => {
        if (valid) {
            loading.value = true;
            try {
                const response = await performLogin(loginForm.username, loginForm.password);

                // [核心修改] 保存从后端获取的 token
                sessionStorage.setItem('accessToken', response.accessToken);
                sessionStorage.setItem('isLoggedIn', 'true'); // 保留登录状态标记给路由守卫使用

                ElMessage.success('登录成功！');
                router.push('/'); // 登录成功，跳转到主页
            } catch (error) {
                ElMessage.error(error.message || '登录失败');
            } finally {
                loading.value = false;
            }
        }
    });
};
</script>

<style scoped>
/* 样式保持不变 */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(to right, #6dd5ed, #2193b0);
}

.login-card {
    width: 400px;
}

.card-header {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}

.login-button {
    width: 100%;
}

.login-tip {
    margin-top: 20px;
    text-align: center;
    color: #909399;
    font-size: 14px;
}

.login-tip p {
    margin: 5px 0;
}

@media (max-width: 450px) {
    .login-card {
        width: 90%;
        border: none;
        box-shadow: none;
    }

    .login-container {
        background: #ffffff;
    }
}
</style>