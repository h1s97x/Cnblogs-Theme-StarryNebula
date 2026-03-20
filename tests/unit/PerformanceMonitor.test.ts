import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PerformanceMonitor } from '../../src/core/PerformanceMonitor'

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor

  beforeEach(() => {
    monitor = new PerformanceMonitor(true)
  })

  afterEach(() => {
    monitor.clear()
  })

  it('should initialize with enabled state', () => {
    expect(monitor.isEnabled()).toBe(true)
  })

  it('should initialize with disabled state', () => {
    const disabledMonitor = new PerformanceMonitor(false)
    expect(disabledMonitor.isEnabled()).toBe(false)
  })

  it('should mark and measure performance', () => {
    monitor.mark('test-operation')
    
    // Simulate some work
    const start = performance.now()
    while (performance.now() - start < 10) {}
    
    const duration = monitor.measure('test-operation')
    expect(duration).toBeGreaterThan(0)
  })

  it('should record metrics', () => {
    monitor.mark('operation1')
    monitor.measure('operation1')
    
    const metrics = monitor.getMetrics('operation1')
    expect(metrics.length).toBe(1)
    expect(metrics[0].name).toBe('operation1')
  })

  it('should get all metrics', () => {
    monitor.mark('op1')
    monitor.measure('op1')
    
    monitor.mark('op2')
    monitor.measure('op2')
    
    const allMetrics = monitor.getAllMetrics()
    expect(allMetrics.size).toBe(2)
  })

  it('should generate performance report', () => {
    monitor.mark('test')
    monitor.measure('test')
    
    const report = monitor.getReport('test')
    expect(report).toBeDefined()
    expect(report?.summary.count).toBe(1)
    expect(report?.summary.totalDuration).toBeGreaterThan(0)
  })

  it('should calculate average duration', () => {
    monitor.mark('test')
    monitor.measure('test')
    
    monitor.mark('test')
    monitor.measure('test')
    
    const report = monitor.getReport('test')
    expect(report?.summary.count).toBe(2)
    expect(report?.summary.averageDuration).toBeGreaterThan(0)
  })

  it('should track min and max duration', () => {
    monitor.mark('test')
    monitor.measure('test')
    
    const report = monitor.getReport('test')
    expect(report?.summary.minDuration).toBeLessThanOrEqual(
      report?.summary.maxDuration || 0
    )
  })

  it('should get all reports', () => {
    monitor.mark('op1')
    monitor.measure('op1')
    
    monitor.mark('op2')
    monitor.measure('op2')
    
    const reports = monitor.getAllReports()
    expect(reports.size).toBe(2)
  })

  it('should clear specific metric', () => {
    monitor.mark('test')
    monitor.measure('test')
    
    expect(monitor.getMetrics('test').length).toBe(1)
    
    monitor.clear('test')
    expect(monitor.getMetrics('test').length).toBe(0)
  })

  it('should clear all metrics', () => {
    monitor.mark('op1')
    monitor.measure('op1')
    
    monitor.mark('op2')
    monitor.measure('op2')
    
    monitor.clear()
    expect(monitor.getAllMetrics().size).toBe(0)
  })

  it('should enable/disable monitoring', () => {
    monitor.setEnabled(false)
    expect(monitor.isEnabled()).toBe(false)
    
    monitor.setEnabled(true)
    expect(monitor.isEnabled()).toBe(true)
  })

  it('should not record when disabled', () => {
    monitor.setEnabled(false)
    monitor.mark('test')
    const duration = monitor.measure('test')
    
    expect(duration).toBe(0)
  })

  it('should handle missing mark', () => {
    const duration = monitor.measure('nonexistent')
    expect(duration).toBe(0)
  })

  it('should record metadata', () => {
    monitor.mark('test')
    monitor.measure('test', { userId: '123', action: 'load' })
    
    const metrics = monitor.getMetrics('test')
    expect(metrics[0].metadata).toEqual({ userId: '123', action: 'load' })
  })

  it('should get web vitals', () => {
    const vitals = monitor.getWebVitals()
    expect(vitals).toBeDefined()
  })

  it('should get memory usage', () => {
    const memory = monitor.getMemoryUsage()
    expect(memory).toBeDefined()
  })

  it('should print report without errors', () => {
    monitor.mark('test')
    monitor.measure('test')
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    monitor.printReport('test')
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should print all reports', () => {
    monitor.mark('op1')
    monitor.measure('op1')
    
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    monitor.printReport()
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
