# 常见配置

## 初始化

```bash
npm init -y # 初始化npm配置⽂件
npm install --save-dev webpack # 安装核⼼库
npm install --save-dev webpack-cli # 安装命令⾏⼯具
```

可以配置`.npmrc`设置源

## 样式处理

### 集成css样式处理：css-loader style-loader

`npm install style-loader css-loader -D`

### 集成less sass

不要使用node-sass
`npm install sass sass-loader -D`
`npm install less less-loader -D`

### 集成postcss

相当于babel于JS。postcss主要功能只有两个：第⼀就是把css解析成JS可以操作的抽象语法树AST，第⼆就是调⽤插件来处理AST并得到结果；所以postcss⼀般都是通过插件来处理css，并不会直接处理。比如

- ⾃动补⻬浏览器前缀: autoprefixer
- css压缩等 cssnano

`npm install postcss postcss-loader autoprefixer cssnano -D`

```javascript
module.exports = {
  plugins: [require("autoprefixer"), require("cssnano")],
};
```

### 经过如上⼏个loader处理，css最终是打包在js中的，运⾏时会动态插⼊head中，但是我们⼀般在⽣产环境会把css⽂件分离出来（有利于⽤户端缓存、并⾏加载及减⼩js包的⼤⼩），这时候就⽤到 `mini-css-extract-plugin` 插件

`npm install mini-css-extract-plugin -D`

### [Browserslist](https://github.com/browserslist/browserslist)

**browserslist 实际上就是声明了⼀段浏览器的集合，我们的⼯具可以根据这段集合描述，针对性的输出兼容性代码。**Browserslist 被⼴泛的应⽤到 Babel、postcss-preset-env、autoprefixer 等开发⼯具上。
Browserslist 的配置可以放在 package.json 中，也可以单独放在配置⽂件 .browserslistrc 中。所有的⼯具都会主动查找 browserslist 的配置⽂件，根据 browserslist 配置找出对应的⽬标浏览器集合。

#### 手动检测

`npx browserslist "last 1 version, >1%"`

#### 在package.json 中的配置是增加⼀个 browserslist 数组属性

```bash
{
 "browserslist": ["last 2 version", "> 1%", "maintained node versions", "not ie < 11"] 
}
```

#### 或者在项⽬的根⽬录下创建⼀个 .browserslistrc ⽂件

```bash
# 注释是这样写的，以#号开头
# 每⾏⼀个浏览器集合描述
last 2 version
> 1%
maintained node versions
not ie < 11
```

## 图⽚/字体⽂件处理

### [资源模块类型（asset module type）](https://webpack.docschina.org/guides/asset-modules/)

通过添加 4 种新的模块类型，来替换所有这些 loader：

- `asset/resource` 发送一个单独的文件并导出 URL。之前通过使用 `file-loader` 实现。
- `asset/inline` 导出一个资源的 data URI。之前通过使用 `url-loader` 实现。
- `asset/source` 导出资源的源代码。之前通过使用 raw-loader 实现。
- `asset` 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现。

## html⻚⾯处理

htmlwebpackplugin会在打包结束后，⾃动⽣成⼀个html⽂件，并把打包⽣成的js模块引⼊到该html中。
`npm install --save-dev html-webpack-plugin`

## 清空dist

**clean-webpack-plugin**:如何做到dist⽬录下某个⽂件或⽬录不被清空：
使⽤配置项:`cleanOnceBeforeBuildPatterns`
`cleanOnceBeforeBuildPatterns: ["/*", "!dll", "!dll/"]`！感叹号相当于exclude 排除，意思是清空操作排除dll⽬录，和dll⽬录下所有⽂件。 注意：数组列表⾥的“*/”是默认值，不可忽略，否则不做清空操作。
`npm install --save-dev clean-webpack-plugin`

## [sourceMap](https://www.webpackjs.com/configuration/devtool/)

