# Blog

一个基于 [Fumadocs](https://www.fumadocs.dev/)、Next.js 16 和 React 19 构建的现代化极简博客。

## 核心特性

### 设计

- **字体**：正文采用 **Geist Sans**，代码采用 **JetBrains Mono**。几何无衬线体与等宽字体的组合，保证了长时间阅读的舒适度。
- **深色模式**：基于 Tailwind CSS v4 构建，支持明暗主题切换。
- **响应式布局**：对于移动端视口进行了适配，保证在任何设备上都能获得一致的阅读体验。
- **丰富主题**：[Fumadocs UI](https://www.fumadocs.dev/docs/ui/theme)

### 功能

- **语法高亮**：采用构建时渲染的 Shiki 高亮，内置多种颜色主题。
- **Twoslash 智能提示**：支持代码块内的静态类型检查。悬停变量即可查看 TypeScript 类型定义，通过 Shiki 和 Twoslash 驱动。
- **图表与公式**：原生支持 Mermaid 流程图绘制与 KaTeX 数学公式渲染。
- **本地搜索**：快速的客户端全文搜索功能，支持中英文混合搜索。
- **RSS**：支持 RSS 订阅

### 技术栈

- **Next.js App Router**：基于 Next.js 16 架构，利用 React Server Components 实现最佳性能。
- **极速构建**：采用 **Bun** 作为包管理器，依赖安装与构建速度显著提升。
- **代码规范**：引入 **Biome** 替代 ESLint/Prettier，提供极致的格式化与 Lint 检查速度。

## 本地运行

安装依赖：

```bash
bun install
```

运行：

```bash
bun dev
```

## 本地草稿

未发布的文章放在 `drafts/`，该目录中的草稿会被 Git 忽略，不会进入正式文章列表、搜索、RSS 或 sitemap。

草稿使用和正式文章相同的 frontmatter：

```mdx
---
title: 草稿标题
description: 草稿简介
date: 2026-10-02
tags: ['草稿']
---
```

`description` 可以省略或留空，留空时按未填写处理。

开发服务器启动后，通过 `/drafts/<文件名>` 预览，例如：

```text
http://localhost:3000/drafts/1001
```

草稿只在开发环境中扫描和预览，并带有禁止搜索引擎索引的 metadata。生产构建不会读取草稿，因此未完成的草稿不会影响构建。

图片等资源请使用远程 URL 或 `public/` 下的站点绝对路径，例如 `![图片](/images/example.png)` 对应 `public/images/example.png`。发布命令会拒绝相对资源路径（如 `./diagram.png`）和相对模块引用，避免移动文章后路径失效；被拒绝的草稿会保留在原处。

草稿预览不会抓取远程图片尺寸；正式文章仍会读取图片尺寸并使用 Next.js 图片优化。完成草稿后运行：

```bash
bun run publish:draft 1001
```

该命令会把 `drafts/1001.mdx` 移动到 `content/1001.mdx`。发布前再运行：

```bash
bun run test:drafts
bun run check
bun run build
```
