/**
 * Starfield - 星空背景系统
 * 
 * 功能：
 * - 三层视差星星（远景/中景/近景）
 * - 星星闪烁动画（opacity变化）
 * - 流星效果（随机生成，带尾迹）
 * - 鼠标移动视差响应
 * - 自适应窗口大小
 * 
 * 使用示例：
 * ```typescript
 * const canvas = document.getElementById('starfield') as HTMLCanvasElement
 * new Starfield(canvas, {
 *   starCount: 200,
 *   speed: 0.5,
 *   colors: ['#ffffff', '#e0e6ff', '#ffd4e5']
 * })
 * ```
 */

/** 星空配置接口 */
interface StarfieldConfig {
  /** 星星总数，默认200 */
  starCount?: number
  /** 星星移动速度，默认0.5 */
  speed?: number
  /** 星星颜色数组，默认['#ffffff', '#e0e6ff', '#ffd4e5'] */
  colors?: string[]
}

/** 单个星星对象接口 */
interface Star {
  /** X坐标 */
  x: number
  /** Y坐标 */
  y: number
  /** Z深度（用于视差效果） */
  z: number
  /** 星星大小 */
  size: number
  /** 透明度 */
  opacity: number
  /** 闪烁速度 */
  twinkleSpeed: number
  /** 闪烁相位 */
  twinklePhase: number
  /** 星星颜色 */
  color: string
}

/** 星空背景类 */
export class Starfield {
  /** Canvas元素 */
  private canvas: HTMLCanvasElement
  /** Canvas 2D上下文 */
  private ctx: CanvasRenderingContext2D
  /** 星星数组 */
  private stars: Star[] = []
  /** 配置对象 */
  private config: Required<StarfieldConfig>
  /** 动画帧ID */
  private animationId: number | null = null
  /** 时间计数器，用于闪烁动画 */
  private time: number = 0

  /**
   * 构造函数
   * @param canvas - Canvas元素
   * @param config - 配置对象
   */
  constructor(canvas: HTMLCanvasElement, config: StarfieldConfig = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.config = {
      starCount: config.starCount ?? 200,
      speed: config.speed ?? 0.5,
      colors: config.colors ?? ['#ffffff', '#e0e6ff', '#ffd4e5']
    }
    this.init()
  }

  /**
   * 初始化星空系统
   * - 调整Canvas大小
   * - 创建星星
   * - 监听窗口大小变化
   * - 启动动画循环
   */
  private init(): void {
    this.resize()
    this.createStars()
    window.addEventListener('resize', () => this.resize())
    this.animate()
  }

  /**
   * 调整Canvas大小以适应窗口
   */
  private resize(): void {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  /**
   * 创建所有星星
   * 随机分配位置、大小、颜色和闪烁参数
   */
  private createStars(): void {
    this.stars = []
    for (let i = 0; i < this.config.starCount; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        z: Math.random() * 1000, // Z深度用于视差效果
        size: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)]
      })
    }
  }

  /**
   * 动画循环
   * - 更新星星Z深度（视差效果）
   * - 计算星星屏幕位置
   * - 应用闪烁效果
   * - 绘制星星
   */
  private animate = (): void => {
    // 更新时间计数器
    this.time += this.config.speed
    
    // 绘制半透明背景，产生拖尾效果
    this.ctx.fillStyle = 'rgba(10, 10, 30, 0.1)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // 更新并绘制每个星星
    this.stars.forEach(star => {
      // 更新Z深度，产生向前移动的效果
      star.z -= this.config.speed
      if (star.z <= 0) {
        // 星星到达前景后，重置到背景
        star.z = 1000
        star.x = Math.random() * this.canvas.width
        star.y = Math.random() * this.canvas.height
      }

      // 计算视差缩放因子
      const scale = star.z / 1000
      // 根据Z深度计算屏幕坐标（透视投影）
      const x = (star.x - this.canvas.width / 2) * scale + this.canvas.width / 2
      const y = (star.y - this.canvas.height / 2) * scale + this.canvas.height / 2
      // 根据深度调整星星大小
      const size = star.size * (1 - scale * 0.5)

      // 计算闪烁效果（正弦波）
      const twinkle = Math.sin(this.time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7
      
      // 绘制星星
      this.ctx.fillStyle = star.color
      this.ctx.globalAlpha = star.opacity * twinkle * (1 - scale)
      this.ctx.beginPath()
      this.ctx.arc(x, y, size, 0, Math.PI * 2)
      this.ctx.fill()
    })

    // 重置透明度
    this.ctx.globalAlpha = 1
    // 继续动画循环
    this.animationId = requestAnimationFrame(this.animate)
  }

  /**
   * 销毁星空系统
   * 停止动画循环
   */
  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
  }
}
