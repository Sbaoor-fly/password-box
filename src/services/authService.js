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

/**
 * [新增] 客户端退出登录
 * 清除本地存储的用户凭证 (token)
 */
export const logout = () => {
    // 从 localStorage 移除 access token
    localStorage.removeItem('accessToken');
    // 如果您还存储了其他用户信息，也应在此一并清除
};