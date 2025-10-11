# 开发环境搭建

参考 vite 中的[从 0 到 1 构建项目](/packages/vite/_sort.4_从0到1构建项目.html)  
完成后基本的 Vue3 以及对应的代码规范格式化约束和提交校验功能就处理完了。

会先使用大家熟悉的默认的 vite 配置方式，安装 Vue3 全家桶安装，后续会对 vite 配置进行抽离，方便后续的项目开发维护。

## Vue3 全家桶安装

- Vue router
- Pinia
- Element Plus

## 路由

在通过 vite 搭建项目的时候，是可以选择安装[Vue router](https://router.vuejs.org/zh/introduction.html)的，这里演示的是单独手动安装。

```bash
pnpm add vue-router@4
```

安装完成后再`src`目录下新建`router`文件夹，后续路由的配置文件都会放在这里。

## 状态管理

在通过 vite 搭建项目的时候，是可以选择安装[Pinia](https://pinia.vuejs.org/zh/getting-started.html)的，这里演示的是单独手动安装。

```bash
pnpm add pinia
```

安装完成后再`src`目录下新建`stores`文件夹，后续状态文件都会放在这里。

## UI 框架

这里选择的是[Element Plus](https://element-plus.org/zh-CN/guide/installation.html)

```bash
pnpm add element-plus
```

## 自动导入

首先你需要安装`unplugin-vue-components` 和 `unplugin-auto-import`这两款插件

```bash
pnpm add -D unplugin-vue-components unplugin-auto-import
```

然后把下列代码插入到你的 `Vite` 的配置文件中。  
除了 UI 的导入外，还可以设置一些常用的，例如`vue`、`pinia`、`router`；我们自己在`src/components`中定义的组件。都可以添加进去，根据自身的需求来配置。  
由于我们使用了`TS`、`eslint`，所以还需要额外的配置，通过这个两个插件来生成对应的类型文件和全局对象文件：

- `.eslintrc-auto-import.json` 默认根目录下
  - 在`eslint.config.js`中使用
- `auto-imports.d.ts`、`components.d.ts` 默认根目录下
  - 在`tsconfig.app.json`中使用

这些生成的文件默认在根目录下，我们在根目录新增一个 `types` 文件夹，将生成的文件根据类别放在这个文件夹下。  
**vite.config.js**

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ["vue", "vue-router", "pinia"],
      eslintrc: {
        enabled: true,
        filepath: "./types/autoImport/.eslintrc-auto-import.json",
      },
      dts: "./types/autoImport/auto-imports.d.ts",
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      // dirs: ["src/components"],
      dts: "./types/components/components.d.ts",
    }),
  ],
});
```

**eslint.config.js**  
`globals`中新增，但是需要处理下这个 json 文件，将`globals`中的`autoInport.globals`中的对象进行展开。

```js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
// 也可以通过fs来处理
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const autoInport = require("./types/autoImport/.eslintrc-auto-import.json");
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...autoInport.globals,
      },
    },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  eslintPluginPrettierRecommended,
]);
```

**tsconfig.app.json**  
`types`中增加。

```JS
{
    "extends": "@vue/tsconfig/tsconfig.dom.json",
    "compilerOptions": {
        "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        "types": [
            "vite/client",
            "./types/autoImport/auto-imports.d.ts",
            "./types/components/components.d.ts",
            "element-plus/global"
        ],

        /* Linting */
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "erasableSyntaxOnly": true,
        "noFallthroughCasesInSwitch": true,
        "noUncheckedSideEffectImports": true
    },
    "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

这样就可以自动导入了，不需要手动导入。使用时候直接使用即可。对应的`ts`提示信息也有了。

## 自定义插件导入

关于`element plus`的提示信息这类 api 级别的，需要手动引入，我们可以通过实现一个 vue 的插件来处理，将需要的挂载到全局对象中。  
新建一个插件在`src/plugins`下，这里以`element plus`的提示信息为例，代码如下：  
注意需要在 main.ts 中引入使用插件，这里不贴相关代码了。

```TS
import type { App } from "vue"
// 根据需求引入
import { ElMessage, ElMessageBox, ElNotification } from "element-plus"

export default (app: App) => {
    app.config.globalProperties.$message = ElMessage
    app.config.globalProperties.$msgbox = ElMessageBox
    app.config.globalProperties.$alert = ElMessageBox.alert
    app.config.globalProperties.$confirm = ElMessageBox.confirm
    app.config.globalProperties.$notify = ElNotification
}

```

**使用**

```vue
<script setup lang="ts">
const { proxy } = getCurrentInstance()!;
const msg = ref("3333");
const handle = () => {
  proxy?.$message({
    message: "123123",
    grouping: true,
    type: "success",
  });
};
</script>
```

但是到这还是不会自动导入样式，需要手动引入样式，我们可以下载`unplugin-element-plus`来实现这个按需导入的功能。  
**vite.config.js**

```js
import { defineConfig } from "vite";
import ElementPlus from "unplugin-element-plus/vite";

export default defineConfig({
  // ...
  plugins: [ElementPlus()],
});
```
