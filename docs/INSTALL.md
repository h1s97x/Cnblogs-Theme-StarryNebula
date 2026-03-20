# 安装配置

::: danger 注意
1. 本文档为 v2 版本的安装配置教程，请核对使用版本。
2. 应用插件需要 JS 权限，没有的请先申请权限。
:::

## 获取插件

::: tip 提示
建议使用最新版本，历史版本随着博客园不断迭代，会出现兼容性问题。
:::

进入插件仓库：[点击进入](https://github.com/h1s97x/Cnblogs-Theme-StarryNebula)

## 开发环境

本项目使用现代前端技术栈：

* TypeScript - 类型安全的 JavaScript
* Less - CSS 预处理器
* Vite - 极速构建工具

### 快速开始

```bash
# 安装依赖
npm install

# 开发模式（热更新）
npm run dev

# 构建生产版本
npm run build
```

构建后的文件位于 `dist/` 目录，包含：
* `starrynebula.js` - 编译后的 JavaScript
* `starrynebula.css` - 编译后的 CSS

## 博客园后台配置

### 进入管理后台

首先进入管理后台：[点击访问](https://i.cnblogs.com/Configure.aspx)

### 设置页

进入管理后台/设置页。

#### 页面定制 CSS 代码

* 勾选`禁用模板默认CSS`
* 拷贝 `dist/starrynebula.css` 的全部内容至页面定制 CSS 代码文本框

#### 博客侧边栏公告

在侧边栏HTML代码中设置以下代码：

```html
<script type="text/javascript">
    window.cnblogsConfig = {
      info: {
        name: 'userName', // 您的用户名
        startDate: '2021-01-01', // 您的入园时间，年-月-日
        avatar: 'http://xxxx.png', // 您的头像 URL 地址
      },
    }
</script>
<!-- 从 GitHub 加载插件 -->
<script src="https://cdn.jsdelivr.net/gh/h1s97x/Cnblogs-Theme-StarryNebula@latest/dist/starrynebula.js" defer></script>
```

### 配置说明

* `h1s97x` - GitHub 用户名
* `Cnblogs-Theme-StarryNebula` - 仓库名
* `@latest` - 使用最新版本，或指定具体版本如 `@v2.0.0`

## 配置完成

配置完成，保存即可成功应用插件！