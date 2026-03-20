/**
 * MouseTrail - 鼠标星光轨迹效果
 * 功能：
 * - 鼠标移动时生成星光粒子
 * - 粒子向上漂浮并逐渐淡出
 * - 随机颜色和大小
 * - 性能优化（节流处理）
 */

class MouseTrail {
    /**
     * 构造函数
     * @param {Object} config - 配置参数
     */
    constructor(config = {}) {
        // 默认配置
        this.config = {
            // 粒子符号
            particleSymbols: config.particleSymbols || ['✦', '✧', '♦', '◆', '✶', '✷'],
            // 粒子颜色
            particleColors: config.particleColors || ['#a8d8ff', '#c8e8ff', '#e8f0ff', '#d8c8ff', '#ffd8f0'],
            // 生成间隔（毫秒）
            spawnInterval: config.spawnInterval || 50,
            // 粒子动画持续时间（毫秒）
            particleDuration: config.particleDuration || 1000,
            // 粒子大小范围（像素）
            particleSizeRange: config.particleSizeRange || [10, 18],
            // 向上漂浮速度（像素/毫秒）
            floatSpeed: config.floatSpeed || 0.05,
            // 随机水平漂移
            randomDrift: config.randomDrift || 10,
            // 容器ID
            containerId: config.containerId || 'mouse-trail-container'
        };
        
        // 内部状态
        this.lastSpawnTime = 0;
        this.particles = [];
        this.container = null;
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化
     */
    init() {
        // 创建容器
        this.createContainer();
        
        // 绑定事件
        this.bindEvents();
    }
    
    /**
     * 创建粒子容器
     */
    createContainer() {
        // 检查是否已存在
        let container = document.getElementById(this.config.containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = this.config.containerId;
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
                overflow: hidden;
            `;
            document.body.appendChild(container);
        }
        
        this.container = container;
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 鼠标移动事件
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });
    }
    
    /**
     * 处理鼠标移动
     * @param {MouseEvent} e - 鼠标事件
     */
    handleMouseMove(e) {
        const now = Date.now();
        
        // 节流：只在间隔时间内生成一个粒子
        if (now - this.lastSpawnTime < this.config.spawnInterval) {
            return;
        }
        
        this.lastSpawnTime = now;
        this.createParticle(e.clientX, e.clientY);
    }
    
    /**
     * 创建粒子
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     */
    createParticle(x, y) {
        const particle = document.createElement('div');
        
        // 随机属性
        const symbol = this.randomChoice(this.config.particleSymbols);
        const color = this.randomChoice(this.config.particleColors);
        const size = this.randomRange(...this.config.particleSizeRange);
        const drift = (Math.random() - 0.5) * this.config.randomDrift;
        
        // 设置样式
        particle.className = 'mouse-trail-particle';
        particle.textContent = symbol;
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            font-size: ${size}px;
            color: ${color};
            pointer-events: none;
            text-shadow: 0 0 ${size / 2}px ${color}, 0 0 ${size}px ${color};
            transform: translate(-50%, -50%);
            opacity: 1;
            transition: all ${this.config.particleDuration}ms ease-out;
        `;
        
        // 添加到容器
        this.container.appendChild(particle);
        
        // 触发动画（延迟一帧以确保transition生效）
        requestAnimationFrame(() => {
            const floatDistance = this.config.floatSpeed * this.config.particleDuration;
            particle.style.transform = `translate(calc(-50% + ${drift}px), calc(-50% - ${floatDistance}px))`;
            particle.style.opacity = '0';
        });
        
        // 动画结束后移除
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, this.config.particleDuration);
    }
    
    /**
     * 工具方法：随机范围
     */
    randomRange(min, max) {
        return min + Math.random() * (max - min);
    }
    
    /**
     * 工具方法：随机选择
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    /**
     * 销毁
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// 导出到全局，供博客园使用
window.MouseTrail = MouseTrail;
