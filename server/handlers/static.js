/**
 * 静态文件处理器
 */
const fs = require('fs').promises;
const path = require('path');

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

/**
 * 处理静态文件请求
 * @param {Object} req - HTTP请求对象
 * @param {Object} res - HTTP响应对象
 * @param {string} publicDir - 静态文件根目录
 */
const handleStatic = async (req, res, publicDir) => {
    try {
        // 解析请求路径
        let filePath = req.url;
        
        // 如果路径是'/'，默认返回index.html
        if (filePath === '/') {
            filePath = '/pages/index.html';
        }

        // 构建完整的文件路径
        const fullPath = path.join(publicDir, filePath);
        
        // 读取文件
        const data = await fs.readFile(fullPath);
        
        // 获取文件扩展名
        const ext = path.extname(fullPath);
        
        // 设置Content-Type
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        // 发送响应
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        
    } catch (error) {
        // 如果文件不存在或其他错误
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
};

module.exports = handleStatic;
