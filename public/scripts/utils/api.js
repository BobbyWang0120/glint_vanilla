/**
 * API工具函数
 */

/**
 * 基础请求配置
 */
const API_CONFIG = {
    baseURL: '', // 同域名下不需要配置
    headers: {
        'Content-Type': 'application/json'
    }
};

/**
 * 处理API响应
 * @param {Response} response - fetch响应对象
 * @returns {Promise} 解析后的响应数据
 */
const handleResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'API请求失败');
    }
    
    return data;
};

/**
 * GET请求
 * @param {string} url - 请求地址
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求结果
 */
const get = async (url, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    
    try {
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: API_CONFIG.headers
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('GET请求失败:', error);
        throw error;
    }
};

/**
 * POST请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @returns {Promise} 请求结果
 */
const post = async (url, data = {}) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: API_CONFIG.headers,
            body: JSON.stringify(data)
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('POST请求失败:', error);
        throw error;
    }
};

/**
 * PUT请求
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @returns {Promise} 请求结果
 */
const put = async (url, data = {}) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: API_CONFIG.headers,
            body: JSON.stringify(data)
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('PUT请求失败:', error);
        throw error;
    }
};

/**
 * DELETE请求
 * @param {string} url - 请求地址
 * @returns {Promise} 请求结果
 */
const del = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: API_CONFIG.headers
        });
        
        return handleResponse(response);
    } catch (error) {
        console.error('DELETE请求失败:', error);
        throw error;
    }
};

// 导出API工具函数
export const api = {
    get,
    post,
    put,
    delete: del
};
