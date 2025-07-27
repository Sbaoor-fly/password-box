// src/services/itemService.js

const API_BASE_URL = '/api'; // 使用相对路径，因为前端和后端部署在同一个域

// 封装一个 fetch 函数，自动添加认证 token
const apiFetch = async (url, options = {}) => {
    const token = sessionStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '发生网络错误' }));
        throw new Error(errorData.message || `HTTP 错误! 状态: ${response.status}`);
    }

    // 对于 204 No Content (删除成功) 的响应，response.json() 会报错
    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// 获取所有密码项目
export const getItems = () => {
    return apiFetch('/items');
};

// 新增一个密码项目
export const createItem = (itemData) => {
    return apiFetch('/items', {
        method: 'POST',
        body: JSON.stringify(itemData),
    });
};

// 更新一个密码项目
export const updateItem = (itemId, itemData) => {
    return apiFetch(`/items/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(itemData),
    });
};

// 删除一个密码项目
export const deleteItem = (itemId) => {
    return apiFetch(`/items/${itemId}`, {
        method: 'DELETE',
    });
};