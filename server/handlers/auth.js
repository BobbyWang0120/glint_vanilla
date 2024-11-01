/**
 * 认证处理器
 */
const { parseBody } = require('../utils/request');
const { sendSuccess, sendError } = require('../utils/response');
const { createUser } = require('../db/users');

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 验证结果
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {boolean} 验证结果
 */
const isValidPassword = (password) => {
    // 密码至少8位，包含数字和字母
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
};

/**
 * 验证用户角色
 * @param {string} role - 用户角色
 * @returns {boolean} 验证结果
 */
const isValidRole = (role) => {
    return ['seeker', 'employer'].includes(role);
};

/**
 * 处理注册请求
 * @param {Object} req - HTTP请求对象
 * @param {Object} res - HTTP响应对象
 */
const handleRegister = async (req, res) => {
    try {
        // 解析请求体
        const userData = await parseBody(req);
        const { email, password, role } = userData;

        // 验证必填字段
        if (!email || !password || !role) {
            return sendError(res, 400, '邮箱、密码和用户角色为必填项');
        }

        // 验证邮箱格式
        if (!isValidEmail(email)) {
            return sendError(res, 400, '邮箱格式不正确');
        }

        // 验证密码强度
        if (!isValidPassword(password)) {
            return sendError(res, 400, '密码必须至少8位，包含数字和字母');
        }

        // 验证用户角色
        if (!isValidRole(role)) {
            return sendError(res, 400, '无效的用户角色');
        }

        // 创建用户
        const user = await createUser({ email, password, role });

        // 返回成功响应
        sendSuccess(res, {
            message: '注册成功',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('注册失败:', error);

        if (error.message === '邮箱已被注册') {
            sendError(res, 409, '该邮箱已被注册');
        } else {
            sendError(res, 500, '注册失败，请稍后重试');
        }
    }
};

module.exports = {
    handleRegister
};