源代码与打包后的代码的映射关系，通过sourceMap定位到源代码。在dev模式中，默认开启，关闭的话 可以在配置⽂件⾥配置[devtool](https://webpack.js.org/configuration/devtool#devtool)：`devtool:"none"`

- eval:速度最快,使⽤eval包裹模块代码,
- source-map： 产⽣ .map ⽂件
- cheap:较快，不包含列信息
- Module：第三⽅模块，包含loader的sourcemap（⽐如jsx to js ，babel的sourcemap）
- inline： 将 .map 作为DataURI嵌⼊，不单独⽣成 .map ⽂件

```bash
// 开发环境配置 下面是官网的字段顺序但是 这个例子 报错 得用eval-cheap-module-source-map 原因未知
devtool:"cheap-module-eval-source-map",
//线上不推荐开启
devtool:"cheap-module-source-map", // 线上⽣成配置
```

## WebpackDevServer

`npm install webpack-dev-server -D`
修改下package.json

```javascript
"scripts": {
 "server": "webpack serve"
 },
```

在webpack.config.js配置

```javascript
devServer: {
    static: "./dist",
    open: true,
    port: 8081,
    proxy: {
      "/api": {
        target: "http://localhost:9092",
      },
    },
}
```

启动服务后，会发现dist⽬录没有了，这是因为devServer把打包后的模块不会放在dist⽬录下，⽽是放到内存中，从⽽提升速度

## Hot Module Replacement (HMR:热模块替换)

- css模块HMR JS模块HMR
- 不⽀持抽离出的css 我们要使⽤style-loader
启动hmr

```js
devServer: {
    static: "./dist",
    open: true,
    port: 8081,
    //实例所使用的版本已经不需要手动配置默认开启
    // hot:true,
    //即便HMR不⽣效，浏览器也不⾃动刷新，就开启hotOnly jshmr使用
    // hotOnly:true,
    proxy: {
      "/api": {
        target: "http://localhost:9092",
      },
    },
}
```

配置⽂件头部引⼊webpack
`const webpack = require("webpack");`
在插件配置处添加

```js
new webpack.HotModuleReplacementPlugin()
```

### 处理css模块HMR

注意启动HMR后，**css抽离会不⽣效**，还有不⽀持contenthash，chunkhash

### 处理js模块HMR

#### 原理

**关闭浏览器刷新hotOnly:true,再使⽤module.hot.accept来观察模块更新 从⽽更新**

```js
if(module.hot){
  module.hot.accept('模块路径',()=>{
    // 通过id找到对应模块
    //移除
    //重新执行
  })
}
```

#### [其他代码和框架](https://webpack.docschina.org/guides/hot-module-replacement/#other-code-and-frameworks)

常用的vue、react对应的loader都已经提供相应的功能

## Babel处理js语法和特性问题

Babel在执⾏编译的过程中，会从项⽬根⽬录下的 .babelrc⽂件中读取配置。没有该⽂件会从loader的options地⽅读取配置。

### @babel/plugin-transform-runtime

`npm install --save-dev @babel/plugin-transform-runtime babel-loader @babel/core @babel/preset-env`
`npm install --save @babel/runtime @babel/runtime-corejs3`

```js
{
  "presets": [
      [
          "@babel/preset-env"
      ]
  ],
  "plugins": [
      [
        "@babel/plugin-transform-runtime",
        {
          "corejs": 3 // 指定 runtime-corejs 的版本，目前有 2 3 两个版本
        }
      ]
  ]
}
```

## 优化

要优化构建过程，可以从减少查找过程、多线程、提前编译和 Cache 多个⻆度来优化。

### 优化loader查找范围

- test include exclude三个配置项来缩⼩loader的处理范围
- 推荐include

```js
//string
include: path.resolve(__dirname, "./src"),
//array
include: [
  path.resolve(__dirname, 'app/styles'),
  path.resolve(__dirname, 'vendor/styles')
]
```

exclude 优先级要优于 include 和 test ，所以当三者配置有冲突时， exclude 会优先于其他两个配置。

### 优化resolve.modules配置

resolve.modules⽤于配置webpack去哪些⽬录下寻找第三⽅模块，默认是['node_modules'],如果没有找到，就会去上⼀级⽬录../node_modules找，再没有会去../../node_modules中找，以此类推，和Node.js的模块寻找机制很类似。
如果我们的第三⽅模块都安装在了项⽬根⽬录下，就可以直接指明这个路径。

```js
module.exports={
  resolve:{
    modules: [path.resolve(__dirname, "./node_modules")]
  }
}
```

### 优化resolve.alias配置

resolve.alias配置通过别名来将原导⼊路径映射成⼀个新的导⼊路径

```js
resolve: {
  alias: {
    "@assets": path.resolve(__dirname, "../src/images/"),
  },
},

//html-css中使⽤ 如果路径以~开头，其后的部分将会被看作模块依赖
.sprite3 {
  background: url("~@assets/s3.png");
}
```

### 优化resolve.extensions配置

resolve.extensions在导⼊语句没带⽂件后缀时，webpack会⾃动带上后缀后，去尝试查找⽂件是否存在。

```js
extensions:['.js','.json','.jsx','.ts']
```

- 后缀尝试列表尽量的⼩
- 导⼊语句尽量的带上后缀。

### 利⽤多线程提升构建速度

#### thread-loader

thread-loader 是针对 loader 进⾏优化的，它会将 loader 放置在⼀个 worker 池⾥⾯运⾏，以达到多线程构建。
thread-loader 在使⽤的时候，需要将其放置在其他 loader 之前

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          'thread-loader'
          // 你的⾼开销的loader放置在此 (e.g babel-loader)
        ]
      }
    ]
  }
};
```

### 缓存cache相关

#### babel-loader

`babel-loader` 提供了 `cacheDirectory` 配置给 Babel 编译时给定的⽬录，并且将⽤于缓存加载器的结果，但是这个设置默认是 false 关闭的状态，我们需要设置为 true ，这样 `babel-loader` 将使⽤默认的缓存⽬录 。
`node_modules/.cache/babel-loader` ，如果在任何根⽬录下都没有找到`node_modules` ⽬录，将会降级回退到操作系统默认的临时⽂件⽬录。

```js
rules: [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
      cacheDirectory: true
    },
  }
];
```

### 使⽤externals优化cdn静态资源

可以将⼀些JS⽂件存储在 CDN 上(减少 Webpack 打包出来的 js 体积)，在 index.html 中通过 标签引⼊

```js
...
<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
...
```

我们希望在使⽤时，仍然可以通过 import 的⽅式去引⽤(如 import $ from 'jquery' )，并且希望webpack 不会对其进⾏打包，此时就可以配置 externals 。

```js
module.exports = {
  //...
  externals: {
    //jquery通过script引⼊之后，全局中即有了 jQuery 变量
    'jquery': 'jQuery'
  }
}
```

### 使⽤静态资源路径publicPath(CDN)

CDN通过将资源部署到世界各地，使得⽤户可以就近访问资源，加快访问速度。要接⼊CDN，需要把⽹⻚的静态资源上传到CDN服务上，在访问这些资源时，使⽤CDN服务提供的URL。

```js
output:{
  publicPath: '//cdnURL.com', //指定存放JS⽂件的CDN地址
}
```

### development vs Production模式区分打包

`npm install webpack-merge -D`
新建三个webpack的配置文件，文件名作如下区分:

- base基础公用的部分
- dev开发配置部分
- prod生产配置部分

```js
const merge = require("webpack-merge")
const commonConfig = require("./webpack.common.js")
const devConfig = {
 ...
}
module.exports = merge(commonConfig,devConfig)
//package.js
"scripts":{
 "dev":"webpack server --config ./build/webpack.dev.js",
 "build":"webpack --config ./build/webpack.prod.js"
}
```

#### 基于环境变量区分

`npm i cross-env -D`

### css压缩

- 借助 css-minimizer-webpack-plugin
- 借助cssnano
在 Webapck 中，`css-loader` 已经集成了 `cssnano`，我们还可以使⽤`optimize-css-assetswebpack-plugin`来⾃定义 `cssnano` 的规则。`css-minimizer-webpack-plugin` 是⼀个 CSS 的压缩插件，默认的压缩引擎就是 `cssnano`。我们来看下怎么在 Webpack 中使⽤这个插件：
`npm install cssnano css-minimizer-webpack-plugin -D`

```js
const OptimizeCSSAssetsPlugin = require("css-minimizer-webpack-plugin");
new OptimizeCSSAssetsPlugin({
  // 引擎默认也是 cssnano
  // 移除所有注释
  minimizerOptions: {
    preset: [
      "default",
      {
        discardComments: { removeAll: true },
      },
    ],
  },
}),
```

`css-minimizer-webpack-plugin` 插件默认的 `cssnano` 配置已经做的很友好了，不需要额外的配置就可以达到最佳效果。

### 压缩HTML

- `html-webpack-plugin`

```js
new htmlWebpackPlugin({
  title: "京东商城",
  template: "./index.html",
  filename: "index.html",
  minify: {
    // 压缩HTML⽂件
    removeComments: true, // 移除HTML中的注释
    collapseWhitespace: true, // 删除空⽩符与换⾏符
    minifyCSS: true // 压缩内联css
  }
}),
```

### 压缩JS(在 mode=production 下，Webpack 会⾃动压缩代码)

可以⾃定义⾃⼰的压缩⼯具，这⾥推荐`terser-webpack-plugin`，使⽤terser来压缩 JavaScript 代码。
webpack v5 开箱即带有最新版本的 terser-webpack-plugin。如果你使用的是 webpack v5 或更高版本，同时希望自定义配置，那么仍需要安装 terser-webpack-plugin。

```js
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ]
  }
};
```

#### Tree-Shaking 也是依赖这个插件

```js
new TerserPlugin({
  extractComments: false,
  //parallel: true // 多线程
  terserOptions: {
    // format: {
    // },
    output: {
      // 是否保留代码中的注释，默认为保留，为了达到更好的压缩效果，可以设置为false
      comments: false,
      beautify: false,
    },
    compress: {
      // 删除⽆⽤的代码
      unused: true,
      // 删掉 debugger
      drop_debugger: true, // eslint-disable-line
      // 移除 console
      drop_console: true, // eslint-disable-line
      // 移除⽆⽤的代码
      dead_code: true, // eslint-disable-line
    }
  }
})
```

#### 多线程压缩也是依赖这个插件

```js
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin(
        parallel: true // 多线程
      )
    ]
  }
};
```

### tree Shaking：擦除⽆⽤的JS,CSS

#### Css tree shaking

`npm install glob-all purify-css purgecss-webpack-plugin -D`

```js
const PurifyCSS = require('purgecss-webpack-plugin')
const glob = require('glob-all')

