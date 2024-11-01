/**
 * 用户数据库操作
 */
const { getConnection } = require('./connect');
const { hashPassword } = require('../utils/crypto');

/**
 * 创建新用户
 * @param {Object} user - 用户信息
 * @param {string} user.email - 用户邮箱
 * @param {string} user.password - 用户密码
 * @param {string} user.role - 用户角色 ('seeker' 或 'employer')
 * @returns {Promise<Object>} 创建的用户信息（不包含密码）
 */
const createUser = async (user) => {
    const db = await getConnection();
    const { email, password, role } = user;

    try {
        // 加密密码
        const hashedPassword = await hashPassword(password);

        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO users (email, password, role)
                VALUES (?, ?, ?)
            `;

            db.run(sql, [email, hashedPassword, role], function(err) {
                if (err) {
                    if (err.code === 'SQLITE_CONSTRAINT') {
                        reject(new Error('邮箱已被注册'));
                    } else {
                        reject(err);
                    }
                } else {
                    // 返回创建的用户信息（不包含密码）
                    resolve({
                        id: this.lastID,
                        email,
                        role
                    });
                }
            });
        });
    } finally {
        db.close();
    }
};

/**
 * 通过邮箱查找用户
 * @param {string} email - 用户邮箱
 * @returns {Promise<Object>} 用户信息
 */
const findUserByEmail = async (email) => {
    const db = await getConnection();

    try {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ?';
            
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    } finally {
        db.close();
    }
};

/**
 * 通过ID查找用户
 * @param {number} id - 用户ID
 * @returns {Promise<Object>} 用户信息
 */
const findUserById = async (id) => {
    const db = await getConnection();

    try {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';
            
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    } finally {
        db.close();
    }
};

/**
 * 更新用户信息
 * @param {number} id - 用户ID
 * @param {Object} updates - 要更新的字段
 * @returns {Promise<void>}
 */
const updateUser = async (id, updates) => {
    const db = await getConnection();
    const { email, password, role } = updates;

    try {
        let sql = 'UPDATE users SET ';
        const params = [];
        const updates = [];

        if (email) {
            updates.push('email = ?');
            params.push(email);
        }

        if (password) {
            const hashedPassword = await hashPassword(password);
            updates.push('password = ?');
            params.push(hashedPassword);
        }

        if (role) {
            updates.push('role = ?');
            params.push(role);
        }

        if (updates.length === 0) {
            throw new Error('没有提供要更新的字段');
        }

        sql += updates.join(', ');
        sql += ' WHERE id = ?';
        params.push(id);

        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    } finally {
        db.close();
    }
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser
};
