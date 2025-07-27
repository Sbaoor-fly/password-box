# 密码箱 (Password Box)

一个安全、美观、可自托管的密码管理应用程序。采用现代化的前后端分离架构，让您完全掌控自己的敏感数据。

## ✨ 主要功能

- **安全登录**: 用户名和密码进行验证，后端对配置文件中的密码进行 `bcrypt` 哈希处理，确保验证过程安全。
- **数据加密**: 所有存储在本地 `db.json` 文件中的密码项目均经过 **AES-256-GCM** 算法加密，即使文件泄露，内容也无法被读取。
- **数据管理**: 提供完整的新增、编辑、删除和查看密码项目功能。
- **动态搜索**: 在主页和管理页都能即时搜索项目标题。
- **响应式设计**: 界面完美适配桌面和移动设备。
- **持久化存储**: 所有数据安全地加密后存储在服务器本地，确保服务器重启后数据不丢失。
- **分页管理**: 通过路由区分卡片式主页和表格管理页面，职责清晰。

## 🛠️ 技术栈

- **前端**:
  - **Vue 3**: 核心渐进式 JavaScript 框架。
  - **Vite**: 极速的前端构建工具。
  - **Element Plus**: 提供高质量的 UI 组件库。
  - **Vue Router**: 处理前端页面路由。
- **后端**:
  - **Node.js**: JavaScript 运行环境。
  - **Express**: 简洁高效的 Web 应用程序框架。
  - **JSON Web Tokens (JWT)**: 用于生成和验证登录凭证。
  - **Crypto (Node.js 内置)**: 用于实现 AES-256-GCM 数据加密。
- **数据存储**:
  - **加密的本地 JSON 文件**: 使用 `db.json` 进行安全可靠的数据持久化。

## 🚀 项目设置与运行

### 前置需求

- [Node.js](https://nodejs.org/) (建议版本 v16 或更高)
- `npm` 或 `pnpm` 包管理器

### 后端设置

1.  **克隆项目**:
    ```bash
    git clone https://github.com/sbaoor-fly/password-box.git
    ```

2.  **进入后端目录并安装依赖**:
    ```bash
    cd backend
    npm install
    ```

3.  **创建并配置 `config.json` (重要！)**:
    - 在后端根目录下，创建一个名为 `config.json` 的文件。
    - 将以下内容复制到 `config.json` 中。
    ```json
    {
      "server": {
        "port": 3000
      },
      "admin": {
        "username": "admin",
        "password": "your_strong_password_here"
      },
      "security": {
        "encryptionKey": "your_super_secret_32_byte_key_must_be_exactly_this_long"
      }
    }
    ```
    - **修改配置**:
        - `port`: 设置您希望服务器运行的端口。
        - `username` / `password`: 设置您用于登录的管理员账户和密码。
        - `encryptionKey`: **(极其重要)** 将其替换为您自己的加密密钥。**此密钥必须正好是 32 个字符长**。您可以使用在线密码生成器创建一个32位的随机字符串。

    > **安全警告**:
    > - `encryptionKey` 是解密您所有数据的唯一钥匙，请务必妥善保管，不要泄露！
    > - 强烈建议将 `config.json` 文件添加到 `.gitignore` 中，以避免将您的密码和密钥提交到代码仓库。

### 前端设置

1.  **进入前端目录并安装依赖**:
    ```bash
    cd password-box
    pnpm install
    ```

2.  **编译前端项目**:
    ```bash
    npm run build
    ```
    此命令会在前端目录下生成一个 `dist` 文件夹。

### 整合与运行

1.  **复制前端文件**:
    - 将前端 `dist` 文件夹中的**所有内容**复制到后端项目的 `public` 文件夹下（如果 `public` 文件夹不存在，请手动创建）。

2.  **启动服务器**:
    - 返回到**后端目录** (`backend`)。
    - **(首次运行前)** 如果存在旧的、未加密的 `db.json` 文件，请先将其删除。
    - 执行启动命令：
    ```bash
    npm start
    ```

3.  **访问应用**:
    - 打开浏览器，访问 `http://localhost:3000` (或您在 `config.json` 中设置的端口)。
    - 使用您在 `config.json` 中设置的账号密码进行登录。

## 📝 未来展望

- **多用户支持**: 扩展后端，支持多用户注册和数据隔离。
- **数据库集成**: 提供切换到 MySQL 或 MongoDB 等专业数据库的选项。
- **密钥管理**: 引入环境变量或更专业的密钥管理服务来管理 `encryptionKey`。
- **一键部署**: 增加 Dockerfile，实现容器化部署。