plugins:[
  // 清除⽆⽤ css
  new PurifyCSS({
    paths: glob.sync([
      // 要做 CSS Tree Shaking 的路径⽂件
      // 请注意，我们同样需要对 html ⽂件进⾏ tree shaking
      path.resolve(__dirname, './src/*.html'), 
      path.resolve(__dirname, './src/*.js')
    ])
  })
]
```

#### JS tree shaking

**只⽀持import⽅式引⼊，不⽀持commonjs的⽅式引⼊**
eg:minus会被去掉

```js
//expo.js
export const add = (a, b) => {
  return a + b;
};
export const minus = (a, b) => {
  return a - b;
};
//index.js
import { add } from "./expo";
add(1, 2);
//webpack.config.js
optimization: {
  usedExports: true // 哪些导出的模块被使⽤了，再做打包
}
```

**只要mode是production就会⽣效，develpoment的tree shaking是不⽣效的**
⽣产模式不需要配置，默认开启

### sideEffects 处理副作⽤

```js
//package.json
"sideEffects":false //正常对所有模块进⾏tree shaking , 仅⽣产模式有效，需要配合usedExports
或者 在数组⾥⾯排除不需要tree shaking的模块
"sideEffects":['*.css','@babel/polyfill']
```

### 代码分离

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

### 代码分割 code Splitting

- 单⻚⾯应⽤spa
  - 打包完后，所有⻚⾯只⽣成了⼀个bundle.js
  - 代码体积变⼤，不利于下载
  - 没有合理利⽤浏览器资源
- 多⻚⾯应⽤mpa
  - 如果多个⻚⾯引⼊了⼀些公共模块，那么可以把这些公共的模块抽离出来，单独打包。公共代码只需要下载⼀次就缓存起来了，避免了重复下载。

[SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/)

```js
optimization: {
  splitChunks: {
    chunks: 'async',//对同步 initial，异步 async，所有的模块有效 all
    minSize: 30000,//最⼩尺⼨，当模块⼤于30kb
    maxSize: 0,//对模块进⾏⼆次分割时使⽤，不推荐使⽤
    minChunks: 1,//打包⽣成的chunk⽂件最少有⼏个chunk引⽤了这个模块（满足就分割）
    maxAsyncRequests: 5,//（按需加载）最⼤异步请求数，默认5
    maxInitialRequests: 3,//最⼤初始化请求书，⼊⼝⽂件同步请求，默认3
    automaticNameDelimiter: '-',//打包分割符号
    name: true,//打包后的名称，除了布尔值，还可以接收⼀个函数function
    cacheGroups: {//缓存组，哪些模块要打包到一个组
      vendors: {//组名
        test: /[\\/]node_modules[\\/]/,//需要打包一起的模块
        name:"vendor", // 要缓存的 分隔出来的 chunk 名称
        priority: -10,//缓存组优先级 数字越⼤，优先级越⾼
    reuseExistingChunk: true//如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      },
      other:{
        // 必须三选⼀： "initial" | "all" | "async"(默认就是async)
        chunks: "initial", 
        // 正则规则验证，如果符合就提取 chunk,
        test: /react|lodash/, 
        name:"other",
        minSize: 30000,
        minChunks: 1,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true//可设置是否重⽤该chunk
      }
    }
  }
}
```

一般不会设置那么多参数：

```js
optimization:{
  //帮我们⾃动做代码分割
  splitChunks:{
    chunks:"all",//默认是⽀持异步，我们使⽤all
  }
}
```

### Scope Hoisting

作⽤域提升（Scope Hoisting）是指 webpack 通过 ES6 语法的静态分析，分析出模块之间的依赖关系，尽可能地把模块放到同⼀个函数中。
eg:

```js
// hello.js
export default 'Hello, Webpack';
// index.js
import str from './hello.js';
console.log(str);
// 默认配置这两个js文件会分开
// 通过下面配置后这两个js文件的内容会合并在⼀起
// webpack.config.js
module.exports = {
  optimization: {
    concatenateModules: true
  }
};
```

### 使⽤⼯具量化

#### `speed-measure-webpack-plugin`:可以测量各个插件和 loader 所花费的时间

```js
npm i speed-measure-webpack-plugin -D
//webpack.config.js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const config = {
 //...webpack配置
}
module.exports = smp.wrap(config);
```

#### `webpack-bundle-analyzer`:分析webpack打包后的模块依赖关系

```js
npm install webpack-bundle-analyzer -D
const BundleAnalyzerPlugin = require('webpack-bundleanalyzer').BundleAnalyzerPlugin;
module.exports = merge(baseWebpackConfig, {
  //....
  plugins: [
    //...
    new BundleAnalyzerPlugin(),
  ]
})
```

## 规范

- [husky](https://typicode.github.io/husky/#/?id=manual)
  - commit-msg
  - pre-commit
  - pre-push
  - 如果将 husky 安装在另一个目录中，需要[自定义](https://typicode.github.io/husky/#/?id=custom-directory)目录
- [commitizen](https://github.com/commitizen/cz-cli)
  - 规范提交信息
    - 可以不用这个工具，有提交信息校验就可以了
  - 采用项目局部安装，也可以全局
  - `npm install commitizen cz-conventional-changelog -D`
  - 然后修改配置文件
    - 新增config->commitizen
      - `"path": "cz-conventional-changelog"`
      - 可以设置中文翻译对应的选项
    - scripts
      - `"commit": "cz"`
  - 项目内安装，只能在当前项目目录下 npm run commit 代替 git commit
- [commitlint](https://commitlint.js.org/#/)
  - 对提交信息校验
  - 新增commitlint.config.js
  - 可以删除config->commitizen
- [lint-staged](https://github.com/okonet/lint-staged)
  - 校验修改的那部分文件
  - `npx mrm@2 lint-staged`
  - 修改配置文件

```js
"lint-staged": {
    "src/**/*.scss": [
      "stylelint --fix"
    ],
    "src/**/*.{js,vue,ts,tsx}": "eslint --fix"
}
```

- [standard-version](https://github.com/conventional-changelog/standard-version)
  - CHANGELOG 自动生成
  - 配置：versionrc.js
  - 目前官方推荐[release-please](https://github.com/googleapis/release-please)代替standard-version
- [prettier](https://prettier.io/docs/en/install.html)
- [eslint](https://eslint.org/)
- [stylelint](https://stylelint.io/user-guide/get-started)

### husky

**安装husky**`npm install husky --save-dev`
**启用 Git 挂钩,生成一个.kusky文件夹**`npx husky install`
**在.husky文件夹内创建commit-msg文件**

```bash
#!/bin/sh
npx --no-install commitlint --edit "$1"
```

### commitlint

**安装**`npm install -g @commitlint/cli @commitlint/config-conventional`
**新增commitlint.config.js**

- feat: 一项新功能
- fix: 一个错误修复
- docs: 仅文档更改
- style: 不影响代码含义的更改（空白，格式，缺少分号等）
- refactor: 既不修正错误也不增加功能的代码更改（重构）
- perf: 改进性能的代码更改
- test: 添加缺失或更正现有测试
- build: 影响构建系统或外部依赖项的更改（gulp，npm等）
- ci: 对CI配置文件和脚本的更改
- chore: 更改构建过程或辅助工具和库，例如文档生成

```js
const types = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'release', 'chore', 'revert'];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', types],
    'scope-case': [0, 'always'],
    'subject-empty': [2, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [2, 'always', 88],
  },
};
```

### lint-staged

**安装husky**`npm install -D lint-staged`
**package.json**

```js
"lint-staged": {
  "src/**/*.scss": [
    "stylelint --fix"
  ],
  "src/**/*.{js,vue,ts,tsx}": [
    "npm run lint"
  ]
}
```

**在.kusky文件夹内创建pre-commit文件**

```bash
#!/bin/sh
npx --no-install lint-staged 
npm run lint
```

### standard-version

**安装**`npm i -D standard-version`
**package.json**

```js
{
  "scripts": {
    "release": "standard-version"
  }
}
```

**.husky/pre-push**

```bash
#!/bin/sh

