/**
 * 数据库连接模块
 */
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const DB_PATH = path.join(__dirname, '../../database/glint.sqlite');

/**
 * 获取数据库连接
 * @returns {Promise<sqlite3.Database>} 数据库连接实例
 */
const getConnection = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('数据库连接失败:', err);
                reject(err);
            } else {
                console.log('数据库连接成功');
                resolve(db);
            }
        });
    });
};

/**
 * 初始化数据库表
 * @returns {Promise<void>}
 */
const initDatabase = async () => {
    const db = await getConnection();

    // 创建用户表
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('seeker', 'employer')),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    return new Promise((resolve, reject) => {
        db.run(createUsersTable, (err) => {
            if (err) {
                console.error('创建用户表失败:', err);
                reject(err);
            } else {
                console.log('数据库表初始化成功');
                resolve();
            }
            // 关闭数据库连接
            db.close();
        });
    });
};

module.exports = {
    getConnection,
    initDatabase
};
