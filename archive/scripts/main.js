/**
 * Main - 主控制脚本
 * 功能：
 * - 初始化星空背景
 * - 初始化鼠标轨迹效果
 * - 主题切换
 * - 页面加载动画
 */

(function() {
    'use strict';
    
    // ==================== 全局配置 ====================
    const CONFIG = {
        starfield: {
            starCount: 180,
            starLayers: [0.5, 0.3, 0.2],
            starSpeeds: [0.15, 0.4, 0.8],
            starSizeRange: [0.5, 2.5],
            twinkleSpeed: 0.02,
            meteorInterval: [5000, 15000],
            meteorSpeed: 8,
            meteorLength: 150,
            parallaxStrength: 30,
            starColors: ['#ffffff', '#e8e8ff', '#ffe8e8', '#e8f4ff', '#d8c8ff']
        },
        mouseTrail: {
            spawnInterval: 50,
            particleDuration: 1000,
            particleSizeRange: [10, 18]
        }
    };
    
    // ==================== 全局变量 ====================
    let starfield = null;
    let mouseTrail = null;
    let currentTheme = 'dark';
    
    // ==================== 初始化函数 ====================
    
    /**
     * 页面加载完成后初始化
     */
    function init() {
        // 初始化星空背景
        initStarfield();
        
        // 初始化鼠标轨迹
        initMouseTrail();
        
        // 初始化主题切换
        initThemeToggle();
        
        // 初始化页面动画
        initPageAnimations();
        
        console.log('✦ StarryNebula主题已加载');
    }
    
    /**
     * 初始化星空背景
     */
    function initStarfield() {
        const canvas = document.getElementById('starfield');
        if (!canvas) {
            console.warn('找不到Canvas元素');
            return;
        }
        
        // 创建星空实例
        starfield = new Starfield(canvas, CONFIG.starfield);
        
        console.log('✧ 星空背景已初始化');
    }
    
    /**
     * 初始化鼠标轨迹
     */
    function initMouseTrail() {
        // 创建鼠标轨迹实例
        mouseTrail = new MouseTrail(CONFIG.mouseTrail);
        
        console.log('✧ 鼠标轨迹已初始化');
    }
    
    /**
     * 初始化主题切换
     */
    function initThemeToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (!toggleBtn) return;
        
        // 从本地存储读取主题
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            updateThemeIcon(true);
            currentTheme = 'light';
        }
        
        // 绑定切换事件
        toggleBtn.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            currentTheme = isLight ? 'light' : 'dark';
            
            // 更新图标
            updateThemeIcon(isLight);
            
            // 保存到本地存储
            localStorage.setItem('theme', currentTheme);
            
            // 更新星空背景渐变
            updateStarfieldTheme(isLight);
        });
    }
    
    /**
     * 更新主题图标
     * @param {boolean} isLight - 是否为亮色主题
     */
    function updateThemeIcon(isLight) {
        const icon = document.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = isLight ? '☀️' : '🌙';
        }
    }
    
    /**
     * 更新星空背景主题
     * @param {boolean} isLight - 是否为亮色主题
     */
    function updateStarfieldTheme(isLight) {
        if (!starfield) return;
        
        if (isLight) {
            // 亮色主题
            starfield.config.backgroundGradient = [
                { pos: 0, color: '#e8f4ff' },
                { pos: 0.5, color: '#f0f8ff' },
                { pos: 1, color: '#f8fbff' }
            ];
            starfield.config.starColors = ['#4a90e2', '#6ba3f0', '#8fb8f7', '#a8c8ff'];
        } else {
            // 暗色主题
            starfield.config.backgroundGradient = [
                { pos: 0, color: '#0f0c29' },
                { pos: 0.5, color: '#302b63' },
                { pos: 1, color: '#24243e' }
            ];
            starfield.config.starColors = ['#ffffff', '#e8e8ff', '#ffe8e8', '#e8f4ff', '#d8c8ff'];
        }
    }
    
    /**
     * 初始化页面动画
     */
    function initPageAnimations() {
        // 文章卡片渐入动画
        const cards = document.querySelectorAll('.post-item');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + index * 150);
        });
        
        // 侧边栏小组件渐入
        const widgets = document.querySelectorAll('.sidebar-widget');
        widgets.forEach((widget, index) => {
            widget.style.opacity = '0';
            widget.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                widget.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                widget.style.opacity = '1';
                widget.style.transform = 'translateX(0)';
            }, 200 + index * 100);
        });
    }
    
    // ==================== 页面加载完成后执行 ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // ==================== 导出全局对象 ====================
    window.StarryNebula = {
        starfield: () => starfield,
        mouseTrail: () => mouseTrail,
        config: CONFIG,
        toggleTheme: () => {
            const toggleBtn = document.getElementById('themeToggle');
            if (toggleBtn) toggleBtn.click();
        }
    };
})();
