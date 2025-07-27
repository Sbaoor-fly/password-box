// src/services/authService.js

/**
 * 调用后端 API 进行登录验证
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise<object>}
 */
export const login = async (username, password) => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '登录失败');
    }

    return response.json(); // 成功时返回 { accessToken: '...' }
};