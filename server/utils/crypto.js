/**
 * 密码加密工具
 */
const bcrypt = require('bcrypt');

// 加密轮数
const SALT_ROUNDS = 10;

/**
 * 加密密码
 * @param {string} password - 原始密码
 * @returns {Promise<string>} 加密后的密码
 */
const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.error('密码加密失败:', error);
        throw error;
    }
};

/**
 * 验证密码
 * @param {string} password - 原始密码
 * @param {string} hash - 加密后的密码
 * @returns {Promise<boolean>} 验证结果
 */
const verifyPassword = async (password, hash) => {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        console.error('密码验证失败:', error);
        throw error;
    }
};

module.exports = {
    hashPassword,
    verifyPassword
};
