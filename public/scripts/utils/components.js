/**
 * 加载公共组件工具
 */

/**
 * 加载组件
 * @param {string} componentPath - 组件路径
 * @param {string} targetSelector - 目标元素选择器
 */
export async function loadComponent(componentPath, targetSelector) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.querySelector(targetSelector).innerHTML = html;

        // 设置当前页面的导航激活状态
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        console.error('加载组件失败:', error);
    }
}

/**
 * 初始化页面组件
 */
export function initComponents() {
    // 加载页头
    loadComponent('/components/header.html', 'header');
    // 加载页脚
    loadComponent('/components/footer.html', 'footer');
}