npm run release
```

**自定义配置不同类型对应显示文案,在根目录新建 versionrc.js**

```js
module.exports = {
    "types": [
        { "type": "chore", "section": "Others", },
        { "type": "revert", "section": "Reverts", },
        { "type": "feat", "section": "Features", },
        { "type": "fix", "section": "Bug Fixes", },
        { "type": "improvement", "section": "Feature Improvements", },
        { "type": "docs", "section": "Docs", },
        { "type": "style", "section": "Styling", },
        { "type": "refactor", "section": "Code Refactoring", },
        { "type": "perf", "section": "Performance Improvements", },
        { "type": "test", "section": "Tests", },
        { "type": "build", "section": "Build System", },
        { "type": "ci", "section": "CI", }
    ]
}
```

### prettier

**安装**`npm install prettier -D`
**创建配置文件.prettierrc**

```js
{
  // 大括号内的首尾需要空格
  "bracketSpacing": true,
  // jsx 标签的反尖括号需要换行
  "jsxBracketSameLine": true,
  // jsx 使用单引号代替双引号
  "jsxSingleQuote": false,
  // 一行最多 100 字符
  "printWidth": 140,
  // 行尾需要有分号
  "semi": true,
  // 关闭 tab 缩进
  "useTabs": false,
  // 末尾不需要逗号 <es5|none|all>
  "trailingComma": "es5",
  // jsx 使用单引号代替双引号
  "singleQuote": true,
  // 使用 2个tab 缩进
  "tabWidth": 2,
  // 换行符使用 lf 结尾  <lf|crlf|cr|auto>
  "endOfLine": "auto",
  // 使用默认的折行标准
  "proseWrap": "preserve"
  // 对象key是否使用引号 <as-needed|consistent|preserve>
  // as-needed 仅在需要的时候使用
  // consistent 有一个属性需要引号，就都需要引号
  // preserve 保留用户输入的情况
  quoteProps: 'preserve',
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号 <always|avoid>
  arrowParens: 'avoid',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier 用于逐步过渡大型项目中未被格式化的代码标识
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier 用于逐步过渡大型项目中未被格式化的代码标识
  insertPragma: false,
  // 根据显示样式决定 html 要不要折行 <css|strict|ignore>"
  htmlWhitespaceSensitivity: 'css',
  //控制是否 prettier 格式的引用代码嵌入在文件中。
  embeddedLanguageFormatting: 'off',
}
```

**忽略代码.prettierignore**

```bash
# Ignore artifacts:
build
coverage

