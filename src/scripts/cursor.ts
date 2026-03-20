/**
 * Cursor - 自定义光标效果
 * 
 * 功能：
 * - 双层光标设计（主光标 + 跟随光标）
 * - 平滑跟随动画
 * - 点击反馈效果
 * - 触摸设备自动隐藏
 * 
 * 使用示例：
 * ```typescript
 * const cursor = new Cursor({
 *   size: 12,
 *   sizeF: 4,
 *   color: '#64b5f6',
 *   colorF: '#ffffff'
 * })
 * cursor.init()
 * ```
 */

import gsap from 'gsap'

/** 光标配置接口 */
interface CursorConfig {
  /** 主光标大小（像素），默认12 */
  size?: number
  /** 跟随光标大小（像素），默认4 */
  sizeF?: number
  /** 主光标颜色，默认'#64b5f6' */
  color?: string
  /** 跟随光标颜色，默认'#ffffff' */
  colorF?: string
}

/** 光标类 */
export class Cursor {
  /** 主光标DOM元素 */
  private cursor: HTMLElement
  /** 跟随光标DOM元素 */
  private cursorF: HTMLElement
  /** 跟随光标X坐标 */
  private cursorX: number = 0
  /** 跟随光标Y坐标 */
  private cursorY: number = 0
  /** 鼠标X坐标 */
  private pageX: number = 0
  /** 鼠标Y坐标 */
  private pageY: number = 0
  /** 配置对象 */
  private config: Required<CursorConfig>
  /** 动画帧ID */
  private animationId: number | null = null

  /**
   * 构造函数
   * @param config - 配置对象
   */
  constructor(config: CursorConfig = {}) {
    this.config = {
      size: config.size ?? 12,
      sizeF: config.sizeF ?? 4,
      color: config.color ?? '#64b5f6',
      colorF: config.colorF ?? '#ffffff'
    }

    this.cursor = document.createElement('div')
    this.cursorF = document.createElement('div')
    this.setupCursor()
  }

  /**
   * 设置光标样式
   */
  private setupCursor(): void {
    this.cursor.className = 'cursor'
    this.cursorF.className = 'cursor-f'

    this.cursor.style.cssText = `
      position: fixed;
      width: ${this.config.size}px;
      height: ${this.config.size}px;
      background: ${this.config.color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      border: 2px solid ${this.config.color};
      opacity: 0.8;
      top: -9999px;
      left: -9999px;
    `

    this.cursorF.style.cssText = `
      position: fixed;
      width: ${this.config.sizeF}px;
      height: ${this.config.sizeF}px;
      background: ${this.config.colorF};
      border-radius: 50%;
      pointer-events: none;
      z-index: 10001;
      opacity: 0.5;
      top: -9999px;
      left: -9999px;
    `

    document.body.appendChild(this.cursor)
    document.body.appendChild(this.cursorF)

    // 隐藏触摸设备的光标
    if ('ontouchstart' in window) {
      this.cursor.style.display = 'none'
      this.cursorF.style.display = 'none'
    }
  }

  /**
   * 初始化光标系统
   * - 绑定鼠标事件
   * - 启动动画循环
   */
  public init(): void {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e))
    document.addEventListener('mousedown', () => this.onMouseDown())
    document.addEventListener('mouseup', () => this.onMouseUp())
    this.animate()
  }

  /**
   * 鼠标移动事件处理
   * @param e - 鼠标事件
   */
  private onMouseMove(e: MouseEvent): void {
    this.pageX = e.pageX
    this.pageY = e.pageY

    // 直接更新主光标位置
    this.cursor.style.left = (this.pageX - this.config.size / 2) + 'px'
    this.cursor.style.top = (this.pageY - this.config.size / 2) + 'px'
  }

  /**
   * 鼠标按下事件处理
   * 使用GSAP实现缩放动画
   */
  private onMouseDown(): void {
    gsap.to(this.cursor, { scale: 1.5, duration: 0.2 })
    gsap.to(this.cursorF, { scale: 0.5, duration: 0.2 })
  }

  /**
   * 鼠标抬起事件处理
   * 恢复原始大小
   */
  private onMouseUp(): void {
    gsap.to(this.cursor, { scale: 1, duration: 0.2 })
    gsap.to(this.cursorF, { scale: 1, duration: 0.2 })
  }

  /**
   * 动画循环
   * 实现跟随光标的平滑动画
   */
  private animate = (): void => {
    // 使用线性插值实现平滑跟随
    this.cursorX += (this.pageX - this.cursorX) * 0.16
    this.cursorY += (this.pageY - this.cursorY) * 0.16

    this.cursorF.style.left = (this.cursorX - this.config.sizeF / 2) + 'px'
    this.cursorF.style.top = (this.cursorY - this.config.sizeF / 2) + 'px'

    this.animationId = requestAnimationFrame(this.animate)
  }

  /**
   * 销毁光标系统
   * 停止动画循环并移除DOM元素
   */
  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this.cursor.remove()
    this.cursorF.remove()
  }
}
