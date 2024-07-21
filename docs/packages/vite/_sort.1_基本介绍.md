# vite

## 基本原理特点

### Vite由两个主要部分组成

- 一个开发服务器，它基于 [原生 ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 提供了 [丰富的内建功能](https://cn.vitejs.dev/guide/features.html)，如速度快到惊人的 [模块热更新（HMR）](https://cn.vitejs.dev/guide/features.html#hot-module-replacement)。
- 一套构建指令，它使用 [Rollup](https://rollupjs.org/) 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。
  - vite 利用浏览器原生支持 ESM，省略了对模板的打包过程，这和 webpack 完全不同，所以在初次启动是非常的快的。
  - 在更新时，由于浏览器原生支持 ESM，也不需要打包，所以对 HRM 也是非常的友好。
  - 在 vite 开发模式下，在服务端完成模块的改写和请求处理，将业务代码中的 import 第三方依赖路径转为浏览器可识别的依赖路径，对 .ts、.vue 等文件进行即时编译，对 Sass/Less 的需要预编译的模块进行编译，浏览器端建立 socket 连接，实现 HMR，实现真正的按需编译。

### **Vite HRM**

 对于 HRM ，不管是 webpack 还是 vite，主要的原理都是通过监听模块内容的变动来响应浏览器。而 vite 的 HMR 特性，可总结为三步：

1. 启动服务时，通过 watcher 监听文件改动。
2. 模块变动时，通过服务端编译资源，推送新模块内容给浏览器。
3. 浏览器收到新的模块内容，执行框架层面的重渲染。

而这一切的始作俑者就是在 index.html 中有一段引入 /vite/client 代码。进行 WebSocket 的注册和监听。

### **预构建**

首次启动 vite 时，vite 会将预构建的依赖缓存到 node_modules/.vite

- package.json 中的 dependencies 列表
- 包管理器的 lockfile，例如 package-lock.json, yarn.lock，或者 pnpm-lock.yaml
- 可能在 vite.config.js 相关字段中配置过的

只有在上述其中一项发生更改时，才需要重新运行预构建。

### 预构建过程其实有两个目的

- CommonJS 和 UMD 兼容性: 开发阶段中，Vite 的开发服务器将所有代码视为原生 ES 模块。因此，Vite 必须先将作为 CommonJS 或 UMD 发布的依赖项转换为 ESM。
- 性能： Vite 将有许多内部模块的 ESM 依赖关系转换为单个模块，以提高后续页面加载性能。

## 配置

vite中可以将配置文件进行拆分，例如抽离成公有的viteBaseConfig文件、开发下特有的viteDevConfig、生产环境下的viteProConfig等等，然后根据当前环境返回不同是配置对象即可。

```javascript
const envResolver = {
  "dev":()=>Object.assign({},viteBaseConfig,viteDevConfig),
  "serve":()=>Object.assign({},viteBaseConfig,viteProConfig)
}

export default defineConfig(({command})=>{
  return envResolver[command]()
})
```

### 环境变量配置

会根据代码环境匹配对应值的变量。例如常说的开发环境、生产环境、测试环境等等。我们通常把api地址等这种需要跟环境匹配的值，在不同的环境变量中设置好，后续就不需要频繁的去修改了。

- env: 所有环境都需要用到的环境变量
- env.development: 开发环境需要用到的环境变量(默认情况下vite将我们的开发环境取名为development)
- env.production: 生产环境需要用到的环境变量(默认情况下vite将我们的生产环境取名为production)
- yarn dev --mode development 会将mode设置为development传递进来

vite对环境变量的处理使用到了一个第三方的库dotenv，这个库会自动的读取解析配置文件，将其中的环境变量注入到process对象中。vite在读取配置文件的时候会先使用node来解析，这个process对象可以在这个过程中使用。
需要注意的是在注入的这个过程中是有要求的，不然可能存在冲突，例如直接修改了配置文件路径这种操作。在上面配置拆分的例子中，我们可以在``return envResolver[command]()``的前面使用process对象的，但是这个返回的配置对象中可能会修改配置文件的地址，这会导致在此之前读取的配置文件就没啥用了，不是我们期望的配置文件了。
此时一般我们是知道真正的配置文件在哪的，可以使用vite的loadEnv方法来手动的指定下文件

```javascript
export default defineConfig(({ command, mode }) => {
  // process.cwd()获取当前node执行的目录
  // 如果想获取当前文件所在目录可以使用__dirname
 const env = loadEnv(mode, process.cwd());
 console.log(env);
  return envResolver[command]()
});
```

前面是在node中使用，而在我们的web端代码中，vite会将环境对象注入到**import.meta.env**中。并且vite为了不暴露隐私变量，只有使用了VITE前缀的才会自动注入。
可以使用envPrefix配置项来改变默认前缀。但是不能设置为空。

### css处理

#### 普通css文件

vite支持对css文件进行处理，但是并不会处理重名覆盖的问题。一般我们可以使用css module(css模块化)来处理。
css文件命名的时候以style.module.css，使用import引入的时候使用一个变量接住，通过变量名点的形式使用。
在vite配置文件中可以通过css属性来配置

```javascript
export default defineConfig(({ command, mode }) => {
 const env = loadEnv(mode, process.cwd());
 console.log(env);
 return {
  css: {
   modules: {
    // 修改生成的配置对象key的展示形式
    localsConvention: "camelCaseOnly",
    // 配置当前模块化行为是模块化还是全局化。local表示开启模块化
    scopeBehaviour: "local",
    // 配置名称生成的规则 也可以是函数返回规则即可
    generateScopedName: "[name]_[local]_[hash:5]",
    // 添加到hash生成中的自定义的字符串
    hashPrefix: "",
    // 不希望参与到模块化的css文件路径
    globalModulePaths: [],
   },
  },
 };
});

```

#### css预处理器

```javascript
export default defineConfig(({ command, mode }) => {
 const env = loadEnv(mode, process.cwd());
 console.log(env);
 return {
  css: {
   modules: {
   },
      preprocessorOptions: {
    // key value形式 key代表预处理器的名
    less: {
     // 整个配置对象都会给到less的执行参数（全局参数）中去
     globaVars: {
      // 全局变量
     },
    },
    // scss: {}
   },
  },
 };
});

```

#### css文件索引

```javascript
export default defineConfig(({ command, mode }) => {
 const env = loadEnv(mode, process.cwd());
 console.log(env);
 return {
  css: {
   modules: {
   },
      preprocessorOptions: {
   },
      // 开启css的文件索引
      devSourcemap:true
  },
 };
});

```

#### postcss

PostCSS是一个通过JS插件转换样式的工具。这些插件可以检查CSS，支持变量和混入、转译兼容性不好的 CSS 语法、内联图像等等。
如果要使用postcss需要安装**npm i postcss -D，**并且在根目录创建一个配置文件**postcss.config.js**
postcss有很多插件，实现了跟多功能，我们使用一般也会基于这些插件进行配置。

##### vite中使用postcss

除了使用配置文件，我们也可以直接在vite的配置文件中直接配置postcss。

```javascript
export default defineConfig(({ command, mode }) => {
 const env = loadEnv(mode, process.cwd());
 console.log(env);
 return {
  css: {
            postcss: {
                plugins: [
                  postcssPresetEnv()
                ],
            },
        },
 };
});

```

### 别名

开发的时候，方便引入资源，可以直接使用别名指向一个目录。底层原理其实就是字符串的替换，在后续浏览器请求的时候，vite会根据配置项进行替换，最终输出的的路径是相对项目的路径。

```javascript
export default defineConfig(({ command, mode }) => {
 const env = loadEnv(mode, process.cwd());
 console.log(env);
 return {
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
   },
 };
});

```

### 静态资源处理

#### public 目录

如果你有下列这些资源：

- 不会被源码引用（例如 robots.txt）
- 必须保持原有文件名（没有经过 hash）
- ...或者你压根不想引入该资源，只是想得到其 URL。

那么你可以将该资源放在指定的 public 目录中，它应位于你的项目根目录。该目录中的资源在开发时能直接通过 / 根路径访问到，并且打包时会被完整复制到目标目录的根目录下。
目录默认是 `<root>/public`，但可以通过 [publicDir选项](https://cn.vitejs.dev/config/shared-options.html#publicdir) 来配置。

- 引入 public 中的资源永远应该使用根绝对路径 —— 举个例子，public/icon.png 应该在源码中被引用为 /icon.png。
- public 中的资源不应该被 JavaScript 文件引用。

#### src/assets 目录

引用的资源作为构建资源图的一部分包括在内，将生成散列文件名，并可以由插件进行处理以进行优化。

#### baseUrl

配置资源路径，有时候我们打包之后发布到线上，不一定就是在根目录的，可能在不同的目录，这时候就需要设置下避免出现找不到资源的问题。

### build配置

vite的打包是使用的rollup。

```javascript
export default defineConfig(({ command, mode }) => {
 const env = loadEnv(mode, process.cwd());
 console.log(env);
 return {
  
 };
});

```

### 插件

在整个vite执行生命周期的不同阶段中去调用不同的插件以达到不同的目的。除了官方提供的插件外，社区也提供了很多插件。

```javascript
export default defineConfig(({ command, mode }) => {
 const env = loadEnv(mode, process.cwd());
 console.log(env);
 return {
    // 插件配置在这
  plugins:[
      
    ]
 };
});

```

#### 关于自定义插件

vite插件需要返回一个配置对象给vite，一般使用函数的形式调用，这样可以方便自定义。因为vite打包使用的rollup，所以除了vite提供的特有的钩子函数外，还支持rollup的钩子函数。

### TypeScript支持

vite他天生就对ts支持非常良好, 因为vite在开发时态是基于esbuild, 而esbuild是天生支持对ts文件的转换的。
关于ts的校验就需要使用插件了例如：vite-plugin-eslint

#### vite-env.d.ts

一个 TypeScript 类型定义文件，用于在 Vite 项目中定义环境变量类型。

```typescript
declare global {  
  interface ImportMetaEnv {  
    VITE_APP_TITLE: string;  
    VITE_APP_DESCRIPTION: string;  
    VITE_APP_VERSION: string;  
    // 其他环境变量...  
  }  
}
```

```typescript
const appTitle = import.meta.env.VITE_APP_TITLE;  
const appDescription = import.meta.env.VITE_APP_DESCRIPTION;  
const appVersion = import.meta.env.VITE_APP_VERSION;
```

通过使用 vite-env.d.ts 文件，我们可以确保这些环境变量的类型正确，并且在代码编辑器中也能够得到自动补全功能。

### 跨域

vite自带开发式的跨域支持，需要手动配置下。本质是vite服务器给做了分发处理。

```javascript
export default defineConfig(({ command, mode }) => {
 return {
  // 开发服务器的配置
  server: {
   proxy: {
    // key + 描述对象；key表示要代理的请求以这个key开头
    "/api": {
     // 要代理转发到的地址
     target: "http://192.168.3.100:31415/",
     // 请求源更改为target
     changeOrigin: true,
     // 是否要重写路径
     rewrite: (path) => path.replace(/^\/api/, ""),
    },
   },
  },
 };
});

```
