/**
 * Starfield - 星空背景系统
 * 功能：
 * - 三层视差星星（远景/中景/近景）
 * - 星星闪烁动画（opacity变化）
 * - 流星效果（随机生成，带尾迹）
 * - 鼠标移动视差响应
 * - 自适应窗口大小
 */

class Starfield {
    /**
     * 构造函数
     * @param {HTMLCanvasElement} canvas - Canvas元素
     * @param {Object} config - 配置参数
     */
    constructor(canvas, config = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // 默认配置
        this.config = {
            // 星星总数
            starCount: config.starCount || 180,
            // 三层星星的分配比例 [远景, 中景, 近景]
            starLayers: config.starLayers || [0.5, 0.3, 0.2],
            // 三层星星的速度 [远景, 中景, 近景]
            starSpeeds: config.starSpeeds || [0.15, 0.4, 0.8],
            // 星星大小范围 [最小, 最大]
            starSizeRange: config.starSizeRange || [0.5, 2.5],
            // 闪烁速度
            twinkleSpeed: config.twinkleSpeed || 0.02,
            // 流星配置
            meteorInterval: config.meteorInterval || [5000, 15000], // 流星间隔时间范围（毫秒）
            meteorSpeed: config.meteorSpeed || 8,
            meteorLength: config.meteorLength || 150,
            meteorWidth: config.meteorWidth || 2,
            // 视差强度（鼠标移动时近景星星的偏移程度）
            parallaxStrength: config.parallaxStrength || 30,
            // 颜色配置
            starColors: config.starColors || ['#ffffff', '#e8e8ff', '#ffe8e8', '#e8f4ff'],
            // 背景渐变
            backgroundGradient: config.backgroundGradient || [
                { pos: 0, color: '#0f0c29' },
                { pos: 0.5, color: '#302b63' },
                { pos: 1, color: '#24243e' }
            ]
        };
        
        // 内部状态
        this.stars = [];
        this.meteors = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.lastMeteorTime = 0;
        this.nextMeteorDelay = this.randomMeteorDelay();
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化星空系统
     */
    init() {
        this.resize();
        this.createStars();
        this.bindEvents();
        this.animate();
    }
    
    /**
     * 调整Canvas大小
     */
    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.ctx.scale(dpr, dpr);
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    
    /**
     * 创建所有星星
     */
    createStars() {
        this.stars = [];
        
        // 计算每层星星数量
        const layerCounts = this.config.starLayers.map(ratio => 
            Math.floor(this.config.starCount * ratio)
        );
        
        // 为每层创建星星
        layerCounts.forEach((count, layerIndex) => {
            for (let i = 0; i < count; i++) {
                this.stars.push(this.createStar(layerIndex));
            }
        });
    }
    
    /**
     * 创建单个星星
     * @param {number} layer - 层级（0:远景, 1:中景, 2:近景）
     * @returns {Object} 星星对象
     */
    createStar(layer) {
        const size = this.randomRange(...this.config.starSizeRange);
        // 远景星星更小更暗
        const layerSizeFactor = [0.5, 0.75, 1][layer];
        
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: size * layerSizeFactor,
            speed: this.config.starSpeeds[layer],
            layer: layer,
            color: this.randomChoice(this.config.starColors),
            // 闪烁相关
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: this.config.twinkleSpeed * (0.5 + Math.random()),
            baseOpacity: 0.3 + Math.random() * 0.4,
            currentOpacity: 0.5
        };
    }
    
