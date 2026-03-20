# StarryNebula 配置指南

## 概述

StarryNebula 提供了灵活的配置系统，允许用户自定义主题的各种功能和外观。

## 基础配置

### 在博客园中配置

在博客园的侧边栏 HTML 代码中添加以下配置：

```html
<script type="text/javascript">
  window.cnblogsConfig = {
    info: {
      name: 'YourName',           // 您的用户名
      startDate: '2021-01-01',    // 入园时间
      avatar: 'http://xxxx.png',  // 头像 URL
    },
    animate: {
      starfield: {
        enabled: true,            // 是否启用星空背景
        starCount: 200,           // 星星数量
        speed: 0.5,               // 星空移动速度
        colors: ['#ffffff', '#e0e6ff', '#ffd4e5'],  // 星星颜色
      },
      cursor: {
        enabled: true,            // 是否启用自定义光标
        size: 12,                 // 主光标大小
        sizeF: 4,                 // 跟随光标大小
        color: '#64b5f6',         // 主光标颜色
        colorF: '#ffffff',        // 跟随光标颜色
      },
    },
    theme: {
      mode: 'auto',               // 主题模式：'light' | 'dark' | 'auto'
      colors: {
        primary: '#64b5f6',       // 主色调
        secondary: '#ffd4e5',     // 辅助色
      },
    },
  }
</script>
<!-- 从 GitHub 加载插件 -->
<script src="https://cdn.jsdelivr.net/gh/h1s97x/Cnblogs-Theme-StarryNebula@latest/dist/starrynebula.js" defer></script>
```

## 配置选项详解

### info - 基础信息

```javascript
info: {
  name: '',              // 用户名（可选）
  startDate: '2021-01-01',  // 入园时间（YYYY-MM-DD 格式）
  avatar: '',            // 头像 URL（可选）
}
```

### animate.starfield - 星空背景

```javascript
animate: {
  starfield: {
    enabled: true,       // 是否启用星空背景
    starCount: 200,      // 星星数量（推荐 100-300）
    speed: 0.5,          // 星空移动速度（0.1-1.0）
    colors: [            // 星星颜色数组
      '#ffffff',         // 白色
      '#e0e6ff',         // 浅蓝色
      '#ffd4e5'          // 浅粉色
    ],
  },
}
```

**参数说明：**
- `starCount`: 星星数量越多，效果越密集，但性能消耗越大
- `speed`: 速度越快，星空移动越明显
- `colors`: 可以添加更多颜色，星星会随机选择

### animate.cursor - 光标效果

```javascript
animate: {
  cursor: {
    enabled: true,       // 是否启用自定义光标
    size: 12,            // 主光标大小（像素）
    sizeF: 4,            // 跟随光标大小（像素）
    color: '#64b5f6',    // 主光标颜色
    colorF: '#ffffff',   // 跟随光标颜色
  },
}
```

**参数说明：**
- `size`: 主光标大小，建议 8-16px
- `sizeF`: 跟随光标大小，通常比主光标小
- `color`: 使用十六进制颜色代码

### theme - 主题配置

```javascript
theme: {
  mode: 'auto',          // 主题模式
  colors: {
    primary: '#64b5f6',  // 主色调
    secondary: '#ffd4e5',// 辅助色
  },
}
```

**mode 选项：**
- `'light'` - 强制浅色主题
- `'dark'` - 强制深色主题
- `'auto'` - 根据系统设置自动切换

## 常见配置示例

### 示例 1：最小化配置

只启用基础功能：

```javascript
window.cnblogsConfig = {
  info: {
    name: 'MyBlog',
  },
}
```

### 示例 2：自定义颜色

使用自己喜欢的颜色：

```javascript
window.cnblogsConfig = {
  animate: {
    starfield: {
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    },
    cursor: {
      color: '#ff6b6b',
      colorF: '#4ecdc4',
    },
  },
  theme: {
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
    },
  },
}
```

### 示例 3：禁用某些功能

```javascript
window.cnblogsConfig = {
  animate: {
    starfield: {
      enabled: false,  // 禁用星空
    },
    cursor: {
      enabled: true,   // 保留光标
    },
  },
}
```

### 示例 4：高性能配置

适合低端设备：

```javascript
window.cnblogsConfig = {
  animate: {
    starfield: {
      starCount: 100,  // 减少星星数量
      speed: 0.3,      // 降低速度
    },
  },
}
```

### 示例 5：完整配置

```javascript
window.cnblogsConfig = {
  info: {
    name: 'YourName',
    startDate: '2021-01-01',
    avatar: 'https://example.com/avatar.jpg',
  },
  animate: {
    starfield: {
      enabled: true,
      starCount: 200,
      speed: 0.5,
      colors: ['#ffffff', '#e0e6ff', '#ffd4e5'],
    },
    cursor: {
      enabled: true,
      size: 12,
      sizeF: 4,
      color: '#64b5f6',
      colorF: '#ffffff',
    },
  },
  theme: {
    mode: 'auto',
    colors: {
      primary: '#64b5f6',
      secondary: '#ffd4e5',
    },
  },
}
```

## 高级用法

### 使用生命周期钩子

在配置后，可以使用生命周期钩子来执行自定义代码：

```javascript
<script src="https://cdn.jsdelivr.net/gh/h1s97x/Cnblogs-Theme-StarryNebula@latest/dist/starrynebula.js" defer></script>
<script>
  // 等待脚本加载完成
  window.addEventListener('load', function() {
    // 页面加载后执行
    console.log('StarryNebula 已加载')
  })
</script>
```

### 动态修改配置

虽然配置通常在页面加载前设置，但可以通过修改 `window.cnblogsConfig` 来动态调整：

```javascript
// 修改光标颜色
window.cnblogsConfig.animate.cursor.color = '#ff6b6b'
```

## 故障排除

### 配置不生效

**问题：** 修改了配置但没有生效

**解决方案：**
1. 确保配置在脚本加载前设置
2. 检查浏览器控制台是否有错误
3. 清除浏览器缓存
4. 检查配置语法是否正确

### 性能问题

**问题：** 页面加载缓慢或卡顿

**解决方案：**
1. 减少 `starCount` 数量
2. 禁用不需要的功能
3. 检查浏览器是否支持 WebGL

### 光标不显示

**问题：** 自定义光标没有显示

**解决方案：**
1. 确保 `cursor.enabled` 为 `true`
2. 检查是否在移动设备上（移动设备会自动隐藏）
3. 检查颜色是否与背景相同

## 最佳实践

1. **性能优先** - 在低端设备上减少特效数量
2. **颜色搭配** - 选择与博客主题相搭配的颜色
3. **可访问性** - 确保光标颜色与背景有足够的对比度
4. **测试** - 在不同浏览器和设备上测试配置

## 更多帮助

- 查看 [README.md](../README.md) 了解基本信息
- 查看 [INSTALL.md](./INSTALL.md) 了解安装步骤
- 查看 [DEVELOPMENT.md](./DEVELOPMENT.md) 了解开发指南

## 反馈和建议

如有问题或建议，欢迎在 [GitHub Issues](https://github.com/h1s97x/Cnblogs-Theme-StarryNebula/issues) 中提出。
