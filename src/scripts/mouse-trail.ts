/**
 * MouseTrail - 鼠标星光轨迹效果
 * 
 * 功能：
 * - 鼠标移动时生成星光粒子
 * - 粒子向上漂浮并逐渐淡出
 * - 随机颜色和大小
 * - 性能优化（节流处理）
 * 
 * 使用示例：
 * ```typescript
 * const trail = new MouseTrail({
 *   particleCount: 8,
 *   particleSize: 4,
 *   particleColor: '#64b5f6',
 *   duration: 800
 * })
 * trail.init()
 * ```
 */

/** 鼠标轨迹配置接口 */
interface MouseTrailConfig {
  /** 每次鼠标移动生成的粒子数，默认8 */
  particleCount?: number
  /** 粒子大小（像素），默认4 */
  particleSize?: number
  /** 粒子颜色，默认'#64b5f6' */
  particleColor?: string
  /** 粒子动画持续时间（毫秒），默认800 */
  duration?: number
}

/** 单个粒子对象接口 */
interface Particle {
  /** X坐标 */
  x: number
  /** Y坐标 */
  y: number
  /** X方向速度 */
  vx: number
  /** Y方向速度 */
  vy: number
  /** 当前生命值（毫秒） */
  life: number
  /** 最大生命值（毫秒） */
  maxLife: number
  /** 粒子大小 */
  size: number
}

/** 鼠标轨迹类 */
export class MouseTrail {
  /** 粒子数组 */
  private particles: Particle[] = []
  /** 配置对象 */
  private config: Required<MouseTrailConfig>
  /** Canvas元素 */
  private canvas: HTMLCanvasElement | null = null
  /** Canvas上下文 */
  private ctx: CanvasRenderingContext2D | null = null
  /** 动画帧ID */
  private animationId: number | null = null
  /** 上次创建粒子的时间（用于节流） */
  private lastParticleTime: number = 0
  /** 粒子创建间隔（毫秒） */
  private particleInterval: number = 16

  /**
   * 构造函数
   * @param config - 配置对象
   */
  constructor(config: MouseTrailConfig = {}) {
    this.config = {
      particleCount: config.particleCount ?? 8,
      particleSize: config.particleSize ?? 4,
      particleColor: config.particleColor ?? '#64b5f6',
      duration: config.duration ?? 800
    }
  }

  /**
   * 初始化鼠标轨迹系统
   * - 创建Canvas容器
   * - 绑定鼠标移动事件
   * - 启动动画循环
   */
  public init(): void {
    this.createCanvas()
    this.bindEvents()
    this.animate()
  }

  /**
   * 创建Canvas元素用于绘制粒子
   * 设置为fixed定位，覆盖整个视口
   */
  private createCanvas(): void {
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'mouse-trail-canvas'
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9999;
    `
    this.resizeCanvas()
    document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext('2d')

    // 监听窗口大小变化
    window.addEventListener('resize', () => this.resizeCanvas())
  }

  /**
   * 调整Canvas大小以适应窗口
   */
  private resizeCanvas(): void {
    if (!this.canvas) return
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  /**
   * 绑定鼠标移动事件
   * 使用节流防止过于频繁的粒子创建
   */
  private bindEvents(): void {
    document.addEventListener('mousemove', (e) => {
      const now = Date.now()
      // 节流：每16ms最多创建一次粒子
      if (now - this.lastParticleTime > this.particleInterval) {
        this.createParticles(e.clientX, e.clientY)
        this.lastParticleTime = now
      }
    })
  }

  /**
   * 在鼠标位置创建粒子
   * 粒子以圆形分布，向外辐射
   * @param x - 鼠标X坐标
   * @param y - 鼠标Y坐标
   */
  private createParticles(x: number, y: number): void {
    for (let i = 0; i < this.config.particleCount; i++) {
      // 计算粒子的辐射角度
      const angle = (Math.PI * 2 * i) / this.config.particleCount
      // 随机速度
      const velocity = 2 + Math.random() * 2
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: this.config.duration,
        maxLife: this.config.duration,
        size: this.config.particleSize
      })
    }
  }

  /**
   * 动画循环
   * - 清空Canvas
   * - 更新粒子位置和生命值
   * - 应用重力效果
   * - 使用Canvas绘制粒子
   * - 移除已死亡的粒子
   */
  private animate = (): void => {
    if (!this.ctx || !this.canvas) {
      this.animationId = requestAnimationFrame(this.animate)
      return
    }

    // 清空Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 过滤掉已死亡的粒子
    this.particles = this.particles.filter(p => p.life > 0)

    // 更新并绘制每个粒子
    this.particles.forEach(p => {
      // 更新位置
      p.x += p.vx
      p.y += p.vy
      // 应用重力效果
      p.vy += 0.1
      // 减少生命值
      p.life -= 16

      // 计算透明度（生命值比例）
      const opacity = p.life / p.maxLife

      // 使用Canvas绘制粒子
      this.ctx!.fillStyle = this.config.particleColor
      this.ctx!.globalAlpha = opacity
      this.ctx!.beginPath()
      this.ctx!.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2)
      this.ctx!.fill()
    })

    // 重置透明度
    this.ctx.globalAlpha = 1

    // 继续动画循环
    this.animationId = requestAnimationFrame(this.animate)
  }

  /**
   * 销毁鼠标轨迹系统
   * 停止动画循环并移除Canvas
   */
  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.canvas?.remove()
  }
}
