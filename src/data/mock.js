// src/data/mock.js

// 模拟一个异步获取数据的函数，模仿真实 API 请求
export const fetchPasswordData = () => {
    return new Promise((resolve) => {
        // 模拟网络延迟
        setTimeout(() => {
            resolve([
                {
                    id: '1',
                    title: '常用网站',
                    icon: 'Link',
                    notes: '一些日常访问的网站，定期检查密码安全。', // <-- 新增备注字段
                    items: [
                        { key: 'GitHub 账号', value: 'my_github_username' },
                        { key: 'Google 邮箱', value: 'example@gmail.com' },
                    ],
                },
                {
                    id: '2',
                    title: '服务器凭证',
                    icon: 'Platform',
                    notes: '生产环境服务器，请勿随意泄露。SSH密钥存放在保险箱。', // <-- 新增备注字段
                    items: [
                        { key: '阿里云 ECS (北京)', value: 'root / p@ssw0rd123' },
                        { key: '腾讯云 Lighthouse (上海)', value: 'ubuntu / my_secret_key' },
                    ],
                },
                {
                    id: '3',
                    title: 'Wi-Fi 密码',
                    // icon: 'Wifi', // <-- 旧的、错误的名称
                    icon: 'Connection', // <-- 新的、正确的名称
                    notes: '公共区域的Wi-Fi，注意信息安全。',
                    items: [
                        { key: '家里 Wi-Fi', value: 'HomeSweetHome-5G' },
                        { key: '公司 Wi-Fi', value: 'Company-Guest / guest123' },
                    ],
                },
                {
                    id: '4',
                    title: '数据库连接',
                    icon: 'Coin',
                    items: [
                        { key: '本地 MySQL', value: 'root / 123456' },
                        { key: '测试环境 PostgreSQL', value: 'test_user / test_pass' },
                    ],
                },
            ]);
        }, 500); // 500ms 延迟
    });
};