# Ignore all HTML files:
*.html
```

**eslint-config-prettier**可以关闭所有不必要或可能与Prettier冲突的规则。

```bash
// .eslintrc.js
"extends": [
 "prettier"
],
```

### eslint

**安装**`npm install eslint --save-dev`
[**.eslintrc.js**](https://cn.eslint.org/docs/rules/)

```js
module.exports = {
 "env": {
  "browser": true,
  "es2021": true
 },
 "extends": [
  "eslint:recommended",
  "plugin:@typescript-eslint/recommended"
 ],
 "parser": "@typescript-eslint/parser",
 "parserOptions": {
  "ecmaVersion": 13,
  "sourceType": "module"
 },
 "plugins": [
  "@typescript-eslint"
 ],
 "rules": {
  "indent":[
   "warn",
   "tab"
  ],
  "semi": [
   "error",
   "never"
  ],
  "no-unused-vars":1,
  "quotes": [1, "double"],
  "@typescript-eslint/no-explicit-any": ["off"]
 },
 "globals": {
  "window": true
 }
}
```

**.eslintignore**排除目标

```bash
node_modules/*
node_modules
.DS_Store
dist
dist-ssr
*.local
lib
build
```

### stylelint

**安装**`npm install --save-dev stylelint stylelint-config-standard`
**在项目的根目录中创建一个配置文件.stylelintrc.json**

```js
{
    "extends": [
      //stylelint-config-recommended - 只打开避免错误的规则
      //stylelint-config-standard - 通过打开强制约定的规则扩展推荐的一个
        "stylelint-config-standard",
        "stylelint-config-recommended-scss"
    ],
    "plugins": [
        "stylelint-scss"
    ],
    "rules": {
        "string-quotes": "single",
        "property-no-unknown": true,
        "selector-pseudo-class-no-unknown": true,
        "at-rule-empty-line-before": ["always",{
            "except":["blockless-after-same-name-blockless","first-nested","inside-block"],
            "ignore": ["after-comment", "first-nested"]
        }],
        "rule-empty-line-before":["always",{
            "except": [ "after-single-line-comment",  "first-nested"]
        }],
        "block-no-empty": true,
        "selector-pseudo-element-no-unknown": [
            true,
            {
                "ignorePseudoElements": [
                    "ng-deep"
                ]
            }
        ],
        "selector-type-no-unknown": [
            true,
            {
                "ignoreTypes": [
                    "/^d-/"
                ]
            }
        ],
        "color-hex-length": "long",
        "no-descending-specificity": null,
        "font-family-no-missing-generic-family-keyword": null,
        "no-duplicate-selectors": null,
        "declaration-block-no-duplicate-properties": [
            true,
            {
                "ignore": [
                    "consecutive-duplicates"
                ]
            }
        ]
    }
}
```
