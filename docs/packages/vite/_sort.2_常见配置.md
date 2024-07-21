# 常见配置

使用构建工具开发，可以很方便的帮我们处理less、scss文件，将ts转换为js，处理兼容性问题，以及压缩文件、代码分割等等。

## CSS

### **CSS Modules**

以 .module.css 结尾的文件都会被认为是一个 CSS modules 文件。导入这样的文件会返回一个相应的对象，使用css样式的时候以对象.属性名的形式。
这样做的好处是可以避免在不同css文件中出现同名class等出现样式覆盖的问题。

### **CSS 预处理器**

Vite 同时提供了对 .scss，.sass，.less，.styl 和 .stylus 文件的内置支持，仅需安装相应的预处理器就可以了。

```bash
# .scss and .sass
npm add -D sass
# .less
npm add -D less
# .styl and .stylus
npm add -D stylus
```

### **PostCSS**

可以理解为一个工具箱，类比js的babel，可以添加各种插件来处理 CSS 问题。例如：样式兼容性问题，高级 CSS 语法的降级、前缀补全等，都可以通过 PostCSS 来解决。
在vite中使用只需要安装需要的插件即可。例如常用的**postcss-preset-env**，可以处理高级 CSS 语法的降级、前缀补全等等。

### 在vite配置文件中配置

```javascript
import { defineConfig } from 'vite'
import postcssPresetEnv from 'postcss-preset-env'

export default defineConfig({
  css: {
    postcss: {
      plugins: [postcssPresetEnv()]
    }
  }
})

```

### 也可以在根目录下创建postcss的配置文件

## 对静态资源的处理

### 将资源引入为 URL

默认情况下引入一个静态资源，会返回这个资源的 URL 路径，也就是绝对路径。
可以通过添加后缀的方式，修改文件的引入方式。

- 默认的引入方式等同于添加 ?url 后缀。
- 使用 ?raw 后缀可以将资源作为字符串引入，这个字符串其实就是源文件信息。
- 导入脚本作为 Worker 。JS 脚本可以通过 ?worker 或 ?sharedworker 后缀导入为 web worker。
  - 这个只适用于开发环境

### 对 JSON 的处理

JSON 文件可以被直接导入。也支持具名导入，优先使用具名导入的方式，有利于treeshaking 。

### 对 TS 的处理

Vite 天然支持引入 .ts 文件。Vite 使用 esbuild 将 TypeScript 转译为 JavaScript。但是并不执行任何类型检查。所以还需要其他插件的支持。例如：vite-plugin-checker。

### ts的配置文件

默认就一个tsconfig.json配置文件，项目开发中也可以将其拆分开，分为node和web应用的。可以通过tsconfig.json中的references属性进行配置，指向不同的配置文件。

```javascript
{
 "files": [],
 "references": [
  {
   "path": "./tsconfig.node.json"
  },
  {
   "path": "./tsconfig.app.json"
  }
 ]
}

```

## 环境变量与模式

### node环境下

Vite 使用 dotenv 从特定的文件中加载额外的环境变量，将其中的环境变量注入到process对象中。vite在读取配置文件的时候会先使用node来解析，这个process对象可以在这个过程中使用。
可以通过process.cwd()获取当前node执行的目录，使用__dirname获取当前文件所在目录。

- env: 所有环境都需要用到的环境变量
- env.development: 开发环境需要用到的环境变量(默认情况下vite将我们的开发环境取名为development)
- env.production: 生产环境需要用到的环境变量(默认情况下vite将我们的生产环境取名为production)
- yarn dev --mode development 会将mode设置为development传递进来

### web环境下

vite会将环境对象注入到**import.meta.env**中。并且vite为了不暴露隐私变量，只有使用了VITE前缀的才会自动注入。
可以使用envPrefix配置项来改变默认前缀。但是不能设置为空。

## 性能优化

### 分包策略

浏览器的缓存策略是文件名不变就不会去重新请求文件。因此在打包的时候我们应该将不变的或者说是不常变的代码文件进行单独打包。
例如我们下载的第三方包，这些我们默认是不会去修改的。

