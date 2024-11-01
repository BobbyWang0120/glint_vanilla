/**
 * 主服务器文件
 */
const http = require('http');
const path = require('path');
const handleStatic = require('./handlers/static');
const { sendError } = require('./utils/response');

// 静态文件目录
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// 创建HTTP服务器
const server = http.createServer(async (req, res) => {
    try {
        // 处理静态文件请求
        await handleStatic(req, res, PUBLIC_DIR);
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
