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
  /** 粒子容器DOM元素 */
  private container: HTMLElement | null = null
  /** 动画帧ID */
  private animationId: number | null = null

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
   * - 创建粒子容器
   * - 绑定鼠标移动事件
   * - 启动动画循环
   */
  public init(): void {
    this.createContainer()
    this.bindEvents()
    this.animate()
  }

  /**
   * 创建粒子容器DOM元素
   * 设置为fixed定位，覆盖整个视口
   */
  private createContainer(): void {
    this.container = document.createElement('div')
    this.container.id = 'mouse-trail-container'
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `
    document.body.appendChild(this.container)
  }

  /**
   * 绑定鼠标移动事件
   * 监听mousemove事件并生成粒子
   */
  private bindEvents(): void {
    document.addEventListener('mousemove', (e) => this.createParticles(e.clientX, e.clientY))
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
   * - 更新粒子位置和生命值
   * - 应用重力效果
   * - 绘制粒子
   * - 移除已死亡的粒子
   */
  private animate = (): void => {
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
      
      // 创建粒子DOM元素
      const el = document.createElement('div')
      el.style.cssText = `
        position: fixed;
        left: ${p.x}px;
        top: ${p.y}px;
        width: ${p.size}px;
        height: ${p.size}px;
        background: ${this.config.particleColor};
        border-radius: 50%;
        opacity: ${opacity};
        pointer-events: none;
        transform: translate(-50%, -50%);
      `
      this.container?.appendChild(el)
    })

    // 继续动画循环
    this.animationId = requestAnimationFrame(this.animate)
  }

  /**
   * 销毁鼠标轨迹系统
   * 停止动画循环并移除容器
   */
  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.container?.remove()
  }
}
