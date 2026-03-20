/**
 * Component and Plugin Generator CLI
 * 
 * 用于快速生成新的组件和插件
 */

import * as fs from 'fs'
import * as path from 'path'

interface GeneratorOptions {
  name: string
  type: 'component' | 'plugin'
  description?: string
  author?: string
}

export class Generator {
  private projectRoot: string

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
  }

  /**
   * 生成新组件
   */
  public generateComponent(options: GeneratorOptions): void {
    const { name, description = '', author = 'StarryNebula' } = options
    const componentDir = path.join(this.projectRoot, 'src', 'components', name)

    // 创建目录
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true })
    }

    // 生成组件文件
    const componentContent = this.generateComponentTemplate(name, description, author)
    fs.writeFileSync(path.join(componentDir, `${name}.ts`), componentContent)

    // 生成索引文件
    const indexContent = this.generateComponentIndexTemplate(name)
    fs.writeFileSync(path.join(componentDir, 'index.ts'), indexContent)

    // 生成测试文件
    const testContent = this.generateComponentTestTemplate(name)
    const testDir = path.join(this.projectRoot, 'tests', 'unit')
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }
    fs.writeFileSync(path.join(testDir, `${name}.test.ts`), testContent)

    console.log(`✓ Component "${name}" generated successfully`)
    console.log(`  - ${componentDir}/${name}.ts`)
    console.log(`  - ${componentDir}/index.ts`)
    console.log(`  - ${testDir}/${name}.test.ts`)
  }

  /**
   * 生成新插件
   */
  public generatePlugin(options: GeneratorOptions): void {
    const { name, description = '', author = 'StarryNebula' } = options
    const pluginDir = path.join(this.projectRoot, 'src', 'plugins')

    // 创建目录
    if (!fs.existsSync(pluginDir)) {
      fs.mkdirSync(pluginDir, { recursive: true })
    }

    // 生成插件文件
    const pluginContent = this.generatePluginTemplate(name, description, author)
    fs.writeFileSync(path.join(pluginDir, `${name}.ts`), pluginContent)

    // 生成测试文件
    const testContent = this.generatePluginTestTemplate(name)
    const testDir = path.join(this.projectRoot, 'tests', 'unit')
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true })
    }
    fs.writeFileSync(path.join(testDir, `${name}.test.ts`), testContent)

    console.log(`✓ Plugin "${name}" generated successfully`)
    console.log(`  - ${pluginDir}/${name}.ts`)
    console.log(`  - ${testDir}/${name}.test.ts`)
  }

  /**
   * 生成组件模板
   */
  private generateComponentTemplate(name: string, description: string, author: string): string {
    const className = this.toPascalCase(name)
    return `/**
 * ${className} - ${description || name + '组件'}
 * 
 * 作者: ${author}
 * 创建时间: ${new Date().toISOString()}
 */

import { BaseComponent, ComponentConfig } from '../BaseComponent'

export interface ${className}Config extends ComponentConfig {
  selector?: string
}

export class ${className} extends BaseComponent {
  private element: HTMLElement | null = null

  constructor(config: ${className}Config = {}) {
    super('${className}', {
      selector: '.${this.toKebabCase(name)}',
      ...config,
    })
  }

  onInit(): void {
    this.createElement()
  }

  onRender(): void {
    this.renderContent()
    this.applyStyles()
  }

  onUpdate(config: ${className}Config): void {
    this.config = { ...this.config, ...config }
    this.renderContent()
  }

  onDestroy(): void {
    if (this.element) {
      this.element.remove()
    }
    this.element = null
  }

  private createElement(): void {
    this.element = document.createElement('div')
    this.element.className = '${this.toKebabCase(name)}-component'

    const container = document.querySelector('main, #main, #mainContent')
    if (container) {
      container.appendChild(this.element)
    } else {
      document.body.appendChild(this.element)
    }

    this.setElement(this.element)
  }

  private renderContent(): void {
    if (!this.element) return

    this.element.innerHTML = ''
    const title = document.createElement('h3')
    title.textContent = '${className}'
    this.element.appendChild(title)
  }

  private applyStyles(): void {
    if (!this.element) return

    this.element.style.padding = '20px'
    this.element.style.marginTop = '20px'
  }
}
`
  }

  /**
   * 生成组件索引模板
   */
  private generateComponentIndexTemplate(name: string): string {
    const className = this.toPascalCase(name)
    return `export { ${className}, ${className}Config } from './${className}'
`
  }

  /**
   * 生成组件测试模板
   */
  private generateComponentTestTemplate(name: string): string {
    const className = this.toPascalCase(name)
    return `import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ${className} } from '../../src/components/${className}'

describe('${className} Component', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.className = '${this.toKebabCase(name)}'
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it('should initialize with default config', () => {
    const component = new ${className}()
    expect(component.getName()).toBe('${className}')
  })

  it('should render component', () => {
    const component = new ${className}()
    component.init()
    component.render()

    const element = document.querySelector('.${this.toKebabCase(name)}-component')
    expect(element).toBeTruthy()
  })

  it('should update config', () => {
    const component = new ${className}()
    component.init()
    component.update({})
    expect(component.getName()).toBe('${className}')
  })

  it('should destroy component', () => {
    const component = new ${className}()
    component.init()
    component.render()

    const element = document.querySelector('.${this.toKebabCase(name)}-component')
    expect(element).toBeTruthy()

    component.destroy()
    const destroyedElement = document.querySelector('.${this.toKebabCase(name)}-component')
    expect(destroyedElement).toBeFalsy()
  })
})
`
  }

  /**
   * 生成插件模板
   */
  private generatePluginTemplate(name: string, description: string, author: string): string {
    const className = this.toPascalCase(name)
    return `/**
 * ${className} - ${description || name + '插件'}
 * 
 * 作者: ${author}
 * 创建时间: ${new Date().toISOString()}
 */

export interface ${className}Options {
  enabled?: boolean
  [key: string]: any
}

export class ${className} {
  private options: ${className}Options
  private enabled: boolean = true

  constructor(options: ${className}Options = {}) {
    this.options = {
      enabled: true,
      ...options,
    }
    this.enabled = this.options.enabled ?? true
  }

  /**
   * 初始化插件
   */
  public init(): void {
    if (!this.enabled) return
    console.log('[${className}] Plugin initialized')
  }

  /**
   * 启用插件
   */
  public enable(): void {
    this.enabled = true
    console.log('[${className}] Plugin enabled')
  }

  /**
   * 禁用插件
   */
  public disable(): void {
    this.enabled = false
    console.log('[${className}] Plugin disabled')
  }

  /**
   * 检查插件是否启用
   */
  public isEnabled(): boolean {
    return this.enabled
  }

  /**
   * 获取插件选项
   */
  public getOptions(): ${className}Options {
    return { ...this.options }
  }

  /**
   * 更新插件选项
   */
  public updateOptions(options: Partial<${className}Options>): void {
    this.options = { ...this.options, ...options }
  }
}
`
  }

  /**
   * 生成插件测试模板
   */
  private generatePluginTestTemplate(name: string): string {
    const className = this.toPascalCase(name)
    return `import { describe, it, expect, beforeEach } from 'vitest'
import { ${className} } from '../../src/plugins/${className}'

describe('${className} Plugin', () => {
  let plugin: ${className}

  beforeEach(() => {
    plugin = new ${className}()
  })

  it('should initialize plugin', () => {
    plugin.init()
    expect(plugin.isEnabled()).toBe(true)
  })

  it('should enable plugin', () => {
    plugin.disable()
    expect(plugin.isEnabled()).toBe(false)

    plugin.enable()
    expect(plugin.isEnabled()).toBe(true)
  })

  it('should disable plugin', () => {
    plugin.disable()
    expect(plugin.isEnabled()).toBe(false)
  })

  it('should get options', () => {
    const options = plugin.getOptions()
    expect(options).toBeDefined()
    expect(options.enabled).toBe(true)
  })

  it('should update options', () => {
    plugin.updateOptions({ enabled: false })
    const options = plugin.getOptions()
    expect(options.enabled).toBe(false)
  })
})
`
  }

  /**
   * 转换为 PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  }

  /**
   * 转换为 kebab-case
   */
  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase()
  }
}

/**
 * CLI 入口
 */
if (require.main === module) {
  const args = process.argv.slice(2)
  const command = args[0]
  const type = args[1] as 'component' | 'plugin'
  const name = args[2]

  if (!command || !type || !name) {
    console.log('Usage: npx ts-node src/cli/generator.ts <generate> <component|plugin> <name>')
    console.log('Example: npx ts-node src/cli/generator.ts generate component MyComponent')
    process.exit(1)
  }

  const generator = new Generator()

  if (command === 'generate') {
    if (type === 'component') {
      generator.generateComponent({ name, type })
    } else if (type === 'plugin') {
      generator.generatePlugin({ name, type })
    }
  }
}
