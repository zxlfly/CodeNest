# 优化总结

- **Webpack中设置exclude、 include来指定loader路径**
- **resolve.modules配置webpack去寻找第三⽅模块的目录**
- **开启babel-loader的cacheDirectory提升速度；**
- **使用terser-webpack-plugin压缩开启多线程和缓存设置，删除无用代码和console；**
- **使用 purifycss对css做tree shaking；**
- **设置optimization的usedExports为true对通过import方式引入的js做tree shaking；**
- **使用webpack-merge将配置文件分成基础、开发和生产三部分易于管理**
- **作⽤域提升（Scope Hoisting）是指 webpack 通过 ES6 语法的静态分析，分析出模块之间的依赖关系，尽可能地把模块放到同⼀个函数中。**

## Babel（工具集）

Babel 是一个工具链，主要用于将采用 ECMAScript 2015+ 语法编写的代码转换为向后兼容的 JavaScript 语法

- @babel/preset-env
  - targets设置目标浏览器集合，会适配目标支持的js
  - corejs指定codejs版本
  - useBuiltIns设置如果配置babel/polyfill
- @babel/polyfill
  - 直接使用的话，最新的特性用不了，内部依赖的core不是最新的，可以通过配置@babel/preset-env改变依赖corejs的版本，新版本需要安装
- @babel/plugin-transform-runtime这种方法需要安装
`@babel/runtime`、
`@babel/plugin-transform-runtime`、
`@babel/runtime-corejs3`
  - 默认情况下**transform-runtime**是不开启core-js的polyfill处理，安装`@babel/runtime`就够了。
  - 如果需要开启，得使用@babel/runtime另外的版本`@babel/runtime-corejs3`
    - 然后在选项中指定版本

### **plugin-transform-runtime** 主要做了三件事

- 当开发者使用异步或生成器的时候，自动引入@babel/runtime/regenerator，开发者不必在入口文件做额外引入；
- 动态引入 polyfill，提供沙盒环境，避免全局环境的污染；
- 如果直接导入 core-js 或 @babel/polyfill 以及它提供的 Promise、Set 和 Map 等内置组件，这些都会污染全局。虽然这不影响应用程序或命令行工具，但如果代码是要发布给其他人使用的库，或者无法准确控制代码将运行的环境，则会出现问题。
- 所有 helpers 帮助模块都将引用模块 @babel/runtime，以避免编译输出中的重复，减小打包体积；

### useBuiltIns

控制preset使用何种方式帮我们导入polyfill的核心，有三种参数

- `entry`: 需要在 webpack 的⼊⼝⽂件⾥ import "@babel/polyfill" ⼀次。 babel 会根据你的使⽤情况导⼊垫⽚，没有使⽤的功能不会被导⼊相应的垫⽚。
- `usage`: 不需要import ，全⾃动检测，但是要安装 @babel/polyfill 。（试验阶段）
- `false`: 如果你 import"@babel/polyfill" ，它不会排除掉没有使⽤的垫⽚，程序体积会庞⼤。(不推荐)

## 代码分离

把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级

- **入口起点**：使用 [entry](https://www.webpackjs.com/configuration/entry-context) 配置手动地分离代码。
  - [dependOn](https://www.webpackjs.com/configuration/entry-context/#dependencies)来配置依赖，在多个 chunk 之间共享模块，共享模块在入口配置即可

- **防止重复**：使用 [Entry dependencies](https://www.webpackjs.com/configuration/entry-context/#dependencies) 或者 [SplitChunksPlugin](https://www.webpackjs.com/plugins/split-chunks-plugin) 去重和分离 chunk
   -

- **动态导入**：通过模块的内联函数调用来分离代码。
  - [import()语法](https://www.webpackjs.com/api/module-methods/#import-1) 来实现动态导入
    - 在函数中import
  - webpack 特定的 [require.ensure](https://www.webpackjs.com/api/module-methods/#requireensure)
  - 懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载
  - 预获取/预加载模块(prefetch/preload module)
    - import中可以用注释的形式配置/*webpackPrefetch: true*/
    - **prefetch**(预获取)：将来某些导航下可能需要的资源
      - prefetch chunk 会在父 chunk 加载结束后开始加载。
    - **preload**(预加载)：当前导航下可能需要资源
      - preload chunk 会在父 chunk 加载时，以并行方式开始加载
    - preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载。
    - preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会用于未来的某个时刻。
