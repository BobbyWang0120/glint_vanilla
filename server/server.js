/**
 * 主服务器文件
 */
const http = require('http');
const path = require('path');
const handleStatic = require('./handlers/static');
const { handleRegister } = require('./handlers/auth');
const { sendError } = require('./utils/response');
const { initDatabase } = require('./db/connect');

// 静态文件目录
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// 初始化数据库
(async () => {
    try {
        await initDatabase();
        console.log('数据库初始化成功');
    } catch (error) {
        console.error('数据库初始化失败:', error);
        process.exit(1);
    }
})();

/**
 * 路由处理
 * @param {Object} req - HTTP请求对象
 * @param {Object} res - HTTP响应对象
 */
const handleRoutes = async (req, res) => {
    const { method, url } = req;

    // API路由
    if (url === '/api/register' && method === 'POST') {
        return handleRegister(req, res);
    }

    // 静态文件路由
    if (method === 'GET') {
        return handleStatic(req, res, PUBLIC_DIR);
    }

    // 404处理
    sendError(res, 404, 'Not Found');
};

// 创建HTTP服务器
const server = http.createServer(async (req, res) => {
    try {
        await handleRoutes(req, res);
    } catch (error) {
        console.error('Server Error:', error);
        sendError(res, 500, 'Internal Server Error');
    }
});

// 服务器端口
const PORT = process.env.PORT || 3000;

// 启动服务器
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
