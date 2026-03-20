/**
 * PerformanceMonitor - 性能监控系统
 * 
 * 监控应用性能指标
 */

export interface PerformanceMetrics {
  name: string
  duration: number
  timestamp: number
  metadata?: Record<string, any>
}

export interface PerformanceReport {
  metrics: PerformanceMetrics[]
  summary: {
    totalDuration: number
    averageDuration: number
    minDuration: number
    maxDuration: number
    count: number
  }
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics[]> = new Map()
  private marks: Map<string, number> = new Map()
  private enabled: boolean = true

  constructor(enabled: boolean = true) {
    this.enabled = enabled
  }

  /**
   * 标记开始
   */
  public mark(name: string): void {
    if (!this.enabled) return
    this.marks.set(name, performance.now())
  }

  /**
   * 标记结束并记录
   */
  public measure(name: string, metadata?: Record<string, any>): number {
    if (!this.enabled) return 0

    const startTime = this.marks.get(name)
    if (!startTime) {
      console.warn(`Mark "${name}" not found`)
      return 0
    }

    const duration = performance.now() - startTime
    this.recordMetric(name, duration, metadata)
    this.marks.delete(name)

    return duration
  }

  /**
   * 记录指标
   */
  private recordMetric(
    name: string,
    duration: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const metric: PerformanceMetrics = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    }

    this.metrics.get(name)!.push(metric)
  }

  /**
   * 获取指标
   */
  public getMetrics(name: string): PerformanceMetrics[] {
    return this.metrics.get(name) || []
  }

  /**
   * 获取所有指标
   */
  public getAllMetrics(): Map<string, PerformanceMetrics[]> {
    return new Map(this.metrics)
  }

  /**
   * 获取报告
   */
  public getReport(name: string): PerformanceReport | null {
    const metrics = this.metrics.get(name)
    if (!metrics || metrics.length === 0) {
      return null
    }

    const durations = metrics.map((m) => m.duration)
    const totalDuration = durations.reduce((a, b) => a + b, 0)

    return {
      metrics,
      summary: {
        totalDuration,
        averageDuration: totalDuration / metrics.length,
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        count: metrics.length,
      },
    }
  }

  /**
   * 获取所有报告
   */
  public getAllReports(): Map<string, PerformanceReport> {
    const reports = new Map<string, PerformanceReport>()

    for (const [name] of this.metrics) {
      const report = this.getReport(name)
      if (report) {
        reports.set(name, report)
      }
    }

    return reports
  }

  /**
   * 打印报告
   */
  public printReport(name?: string): void {
    if (name) {
      const report = this.getReport(name)
      if (report) {
        console.log(`[Performance] ${name}:`)
        console.log(`  Total: ${report.summary.totalDuration.toFixed(2)}ms`)
        console.log(`  Average: ${report.summary.averageDuration.toFixed(2)}ms`)
        console.log(`  Min: ${report.summary.minDuration.toFixed(2)}ms`)
        console.log(`  Max: ${report.summary.maxDuration.toFixed(2)}ms`)
        console.log(`  Count: ${report.summary.count}`)
      }
    } else {
      console.log('[Performance] All Metrics:')
      for (const [metricName, report] of this.getAllReports()) {
        console.log(`  ${metricName}:`)
        console.log(`    Average: ${report.summary.averageDuration.toFixed(2)}ms`)
        console.log(`    Count: ${report.summary.count}`)
      }
    }
  }

  /**
   * 清除指标
   */
  public clear(name?: string): void {
    if (name) {
      this.metrics.delete(name)
    } else {
      this.metrics.clear()
    }
  }

  /**
   * 启用/禁用监控
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * 检查是否启用
   */
  public isEnabled(): boolean {
    return this.enabled
  }

  /**
   * 获取 Web Vitals
   */
  public getWebVitals(): {
    fcp?: number
    lcp?: number
    cls?: number
    fid?: number
  } {
    const vitals: any = {}

    // First Contentful Paint
    const fcpEntries = performance.getEntriesByName('first-contentful-paint')
    if (fcpEntries.length > 0) {
      vitals.fcp = fcpEntries[0].startTime
    }

    // Largest Contentful Paint
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint')
    if (lcpEntries.length > 0) {
      vitals.lcp = lcpEntries[lcpEntries.length - 1].startTime
    }

    // Cumulative Layout Shift
    const clsEntries = performance.getEntriesByType('layout-shift')
    if (clsEntries.length > 0) {
      vitals.cls = clsEntries.reduce((sum, entry: any) => {
        return sum + (entry.hadRecentInput ? 0 : entry.value)
      }, 0)
    }

    return vitals
  }

  /**
   * 获取内存使用
   */
  public getMemoryUsage(): {
    usedJSHeapSize?: number
    totalJSHeapSize?: number
    jsHeapSizeLimit?: number
  } {
    if ((performance as any).memory) {
      return (performance as any).memory
    }
    return {}
  }
}

// 全局性能监控实例
export const globalPerformanceMonitor = new PerformanceMonitor()
