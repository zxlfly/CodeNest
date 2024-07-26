# 开发环境搭建

参考vite中的[从0到1构建项目](/packages/vite/_sort.4_从0到1构建项目.html)  
完成后基本的Vue3以及对应的代码规范格式化约束和提交校验功能就处理完了。

会先使用大家熟悉的默认的vite配置方式，安装Vue3全家桶安装，后续会对vite配置进行抽离，方便后续的项目开发维护。

## Vue3全家桶安装

- Vue router
- Pinia
- Element Plus

### 路由

在通过vite搭建项目的时候，是可以选择安装**Vue router**的，这里演示的是单独手动安装。

```bash
pnpm add vue-router@4
```

### 状态管理

在通过vite搭建项目的时候，是可以选择安装**Pinia**的，这里演示的是单独手动安装。

```bash
pnpm add pinia
```

### UI框架

这里选择的是**Element Plus**

```bash
pnpm add element-plus
```