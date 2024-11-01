/**
 * 请求处理工具函数
 */

/**
 * 解析URL查询参数
 * @param {string} url - 请求URL
 * @returns {Object} 解析后的查询参数对象
 */
const parseQueryParams = (url) => {
    const queryString = url.split('?')[1];
    if (!queryString) return {};

    return Object.fromEntries(
        queryString.split('&').map(param => {
            const [key, value] = param.split('=');
            return [decodeURIComponent(key), decodeURIComponent(value)];
        })
    );
};

/**
 * 解析POST请求体
 * @param {Object} req - HTTP请求对象
 * @returns {Promise<Object>} 解析后的请求体数据
 */
const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const data = body ? JSON.parse(body) : {};
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
};

module.exports = {
    parseQueryParams,
    parseBody
};