```typescript
export default defineConfig(({ command, mode }) => {
 
 return {
  build: {
   rollupOptions: {
    output: {
     manualChunks: (id) => {
            // 将 node_modules 中的代码单独打包成一个 JS 文件
      if (id.includes("node_modules")) {
       return "vendor";
      }
     },
    },
   },
  },
 };
});

```

### **treeshaking**

也叫摇树优化，就是在保证代码运行结果不变的前提下，去除无用的代码。前提是 ES6 module 模块才行。

### gzip压缩

一种使用非常普遍的压缩格式。虽然这可以减小代码的体积，但是浏览器解压也是有消耗的，如果文件代码体积不是很大的话，没必要开启。
需要安装vite-plugin-compression插件

```typescript
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [viteCompression()]
})
```

后端在响应资源请求的时候需要设置响应头 content-encoding: gzip ，告诉浏览器以何种方式进行解压。

### **图片压缩**

根据需求，我们可以使用 vite-plugin-imagemin 插件，对图片进行适当压缩。具体配置参数参考[文档](https://github.com/vbenjs/vite-plugin-imagemin)。

### CDN加速

就是让用户从最近的服务器请求资源，提升网络请求的响应速度。通常我们请求依赖模块使用 CDN ，而请求项目代码依然使用自己的服务器。
将依赖的第三方模块写成cdn的形式，减小打包体积。例如使用**vite-plugin-cdn-import**插件。
构建成功后，Vite 会自动帮我们将 cdn 资源通过 script 标签插入到 html 中

```typescript

export default defineConfig(({ command, mode }) => {
 return {
   plugins: [
        importToCDN({
            modules: [
                {
                    name: 'react',
                    var: 'React',
                   // cdn地址
                    path: `umd/react.production.min.js`,
                },
                {
                    name: 'react-dom',
                    var: 'ReactDOM',
                    path: `umd/react-dom.production.min.js`,
                },
            ],
        }),
    ],
 };
});
```

### Module 配置

| Name | Description | Type |
| --- | --- | --- |
| name | 需要 CDN 加速的包名称 | string |
| var | 全局分配给模块的变量，Rollup 需要这个变量名称 | string |
| path | 指定 CDN 上的加载路径 | string / string[] |
| css | 可以指定从 CDN 地址上加载多个样式表 | string / string[] |

### 其他的 CDN pordUrl 地址

| Name | pordUrl |
| --- | --- |
| unpkg | //unpkg.com/{name}@{version}/{path} |
| cdnjs | //cdnjs.cloudflare.com/ajax/libs/{name}/{version}/{path} |

## 生产环境构建

### Rollup配置

Vite 生产环境构建使用的Rollup，可以通过 构建配置选项 自定义构建过程

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#big-list-of-options
    },
    assetsInlineLimit: 4096, // 4kb
  }
})

```

### 浏览器的兼容性问题

默认情况下，Vite 的目标是支持 原生 ESM script 标签 、支持原生 ESM 动态导入 和 import.meta 的现代浏览器。但我们可以通过 Vite 自带的 @vitejs/plugin-legacy 插件，来兼容旧版本的浏览器。
这个插件会使用terser进行压缩，所以需要安装terser。

```javascript
import legacy from '@vitejs/plugin-legacy'
export default {
  plugins: [
    legacy({
      // defaults 是 Browserslist 推荐的值
      targets: ['defaults', 'not IE 11']
    })
  ]
}

```

## **构建分析**

分析依赖模块的大小占比，可以让我们更有针对性的进行体积优化。
可以使用 rollup-plugin-visualizer 插件进行构建分析

```typescript
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // 将 visualizer 插件放到最后
    visualizer()
  ]
})
```

构建成功之后会在根目录下生成一个 stats.html ，打开页面即可以看到分析结果。我们还可以通过左上角的 排除、包含 输入框对依赖模块进行筛选。同时鼠标移入各模块，可以看到详细的分析数据。
