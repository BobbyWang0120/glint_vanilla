/**
 * 注册页面脚本
 */
import { api } from '../utils/api.js';

/**
 * 表单验证规则
 */
const validationRules = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入有效的邮箱地址'
    },
    password: {
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        message: '密码必须至少8位，包含数字和字母'
    },
    confirmPassword: {
        validate: (value, formData) => value === formData.password,
        message: '两次输入的密码不一致'
    }
};

/**
 * 显示错误消息
 * @param {HTMLElement} input - 输入元素
 * @param {string} message - 错误信息
 */
const showError = (input, message) => {
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorDiv);
    }
    
    input.classList.add('error');
};

/**
 * 清除错误消息
 * @param {HTMLElement} input - 输入元素
 */
const clearError = (input) => {
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message');
    
    if (errorDiv) {
        errorDiv.remove();
    }
    
    input.classList.remove('error');
};

/**
 * 验证表单字段
 * @param {HTMLFormElement} form - 表单元素
 * @returns {boolean} 验证结果
 */
const validateForm = (form) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    let isValid = true;

    // 清除所有错误
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // 验证必填字段
    ['email', 'password', 'confirmPassword'].forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (!data[field]) {
            showError(input, '此字段为必填项');
            isValid = false;
            return;
        }

        // 应用验证规则
        const rule = validationRules[field];
        if (rule.pattern && !rule.pattern.test(data[field])) {
            showError(input, rule.message);
            isValid = false;
        } else if (rule.validate && !rule.validate(data[field], data)) {
            showError(input, rule.message);
            isValid = false;
        }
    });

    return isValid;
};

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 ('success' | 'error')
 */
const showMessage = (message, type = 'error') => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    const container = document.querySelector('.register-container');
    container.insertBefore(messageDiv, container.firstChild);

    // 3秒后自动移除消息
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
};

/**
 * 处理注册表单提交
 * @param {Event} e - 提交事件
 */
const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    // 表单验证
    if (!validateForm(form)) {
        return;
    }

    // 获取表单数据
    const formData = new FormData(form);
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('userType')
    };

    try {
        // 禁用提交按钮
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = '注册中...';

        // 发送注册请求
        const response = await api.post('/api/register', data);

        // 显示成功消息
        showMessage('注册成功！正在跳转...', 'success');

        // 延迟跳转到首页
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);

    } catch (error) {
        // 显示错误消息
        showMessage(error.message || '注册失败，请稍后重试');
        
        // 重置提交按钮
        submitButton.disabled = false;
        submitButton.textContent = '创建账号';
    }
};

/**
 * 初始化表单事件监听
 */
const initForm = () => {
    const form = document.getElementById('registerForm');

    // 实时验证
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            clearError(input);
        });

        input.addEventListener('blur', () => {
            const rule = validationRules[input.name];
            if (rule) {
                const value = input.value;
                if (rule.pattern && !rule.pattern.test(value)) {
                    showError(input, rule.message);
                } else if (rule.validate) {
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    if (!rule.validate(value, data)) {
                        showError(input, rule.message);
                    }
                }
            }
        });
    });

    // 表单提交
    form.addEventListener('submit', handleSubmit);
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initForm);
