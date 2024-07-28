# vite配置封装

首先在项目根目录下新建目录：

- **vite-config** ------- vite配置文件目录  
  |- **plugins** -------- 插件配置目录  
  |- **alias.ts** ------- 别名配置  
  |- **server.ts** ------ 服务配置  
  |- **build.ts** ------- 构建配置  

## tsconfig.node.json

需要再`include`中新增`"vite-config/**/*.ts"`,否则会提示找不到模块。

## 环境变量配置

直接在根目录创建环境变量配置文件，然后在业务代码中使用 `import.meta.env` 来获取环境变量。

- .env.development

```bash
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
"NODE_ENV" = 'development'
"VITE_APP_TITLE" = '开发环境'
"VITE_APP_BASE_API" = '/dev-api'
```

- .env.production

```bash
# 变量必须以 VITE_ 为前缀才能暴露给外部读取
"NODE_ENV" = 'production'
"VITE_APP_TITLE" = '生产环境'
"VITE_APP_BASE_API" = '/prod-api'
```

**如果需要在vite-config.ts中使用环境变量：**  

```typescript
import { defineConfig,loadEnv } from "vite"

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    // 根据当前工作目录中的 `mode` 加载 环境配置文件 文件
    const env = loadEnv(mode, process.cwd())
    console.log(env)
    return {
    }
})
```

## 插件配置

在`plugins`目录下新建一个 `config` 文件夹，所有的插件配置文件都创建在这个文件夹中，然后在`plugins/index.ts`中引入并导出一个数组，数组中包含所有插件的配置。  
后续所有的插件的配置文件都保存在这里。

### unplugin-vue-components

```typescript
import components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import IconsResolver from "unplugin-icons/resolver"
export default function useComponents() {
    return components({
        resolvers: [
            // 自动注册图标组件
            IconsResolver({
                // ep代表element-plus，也可以下载其他的
                // 默认前缀为i
                // 用法： <i-ep-menu />
                // 图标库网站：https://icon-sets.iconify.design/
                enabledCollections: ["ep"],
            }),
            // 自动导入 Element Plus 组件
            ElementPlusResolver(),
        ],
        // 自动注册自定义组件
        dirs: ["src/components"],
        include: [/\.vue$/, /\.vue\?vue/, /\.tsx$/],
        dts: "types/components.d.ts",
    })
}

```

### unplugin-auto-import

```typescript
import AutoImport from "unplugin-auto-import/vite"
import IconsResolver from "unplugin-icons/resolver"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
export default function useAutoImport() {
    return AutoImport({
        // 使用"vue", "vue-router", "pinia相关api不需要手动引入了
        // 这个功能根据开发习惯自行决定是否开启
        // imports: ["vue", "vue-router", "pinia"],
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [
            ElementPlusResolver(),
        ],
        dts: "types/auto-imports.d.ts",
        // eslint报错解决
        eslintrc: {
            enabled: true, // Default `false`
            filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
            globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
    })
}

```

### unplugin-icons

icon图表导入方式有多种：

- 手动下载elementplus的图标库`@element-plus/icons-vue`
  - 全局导入
  - 手动导入
- 自动导入
  - 不需要手动下载库
  - `unplugin-vue-components`
    - 添加相应的配置，前面对应的插件配置中已经注释了
  - `unplugin-auto-import`
    - 这里需要说明下，官网的示例代码中这里面是有对应的配置的
    - 但是实际并没有用，所有没有配置
  - `unplugin-icons`
    - 自动下载icon
    - [图标库](https://icon-sets.iconify.design/)

```typescript
import Icons from "unplugin-icons/vite"
export default function useIcons() {
    return Icons({
        autoInstall: true,
    })
}

```

### index.ts汇总导出配置对象

```typescript
import { PluginOption } from "vite"
import vue from "@vitejs/plugin-vue"
import useAutoImport from "./config/use-auto-import"
import useComponents from "./config/use-components"
import useIcons from "./config/use-icons"

export default function getVitePlugins(): PluginOption[] {
    const plugins: PluginOption[] = [vue()]
    plugins.push(useAutoImport())
    plugins.push(useComponents())
    plugins.push(useIcons())
    return plugins
}

```

## 别名配置

```typescript
import { fileURLToPath, URL } from "node:url"
const alias = {
    "@": fileURLToPath(new URL("../src", import.meta.url)),
}

export default alias
```

## 服务配置

```typescript
import { ServerOptions } from "vite"

const server: ServerOptions = {
    host: "0.0.0.0",
    open: true,
    port: 8080,
    proxy: {},
}
export default server

```

## 构建配置

```typescript
import { BuildOptions } from "vite"

const build: BuildOptions = {
    target: "es2015",
    sourcemap: true,
}
export default build

```
