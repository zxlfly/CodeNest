# 开发环境搭建

参考vite中的[从0到1构建项目](/packages/vite/_sort.4_从0到1构建项目.html)  
完成后基本的Vue3以及对应的代码规范格式化约束和提交校验功能就处理完了。

会先使用大家熟悉的默认的vite配置方式，安装Vue3全家桶安装，后续会对vite配置进行抽离，方便后续的项目开发维护。

## Vue3全家桶安装

- Vue router
- Pinia
- Element Plus

### 路由

在通过vite搭建项目的时候，是可以选择安装[Vue router](https://router.vuejs.org/zh/introduction.html)的，这里演示的是单独手动安装。

```bash
pnpm add vue-router@4
```

安装完成后再`src`目录下新建`router`文件夹，后续路由的配置文件都会放在这里。

### 状态管理

在通过vite搭建项目的时候，是可以选择安装[Pinia](https://pinia.vuejs.org/zh/getting-started.html)的，这里演示的是单独手动安装。
在后面的[配置路由]章节会详细介绍怎么使用。

```bash
pnpm add pinia
```

安装完成后再`src`目录下新建`stores`文件夹，后续状态文件都会放在这里。
在后面的[页面布局](/packages/admin-framework/_sort.3_2.页面布局)章节会详细介绍怎么使用。

### UI框架

这里选择的是[Element Plus](https://element-plus.org/zh-CN/guide/installation.html)

```bash
pnpm add element-plus
```

#### 自动导入

首先你需要安装**unplugin-vue-components** 和 **unplugin-auto-import**这两款插件  

```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

然后把下列代码插入到你的 `Vite` 的配置文件中

```js
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // ...
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

这样就可以自动导入 `Element Plus` 的组件了，不需要手动导入。使用时候直接使用即可。