    /**
     * 创建流星
     * @returns {Object} 流星对象
     */
    createMeteor() {
        // 从右上角随机位置出现
        const startX = this.width * (0.5 + Math.random() * 0.5);
        const startY = Math.random() * this.height * 0.3;
        
        return {
            x: startX,
            y: startY,
            speed: this.config.meteorSpeed,
            length: this.config.meteorLength,
            width: this.config.meteorWidth,
            opacity: 1,
            // 流星角度（从右上到左下）
            angle: Math.PI * 1.25,
            // 尾迹渐变
            trail: []
        };
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 窗口大小改变
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
        });
        
        // 鼠标移动
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    /**
     * 更新星星状态
     */
    updateStars() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        this.stars.forEach(star => {
            // 基础移动（缓慢向左上移动）
            star.x -= star.speed * 0.3;
            star.y -= star.speed * 0.1;
            
            // 闪烁动画
            star.twinklePhase += star.twinkleSpeed;
            const twinkle = Math.sin(star.twinklePhase);
            star.currentOpacity = star.baseOpacity + twinkle * 0.3;
            
            // 近景星星的鼠标视差效果
            if (star.layer === 2) {
                const offsetX = (this.mouse.x - centerX) / centerX * this.config.parallaxStrength;
                const offsetY = (this.mouse.y - centerY) / centerY * this.config.parallaxStrength;
                star.parallaxX = offsetX;
                star.parallaxY = offsetY;
            }
            
            // 边界检测，循环出现
            if (star.x < -10) star.x = this.width + 10;
            if (star.y < -10) star.y = this.height + 10;
        });
    }
    
    /**
     * 更新流星状态
     */
    updateMeteors() {
        const now = Date.now();
        
        // 创建新流星
        if (now - this.lastMeteorTime > this.nextMeteorDelay) {
            this.meteors.push(this.createMeteor());
            this.lastMeteorTime = now;
            this.nextMeteorDelay = this.randomMeteorDelay();
        }
        
        // 更新现有流星
        this.meteors.forEach((meteor, index) => {
            meteor.x += Math.cos(meteor.angle) * meteor.speed;
            meteor.y += Math.sin(meteor.angle) * meteor.speed;
            
            // 渐渐消失
            meteor.opacity -= 0.01;
            
            // 移除超出边界或消失的流星
            if (meteor.x < -meteor.length || 
                meteor.y > this.height + meteor.length || 
                meteor.opacity <= 0) {
                this.meteors.splice(index, 1);
            }
        });
    }
    
    /**
     * 绘制背景渐变
     */
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        this.config.backgroundGradient.forEach(stop => {
            gradient.addColorStop(stop.pos, stop.color);
        });
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    /**
     * 绘制所有星星
     */
    drawStars() {
        this.stars.forEach(star => {
            let x = star.x;
            let y = star.y;
            
            // 应用视差偏移（仅近景星星）
            if (star.parallaxX !== undefined) {
                x += star.parallaxX;
                y += star.parallaxY;
            }
            
            // 绘制星星光晕
            const gradient = this.ctx.createRadialGradient(
                x, y, 0,
                x, y, star.size * 2
            );
            gradient.addColorStop(0, this.hexToRgba(star.color, star.currentOpacity));
            gradient.addColorStop(0.5, this.hexToRgba(star.color, star.currentOpacity * 0.3));
            gradient.addColorStop(1, this.hexToRgba(star.color, 0));
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, star.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // 绘制星星核心
            this.ctx.fillStyle = this.hexToRgba(star.color, star.currentOpacity);
            this.ctx.beginPath();
            this.ctx.arc(x, y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    /**
     * 绘制流星
     */
    drawMeteors() {
        this.meteors.forEach(meteor => {
            // 计算流星尾巴的起点
            const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
            const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;
            
            // 创建渐变尾迹
            const gradient = this.ctx.createLinearGradient(
                meteor.x, meteor.y,
                tailX, tailY
            );
            gradient.addColorStop(0, this.hexToRgba('#ffffff', meteor.opacity));
            gradient.addColorStop(0.3, this.hexToRgba('#e8f4ff', meteor.opacity * 0.6));
            gradient.addColorStop(1, this.hexToRgba('#ffffff', 0));
            
            // 绘制流星
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = meteor.width;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(meteor.x, meteor.y);
            this.ctx.lineTo(tailX, tailY);
            this.ctx.stroke();
            
            // 流星头部光晕
            const headGradient = this.ctx.createRadialGradient(
                meteor.x, meteor.y, 0,
                meteor.x, meteor.y, meteor.width * 4
            );
            headGradient.addColorStop(0, this.hexToRgba('#ffffff', meteor.opacity));
            headGradient.addColorStop(1, this.hexToRgba('#ffffff', 0));
            
            this.ctx.fillStyle = headGradient;
            this.ctx.beginPath();
            this.ctx.arc(meteor.x, meteor.y, meteor.width * 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    /**
     * 动画循环
     */
    animate() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制各层
        this.drawBackground();
        this.updateStars();
        this.drawStars();
        this.updateMeteors();
        this.drawMeteors();
        
        // 继续动画
        this.animationId = requestAnimationFrame(() => this.animate());
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
     * 工具方法：随机流星延迟
     */
    randomMeteorDelay() {
        return this.randomRange(...this.config.meteorInterval);
    }
    
    /**
     * 工具方法：HEX转RGBA
     */
    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    /**
     * 销毁星空系统
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// 导出到全局，供博客园使用
window.Starfield = Starfield;
