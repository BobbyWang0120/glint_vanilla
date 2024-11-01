/**
 * 响应工具函数
 */

/**
 * 发送JSON响应
 * @param {Object} res - HTTP响应对象
 * @param {number} statusCode - HTTP状态码
 * @param {Object} data - 响应数据
 */
const sendJson = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
};

/**
 * 发送成功响应
 * @param {Object} res - HTTP响应对象
 * @param {Object} data - 响应数据
 */
const sendSuccess = (res, data) => {
    sendJson(res, 200, {
        success: true,
        data
    });
};

/**
 * 发送错误响应
 * @param {Object} res - HTTP响应对象
 * @param {number} statusCode - HTTP状态码
 * @param {string} message - 错误信息
 */
const sendError = (res, statusCode, message) => {
    sendJson(res, statusCode, {
        success: false,
        error: message
    });
};

module.exports = {
    sendJson,
    sendSuccess,
    sendError
};
