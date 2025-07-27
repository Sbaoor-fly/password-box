const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto'); // 引入 Node.js 内置的加密模块

// --- 读取配置文件 ---
let config;
try {
    const configPath = path.join(__dirname, 'config.json');
    const configFile = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configFile);
    // 校验加密密钥的长度
    if (!config.security || !config.security.encryptionKey || config.security.encryptionKey.length !== 32) {
        throw new Error('配置错误: "encryptionKey" 必须在 "security" 下提供，并且长度必须为32个字符。');
    }
} catch (error) {
    console.error('错误：', error.message);
    process.exit(1);
}

// --- 初始化和配置 ---
const app = express();
const PORT = process.env.PORT || config.server.port || 3000;
const JWT_SECRET = 'your-super-secret-key-change-it-later';
const DB_FILE_PATH = path.join(__dirname, 'db.json');
const ENCRYPTION_KEY = config.security.encryptionKey; // 从配置中获取加密密钥
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- [核心修改] 加密与解密辅助函数 ---

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH); // 生成一个随机的初始化向量 (IV)
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // 将 iv, authTag 和加密内容合并为一个 buffer，然后转为 hex 字符串
    return Buffer.concat([iv, authTag, encrypted]).toString('hex');
}

function decrypt(encryptedHex) {
    try {
        const encryptedBuffer = Buffer.from(encryptedHex, 'hex');
        const iv = encryptedBuffer.slice(0, IV_LENGTH);
        const authTag = encryptedBuffer.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
        const encrypted = encryptedBuffer.slice(IV_LENGTH + AUTH_TAG_LENGTH);
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        decipher.setAuthTag(authTag);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (error) {
        console.error("解密失败! 请检查您的 encryptionKey 是否正确，或 db.json 文件是否已损坏。", error);
        return null; // 解密失败返回 null
    }
}

// --- [核心修改] 数据存储函数 ---

const readDataFromFile = () => {
    try {
        if (!fs.existsSync(DB_FILE_PATH)) {
            return { passwordItems: [] }; // 如果文件不存在，返回空数据
        }
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        if (!fileContent) {
            return { passwordItems: [] }; // 如果文件是空的，返回空数据
        }
        const encryptedData = JSON.parse(fileContent).encryptedData;
        const decryptedJson = decrypt(encryptedData);
        return decryptedJson ? JSON.parse(decryptedJson) : { passwordItems: [] };
    } catch (error) {
        console.error('读取或解密 db.json 文件失败:', error);
        return { passwordItems: [] };
    }
};

const writeDataToFile = (data) => {
    try {
        const jsonString = JSON.stringify(data);
        const encryptedData = encrypt(jsonString);
        const dataToWrite = JSON.stringify({ encryptedData });
        fs.writeFileSync(DB_FILE_PATH, dataToWrite);
    } catch (error) {
        console.error('加密或写入 db.json 文件失败:', error);
    }
};

// ... 后续代码与之前版本基本一致，只是操作的数据源 db 已变为解密后的数据 ...
let db = readDataFromFile();

const users = [
    {
        id: 1,
        username: config.admin.username,
        passwordHash: bcrypt.hashSync(config.admin.password, 10)
    }
];

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- API 路由 (逻辑不变，但操作的数据会经过加解密) ---
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(400).json({ message: '用户名或密码错误' });
    }
    const accessToken = jwt.sign({ username: user.username, id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken });
});

app.get('/api/items', authenticateToken, (req, res) => {
    const sortedItems = [...db.passwordItems].sort((a, b) => b.id - a.id);
    res.json(sortedItems);
});

app.post('/api/items', authenticateToken, (req, res) => {
    const newItem = { id: Date.now().toString(), ...req.body };
    db.passwordItems.unshift(newItem);
    writeDataToFile(db);
    res.status(201).json(newItem);
});

app.put('/api/items/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = db.passwordItems.findIndex(item => item.id === id);
    if (index === -1) return res.status(404).json({ message: '未找到项目' });
    const updatedItem = { ...db.passwordItems[index], ...req.body };
    db.passwordItems[index] = updatedItem;
    writeDataToFile(db);
    res.json(updatedItem);
});

app.delete('/api/items/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const initialLength = db.passwordItems.length;
    db.passwordItems = db.passwordItems.filter(item => item.id !== id);
    if (db.passwordItems.length === initialLength) return res.status(404).json({ message: '未找到项目' });
    writeDataToFile(db);
    res.status(204).send();
});

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`服务器已启动，正在监听端口 ${PORT}`);
    console.log(`管理员账户: ${config.admin.username}`);
});